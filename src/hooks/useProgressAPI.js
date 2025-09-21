// React hook for managing progress with database backend

import { useState, useEffect, useCallback } from "react";
import {
  getUserProgress,
  completeLevel as apiCompleteLevel,
  initializeUserProgress,
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

  // Load progress from database
  const loadProgress = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize progress if needed
      await initializeUserProgress();

      // Get current progress
      const result = await getUserProgress();

      if (result.success) {
        setProgressData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading progress:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Complete a level
  const completeLevel = useCallback(
    async (chapter, level, score = 0, timeSpent = 0) => {
      try {
        console.log(
          `📡 API: Completing level ${chapter}-${level} with score ${score}`
        );
        const result = await apiCompleteLevel(chapter, level, score, timeSpent);
        console.log("📡 API Response:", result);

        if (result.success) {
          console.log("📡 API Success, reloading progress...");
          // Reload progress to get updated state
          await loadProgress();

          const response = {
            success: true,
            newBadges: result.data.newBadges || [],
            chapterComplete: result.data.chapterComplete || false,
            nextLevelUnlocked: result.data.nextLevelUnlocked,
            nextChapterUnlocked: result.data.nextChapterUnlocked,
          };

          console.log("📡 Hook Response:", response);
          return response;
        } else {
          console.error("📡 API Error:", result.error);
          return { success: false, error: result.error };
        }
      } catch (err) {
        console.error("📡 Hook Error completing level:", err);
        return { success: false, error: err.message };
      }
    },
    [loadProgress]
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
