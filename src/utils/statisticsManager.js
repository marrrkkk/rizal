// Statistics management utilities
// Handles aggregate statistics calculation and updates

import {
  initDatabase,
  executeQuery,
  executeQueryOne,
  executeUpdate,
  saveDatabase,
} from "./database.js";

/**
 * Initialize user statistics record
 * Creates a new statistics record for a user if it doesn't exist
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result object
 */
export const initializeUserStatistics = async (userId) => {
  try {
    await initDatabase();

    // Check if statistics record exists
    const existing = executeQueryOne(
      `SELECT id FROM user_statistics WHERE user_id = ?`,
      [userId]
    );

    if (!existing) {
      executeUpdate(
        `INSERT INTO user_statistics 
         (user_id, total_levels_completed, total_score, average_score, 
          current_streak, longest_streak, last_played_date)
         VALUES (?, 0, 0, 0.0, 0, 0, NULL)`,
        [userId]
      );

      saveDatabase();
    }

    return { success: true, message: "User statistics initialized" };
  } catch (error) {
    console.error("Error initializing user statistics:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate aggregate statistics from user progress
 * Computes total score, average score, and completion count
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Calculated statistics
 */
export const calculateAggregateStatistics = async (userId) => {
  try {
    await initDatabase();

    const stats = executeQueryOne(
      `SELECT 
         COUNT(*) as total_completed,
         SUM(final_score) as total_score,
         AVG(final_score) as average_score
       FROM user_progress 
       WHERE user_id = ? AND is_completed = 1 AND final_score IS NOT NULL`,
      [userId]
    );

    return {
      totalLevelsCompleted: stats?.total_completed || 0,
      totalScore: stats?.total_score || 0,
      averageScore: stats?.average_score || 0.0,
    };
  } catch (error) {
    console.error("Error calculating aggregate statistics:", error);
    return {
      totalLevelsCompleted: 0,
      totalScore: 0,
      averageScore: 0.0,
    };
  }
};

/**
 * Update user statistics after score save
 * Recalculates and updates all aggregate statistics
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result object with updated statistics
 */
export const updateUserStatistics = async (userId) => {
  try {
    await initDatabase();

    // Ensure statistics record exists
    await initializeUserStatistics(userId);

    // Calculate aggregate statistics
    const aggregateStats = await calculateAggregateStatistics(userId);

    // Get current streak information
    const streakInfo = await calculateStreak(userId);

    // Update statistics record
    executeUpdate(
      `UPDATE user_statistics 
       SET total_levels_completed = ?,
           total_score = ?,
           average_score = ?,
           current_streak = ?,
           longest_streak = CASE 
             WHEN ? > longest_streak THEN ? 
             ELSE longest_streak 
           END,
           last_played_date = DATE('now'),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
        aggregateStats.totalLevelsCompleted,
        aggregateStats.totalScore,
        aggregateStats.averageScore,
        streakInfo.currentStreak,
        streakInfo.currentStreak,
        streakInfo.currentStreak,
        userId,
      ]
    );

    saveDatabase();

    return {
      success: true,
      message: "User statistics updated successfully",
      data: {
        ...aggregateStats,
        ...streakInfo,
      },
    };
  } catch (error) {
    console.error("Error updating user statistics:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to update user statistics",
    };
  }
};

/**
 * Calculate user streak (consecutive days played)
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Streak information
 */
export const calculateStreak = async (userId) => {
  try {
    await initDatabase();

    // Get last played date from statistics
    const statsRecord = executeQueryOne(
      `SELECT last_played_date, current_streak, longest_streak 
       FROM user_statistics 
       WHERE user_id = ?`,
      [userId]
    );

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const lastPlayedDate = statsRecord?.last_played_date;

    let currentStreak = statsRecord?.current_streak || 0;
    let longestStreak = statsRecord?.longest_streak || 0;

    if (!lastPlayedDate) {
      // First time playing
      currentStreak = 1;
      longestStreak = Math.max(longestStreak, 1);
    } else if (lastPlayedDate === today) {
      // Already played today, keep current streak
      // No change needed
    } else {
      // Check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastPlayedDate === yesterdayStr) {
        // Consecutive day
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        // Streak broken
        currentStreak = 1;
      }
    }

    return {
      currentStreak,
      longestStreak,
      lastPlayedDate: today,
    };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
    };
  }
};

/**
 * Get user statistics
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
export const getUserStatistics = async (userId) => {
  try {
    await initDatabase();

    const stats = executeQueryOne(
      `SELECT * FROM user_statistics WHERE user_id = ?`,
      [userId]
    );

    if (!stats) {
      // Initialize if doesn't exist
      await initializeUserStatistics(userId);
      return await getUserStatistics(userId);
    }

    return {
      success: true,
      data: {
        userId: stats.user_id,
        totalLevelsCompleted: stats.total_levels_completed,
        totalScore: stats.total_score,
        averageScore: Math.round(stats.average_score * 100) / 100,
        currentStreak: stats.current_streak,
        longestStreak: stats.longest_streak,
        lastPlayedDate: stats.last_played_date,
        createdAt: stats.created_at,
        updatedAt: stats.updated_at,
      },
    };
  } catch (error) {
    console.error("Error getting user statistics:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * Get statistics for all users (for admin dashboard)
 *
 * @returns {Promise<Array>} Array of user statistics
 */
export const getAllUserStatistics = async () => {
  try {
    await initDatabase();

    const results = executeQuery(
      `SELECT 
         us.*,
         u.username,
         u.email
       FROM user_statistics us
       JOIN users u ON us.user_id = u.id
       ORDER BY us.total_score DESC`
    );

    return results.map((row) => ({
      userId: row.user_id,
      username: row.username,
      email: row.email,
      totalLevelsCompleted: row.total_levels_completed,
      totalScore: row.total_score,
      averageScore: Math.round(row.average_score * 100) / 100,
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastPlayedDate: row.last_played_date,
    }));
  } catch (error) {
    console.error("Error getting all user statistics:", error);
    return [];
  }
};

/**
 * Get chapter-specific statistics for a user
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @returns {Promise<Object>} Chapter statistics
 */
export const getChapterStatistics = async (userId, chapterId) => {
  try {
    await initDatabase();

    const stats = executeQueryOne(
      `SELECT 
         COUNT(*) as levels_completed,
         SUM(final_score) as total_score,
         AVG(final_score) as average_score,
         SUM(attempts) as total_attempts,
         SUM(hints_used) as total_hints
       FROM user_progress 
       WHERE user_id = ? AND chapter_id = ? AND is_completed = 1`,
      [userId, chapterId]
    );

    return {
      chapterId,
      levelsCompleted: stats?.levels_completed || 0,
      totalScore: stats?.total_score || 0,
      averageScore: Math.round((stats?.average_score || 0) * 100) / 100,
      totalAttempts: stats?.total_attempts || 0,
      totalHints: stats?.total_hints || 0,
    };
  } catch (error) {
    console.error("Error getting chapter statistics:", error);
    return {
      chapterId,
      levelsCompleted: 0,
      totalScore: 0,
      averageScore: 0,
      totalAttempts: 0,
      totalHints: 0,
    };
  }
};

/**
 * Get performance metrics for a user
 * Includes completion rate, average attempts, hint usage, etc.
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Performance metrics
 */
export const getPerformanceMetrics = async (userId) => {
  try {
    await initDatabase();

    const metrics = executeQueryOne(
      `SELECT 
         COUNT(*) as total_levels,
         SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_levels,
         AVG(CASE WHEN is_completed = 1 THEN attempts ELSE NULL END) as avg_attempts,
         AVG(CASE WHEN is_completed = 1 THEN hints_used ELSE NULL END) as avg_hints,
         AVG(CASE WHEN is_completed = 1 THEN final_score ELSE NULL END) as avg_score
       FROM user_progress 
       WHERE user_id = ?`,
      [userId]
    );

    const totalLevels = metrics?.total_levels || 0;
    const completedLevels = metrics?.completed_levels || 0;
    const completionRate =
      totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

    return {
      totalLevels,
      completedLevels,
      completionRate: Math.round(completionRate * 100) / 100,
      averageAttempts: Math.round((metrics?.avg_attempts || 0) * 100) / 100,
      averageHints: Math.round((metrics?.avg_hints || 0) * 100) / 100,
      averageScore: Math.round((metrics?.avg_score || 0) * 100) / 100,
    };
  } catch (error) {
    console.error("Error getting performance metrics:", error);
    return {
      totalLevels: 0,
      completedLevels: 0,
      completionRate: 0,
      averageAttempts: 0,
      averageHints: 0,
      averageScore: 0,
    };
  }
};

/**
 * Reset user statistics (for testing or admin purposes)
 *
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result object
 */
export const resetUserStatistics = async (userId) => {
  try {
    await initDatabase();

    executeUpdate(
      `UPDATE user_statistics 
       SET total_levels_completed = 0,
           total_score = 0,
           average_score = 0.0,
           current_streak = 0,
           longest_streak = 0,
           last_played_date = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [userId]
    );

    saveDatabase();

    return {
      success: true,
      message: "User statistics reset successfully",
    };
  } catch (error) {
    console.error("Error resetting user statistics:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to reset user statistics",
    };
  }
};

export default {
  initializeUserStatistics,
  calculateAggregateStatistics,
  updateUserStatistics,
  calculateStreak,
  getUserStatistics,
  getAllUserStatistics,
  getChapterStatistics,
  getPerformanceMetrics,
  resetUserStatistics,
};
