/**
 * Interactive Element Feedback Utilities
 * Provides consistent hover, click, and state feedback across the application
 * Implements Requirement 15.2
 */

// ============================================================================
// HOVER EFFECTS
// ============================================================================

/**
 * Standard hover effect for clickable elements
 */
export const hoverEffect = {
  default: "hover:bg-gray-50 hover:shadow-md transition-all duration-200",
  lift: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
  scale: "hover:scale-105 transition-transform duration-200",
  glow: "hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300",
  subtle: "hover:bg-gray-100 transition-colors duration-150",
  brighten: "hover:brightness-110 transition-all duration-200",
  darken: "hover:brightness-90 transition-all duration-200",
  rotate: "hover:rotate-3 transition-transform duration-200",
  pulse: "",
};

/**
 * Get hover classes for buttons
 */
export const getButtonHover = (variant = "default") => {
  const variants = {
    default:
      "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200",
    primary:
      "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 transition-all duration-200",
    secondary:
      "hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200",
    ghost: "hover:bg-gray-100 hover:shadow-sm transition-all duration-200",
    danger:
      "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 transition-all duration-200",
    success:
      "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 transition-all duration-200",
    warning:
      "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 transition-all duration-200",
  };
  return variants[variant] || variants.default;
};

/**
 * Get hover classes for cards
 */
export const getCardHover = (interactive = true) => {
  if (!interactive) return "";
  return "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 transition-all duration-300";
};

/**
 * Get hover classes for links
 */
export const getLinkHover = () => {
  return "hover:text-blue-600 hover:underline transition-colors duration-200";
};

// ============================================================================
// CLICK FEEDBACK
// ============================================================================

/**
 * Click feedback animations
 */
export const clickFeedback = {
  scale: "active:scale-95 transition-transform duration-100",
  press: "active:translate-y-0.5 transition-transform duration-100",
  ripple: "relative overflow-hidden",
  bounce: "",
};

/**
 * Get click feedback classes
 */
export const getClickFeedback = (type = "scale") => {
  return clickFeedback[type] || clickFeedback.scale;
};

/**
 * Combined hover and click feedback
 */
export const getInteractiveFeedback = (variant = "default") => {
  const variants = {
    default:
      "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200",
    button:
      "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200",
    card: "hover:shadow-xl hover:-translate-y-1 active:-translate-y-0.5 transition-all duration-300",
    subtle:
      "hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150",
  };
  return variants[variant] || variants.default;
};

// ============================================================================
// SUCCESS STATE STYLING
// ============================================================================

/**
 * Success state classes
 */
export const successState = {
  background: "bg-green-50 border-green-300",
  text: "text-green-800",
  icon: "text-green-600",
  button: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
  badge: "bg-green-100 text-green-800 border border-green-300",
  alert:
    "bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg",
  animation: "animate-scale-in",
};

/**
 * Get success state classes
 */
export const getSuccessClasses = (element = "background") => {
  return successState[element] || successState.background;
};

/**
 * Success feedback with animation
 */
export const showSuccessFeedback = (element) => {
  if (!element) return;

  // Add success classes
  element.classList.add("bg-green-50", "border-green-300", "animate-scale-in");

  // Add checkmark icon temporarily
  const checkmark = document.createElement("span");
  checkmark.innerHTML = "✓";
  checkmark.className =
    "absolute top-2 right-2 text-green-600 text-2xl";
  element.style.position = "relative";
  element.appendChild(checkmark);

  // Remove after animation
  setTimeout(() => {
    element.classList.remove("animate-scale-in");
    checkmark.remove();
  }, 1000);
};

// ============================================================================
// ERROR STATE STYLING
// ============================================================================

/**
 * Error state classes
 */
export const errorState = {
  background: "bg-red-50 border-red-300",
  text: "text-red-800",
  icon: "text-red-600",
  button: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  badge: "bg-red-100 text-red-800 border border-red-300",
  alert: "bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg",
  animation: "animate-wiggle",
  input: "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50",
};

/**
 * Get error state classes
 */
export const getErrorClasses = (element = "background") => {
  return errorState[element] || errorState.background;
};

/**
 * Error feedback with animation
 */
export const showErrorFeedback = (element) => {
  if (!element) return;

  // Add error classes
  element.classList.add("bg-red-50", "border-red-300", "animate-wiggle");

  // Remove animation after it completes
  setTimeout(() => {
    element.classList.remove("animate-wiggle");
  }, 1000);
};

// ============================================================================
// WARNING STATE STYLING
// ============================================================================

/**
 * Warning state classes
 */
export const warningState = {
  background: "bg-yellow-50 border-yellow-300",
  text: "text-yellow-800",
  icon: "text-yellow-600",
  button: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
  badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  alert:
    "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg",
  animation: "",
};

/**
 * Get warning state classes
 */
export const getWarningClasses = (element = "background") => {
  return warningState[element] || warningState.background;
};

// ============================================================================
// INFO STATE STYLING
// ============================================================================

/**
 * Info state classes
 */
export const infoState = {
  background: "bg-blue-50 border-blue-300",
  text: "text-blue-800",
  icon: "text-blue-600",
  button: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
  badge: "bg-blue-100 text-blue-800 border border-blue-300",
  alert: "bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg",
};

/**
 * Get info state classes
 */
export const getInfoClasses = (element = "background") => {
  return infoState[element] || infoState.background;
};

// ============================================================================
// LOADING STATE INDICATORS
// ============================================================================

/**
 * Loading state classes
 */
export const loadingState = {
  spinner:
    "inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent",
  skeleton: "animate-pulse bg-gray-200 rounded",
  shimmer:
    "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
  dots: "inline-flex space-x-1",
  overlay: "absolute inset-0 bg-white/80 flex items-center justify-center z-50",
};

/**
 * Get loading spinner
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
    white: "text-white",
  };

  return `${loadingState.spinner} ${sizes[size] || sizes.md} ${
    colors[color] || colors.blue
  }`;
};

/**
 * Get loading dots
 */
export const getLoadingDots = () => {
  return `
    <div class="${loadingState.dots}">
      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
  `;
};

/**
 * Show loading overlay
 */
export const showLoadingOverlay = (element, message = "Loading...") => {
  if (!element) return;

  const overlay = document.createElement("div");
  overlay.className = loadingState.overlay;
  overlay.innerHTML = `
    <div class="text-center">
      <div class="${getLoadingSpinner("lg", "blue")} mb-4"></div>
      <p class="text-gray-600 font-medium">${message}</p>
    </div>
  `;

  element.style.position = "relative";
  element.appendChild(overlay);

  return overlay;
};

/**
 * Hide loading overlay
 */
export const hideLoadingOverlay = (overlay) => {
  if (overlay && overlay.parentNode) {
    overlay.remove();
  }
};

// ============================================================================
// DISABLED STATE
// ============================================================================

/**
 * Disabled state classes
 */
export const disabledState = {
  button: "opacity-50 cursor-not-allowed pointer-events-none",
  input: "bg-gray-100 text-gray-500 cursor-not-allowed",
  card: "opacity-60 cursor-not-allowed grayscale",
};

/**
 * Get disabled state classes
 */
export const getDisabledClasses = (element = "button") => {
  return disabledState[element] || disabledState.button;
};

// ============================================================================
// FOCUS STATES (Accessibility)
// ============================================================================

/**
 * Focus state classes for accessibility
 */
export const focusState = {
  default:
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  success:
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  danger:
    "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  warning:
    "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
  visible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
};

/**
 * Get focus state classes
 */
export const getFocusClasses = (variant = "default") => {
  return focusState[variant] || focusState.default;
};

// ============================================================================
// TRANSITION UTILITIES
// ============================================================================

/**
 * Transition classes
 */
export const transition = {
  fast: "transition-all duration-150 ease-in-out",
  normal: "transition-all duration-200 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-200 ease-in-out",
  opacity: "transition-opacity duration-200 ease-in-out",
};

/**
 * Get transition classes
 */
export const getTransition = (type = "normal") => {
  return transition[type] || transition.normal;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Add ripple effect to element
 */
export const addRippleEffect = (event) => {
  const button = event.currentTarget;
  const ripple = document.createElement("span");

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - radius}px`;
  ripple.style.top = `${event.clientY - rect.top - radius}px`;
  ripple.className = "ripple";

  const existingRipple = button.getElementsByClassName("ripple")[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
};

/**
 * Combine multiple feedback classes
 */
export const combineInteractiveFeedback = (...feedbacks) => {
  return feedbacks.filter(Boolean).join(" ");
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default {
  hoverEffect,
  getButtonHover,
  getCardHover,
  getLinkHover,
  clickFeedback,
  getClickFeedback,
  getInteractiveFeedback,
  successState,
  getSuccessClasses,
  showSuccessFeedback,
  errorState,
  getErrorClasses,
  showErrorFeedback,
  warningState,
  getWarningClasses,
  infoState,
  getInfoClasses,
  loadingState,
  getLoadingSpinner,
  getLoadingDots,
  showLoadingOverlay,
  hideLoadingOverlay,
  disabledState,
  getDisabledClasses,
  focusState,
  getFocusClasses,
  transition,
  getTransition,
  addRippleEffect,
  combineInteractiveFeedback,
};
