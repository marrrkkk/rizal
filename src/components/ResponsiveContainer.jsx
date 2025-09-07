import {
  useResponsive,
  getResponsiveContainer,
  getMobileOptimizedClasses,
  optimizeForMobile,
} from "../utils/responsiveUtils.jsx";
import { useEffect } from "react";

const ResponsiveContainer = ({
  children,
  size = "default",
  className = "",
  enableSafeArea = false,
  optimizePerformance = true,
  ...props
}) => {
  const { isMobile, isTablet, isTouchDevice } = useResponsive();

  useEffect(() => {
    if (optimizePerformance && isMobile) {
      const { isLowEndDevice } = optimizeForMobile();

      // Add performance hints for low-end devices
      if (isLowEndDevice) {
        document.documentElement.classList.add("low-end-device");
      }
    }
  }, [optimizePerformance, isMobile]);

  const containerClasses = getResponsiveContainer(size);
  const safeAreaClasses = enableSafeArea
    ? "pb-safe-area-inset-bottom pt-safe-area-inset-top"
    : "";

  // Enhanced mobile padding with better touch targets
  const mobilePadding = isMobile ? "px-4" : isTablet ? "px-6" : "px-8";

  // Add touch-friendly classes for mobile
  const touchClasses = isTouchDevice ? "touch-manipulation" : "";

  // Performance optimization classes
  const performanceClasses =
    isMobile && optimizePerformance ? "will-change-transform" : "";

  return (
    <div
      className={`${containerClasses} ${safeAreaClasses} ${mobilePadding} ${touchClasses} ${performanceClasses} ${className}`}
      style={{
        // Optimize for mobile performance
        ...(isMobile && {
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "none",
        }),
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
