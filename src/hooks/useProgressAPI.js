// React hook for managing progress with backend database (SQLite)

import { useState, useEffect, useCallback } from "react";
import {
  getUserProgress,
  completeLevel as apiCompleteLevel,
  isLevelUnlocked,
  isLevelCompleted,
  getLevelScore,
  getChapterProgress,
  getOverallProgress,
  getAllBadges,
} from "../utils/progressAPI";

export const useProgressAPI = (username) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load progress from API
  const loadProgress = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading progress from database...");
      const result = await getUserProgress();

      if (result.success) {
        setProgressData(result.data);
        console.log("✅ Successfully loaded progress from database");
      } else {
        throw new Error(result.error || "Failed to load progress");
      }
    } catch (err) {
      console.error("❌ Error loading progress from database:", err.message);
      setError(`Failed to connect to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Complete a level
  const completeLevel = useCallback(
    async (chapter, level, score = 0, timeSpent = 0) => {
      try {
        console.log(
          `📝 Completing level ${chapter}-${level} with score ${score}`
        );

        // Use API
        const result = await apiCompleteLevel(chapter, level, score, timeSpent);

        if (result.success) {
          // Refresh progress to get updated state
          await loadProgress();

          // Return the result with nextLevelUnlocked info
          return {
            success: true,
            newBadges: result.data.newBadges,
            chapterComplete: result.data.chapterComplete,
            nextLevelUnlocked: result.data.nextLevelUnlocked,
            nextChapterUnlocked: result.data.nextChapterUnlocked,
          };
        } else {
          throw new Error(result.error || "Failed to save progress");
        }
      } catch (err) {
        console.error("❌ Error completing level:", err);
        return { success: false, error: err.message };
      }
    },
    [username, loadProgress]
  );

  // Helper functions that work with current progress data
  const checkLevelUnlocked = useCallback(
    (chapterId, levelId) => {
      return isLevelUnlocked(progressData, chapterId, levelId);
    },
    [progressData]
  );

  const checkLevelCompleted = useCallback(
    (chapterId, levelId) => {
      return isLevelCompleted(progressData, chapterId, levelId);
    },
    [progressData]
  );

  const getScore = useCallback(
    (chapterId, levelId) => {
      return getLevelScore(progressData, chapterId, levelId);
    },
    [progressData]
  );

  const getChapterInfo = useCallback(
    (chapterId) => {
      return getChapterProgress(progressData, chapterId);
    },
    [progressData]
  );

  const getOverallInfo = useCallback(() => {
    return getOverallProgress(progressData);
  }, [progressData]);

  const getBadges = useCallback(() => {
    return getAllBadges(progressData);
  }, [progressData]);

  // Load progress when username changes
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    // Data
    progressData,
    loading,
    error,

    // Actions
    completeLevel,
    refreshProgress: loadProgress,

    // Helper functions
    isLevelUnlocked: checkLevelUnlocked,
    isLevelCompleted: checkLevelCompleted,
    getLevelScore: getScore,
    getChapterProgress: getChapterInfo,
    getOverallProgress: getOverallInfo,
    getAllBadges: getBadges,
  };
};

export default useProgressAPI;
