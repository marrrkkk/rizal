// Progress management utility for handling game completion and level unlocking

const STORAGE_KEY = "rizal_app_progress";

// Default progress structure
const defaultProgress = {
  chapters: {
    1: {
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [],
      scores: {},
      badges: [],
      completionDate: null,
    },
    2: {
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [],
      scores: {},
      badges: [],
      completionDate: null,
    },
    3: {
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [],
      scores: {},
      badges: [],
      completionDate: null,
    },
    4: {
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [],
      scores: {},
      badges: [],
      completionDate: null,
    },
    5: {
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [],
      scores: {},
      badges: [],
      completionDate: null,
    },
  },
  overall: {
    totalLevels: 0,
    completedLevels: 0,
    averageScore: 0,
    badges: [],
    lastPlayed: null,
    firstLevelCompleted: null,
    achievements: {
      perfectScores: 0,
      levelsInSession: 0,
      sessionStartTime: null,
      consecutiveDays: 0,
      lastPlayDate: null,
    },
  },
};

// Chapter configurations
const chapterConfigs = {
  1: { totalLevels: 5, name: "Childhood in Calamba" },
  2: { totalLevels: 5, name: "Education Years" },
  3: { totalLevels: 5, name: "European Journey" },
  4: { totalLevels: 5, name: "Noli Me Tangere" },
  5: { totalLevels: 5, name: "Return & Legacy" },
};

// Get current progress from localStorage
export const getProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      // Merge with default structure to handle any missing properties
      return mergeProgress(defaultProgress, progress);
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
  return { ...defaultProgress };
};

// Save progress to localStorage
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

// Merge progress objects to handle missing properties
const mergeProgress = (defaultObj, userObj) => {
  const merged = { ...defaultObj };

  if (userObj.chapters) {
    Object.keys(defaultObj.chapters).forEach((chapterId) => {
      if (userObj.chapters[chapterId]) {
        merged.chapters[chapterId] = {
          ...defaultObj.chapters[chapterId],
          ...userObj.chapters[chapterId],
        };
      }
    });
  }

  if (userObj.overall) {
    merged.overall = { ...defaultObj.overall, ...userObj.overall };
  }

  return merged;
};

// Complete a level
export const completeLevel = (chapterId, levelId, score = 0) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  const newBadges = [];

  if (!chapter) {
    console.error(`Chapter ${chapterId} not found`);
    return { success: false, newBadges: [] };
  }

  const isFirstCompletion = !chapter.completedLevels.includes(levelId);

  // Add to completed levels if not already completed
  if (isFirstCompletion) {
    chapter.completedLevels.push(levelId);

    // Track session progress for speed runner badge
    const now = new Date();
    if (!progress.overall.achievements.sessionStartTime) {
      progress.overall.achievements.sessionStartTime = now.toISOString();
      progress.overall.achievements.levelsInSession = 1;
    } else {
      progress.overall.achievements.levelsInSession++;
    }

    // Check for first level completion badge
    if (!progress.overall.firstLevelCompleted) {
      progress.overall.firstLevelCompleted = now.toISOString();
      if (!progress.overall.badges.includes("first_level_complete")) {
        progress.overall.badges.push("first_level_complete");
        newBadges.push("first_level_complete");
      }
    }
  }

  // Update score
  const previousScore = chapter.scores[levelId] || 0;
  chapter.scores[levelId] = Math.max(previousScore, score);

  // Check for perfect score badge
  if (score === 100 && !progress.overall.badges.includes("perfect_score")) {
    progress.overall.achievements.perfectScores++;
    progress.overall.badges.push("perfect_score");
    newBadges.push("perfect_score");
  }

  // Check if chapter is complete and award badge
  const chapterConfig = chapterConfigs[chapterId];
  if (chapter.completedLevels.length === chapterConfig.totalLevels) {
    // Award chapter completion badge
    const chapterBadge = `chapter_${chapterId}_complete`;
    if (!chapter.badges.includes(chapterBadge)) {
      chapter.badges.push(chapterBadge);
      chapter.completionDate = new Date().toISOString();
      newBadges.push(chapterBadge);
    }
  }


  // Check for milestone badges
  checkMilestoneBadges(progress, newBadges);

  // Update overall progress
  updateOverallProgress(progress);

  // Save progress
  const saved = saveProgress(progress);

  if (saved) {
    console.log(
      `Level ${levelId} of Chapter ${chapterId} completed with score ${score}`
    );
    return { success: true, newBadges };
  }

  return { success: false, newBadges: [] };
};

// Check for milestone badges
const checkMilestoneBadges = (progress, newBadges) => {
  const totalCompleted = progress.overall.completedLevels;

  // Knowledge seeker badge (10 levels)
  if (
    totalCompleted >= 10 &&
    !progress.overall.badges.includes("knowledge_seeker")
  ) {
    progress.overall.badges.push("knowledge_seeker");
    newBadges.push("knowledge_seeker");
  }

  // Speed runner badge (5 levels in one session)
  if (
    progress.overall.achievements.levelsInSession >= 5 &&
    !progress.overall.badges.includes("speed_runner")
  ) {
    progress.overall.badges.push("speed_runner");
    newBadges.push("speed_runner");
  }

  // Rizal expert badge (all chapters complete)
  const completedChapters = Object.values(progress.chapters).filter(
    (chapter) => chapter.completedLevels.length === 5
  ).length;

  if (
    completedChapters >= 5 &&
    !progress.overall.badges.includes("rizal_expert")
  ) {
    progress.overall.badges.push("rizal_expert");
    newBadges.push("rizal_expert");
  }

  // Check consecutive days (simplified version)
  const today = new Date().toDateString();
  const lastPlayDate = progress.overall.achievements.lastPlayDate;

  if (lastPlayDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastPlayDate === yesterday.toDateString()) {
      progress.overall.achievements.consecutiveDays++;
    } else {
      progress.overall.achievements.consecutiveDays = 1;
    }

    progress.overall.achievements.lastPlayDate = today;

    // Dedication badge (7 consecutive days)
    if (
      progress.overall.achievements.consecutiveDays >= 7 &&
      !progress.overall.badges.includes("dedication")
    ) {
      progress.overall.badges.push("dedication");
      newBadges.push("dedication");
    }
  }
};

// Update overall progress statistics
const updateOverallProgress = (progress) => {
  let totalCompleted = 0;
  let totalScore = 0;
  let scoreCount = 0;

  Object.keys(progress.chapters).forEach((chapterId) => {
    const chapter = progress.chapters[chapterId];
    totalCompleted += chapter.completedLevels.length;

    Object.values(chapter.scores).forEach((score) => {
      totalScore += score;
      scoreCount++;
    });
  });

  progress.overall.completedLevels = totalCompleted;
  progress.overall.totalLevels = Object.values(chapterConfigs).reduce(
    (sum, config) => sum + config.totalLevels,
    0
  );
  progress.overall.averageScore =
    scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  progress.overall.lastPlayed = new Date().toISOString();
};

// Check if a level is unlocked
export const isLevelUnlocked = (chapterId, levelId) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.unlockedLevels.includes(levelId) : false;
};

// Check if a level is completed
export const isLevelCompleted = (chapterId, levelId) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.completedLevels.includes(levelId) : false;
};

// Get level score
export const getLevelScore = (chapterId, levelId) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.scores[levelId] || 0 : 0;
};

// Get chapter progress
export const getChapterProgress = (chapterId) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  const config = chapterConfigs[chapterId];

  if (!chapter || !config) return null;

  return {
    chapterId,
    name: config.name,
    totalLevels: config.totalLevels,
    unlockedLevels: chapter.unlockedLevels.length,
    completedLevels: chapter.completedLevels.length,
    isComplete: chapter.completedLevels.length === config.totalLevels,
    badges: chapter.badges,
    averageScore:
      chapter.completedLevels.length > 0
        ? Math.round(
          Object.values(chapter.scores).reduce(
            (sum, score) => sum + score,
            0
          ) / chapter.completedLevels.length
        )
        : 0,
  };
};

// Get overall progress
export const getOverallProgress = () => {
  const progress = getProgress();
  return {
    ...progress.overall,
    completionPercentage:
      progress.overall.totalLevels > 0
        ? Math.round(
          (progress.overall.completedLevels / progress.overall.totalLevels) *
          100
        )
        : 0,
  };
};

// Reset progress (for testing or user request)
export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Progress reset successfully");
    return true;
  } catch (error) {
    console.error("Error resetting progress:", error);
    return false;
  }
};

// Unlock all levels (for development/testing)
export const unlockAllLevels = () => {
  const progress = getProgress();

  Object.keys(chapterConfigs).forEach((chapterId) => {
    const config = chapterConfigs[chapterId];
    const chapter = progress.chapters[chapterId];
    if (chapter) {
      chapter.unlockedLevels = Array.from(
        { length: config.totalLevels },
        (_, i) => i + 1
      );
    }
  });

  updateOverallProgress(progress);
  return saveProgress(progress);
};

// Get all badges for a user
export const getAllBadges = () => {
  const progress = getProgress();
  const allBadges = [...progress.overall.badges];

  // Add chapter badges
  Object.values(progress.chapters).forEach((chapter) => {
    allBadges.push(...chapter.badges);
  });

  return [...new Set(allBadges)]; // Remove duplicates
};

// Get chapter badges
export const getChapterBadges = (chapterId) => {
  const progress = getProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.badges : [];
};

// Get achievement statistics
export const getAchievementStats = () => {
  const progress = getProgress();
  return {
    totalBadges: getAllBadges().length,
    perfectScores: progress.overall.achievements.perfectScores,
    consecutiveDays: progress.overall.achievements.consecutiveDays,
    levelsInCurrentSession: progress.overall.achievements.levelsInSession,
    firstLevelCompleted: progress.overall.firstLevelCompleted,
  };
};

// Reset session tracking (call when user logs out or starts new session)
export const resetSessionTracking = () => {
  const progress = getProgress();
  progress.overall.achievements.levelsInSession = 0;
  progress.overall.achievements.sessionStartTime = null;
  return saveProgress(progress);
};

// Export legacy functions for backward compatibility
export const handleLevelComplete = completeLevel;

// Export chapter configs for use in components
export { chapterConfigs };

export default {
  getProgress,
  saveProgress,
  completeLevel,
  isLevelUnlocked,
  isLevelCompleted,
  getLevelScore,
  getChapterProgress,
  getOverallProgress,
  getAllBadges,
  getChapterBadges,
  getAchievementStats,
  resetSessionTracking,
  resetProgress,
  unlockAllLevels,
  handleLevelComplete,
  chapterConfigs,
};
