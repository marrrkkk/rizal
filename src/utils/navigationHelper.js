// Navigation helper utility for consistent navigation across the app

import { isLevelUnlocked } from "./progressManager";

// Navigation paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHAPTER: (chapterId) => `/chapter/${chapterId}`,
  LEVEL: (chapterId, levelId) => `/chapter/${chapterId}/level/${levelId}`,
};

// Chapter information
export const CHAPTERS = {
  1: { name: "Childhood in Calamba", totalLevels: 5 },
  2: { name: "Education Years", totalLevels: 5 },
  3: { name: "European Journey", totalLevels: 5 },
  4: { name: "Noli Me Tangere", totalLevels: 5 },
  5: { name: "Return & Legacy", totalLevels: 5 },
};

// Navigation helper class
class NavigationHelper {
  constructor(navigate) {
    this.navigate = navigate;
  }

  // Navigate to home
  goHome() {
    this.navigate(ROUTES.HOME);
  }

  // Navigate to chapter
  goToChapter(chapterId) {
    if (this.isValidChapter(chapterId)) {
      this.navigate(ROUTES.CHAPTER(chapterId));
    } else {
      console.error(`Invalid chapter ID: ${chapterId}`);
      this.goHome();
    }
  }

  // Navigate to level with validation
  goToLevel(chapterId, levelId, force = false) {
    if (!this.isValidChapter(chapterId)) {
      console.error(`Invalid chapter ID: ${chapterId}`);
      this.goHome();
      return false;
    }

    if (!this.isValidLevel(chapterId, levelId)) {
      console.error(`Invalid level ID: ${levelId} for chapter ${chapterId}`);
      this.goToChapter(chapterId);
      return false;
    }

    // Check if level is unlocked (unless forced)
    // Lock check removed to allow playing all levels
    /* if (!force && !isLevelUnlocked(chapterId, levelId)) {
      console.warn(`Level ${levelId} of chapter ${chapterId} is locked`);
      this.showLockedLevelMessage(chapterId, levelId);
      return false;
    } */

    this.navigate(ROUTES.LEVEL(chapterId, levelId));
    return true;
  }

  // Navigate to next level
  goToNextLevel(currentChapterId, currentLevelId) {
    const nextLevel = currentLevelId + 1;
    const chapter = CHAPTERS[currentChapterId];

    // Check if there's a next level in current chapter
    if (nextLevel <= chapter.totalLevels) {
      return this.goToLevel(currentChapterId, nextLevel);
    }

    // Check if there's a next chapter
    const nextChapter = currentChapterId + 1;
    if (CHAPTERS[nextChapter]) {
      return this.goToLevel(nextChapter, 1);
    }

    // No more levels, go to current chapter
    this.goToChapter(currentChapterId);
    return false;
  }

  // Navigate to previous level
  goToPreviousLevel(currentChapterId, currentLevelId) {
    const prevLevel = currentLevelId - 1;

    // Check if there's a previous level in current chapter
    if (prevLevel >= 1) {
      return this.goToLevel(currentChapterId, prevLevel, true); // Force unlock for going back
    }

    // Check if there's a previous chapter
    const prevChapter = currentChapterId - 1;
    if (CHAPTERS[prevChapter]) {
      const prevChapterLevels = CHAPTERS[prevChapter].totalLevels;
      return this.goToLevel(prevChapter, prevChapterLevels, true); // Force unlock for going back
    }

    // No previous levels, go to current chapter
    this.goToChapter(currentChapterId);
    return false;
  }

  // Navigate back with fallback
  goBack(fallbackRoute = null) {
    if (window.history.length > 1) {
      window.history.back();
    } else if (fallbackRoute) {
      this.navigate(fallbackRoute);
    } else {
      this.goHome();
    }
  }

  // Validation helpers
  isValidChapter(chapterId) {
    return CHAPTERS.hasOwnProperty(chapterId);
  }

  isValidLevel(chapterId, levelId) {
    const chapter = CHAPTERS[chapterId];
    return chapter && levelId >= 1 && levelId <= chapter.totalLevels;
  }

  // Show locked level message
  showLockedLevelMessage(chapterId, levelId) {
    // This could be enhanced to show a modal or toast
    alert(`Level ${levelId} is locked. Complete previous levels to unlock it!`);
  }

  // Get breadcrumb navigation
  getBreadcrumbs(currentChapterId, currentLevelId = null) {
    const breadcrumbs = [{ label: "Home", path: ROUTES.HOME }];

    if (currentChapterId && this.isValidChapter(currentChapterId)) {
      const chapter = CHAPTERS[currentChapterId];
      breadcrumbs.push({
        label: `Chapter ${currentChapterId}: ${chapter.name}`,
        path: ROUTES.CHAPTER(currentChapterId),
      });

      if (
        currentLevelId &&
        this.isValidLevel(currentChapterId, currentLevelId)
      ) {
        breadcrumbs.push({
          label: `Level ${currentLevelId}`,
          path: ROUTES.LEVEL(currentChapterId, currentLevelId),
        });
      }
    }

    return breadcrumbs;
  }

  // Get navigation context for current location
  getNavigationContext(chapterId, levelId = null) {
    if (!this.isValidChapter(chapterId)) {
      return null;
    }

    const chapter = CHAPTERS[chapterId];
    const context = {
      currentChapter: {
        id: chapterId,
        name: chapter.name,
        totalLevels: chapter.totalLevels,
      },
      navigation: {
        canGoHome: true,
        canGoToChapter: true,
        canGoBack: window.history.length > 1,
      },
    };

    if (levelId && this.isValidLevel(chapterId, levelId)) {
      context.currentLevel = {
        id: levelId,
        isFirst: levelId === 1,
        isLast: levelId === chapter.totalLevels,
      };

      context.navigation.canGoToNextLevel =
        levelId < chapter.totalLevels || CHAPTERS[chapterId + 1];
      context.navigation.canGoToPreviousLevel =
        levelId > 1 || CHAPTERS[chapterId - 1];
    }

    return context;
  }
}

// Create navigation helper factory
export const createNavigationHelper = (navigate) => {
  return new NavigationHelper(navigate);
};

export default NavigationHelper;
