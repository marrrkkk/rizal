/**
 * useResponsiveOptimization Hook
 * Comprehensive responsive design hook for React components
 * Implements Requirements 7.1, 7.2, 7.3
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAccurateViewport,
  getSafeAreaInsets,
  detectDevice,
  createBreakpointDetector,
  createTouchHandler,
  createOrientationHandler,
  createScrollHandler,
  createPerformanceMonitor,
  isElementInViewport,
} from "../utils/responsiveOptimizations";

/**
 * Main responsive optimization hook
 */
export const useResponsiveOptimization = (options = {}) => {
  const {
    enableOrientationTracking = true,
    enableScrollTracking = false,
    enablePerformanceMonitoring = true,
    customBreakpoints = {},
  } = options;

  // State
  const [viewport, setViewport] = useState(getAccurateViewport());
  const [device, setDevice] = useState(detectDevice());
  const [safeArea, setSafeArea] = useState(getSafeAreaInsets());
  const [orientation, setOrientation] = useState(
    typeof window !== "undefined" && window.innerHeight > window.innerWidth
      ? "portrait"
      : "landscape"
  );
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollX: 0,
    direction: "down",
  });
  const [performance, setPerformance] = useState(createPerformanceMonitor());

  // Refs
  const breakpointDetector = useRef(
    createBreakpointDetector(customBreakpoints)
  );

  // Update viewport and device info
  const updateViewportInfo = useCallback(() => {
    setViewport(getAccurateViewport());
    setDevice(detectDevice());
    setSafeArea(getSafeAreaInsets());
  }, []);

  // Handle resize with debouncing
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportInfo, 150);
    };

    window.addEventListener("resize", handleResize);

    // Initial update
    updateViewportInfo();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateViewportInfo]);

  // Handle orientation changes
  useEffect(() => {
    if (!enableOrientationTracking) return;

    const cleanup = createOrientationHandler((newOrientation, dimensions) => {
      setOrientation(newOrientation);
      setViewport(dimensions);
    });

    return cleanup;
  }, [enableOrientationTracking]);

  // Handle scroll tracking
  useEffect(() => {
    if (!enableScrollTracking) return;

    const cleanup = createScrollHandler((scrollData) => {
      setScrollPosition(scrollData);
    }, 100);

    return cleanup;
  }, [enableScrollTracking]);

  // Update performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;

    const updatePerformance = () => {
      setPerformance(createPerformanceMonitor());
    };

    // Update on network change
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      connection.addEventListener("change", updatePerformance);
      return () => connection.removeEventListener("change", updatePerformance);
    }
  }, [enablePerformanceMonitoring]);

  return {
    // Viewport info
    viewport,
    device,
    safeArea,
    orientation,
    scrollPosition,
    performance,

    // Device checks
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    isTouch: device.isTouch,
    isIOS: device.isIOS,
    isAndroid: device.isAndroid,

    // Breakpoint utilities
    breakpoint: breakpointDetector.current,

    // Performance flags
    shouldReduceAnimations: performance.shouldReduceAnimations,
    shouldReduceQuality: performance.shouldReduceQuality,
    isLowEndDevice: performance.isLowEnd,

    // Utility functions
    updateViewportInfo,
  };
};

/**
 * Hook for touch-optimized interactions
 */
export const useTouchOptimization = (options = {}) => {
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    enableHaptics = true,
    preventScroll = false,
    threshold = 10,
  } = options;

  const touchHandler = useRef(
    createTouchHandler({
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      enableHaptics,
      preventScroll,
      threshold,
    })
  );

  return {
    touchHandlers: {
      onTouchStart: touchHandler.current.handleTouchStart,
      onTouchMove: touchHandler.current.handleTouchMove,
      onTouchEnd: touchHandler.current.handleTouchEnd,
      onTouchCancel: touchHandler.current.handleTouchCancel,
    },
  };
};

/**
 * Hook for viewport visibility detection
 */
export const useInViewport = (ref, options = {}) => {
  const { threshold = 0, once = false } = options;
  const [isInViewport, setIsInViewport] = useState(false);
  const hasBeenInViewport = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    // Use Intersection Observer if available
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const inView = entry.isIntersecting;

          if (once && hasBeenInViewport.current) return;

          setIsInViewport(inView);

          if (inView) {
            hasBeenInViewport.current = true;
          }
        },
        { threshold: threshold / 100 }
      );

      observer.observe(ref.current);

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    } else {
      // Fallback to scroll event
      const checkVisibility = () => {
        if (!ref.current) return;

        if (once && hasBeenInViewport.current) return;

        const inView = isElementInViewport(ref.current, threshold);
        setIsInViewport(inView);

        if (inView) {
          hasBeenInViewport.current = true;
        }
      };

      window.addEventListener("scroll", checkVisibility, { passive: true });
      window.addEventListener("resize", checkVisibility, { passive: true });

      // Initial check
      checkVisibility();

      return () => {
        window.removeEventListener("scroll", checkVisibility);
        window.removeEventListener("resize", checkVisibility);
      };
    }
  }, [ref, threshold, once]);

  return isInViewport;
};

/**
 * Hook for responsive grid calculations
 */
export const useResponsiveGrid = (itemWidth, options = {}) => {
  const { gap = 16, minColumns = 1, maxColumns = 6 } = options;
  const { viewport } = useResponsiveOptimization();
  const [columns, setColumns] = useState(minColumns);

  useEffect(() => {
    const containerWidth = viewport.width;
    const availableWidth = containerWidth - gap * (maxColumns - 1);
    const possibleColumns = Math.floor(availableWidth / itemWidth);
    const optimalColumns = Math.max(
      minColumns,
      Math.min(maxColumns, possibleColumns)
    );

    setColumns(optimalColumns);
  }, [viewport.width, itemWidth, gap, minColumns, maxColumns]);

  return {
    columns,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };
};

/**
 * Hook for responsive font sizing
 */
export const useResponsiveFontSize = (baseSize) => {
  const { viewport } = useResponsiveOptimization();
  const [fontSize, setFontSize] = useState(baseSize);

  useEffect(() => {
    const { width } = viewport;

    // Fluid typography formula
    const minWidth = 320;
    const maxWidth = 1920;
    const minSize = baseSize * 0.875;
    const maxSize = baseSize * 1.125;

    if (width <= minWidth) {
      setFontSize(minSize);
    } else if (width >= maxWidth) {
      setFontSize(maxSize);
    } else {
      const ratio = (width - minWidth) / (maxWidth - minWidth);
      setFontSize(minSize + (maxSize - minSize) * ratio);
    }
  }, [viewport.width, baseSize]);

  return fontSize;
};

/**
 * Hook for media query matching
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Hook for orientation-specific behavior
 */
export const useOrientation = () => {
  const { orientation } = useResponsiveOptimization({
    enableOrientationTracking: true,
  });

  return {
    orientation,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
};

/**
 * Hook for safe area insets (iOS notch, etc.)
 */
export const useSafeArea = () => {
  const { safeArea } = useResponsiveOptimization();

  return {
    safeArea,
    hasSafeArea:
      safeArea.top > 0 ||
      safeArea.bottom > 0 ||
      safeArea.left > 0 ||
      safeArea.right > 0,
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
    paddingLeft: safeArea.left,
    paddingRight: safeArea.right,
  };
};

export default useResponsiveOptimization;
