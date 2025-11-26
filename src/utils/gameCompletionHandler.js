// Game completion handler
// Integrates final score calculation, persistence, statistics updates, and achievement awarding
//
// INTEGRATION GUIDE FOR GAME COMPONENTS:
// =======================================
//
// To integrate final score calculation into your game:
//
// 1. Track game state during gameplay:
//    - startTime: Store when the game starts (e.g., window.gameStartTime = Date.now())
//    - attempts: Count how many times the user tries
//    - hintsUsed: Count how many hints the user uses
//
// 2. When calling onComplete, pass the game state:
//    onComplete(score, timeSpent, {
//      attempts: attempts,
//      hintsUsed: hintsUsed,
//      startTime: new Date(window.gameStartTime),
//      endTime: new Date(),
//      accuracy: score
//    });
//
// 3. The App.jsx handleLevelComplete will automatically:
//    - Calculate the final score based on performance
//    - Save it to the database
//    - Update statistics
//    - Check and award achievements
//    - Display it in the completion modal
//
// Example implementation in a game component:
//
//   const [attempts, setAttempts] = useState(0);
//   const [hintsUsed, setHintsUsed] = useState(0);
//
//   useEffect(() => {
//     window.gameStartTime = Date.now();
//   }, []);
//
//   const handleGameComplete = () => {
//     const timeSpent = Date.now() - window.gameStartTime;
//     onComplete(score, timeSpent, {
//       attempts,
//       hintsUsed,
//       startTime: new Date(window.gameStartTime),
//       endTime: new Date(),
//       accuracy: score
//     });
//   };

import { calculateFinalScore, createGameState } from "./scoreCalculation.js";
import { saveFinalScore } from "./scorePersistence.js";
import { updateUserStatistics } from "./statisticsManager.js";
import { initDatabase } from "./database.js";
import { checkLevelCompletionAchievements } from "./achievementSystem.js";

/**
 * Handle game completion with final score calculation
 * This is the main function to call when a game is completed
 *
 * @param {Object} params - Completion parameters
 * @param {number} params.userId - User ID
 * @param {number} params.chapterId - Chapter ID
 * @param {number} params.levelId - Level ID
 * @param {number} params.score - Raw game score (0-100)
 * @param {Object} params.gameState - Game state information
 * @param {number} params.gameState.attempts - Number of attempts
 * @param {number} params.gameState.hintsUsed - Number of hints used
 * @param {Date} params.gameState.startTime - Game start time
 * @param {Date} params.gameState.endTime - Game end time
 * @param {number} params.gameState.accuracy - Accuracy percentage
 * @param {Object} params.levelConfig - Level configuration
 * @param {string} params.levelConfig.type - Level type (quiz, puzzle, etc.)
 * @param {Object} params.levelConfig.scoreWeights - Custom score weights
 * @param {number} params.levelConfig.estimatedTime - Estimated completion time
 * @returns {Promise<Object>} Result with final score and success status
 */
export const handleGameCompletion = async ({
  userId,
  chapterId,
  levelId,
  score,
  gameState = {},
  levelConfig = {},
}) => {
  try {
    // Ensure database is initialized
    await initDatabase();

    // Create complete game state
    const completeGameState = createGameState({
      score,
      attempts: gameState.attempts || 1,
      hintsUsed: gameState.hintsUsed || 0,
      startTime: gameState.startTime || new Date(),
      endTime: gameState.endTime || new Date(),
      accuracy: gameState.accuracy || 100,
    });

    // Calculate final score
    const finalScore = calculateFinalScore(completeGameState, levelConfig);

    console.log(
      `📊 Final score calculated: ${finalScore} (raw score: ${score})`
    );

    // Save final score to database
    const saveResult = await saveFinalScore(
      userId,
      chapterId,
      levelId,
      finalScore,
      {
        attempts: completeGameState.attempts,
        hintsUsed: completeGameState.hintsUsed,
      }
    );

    if (!saveResult.success) {
      console.error("Failed to save final score:", saveResult.error);
      return {
        success: false,
        error: saveResult.error,
        message: "Failed to save final score",
      };
    }

    console.log(`💾 Final score saved to database`);
    console.log(`📈 User statistics updated`);

    // Check and award achievements
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      chapterId,
      levelId,
      finalScore,
      {
        timeTaken:
          (completeGameState.endTime - completeGameState.startTime) / 1000,
        estimatedTime: levelConfig.estimatedTime || 120,
        attempts: completeGameState.attempts,
        hintsUsed: completeGameState.hintsUsed,
        previousScore: gameState.previousScore,
      }
    );

    if (newAchievements.length > 0) {
      console.log(`🏆 New achievements awarded:`, newAchievements);
    }

    return {
      success: true,
      finalScore,
      rawScore: score,
      message: "Game completed successfully",
      newAchievements,
      data: {
        userId,
        chapterId,
        levelId,
        finalScore,
        rawScore: score,
        attempts: completeGameState.attempts,
        hintsUsed: completeGameState.hintsUsed,
      },
    };
  } catch (error) {
    console.error("Error handling game completion:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to handle game completion",
    };
  }
};

/**
 * Handle game completion with simple parameters
 * Simplified version for games that don't track detailed state
 *
 * @param {number} userId - User ID
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @param {number} score - Raw game score (0-100)
 * @param {number} timeSpent - Time spent in milliseconds
 * @param {string} levelType - Level type (quiz, puzzle, etc.)
 * @returns {Promise<Object>} Result with final score
 */
export const handleSimpleGameCompletion = async (
  userId,
  chapterId,
  levelId,
  score,
  timeSpent = 0,
  levelType = "default"
) => {
  const startTime = new Date(Date.now() - timeSpent);
  const endTime = new Date();

  return await handleGameCompletion({
    userId,
    chapterId,
    levelId,
    score,
    gameState: {
      attempts: 1,
      hintsUsed: 0,
      startTime,
      endTime,
      accuracy: score,
    },
    levelConfig: {
      type: levelType,
    },
  });
};

/**
 * Get level type from chapter and level ID
 * Maps chapter/level combinations to their game types
 *
 * @param {number} chapterId - Chapter ID
 * @param {number} levelId - Level ID
 * @returns {string} Level type
 */
export const getLevelType = (chapterId, levelId) => {
  // Map of chapter/level to game type
  const levelTypeMap = {
    "1-1": "quiz", // Jose's Birth
    "1-2": "drag-drop", // Family Background
    "1-3": "quiz", // Early Childhood
    "1-4": "story", // First Teacher
    "1-5": "word-collection", // Love for Reading
    "2-1": "quiz", // Ateneo
    "2-2": "quiz", // UST
    "2-3": "timeline", // Achievements
    "2-4": "matching", // Literary Works
    "2-5": "puzzle", // Education Puzzle
    "3-1": "timeline", // European Journey
    "3-2": "puzzle", // Literary Crossword
    "3-3": "matching", // Letters Abroad
    "3-4": "quiz", // European Quiz
    "3-5": "drag-drop", // Travel Map
    "4-1": "matching", // Character Connections
    "4-2": "timeline", // Plot Reconstruction
    "4-3": "puzzle", // Symbolism Hunt
    "4-4": "puzzle", // Quote Unscramble
    "4-5": "story", // Scene Explorer
    "5-1": "timeline", // Liga Timeline
    "5-2": "story", // Dapitan Life
    "5-3": "matching", // Rizal Correspondence
    "5-4": "story", // Trial & Martyrdom
    "5-5": "story", // Legacy Builder
    "6-1": "quiz", // Global Impact
    "6-2": "quiz", // Digital Age
    "6-3": "matching", // Monuments
    "6-4": "matching", // Modern Heroes
    "6-5": "story", // Eternal Legacy
  };

  const key = `${chapterId}-${levelId}`;
  return levelTypeMap[key] || "default";
};

/**
 * Create game state tracker for use in game components
 * Returns an object with methods to track game state
 *
 * @param {Object} initialState - Initial game state
 * @returns {Object} Game state tracker
 */
export const createGameStateTracker = (initialState = {}) => {
  const state = {
    startTime: new Date(),
    endTime: null,
    score: 0,
    attempts: 1,
    hintsUsed: 0,
    accuracy: 100,
    ...initialState,
  };

  return {
    // Get current state
    getState: () => ({ ...state }),

    // Update score
    setScore: (score) => {
      state.score = score;
    },

    // Increment attempts
    incrementAttempts: () => {
      state.attempts += 1;
    },

    // Increment hints used
    useHint: () => {
      state.hintsUsed += 1;
    },

    // Set accuracy
    setAccuracy: (accuracy) => {
      state.accuracy = accuracy;
    },

    // Mark game as complete
    complete: () => {
      state.endTime = new Date();
      return state;
    },

    // Get time spent in milliseconds
    getTimeSpent: () => {
      const end = state.endTime || new Date();
      return end - state.startTime;
    },

    // Reset state
    reset: () => {
      state.startTime = new Date();
      state.endTime = null;
      state.score = 0;
      state.attempts = 1;
      state.hintsUsed = 0;
      state.accuracy = 100;
    },
  };
};

/**
 * Format completion data for display
 * Prepares data for showing in completion modals
 *
 * @param {Object} completionResult - Result from handleGameCompletion
 * @returns {Object} Formatted display data
 */
export const formatCompletionData = (completionResult) => {
  if (!completionResult.success) {
    return {
      success: false,
      message: completionResult.message || "Completion failed",
    };
  }

  const { finalScore, rawScore, data } = completionResult;

  return {
    success: true,
    finalScore,
    rawScore,
    scoreImprovement: finalScore - rawScore,
    attempts: data.attempts,
    hintsUsed: data.hintsUsed,
    displayMessage: getCompletionMessage(finalScore),
    stars: getStarRating(finalScore),
  };
};

/**
 * Get completion message based on score
 *
 * @param {number} score - Final score
 * @returns {string} Completion message
 */
const getCompletionMessage = (score) => {
  if (score >= 90) return "Outstanding! You're a Rizal expert! 🌟";
  if (score >= 80) return "Excellent work! Keep it up! 🎉";
  if (score >= 70) return "Great job! You're learning well! 👏";
  if (score >= 60) return "Good effort! Keep practicing! 💪";
  return "Nice try! Review and try again! 📚";
};

/**
 * Get star rating based on score
 *
 * @param {number} score - Final score
 * @returns {number} Number of stars (1-5)
 */
const getStarRating = (score) => {
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 70) return 3;
  if (score >= 60) return 2;
  return 1;
};

export default {
  handleGameCompletion,
  handleSimpleGameCompletion,
  getLevelType,
  createGameStateTracker,
  formatCompletionData,
};
