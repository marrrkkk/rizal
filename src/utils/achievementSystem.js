/**
 * Achievement Awarding System
 * Handles achievement triggers, checking, and awarding
 * Requirements: 12.1
 */

import { executeQuery, executeUpdate, getLastInsertId } from "./database";
import { EPIC_ACHIEVEMENTS } from "./achievementConfig";

/**
 * Award an achievement to a user
 * @param {number} userId - The user ID
 * @param {string} achievementId - The achievement ID from EPIC_ACHIEVEMENTS
 * @returns {Promise<boolean>} - True if awarded, false if already earned
 */
export const awardAchievement = async (userId, achievementId) => {
  try {
    const achievement = EPIC_ACHIEVEMENTS[achievementId];
    if (!achievement) {
      console.error(`Achievement ${achievementId} not found`);
      return false;
    }

    // Check if user already has this achievement
    const existing = await executeQuery(
      "SELECT id FROM achievements WHERE user_id = ? AND achievement_name = ?",
      [userId, achievementId]
    );

    if (existing.length > 0) {
      console.log(`User ${userId} already has achievement ${achievementId}`);
      return false;
    }

    // Award the achievement
    await executeUpdate(
      "INSERT INTO achievements (user_id, achievement_name, achievement_type) VALUES (?, ?, ?)",
      [userId, achievementId, achievement.type]
    );

    console.log(`Awarded achievement ${achievementId} to user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error awarding achievement:", error);
    return false;
  }
};

/**
 * Check if user has a specific achievement
 * @param {number} userId - The user ID
 * @param {string} achievementId - The achievement ID
 * @returns {Promise<boolean>} - True if user has the achievement
 */
export const hasAchievement = async (userId, achievementId) => {
  try {
    const result = await executeQuery(
      "SELECT id FROM achievements WHERE user_id = ? AND achievement_name = ?",
      [userId, achievementId]
    );
    return result.length > 0;
  } catch (error) {
    console.error("Error checking achievement:", error);
    return false;
  }
};

/**
 * Get all achievements for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} - Array of achievement objects
 */
export const getUserAchievements = async (userId) => {
  try {
    const results = await executeQuery(
      "SELECT achievement_name, achievement_type, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at DESC",
      [userId]
    );
    return results;
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return [];
  }
};

/**
 * Get achievement count by type for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} - Object with counts by type
 */
export const getAchievementCounts = async (userId) => {
  try {
    const results = await executeQuery(
      "SELECT achievement_type, COUNT(*) as count FROM achievements WHERE user_id = ? GROUP BY achievement_type",
      [userId]
    );

    const counts = {
      milestone: 0,
      chapter: 0,
      performance: 0,
      ultimate: 0,
      total: 0,
    };

    results.forEach((row) => {
      counts[row.achievement_type] = row.count;
      counts.total += row.count;
    });

    return counts;
  } catch (error) {
    console.error("Error getting achievement counts:", error);
    return { milestone: 0, chapter: 0, performance: 0, ultimate: 0, total: 0 };
  }
};

/**
 * Check and award achievements based on level completion
 * @param {number} userId - The user ID
 * @param {number} chapterId - The chapter ID
 * @param {number} levelId - The level ID
 * @param {number} score - The final score
 * @param {Object} stats - Additional stats (time, attempts, etc.)
 * @returns {Promise<Array>} - Array of newly awarded achievement IDs
 */
export const checkLevelCompletionAchievements = async (
  userId,
  chapterId,
  levelId,
  score,
  stats = {}
) => {
  const newAchievements = [];

  try {
    // Get user's progress
    const completedLevels = await executeQuery(
      "SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND is_completed = 1",
      [userId]
    );
    const totalCompleted = completedLevels[0]?.count || 0;

    // Check for first level completion
    if (totalCompleted === 1) {
      const awarded = await awardAchievement(userId, "heros_awakening");
      if (awarded) newAchievements.push("heros_awakening");
    }

    // Check for perfect score
    if (score >= 100) {
      const awarded = await awardAchievement(userId, "flawless_victory");
      if (awarded) newAchievements.push("flawless_victory");
    }

    // Check for speed record (if time is provided and fast)
    if (stats.timeTaken && stats.estimatedTime) {
      const timeRatio = stats.timeTaken / stats.estimatedTime;
      if (timeRatio <= 0.5) {
        // Completed in half the estimated time
        const awarded = await awardAchievement(userId, "lightning_strike");
        if (awarded) newAchievements.push("lightning_strike");
      }
    }

    // Check for persistent completion (multiple attempts)
    if (stats.attempts && stats.attempts >= 3) {
      const awarded = await awardAchievement(userId, "iron_will");
      if (awarded) newAchievements.push("iron_will");
    }

    // Check for comeback perfect (if previous attempt failed)
    if (
      stats.previousScore !== undefined &&
      stats.previousScore < 70 &&
      score >= 100
    ) {
      const awarded = await awardAchievement(userId, "rising_phoenix");
      if (awarded) newAchievements.push("rising_phoenix");
    }

    // Check for 10 levels milestone
    if (totalCompleted === 10) {
      const awarded = await awardAchievement(userId, "knowledge_hunter");
      if (awarded) newAchievements.push("knowledge_hunter");
    }

    // Check for chapter completion
    const chapterLevels = await executeQuery(
      "SELECT COUNT(*) as total FROM user_progress WHERE user_id = ? AND chapter_id = ?",
      [userId, chapterId]
    );
    const chapterCompleted = await executeQuery(
      "SELECT COUNT(*) as completed FROM user_progress WHERE user_id = ? AND chapter_id = ? AND is_completed = 1",
      [userId, chapterId]
    );

    const totalInChapter = chapterLevels[0]?.total || 0;
    const completedInChapter = chapterCompleted[0]?.completed || 0;

    // If all levels in chapter are completed
    if (totalInChapter > 0 && completedInChapter === totalInChapter) {
      const chapterAchievements = {
        1: "dawn_of_destiny",
        2: "scholars_resolve",
        3: "wanderers_odyssey",
        4: "pens_revolution",
        5: "eternal_flame",
      };

      const chapterAchievementId = chapterAchievements[chapterId];
      if (chapterAchievementId) {
        const awarded = await awardAchievement(userId, chapterAchievementId);
        if (awarded) {
          newAchievements.push(chapterAchievementId);
          // Also award path of enlightenment for any chapter completion
          const pathAwarded = await awardAchievement(
            userId,
            "path_of_enlightenment"
          );
          if (pathAwarded) newAchievements.push("path_of_enlightenment");
        }
      }
    }

    // Check for all chapters complete
    const totalChapters = 5;
    const completedChapters = await executeQuery(
      `SELECT COUNT(DISTINCT chapter_id) as count 
       FROM user_progress 
       WHERE user_id = ? 
       AND chapter_id IN (1, 2, 3, 4, 5)
       GROUP BY user_id
       HAVING COUNT(DISTINCT chapter_id) = ?`,
      [userId, totalChapters]
    );

    if (completedChapters.length > 0) {
      // Check if all levels in all chapters are completed
      const allLevelsCompleted = await executeQuery(
        `SELECT chapter_id, COUNT(*) as completed 
         FROM user_progress 
         WHERE user_id = ? AND is_completed = 1 
         GROUP BY chapter_id`,
        [userId]
      );

      if (allLevelsCompleted.length === totalChapters) {
        const awarded = await awardAchievement(userId, "legacy_unleashed");
        if (awarded) newAchievements.push("legacy_unleashed");

        const timelessAwarded = await awardAchievement(
          userId,
          "timeless_wisdom"
        );
        if (timelessAwarded) newAchievements.push("timeless_wisdom");
      }
    }

    // Check for high average score
    const avgScore = await executeQuery(
      "SELECT AVG(final_score) as avg FROM user_progress WHERE user_id = ? AND is_completed = 1 AND final_score IS NOT NULL",
      [userId]
    );

    const averageScore = avgScore[0]?.avg || 0;
    if (averageScore >= 90 && totalCompleted >= 5) {
      const awarded = await awardAchievement(userId, "wisdoms_embrace");
      if (awarded) newAchievements.push("wisdoms_embrace");
    }

    if (averageScore >= 90 && totalCompleted >= 10) {
      const awarded = await awardAchievement(userId, "masters_touch");
      if (awarded) newAchievements.push("masters_touch");
    }

    return newAchievements;
  } catch (error) {
    console.error("Error checking level completion achievements:", error);
    return newAchievements;
  }
};

/**
 * Check and award achievements based on session activity
 * @param {number} userId - The user ID
 * @param {number} levelsCompletedInSession - Number of levels completed in current session
 * @returns {Promise<Array>} - Array of newly awarded achievement IDs
 */
export const checkSessionAchievements = async (
  userId,
  levelsCompletedInSession
) => {
  const newAchievements = [];

  try {
    // Check for 5 levels in one session
    if (levelsCompletedInSession >= 5) {
      const awarded = await awardAchievement(userId, "unstoppable_force");
      if (awarded) newAchievements.push("unstoppable_force");
    }

    return newAchievements;
  } catch (error) {
    console.error("Error checking session achievements:", error);
    return newAchievements;
  }
};

/**
 * Check and award achievements based on perfect completion
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} - Array of newly awarded achievement IDs
 */
export const checkPerfectCompletionAchievements = async (userId) => {
  const newAchievements = [];

  try {
    // Check if all completed levels have high scores
    const allScores = await executeQuery(
      "SELECT COUNT(*) as total, SUM(CASE WHEN final_score >= 90 THEN 1 ELSE 0 END) as high_scores FROM user_progress WHERE user_id = ? AND is_completed = 1 AND final_score IS NOT NULL",
      [userId]
    );

    const total = allScores[0]?.total || 0;
    const highScores = allScores[0]?.high_scores || 0;

    if (total > 0 && total === highScores && total >= 15) {
      const awarded = await awardAchievement(userId, "legend_reborn");
      if (awarded) newAchievements.push("legend_reborn");
    }

    return newAchievements;
  } catch (error) {
    console.error("Error checking perfect completion achievements:", error);
    return newAchievements;
  }
};

export default {
  awardAchievement,
  hasAchievement,
  getUserAchievements,
  getAchievementCounts,
  checkLevelCompletionAchievements,
  checkSessionAchievements,
  checkPerfectCompletionAchievements,
};
