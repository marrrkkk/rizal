// Final score calculation utilities
// Implements accurate score calculation based on performance metrics

/**
 * Level type configurations with score weights
 * Different level types have different scoring priorities
 */
export const levelTypeConfigs = {
  quiz: {
    accuracy: 0.7, // 70% weight on correct answers
    speed: 0.2, // 20% weight on completion time
    hints: 10, // 10 points penalty per hint
    estimatedTime: 180, // 3 minutes in seconds
  },
  puzzle: {
    accuracy: 0.6,
    speed: 0.3,
    hints: 15,
    estimatedTime: 240, // 4 minutes
  },
  "drag-drop": {
    accuracy: 0.65,
    speed: 0.25,
    hints: 12,
    estimatedTime: 200,
  },
  "word-collection": {
    accuracy: 0.6,
    speed: 0.3,
    hints: 10,
    estimatedTime: 180,
  },
  timeline: {
    accuracy: 0.7,
    speed: 0.2,
    hints: 15,
    estimatedTime: 240,
  },
  matching: {
    accuracy: 0.65,
    speed: 0.25,
    hints: 12,
    estimatedTime: 200,
  },
  story: {
    accuracy: 0.75,
    speed: 0.15,
    hints: 8,
    estimatedTime: 300, // 5 minutes
  },
  default: {
    accuracy: 0.65,
    speed: 0.25,
    hints: 10,
    estimatedTime: 180,
  },
};

/**
 * Calculate time bonus based on completion time vs estimated time
 * Faster completion = higher bonus (up to 2x multiplier)
 * Slower completion = lower bonus (down to 0.5x multiplier)
 *
 * @param {number} timeTaken - Actual time taken in seconds
 * @param {number} estimatedTime - Expected time in seconds
 * @returns {number} Time multiplier (0.5 to 2.0)
 */
export const calculateTimeBonus = (timeTaken, estimatedTime) => {
  if (timeTaken <= 0 || estimatedTime <= 0) return 1.0;

  const timeRatio = estimatedTime / timeTaken;

  // Cap the bonus at 2x for very fast completion
  // Floor at 0.5x for slow completion
  return Math.max(0.5, Math.min(2.0, timeRatio));
};

/**
 * Calculate hint penalty based on number of hints used
 *
 * @param {number} hintsUsed - Number of hints used
 * @param {number} hintPenalty - Points to deduct per hint
 * @returns {number} Total penalty points
 */
export const calculateHintPenalty = (hintsUsed, hintPenalty) => {
  return hintsUsed * hintPenalty;
};

/**
 * Calculate final score for a completed level
 *
 * @param {Object} gameState - Current game state
 * @param {number} gameState.score - Raw score from game (0-100)
 * @param {number} gameState.attempts - Number of attempts made
 * @param {number} gameState.hintsUsed - Number of hints used
 * @param {Date} gameState.startTime - Game start time
 * @param {Date} gameState.endTime - Game end time
 * @param {number} gameState.accuracy - Accuracy percentage (0-100)
 * @param {Object} levelConfig - Level configuration
 * @param {string} levelConfig.type - Level type (quiz, puzzle, etc.)
 * @param {Object} levelConfig.scoreWeights - Custom score weights (optional)
 * @param {number} levelConfig.estimatedTime - Estimated completion time (optional)
 * @returns {number} Final calculated score (rounded to nearest integer)
 */
export const calculateFinalScore = (gameState, levelConfig = {}) => {
  const {
    score = 0,
    hintsUsed = 0,
    startTime,
    endTime,
    accuracy = 100,
  } = gameState;

  // Get level type configuration
  const levelType = levelConfig.type || "default";
  const typeConfig = levelTypeConfigs[levelType] || levelTypeConfigs.default;

  // Allow custom overrides from levelConfig
  const scoreWeights = {
    accuracy: levelConfig.scoreWeights?.accuracy ?? typeConfig.accuracy,
    speed: levelConfig.scoreWeights?.speed ?? typeConfig.speed,
    hints: levelConfig.scoreWeights?.hints ?? typeConfig.hints,
  };

  const estimatedTime = levelConfig.estimatedTime ?? typeConfig.estimatedTime;

  // Calculate base score from accuracy
  const baseScore = score * scoreWeights.accuracy;

  // Calculate time bonus
  let timeBonus = 0;
  if (startTime && endTime) {
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
    const timeMultiplier = calculateTimeBonus(timeTaken, estimatedTime);
    timeBonus = score * scoreWeights.speed * timeMultiplier;
  }

  // Calculate hint penalty
  const hintPenalty = calculateHintPenalty(hintsUsed, scoreWeights.hints);

  // Calculate final score
  let finalScore = baseScore + timeBonus - hintPenalty;

  // Ensure score is not negative
  finalScore = Math.max(0, finalScore);

  // Round to nearest integer
  return Math.round(finalScore);
};

/**
 * Get level type configuration
 *
 * @param {string} levelType - Type of level
 * @returns {Object} Level configuration
 */
export const getLevelTypeConfig = (levelType) => {
  return levelTypeConfigs[levelType] || levelTypeConfigs.default;
};

/**
 * Create a game state object for score calculation
 * Helper function to ensure all required fields are present
 *
 * @param {Object} params - Game state parameters
 * @returns {Object} Complete game state object
 */
export const createGameState = ({
  score = 0,
  attempts = 1,
  hintsUsed = 0,
  startTime = new Date(),
  endTime = new Date(),
  accuracy = 100,
}) => {
  return {
    score,
    attempts,
    hintsUsed,
    startTime,
    endTime,
    accuracy,
  };
};

/**
 * Calculate score breakdown for display purposes
 * Shows how the final score was calculated
 *
 * @param {Object} gameState - Current game state
 * @param {Object} levelConfig - Level configuration
 * @returns {Object} Score breakdown with components
 */
export const calculateScoreBreakdown = (gameState, levelConfig = {}) => {
  const { score = 0, hintsUsed = 0, startTime, endTime } = gameState;

  const levelType = levelConfig.type || "default";
  const typeConfig = levelTypeConfigs[levelType] || levelTypeConfigs.default;

  const scoreWeights = {
    accuracy: levelConfig.scoreWeights?.accuracy ?? typeConfig.accuracy,
    speed: levelConfig.scoreWeights?.speed ?? typeConfig.speed,
    hints: levelConfig.scoreWeights?.hints ?? typeConfig.hints,
  };

  const estimatedTime = levelConfig.estimatedTime ?? typeConfig.estimatedTime;

  const baseScore = score * scoreWeights.accuracy;

  let timeBonus = 0;
  let timeTaken = 0;
  let timeMultiplier = 1.0;

  if (startTime && endTime) {
    timeTaken = (endTime - startTime) / 1000;
    timeMultiplier = calculateTimeBonus(timeTaken, estimatedTime);
    timeBonus = score * scoreWeights.speed * timeMultiplier;
  }

  const hintPenalty = calculateHintPenalty(hintsUsed, scoreWeights.hints);
  const finalScore = Math.max(
    0,
    Math.round(baseScore + timeBonus - hintPenalty)
  );

  return {
    baseScore: Math.round(baseScore),
    timeBonus: Math.round(timeBonus),
    hintPenalty: Math.round(hintPenalty),
    finalScore,
    timeTaken: Math.round(timeTaken),
    timeMultiplier: Math.round(timeMultiplier * 100) / 100,
    estimatedTime,
  };
};

export default {
  calculateFinalScore,
  calculateTimeBonus,
  calculateHintPenalty,
  getLevelTypeConfig,
  createGameState,
  calculateScoreBreakdown,
  levelTypeConfigs,
};
