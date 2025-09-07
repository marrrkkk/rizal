// Initialize progress system with default unlocked levels

import { getProgress, saveProgress } from "./progressManager";

// Initialize progress if it doesn't exist
export const initializeProgress = () => {
  try {
    const currentProgress = getProgress();

    // Check if this is a fresh install (no progress data)
    const hasAnyProgress = Object.values(currentProgress.chapters).some(
      (chapter) =>
        chapter.unlockedLevels.length > 0 || chapter.completedLevels.length > 0
    );

    // If no progress exists, ensure Chapter 1 Level 1 is unlocked
    if (!hasAnyProgress) {
      currentProgress.chapters[1].unlockedLevels = [1];
      saveProgress(currentProgress);
      console.log("Progress initialized with Chapter 1 Level 1 unlocked");
    }

    return currentProgress;
  } catch (error) {
    console.error("Error initializing progress:", error);
    return null;
  }
};

// Reset progress to initial state (for testing)
export const resetToInitialProgress = () => {
  try {
    localStorage.removeItem("rizal_app_progress");
    return initializeProgress();
  } catch (error) {
    console.error("Error resetting progress:", error);
    return null;
  }
};

export default {
  initializeProgress,
  resetToInitialProgress,
};
