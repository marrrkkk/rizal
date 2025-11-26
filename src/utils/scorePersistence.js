// Score persistence utilities for SQLite database
// Handles saving and retrieving final scores

import {
  initDatabase,
  executeQuery,
  executeQueryOne,
  executeUpdate,
  saveDatabase,
} from "./database.js";
import { updateUserStatistics } from "./statisticsManager.js";
import { unlockNextLevel } from "./levelUnlocking.js";

/**
 * Save final score to database
 * Updates the user_progress table with the final score
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @param {number} finalScore - Calculated final score
 * @param {Object} additionalData - Additional data to save
 * @param {number} additionalData.attempts - Number of attempts
 * @param {number} additionalData.hintsUsed - Number of hints used
 * @returns {Promise<Object>} Result object with success status
 */
export const saveFinalScore = async (
  userId,
  chapterId,
  levelId,
  finalScore,
  additionalData = {}
) => {
  try {
    // Ensure database is initialized
    await initDatabase();

    const { attempts = 1, hintsUsed = 0 } = additionalData;

    // Check if progress record exists
    const existing = executeQueryOne(
      `SELECT id, score FROM user_progress 
       WHERE user_id = ? AND chapter_id = ? AND level_id = ?`,
      [userId, chapterId, levelId]
    );

    if (existing) {
      // Update existing record
      executeUpdate(
        `UPDATE user_progress 
         SET final_score = ?,
             is_completed = 1,
             completion_date = CURRENT_TIMESTAMP,
             attempts = ?,
             hints_used = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND chapter_id = ? AND level_id = ?`,
        [finalScore, attempts, hintsUsed, userId, chapterId, levelId]
      );
    } else {
      // Insert new record
      executeUpdate(
        `INSERT INTO user_progress 
         (user_id, chapter_id, level_id, score, final_score, is_completed, 
          is_unlocked, completion_date, attempts, hints_used)
         VALUES (?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP, ?, ?)`,
        [
          userId,
          chapterId,
          levelId,
          finalScore,
          finalScore,
          attempts,
          hintsUsed,
        ]
      );
    }

    saveDatabase();

    // Update user statistics after saving score
    await updateUserStatistics(userId);

    // Unlock next level after successful completion
    const unlockResult = await unlockNextLevel(userId, chapterId, levelId);

    return {
      success: true,
      message: "Final score saved successfully",
      data: { userId, chapterId, levelId, finalScore },
      unlockResult,
    };
  } catch (error) {
    console.error("Error saving final score:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to save final score",
    };
  }
};

/**
 * Get final score for a specific level
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @returns {Promise<number|null>} Final score or null if not found
 */
export const getFinalScore = async (userId, chapterId, levelId) => {
  try {
    await initDatabase();

    const result = executeQueryOne(
      `SELECT final_score FROM user_progress 
       WHERE user_id = ? AND chapter_id = ? AND level_id = ?`,
      [userId, chapterId, levelId]
    );

    return result ? result.final_score : null;
  } catch (error) {
    console.error("Error getting final score:", error);
    return null;
  }
};

/**
 * Get all final scores for a user
 *
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of score records
 */
export const getAllFinalScores = async (userId) => {
  try {
    await initDatabase();

    const results = executeQuery(
      `SELECT chapter_id, level_id, final_score, completion_date, attempts, hints_used
       FROM user_progress 
       WHERE user_id = ? AND is_completed = 1
       ORDER BY chapter_id, level_id`,
      [userId]
    );

    return results;
  } catch (error) {
    console.error("Error getting all final scores:", error);
    return [];
  }
};

/**
 * Get final scores for a specific chapter
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @returns {Promise<Array>} Array of score records for the chapter
 */
export const getChapterFinalScores = async (userId, chapterId) => {
  try {
    await initDatabase();

    const results = executeQuery(
      `SELECT level_id, final_score, completion_date, attempts, hints_used
       FROM user_progress 
       WHERE user_id = ? AND chapter_id = ? AND is_completed = 1
       ORDER BY level_id`,
      [userId, chapterId]
    );

    return results;
  } catch (error) {
    console.error("Error getting chapter final scores:", error);
    return [];
  }
};

/**
 * Get score statistics for a user
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Score statistics
 */
export const getScoreStatistics = async (userId) => {
  try {
    await initDatabase();

    const stats = executeQueryOne(
      `SELECT 
         COUNT(*) as total_completed,
         SUM(final_score) as total_score,
         AVG(final_score) as average_score,
         MAX(final_score) as highest_score,
         MIN(final_score) as lowest_score
       FROM user_progress 
       WHERE user_id = ? AND is_completed = 1`,
      [userId]
    );

    return {
      totalCompleted: stats?.total_completed || 0,
      totalScore: stats?.total_score || 0,
      averageScore: Math.round(stats?.average_score || 0),
      highestScore: stats?.highest_score || 0,
      lowestScore: stats?.lowest_score || 0,
    };
  } catch (error) {
    console.error("Error getting score statistics:", error);
    return {
      totalCompleted: 0,
      totalScore: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
    };
  }
};

/**
 * Update score if new score is higher
 * Only updates if the new final score is better than the existing one
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @param {number} newFinalScore - New final score
 * @param {Object} additionalData - Additional data
 * @returns {Promise<Object>} Result with updated status
 */
export const updateScoreIfHigher = async (
  userId,
  chapterId,
  levelId,
  newFinalScore,
  additionalData = {}
) => {
  try {
    await initDatabase();

    const existing = await getFinalScore(userId, chapterId, levelId);

    if (existing === null || newFinalScore > existing) {
      return await saveFinalScore(
        userId,
        chapterId,
        levelId,
        newFinalScore,
        additionalData
      );
    }

    return {
      success: true,
      message: "Existing score is higher, not updated",
      data: { userId, chapterId, levelId, existingScore: existing },
    };
  } catch (error) {
    console.error("Error updating score:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to update score",
    };
  }
};

/**
 * Delete final score (for testing or admin purposes)
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @returns {Promise<Object>} Result object
 */
export const deleteFinalScore = async (userId, chapterId, levelId) => {
  try {
    await initDatabase();

    executeUpdate(
      `UPDATE user_progress 
       SET final_score = NULL,
           is_completed = 0,
           completion_date = NULL
       WHERE user_id = ? AND chapter_id = ? AND level_id = ?`,
      [userId, chapterId, levelId]
    );

    saveDatabase();

    return {
      success: true,
      message: "Final score deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting final score:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete final score",
    };
  }
};

/**
 * Get progress display data with final scores
 * Returns formatted data for displaying in UI
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Progress data with scores
 */
export const getProgressWithScores = async (userId) => {
  try {
    await initDatabase();

    const results = executeQuery(
      `SELECT 
         chapter_id,
         level_id,
         score,
         final_score,
         is_completed,
         is_unlocked,
         completion_date,
         attempts,
         hints_used
       FROM user_progress 
       WHERE user_id = ?
       ORDER BY chapter_id, level_id`,
      [userId]
    );

    // Group by chapter
    const chapters = {};
    results.forEach((row) => {
      const chapterId = row.chapter_id;
      if (!chapters[chapterId]) {
        chapters[chapterId] = {
          levels: [],
          totalScore: 0,
          completedLevels: 0,
        };
      }

      chapters[chapterId].levels.push({
        levelId: row.level_id,
        score: row.score,
        finalScore: row.final_score,
        isCompleted: row.is_completed === 1,
        isUnlocked: row.is_unlocked === 1,
        completionDate: row.completion_date,
        attempts: row.attempts,
        hintsUsed: row.hints_used,
      });

      if (row.is_completed === 1) {
        chapters[chapterId].totalScore += row.final_score || 0;
        chapters[chapterId].completedLevels += 1;
      }
    });

    return {
      success: true,
      chapters,
    };
  } catch (error) {
    console.error("Error getting progress with scores:", error);
    return {
      success: false,
      error: error.message,
      chapters: {},
    };
  }
};

export default {
  saveFinalScore,
  getFinalScore,
  getAllFinalScores,
  getChapterFinalScores,
  getScoreStatistics,
  updateScoreIfHigher,
  deleteFinalScore,
  getProgressWithScores,
};
