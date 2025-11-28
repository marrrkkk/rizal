import {
  filipinoTheme,
  getChapterTheme,
  getGameTypeTheme,
} from "../theme/theme";

// Common button styles for games
export const getButtonStyles = (
  variant = "primary",
  theme = "blue",
  size = "md"
) => {
  const baseStyles = `font-medium rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const themeColors = {
    blue: filipinoTheme.colors.primary.blue,
    red: filipinoTheme.colors.primary.red,
    yellow: filipinoTheme.colors.primary.yellow,
    green: "from-emerald-400 to-green-600",
    purple: "from-purple-400 to-indigo-500",
    pink: "from-pink-400 to-rose-500",
  };

  const variantStyles = {
    primary: `bg-gradient-to-r ${
      themeColors[theme] || themeColors.blue
    } text-white hover:opacity-90 focus:ring-blue-500`,
    secondary: `bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-500`,
    success: `bg-gradient-to-r ${filipinoTheme.colors.gradients.success} text-white hover:opacity-90 focus:ring-green-500`,
    warning: `bg-gradient-to-r ${filipinoTheme.colors.gradients.warning} text-white hover:opacity-90 focus:ring-yellow-500`,
    error: `bg-gradient-to-r ${filipinoTheme.colors.gradients.error} text-white hover:opacity-90 focus:ring-red-500`,
    ghost: `bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500`,
  };

  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
};

// Common card styles for game elements
export const getCardStyles = (variant = "default", interactive = false) => {
  const baseStyles = `bg-white rounded-xl shadow-md overflow-hidden`;
  const interactiveStyles = interactive
    ? `cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1`
    : "";

  const variantStyles = {
    default: "border border-gray-200",
    elevated: "shadow-lg",
    outlined: "border-2 border-gray-300",
    success: "border-2 border-green-300 bg-green-50",
    warning: "border-2 border-yellow-300 bg-yellow-50",
    error: "border-2 border-red-300 bg-red-50",
    info: "border-2 border-blue-300 bg-blue-50",
  };

  return `${baseStyles} ${variantStyles[variant]} ${interactiveStyles}`;
};

// Input field styles for games
export const getInputStyles = (variant = "default", hasError = false) => {
  const baseStyles = `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`;

  const variantStyles = {
    default: hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white",
    filled: hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50"
      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50",
  };

  return `${baseStyles} ${variantStyles[variant]}`;
};

// Game container styles
export const getGameContainerStyles = (chapterId = 1) => {
  const chapterTheme = getChapterTheme(chapterId);
  return `min-h-screen w-full bg-gradient-to-br ${chapterTheme.background}`;
};

// Game content area styles
export const getGameContentStyles = (padding = "md") => {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  };

  return `w-full max-w-6xl mx-auto ${paddingStyles[padding]}`;
};

// Drag and drop styles
export const getDragDropStyles = (
  isDragging = false,
  isOver = false,
  canDrop = false
) => {
  const baseStyles = `rounded-lg border-2 border-dashed transition-all duration-200`;

  let styles = baseStyles;

  if (isDragging) {
    styles += " opacity-50 transform rotate-2 scale-105";
  }

  if (isOver && canDrop) {
    styles += " border-green-400 bg-green-50 scale-105";
  } else if (isOver && !canDrop) {
    styles += " border-red-400 bg-red-50";
  } else if (canDrop) {
    styles += " border-blue-400 bg-blue-50";
  } else {
    styles += " border-gray-300 bg-gray-50";
  }

  return styles;
};

// Quiz option styles
export const getQuizOptionStyles = (
  isSelected = false,
  isCorrect = null,
  isRevealed = false
) => {
  const baseStyles = `w-full p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left`;

  if (!isRevealed) {
    return `${baseStyles} ${
      isSelected
        ? "border-blue-500 bg-blue-50 text-blue-900"
        : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
    }`;
  }

  // Revealed state (after answer submission)
  if (isCorrect === true) {
    return `${baseStyles} border-green-500 bg-green-50 text-green-900`;
  } else if (isCorrect === false && isSelected) {
    return `${baseStyles} border-red-500 bg-red-50 text-red-900`;
  } else {
    return `${baseStyles} border-gray-300 bg-gray-100 text-gray-600`;
  }
};

// Celebration animation styles
export const getCelebrationStyles = (type = "default") => {
  const celebrations = {
    default: "",
    pulse: "",
    spin: "",
    wiggle: "",
    fadeIn: "",
    scaleIn: "",
  };

  return celebrations[type] || celebrations.default;
};

// Loading spinner styles
export const getLoadingStyles = (size = "md", theme = "blue") => {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const themeColors = {
    blue: "text-blue-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    green: "text-green-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
  };

  return `${sizeStyles[size]} ${
    themeColors[theme] || themeColors.blue
  } animate-spin`;
};

// Badge styles for achievements and status
export const getBadgeStyles = (variant = "default", size = "md") => {
  const baseStyles = `inline-flex items-center font-medium rounded-full`;

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    locked: "bg-gray-100 text-gray-500",
    available: "bg-blue-100 text-blue-800",
  };

  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
};

// Modal/Dialog styles
export const getModalStyles = () => {
  return {
    overlay:
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
    content:
      "bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto",
    header: "p-6 border-b border-gray-200",
    body: "p-6",
    footer: "p-6 border-t border-gray-200 flex justify-end space-x-3",
  };
};

// Tooltip styles
export const getTooltipStyles = () => {
  return "absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip invisible transition-opacity duration-300";
};

// Game-specific utility functions
export const getGameThemeByType = (gameType, chapterId) => {
  const gameTheme = getGameTypeTheme(gameType);
  const chapterTheme = getChapterTheme(chapterId);

  return {
    ...gameTheme,
    background: chapterTheme.background,
    chapterIcon: chapterTheme.icon,
  };
};

// Responsive text sizes
export const getResponsiveTextSize = (size = "base") => {
  const sizes = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
  };

  return sizes[size] || sizes.base;
};

export default {
  getButtonStyles,
  getCardStyles,
  getInputStyles,
  getGameContainerStyles,
  getGameContentStyles,
  getDragDropStyles,
  getQuizOptionStyles,
  getCelebrationStyles,
  getLoadingStyles,
  getBadgeStyles,
  getModalStyles,
  getTooltipStyles,
  getGameThemeByType,
  getResponsiveTextSize,
};
