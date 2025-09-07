/**
 * Educational Enhancement Integrator
 * Provides utilities to integrate educational enhancements into all games
 */

import {
  getRandomResponse,
  triggerHapticFeedback,
  createChildFriendlyContext,
  getCelebrationMessage,
} from "./childFriendlyInteractions";

import { defaultGameErrorHandler } from "./gameErrorHandler";

// Enhanced game state manager with educational features
export class EducationalGameManager {
  constructor(options = {}) {
    this.playerAge = options.playerAge || 8;
    this.gameType = options.gameType || "quiz";
    this.difficulty = options.difficulty || "medium";
    this.childFriendlyContext = createChildFriendlyContext({
      age: this.playerAge,
    });

    // Game state
    this.score = 0;
    this.attempts = 0;
    this.hintsUsed = 0;
    this.startTime = Date.now();
    this.interactions = [];
    this.achievements = [];

    // Educational enhancement state
    this.showEncouragement = false;
    this.feedbackMessage = null;
    this.educationalFacts = [];
    this.currentHints = [];

    // Callbacks
    this.onScoreUpdate = options.onScoreUpdate || (() => {});
    this.onFeedback = options.onFeedback || (() => {});
    this.onAchievement = options.onAchievement || (() => {});
    this.onError = options.onError || (() => {});
  }

  // Handle answer submission with educational enhancements
  handleAnswer(answer, correctAnswer, context = {}) {
    this.attempts++;
    const isCorrect = this.validateAnswer(answer, correctAnswer);

    // Record interaction
    this.recordInteraction({
      type: "answer",
      answer,
      correctAnswer,
      isCorrect,
      timestamp: Date.now(),
      hintsUsed: this.hintsUsed,
      attempts: this.attempts,
    });

    // Calculate score with educational considerations
    const baseScore = context.baseScore || 10;
    const hintPenalty = this.hintsUsed * 2;
    const attemptBonus = this.attempts === 1 ? 5 : 0;
    const scoreGained = isCorrect
      ? Math.max(baseScore - hintPenalty + attemptBonus, 5)
      : 0;

    if (isCorrect) {
      this.score += scoreGained;
      this.onScoreUpdate(this.score, scoreGained);
    }

    // Generate child-friendly feedback
    const feedback = this.generateFeedback(isCorrect, context);
    this.onFeedback(feedback);

    // Trigger haptic feedback
    triggerHapticFeedback(isCorrect ? "correct" : "incorrect");

    // Check for achievements
    this.checkAchievements(isCorrect, context);

    // Show encouragement if needed
    if (!isCorrect && this.attempts >= 2) {
      this.showEncouragementMessage();
    }

    return {
      isCorrect,
      scoreGained,
      feedback,
      showEncouragement: this.showEncouragement,
    };
  }

  // Validate answer with flexible comparison
  validateAnswer(answer, correctAnswer) {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(answer);
    }

    if (typeof answer === "string" && typeof correctAnswer === "string") {
      return answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    return answer === correctAnswer;
  }

  // Generate child-friendly feedback
  generateFeedback(isCorrect, context = {}) {
    const responseType = isCorrect ? "correct" : "incorrect";
    const message = getRandomResponse(responseType);

    let additionalInfo = "";
    if (isCorrect) {
      if (this.attempts === 1 && this.hintsUsed === 0) {
        additionalInfo = " You solved it perfectly on your first try!";
      } else if (this.hintsUsed === 0) {
        additionalInfo = " You did it without any hints - amazing!";
      }
    } else {
      if (this.attempts === 1) {
        additionalInfo = " Take your time and try again!";
      } else if (this.attempts >= 3) {
        additionalInfo = " You're showing great persistence!";
      }
    }

    return {
      type: isCorrect ? "success" : "error",
      message: message + additionalInfo,
      duration: isCorrect ? 2000 : 2500,
      emoji: isCorrect ? "🎉" : "🤔",
      showExplanation: context.explanation && !isCorrect,
      explanation: context.explanation,
    };
  }

  // Handle hint usage
  useHint(hint, context = {}) {
    this.hintsUsed++;
    this.currentHints.push({
      hint,
      timestamp: Date.now(),
      context,
    });

    this.recordInteraction({
      type: "hint",
      hint,
      hintsUsed: this.hintsUsed,
      timestamp: Date.now(),
    });

    const feedback = {
      type: "hint",
      message: getRandomResponse("hints"),
      duration: 2000,
      emoji: "💡",
    };

    this.onFeedback(feedback);
    triggerHapticFeedback("hint");

    return feedback;
  }

  // Show encouragement message
  showEncouragementMessage() {
    this.showEncouragement = true;
    const encouragement = getRandomResponse("encouragement");

    setTimeout(() => {
      this.showEncouragement = false;
    }, 3000);

    return {
      type: "encouragement",
      message: encouragement,
      duration: 3000,
      emoji: "💪",
    };
  }

  // Check for achievements
  checkAchievements(isCorrect, context = {}) {
    const newAchievements = [];

    // First correct answer
    if (isCorrect && this.score === this.getScoreFromInteractions()) {
      newAchievements.push("firstCorrect");
    }

    // Perfect score (no hints, first try)
    if (isCorrect && this.attempts === 1 && this.hintsUsed === 0) {
      newAchievements.push("perfectAnswer");
    }

    // Persistent learner (many attempts but finally correct)
    if (isCorrect && this.attempts >= 3) {
      newAchievements.push("persistent");
    }

    // Independent learner (no hints used in entire game)
    if (context.gameComplete && this.hintsUsed === 0) {
      newAchievements.push("independent");
    }

    // Process new achievements
    newAchievements.forEach((achievement) => {
      if (!this.achievements.includes(achievement)) {
        this.achievements.push(achievement);
        const celebration = getCelebrationMessage(achievement);
        this.onAchievement(celebration);
      }
    });

    return newAchievements;
  }

  // Record interaction for analytics
  recordInteraction(interaction) {
    this.interactions.push({
      ...interaction,
      gameTime: Date.now() - this.startTime,
    });
  }

  // Get educational content based on performance
  getContextualEducationalContent() {
    const performance = this.getPerformanceMetrics();

    if (performance.accuracy < 0.5) {
      return {
        type: "encouragement",
        title: "Keep Learning! 📚",
        content:
          "José Rizal had to study hard too! Every mistake helps you learn something new.",
        emoji: "💪",
      };
    } else if (performance.accuracy > 0.8) {
      return {
        type: "celebration",
        title: "You're Doing Amazing! 🌟",
        content:
          "Your knowledge about José Rizal is growing so much! Keep up the excellent work!",
        emoji: "🏆",
      };
    } else {
      return {
        type: "progress",
        title: "Great Progress! 📈",
        content:
          "You're learning more about José Rizal with each question. Keep going!",
        emoji: "🎯",
      };
    }
  }

  // Get performance metrics
  getPerformanceMetrics() {
    const correctAnswers = this.interactions.filter(
      (i) => i.type === "answer" && i.isCorrect
    ).length;
    const totalAnswers = this.interactions.filter(
      (i) => i.type === "answer"
    ).length;

    return {
      accuracy: totalAnswers > 0 ? correctAnswers / totalAnswers : 0,
      averageAttempts:
        totalAnswers > 0
          ? this.interactions
              .filter((i) => i.type === "answer")
              .reduce((sum, i) => sum + i.attempts, 0) / totalAnswers
          : 0,
      hintsUsed: this.hintsUsed,
      totalTime: Date.now() - this.startTime,
      score: this.score,
      achievements: this.achievements.length,
    };
  }

  // Get score from interactions (helper method)
  getScoreFromInteractions() {
    return this.interactions
      .filter((i) => i.type === "answer" && i.isCorrect)
      .reduce((sum, i) => sum + (i.scoreGained || 10), 0);
  }

  // Handle errors with child-friendly approach
  handleError(error, context = {}) {
    this.recordInteraction({
      type: "error",
      error: error.message,
      context,
      timestamp: Date.now(),
    });

    return defaultGameErrorHandler.handleError(error, {
      ...context,
      childFriendly: true,
      playerAge: this.playerAge,
    });
  }

  // Generate completion summary
  getCompletionSummary() {
    const metrics = this.getPerformanceMetrics();
    const duration = Math.round((Date.now() - this.startTime) / 1000);

    let performanceMessage = "";
    if (metrics.accuracy >= 0.9) {
      performanceMessage = "🌟 Outstanding! You're a true José Rizal expert!";
    } else if (metrics.accuracy >= 0.75) {
      performanceMessage = "🏆 Excellent work! You know José's story so well!";
    } else if (metrics.accuracy >= 0.6) {
      performanceMessage =
        "👍 Great job! You're learning so much about our hero!";
    } else {
      performanceMessage =
        "💪 Wonderful effort! Every step helps you learn more!";
    }

    return {
      score: this.score,
      accuracy: Math.round(metrics.accuracy * 100),
      duration,
      hintsUsed: this.hintsUsed,
      achievements: this.achievements,
      performanceMessage,
      learningPoints: this.generateLearningPoints(),
      nextSteps: this.generateNextSteps(),
    };
  }

  // Generate learning points based on performance
  generateLearningPoints() {
    const points = [];

    if (this.hintsUsed === 0) {
      points.push("🧠 You solved everything independently - just like José!");
    }

    if (
      this.attempts >
      this.interactions.filter((i) => i.type === "answer").length * 2
    ) {
      points.push("💪 You showed great persistence and never gave up!");
    }

    if (this.score > 80) {
      points.push("📚 You've learned so much about José Rizal's life!");
    }

    points.push("🌟 Every question helped you become smarter!");

    return points;
  }

  // Generate next steps for continued learning
  generateNextSteps() {
    return [
      "Continue exploring more chapters about José's life",
      "Try other games to learn different aspects of his story",
      "Share what you learned with friends and family",
      "Keep being curious about Philippine history!",
    ];
  }

  // Reset for new game
  reset() {
    this.score = 0;
    this.attempts = 0;
    this.hintsUsed = 0;
    this.startTime = Date.now();
    this.interactions = [];
    this.achievements = [];
    this.showEncouragement = false;
    this.feedbackMessage = null;
    this.currentHints = [];
  }
}

// Utility functions for integrating educational enhancements

// Add educational enhancements to existing game component
export const enhanceGameWithEducation = (gameComponent, options = {}) => {
  const manager = new EducationalGameManager(options);

  return {
    ...gameComponent,
    educationalManager: manager,

    // Enhanced methods
    handleAnswer: (answer, correct, context) =>
      manager.handleAnswer(answer, correct, context),

    useHint: (hint, context) => manager.useHint(hint, context),

    getEducationalContent: () => manager.getContextualEducationalContent(),

    getCompletionSummary: () => manager.getCompletionSummary(),

    handleError: (error, context) => manager.handleError(error, context),
  };
};

// Create educational game props for consistent integration
export const createEducationalGameProps = (baseProps = {}) => {
  return {
    ...baseProps,
    showHints: baseProps.showHints !== false,
    showEducationalFacts: baseProps.showEducationalFacts !== false,
    showEncouragement: baseProps.showEncouragement !== false,
    childFriendlyErrors: baseProps.childFriendlyErrors !== false,
    visualFeedback: baseProps.visualFeedback !== false,
    hapticFeedback: baseProps.hapticFeedback !== false,
    playerAge: baseProps.playerAge || 8,
    difficulty: baseProps.difficulty || "medium",
  };
};

// Validate educational enhancement integration
export const validateEducationalIntegration = (gameComponent) => {
  const requiredFeatures = [
    "hint system",
    "educational facts",
    "child-friendly messages",
    "visual feedback",
    "error handling",
  ];

  const missingFeatures = [];

  // Check for hint system
  if (!gameComponent.props?.showHints && !gameComponent.hintSystem) {
    missingFeatures.push("hint system");
  }

  // Check for educational facts
  if (
    !gameComponent.props?.showEducationalFacts &&
    !gameComponent.educationalFacts
  ) {
    missingFeatures.push("educational facts");
  }

  // Check for child-friendly messages
  if (
    !gameComponent.props?.childFriendlyErrors &&
    !gameComponent.childFriendlyMessages
  ) {
    missingFeatures.push("child-friendly messages");
  }

  // Check for visual feedback
  if (!gameComponent.props?.visualFeedback && !gameComponent.visualFeedback) {
    missingFeatures.push("visual feedback");
  }

  return {
    isValid: missingFeatures.length === 0,
    missingFeatures,
    requiredFeatures,
    integrationScore:
      ((requiredFeatures.length - missingFeatures.length) /
        requiredFeatures.length) *
      100,
  };
};

// Global educational enhancement registry
export const educationalEnhancementRegistry = {
  registeredGames: new Map(),
  globalSettings: {
    defaultPlayerAge: 8,
    enableHapticFeedback: true,
    enableVisualFeedback: true,
    enableChildFriendlyErrors: true,
    enableEducationalFacts: true,
    enableHintSystem: true,
    enableEncouragement: true,
  },

  // Register a game with educational enhancements
  registerGame(gameId, enhancements = {}) {
    this.registeredGames.set(gameId, {
      ...this.globalSettings,
      ...enhancements,
      registeredAt: Date.now(),
    });
  },

  // Get enhancements for a specific game
  getGameEnhancements(gameId) {
    return this.registeredGames.get(gameId) || this.globalSettings;
  },

  // Update global settings
  updateGlobalSettings(newSettings) {
    this.globalSettings = { ...this.globalSettings, ...newSettings };
  },
};

// Enhanced game wrapper that automatically applies educational enhancements
export const withEducationalEnhancements = (
  GameComponent,
  gameId,
  options = {}
) => {
  return function EnhancedGame(props) {
    const [educationalManager] = useState(
      () =>
        new EducationalGameManager({
          gameType: options.gameType || "quiz",
          playerAge: props.playerAge || options.playerAge || 8,
          difficulty: props.difficulty || options.difficulty || "medium",
          ...options,
        })
    );

    // Register the game if not already registered
    if (!educationalEnhancementRegistry.registeredGames.has(gameId)) {
      educationalEnhancementRegistry.registerGame(gameId, options);
    }

    const enhancements =
      educationalEnhancementRegistry.getGameEnhancements(gameId);

    // Enhanced props with educational features
    const enhancedProps = {
      ...props,
      educationalManager,
      enhancements,

      // Educational enhancement callbacks
      onAnswer: (answer, correct, context) => {
        const result = educationalManager.handleAnswer(
          answer,
          correct,
          context
        );
        if (props.onAnswer) props.onAnswer(answer, correct, context, result);
        return result;
      },

      onHintUsed: (hint, context) => {
        const result = educationalManager.useHint(hint, context);
        if (props.onHintUsed) props.onHintUsed(hint, context, result);
        return result;
      },

      onError: (error, context) => {
        const result = educationalManager.handleError(error, context);
        if (props.onError) props.onError(error, context, result);
        return result;
      },

      getEducationalContent: () =>
        educationalManager.getContextualEducationalContent(),
      getCompletionSummary: () => educationalManager.getCompletionSummary(),
    };

    return <GameComponent {...enhancedProps} />;
  };
};

// Utility to ensure all games have educational enhancements
export const ensureEducationalEnhancements = (gameComponents) => {
  const enhancedGames = {};

  Object.entries(gameComponents).forEach(([gameId, GameComponent]) => {
    enhancedGames[gameId] = withEducationalEnhancements(GameComponent, gameId);
  });

  return enhancedGames;
};

// Validation and reporting system
export const generateEducationalEnhancementReport = () => {
  const report = {
    totalGames: educationalEnhancementRegistry.registeredGames.size,
    globalSettings: educationalEnhancementRegistry.globalSettings,
    gameDetails: [],
    recommendations: [],
  };

  educationalEnhancementRegistry.registeredGames.forEach(
    (enhancements, gameId) => {
      const validation = validateEducationalIntegration({
        props: enhancements,
      });

      report.gameDetails.push({
        gameId,
        enhancements,
        validation,
        registeredAt: new Date(enhancements.registeredAt).toISOString(),
      });

      if (!validation.isValid) {
        report.recommendations.push({
          gameId,
          missingFeatures: validation.missingFeatures,
          priority: validation.integrationScore < 50 ? "high" : "medium",
        });
      }
    }
  );

  return report;
};

// Auto-integration system for existing games
export const autoIntegrateEducationalEnhancements = async (
  gameDirectory = "src/pages/games"
) => {
  const integrationResults = {
    success: [],
    failed: [],
    skipped: [],
  };

  try {
    // This would be implemented to scan game files and auto-integrate enhancements
    // For now, we'll provide a manual integration guide
    console.log("Educational Enhancement Auto-Integration Guide:");
    console.log("1. Import educational components in your game files");
    console.log("2. Use withEducationalEnhancements wrapper");
    console.log("3. Implement educational callbacks");
    console.log("4. Add hint systems and educational facts");

    return integrationResults;
  } catch (error) {
    console.error("Auto-integration failed:", error);
    return integrationResults;
  }
};

export default {
  EducationalGameManager,
  enhanceGameWithEducation,
  createEducationalGameProps,
  validateEducationalIntegration,
  educationalEnhancementRegistry,
  withEducationalEnhancements,
  ensureEducationalEnhancements,
  generateEducationalEnhancementReport,
  autoIntegrateEducationalEnhancements,
};
