import { useCallback, useEffect, useState } from "react";
import analyticsManager from "../utils/analyticsManager";

/**
 * React hook for using the analytics system
 * Provides easy access to tracking functions and user statistics
 */
export const useAnalytics = (username) => {
  const [userStats, setUserStats] = useState(null);
  const [progressReport, setProgressReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user statistics on mount and when username changes
  useEffect(() => {
    if (username) {
      setLoading(true);
      const stats = analyticsManager.getUserStatistics(username);
      setUserStats(stats);
      setLoading(false);
    }
  }, [username]);

  // Track level start
  const trackLevelStart = useCallback(
    (chapter, level) => {
      if (username) {
        analyticsManager.trackLevelStart(chapter, level, username);
      }
    },
    [username]
  );

  // Track level completion
  const trackLevelComplete = useCallback(
    (chapter, level, metrics = {}) => {
      if (username) {
        analyticsManager.trackLevelComplete(chapter, level, username, metrics);
        // Refresh user stats after completion
        const updatedStats = analyticsManager.getUserStatistics(username);
        setUserStats(updatedStats);
      }
    },
    [username]
  );

  // Track game interactions
  const trackInteraction = useCallback(
    (chapter, level, interactionType, data = {}) => {
      if (username) {
        analyticsManager.trackGameInteraction(
          chapter,
          level,
          interactionType,
          data
        );
      }
    },
    [username]
  );

  // Generate progress report
  const generateReport = useCallback(() => {
    if (username) {
      const report = analyticsManager.generateProgressReport(username);
      setProgressReport(report);
      return report;
    }
    return null;
  }, [username]);

  // Refresh user statistics
  const refreshStats = useCallback(() => {
    if (username) {
      const stats = analyticsManager.getUserStatistics(username);
      setUserStats(stats);
    }
  }, [username]);

  // Export user data
  const exportData = useCallback(() => {
    if (username) {
      return analyticsManager.exportUserData(username);
    }
    return null;
  }, [username]);

  return {
    userStats,
    progressReport,
    loading,
    trackLevelStart,
    trackLevelComplete,
    trackInteraction,
    generateReport,
    refreshStats,
    exportData,
  };
};

/**
 * Hook for getting analytics summary data
 */
export const useAnalyticsSummary = (username) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (username) {
      const stats = analyticsManager.getUserStatistics(username);
      const summaryData = {
        totalLevelsCompleted: stats.totalLevelsCompleted,
        averageScore: stats.averageScore,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        totalTimeSpent: stats.totalTimeSpent,
        efficiency: stats.averageEfficiency,
        lastPlayed: stats.lastPlayedDate,
      };
      setSummary(summaryData);
    }
  }, [username]);

  return summary;
};

/**
 * Hook for getting chapter-specific analytics
 */
export const useChapterAnalytics = (username, chapter) => {
  const [chapterStats, setChapterStats] = useState(null);

  useEffect(() => {
    if (username && chapter) {
      const stats = analyticsManager.getUserStatistics(username);
      const chapterData = stats.chapterStats[chapter] || {
        levelsCompleted: 0,
        totalScore: 0,
        totalTime: 0,
        averageScore: 0,
        bestScore: 0,
        perfectScores: 0,
      };
      setChapterStats(chapterData);
    }
  }, [username, chapter]);

  return chapterStats;
};

export default useAnalytics;
