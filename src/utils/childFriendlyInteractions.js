/**
 * Child-Friendly Interactions Utility
 * Provides age-appropriate feedback, messages, and interaction patterns
 */

// Age-appropriate response messages
export const childFriendlyResponses = {
  correct: [
    "🎉 Amazing! You got it right!",
    "🌟 Fantastic work! You're so smart!",
    "✨ Perfect! José would be proud of you!",
    "🏆 Excellent! You're becoming an expert!",
    "💫 Wonderful! You're doing great!",
    "🎊 Brilliant! Keep up the awesome work!",
    "🌈 Super job! You're learning so much!",
    "🚀 Outstanding! You're on fire!",
  ],

  incorrect: [
    "🤔 Not quite, but that's okay! Let's try again!",
    "💭 Hmm, let's think about this together!",
    "🌱 Every mistake helps us learn something new!",
    "💪 Don't worry! Even José had to practice a lot!",
    "🔍 Let's look at this from a different angle!",
    "🤗 It's okay! Learning takes time and practice!",
    "📚 Let's review what we know and try again!",
    "✨ You're getting closer! Keep trying!",
  ],

  encouragement: [
    "💪 You're doing such a great job learning!",
    "🌟 José Rizal would be so proud of your hard work!",
    "📚 Every question makes you smarter!",
    "🎯 You're getting better with each try!",
    "🌱 Look how much you've learned already!",
    "🏃‍♂️ Keep going! You're on the right track!",
    "🧠 Your brain is working so hard - great job!",
    "🎨 You're becoming a real José Rizal expert!",
  ],

  hints: [
    "💡 Here's a little help to guide you!",
    "🔍 Let's look for clues together!",
    "🤝 I'm here to help you succeed!",
    "🌟 This hint will help you shine!",
    "🗝️ Here's a key to unlock the answer!",
    "🎯 This will point you in the right direction!",
    "🧭 Let this guide you to the answer!",
    "✨ A little magic to help you along!",
  ],
};

// Get random response from category
export const getRandomResponse = (category) => {
  const responses =
    childFriendlyResponses[category] || childFriendlyResponses.encouragement;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Age-appropriate difficulty adjustment
export const adjustDifficultyForAge = (baseConfig, playerAge = 8) => {
  const adjustments = {
    // Ages 5-7: Easier settings
    young: {
      maxHints: 5,
      timeLimit: null, // No time pressure
      retryLimit: null, // Unlimited retries
      simplifiedLanguage: true,
      moreVisualCues: true,
    },

    // Ages 8-10: Moderate settings
    middle: {
      maxHints: 3,
      timeLimit: 300, // 5 minutes
      retryLimit: 5,
      simplifiedLanguage: true,
      moreVisualCues: true,
    },

    // Ages 11+: Standard settings
    older: {
      maxHints: 2,
      timeLimit: 180, // 3 minutes
      retryLimit: 3,
      simplifiedLanguage: false,
      moreVisualCues: false,
    },
  };

  let ageGroup = "middle";
  if (playerAge <= 7) ageGroup = "young";
  else if (playerAge >= 11) ageGroup = "older";

  return {
    ...baseConfig,
    ...adjustments[ageGroup],
  };
};

// Child-friendly error handling
export const handleChildFriendlyError = (error, context = {}) => {
  const friendlyErrors = {
    network: {
      title: "Internet Connection Playing Hide and Seek! 🌐",
      message:
        "Sometimes the internet needs a little break. Let's wait a moment and try again!",
      action: "Try Again",
      emoji: "🔄",
    },

    save: {
      title: "Your Progress is Taking a Nap! 💤",
      message:
        "Don't worry! We're trying to wake up your saved progress. The important thing is what you're learning!",
      action: "Keep Playing",
      emoji: "🎮",
    },

    load: {
      title: "Looking for Your Game! 🔍",
      message:
        "We can't find your saved game right now, but we can start a new adventure together!",
      action: "Start Fresh",
      emoji: "🌟",
    },

    validation: {
      title: "Let's Check That Together! ✅",
      message:
        "Something doesn't look quite right. Let's take another look and fix it together!",
      action: "Try Again",
      emoji: "🤔",
    },

    timeout: {
      title: "Time for a Quick Break! ⏰",
      message:
        "Sometimes things take a little longer. Let's take a deep breath and try again!",
      action: "Continue",
      emoji: "😌",
    },
  };

  const errorType = error.type || "general";
  return (
    friendlyErrors[errorType] || {
      title: "Oops! Let's Fix This Together! 🔧",
      message:
        "Something unexpected happened, but don't worry! We can figure this out together!",
      action: "Try Again",
      emoji: "😊",
    }
  );
};

// Progress celebration messages
export const getCelebrationMessage = (achievement) => {
  const celebrations = {
    firstCorrect: {
      title: "Your First Correct Answer! 🎉",
      message:
        "Amazing! You got your very first answer right! José would be so proud!",
      emoji: "🌟",
    },

    halfwayDone: {
      title: "You're Halfway There! 🏃‍♂️",
      message: "Look at you go! You're already halfway through this level!",
      emoji: "💪",
    },

    perfectScore: {
      title: "Perfect Score! 🏆",
      message:
        "WOW! You got everything right! You're a true José Rizal expert!",
      emoji: "👑",
    },

    levelComplete: {
      title: "Level Complete! 🎊",
      message:
        "Fantastic! You finished this level! Ready for the next adventure?",
      emoji: "🚀",
    },

    chapterComplete: {
      title: "Chapter Mastered! 📚",
      message:
        "Incredible! You've learned so much about this part of José's life!",
      emoji: "🎓",
    },

    noHintsUsed: {
      title: "Independent Learner! 🧠",
      message:
        "Amazing! You solved everything on your own! José was independent too!",
      emoji: "💫",
    },

    persistent: {
      title: "Never Give Up Spirit! 💪",
      message:
        "You kept trying even when it was hard! That's the spirit of José Rizal!",
      emoji: "🌟",
    },
  };

  return celebrations[achievement] || celebrations.levelComplete;
};

// Interactive feedback timing
export const feedbackTiming = {
  quick: 1000, // For simple acknowledgments
  normal: 2000, // For standard feedback
  detailed: 3000, // For explanations
  celebration: 4000, // For achievements
};

// Child-friendly loading messages
export const loadingMessages = [
  "🌟 Getting ready for your adventure with José!",
  "📚 Preparing your learning materials!",
  "🎨 Drawing beautiful pictures for you!",
  "🏠 Building José's world for you to explore!",
  "✨ Adding some magic to make learning fun!",
  "🎮 Setting up your game - almost ready!",
  "🌈 Painting the scenes with bright colors!",
  "📖 Opening the book of José's life!",
];

export const getRandomLoadingMessage = () => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};

// Accessibility helpers for child-friendly interactions
export const accessibilityHelpers = {
  // High contrast mode for better visibility
  highContrast: {
    background: "bg-white",
    text: "text-black",
    border: "border-black border-2",
    button: "bg-blue-600 text-white border-2 border-blue-800",
  },

  // Large text mode for easier reading
  largeText: {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
    xlarge: "text-3xl",
  },

  // Simplified interface mode
  simplified: {
    hideDecorations: true,
    largerButtons: true,
    moreSpacing: true,
    fewerOptions: true,
  },
};

// Sound effect mappings (for future audio implementation)
export const soundEffects = {
  correct: "success_chime",
  incorrect: "gentle_buzz",
  hint: "notification_bell",
  celebration: "fanfare",
  button_click: "soft_click",
  page_turn: "paper_rustle",
  achievement: "victory_sound",
};

// Haptic feedback patterns (for touch devices)
export const hapticPatterns = {
  correct: [50, 50, 50], // Three short vibrations
  incorrect: [100], // One longer vibration
  hint: [25, 25], // Two very short vibrations
  celebration: [50, 100, 50, 100, 50], // Victory pattern
};

// Trigger haptic feedback if available
export const triggerHapticFeedback = (pattern) => {
  if (navigator.vibrate && hapticPatterns[pattern]) {
    navigator.vibrate(hapticPatterns[pattern]);
  }
};

// Create child-friendly interaction context
export const createChildFriendlyContext = (options = {}) => {
  return {
    playerAge: options.age || 8,
    difficulty: adjustDifficultyForAge({}, options.age || 8),
    responses: childFriendlyResponses,
    getResponse: getRandomResponse,
    handleError: handleChildFriendlyError,
    getCelebration: getCelebrationMessage,
    triggerHaptic: triggerHapticFeedback,
    accessibility: options.accessibility || {},
    soundEnabled: options.soundEnabled || false,
  };
};

export default {
  childFriendlyResponses,
  getRandomResponse,
  adjustDifficultyForAge,
  handleChildFriendlyError,
  getCelebrationMessage,
  feedbackTiming,
  loadingMessages,
  getRandomLoadingMessage,
  accessibilityHelpers,
  soundEffects,
  hapticPatterns,
  triggerHapticFeedback,
  createChildFriendlyContext,
};
