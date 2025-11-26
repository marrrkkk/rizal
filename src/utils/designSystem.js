/**
 * Comprehensive Design System
 * Centralized design tokens and utilities for consistent UI
 * Implements Requirements 15.1, 15.2
 */

// ============================================================================
// SPACING SCALE
// ============================================================================
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
};

// Tailwind spacing classes
export const spacingClasses = {
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
  "3xl": "p-16",
  "4xl": "p-24",
};

// ============================================================================
// BUTTON VARIANTS
// ============================================================================
export const buttonVariants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

  secondary:
    "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

  success:
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",

  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",

  warning:
    "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",

  outline:
    "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
};

// Button sizes
export const buttonSizes = {
  xs: "px-3 py-1.5 text-xs rounded-md",
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-lg",
  lg: "px-8 py-4 text-lg rounded-xl",
  xl: "px-10 py-5 text-xl rounded-xl",
};

/**
 * Get button classes with variant and size
 */
export const getButtonClasses = (
  variant = "primary",
  size = "md",
  className = ""
) => {
  return `${buttonVariants[variant] || buttonVariants.primary} ${
    buttonSizes[size] || buttonSizes.md
  } ${className}`;
};

// ============================================================================
// CARD STYLES
// ============================================================================
export const cardVariants = {
  default:
    "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden",

  elevated:
    "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden",

  interactive:
    "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300",

  success:
    "bg-green-50 rounded-xl shadow-md border-2 border-green-300 overflow-hidden",

  warning:
    "bg-yellow-50 rounded-xl shadow-md border-2 border-yellow-300 overflow-hidden",

  error:
    "bg-red-50 rounded-xl shadow-md border-2 border-red-300 overflow-hidden",

  info: "bg-blue-50 rounded-xl shadow-md border-2 border-blue-300 overflow-hidden",

  gradient:
    "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 overflow-hidden",
};

/**
 * Get card classes with hover effects
 */
export const getCardClasses = (
  variant = "default",
  withHover = false,
  className = ""
) => {
  const baseClasses = cardVariants[variant] || cardVariants.default;
  const hoverClasses =
    withHover && variant === "default"
      ? "cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300"
      : "";
  return `${baseClasses} ${hoverClasses} ${className}`;
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================
export const animations = {
  // Entrance animations
  slideUp: "animate-slide-up",
  fadeIn: "animate-fade-in",
  scaleIn: "animate-scale-in",
  slideDown: "animate-slide-down",

  // Attention animations
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  wiggle: "animate-wiggle",

  // Loading animations
  spin: "animate-spin",
  shimmer: "animate-shimmer",

  // Celebration animations
  confetti: "animate-confetti",
  badgeBounce: "animate-badge-bounce",
  celebrationPulse: "animate-celebration-pulse",
};

/**
 * Get animation class
 */
export const getAnimationClass = (animation = "fadeIn") => {
  return animations[animation] || animations.fadeIn;
};

// ============================================================================
// TRANSITION UTILITIES
// ============================================================================
export const transitions = {
  fast: "transition-all duration-150 ease-in-out",
  normal: "transition-all duration-200 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  slower: "transition-all duration-500 ease-in-out",
};

// ============================================================================
// SHADOW UTILITIES
// ============================================================================
export const shadows = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
};

// ============================================================================
// BORDER RADIUS UTILITIES
// ============================================================================
export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================
export const colors = {
  // Primary colors (Philippine flag inspired)
  primary: {
    blue: "from-blue-500 to-indigo-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-400 to-amber-500",
  },

  // Status colors
  success: "from-green-500 to-emerald-600",
  warning: "from-yellow-500 to-orange-500",
  error: "from-red-500 to-red-600",
  info: "from-blue-500 to-indigo-600",

  // Neutral colors
  gray: {
    50: "bg-gray-50",
    100: "bg-gray-100",
    200: "bg-gray-200",
    300: "bg-gray-300",
    400: "bg-gray-400",
    500: "bg-gray-500",
    600: "bg-gray-600",
    700: "bg-gray-700",
    800: "bg-gray-800",
    900: "bg-gray-900",
  },
};

// ============================================================================
// TYPOGRAPHY UTILITIES
// ============================================================================
export const typography = {
  // Font sizes
  sizes: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  },

  // Font weights
  weights: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  },

  // Text colors
  colors: {
    primary: "text-gray-800",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    light: "text-gray-400",
    white: "text-white",
  },
};

// ============================================================================
// FOCUS STATES (Accessibility)
// ============================================================================
export const focusRing = {
  default:
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  success:
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  danger:
    "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  warning:
    "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
  none: "focus:outline-none",
};

// ============================================================================
// LOADING STATES
// ============================================================================
export const loadingStates = {
  spinner:
    "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
  skeleton: "animate-pulse bg-gray-200 rounded",
  shimmer:
    "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
};

/**
 * Get loading spinner classes
 */
export const getLoadingSpinner = (size = "md", color = "blue") => {
  const sizes = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colors = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    gray: "text-gray-500",
  };

  return `${loadingStates.spinner} ${sizes[size] || sizes.md} ${
    colors[color] || colors.blue
  }`;
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================
export const responsive = {
  // Container max widths
  containers: {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  },

  // Responsive padding
  padding: {
    mobile: "px-4 py-3",
    tablet: "px-6 py-4",
    desktop: "px-8 py-6",
  },
};

// ============================================================================
// BADGE UTILITIES
// ============================================================================
export const badgeVariants = {
  default:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
  primary:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
  success:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
  warning:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
  danger:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
  info: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
};

/**
 * Get badge classes
 */
export const getBadgeClasses = (variant = "default", className = "") => {
  return `${badgeVariants[variant] || badgeVariants.default} ${className}`;
};

// ============================================================================
// FORM INPUT UTILITIES
// ============================================================================
export const inputVariants = {
  default:
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400",

  error:
    "w-full px-4 py-3 rounded-lg border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 bg-red-50 text-gray-900 placeholder-red-400",

  success:
    "w-full px-4 py-3 rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 bg-green-50 text-gray-900 placeholder-green-400",

  disabled:
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed",
};

/**
 * Get input classes
 */
export const getInputClasses = (variant = "default", className = "") => {
  return `${inputVariants[variant] || inputVariants.default} ${className}`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combine multiple class names
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Get responsive text size
 */
export const getResponsiveText = (size = "base") => {
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

/**
 * Get responsive spacing
 */
export const getResponsiveSpacing = (size = "md") => {
  const sizes = {
    sm: "p-2 sm:p-3 md:p-4",
    md: "p-4 sm:p-5 md:p-6",
    lg: "p-6 sm:p-7 md:p-8",
    xl: "p-8 sm:p-10 md:p-12",
  };
  return sizes[size] || sizes.md;
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default {
  spacing,
  spacingClasses,
  buttonVariants,
  buttonSizes,
  getButtonClasses,
  cardVariants,
  getCardClasses,
  animations,
  getAnimationClass,
  transitions,
  shadows,
  borderRadius,
  colors,
  typography,
  focusRing,
  loadingStates,
  getLoadingSpinner,
  responsive,
  badgeVariants,
  getBadgeClasses,
  inputVariants,
  getInputClasses,
  cn,
  getResponsiveText,
  getResponsiveSpacing,
};
