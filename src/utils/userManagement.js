// User management utilities for admin operations
import { executeQuery, executeUpdate, saveDatabase } from "./database";

/**
 * Update user information
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update (username, email)
 * @returns {boolean} Success status
 */
export const updateUser = async (userId, updates) => {
  try {
    const allowedFields = ["username", "email"];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return false;
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    executeUpdate(query, values);
    return true;
  } catch (error) {
    console.error("Failed to update user:", error);
    return false;
  }
};

/**
 * Delete user and all associated data
 * @param {number} userId - User ID
 * @returns {boolean} Success status
 */
export const deleteUser = async (userId) => {
  try {
    // Delete user progress
    executeUpdate("DELETE FROM user_progress WHERE user_id = ?", [userId]);

    // Delete achievements
    executeUpdate("DELETE FROM achievements WHERE user_id = ?", [userId]);

    // Delete user statistics
    executeUpdate("DELETE FROM user_statistics WHERE user_id = ?", [userId]);

    // Delete user
    executeUpdate("DELETE FROM users WHERE id = ?", [userId]);

    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
};

/**
 * Reset user progress (keep user account but clear progress)
 * @param {number} userId - User ID
 * @returns {boolean} Success status
 */
export const resetUserProgress = async (userId) => {
  try {
    // Delete user progress
    executeUpdate("DELETE FROM user_progress WHERE user_id = ?", [userId]);

    // Delete achievements
    executeUpdate("DELETE FROM achievements WHERE user_id = ?", [userId]);

    // Reset user statistics
    executeUpdate(
      `UPDATE user_statistics 
       SET total_levels_completed = 0,
           total_score = 0,
           average_score = 0.0,
           current_streak = 0,
           longest_streak = 0,
           last_played_date = NULL
       WHERE user_id = ?`,
      [userId]
    );

    // Initialize first level
    executeUpdate(
      `INSERT INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
       VALUES (?, 1, 1, 1)`,
      [userId]
    );

    return true;
  } catch (error) {
    console.error("Failed to reset user progress:", error);
    return false;
  }
};

/**
 * Search users by username or email
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching users
 */
export const searchUsers = async (searchTerm) => {
  try {
    const query = `
      SELECT id, username, email, created_at, is_admin
      FROM users
      WHERE username LIKE ? OR email LIKE ?
      ORDER BY username
    `;

    const term = `%${searchTerm}%`;
    const results = executeQuery(query, [term, term]);

    return results.map((user) => ({
      userId: user.id,
      username: user.username,
      email: user.email,
      accountCreated: user.created_at,
      isAdmin: user.is_admin === 1,
    }));
  } catch (error) {
    console.error("Failed to search users:", error);
    return [];
  }
};

/**
 * Toggle admin status for a user
 * @param {number} userId - User ID
 * @param {boolean} isAdmin - New admin status
 * @returns {boolean} Success status
 */
export const toggleAdminStatus = async (userId, isAdmin) => {
  try {
    executeUpdate("UPDATE users SET is_admin = ? WHERE id = ?", [
      isAdmin ? 1 : 0,
      userId,
    ]);
    return true;
  } catch (error) {
    console.error("Failed to toggle admin status:", error);
    return false;
  }
};

/**
 * Get user count by status
 * @returns {Object} User counts
 */
export const getUserCounts = async () => {
  try {
    const totalQuery = "SELECT COUNT(*) as count FROM users WHERE is_admin = 0";
    const totalResult = executeQuery(totalQuery, []);
    const total = totalResult[0]?.count || 0;

    const activeQuery = `
      SELECT COUNT(DISTINCT user_id) as count
      FROM user_progress
      WHERE completion_date >= date('now', '-7 days')
    `;
    const activeResult = executeQuery(activeQuery, []);
    const active = activeResult[0]?.count || 0;

    const inactiveQuery = `
      SELECT COUNT(*) as count
      FROM users u
      WHERE is_admin = 0
      AND NOT EXISTS (
        SELECT 1 FROM user_progress p
        WHERE p.user_id = u.id
        AND p.completion_date >= date('now', '-7 days')
      )
    `;
    const inactiveResult = executeQuery(inactiveQuery, []);
    const inactive = inactiveResult[0]?.count || 0;

    return {
      total,
      active,
      inactive,
    };
  } catch (error) {
    console.error("Failed to get user counts:", error);
    return { total: 0, active: 0, inactive: 0 };
  }
};

export default {
  updateUser,
  deleteUser,
  resetUserProgress,
  searchUsers,
  toggleAdminStatus,
  getUserCounts,
};
