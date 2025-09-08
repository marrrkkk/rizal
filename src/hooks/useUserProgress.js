/**
 * React Hook for User-Specific Progress Management
 * Provides easy access to user progress data and actions
 */

import { useState, useEffect, useCallback } from "react";
import {
  getUserProgress,
  saveUserProgress,
  completeUserLevel,
  exportUserProgress,
  loadProgressFromFile,
  getUserStatistics,
} from "../utils/userProgressManager";

/**
 * Custom hook for managing user-specific progress
 * @param {string} username - The current user's username
 * @returns {Object} - Progress data and management functions
 */
export const useUserProgress = (username) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Load user progress on mount or username change
  useEffect(() => {
    if (!username) {
      setProgress(null);
      setStatistics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userProgress = getUserProgress(username);
      const userStats = getUserStatistics(username);

      setProgress(userProgress);
      setStatistics(userStats);
    } catch (err) {
      setError(err.message);
      console.error("Error loading user progress:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Complete a level for the current user
  const completeLevel = useCallback(
    async (chapterId, levelId, score = 0, timeSpent = 0) => {
      if (!username) {
        throw new Error("No user logged in");
      }

      try {
        const result = completeUserLevel(
          username,
          chapterId,
          levelId,
          score,
          timeSpent
        );

        if (result.success) {
          // Update local state with new progress
          setProgress(result.progress);

          // Update statistics
          const updatedStats = getUserStatistics(username);
          setStatistics(updatedStats);

          return {
            success: true,
            newBadges: result.newBadges,
            progress: result.progress,
          };
        } else {
          throw new Error("Failed to complete level");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error completing level:", err);
        return { success: false, error: err.message };
      }
    },
    [username]
  );

  // Refresh progress data
  const refreshProgress = useCallback(() => {
    if (!username) return;

    try {
      const userProgress = getUserProgress(username);
      const userStats = getUserStatistics(username);

      setProgress(userProgress);
      setStatistics(userStats);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error refreshing progress:", err);
    }
  }, [username]);

  // Export progress data
  const exportProgress = useCallback(() => {
    if (!username) {
      throw new Error("No user logged in");
    }

    try {
      return exportUserProgress(username);
    } catch (err) {
      setError(err.message);
      console.error("Error exporting progress:", err);
      throw err;
    }
  }, [username]);

  // Import progress data from file
  const importProgress = useCallback(async () => {
    if (!username) {
      throw new Error("No user logged in");
    }

    try {
      const importedProgress = await loadProgressFromFile(username);

      if (importedProgress) {
        setProgress(importedProgress);

        // Update statistics
        const updatedStats = getUserStatistics(username);
        setStatistics(updatedStats);

        return { success: true, progress: importedProgress };
      } else {
        return { success: false, error: "No file selected or invalid file" };
      }
    } catch (err) {
      setError(err.message);
      console.error("Error importing progress:", err);
      return { success: false, error: err.message };
    }
  }, [username]);

  // Get chapter progress
  const getChapterProgress = useCallback(
    (chapterId) => {
      if (!progress) return null;

      const chapter = progress.chapters[chapterId];
      if (!chapter) return null;

      const totalLevels = 5; // Each chapter has 5 levels

      return {
        chapterId,
        totalLevels,
        unlockedLevels: chapter.unlockedLevels.length,
        completedLevels: chapter.completedLevels.length,
        isComplete: chapter.completedLevels.length === totalLevels,
        badges: chapter.badges,
        timeSpent: chapter.timeSpent,
        averageScore:
          chapter.completedLevels.length > 0
            ? Math.round(
                Object.values(chapter.scores).reduce(
                  (sum, score) => sum + score,
                  0
                ) / chapter.completedLevels.length
              )
            : 0,
        completionPercentage: Math.round(
          (chapter.completedLevels.length / totalLevels) * 100
        ),
      };
    },
    [progress]
  );

  // Check if level is unlocked
  const isLevelUnlocked = useCallback(
    (chapterId, levelId) => {
      if (!progress) return false;

      const chapter = progress.chapters[chapterId];
      return chapter ? chapter.unlockedLevels.includes(levelId) : false;
    },
    [progress]
  );

  // Check if level is completed
  const isLevelCompleted = useCallback(
    (chapterId, levelId) => {
      if (!progress) return false;

      const chapter = progress.chapters[chapterId];
      return chapter ? chapter.completedLevels.includes(levelId) : false;
    },
    [progress]
  );

  // Get level score
  const getLevelScore = useCallback(
    (chapterId, levelId) => {
      if (!progress) return 0;

      const chapter = progress.chapters[chapterId];
      return chapter ? chapter.scores[levelId] || 0 : 0;
    },
    [progress]
  );

  // Get level attempts
  const getLevelAttempts = useCallback(
    (chapterId, levelId) => {
      if (!progress) return 0;

      const chapter = progress.chapters[chapterId];
      return chapter ? chapter.attempts[levelId] || 0 : 0;
    },
    [progress]
  );

  // Get all badges
  const getAllBadges = useCallback(() => {
    if (!progress) return [];

    const allBadges = [...progress.overall.badges];

    // Add chapter badges
    Object.values(progress.chapters).forEach((chapter) => {
      allBadges.push(...chapter.badges);
    });

    return [...new Set(allBadges)]; // Remove duplicates
  }, [progress]);

  // Get overall progress percentage
  const getOverallProgress = useCallback(() => {
    if (!progress) return 0;

    return Math.round((progress.overall.completedLevels / 25) * 100);
  }, [progress]);

  // Save current progress manually
  const saveProgress = useCallback(() => {
    if (!username || !progress) return false;

    try {
      return saveUserProgress(username, progress);
    } catch (err) {
      setError(err.message);
      console.error("Error saving progress:", err);
      return false;
    }
  }, [username, progress]);

  return {
    // State
    progress,
    statistics,
    loading,
    error,

    // Actions
    completeLevel,
    refreshProgress,
    exportProgress,
    importProgress,
    saveProgress,

    // Getters
    getChapterProgress,
    isLevelUnlocked,
    isLevelCompleted,
    getLevelScore,
    getLevelAttempts,
    getAllBadges,
    getOverallProgress,

    // Computed values
    isLoggedIn: !!username,
    hasProgress: !!progress,
    totalBadges: progress ? getAllBadges().length : 0,
    completionPercentage: getOverallProgress(),
  };
};

/**
 * Hook for managing multiple users (admin/parent view)
 * @returns {Object} - Multi-user management functions
 */
export const useMultiUserProgress = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all users on mount
  useEffect(() => {
    try {
      setLoading(true);

      // Get all users from localStorage
      const allUsers = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("rizal_progress_") &&
          key !== "rizal_app_progress"
        ) {
          const username = key
            .replace("rizal_progress_", "")
            .replace(/_/g, " ");
          const userStats = getUserStatistics(username);
          allUsers.push(userStats);
        }
      }

      setUsers(allUsers);
    } catch (err) {
      setError(err.message);
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh users list
  const refreshUsers = useCallback(() => {
    try {
      const allUsers = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("rizal_progress_") &&
          key !== "rizal_app_progress"
        ) {
          const username = key
            .replace("rizal_progress_", "")
            .replace(/_/g, " ");
          const userStats = getUserStatistics(username);
          allUsers.push(userStats);
        }
      }

      setUsers(allUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error refreshing users:", err);
    }
  }, []);

  // Get user by username
  const getUserByUsername = useCallback(
    (username) => {
      return users.find((user) => user.username === username);
    },
    [users]
  );

  // Get top performers
  const getTopPerformers = useCallback(
    (metric = "completionPercentage", limit = 5) => {
      return [...users]
        .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
        .slice(0, limit);
    },
    [users]
  );

  return {
    users,
    loading,
    error,
    refreshUsers,
    getUserByUsername,
    getTopPerformers,
    totalUsers: users.length,
  };
};

export default useUserProgress;
