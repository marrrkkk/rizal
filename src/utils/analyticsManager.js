/**
 * Enhanced Analytics Manager for José Rizal Educational App
 * Tracks detailed user learning patterns, performance metrics, and engagement data
 */

class AnalyticsManager {
  constructor() {
    this.sessionStartTime = Date.now();
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: this.sessionStartTime,
      activities: [],
      levelsAttempted: [],
      totalTimeSpent: 0,
    };
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track level start
  trackLevelStart(chapter, level, username) {
    const activity = {
      type: "level_start",
      chapter,
      level,
      username,
      timestamp: Date.now(),
      sessionId: this.currentSession.sessionId,
    };

    this.currentSession.activities.push(activity);
    this.saveToStorage("current_session", this.currentSession);

    console.log(
      `📊 Analytics: Level ${chapter}-${level} started by ${username}`
    );
  }

  // Track level completion with detailed metrics
  trackLevelComplete(chapter, level, username, metrics = {}) {
    const {
      score = 0,
      timeSpent = 0,
      attempts = 1,
      hintsUsed = 0,
      errorsCount = 0,
      perfectScore = false,
    } = metrics;

    const activity = {
      type: "level_complete",
      chapter,
      level,
      username,
      timestamp: Date.now(),
      sessionId: this.currentSession.sessionId,
      metrics: {
        score,
        timeSpent,
        attempts,
        hintsUsed,
        errorsCount,
        perfectScore,
        efficiency: this.calculateEfficiency(score, timeSpent, attempts),
      },
    };

    this.currentSession.activities.push(activity);
    this.updateUserStatistics(username, activity);
    this.saveToStorage("current_session", this.currentSession);

    console.log(
      `📊 Analytics: Level ${chapter}-${level} completed`,
      activity.metrics
    );
  }

  // Track game interactions
  trackGameInteraction(chapter, level, interactionType, data = {}) {
    const activity = {
      type: "game_interaction",
      chapter,
      level,
      interactionType, // 'drag', 'click', 'input', 'hint_request', etc.
      data,
      timestamp: Date.now(),
      sessionId: this.currentSession.sessionId,
    };

    this.currentSession.activities.push(activity);

    // Only save to storage periodically to avoid performance issues
    if (this.currentSession.activities.length % 10 === 0) {
      this.saveToStorage("current_session", this.currentSession);
    }
  }

  // Calculate efficiency score based on performance metrics
  calculateEfficiency(score, timeSpent, attempts) {
    const baseScore = score / 100;
    const timeBonus = Math.max(0, 1 - timeSpent / 300000); // Bonus for completing under 5 minutes
    const attemptPenalty = Math.max(0, 1 - (attempts - 1) * 0.1); // Penalty for multiple attempts

    return Math.round(
      (baseScore * 0.6 + timeBonus * 0.2 + attemptPenalty * 0.2) * 100
    );
  }

  // Update comprehensive user statistics
  updateUserStatistics(username, completionActivity) {
    const userStats = this.getUserStatistics(username);
    const { chapter, level, metrics } = completionActivity;

    // Update basic counters
    userStats.totalLevelsCompleted += 1;
    userStats.totalTimeSpent += metrics.timeSpent;
    userStats.totalScore += metrics.score;
    userStats.totalAttempts += metrics.attempts;
    userStats.totalHintsUsed += metrics.hintsUsed;
    userStats.totalErrors += metrics.errorsCount;

    // Update averages
    userStats.averageScore = Math.round(
      userStats.totalScore / userStats.totalLevelsCompleted
    );
    userStats.averageTimePerLevel = Math.round(
      userStats.totalTimeSpent / userStats.totalLevelsCompleted
    );
    userStats.averageEfficiency = this.calculateAverageEfficiency(username);

    // Update chapter-specific stats
    if (!userStats.chapterStats[chapter]) {
      userStats.chapterStats[chapter] = {
        levelsCompleted: 0,
        totalScore: 0,
        totalTime: 0,
        averageScore: 0,
        bestScore: 0,
        perfectScores: 0,
      };
    }

    const chapterStats = userStats.chapterStats[chapter];
    chapterStats.levelsCompleted += 1;
    chapterStats.totalScore += metrics.score;
    chapterStats.totalTime += metrics.timeSpent;
    chapterStats.averageScore = Math.round(
      chapterStats.totalScore / chapterStats.levelsCompleted
    );
    chapterStats.bestScore = Math.max(chapterStats.bestScore, metrics.score);

    if (metrics.perfectScore) {
      chapterStats.perfectScores += 1;
      userStats.totalPerfectScores += 1;
    }

    // Update streak tracking
    this.updateStreakData(userStats);

    // Update learning patterns
    this.updateLearningPatterns(userStats, completionActivity);

    // Save updated statistics
    this.saveToStorage(`user_stats_${username}`, userStats);

    console.log(`📊 Analytics: Updated stats for ${username}`, userStats);
  }

  // Update streak tracking
  updateStreakData(userStats) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (
      userStats.lastPlayedDate === yesterday ||
      userStats.lastPlayedDate === today
    ) {
      if (userStats.lastPlayedDate !== today) {
        userStats.currentStreak += 1;
      }
    } else if (userStats.lastPlayedDate !== today) {
      userStats.currentStreak = 1;
    }

    userStats.longestStreak = Math.max(
      userStats.longestStreak,
      userStats.currentStreak
    );
    userStats.lastPlayedDate = today;
  }

  // Update learning patterns analysis
  updateLearningPatterns(userStats, completionActivity) {
    const { chapter, level, metrics } = completionActivity;
    const hour = new Date().getHours();

    // Track preferred learning times
    if (!userStats.learningPatterns.timeOfDay[hour]) {
      userStats.learningPatterns.timeOfDay[hour] = 0;
    }
    userStats.learningPatterns.timeOfDay[hour] += 1;

    // Track difficulty patterns
    const difficulty = this.assessLevelDifficulty(metrics);
    if (!userStats.learningPatterns.difficultyPerformance[difficulty]) {
      userStats.learningPatterns.difficultyPerformance[difficulty] = {
        attempts: 0,
        averageScore: 0,
        totalScore: 0,
      };
    }

    const diffPattern =
      userStats.learningPatterns.difficultyPerformance[difficulty];
    diffPattern.attempts += 1;
    diffPattern.totalScore += metrics.score;
    diffPattern.averageScore = Math.round(
      diffPattern.totalScore / diffPattern.attempts
    );

    // Track session length preferences
    const sessionLength = Date.now() - this.sessionStartTime;
    userStats.learningPatterns.averageSessionLength =
      (userStats.learningPatterns.averageSessionLength + sessionLength) / 2;
  }

  // Assess level difficulty based on performance metrics
  assessLevelDifficulty(metrics) {
    const { score, attempts, timeSpent, hintsUsed } = metrics;

    let difficultyScore = 0;

    // Score-based difficulty (lower score = higher difficulty)
    if (score < 60) difficultyScore += 3;
    else if (score < 80) difficultyScore += 2;
    else if (score < 95) difficultyScore += 1;

    // Attempts-based difficulty
    if (attempts > 3) difficultyScore += 2;
    else if (attempts > 1) difficultyScore += 1;

    // Time-based difficulty (longer time = higher difficulty)
    if (timeSpent > 300000) difficultyScore += 2; // 5+ minutes
    else if (timeSpent > 120000) difficultyScore += 1; // 2+ minutes

    // Hints-based difficulty
    if (hintsUsed > 2) difficultyScore += 2;
    else if (hintsUsed > 0) difficultyScore += 1;

    if (difficultyScore >= 6) return "very_hard";
    if (difficultyScore >= 4) return "hard";
    if (difficultyScore >= 2) return "medium";
    return "easy";
  }

  // Get user statistics with defaults
  getUserStatistics(username) {
    const defaultStats = {
      username,
      totalLevelsCompleted: 0,
      totalTimeSpent: 0,
      totalScore: 0,
      totalAttempts: 0,
      totalHintsUsed: 0,
      totalErrors: 0,
      totalPerfectScores: 0,
      averageScore: 0,
      averageTimePerLevel: 0,
      averageEfficiency: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
      chapterStats: {},
      learningPatterns: {
        timeOfDay: {},
        difficultyPerformance: {},
        averageSessionLength: 0,
        preferredGameTypes: {},
      },
      achievements: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    const stored = this.getFromStorage(`user_stats_${username}`);
    return stored
      ? { ...defaultStats, ...stored, lastUpdated: Date.now() }
      : defaultStats;
  }

  // Calculate average efficiency across all completed levels
  calculateAverageEfficiency(username) {
    const activities = this.getAllUserActivities(username);
    const completions = activities.filter((a) => a.type === "level_complete");

    if (completions.length === 0) return 0;

    const totalEfficiency = completions.reduce((sum, activity) => {
      return sum + (activity.metrics?.efficiency || 0);
    }, 0);

    return Math.round(totalEfficiency / completions.length);
  }

  // Get all activities for a user
  getAllUserActivities(username) {
    const allActivities = [];

    // Get current session activities
    if (this.currentSession.activities) {
      allActivities.push(
        ...this.currentSession.activities.filter((a) => a.username === username)
      );
    }

    // Get stored session activities
    const storedSessions = this.getFromStorage("all_sessions") || [];
    storedSessions.forEach((session) => {
      if (session.activities) {
        allActivities.push(
          ...session.activities.filter((a) => a.username === username)
        );
      }
    });

    return allActivities.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Generate comprehensive progress report
  generateProgressReport(username) {
    const userStats = this.getUserStatistics(username);
    const activities = this.getAllUserActivities(username);

    const report = {
      user: username,
      generatedAt: Date.now(),
      summary: {
        totalLevelsCompleted: userStats.totalLevelsCompleted,
        averageScore: userStats.averageScore,
        totalTimeSpent: this.formatTime(userStats.totalTimeSpent),
        currentStreak: userStats.currentStreak,
        longestStreak: userStats.longestStreak,
        efficiency: userStats.averageEfficiency,
      },
      chapterProgress: this.generateChapterProgressReport(userStats),
      learningPatterns: this.analyzeLearningPatterns(userStats),
      recommendations: this.generateRecommendations(userStats),
      achievements: this.checkAchievements(userStats),
      recentActivity: activities.slice(-10).reverse(),
    };

    return report;
  }

  // Generate chapter-specific progress report
  generateChapterProgressReport(userStats) {
    const chapterReport = {};

    Object.entries(userStats.chapterStats).forEach(([chapter, stats]) => {
      chapterReport[chapter] = {
        ...stats,
        completionRate: Math.round((stats.levelsCompleted / 5) * 100), // Assuming 5 levels per chapter
        performance: this.assessChapterPerformance(stats),
        timeFormatted: this.formatTime(stats.totalTime),
      };
    });

    return chapterReport;
  }

  // Analyze learning patterns
  analyzeLearningPatterns(userStats) {
    const patterns = userStats.learningPatterns;

    // Find preferred learning time
    const timeEntries = Object.entries(patterns.timeOfDay);
    const preferredTime =
      timeEntries.length > 0
        ? timeEntries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;

    // Analyze difficulty performance
    const difficultyAnalysis = {};
    Object.entries(patterns.difficultyPerformance).forEach(
      ([difficulty, data]) => {
        difficultyAnalysis[difficulty] = {
          ...data,
          performance:
            data.averageScore >= 80
              ? "strong"
              : data.averageScore >= 60
              ? "moderate"
              : "needs_improvement",
        };
      }
    );

    return {
      preferredLearningHour: preferredTime
        ? `${preferredTime}:00`
        : "Not enough data",
      averageSessionLength: this.formatTime(patterns.averageSessionLength),
      difficultyPerformance: difficultyAnalysis,
      consistencyScore: this.calculateConsistencyScore(userStats),
    };
  }

  // Calculate consistency score based on streak and regular play
  calculateConsistencyScore(userStats) {
    const streakScore = Math.min(userStats.currentStreak * 10, 50);
    const regularityScore =
      userStats.totalLevelsCompleted > 0
        ? Math.min((userStats.totalLevelsCompleted / 25) * 50, 50)
        : 0;

    return Math.round(streakScore + regularityScore);
  }

  // Generate personalized recommendations
  generateRecommendations(userStats) {
    const recommendations = [];

    // Performance-based recommendations
    if (userStats.averageScore < 70) {
      recommendations.push({
        type: "improvement",
        message:
          "Try reviewing the educational facts before starting each level to improve your scores.",
        priority: "high",
      });
    }

    // Streak-based recommendations
    if (userStats.currentStreak === 0) {
      recommendations.push({
        type: "engagement",
        message:
          "Start a new learning streak! Complete one level today to begin.",
        priority: "medium",
      });
    } else if (userStats.currentStreak >= 7) {
      recommendations.push({
        type: "celebration",
        message: `Amazing! You're on a ${userStats.currentStreak}-day streak. Keep it up!`,
        priority: "low",
      });
    }

    // Chapter-specific recommendations
    const chapterScores = Object.entries(userStats.chapterStats);
    if (chapterScores.length > 0) {
      const weakestChapter = chapterScores.reduce((a, b) =>
        a[1].averageScore < b[1].averageScore ? a : b
      );

      if (weakestChapter[1].averageScore < 75) {
        recommendations.push({
          type: "review",
          message: `Consider reviewing Chapter ${weakestChapter[0]} - your average score there is ${weakestChapter[1].averageScore}%.`,
          priority: "medium",
        });
      }
    }

    return recommendations;
  }

  // Check and award achievements
  checkAchievements(userStats) {
    const achievements = [];

    // First completion achievement
    if (
      userStats.totalLevelsCompleted >= 1 &&
      !userStats.achievements.includes("first_steps")
    ) {
      achievements.push({
        id: "first_steps",
        name: "First Steps",
        description: "Completed your first level!",
        icon: "🎯",
        earnedAt: Date.now(),
      });
    }

    // Perfect score achievement
    if (
      userStats.totalPerfectScores >= 1 &&
      !userStats.achievements.includes("perfectionist")
    ) {
      achievements.push({
        id: "perfectionist",
        name: "Perfectionist",
        description: "Achieved a perfect score!",
        icon: "⭐",
        earnedAt: Date.now(),
      });
    }

    // Streak achievements
    if (
      userStats.currentStreak >= 7 &&
      !userStats.achievements.includes("week_warrior")
    ) {
      achievements.push({
        id: "week_warrior",
        name: "Week Warrior",
        description: "Maintained a 7-day learning streak!",
        icon: "🔥",
        earnedAt: Date.now(),
      });
    }

    // Chapter completion achievements
    Object.entries(userStats.chapterStats).forEach(([chapter, stats]) => {
      const achievementId = `chapter_${chapter}_master`;
      if (
        stats.levelsCompleted >= 5 &&
        !userStats.achievements.includes(achievementId)
      ) {
        achievements.push({
          id: achievementId,
          name: `Chapter ${chapter} Master`,
          description: `Completed all levels in Chapter ${chapter}!`,
          icon: "🏆",
          earnedAt: Date.now(),
        });
      }
    });

    return achievements;
  }

  // Assess chapter performance
  assessChapterPerformance(chapterStats) {
    if (chapterStats.averageScore >= 90) return "excellent";
    if (chapterStats.averageScore >= 80) return "good";
    if (chapterStats.averageScore >= 70) return "fair";
    return "needs_improvement";
  }

  // Format time in a human-readable way
  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // End current session and save to history
  endSession() {
    this.currentSession.endTime = Date.now();
    this.currentSession.totalTimeSpent =
      this.currentSession.endTime - this.currentSession.startTime;

    // Save session to history
    const allSessions = this.getFromStorage("all_sessions") || [];
    allSessions.push(this.currentSession);

    // Keep only last 50 sessions to prevent storage bloat
    if (allSessions.length > 50) {
      allSessions.splice(0, allSessions.length - 50);
    }

    this.saveToStorage("all_sessions", allSessions);

    console.log("📊 Analytics: Session ended", {
      sessionId: this.currentSession.sessionId,
      duration: this.formatTime(this.currentSession.totalTimeSpent),
      activitiesCount: this.currentSession.activities.length,
    });
  }

  // Storage utilities
  saveToStorage(key, data) {
    try {
      localStorage.setItem(`rizal_analytics_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn("Analytics: Failed to save to storage", error);
    }
  }

  getFromStorage(key) {
    try {
      const data = localStorage.getItem(`rizal_analytics_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Analytics: Failed to read from storage", error);
      return null;
    }
  }

  // Export user data for backup
  exportUserData(username) {
    return {
      statistics: this.getUserStatistics(username),
      activities: this.getAllUserActivities(username),
      progressReport: this.generateProgressReport(username),
      exportedAt: Date.now(),
    };
  }
}

// Create singleton instance
const analyticsManager = new AnalyticsManager();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  analyticsManager.endSession();
});

export default analyticsManager;
