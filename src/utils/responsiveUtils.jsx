// Responsive design utilities for mobile compatibility
import { useState, useEffect } from "react";

// Hook to detect screen size and device type
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [deviceType, setDeviceType] = useState("desktop");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine device type based on width
      if (width < 640) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    const detectTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
      );
    };

    handleResize();
    detectTouch();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return {
    screenSize,
    deviceType,
    isTouchDevice,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    isSmallScreen: screenSize.width < 768,
    isMediumScreen: screenSize.width >= 768 && screenSize.width < 1024,
    isLargeScreen: screenSize.width >= 1024,
  };
};

// Responsive breakpoint utilities
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Get responsive classes based on device type
export const getResponsiveClasses = (deviceType, classes) => {
  const responsiveMap = {
    mobile: classes.mobile || classes.default || "",
    tablet: classes.tablet || classes.default || "",
    desktop: classes.desktop || classes.default || "",
  };

  return responsiveMap[deviceType] || classes.default || "";
};

// Touch-friendly interaction utilities
export const getTouchFriendlyProps = (isTouchDevice) => {
  if (!isTouchDevice) return {};

  return {
    // Increase touch target size
    style: {
      minHeight: "44px",
      minWidth: "44px",
      touchAction: "manipulation", // Prevent double-tap zoom
    },
    // Add touch-specific event handlers
    onTouchStart: (e) => {
      // Add visual feedback for touch
      e.currentTarget.style.transform = "scale(0.98)";
      e.currentTarget.style.transition = "transform 0.1s ease";
    },
    onTouchEnd: (e) => {
      // Remove visual feedback
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.style.transform = "scale(1)";
        }
      }, 100);
    },
    onTouchCancel: (e) => {
      // Handle touch cancel
      if (e.currentTarget) {
        e.currentTarget.style.transform = "scale(1)";
      }
    },
  };
};

// Responsive grid utilities
export const getResponsiveGridClasses = (deviceType, options = {}) => {
  const { mobile = 1, tablet = 2, desktop = 3, gap = 4 } = options;

  const gridMap = {
    mobile: `grid-cols-${mobile}`,
    tablet: `sm:grid-cols-${tablet}`,
    desktop: `lg:grid-cols-${desktop}`,
  };

  return `grid gap-${gap} ${gridMap.mobile} ${gridMap.tablet} ${gridMap.desktop}`;
};

// Responsive text size utilities
export const getResponsiveTextClasses = (size = "base") => {
  const textSizeMap = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
    "4xl": "text-4xl sm:text-5xl",
  };

  return textSizeMap[size] || textSizeMap.base;
};

// Responsive spacing utilities
export const getResponsiveSpacing = (size = "md") => {
  const spacingMap = {
    xs: "p-2 sm:p-3",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
    xl: "p-8 sm:p-12",
  };

  return spacingMap[size] || spacingMap.md;
};

// Loading state utilities
export const createLoadingState = (
  isLoading,
  content,
  loadingComponent = null
) => {
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )
    );
  }
  return content;
};

// Performance optimization utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Viewport utilities
export const isInViewport = (element) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Safe area utilities for mobile devices
export const getSafeAreaClasses = () => {
  return "pb-safe-area-inset-bottom pt-safe-area-inset-top";
};

// Responsive container utilities
export const getResponsiveContainer = (size = "default") => {
  const containerMap = {
    sm: "max-w-sm mx-auto px-4 sm:px-6",
    md: "max-w-md mx-auto px-4 sm:px-6",
    lg: "max-w-lg mx-auto px-4 sm:px-6",
    xl: "max-w-xl mx-auto px-4 sm:px-6",
    "2xl": "max-w-2xl mx-auto px-4 sm:px-6",
    "4xl": "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
    "6xl": "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
    full: "w-full px-4 sm:px-6 lg:px-8",
    default: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  };

  return containerMap[size] || containerMap.default;
};

// Mobile-specific optimization utilities
export const getMobileOptimizedClasses = (isMobile, isTablet) => {
  return {
    text: {
      xs: isMobile ? "text-xs" : "text-sm",
      sm: isMobile ? "text-sm" : "text-base",
      base: isMobile ? "text-base" : "text-lg",
      lg: isMobile ? "text-lg" : "text-xl",
      xl: isMobile ? "text-xl" : "text-2xl",
      "2xl": isMobile ? "text-2xl" : "text-3xl",
    },
    spacing: {
      xs: isMobile ? "p-2" : "p-3",
      sm: isMobile ? "p-3" : "p-4",
      md: isMobile ? "p-4" : isTablet ? "p-5" : "p-6",
      lg: isMobile ? "p-5" : isTablet ? "p-6" : "p-8",
      xl: isMobile ? "p-6" : isTablet ? "p-8" : "p-12",
    },
    buttons: {
      sm: isMobile ? "px-3 py-2 text-sm" : "px-4 py-2 text-base",
      md: isMobile ? "px-4 py-3 text-base" : "px-6 py-3 text-lg",
      lg: isMobile ? "px-6 py-4 text-lg" : "px-8 py-4 text-xl",
    },
    icons: {
      sm: isMobile ? "w-4 h-4" : "w-5 h-5",
      md: isMobile ? "w-6 h-6" : "w-8 h-8",
      lg: isMobile ? "w-8 h-8" : "w-10 h-10",
      xl: isMobile ? "w-10 h-10" : "w-12 h-12",
    },
  };
};

// Performance optimization for mobile
export const optimizeForMobile = () => {
  // Reduce animations on low-end devices
  const isLowEndDevice =
    navigator.hardwareConcurrency <= 2 ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2);

  if (isLowEndDevice) {
    document.documentElement.style.setProperty("--animation-duration", "0.1s");
    document.documentElement.classList.add("low-end-device");
  }

  // Optimize scroll performance
  if ("scrollBehavior" in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  // Add passive event listeners for better scroll performance
  const addPassiveListener = (element, event, handler) => {
    element.addEventListener(event, handler, { passive: true });
  };

  // Optimize viewport for mobile browsers
  const optimizeViewport = () => {
    // Prevent zoom on input focus
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
      );
    }

    // Add iOS-specific optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.documentElement.classList.add("ios-device");
      // Prevent rubber band scrolling
      document.body.style.overscrollBehavior = "none";
    }

    // Add Android-specific optimizations
    if (/Android/.test(navigator.userAgent)) {
      document.documentElement.classList.add("android-device");
    }
  };

  optimizeViewport();

  return { addPassiveListener, isLowEndDevice, optimizeViewport };
};

// Loading state optimization
export const createOptimizedLoadingState = (
  isLoading,
  content,
  loadingComponent = null,
  skeleton = false
) => {
  if (isLoading) {
    if (skeleton) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      );
    }
    return (
      loadingComponent || (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )
    );
  }
  return content;
};

// Enhanced device detection
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);

  // Detect device capabilities
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const prefersReducedData = window.matchMedia(
    "(prefers-reduced-data: reduce)"
  ).matches;
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Performance indicators
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = navigator.deviceMemory || 2;
  const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 2;

  // Network information
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const connectionSpeed = connection ? connection.effectiveType : "unknown";
  const isSlowConnection =
    connectionSpeed === "slow-2g" || connectionSpeed === "2g";

  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    hasTouch,
    hasHover,
    prefersReducedMotion,
    prefersReducedData,
    isDarkMode,
    hardwareConcurrency,
    deviceMemory,
    isLowEndDevice,
    connectionSpeed,
    isSlowConnection,
  };
};

// Enhanced touch-friendly interactions
export const getEnhancedTouchProps = (isTouchDevice, options = {}) => {
  if (!isTouchDevice) return {};

  const {
    enableHaptics = true,
    enableVisualFeedback = true,
    touchDelay = 0,
    preventZoom = true,
  } = options;

  const props = {
    style: {
      minHeight: "44px",
      minWidth: "44px",
      touchAction: preventZoom ? "manipulation" : "auto",
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
      userSelect: "none",
      WebkitUserSelect: "none",
    },
  };

  if (enableVisualFeedback) {
    props.onTouchStart = (e) => {
      if (enableHaptics && navigator.vibrate) {
        navigator.vibrate(25);
      }

      if (touchDelay > 0) {
        setTimeout(() => {
          e.currentTarget.style.transform = "scale(0.95)";
          e.currentTarget.style.transition = "transform 0.1s ease";
        }, touchDelay);
      } else {
        e.currentTarget.style.transform = "scale(0.95)";
        e.currentTarget.style.transition = "transform 0.1s ease";
      }
    };

    props.onTouchEnd = (e) => {
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.style.transform = "scale(1)";
        }
      }, 100);
    };

    props.onTouchCancel = (e) => {
      if (e.currentTarget) {
        e.currentTarget.style.transform = "scale(1)";
      }
    };
  }

  return props;
};

// Responsive image utilities
export const getResponsiveImageProps = (src, alt, options = {}) => {
  const {
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    loading = "lazy",
    decoding = "async",
    fetchPriority = "auto",
  } = options;

  const deviceInfo = getDeviceInfo();

  return {
    src,
    alt,
    sizes,
    loading: deviceInfo.isSlowConnection ? "eager" : loading,
    decoding,
    fetchPriority: deviceInfo.isSlowConnection ? "high" : fetchPriority,
    style: {
      maxWidth: "100%",
      height: "auto",
    },
  };
};

// Responsive animation utilities
export const getResponsiveAnimationProps = (
  defaultDuration = 300,
  options = {}
) => {
  const deviceInfo = getDeviceInfo();
  const { respectReducedMotion = true, scaleDuration = true } = options;

  if (respectReducedMotion && deviceInfo.prefersReducedMotion) {
    return {
      duration: 0,
      easing: "linear",
      disabled: true,
    };
  }

  let duration = defaultDuration;

  if (scaleDuration) {
    if (deviceInfo.isLowEndDevice) {
      duration = Math.min(duration * 0.5, 150);
    } else if (deviceInfo.isSlowConnection) {
      duration = Math.min(duration * 0.7, 200);
    }
  }

  return {
    duration,
    easing: deviceInfo.isLowEndDevice ? "ease-out" : "ease-in-out",
    disabled: false,
  };
};
