// Leaderboard management utilities for top student rankings
import { executeQuery } from "./database";

/**
 * Get top students based on overall performance
 * Considers total score, completion rate, and achievement count
 * Uses average completion time as tiebreaker
 *
 * @param {number} limit - Number of top students to return (default: 5)
 * @returns {Promise<Array>} Array of top student entries with rankings
 */
export const getTopStudents = async (limit = 5) => {
  try {
    // First, get all student data
    const query = `
      SELECT 
        u.id as userId,
        u.username,
        COALESCE(SUM(p.final_score), 0) as totalScore,
        COUNT(CASE WHEN p.is_completed = 1 THEN 1 END) as completedLevels,
        COUNT(DISTINCT p.chapter_id) as chaptersCompleted,
        COALESCE(a.achievement_count, 0) as achievementCount,
        COALESCE(
          AVG(
            CASE 
              WHEN p.is_completed = 1 AND p.completion_date IS NOT NULL 
              THEN (julianday(p.completion_date) - julianday(p.created_at)) * 24 * 60 
            END
          ), 
          0
        ) as avgTimeMinutes,
        COALESCE(
          (COUNT(CASE WHEN p.is_completed = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
          0
        ) as completionRate
      FROM users u
      LEFT JOIN user_progress p ON u.id = p.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as achievement_count
        FROM achievements
        GROUP BY user_id
      ) a ON u.id = a.user_id
      WHERE u.is_admin = 0
      GROUP BY u.id, u.username
      HAVING completedLevels > 0
    `;

    const results = executeQuery(query, []);

    // Calculate ranking score for each student and sort
    const studentsWithRankingScore = results.map((entry) => ({
      userId: entry.userId,
      username: entry.username,
      totalScore: entry.totalScore || 0,
      completedLevels: entry.completedLevels || 0,
      chaptersCompleted: entry.chaptersCompleted || 0,
      achievementCount: entry.achievementCount || 0,
      avgTimeMinutes: Math.round(entry.avgTimeMinutes || 0),
      completionRate: Math.round(entry.completionRate || 0),
      rankingScore: calculateRankingScore({
        totalScore: entry.totalScore || 0,
        completionRate: entry.completionRate || 0,
        achievementCount: entry.achievementCount || 0,
      }),
    }));

    // Sort by ranking score (descending), then by average time (ascending) as tiebreaker
    studentsWithRankingScore.sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) {
        return b.rankingScore - a.rankingScore;
      }
      // Tiebreaker: lower average time is better
      return a.avgTimeMinutes - b.avgTimeMinutes;
    });

    // Take top N and add rank
    const topStudents = studentsWithRankingScore
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        username: entry.username,
        totalScore: entry.totalScore,
        completedLevels: entry.completedLevels,
        chaptersCompleted: entry.chaptersCompleted,
        achievementCount: entry.achievementCount,
        avgTimeMinutes: entry.avgTimeMinutes,
        completionRate: entry.completionRate,
      }));

    return topStudents;
  } catch (error) {
    console.error("Failed to get top students:", error);
    return [];
  }
};

/**
 * Get badges/achievements for a specific user
 *
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of achievement names
 */
export const getUserBadges = async (userId) => {
  try {
    const query = `
      SELECT achievement_name, achievement_type, earned_at
      FROM achievements
      WHERE user_id = ?
      ORDER BY earned_at DESC
    `;

    const results = executeQuery(query, [userId]);
    return results.map((a) => ({
      name: a.achievement_name,
      type: a.achievement_type,
      earnedAt: a.earned_at,
    }));
  } catch (error) {
    console.error("Failed to get user badges:", error);
    return [];
  }
};

/**
 * Calculate ranking score for a user
 * Used for determining overall performance
 *
 * @param {Object} stats - User statistics
 * @returns {number} Calculated ranking score
 */
export const calculateRankingScore = (stats) => {
  const { totalScore = 0, completionRate = 0, achievementCount = 0 } = stats;

  // Weighted scoring algorithm
  const scoreWeight = 0.6;
  const completionWeight = 0.3;
  const achievementWeight = 0.1;

  return (
    totalScore * scoreWeight +
    completionRate * completionWeight +
    achievementCount * 100 * achievementWeight
  );
};

/**
 * Get detailed leaderboard with badges
 *
 * @param {number} limit - Number of top students to return
 * @returns {Promise<Array>} Array of detailed leaderboard entries
 */
export const getDetailedLeaderboard = async (limit = 5) => {
  const topStudents = await getTopStudents(limit);

  // Fetch badges for each student
  const detailedEntries = await Promise.all(
    topStudents.map(async (student) => {
      const badges = await getUserBadges(student.userId);
      return {
        ...student,
        badges,
      };
    })
  );

  return detailedEntries;
};

/**
 * Get user's rank in the leaderboard
 *
 * @param {number} userId - User ID
 * @returns {Promise<number|null>} User's rank or null if not ranked
 */
export const getUserRank = async (userId) => {
  try {
    // Get all students data
    const query = `
      SELECT 
        u.id as userId,
        COALESCE(SUM(p.final_score), 0) as totalScore,
        COUNT(CASE WHEN p.is_completed = 1 THEN 1 END) as completedLevels,
        COALESCE(a.achievement_count, 0) as achievementCount,
        COALESCE(
          AVG(
            CASE 
              WHEN p.is_completed = 1 AND p.completion_date IS NOT NULL 
              THEN (julianday(p.completion_date) - julianday(p.created_at)) * 24 * 60 
            END
          ), 
          0
        ) as avgTimeMinutes,
        COALESCE(
          (COUNT(CASE WHEN p.is_completed = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
          0
        ) as completionRate
      FROM users u
      LEFT JOIN user_progress p ON u.id = p.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as achievement_count
        FROM achievements
        GROUP BY user_id
      ) a ON u.id = a.user_id
      WHERE u.is_admin = 0
      GROUP BY u.id
      HAVING completedLevels > 0
    `;

    const results = executeQuery(query, []);

    // Calculate ranking score for each student
    const studentsWithRankingScore = results.map((entry) => ({
      userId: entry.userId,
      rankingScore: calculateRankingScore({
        totalScore: entry.totalScore || 0,
        completionRate: entry.completionRate || 0,
        achievementCount: entry.achievementCount || 0,
      }),
      avgTimeMinutes: entry.avgTimeMinutes || 0,
    }));

    // Sort by ranking score (descending), then by average time (ascending) as tiebreaker
    studentsWithRankingScore.sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) {
        return b.rankingScore - a.rankingScore;
      }
      return a.avgTimeMinutes - b.avgTimeMinutes;
    });

    // Find the user's rank
    const userIndex = studentsWithRankingScore.findIndex(
      (student) => student.userId === userId
    );

    return userIndex >= 0 ? userIndex + 1 : null;
  } catch (error) {
    console.error("Failed to get user rank:", error);
    return null;
  }
};

/**
 * Refresh leaderboard data
 * This function can be called to ensure fresh data
 *
 * @param {number} limit - Number of top students to return
 * @returns {Promise<Array>} Fresh leaderboard data
 */
export const refreshLeaderboard = async (limit = 5) => {
  return await getDetailedLeaderboard(limit);
};
