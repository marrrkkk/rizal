/**
 * Responsive Design Optimizations
 * Comprehensive utilities for mobile, tablet, and desktop optimization
 * Implements Requirements 7.1, 7.2, 7.3
 */

// ============================================================================
// VIEWPORT DETECTION AND MANAGEMENT
// ============================================================================

/**
 * Get accurate viewport dimensions accounting for mobile browser chrome
 */
export const getAccurateViewport = () => {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  // Use visualViewport API for more accurate mobile measurements
  if (window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height,
      scale: window.visualViewport.scale,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
  };
};

/**
 * Detect if viewport is in safe area (not obscured by notches, etc.)
 */
export const getSafeAreaInsets = () => {
  if (typeof window === "undefined")
    return { top: 0, right: 0, bottom: 0, left: 0 };

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue("env(safe-area-inset-top)") || "0"),
    right: parseInt(
      style.getPropertyValue("env(safe-area-inset-right)") || "0"
    ),
    bottom: parseInt(
      style.getPropertyValue("env(safe-area-inset-bottom)") || "0"
    ),
    left: parseInt(style.getPropertyValue("env(safe-area-inset-left)") || "0"),
  };
};

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Comprehensive device detection
 */
export const detectDevice = () => {
  if (typeof window === "undefined") {
    return {
      type: "desktop",
      os: "unknown",
      browser: "unknown",
      isTouch: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  const ua = navigator.userAgent;
  const width = window.innerWidth;

  // Detect OS
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isMac = /Macintosh/.test(ua);

  // Detect browser
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isChrome = /Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);

  // Detect device type
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = width < 768 || /Mobile/.test(ua);
  const isTablet = (width >= 768 && width < 1024) || /Tablet|iPad/.test(ua);
  const isDesktop = width >= 1024 && !isTouch;

  return {
    type: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    os: isIOS
      ? "ios"
      : isAndroid
      ? "android"
      : isWindows
      ? "windows"
      : isMac
      ? "mac"
      : "unknown",
    browser: isSafari
      ? "safari"
      : isChrome
      ? "chrome"
      : isFirefox
      ? "firefox"
      : isEdge
      ? "edge"
      : "unknown",
    isTouch,
    isMobile,
    isTablet,
    isDesktop,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    width,
    height: window.innerHeight,
  };
};

// ============================================================================
// BREAKPOINT UTILITIES
// ============================================================================

/**
 * Enhanced breakpoint detection with custom breakpoints
 */
export const createBreakpointDetector = (customBreakpoints = {}) => {
  const defaultBreakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  return {
    /**
     * Check if current viewport matches breakpoint
     */
    is: (breakpoint) => {
      if (typeof window === "undefined") return false;
      const width = window.innerWidth;
      return width >= breakpoints[breakpoint];
    },

    /**
     * Check if viewport is between two breakpoints
     */
    between: (min, max) => {
      if (typeof window === "undefined") return false;
      const width = window.innerWidth;
      return width >= breakpoints[min] && width < breakpoints[max];
    },

    /**
     * Get current breakpoint name
     */
    current: () => {
      if (typeof window === "undefined") return "md";
      const width = window.innerWidth;

      const sorted = Object.entries(breakpoints).sort(([, a], [, b]) => b - a);

      for (const [name, value] of sorted) {
        if (width >= value) return name;
      }

      return "xs";
    },

    /**
     * Get all breakpoints
     */
    all: () => breakpoints,
  };
};

// ============================================================================
// TOUCH OPTIMIZATION
// ============================================================================

/**
 * Enhanced touch event handling with better performance
 */
export const createTouchHandler = (options = {}) => {
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    enableHaptics = true,
    preventScroll = false,
    threshold = 10,
  } = options;

  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let lastMoveTime = 0;
  const moveThrottle = 16; // ~60fps

  const triggerHaptic = (pattern = 50) => {
    if (enableHaptics && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return {
    handleTouchStart: (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isDragging = false;

      triggerHaptic(25);

      if (onTouchStart) {
        onTouchStart(e, { x: startX, y: startY });
      }
    },

    handleTouchMove: (e) => {
      if (preventScroll) {
        e.preventDefault();
      }

      const now = Date.now();
      if (now - lastMoveTime < moveThrottle) return;
      lastMoveTime = now;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!isDragging && distance > threshold) {
        isDragging = true;
        triggerHaptic(15);
      }

      if (onTouchMove && isDragging) {
        onTouchMove(e, {
          x: touch.clientX,
          y: touch.clientY,
          deltaX,
          deltaY,
          distance,
          isDragging,
        });
      }
    },

    handleTouchEnd: (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (onTouchEnd) {
        onTouchEnd(e, {
          x: touch.clientX,
          y: touch.clientY,
          deltaX,
          deltaY,
          isDragging,
        });
      }

      isDragging = false;
    },

    handleTouchCancel: (e) => {
      if (onTouchCancel) {
        onTouchCancel(e);
      }
      isDragging = false;
    },
  };
};

// ============================================================================
// LAYOUT OPTIMIZATION
// ============================================================================

/**
 * Calculate optimal grid columns based on viewport and content
 */
export const calculateOptimalColumns = (
  itemWidth,
  containerWidth,
  gap = 16,
  minColumns = 1,
  maxColumns = 6
) => {
  const availableWidth = containerWidth - gap * (maxColumns - 1);
  const possibleColumns = Math.floor(availableWidth / itemWidth);
  return Math.max(minColumns, Math.min(maxColumns, possibleColumns));
};

/**
 * Get responsive container padding
 */
export const getResponsiveContainerPadding = (device) => {
  const paddingMap = {
    mobile: { x: 16, y: 16 },
    tablet: { x: 24, y: 20 },
    desktop: { x: 32, y: 24 },
  };

  return paddingMap[device.type] || paddingMap.mobile;
};

/**
 * Calculate responsive font size
 */
export const calculateResponsiveFontSize = (baseSize, viewport) => {
  const { width } = viewport;

  // Use fluid typography formula: min + (max - min) * ((width - minWidth) / (maxWidth - minWidth))
  const minWidth = 320;
  const maxWidth = 1920;
  const minSize = baseSize * 0.875; // 87.5% of base
  const maxSize = baseSize * 1.125; // 112.5% of base

  if (width <= minWidth) return minSize;
  if (width >= maxWidth) return maxSize;

  const ratio = (width - minWidth) / (maxWidth - minWidth);
  return minSize + (maxSize - minSize) * ratio;
};

// ============================================================================
// ORIENTATION HANDLING
// ============================================================================

/**
 * Detect and handle orientation changes
 */
export const createOrientationHandler = (callback) => {
  if (typeof window === "undefined") return () => {};

  let currentOrientation =
    window.innerHeight > window.innerWidth ? "portrait" : "landscape";

  const handleOrientationChange = () => {
    const newOrientation =
      window.innerHeight > window.innerWidth ? "portrait" : "landscape";

    if (newOrientation !== currentOrientation) {
      currentOrientation = newOrientation;

      // Wait for layout to stabilize
      setTimeout(() => {
        callback(newOrientation, {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    }
  };

  window.addEventListener("orientationchange", handleOrientationChange);
  window.addEventListener("resize", handleOrientationChange);

  return () => {
    window.removeEventListener("orientationchange", handleOrientationChange);
    window.removeEventListener("resize", handleOrientationChange);
  };
};

// ============================================================================
// SCROLL OPTIMIZATION
// ============================================================================

/**
 * Create optimized scroll handler with throttling
 */
export const createScrollHandler = (callback, throttle = 100) => {
  if (typeof window === "undefined") return () => {};

  let lastScrollTime = 0;
  let ticking = false;

  const handleScroll = () => {
    const now = Date.now();

    if (now - lastScrollTime < throttle) {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback({
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            direction: window.scrollY > lastScrollTime ? "down" : "up",
          });
          ticking = false;
        });
        ticking = true;
      }
      return;
    }

    lastScrollTime = now;
    callback({
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      direction: window.scrollY > lastScrollTime ? "down" : "up",
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Monitor and optimize performance based on device capabilities
 */
export const createPerformanceMonitor = () => {
  if (typeof window === "undefined") {
    return {
      isLowEnd: false,
      shouldReduceAnimations: false,
      shouldReduceQuality: false,
    };
  }

  // Detect low-end device
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = navigator.deviceMemory || 2;
  const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;

  // Check user preferences
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const prefersReducedData = window.matchMedia(
    "(prefers-reduced-data: reduce)"
  ).matches;

  // Check network speed
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const isSlowConnection =
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g");

  return {
    isLowEnd,
    shouldReduceAnimations: isLowEnd || prefersReducedMotion,
    shouldReduceQuality: isLowEnd || prefersReducedData || isSlowConnection,
    hardwareConcurrency,
    deviceMemory,
    connectionSpeed: connection?.effectiveType || "unknown",
    prefersReducedMotion,
    prefersReducedData,
  };
};

// ============================================================================
// RESPONSIVE IMAGE LOADING
// ============================================================================

/**
 * Get optimal image size based on viewport and device pixel ratio
 */
export const getOptimalImageSize = (
  baseWidth,
  baseHeight,
  viewport,
  dpr = window.devicePixelRatio || 1
) => {
  const { width } = viewport;

  // Calculate optimal width based on viewport
  let optimalWidth = baseWidth;
  if (width < 768) {
    optimalWidth = Math.min(baseWidth, width * dpr);
  } else if (width < 1024) {
    optimalWidth = Math.min(baseWidth, width * 0.5 * dpr);
  } else {
    optimalWidth = Math.min(baseWidth, width * 0.33 * dpr);
  }

  // Maintain aspect ratio
  const aspectRatio = baseHeight / baseWidth;
  const optimalHeight = optimalWidth * aspectRatio;

  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight),
  };
};

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

/**
 * Ensure minimum touch target size (WCAG AA compliant)
 */
export const ensureTouchTargetSize = (element, minSize = 44) => {
  if (!element) return;

  const rect = element.getBoundingClientRect();

  if (rect.width < minSize || rect.height < minSize) {
    element.style.minWidth = `${minSize}px`;
    element.style.minHeight = `${minSize}px`;
    element.style.display = "inline-flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
  }
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (element, threshold = 0) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView =
    rect.top <= windowHeight - threshold && rect.top + rect.height >= threshold;
  const horInView =
    rect.left <= windowWidth - threshold && rect.left + rect.width >= threshold;

  return vertInView && horInView;
};

// ============================================================================
// RESPONSIVE UTILITIES EXPORT
// ============================================================================

export default {
  getAccurateViewport,
  getSafeAreaInsets,
  detectDevice,
  createBreakpointDetector,
  createTouchHandler,
  calculateOptimalColumns,
  getResponsiveContainerPadding,
  calculateResponsiveFontSize,
  createOrientationHandler,
  createScrollHandler,
  createPerformanceMonitor,
  getOptimalImageSize,
  ensureTouchTargetSize,
  isElementInViewport,
};
