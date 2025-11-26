/**
 * Hook for managing unlock notifications
 * Provides functions to show level and chapter unlock notifications
 */

import { useState, useCallback } from "react";

export const useUnlockNotifications = () => {
  const [levelUnlock, setLevelUnlock] = useState(null);
  const [chapterUnlock, setChapterUnlock] = useState(null);

  const showLevelUnlock = useCallback((chapter, level, chapterName) => {
    setLevelUnlock({
      chapter,
      level,
      chapterName,
      timestamp: Date.now(),
    });
  }, []);

  const showChapterUnlock = useCallback((chapter, chapterName) => {
    setChapterUnlock({
      chapter,
      chapterName,
      timestamp: Date.now(),
    });
  }, []);

  const clearLevelUnlock = useCallback(() => {
    setLevelUnlock(null);
  }, []);

  const clearChapterUnlock = useCallback(() => {
    setChapterUnlock(null);
  }, []);

  const clearAllUnlocks = useCallback(() => {
    setLevelUnlock(null);
    setChapterUnlock(null);
  }, []);

  return {
    levelUnlock,
    chapterUnlock,
    showLevelUnlock,
    showChapterUnlock,
    clearLevelUnlock,
    clearChapterUnlock,
    clearAllUnlocks,
  };
};

export default useUnlockNotifications;
