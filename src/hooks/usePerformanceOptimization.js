import { useEffect, useState, useCallback } from "react";
import { useResponsive } from "../utils/responsiveUtils.jsx";

export const usePerformanceOptimization = () => {
  const { isMobile, isTouchDevice } = useResponsive();
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState("fast");

  useEffect(() => {
    // Detect low-end devices
    const detectLowEndDevice = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const deviceMemory = navigator.deviceMemory || 2;
      const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;
      setIsLowEndDevice(isLowEnd);

      if (isLowEnd) {
        document.documentElement.classList.add("low-end-device");
      }
    };

    // Detect connection speed
    const detectConnectionSpeed = () => {
      if ("connection" in navigator) {
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;

        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setConnectionSpeed("slow");
        } else if (effectiveType === "3g") {
          setConnectionSpeed("medium");
        } else {
          setConnectionSpeed("fast");
        }
      }
    };

    detectLowEndDevice();
    detectConnectionSpeed();

    // Listen for connection changes
    if ("connection" in navigator) {
      navigator.connection.addEventListener("change", detectConnectionSpeed);
      return () => {
        navigator.connection.removeEventListener(
          "change",
          detectConnectionSpeed
        );
      };
    }
  }, []);

  // Optimize animations based on device capabilities
  const getOptimizedAnimationProps = useCallback(
    (defaultDuration = 300) => {
      if (isLowEndDevice) {
        return {
          duration: Math.min(defaultDuration * 0.5, 150),
          easing: "ease-out",
        };
      }

      if (isMobile) {
        return {
          duration: defaultDuration * 0.8,
          easing: "ease-out",
        };
      }

      return {
        duration: defaultDuration,
        easing: "ease-in-out",
      };
    },
    [isLowEndDevice, isMobile]
  );

  // Optimize image loading
  const getOptimizedImageProps = useCallback(
    (src, alt) => {
      const props = {
        src,
        alt,
        loading: "lazy",
        decoding: "async",
      };

      if (connectionSpeed === "slow") {
        props.loading = "eager"; // Load immediately on slow connections to avoid layout shift
      }

      return props;
    },
    [connectionSpeed]
  );

  // Debounce function for performance
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttle function for scroll events
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Optimize touch events
  const getOptimizedTouchProps = useCallback(() => {
    if (!isTouchDevice) return {};

    return {
      style: {
        touchAction: "manipulation",
        WebkitTapHighlightColor: "rgba(0,0,0,0)",
      },
    };
  }, [isTouchDevice]);

  // Preload critical resources
  const preloadResource = useCallback(
    (href, as = "fetch", crossorigin = "anonymous") => {
      if (connectionSpeed === "slow") return; // Skip preloading on slow connections

      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      if (crossorigin) link.crossOrigin = crossorigin;
      document.head.appendChild(link);
    },
    [connectionSpeed]
  );

  // Lazy load components
  const shouldLazyLoad = useCallback(
    (threshold = 0.1) => {
      return connectionSpeed === "slow" || isLowEndDevice;
    },
    [connectionSpeed, isLowEndDevice]
  );

  return {
    isLowEndDevice,
    connectionSpeed,
    isMobile,
    isTouchDevice,
    getOptimizedAnimationProps,
    getOptimizedImageProps,
    getOptimizedTouchProps,
    debounce,
    throttle,
    preloadResource,
    shouldLazyLoad,
  };
};

export default usePerformanceOptimization;
