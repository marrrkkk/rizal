/**
 * Integration Example: Level Unlocking System
 *
 * This file demonstrates how to integrate the level unlocking system
 * into game components and pages.
 */

import {
  unlockNextLevel,
  checkLevelUnlocked,
  validateLevelAccess,
  markLevelCompleted,
  getChapterUnlockStatus,
  initializeFirstLevel,
} from "./levelUnlocking.js";
import { calculateFinalScore } from "./scoreCalculation.js";

/**
 * Example 1: Game Completion Handler
 * Call this when a user completes a game level
 */
export async function handleGameCompletion(
  userId,
  chapterId,
  levelId,
  gameState,
  levelConfig
) {
  try {
    console.log(`🎮 Completing Chapter ${chapterId}, Level ${levelId}`);

    // Step 1: Calculate final score
    const finalScore = calculateFinalScore(gameState, levelConfig);
    console.log(`📊 Final Score: ${finalScore}`);

    // Step 2: Mark level as completed
    const completed = await markLevelCompleted(
      userId,
      chapterId,
      levelId,
      gameState.score,
      finalScore
    );

    if (!completed) {
      throw new Error("Failed to mark level as completed");
    }

    // Step 3: Unlock next level
    const unlockResult = await unlockNextLevel(userId, chapterId, levelId);

    if (!unlockResult.success) {
      console.error("Failed to unlock next level:", unlockResult.error);
      return {
        success: false,
        error: unlockResult.error,
      };
    }

    // Step 4: Prepare response with notifications
    const response = {
      success: true,
      finalScore,
      levelCompleted: true,
      notifications: [],
    };

    // Add level unlock notification
    if (unlockResult.nextLevelUnlocked) {
      response.notifications.push({
        type: "level_unlock",
        message: `🎉 Level ${unlockResult.nextLevelUnlocked.level} Unlocked!`,
        data: unlockResult.nextLevelUnlocked,
      });
    }

    // Add chapter unlock notification
    if (unlockResult.nextChapterUnlocked) {
      response.notifications.push({
        type: "chapter_unlock",
        message: `🌟 Chapter ${unlockResult.nextChapterUnlocked.chapter} Unlocked!`,
        data: unlockResult.nextChapterUnlocked,
      });
    }

    // Add chapter completion notification
    if (unlockResult.chapterCompleted) {
      response.notifications.push({
        type: "chapter_complete",
        message: `🏆 Chapter ${chapterId} Completed!`,
        data: { chapterId },
      });
    }

    console.log("✅ Game completion handled successfully");
    return response;
  } catch (error) {
    console.error("❌ Error handling game completion:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Example 2: Level Access Guard
 * Call this before allowing a user to start a level
 */
export async function canUserAccessLevel(userId, chapterId, levelId) {
  try {
    const validation = await validateLevelAccess(userId, chapterId, levelId);

    if (!validation.canAccess) {
      const required = validation.requiredLevel;
      return {
        canAccess: false,
        message: `Please complete Chapter ${required.chapter}, Level ${required.level} first!`,
        requiredLevel: required,
      };
    }

    return {
      canAccess: true,
      message: "Level is accessible",
    };
  } catch (error) {
    console.error("Error checking level access:", error);
    return {
      canAccess: false,
      message: "Error checking level access",
      error: error.message,
    };
  }
}

/**
 * Example 3: Chapter Page Data Loader
 * Load all level data for a chapter page
 */
export async function loadChapterPageData(userId, chapterId) {
  try {
    // Get chapter unlock status
    const chapterStatus = await getChapterUnlockStatus(userId, chapterId);

    if (chapterStatus.error) {
      throw new Error(chapterStatus.error);
    }

    // Transform data for UI
    const levels = [];
    for (let levelId = 1; levelId <= chapterStatus.totalLevels; levelId++) {
      const levelData = chapterStatus.levels[levelId];
      levels.push({
        id: levelId,
        unlocked: levelData.unlocked,
        completed: levelData.completed,
        score: levelData.score,
        finalScore: levelData.finalScore,
        locked: !levelData.unlocked,
        // UI states
        canPlay: levelData.unlocked && !levelData.completed,
        canReplay: levelData.completed,
        showLock: !levelData.unlocked,
      });
    }

    return {
      chapterId: chapterStatus.chapterId,
      chapterName: chapterStatus.chapterName,
      totalLevels: chapterStatus.totalLevels,
      levels,
      // Summary stats
      completedCount: levels.filter((l) => l.completed).length,
      unlockedCount: levels.filter((l) => l.unlocked).length,
      isComplete: levels.every((l) => l.completed),
    };
  } catch (error) {
    console.error("Error loading chapter data:", error);
    return {
      error: error.message,
    };
  }
}

/**
 * Example 4: User Registration Handler
 * Initialize progress for a new user
 */
export async function initializeNewUser(userId) {
  try {
    console.log(`👤 Initializing new user: ${userId}`);

    // Initialize first level
    const initialized = await initializeFirstLevel(userId);

    if (!initialized) {
      throw new Error("Failed to initialize first level");
    }

    console.log("✅ User initialized successfully");
    return {
      success: true,
      message: "Welcome! Start your journey with Chapter 1, Level 1",
    };
  } catch (error) {
    console.error("❌ Error initializing user:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Example 5: Level Card Component Helper
 * Determine what to display on a level card
 */
export function getLevelCardState(levelData) {
  if (levelData.completed) {
    return {
      status: "completed",
      icon: "✅",
      buttonText: "Replay",
      buttonEnabled: true,
      showScore: true,
      className: "level-card-completed",
    };
  }

  if (levelData.unlocked) {
    return {
      status: "unlocked",
      icon: "🎮",
      buttonText: "Play",
      buttonEnabled: true,
      showScore: false,
      className: "level-card-unlocked",
    };
  }

  return {
    status: "locked",
    icon: "🔒",
    buttonText: "Locked",
    buttonEnabled: false,
    showScore: false,
    className: "level-card-locked",
  };
}

/**
 * Example 6: React Component Integration
 * Example of how to use in a React component
 */
export const LevelCardExample = `
import React, { useState, useEffect } from 'react';
import { canUserAccessLevel, handleGameCompletion } from './levelUnlockingIntegrationExample';

function LevelCard({ userId, chapterId, levelId, levelData }) {
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const result = await canUserAccessLevel(userId, chapterId, levelId);
      setCanAccess(result.canAccess);
      setLoading(false);
    }
    checkAccess();
  }, [userId, chapterId, levelId]);

  const handlePlayClick = async () => {
    if (!canAccess) {
      alert('This level is locked!');
      return;
    }
    
    // Navigate to game
    navigate(\`/chapter/\${chapterId}/level/\${levelId}\`);
  };

  const cardState = getLevelCardState(levelData);

  return (
    <div className={\`level-card \${cardState.className}\`}>
      <div className="level-icon">{cardState.icon}</div>
      <h3>Level {levelId}</h3>
      {cardState.showScore && <p>Score: {levelData.finalScore}</p>}
      <button 
        onClick={handlePlayClick}
        disabled={!cardState.buttonEnabled || loading}
      >
        {cardState.buttonText}
      </button>
    </div>
  );
}
`;

/**
 * Example 7: Game Component Integration
 * Example of how to handle completion in a game component
 */
export const GameComponentExample = `
import React, { useState } from 'react';
import { handleGameCompletion } from './levelUnlockingIntegrationExample';
import { calculateFinalScore } from './scoreCalculation';

function GameComponent({ userId, chapterId, levelId, levelConfig }) {
  const [gameState, setGameState] = useState({
    score: 0,
    hintsUsed: 0,
    startTime: new Date(),
    endTime: null,
  });

  const handleComplete = async () => {
    // Update game state with end time
    const finalGameState = {
      ...gameState,
      endTime: new Date(),
    };

    // Handle completion
    const result = await handleGameCompletion(
      userId,
      chapterId,
      levelId,
      finalGameState,
      levelConfig
    );

    if (result.success) {
      // Show notifications
      result.notifications.forEach(notification => {
        showNotification(notification.message, notification.type);
      });

      // Navigate to completion screen
      navigate('/completion', {
        state: {
          finalScore: result.finalScore,
          notifications: result.notifications,
        },
      });
    } else {
      alert('Error completing level: ' + result.error);
    }
  };

  return (
    <div className="game-container">
      {/* Game content */}
      <button onClick={handleComplete}>Complete Level</button>
    </div>
  );
}
`;

// Export all examples
export default {
  handleGameCompletion,
  canUserAccessLevel,
  loadChapterPageData,
  initializeNewUser,
  getLevelCardState,
  LevelCardExample,
  GameComponentExample,
};
