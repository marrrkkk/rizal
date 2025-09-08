/**
 * User-specific Progress Management System
 * Saves level and progress data along with username/ID to local files
 */

import { getProgress, saveProgress, chapterConfigs } from "./progressManager";

// Base directory for user progress files
const PROGRESS_DIR = "user_progress";
const FILE_EXTENSION = ".json";

/**
 * Create user-specific storage key
 * @param {string} username - The username or user ID
 * @returns {string} - Storage key for the user
 */
const getUserStorageKey = (username) => {
  if (!username) {
    throw new Error("Username is required for user-specific progress");
  }
  return `rizal_progress_${username.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
};

/**
 * Get user-specific progress from localStorage
 * @param {string} username - The username or user ID
 * @returns {Object} - User's progress data
 */
export const getUserProgress = (username) => {
  try {
    const storageKey = getUserStorageKey(username);
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const progress = JSON.parse(stored);
      return {
        ...progress,
        username,
        lastAccessed: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error(`Error loading progress for user ${username}:`, error);
  }

  // Return default progress with user info
  return createDefaultUserProgress(username);
};

/**
 * Save user-specific progress to localStorage
 * @param {string} username - The username or user ID
 * @param {Object} progressData - The progress data to save
 * @returns {boolean} - Success status
 */
export const saveUserProgress = (username, progressData) => {
  try {
    const storageKey = getUserStorageKey(username);
    const userProgress = {
      ...progressData,
      username,
      lastSaved: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(userProgress));

    // Also save to a file if possible (for backup)
    saveProgressToFile(username, userProgress);

    return true;
  } catch (error) {
    console.error(`Error saving progress for user ${username}:`, error);
    return false;
  }
};

/**
 * Create default progress structure for a new user
 * @param {string} username - The username or user ID
 * @returns {Object} - Default progress structure
 */
const createDefaultUserProgress = (username) => {
  const now = new Date().toISOString();

  return {
    username,
    userId: username, // Can be enhanced to use actual user ID
    createdAt: now,
    lastSaved: now,
    lastAccessed: now,
    chapters: {
      1: {
        unlockedLevels: [1],
        completedLevels: [],
        scores: {},
        badges: [],
        completionDate: null,
        timeSpent: 0, // in seconds
        attempts: {},
      },
      2: {
        unlockedLevels: [],
        completedLevels: [],
        scores: {},
        badges: [],
        completionDate: null,
        timeSpent: 0,
        attempts: {},
      },
      3: {
        unlockedLevels: [],
        completedLevels: [],
        scores: {},
        badges: [],
        completionDate: null,
        timeSpent: 0,
        attempts: {},
      },
      4: {
        unlockedLevels: [],
        completedLevels: [],
        scores: {},
        badges: [],
        completionDate: null,
        timeSpent: 0,
        attempts: {},
      },
      5: {
        unlockedLevels: [],
        completedLevels: [],
        scores: {},
        badges: [],
        completionDate: null,
        timeSpent: 0,
        attempts: {},
      },
    },
    overall: {
      totalLevels: 25,
      completedLevels: 0,
      averageScore: 0,
      badges: [],
      lastPlayed: null,
      firstLevelCompleted: null,
      totalTimeSpent: 0,
      totalAttempts: 0,
      achievements: {
        perfectScores: 0,
        levelsInSession: 0,
        sessionStartTime: null,
        consecutiveDays: 0,
        lastPlayDate: null,
        streakRecord: 0,
      },
      statistics: {
        gamesPlayed: 0,
        averageTimePerLevel: 0,
        favoriteChapter: null,
        strongestSubject: null,
      },
    },
  };
};

/**
 * Complete a level for a specific user
 * @param {string} username - The username or user ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @param {number} score - Score achieved (0-100)
 * @param {number} timeSpent - Time spent in seconds
 * @returns {Object} - Result with success status and new badges
 */
export const completeUserLevel = (
  username,
  chapterId,
  levelId,
  score = 0,
  timeSpent = 0
) => {
  const progress = getUserProgress(username);
  const chapter = progress.chapters[chapterId];
  const newBadges = [];

  if (!chapter) {
    console.error(`Chapter ${chapterId} not found for user ${username}`);
    return { success: false, newBadges: [] };
  }

  const isFirstCompletion = !chapter.completedLevels.includes(levelId);

  // Track attempts
  if (!chapter.attempts[levelId]) {
    chapter.attempts[levelId] = 0;
  }
  chapter.attempts[levelId]++;
  progress.overall.totalAttempts++;

  // Add to completed levels if not already completed
  if (isFirstCompletion) {
    chapter.completedLevels.push(levelId);
    progress.overall.completedLevels++;

    // Track session progress
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

  // Update score (keep highest score)
  const previousScore = chapter.scores[levelId] || 0;
  chapter.scores[levelId] = Math.max(previousScore, score);

  // Update time spent
  chapter.timeSpent += timeSpent;
  progress.overall.totalTimeSpent += timeSpent;

  // Update statistics
  progress.overall.statistics.gamesPlayed++;
  if (progress.overall.completedLevels > 0) {
    progress.overall.statistics.averageTimePerLevel = Math.round(
      progress.overall.totalTimeSpent / progress.overall.completedLevels
    );
  }

  // Check for perfect score badge
  if (score === 100) {
    progress.overall.achievements.perfectScores++;
    if (!progress.overall.badges.includes("perfect_score")) {
      progress.overall.badges.push("perfect_score");
      newBadges.push("perfect_score");
    }
  }

  // Unlock next level in same chapter
  const nextLevel = levelId + 1;
  const chapterConfig = chapterConfigs[chapterId];
  if (
    nextLevel <= chapterConfig.totalLevels &&
    !chapter.unlockedLevels.includes(nextLevel)
  ) {
    chapter.unlockedLevels.push(nextLevel);
  }

  // If chapter is complete, unlock first level of next chapter
  if (chapter.completedLevels.length === chapterConfig.totalLevels) {
    const nextChapter = chapterId + 1;
    if (chapterConfigs[nextChapter] && progress.chapters[nextChapter]) {
      if (!progress.chapters[nextChapter].unlockedLevels.includes(1)) {
        progress.chapters[nextChapter].unlockedLevels.push(1);
      }
    }

    // Award chapter completion badge
    const chapterBadge = `chapter_${chapterId}_complete`;
    if (!chapter.badges.includes(chapterBadge)) {
      chapter.badges.push(chapterBadge);
      chapter.completionDate = new Date().toISOString();
      newBadges.push(chapterBadge);
    }
  }

  // Check for milestone badges
  checkUserMilestoneBadges(progress, newBadges);

  // Update overall progress
  updateUserOverallProgress(progress);

  // Save progress
  const saved = saveUserProgress(username, progress);

  if (saved) {
    console.log(
      `User ${username}: Level ${levelId} of Chapter ${chapterId} completed with score ${score}`
    );
    return { success: true, newBadges, progress };
  }

  return { success: false, newBadges: [] };
};

/**
 * Check for milestone badges specific to user progress
 * @param {Object} progress - User's progress data
 * @param {Array} newBadges - Array to add new badges to
 */
const checkUserMilestoneBadges = (progress, newBadges) => {
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

  // Efficiency badge (average time per level < 2 minutes)
  if (
    progress.overall.statistics.averageTimePerLevel > 0 &&
    progress.overall.statistics.averageTimePerLevel < 120 &&
    totalCompleted >= 5 &&
    !progress.overall.badges.includes("efficiency_master")
  ) {
    progress.overall.badges.push("efficiency_master");
    newBadges.push("efficiency_master");
  }

  // Persistence badge (completed a level after 3+ attempts)
  const hasPersistedLevel = Object.values(progress.chapters).some((chapter) =>
    Object.values(chapter.attempts).some((attempts) => attempts >= 3)
  );

  if (
    hasPersistedLevel &&
    !progress.overall.badges.includes("persistent_learner")
  ) {
    progress.overall.badges.push("persistent_learner");
    newBadges.push("persistent_learner");
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

  // Check consecutive days
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

    // Update streak record
    if (
      progress.overall.achievements.consecutiveDays >
      progress.overall.achievements.streakRecord
    ) {
      progress.overall.achievements.streakRecord =
        progress.overall.achievements.consecutiveDays;
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

    // Marathon badge (30 consecutive days)
    if (
      progress.overall.achievements.consecutiveDays >= 30 &&
      !progress.overall.badges.includes("marathon_learner")
    ) {
      progress.overall.badges.push("marathon_learner");
      newBadges.push("marathon_learner");
    }
  }
};

/**
 * Update overall progress statistics for user
 * @param {Object} progress - User's progress data
 */
const updateUserOverallProgress = (progress) => {
  let totalScore = 0;
  let scoreCount = 0;
  let chapterTimes = {};

  Object.keys(progress.chapters).forEach((chapterId) => {
    const chapter = progress.chapters[chapterId];
    chapterTimes[chapterId] = chapter.timeSpent;

    Object.values(chapter.scores).forEach((score) => {
      totalScore += score;
      scoreCount++;
    });
  });

  progress.overall.averageScore =
    scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
  progress.overall.lastPlayed = new Date().toISOString();

  // Determine favorite chapter (most time spent)
  const favoriteChapterId = Object.keys(chapterTimes).reduce((a, b) =>
    chapterTimes[a] > chapterTimes[b] ? a : b
  );
  progress.overall.statistics.favoriteChapter = parseInt(favoriteChapterId);

  // Determine strongest subject (highest average score)
  let strongestChapter = null;
  let highestAverage = 0;

  Object.keys(progress.chapters).forEach((chapterId) => {
    const chapter = progress.chapters[chapterId];
    if (chapter.completedLevels.length > 0) {
      const chapterScores = Object.values(chapter.scores);
      const average =
        chapterScores.reduce((sum, score) => sum + score, 0) /
        chapterScores.length;

      if (average > highestAverage) {
        highestAverage = average;
        strongestChapter = parseInt(chapterId);
      }
    }
  });

  progress.overall.statistics.strongestSubject = strongestChapter;
};

/**
 * Save progress data to a local file (if supported by environment)
 * @param {string} username - The username or user ID
 * @param {Object} progressData - The progress data to save
 */
const saveProgressToFile = async (username, progressData) => {
  try {
    // Check if we're in a browser environment that supports File System Access API
    if ("showSaveFilePicker" in window) {
      // Modern browsers with File System Access API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `rizal_progress_${username}_${
          new Date().toISOString().split("T")[0]
        }.json`,
        types: [
          {
            description: "JSON files",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(progressData, null, 2));
      await writable.close();

      console.log(`Progress saved to file for user ${username}`);
    } else {
      // Fallback: Create downloadable blob
      const blob = new Blob([JSON.stringify(progressData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rizal_progress_${username}_${
        new Date().toISOString().split("T")[0]
      }.json`;

      // Auto-download is disabled by default to avoid spam
      // Uncomment the next two lines if you want automatic downloads
      // document.body.appendChild(a);
      // a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.log("File save not supported or cancelled:", error.message);
    // This is expected in many environments, so we don't treat it as an error
  }
};

/**
 * Load progress data from a local file
 * @param {string} username - The username or user ID
 * @returns {Promise<Object|null>} - Loaded progress data or null
 */
export const loadProgressFromFile = async (username) => {
  try {
    if ("showOpenFilePicker" in window) {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON files",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const file = await fileHandle.getFile();
      const contents = await file.text();
      const progressData = JSON.parse(contents);

      // Validate that this is progress data for the correct user
      if (progressData.username === username) {
        // Save to localStorage as well
        saveUserProgress(username, progressData);
        return progressData;
      } else {
        throw new Error("Progress file is for a different user");
      }
    }
  } catch (error) {
    console.error("Error loading progress from file:", error);
    return null;
  }
};

/**
 * Export user progress data for backup
 * @param {string} username - The username or user ID
 * @returns {Object} - User's progress data
 */
export const exportUserProgress = (username) => {
  const progress = getUserProgress(username);

  // Create a downloadable backup
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rizal_progress_backup_${username}_${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return progress;
};

/**
 * Get all users who have progress data
 * @returns {Array} - Array of usernames with progress data
 */
export const getAllUsers = () => {
  const users = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      key.startsWith("rizal_progress_") &&
      key !== "rizal_app_progress"
    ) {
      const username = key.replace("rizal_progress_", "").replace(/_/g, " ");
      users.push(username);
    }
  }

  return users;
};

/**
 * Delete user progress data
 * @param {string} username - The username or user ID
 * @returns {boolean} - Success status
 */
export const deleteUserProgress = (username) => {
  try {
    const storageKey = getUserStorageKey(username);
    localStorage.removeItem(storageKey);
    console.log(`Progress deleted for user ${username}`);
    return true;
  } catch (error) {
    console.error(`Error deleting progress for user ${username}:`, error);
    return false;
  }
};

/**
 * Get user statistics summary
 * @param {string} username - The username or user ID
 * @returns {Object} - User statistics
 */
export const getUserStatistics = (username) => {
  const progress = getUserProgress(username);

  return {
    username: progress.username,
    totalLevelsCompleted: progress.overall.completedLevels,
    totalTimeSpent: progress.overall.totalTimeSpent,
    averageScore: progress.overall.averageScore,
    totalBadges: progress.overall.badges.length,
    perfectScores: progress.overall.achievements.perfectScores,
    currentStreak: progress.overall.achievements.consecutiveDays,
    longestStreak: progress.overall.achievements.streakRecord,
    favoriteChapter: progress.overall.statistics.favoriteChapter,
    strongestSubject: progress.overall.statistics.strongestSubject,
    gamesPlayed: progress.overall.statistics.gamesPlayed,
    averageTimePerLevel: progress.overall.statistics.averageTimePerLevel,
    completionPercentage: Math.round(
      (progress.overall.completedLevels / 25) * 100
    ),
    lastPlayed: progress.overall.lastPlayed,
    accountCreated: progress.createdAt,
  };
};

// Export all functions
export default {
  getUserProgress,
  saveUserProgress,
  completeUserLevel,
  loadProgressFromFile,
  exportUserProgress,
  getAllUsers,
  deleteUserProgress,
  getUserStatistics,
  createDefaultUserProgress,
};
