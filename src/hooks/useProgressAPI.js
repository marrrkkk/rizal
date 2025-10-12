// React hook for managing progress with database backend and localStorage fallback

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
import {
  getLocalProgress,
  completeLocalLevel,
  isLocalLevelUnlocked,
  isLocalLevelCompleted,
  getLocalLevelScore,
} from "../utils/progressFallback";

export const useProgressAPI = (username) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Load progress from database with fallback to localStorage
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      if (username) {
        // Try API first
        console.log("🔄 Attempting to load progress from API...");

        // Initialize progress if needed
        await initializeUserProgress();

        // Get current progress
        const result = await getUserProgress();

        if (result.success) {
          console.log("✅ Successfully loaded progress from API");
          setProgressData(result.data);
          return;
        } else {
          console.warn(
            "⚠️ API failed, falling back to localStorage:",
            result.error
          );
        }
      }

      // Fallback to localStorage
      console.log("🔄 Loading progress from localStorage fallback...");
      const localProgress = getLocalProgress();
      setProgressData(localProgress);
      setUsingFallback(true);
      console.log("✅ Successfully loaded progress from localStorage");
    } catch (err) {
      console.warn("⚠️ API error, falling back to localStorage:", err.message);

      // Fallback to localStorage
      const localProgress = getLocalProgress();
      setProgressData(localProgress);
      setUsingFallback(true);
      setError(`API unavailable, using offline mode: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Complete a level with API and localStorage fallback
  const completeLevel = useCallback(
    async (chapter, level, score = 0, timeSpent = 0) => {
      try {
        console.log(
          `📡 Completing level ${chapter}-${level} with score ${score}`
        );

        // Try API first if we have a username and not already using fallback
        if (username && !usingFallback) {
          console.log("📡 Attempting API completion...");
          const result = await apiCompleteLevel(
            chapter,
            level,
            score,
            timeSpent
          );

          if (result.success) {
            console.log("📡 API Success, reloading progress...");
            await loadProgress();

            const response = {
              success: true,
              newBadges: result.data.newBadges || [],
              chapterComplete: result.data.chapterComplete || false,
              nextLevelUnlocked: result.data.nextLevelUnlocked,
              nextChapterUnlocked: result.data.nextChapterUnlocked,
            };

            console.log("📡 API Response:", response);
            return response;
          } else {
            console.warn(
              "📡 API failed, falling back to localStorage:",
              result.error
            );
          }
        }

        // Fallback to localStorage
        console.log("💾 Using localStorage completion...");
        const result = completeLocalLevel(chapter, level, score);

        if (result.success) {
          // Update local state
          const updatedProgress = getLocalProgress();
          setProgressData(updatedProgress);
          setUsingFallback(true);

          console.log("💾 localStorage Success:", result);
          return result;
        } else {
          console.error("💾 localStorage Error:", result.error);
          return result;
        }
      } catch (err) {
        console.error("📡 Error completing level:", err);

        // Final fallback to localStorage
        console.log("💾 Final fallback to localStorage...");
        const result = completeLocalLevel(chapter, level, score);

        if (result.success) {
          const updatedProgress = getLocalProgress();
          setProgressData(updatedProgress);
          setUsingFallback(true);
        }

        return result.success ? result : { success: false, error: err.message };
      }
    },
    [username, usingFallback, loadProgress]
  );

  // Helper functions that work with current progress data or fallback
  const checkLevelUnlocked = useCallback(
    (chapterId, levelId) => {
      if (usingFallback) {
        return isLocalLevelUnlocked(chapterId, levelId);
      }
      return isLevelUnlocked(progressData, chapterId, levelId);
    },
    [progressData, usingFallback]
  );

  const checkLevelCompleted = useCallback(
    (chapterId, levelId) => {
      if (usingFallback) {
        return isLocalLevelCompleted(chapterId, levelId);
      }
      return isLevelCompleted(progressData, chapterId, levelId);
    },
    [progressData, usingFallback]
  );

  const getScore = useCallback(
    (chapterId, levelId) => {
      if (usingFallback) {
        return getLocalLevelScore(chapterId, levelId);
      }
      return getLevelScore(progressData, chapterId, levelId);
    },
    [progressData, usingFallback]
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
    usingFallback, // New: indicates if using localStorage fallback

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
