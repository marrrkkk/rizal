import { useState, useEffect, useCallback } from "react";
import {
  useResponsive,
  getMobileOptimizedClasses,
} from "../utils/responsiveUtils.jsx";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";

const MobileOptimizedGame = ({
  children,
  title,
  onBack,
  loading = false,
  className = "",
  enableHaptics = true,
  optimizeAnimations = true,
}) => {
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const {
    isLowEndDevice,
    getOptimizedAnimationProps,
    getOptimizedTouchProps,
    debounce,
  } = usePerformanceOptimization();

  const [isVisible, setIsVisible] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);
  const touchProps = getOptimizedTouchProps();

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = debounce(() => {
      const newOrientation =
        window.innerHeight > window.innerWidth ? "portrait" : "landscape";
      setOrientation(newOrientation);

      // Trigger re-layout after orientation change
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }, 150);

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    // Initial check
    handleOrientationChange();

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [debounce]);

  // Fade in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Haptic feedback helper
  const triggerHaptic = useCallback(
    (pattern = 50) => {
      if (enableHaptics && navigator.vibrate && isTouchDevice) {
        navigator.vibrate(pattern);
      }
    },
    [enableHaptics, isTouchDevice]
  );

  // Optimized animation props
  const animationProps = optimizeAnimations ? getOptimizedAnimationProps() : {};

  // Handle back navigation with haptic feedback
  const handleBack = useCallback(() => {
    triggerHaptic(25);
    if (onBack) onBack();
  }, [onBack, triggerHaptic]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner
          size={isMobile ? "md" : "lg"}
          message="Loading game..."
          fullScreen
        />
      </div>
    );
  }

  return (
    <ErrorBoundary onGoBack={handleBack}>
      <div
        className={`min-h-screen w-full transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          } ${className}`}
        style={{
          ...touchProps.style,
          transitionDuration: `${animationProps.duration}ms`,
        }}
      >
        {/* Mobile-specific optimizations */}
        {isMobile && (
          <style jsx>{`
            /* Prevent zoom on double tap */
            * {
              touch-action: manipulation;
            }

            /* Optimize scrolling */
            body {
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: none;
            }

            /* Reduce animations on low-end devices */
            ${isLowEndDevice
              ? `
              * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
              }
            `
              : ""}
          `}</style>
        )}

        {/* Orientation warning for landscape-sensitive games */}
        {isMobile && orientation === "landscape" && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Better in Portrait Mode
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This game works best when you hold your device upright.
              </p>
              <button
                onClick={() => setOrientation("portrait")}
                className="bg-blue-500 text-black px-4 py-2 rounded-lg text-sm font-medium"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        )}

        {/* Game content */}
        <div className="relative">{children}</div>

        {/* Mobile-specific UI enhancements */}
        {isMobile && (
          <div className="fixed bottom-4 right-4 z-40">
            {/* Floating action button for quick actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                {...touchProps}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed top-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50">
            <div>
              Device: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
            </div>
            <div>Low-end: {isLowEndDevice ? "Yes" : "No"}</div>
            <div>Touch: {isTouchDevice ? "Yes" : "No"}</div>
            <div>Orientation: {orientation}</div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MobileOptimizedGame;
