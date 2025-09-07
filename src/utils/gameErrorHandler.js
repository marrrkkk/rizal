// Game error handling utilities with child-friendly enhancements

// Common game error types
export const GAME_ERRORS = {
  SAVE_FAILED: "SAVE_FAILED",
  LOAD_FAILED: "LOAD_FAILED",
  INVALID_STATE: "INVALID_STATE",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  USER_INPUT_ERROR: "USER_INPUT_ERROR",
  GAME_STATE_ERROR: "GAME_STATE_ERROR",
};

// Child-friendly error messages
export const CHILD_FRIENDLY_ERROR_MESSAGES = {
  SAVE_FAILED: {
    title: "Your Progress is Taking a Nap! 💤",
    message:
      "We're having trouble saving your amazing progress right now. Don't worry - the most important thing is what you're learning in your brain!",
    action: "Keep Playing",
    emoji: "💾",
  },
  LOAD_FAILED: {
    title: "Looking for Your Saved Game! 🔍",
    message:
      "We can't find your saved progress right now, but that's okay! We can start fresh and have even more fun learning about José!",
    action: "Start New Game",
    emoji: "🎮",
  },
  NETWORK_ERROR: {
    title: "Internet Connection Playing Hide and Seek! 🌐",
    message:
      "Sometimes the internet needs a little break. Let's wait a moment and try again - José was very patient too!",
    action: "Try Again",
    emoji: "📡",
  },
  TIMEOUT: {
    title: "Time for a Quick Break! ⏰",
    message:
      "Sometimes things take a little longer than expected. Let's take a deep breath and try again together!",
    action: "Continue",
    emoji: "😌",
  },
  VALIDATION_ERROR: {
    title: "Let's Check That Together! ✅",
    message:
      "Something about your answer doesn't look quite right. Let's take another look and figure it out together!",
    action: "Try Again",
    emoji: "🤔",
  },
  USER_INPUT_ERROR: {
    title: "Oops! Let's Fix That! ✏️",
    message:
      "It looks like something got mixed up with what you entered. No worries - everyone makes little mistakes!",
    action: "Fix It",
    emoji: "📝",
  },
  GAME_STATE_ERROR: {
    title: "Game Needs a Little Reset! 🔄",
    message:
      "The game got a bit confused and needs to restart. Think of it as a fresh start to show off what you've learned!",
    action: "Restart",
    emoji: "🎯",
  },
  DEFAULT: {
    title: "Oops! Let's Fix This Together! 🔧",
    message:
      "Something unexpected happened, but don't worry! We can figure this out together, just like José solved problems!",
    action: "Try Again",
    emoji: "😊",
  },
};

// Error recovery strategies
export const RECOVERY_STRATEGIES = {
  RETRY: "RETRY",
  RESET: "RESET",
  FALLBACK: "FALLBACK",
  NAVIGATE_BACK: "NAVIGATE_BACK",
};

// Enhanced game error handler class with child-friendly features
export class GameErrorHandler {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.onError = options.onError || console.error;
    this.onRecovery = options.onRecovery || console.log;
    this.childFriendly = options.childFriendly !== false; // Default to true
    this.playerAge = options.playerAge || 8;
    this.showEncouragement = options.showEncouragement !== false;
  }

  // Get child-friendly error message
  getChildFriendlyMessage(errorType) {
    return (
      CHILD_FRIENDLY_ERROR_MESSAGES[errorType] ||
      CHILD_FRIENDLY_ERROR_MESSAGES.DEFAULT
    );
  }

  // Handle errors with automatic recovery
  async handleError(error, context = {}) {
    const errorInfo = {
      type: this.classifyError(error),
      message: error.message || "Unknown error",
      context,
      timestamp: new Date().toISOString(),
    };

    this.onError("Game Error:", errorInfo);

    // Determine recovery strategy
    const strategy = this.getRecoveryStrategy(errorInfo.type, context);

    try {
      await this.executeRecovery(strategy, errorInfo, context);
      this.onRecovery("Recovery successful:", strategy);
      return true;
    } catch (recoveryError) {
      this.onError("Recovery failed:", recoveryError);
      return false;
    }
  }

  // Classify error type
  classifyError(error) {
    if (
      error.name === "QuotaExceededError" ||
      error.message.includes("localStorage")
    ) {
      return GAME_ERRORS.SAVE_FAILED;
    }

    if (error.name === "NetworkError" || error.message.includes("fetch")) {
      return GAME_ERRORS.NETWORK_ERROR;
    }

    if (error.name === "TimeoutError") {
      return GAME_ERRORS.TIMEOUT;
    }

    if (
      error.message.includes("validation") ||
      error.message.includes("invalid")
    ) {
      return GAME_ERRORS.VALIDATION_ERROR;
    }

    return GAME_ERRORS.INVALID_STATE;
  }

  // Get appropriate recovery strategy
  getRecoveryStrategy(errorType, context) {
    switch (errorType) {
      case GAME_ERRORS.SAVE_FAILED:
        return RECOVERY_STRATEGIES.RETRY;

      case GAME_ERRORS.LOAD_FAILED:
        return RECOVERY_STRATEGIES.FALLBACK;

      case GAME_ERRORS.NETWORK_ERROR:
        return RECOVERY_STRATEGIES.RETRY;

      case GAME_ERRORS.TIMEOUT:
        return RECOVERY_STRATEGIES.RETRY;

      case GAME_ERRORS.VALIDATION_ERROR:
        return RECOVERY_STRATEGIES.RESET;

      default:
        return RECOVERY_STRATEGIES.NAVIGATE_BACK;
    }
  }

  // Execute recovery strategy
  async executeRecovery(strategy, errorInfo, context) {
    switch (strategy) {
      case RECOVERY_STRATEGIES.RETRY:
        return await this.retryOperation(context);

      case RECOVERY_STRATEGIES.RESET:
        return this.resetGameState(context);

      case RECOVERY_STRATEGIES.FALLBACK:
        return this.useFallbackData(context);

      case RECOVERY_STRATEGIES.NAVIGATE_BACK:
        return this.navigateBack(context);

      default:
        throw new Error(`Unknown recovery strategy: ${strategy}`);
    }
  }

  // Retry operation with exponential backoff
  async retryOperation(context, attempt = 1) {
    if (attempt > this.maxRetries) {
      throw new Error(`Max retries (${this.maxRetries}) exceeded`);
    }

    try {
      if (context.retryFunction) {
        return await context.retryFunction();
      }
      return true;
    } catch (error) {
      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      await this.sleep(delay);
      return this.retryOperation(context, attempt + 1);
    }
  }

  // Reset game state to safe defaults
  resetGameState(context) {
    if (context.resetFunction) {
      context.resetFunction();
    }

    // Clear any corrupted localStorage data
    try {
      const gameKeys = Object.keys(localStorage).filter(
        (key) => key.startsWith("rizal_") || key.startsWith("game_")
      );
      gameKeys.forEach((key) => {
        try {
          JSON.parse(localStorage.getItem(key));
        } catch {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Could not clean localStorage:", error);
    }

    return true;
  }

  // Use fallback data
  useFallbackData(context) {
    if (context.fallbackData) {
      return context.fallbackData;
    }

    // Return safe default state
    return {
      score: 0,
      currentLevel: 1,
      gameState: "initial",
      progress: 0,
    };
  }

  // Navigate back safely
  navigateBack(context) {
    if (context.navigationHelper) {
      context.navigationHelper.goBack();
    } else if (context.navigate) {
      context.navigate(-1);
    } else {
      window.history.back();
    }
    return true;
  }

  // Utility: Sleep function
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create default error handler instance
export const defaultGameErrorHandler = new GameErrorHandler({
  maxRetries: 3,
  retryDelay: 1000,
  onError: (message, error) => {
    console.error(message, error);
    // Could send to error reporting service here
  },
  onRecovery: (message, strategy) => {
    console.log(message, strategy);
  },
});

// Utility functions for common error scenarios

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to get localStorage item "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage item "${key}":`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove localStorage item "${key}":`, error);
      return false;
    }
  },
};

// Safe async operations
export const safeAsync = async (operation, fallback = null, context = {}) => {
  try {
    return await operation();
  } catch (error) {
    const recovered = await defaultGameErrorHandler.handleError(error, {
      ...context,
      retryFunction: operation,
      fallbackData: fallback,
    });

    if (!recovered && fallback !== null) {
      return fallback;
    }

    throw error;
  }
};

// Validate game state
export const validateGameState = (state, schema) => {
  const errors = [];

  if (schema.required) {
    schema.required.forEach((field) => {
      if (!(field in state)) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  if (schema.types) {
    Object.entries(schema.types).forEach(([field, expectedType]) => {
      if (field in state && typeof state[field] !== expectedType) {
        errors.push(
          `Invalid type for ${field}: expected ${expectedType}, got ${typeof state[
            field
          ]}`
        );
      }
    });
  }

  if (schema.ranges) {
    Object.entries(schema.ranges).forEach(([field, range]) => {
      if (field in state) {
        const value = state[field];
        if (typeof value === "number") {
          if (range.min !== undefined && value < range.min) {
            errors.push(`${field} is below minimum: ${value} < ${range.min}`);
          }
          if (range.max !== undefined && value > range.max) {
            errors.push(`${field} is above maximum: ${value} > ${range.max}`);
          }
        }
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(`Game state validation failed: ${errors.join(", ")}`);
  }

  return true;
};

export default {
  GameErrorHandler,
  defaultGameErrorHandler,
  safeLocalStorage,
  safeAsync,
  validateGameState,
  GAME_ERRORS,
  RECOVERY_STRATEGIES,
};
