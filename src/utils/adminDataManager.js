import api from './api';

/**
 * Get all users with comprehensive statistics and progress data
 * @returns {Promise<Array>} Array of user data with detailed statistics
 */
export const getAllUsersData = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data.map(user => ({
      userId: user.id,
      username: user.username,
      accountCreated: user.created_at,
      isAdmin: user.is_admin === 1,
      totalScore: user.total_score || 0,
      averageScore: Math.round(user.average_score || 0),
      completedLevels: user.completed_levels || 0,
      completedChapters: user.completed_chapters || 0,
      achievementCount: user.achievement_count || 0,
      // Fallbacks for missing data
      unlockedLevels: 0,
      completionRate: 0,
      lastPlayed: null,
      avgTimeMinutes: 0,
      totalAttempts: 0,
      totalHintsUsed: 0
    }));
  } catch (error) {
    console.error("Failed to get all users data:", error);
    return [];
  }
};

/**
 * Get detailed progress for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Detailed user progress data
 */
export const getUserDetailedProgress = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    const { user, progress, badges } = response.data;

    // Process progress into chapterProgress structure
    const chapterProgress = {};
    progress.forEach(p => {
      if (!chapterProgress[p.chapter_id]) {
        chapterProgress[p.chapter_id] = {
          chapterId: p.chapter_id,
          levels: [],
          completedCount: 0,
          totalScore: 0
        };
      }
      chapterProgress[p.chapter_id].levels.push({
        levelId: p.level_id,
        isUnlocked: p.is_unlocked === 1,
        isCompleted: p.is_completed === 1,
        score: p.score,
        finalScore: p.score, // backend uses score, frontend expects finalScore
        completionDate: p.completion_date,
        attempts: 0, // Not tracked in backend yet
        hintsUsed: 0 // Not tracked in backend yet
      });
      if (p.is_completed) {
        chapterProgress[p.chapter_id].completedCount++;
        chapterProgress[p.chapter_id].totalScore += p.score;
      }
    });

    return {
      userId: user.id,
      username: user.username,
      email: "N/A", // Email not stored in backend
      accountCreated: user.created_at,
      isAdmin: user.is_admin === 1,
      chapterProgress,
      achievements: badges.map(b => ({
        name: b.badge_name,
        type: b.badge_type,
        earnedAt: b.earned_date
      }))
    };
  } catch (error) {
    console.error("Failed to get user detailed progress:", error);
    return null;
  }
};

/**
 * Get aggregate system statistics
 * @returns {Promise<Object>} System-wide statistics
 */
export const getSystemStatistics = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error("Failed to get system stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalLevelsCompleted: 0,
      avgCompletionRate: 0,
      totalAchievements: 0,
      avgScore: 0
    };
  }
};

// Placeholder functions for features not yet supported by backend
export const getPopularLevels = async () => [];
export const getDifficultLevels = async () => [];
export const getRecentActivity = async () => [];
export const getChapterStatistics = async () => [];
export const getLevelDifficultyMetrics = async () => [];

export default {
  getAllUsersData,
  getUserDetailedProgress,
  getSystemStatistics,
  getPopularLevels,
  getDifficultLevels,
  getRecentActivity,
  getChapterStatistics,
  getLevelDifficultyMetrics,
};
