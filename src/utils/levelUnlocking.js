// Level unlocking utilities for sequential progression
// Implements Requirements 9.2, 9.3

import {
  initDatabase,
  executeQuery,
  executeUpdate,
  saveDatabase,
} from "./database.js";

// Chapter configuration
const CHAPTER_CONFIG = {
  1: { totalLevels: 5, name: "Childhood in Calamba" },
  2: { totalLevels: 5, name: "Education in Manila" },
  3: { totalLevels: 5, name: "Studies Abroad" },
  4: { totalLevels: 5, name: "Noli Me Tangere" },
  5: { totalLevels: 5, name: "Return to the Philippines" },
  6: { totalLevels: 5, name: "Exile and Legacy" },
};

/**
 * Unlock the next level in sequence after completing a level
 * Implements sequential level unlocking (Requirement 9.2)
 * Implements chapter unlocking on completion (Requirement 9.3)
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Current chapter ID
 * @param {number} levelId - Current level ID that was just completed
 * @returns {Promise<Object>} Result with unlocked level/chapter information
 */
export const unlockNextLevel = async (userId, chapterId, levelId) => {
  try {
    await initDatabase();

    const chapterConfig = CHAPTER_CONFIG[chapterId];
    if (!chapterConfig) {
      return {
        success: false,
        error: `Invalid chapter ID: ${chapterId}`,
      };
    }

    // Validate that the current level is completed
    const currentLevelQuery = `
      SELECT is_completed 
      FROM user_progress 
      WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    `;
    const currentLevel = executeQuery(currentLevelQuery, [
      userId,
      chapterId,
      levelId,
    ]);

    if (
      !currentLevel ||
      currentLevel.length === 0 ||
      !currentLevel[0].is_completed
    ) {
      return {
        success: false,
        error: "Current level must be completed before unlocking next level",
      };
    }

    const result = {
      success: true,
      nextLevelUnlocked: null,
      nextChapterUnlocked: null,
      chapterCompleted: false,
    };

    // Check if there's a next level in the same chapter
    const nextLevel = levelId + 1;

    if (nextLevel <= chapterConfig.totalLevels) {
      // Unlock next level in same chapter
      // Check if the level already exists in the database
      const existingLevelQuery = `
        SELECT id, is_unlocked FROM user_progress 
        WHERE user_id = ? AND chapter_id = ? AND level_id = ?
      `;
      const existingLevel = executeQuery(existingLevelQuery, [
        userId,
        chapterId,
        nextLevel,
      ]);

      if (existingLevel && existingLevel.length > 0) {
        // Update existing record to unlock it
        const updateQuery = `
          UPDATE user_progress 
          SET is_unlocked = 1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ? AND chapter_id = ? AND level_id = ?
        `;
        executeUpdate(updateQuery, [userId, chapterId, nextLevel]);
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO user_progress 
          (user_id, chapter_id, level_id, is_unlocked, is_completed, score, created_at, updated_at)
          VALUES (?, ?, ?, 1, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        executeUpdate(insertQuery, [userId, chapterId, nextLevel]);
      }

      result.nextLevelUnlocked = {
        chapter: chapterId,
        level: nextLevel,
        chapterName: chapterConfig.name,
      };

      console.log(`✅ Unlocked Chapter ${chapterId}, Level ${nextLevel}`);
    } else {
      // Last level of chapter - check if chapter is complete
      const completedLevelsQuery = `
        SELECT COUNT(*) as completed_count
        FROM user_progress
        WHERE user_id = ? AND chapter_id = ? AND is_completed = 1
      `;
      const completedResult = executeQuery(completedLevelsQuery, [
        userId,
        chapterId,
      ]);
      const completedCount = completedResult[0]?.completed_count || 0;

      if (completedCount >= chapterConfig.totalLevels) {
        result.chapterCompleted = true;

        // Unlock first level of next chapter
        const nextChapter = chapterId + 1;
        const nextChapterConfig = CHAPTER_CONFIG[nextChapter];

        if (nextChapterConfig) {
          // Check if the first level of next chapter already exists
          const existingChapterQuery = `
            SELECT id, is_unlocked FROM user_progress 
            WHERE user_id = ? AND chapter_id = ? AND level_id = 1
          `;
          const existingChapter = executeQuery(existingChapterQuery, [
            userId,
            nextChapter,
          ]);

          if (existingChapter && existingChapter.length > 0) {
            // Update existing record
            const updateQuery = `
              UPDATE user_progress 
              SET is_unlocked = 1, updated_at = CURRENT_TIMESTAMP
              WHERE user_id = ? AND chapter_id = ? AND level_id = 1
            `;
            executeUpdate(updateQuery, [userId, nextChapter]);
          } else {
            // Insert new record
            const insertQuery = `
              INSERT INTO user_progress 
              (user_id, chapter_id, level_id, is_unlocked, is_completed, score, created_at, updated_at)
              VALUES (?, ?, 1, 1, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            executeUpdate(insertQuery, [userId, nextChapter]);
          }

          result.nextChapterUnlocked = {
            chapter: nextChapter,
            level: 1,
            chapterName: nextChapterConfig.name,
          };

          console.log(
            `🎉 Chapter ${chapterId} completed! Unlocked Chapter ${nextChapter}`
          );
        } else {
          console.log(`🏆 All chapters completed!`);
        }
      }
    }

    saveDatabase();
    return result;
  } catch (error) {
    console.error("Error unlocking next level:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if a level is unlocked for a user
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @returns {Promise<boolean>} True if level is unlocked
 */
export const checkLevelUnlocked = async (userId, chapterId, levelId) => {
  try {
    await initDatabase();

    const query = `
      SELECT is_unlocked 
      FROM user_progress 
      WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    `;
    const result = executeQuery(query, [userId, chapterId, levelId]);

    return result && result.length > 0 && result[0].is_unlocked === 1;
  } catch (error) {
    console.error("Error checking level unlock status:", error);
    return false;
  }
};

/**
 * Check if a chapter is unlocked for a user
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @returns {Promise<boolean>} True if chapter is unlocked (has at least one unlocked level)
 */
export const checkChapterUnlocked = async (userId, chapterId) => {
  try {
    await initDatabase();

    const query = `
      SELECT COUNT(*) as unlocked_count
      FROM user_progress 
      WHERE user_id = ? AND chapter_id = ? AND is_unlocked = 1
    `;
    const result = executeQuery(query, [userId, chapterId]);

    return result && result.length > 0 && result[0].unlocked_count > 0;
  } catch (error) {
    console.error("Error checking chapter unlock status:", error);
    return false;
  }
};

/**
 * Validate that a user cannot skip levels
 * Checks if all previous levels are completed
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateLevelAccess = async (userId, chapterId, levelId) => {
  try {
    await initDatabase();

    // First level of first chapter is always accessible
    if (chapterId === 1 && levelId === 1) {
      return {
        valid: true,
        canAccess: true,
        message: "First level is always accessible",
      };
    }

    // Check if level is unlocked
    const isUnlocked = await checkLevelUnlocked(userId, chapterId, levelId);

    if (!isUnlocked) {
      // Find which level needs to be completed
      let requiredChapter = chapterId;
      let requiredLevel = levelId - 1;

      if (requiredLevel < 1) {
        // Need to complete previous chapter
        requiredChapter = chapterId - 1;
        requiredLevel = CHAPTER_CONFIG[requiredChapter]?.totalLevels || 5;
      }

      return {
        valid: false,
        canAccess: false,
        message: `Complete Chapter ${requiredChapter}, Level ${requiredLevel} first`,
        requiredLevel: {
          chapter: requiredChapter,
          level: requiredLevel,
        },
      };
    }

    return {
      valid: true,
      canAccess: true,
      message: "Level is unlocked and accessible",
    };
  } catch (error) {
    console.error("Error validating level access:", error);
    return {
      valid: false,
      canAccess: false,
      message: "Error validating level access",
      error: error.message,
    };
  }
};

/**
 * Get unlock status for all levels in a chapter
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @returns {Promise<Object>} Object with level unlock statuses
 */
export const getChapterUnlockStatus = async (userId, chapterId) => {
  try {
    await initDatabase();

    const chapterConfig = CHAPTER_CONFIG[chapterId];
    if (!chapterConfig) {
      return { error: "Invalid chapter ID" };
    }

    const query = `
      SELECT level_id, is_unlocked, is_completed, score, final_score
      FROM user_progress 
      WHERE user_id = ? AND chapter_id = ?
      ORDER BY level_id
    `;
    const levels = executeQuery(query, [userId, chapterId]);

    const levelStatus = {};
    for (let i = 1; i <= chapterConfig.totalLevels; i++) {
      const levelData = levels.find((l) => l.level_id === i);
      levelStatus[i] = {
        unlocked: levelData ? levelData.is_unlocked === 1 : false,
        completed: levelData ? levelData.is_completed === 1 : false,
        score: levelData?.score || 0,
        finalScore: levelData?.final_score || 0,
      };
    }

    return {
      chapterId,
      chapterName: chapterConfig.name,
      totalLevels: chapterConfig.totalLevels,
      levels: levelStatus,
    };
  } catch (error) {
    console.error("Error getting chapter unlock status:", error);
    return { error: error.message };
  }
};

/**
 * Mark a level as completed
 * This should be called before unlockNextLevel
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @param {number} score - Score achieved
 * @param {number} finalScore - Final calculated score
 * @returns {Promise<boolean>} Success status
 */
export const markLevelCompleted = async (
  userId,
  chapterId,
  levelId,
  score = 0,
  finalScore = 0
) => {
  try {
    await initDatabase();

    // Check if level exists
    const existingQuery = `
      SELECT id FROM user_progress 
      WHERE user_id = ? AND chapter_id = ? AND level_id = ?
    `;
    const existing = executeQuery(existingQuery, [userId, chapterId, levelId]);

    if (existing && existing.length > 0) {
      // Update existing record
      const updateQuery = `
        UPDATE user_progress 
        SET is_completed = 1, 
            score = ?, 
            final_score = ?,
            completion_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND chapter_id = ? AND level_id = ?
      `;
      executeUpdate(updateQuery, [
        score,
        finalScore,
        userId,
        chapterId,
        levelId,
      ]);
    } else {
      // Insert new record (shouldn't happen if level was unlocked first)
      const insertQuery = `
        INSERT INTO user_progress 
        (user_id, chapter_id, level_id, is_unlocked, is_completed, score, final_score, completion_date, created_at, updated_at)
        VALUES (?, ?, ?, 1, 1, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      executeUpdate(insertQuery, [
        userId,
        chapterId,
        levelId,
        score,
        finalScore,
      ]);
    }

    saveDatabase();
    console.log(
      `✅ Marked Chapter ${chapterId}, Level ${levelId} as completed with score ${score}`
    );
    return true;
  } catch (error) {
    console.error("Error marking level as completed:", error);
    return false;
  }
};

/**
 * Initialize first level for a new user
 *
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const initializeFirstLevel = async (userId) => {
  try {
    await initDatabase();

    // Unlock Chapter 1, Level 1
    const query = `
      INSERT OR IGNORE INTO user_progress 
      (user_id, chapter_id, level_id, is_unlocked, is_completed, score, created_at, updated_at)
      VALUES (?, 1, 1, 1, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    executeUpdate(query, [userId]);

    saveDatabase();
    console.log(`✅ Initialized first level for user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error initializing first level:", error);
    return false;
  }
};

export default {
  unlockNextLevel,
  checkLevelUnlocked,
  checkChapterUnlocked,
  validateLevelAccess,
  getChapterUnlockStatus,
  initializeFirstLevel,
  markLevelCompleted,
  CHAPTER_CONFIG,
};
