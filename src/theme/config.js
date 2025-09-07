// Filipino-themed color palette and design system
export const filipinoTheme = {
  colors: {
    primary: {
      blue: "from-blue-500 to-indigo-600", // Philippine flag blue
      red: "from-red-500 to-red-600", // Philippine flag red
      yellow: "from-yellow-400 to-amber-500", // Philippine sun yellow
    },
    backgrounds: {
      chapter1: "from-blue-50 via-sky-50 to-indigo-100", // Childhood
      chapter2: "from-amber-50 via-orange-50 to-amber-100", // Education
      chapter3: "from-emerald-50 via-green-50 to-teal-100", // Europe
      chapter4: "from-pink-50 via-rose-50 to-red-100", // Noli Me Tangere
      chapter5: "from-purple-50 via-indigo-50 to-blue-100", // Return & Legacy
    },
    gradients: {
      success: "from-green-400 to-emerald-500",
      warning: "from-yellow-400 to-orange-500",
      error: "from-red-400 to-red-500",
      info: "from-blue-400 to-indigo-500",
    },
    text: {
      primary: "text-gray-800",
      secondary: "text-gray-600",
      muted: "text-gray-500",
      light: "text-gray-400",
    },
  },
  animations: {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    wiggle: "animate-wiggle",
    scaleIn: "animate-scale-in",
  },
  transitions: {
    fast: "transition-all duration-150",
    normal: "transition-all duration-200",
    slow: "transition-all duration-300",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
};

// Chapter-specific themes
export const getChapterTheme = (chapterId) => {
  const chapterThemes = {
    1: {
      background: filipinoTheme.colors.backgrounds.chapter1,
      primary: filipinoTheme.colors.primary.blue,
      icon: "🏠",
      title: "Childhood in Calamba",
    },
    2: {
      background: filipinoTheme.colors.backgrounds.chapter2,
      primary: filipinoTheme.colors.primary.yellow,
      icon: "🎓",
      title: "Education Years",
    },
    3: {
      background: filipinoTheme.colors.backgrounds.chapter3,
      primary: "from-emerald-400 to-green-600",
      icon: "🌍",
      title: "European Journey",
    },
    4: {
      background: filipinoTheme.colors.backgrounds.chapter4,
      primary: "from-pink-400 to-rose-500",
      icon: "📖",
      title: "Noli Me Tangere",
    },
    5: {
      background: filipinoTheme.colors.backgrounds.chapter5,
      primary: "from-purple-400 to-indigo-500",
      icon: "🏛️",
      title: "Return & Legacy",
    },
  };

  return chapterThemes[chapterId] || chapterThemes[1];
};

// Game type themes
export const getGameTypeTheme = (gameType) => {
  const gameThemes = {
    quiz: {
      primary: filipinoTheme.colors.primary.blue,
      icon: "❓",
      name: "Quiz Game",
    },
    puzzle: {
      primary: "from-purple-400 to-indigo-500",
      icon: "🧩",
      name: "Puzzle Game",
    },
    "drag-drop": {
      primary: "from-green-400 to-emerald-500",
      icon: "🎯",
      name: "Drag & Drop",
    },
    "word-collection": {
      primary: "from-pink-400 to-rose-500",
      icon: "📝",
      name: "Word Collection",
    },
    timeline: {
      primary: "from-amber-400 to-orange-500",
      icon: "📅",
      name: "Timeline",
    },
    crossword: {
      primary: "from-teal-400 to-cyan-500",
      icon: "🔤",
      name: "Crossword",
    },
    memory: {
      primary: "from-violet-400 to-purple-500",
      icon: "🧠",
      name: "Memory Game",
    },
  };

  return gameThemes[gameType] || gameThemes.quiz;
};

// Celebration themes
export const getCelebrationTheme = (type = "default") => {
  const celebrations = {
    default: {
      colors: filipinoTheme.colors.gradients.success,
      animation: filipinoTheme.animations.bounce,
      icon: "🎉",
    },
    completion: {
      colors: filipinoTheme.colors.gradients.success,
      animation: filipinoTheme.animations.pulse,
      icon: "🏆",
    },
    milestone: {
      colors: filipinoTheme.colors.primary.yellow,
      animation: filipinoTheme.animations.scaleIn,
      icon: "⭐",
    },
    perfect: {
      colors: "from-yellow-400 to-orange-500",
      animation: filipinoTheme.animations.wiggle,
      icon: "🌟",
    },
  };

  return celebrations[type] || celebrations.default;
};

export default filipinoTheme;
