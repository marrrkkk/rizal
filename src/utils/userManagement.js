// User management utilities for admin operations
import api from "./api";

/**
 * Update user information
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update (username, email)
 * @returns {boolean} Success status
 */
export const updateUser = async (userId, updates) => {
  try {
    await api.put(`/admin/users/${userId}`, updates);
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
    await api.delete(`/admin/users/${userId}`);
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
    await api.post(`/admin/users/${userId}/reset`);
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
    // Currently the backend doesn't support search, so we fetch all and filter
    // In a real app, this should be a search endpoint
    const response = await api.get('/admin/users');
    const term = searchTerm.toLowerCase();

    return response.filter(user =>
      user.username.toLowerCase().includes(term)
    ).map(user => ({
      userId: user.id,
      username: user.username,
      email: "N/A", // Email not in DB
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
    await api.put(`/admin/users/${userId}/admin`, { isAdmin });
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
    const stats = await api.get('/admin/stats');
    // Map backend stats to expected format
    return {
      total: stats.totalUsers || 0,
      active: stats.activeUsers || 0, // Backend needs to implement this logic if needed
      inactive: (stats.totalUsers || 0) - (stats.activeUsers || 0),
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
