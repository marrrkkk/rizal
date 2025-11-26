/**
 * Responsive Design Utilities
 * Provides utilities for responsive layouts and mobile optimization
 * Implements Requirements 7.1, 7.2, 7.3
 */

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Standard breakpoints matching Tailwind CSS
 */
export const breakpoints = {
  mobile: 640, // sm
  tablet: 768, // md
  laptop: 1024, // lg
  desktop: 1280, // xl
  wide: 1536, // 2xl
};

/**
 * Check if current viewport matches breakpoint
 */
export const isBreakpoint = (breakpoint) => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

/**
 * Get current breakpoint
 */
export const getCurrentBreakpoint = () => {
  if (typeof window === "undefined") return "mobile";

  const width = window.innerWidth;

  if (width >= breakpoints.wide) return "wide";
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.laptop) return "laptop";
  if (width >= breakpoints.tablet) return "tablet";
  return "mobile";
};

// ============================================================================
// RESPONSIVE CONTAINERS
// ============================================================================

/**
 * Container max widths for different breakpoints
 */
export const containerClasses = {
  sm: "max-w-screen-sm mx-auto px-4",
  md: "max-w-screen-md mx-auto px-4 sm:px-6",
  lg: "max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8",
  xl: "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8",
  "2xl": "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8",
  full: "w-full px-4 sm:px-6 lg:px-8",
};

/**
 * Get container classes
 */
export const getContainer = (size = "xl") => {
  return containerClasses[size] || containerClasses.xl;
};

// ============================================================================
// RESPONSIVE GRID LAYOUTS
// ============================================================================

/**
 * Responsive grid classes
 */
export const gridClasses = {
  // Auto-fit grids
  autoFit1: "grid grid-cols-1",
  autoFit2: "grid grid-cols-1 sm:grid-cols-2",
  autoFit3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  autoFit4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  autoFit6: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",

  // Fixed column grids
  cols1: "grid grid-cols-1",
  cols2: "grid grid-cols-2",
  cols3: "grid grid-cols-3",
  cols4: "grid grid-cols-4",

  // Responsive gaps
  gapSm: "gap-2 sm:gap-3 md:gap-4",
  gapMd: "gap-4 sm:gap-5 md:gap-6",
  gapLg: "gap-6 sm:gap-7 md:gap-8",
};

/**
 * Get responsive grid classes
 */
export const getGrid = (columns = 3, gap = "md") => {
  const colClass = gridClasses[`autoFit${columns}`] || gridClasses.autoFit3;
  const gapClass =
    gridClasses[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`] ||
    gridClasses.gapMd;
  return `${colClass} ${gapClass}`;
};

// ============================================================================
// RESPONSIVE FLEX LAYOUTS
// ============================================================================

/**
 * Responsive flex classes
 */
export const flexClasses = {
  // Direction
  col: "flex flex-col",
  row: "flex flex-row",
  colToRow: "flex flex-col md:flex-row",
  rowToCol: "flex flex-row md:flex-col",

  // Alignment
  center: "items-center justify-center",
  start: "items-start justify-start",
  end: "items-end justify-end",
  between: "items-center justify-between",
  around: "items-center justify-around",

  // Gaps
  gapSm: "gap-2 sm:gap-3",
  gapMd: "gap-4 sm:gap-5",
  gapLg: "gap-6 sm:gap-7",
};

/**
 * Get responsive flex classes
 */
export const getFlex = (direction = "col", alignment = "start", gap = "md") => {
  const dirClass = flexClasses[direction] || flexClasses.col;
  const alignClass = flexClasses[alignment] || flexClasses.start;
  const gapClass =
    flexClasses[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`] ||
    flexClasses.gapMd;
  return `${dirClass} ${alignClass} ${gapClass}`;
};

// ============================================================================
// RESPONSIVE SPACING
// ============================================================================

/**
 * Responsive padding classes
 */
export const paddingClasses = {
  xs: "p-2 sm:p-3 md:p-4",
  sm: "p-3 sm:p-4 md:p-5",
  md: "p-4 sm:p-5 md:p-6",
  lg: "p-6 sm:p-7 md:p-8",
  xl: "p-8 sm:p-10 md:p-12",
};

/**
 * Responsive margin classes
 */
export const marginClasses = {
  xs: "m-2 sm:m-3 md:m-4",
  sm: "m-3 sm:m-4 md:m-5",
  md: "m-4 sm:m-5 md:m-6",
  lg: "m-6 sm:m-7 md:m-8",
  xl: "m-8 sm:m-10 md:m-12",
};

/**
 * Get responsive padding
 */
export const getPadding = (size = "md") => {
  return paddingClasses[size] || paddingClasses.md;
};

/**
 * Get responsive margin
 */
export const getMargin = (size = "md") => {
  return marginClasses[size] || marginClasses.md;
};

// ============================================================================
// RESPONSIVE TYPOGRAPHY
// ============================================================================

/**
 * Responsive text size classes
 */
export const textSizeClasses = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
  xl: "text-xl sm:text-2xl",
  "2xl": "text-2xl sm:text-3xl",
  "3xl": "text-3xl sm:text-4xl",
  "4xl": "text-4xl sm:text-5xl",
};

/**
 * Fluid typography using clamp
 */
export const fluidTextClasses = {
  xs: "text-[clamp(0.75rem,2vw,0.875rem)]",
  sm: "text-[clamp(0.875rem,2.5vw,1rem)]",
  base: "text-[clamp(1rem,3vw,1.125rem)]",
  lg: "text-[clamp(1.125rem,3.5vw,1.25rem)]",
  xl: "text-[clamp(1.25rem,4vw,1.5rem)]",
  "2xl": "text-[clamp(1.5rem,5vw,2rem)]",
  "3xl": "text-[clamp(2rem,6vw,2.5rem)]",
};

/**
 * Get responsive text size
 */
export const getTextSize = (size = "base", fluid = false) => {
  if (fluid) {
    return fluidTextClasses[size] || fluidTextClasses.base;
  }
  return textSizeClasses[size] || textSizeClasses.base;
};

// ============================================================================
// MOBILE OPTIMIZATIONS
// ============================================================================

/**
 * Mobile-specific classes
 */
export const mobileClasses = {
  // Touch targets (minimum 44x44px for WCAG)
  touchTarget: "min-w-[44px] min-h-[44px] p-3",
  touchTargetLarge: "min-w-[48px] min-h-[48px] p-4",

  // Mobile-friendly spacing
  spacing: "px-4 py-3",
  spacingLarge: "px-6 py-4",

  // Mobile text sizes
  textSm: "text-sm leading-relaxed",
  textBase: "text-base leading-relaxed",
  textLg: "text-lg leading-relaxed",

  // Mobile-optimized cards
  card: "rounded-xl p-4 shadow-md",
  cardLarge: "rounded-2xl p-6 shadow-lg",

  // Mobile navigation
  nav: "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg",
  navItem: "flex-1 flex flex-col items-center justify-center py-2 min-h-[56px]",
};

/**
 * Get mobile-optimized classes
 */
export const getMobileClass = (element = "touchTarget") => {
  return mobileClasses[element] || mobileClasses.touchTarget;
};

// ============================================================================
// TABLET OPTIMIZATIONS
// ============================================================================

/**
 * Tablet-specific classes
 */
export const tabletClasses = {
  // Tablet grid layouts
  grid2: "md:grid-cols-2",
  grid3: "md:grid-cols-3",
  grid4: "md:grid-cols-4",

  // Tablet spacing
  spacing: "md:px-6 md:py-5",
  spacingLarge: "md:px-8 md:py-6",

  // Tablet text sizes
  textSm: "md:text-base",
  textBase: "md:text-lg",
  textLg: "md:text-xl",
};

// ============================================================================
// VISIBILITY UTILITIES
// ============================================================================

/**
 * Show/hide at different breakpoints
 */
export const visibilityClasses = {
  // Show only on mobile
  mobileOnly: "block sm:hidden",

  // Show on tablet and up
  tabletUp: "hidden md:block",

  // Show on desktop and up
  desktopUp: "hidden lg:block",

  // Hide on mobile
  hideMobile: "hidden sm:block",

  // Hide on tablet
  hideTablet: "md:hidden lg:block",
};

/**
 * Get visibility classes
 */
export const getVisibility = (show = "all") => {
  return visibilityClasses[show] || "";
};

// ============================================================================
// TOUCH INTERACTIONS
// ============================================================================

/**
 * Touch-friendly interaction classes
 */
export const touchClasses = {
  // Prevent text selection during drag
  noSelect: "select-none touch-none",

  // Smooth scrolling
  smoothScroll: "overflow-auto -webkit-overflow-scrolling-touch",

  // Touch manipulation
  manipulation: "touch-manipulation",

  // Active states for touch
  activeScale: "active:scale-95 transition-transform duration-100",
  activeOpacity: "active:opacity-70 transition-opacity duration-100",

  // Drag and drop
  draggable: "cursor-grab active:cursor-grabbing touch-none",
  dropZone:
    "border-2 border-dashed border-gray-300 rounded-lg transition-colors duration-200",
};

/**
 * Get touch interaction classes
 */
export const getTouchClass = (interaction = "manipulation") => {
  return touchClasses[interaction] || touchClasses.manipulation;
};

// ============================================================================
// ORIENTATION SUPPORT
// ============================================================================

/**
 * Orientation-specific classes
 */
export const orientationClasses = {
  portrait: "portrait:flex-col",
  landscape: "landscape:flex-row",
  portraitGrid: "portrait:grid-cols-1",
  landscapeGrid: "landscape:grid-cols-2",
};

// ============================================================================
// SAFE AREA SUPPORT (iOS)
// ============================================================================

/**
 * Safe area inset classes for iOS devices
 */
export const safeAreaClasses = {
  top: "pt-[env(safe-area-inset-top)]",
  bottom: "pb-[env(safe-area-inset-bottom)]",
  left: "pl-[env(safe-area-inset-left)]",
  right: "pr-[env(safe-area-inset-right)]",
  all: "p-[env(safe-area-inset-top)] p-[env(safe-area-inset-right)] p-[env(safe-area-inset-bottom)] p-[env(safe-area-inset-left)]",
};

/**
 * Get safe area classes
 */
export const getSafeArea = (side = "all") => {
  return safeAreaClasses[side] || safeAreaClasses.all;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect if device is mobile
 */
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detect if device is tablet
 */
export const isTabletDevice = () => {
  if (typeof window === "undefined") return false;
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
};

/**
 * Detect if device supports touch
 */
export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

/**
 * Get viewport dimensions
 */
export const getViewport = () => {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Check if viewport is in portrait mode
 */
export const isPortrait = () => {
  if (typeof window === "undefined") return true;
  return window.innerHeight > window.innerWidth;
};

/**
 * Check if viewport is in landscape mode
 */
export const isLandscape = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Add resize listener
 */
export const onResize = (callback) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

/**
 * Add orientation change listener
 */
export const onOrientationChange = (callback) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("orientationchange", callback);
  return () => window.removeEventListener("orientationchange", callback);
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default {
  breakpoints,
  isBreakpoint,
  getCurrentBreakpoint,
  containerClasses,
  getContainer,
  gridClasses,
  getGrid,
  flexClasses,
  getFlex,
  paddingClasses,
  marginClasses,
  getPadding,
  getMargin,
  textSizeClasses,
  fluidTextClasses,
  getTextSize,
  mobileClasses,
  getMobileClass,
  tabletClasses,
  visibilityClasses,
  getVisibility,
  touchClasses,
  getTouchClass,
  orientationClasses,
  safeAreaClasses,
  getSafeArea,
  isMobileDevice,
  isTabletDevice,
  isTouchDevice,
  getViewport,
  isPortrait,
  isLandscape,
  onResize,
  onOrientationChange,
};
