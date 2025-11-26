// Fallback progress management using localStorage when API is unavailable

const STORAGE_KEY = "rizal_app_progress";

// Initialize default progress structure
const initializeDefaultProgress = () => {
  const defaultProgress = {
    chapters: {},
    overall: {
      totalLevels: 30,
      completedLevels: 0,
      averageScore: 0,
      badges: [],
      lastPlayed: null,
      currentStreak: 0,
      longestStreak: 0,
    },
    badges: [],
  };

  // Initialize all chapters with all levels unlocked
  for (let i = 1; i <= 6; i++) {
    defaultProgress.chapters[i] = {
      unlockedLevels: [1, 2, 3, 4, 5], // All levels unlocked
      completedLevels: [],
      scores: {},
      badges: [],
    };
  }

  return defaultProgress;
};

// Get progress from localStorage
export const getLocalProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      // Ensure all required properties exist
      return {
        ...initializeDefaultProgress(),
        ...progress,
        chapters: {
          ...initializeDefaultProgress().chapters,
          ...progress.chapters,
        },
      };
    }
  } catch (error) {
    console.warn("Error reading local progress:", error);
  }
  return initializeDefaultProgress();
};

// Save progress to localStorage
export const saveLocalProgress = (progressData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    return true;
  } catch (error) {
    console.error("Error saving local progress:", error);
    return false;
  }
};

// Complete a level using localStorage
export const completeLocalLevel = (chapter, level, score = 0) => {
  const progress = getLocalProgress();
  const chapterData = progress.chapters[chapter];

  if (!chapterData) {
    console.error(`Chapter ${chapter} not found`);
    return { success: false, error: "Chapter not found" };
  }

  // Mark level as completed
  if (!chapterData.completedLevels.includes(level)) {
    chapterData.completedLevels.push(level);
    chapterData.scores[level] = score;

    // Update overall stats
    progress.overall.completedLevels = Object.values(progress.chapters).reduce(
      (total, ch) => total + ch.completedLevels.length,
      0
    );

    // Calculate average score
    const allScores = Object.values(progress.chapters).flatMap((ch) =>
      Object.values(ch.scores)
    );
    progress.overall.averageScore =
      allScores.length > 0
        ? Math.round(
          allScores.reduce((sum, s) => sum + s, 0) / allScores.length
        )
        : 0;

    progress.overall.lastPlayed = new Date().toISOString();
  }

  // Check if this completes the chapter
  let chapterComplete = false;
  if (chapterData.completedLevels.length >= 5) {
    chapterComplete = true;

    // Add chapter completion badge if not already earned
    const chapterBadge = `chapter_${chapter}_complete`;
    if (!progress.overall.badges.includes(chapterBadge)) {
      progress.overall.badges.push(chapterBadge);
      progress.badges.push({
        badge_type: chapterBadge,
        badge_name: `Chapter ${chapter} Complete`,
        earned_date: new Date().toISOString(),
      });
    }
  }

  // Save updated progress
  const saved = saveLocalProgress(progress);

  if (saved) {
    return {
      success: true,
      newBadges: chapterComplete ? [`chapter_${chapter}_complete`] : [],
      chapterComplete,
      progress, // Include full progress for reference
    };
  } else {
    return { success: false, error: "Failed to save progress" };
  }
};

// Check if level is unlocked
export const isLocalLevelUnlocked = (chapterId, levelId) => {
  const progress = getLocalProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.unlockedLevels.includes(levelId) : false;
};

// Check if level is completed
export const isLocalLevelCompleted = (chapterId, levelId) => {
  const progress = getLocalProgress();
  const chapter = progress.chapters[chapterId];
  return chapter ? chapter.completedLevels.includes(levelId) : false;
};

// Get level score
export const getLocalLevelScore = (chapterId, levelId) => {
  const progress = getLocalProgress();
  const chapter = progress.chapters[chapterId];
  return chapter && chapter.scores ? chapter.scores[levelId] || 0 : 0;
};

// Reset progress (for testing)
export const resetLocalProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  return initializeDefaultProgress();
};

// Unlock all levels (for testing)
export const unlockAllLocalLevels = () => {
  const progress = getLocalProgress();

  for (let chapter = 1; chapter <= 6; chapter++) {
    progress.chapters[chapter].unlockedLevels = [1, 2, 3, 4, 5];
  }

  saveLocalProgress(progress);
  return progress;
};

export default {
  getLocalProgress,
  saveLocalProgress,
  completeLocalLevel,
  isLocalLevelUnlocked,
  isLocalLevelCompleted,
  getLocalLevelScore,
  resetLocalProgress,
  unlockAllLocalLevels,
};
