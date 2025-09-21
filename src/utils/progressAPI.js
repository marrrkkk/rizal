// API utilities for progress management with backend database

const API_BASE_URL = "http://localhost/rizal/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Initialize user progress (called on first login)
export const initializeUserProgress = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/progress/initialize_progress.php`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to initialize progress:", error);
    return { success: false, error: error.message };
  }
};

// Get user progress from database
export const getUserProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/get_progress.php`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get progress:", error);
    return { success: false, error: error.message };
  }
};

// Complete a level and update progress
export const completeLevel = async (
  chapter,
  level,
  score = 0,
  timeSpent = 0
) => {
  try {
    console.log(`🌐 Sending request to complete level ${chapter}-${level}`);
    console.log(`🌐 Request data:`, { chapter, level, score, timeSpent });

    const response = await fetch(
      `${API_BASE_URL}/progress/complete_level.php`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chapter,
          level,
          score,
          timeSpent,
        }),
      }
    );

    console.log(`🌐 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🌐 HTTP Error Response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`🌐 Response data:`, data);
    return { success: true, data };
  } catch (error) {
    console.error("🌐 Failed to complete level:", error);
    return { success: false, error: error.message };
  }
};

// Check if a level is unlocked
export const isLevelUnlocked = (progressData, chapterId, levelId) => {
  if (!progressData || !progressData.chapters) return false;

  const chapter = progressData.chapters[chapterId];
  if (!chapter) return false;

  return chapter.unlockedLevels.includes(levelId);
};

// Check if a level is completed
export const isLevelCompleted = (progressData, chapterId, levelId) => {
  if (!progressData || !progressData.chapters) return false;

  const chapter = progressData.chapters[chapterId];
  if (!chapter) return false;

  return chapter.completedLevels.includes(levelId);
};

// Get level score
export const getLevelScore = (progressData, chapterId, levelId) => {
  if (!progressData || !progressData.chapters) return 0;

  const chapter = progressData.chapters[chapterId];
  if (!chapter || !chapter.scores) return 0;

  return chapter.scores[levelId] || 0;
};

// Get chapter progress summary
export const getChapterProgress = (progressData, chapterId) => {
  if (!progressData || !progressData.chapters) return null;

  const chapter = progressData.chapters[chapterId];
  if (!chapter) return null;

  const chapterNames = {
    1: "Childhood in Calamba",
    2: "Education in Manila",
    3: "Studies Abroad",
    4: "Noli Me Tangere",
    5: "Return to the Philippines",
  };

  return {
    chapterId,
    name: chapterNames[chapterId] || `Chapter ${chapterId}`,
    totalLevels: 5,
    unlockedLevels: chapter.unlockedLevels.length,
    completedLevels: chapter.completedLevels.length,
    isComplete: chapter.completedLevels.length >= 5,
    badges: chapter.badges || [],
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

// Get overall progress summary
export const getOverallProgress = (progressData) => {
  if (!progressData || !progressData.overall) return null;

  return {
    ...progressData.overall,
    completionPercentage:
      progressData.overall.totalLevels > 0
        ? Math.round(
            (progressData.overall.completedLevels /
              progressData.overall.totalLevels) *
              100
          )
        : 0,
  };
};

// Get all user badges
export const getAllBadges = (progressData) => {
  if (!progressData || !progressData.badges) return [];
  return progressData.badges;
};

// Development/testing utilities
export const resetProgress = async () => {
  console.warn("Reset progress is not implemented for database backend");
  return { success: false, error: "Not implemented for database backend" };
};

export const unlockAllLevels = async () => {
  console.warn("Unlock all levels is not implemented for database backend");
  return { success: false, error: "Not implemented for database backend" };
};

export default {
  initializeUserProgress,
  getUserProgress,
  completeLevel,
  isLevelUnlocked,
  isLevelCompleted,
  getLevelScore,
  getChapterProgress,
  getOverallProgress,
  getAllBadges,
  resetProgress,
  unlockAllLevels,
};
