import { filipinoTheme } from "../theme/theme";
import {
  useResponsive,
  getMobileOptimizedClasses,
} from "../utils/responsiveUtils.jsx";

const LoadingSpinner = ({
  size = "md",
  theme = "blue",
  message = "Loading...",
  showMessage = true,
  className = "",
  skeleton = false,
  fullScreen = false,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  const sizeClasses = {
    sm: isMobile ? "w-4 h-4" : "w-5 h-5",
    md: isMobile ? "w-6 h-6" : "w-8 h-8",
    lg: isMobile ? "w-8 h-8" : "w-12 h-12",
    xl: isMobile ? "w-12 h-12" : "w-16 h-16",
  };

  const getThemeColors = () => {
    const themeMap = {
      blue: "border-blue-500",
      red: "border-red-500",
      green: "border-green-500",
      yellow: "border-yellow-500",
      purple: "border-purple-500",
      pink: "border-pink-500",
    };
    return themeMap[theme] || themeMap.blue;
  };

  // Skeleton loading for better perceived performance
  if (skeleton) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="skeleton h-4 rounded w-3/4"></div>
        <div className="skeleton h-4 rounded w-1/2"></div>
        <div className="skeleton h-4 rounded w-5/6"></div>
      </div>
    );
  }

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    : `flex flex-col items-center justify-center ${isMobile ? "p-3" : "p-4"}`;

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Enhanced spinner with better mobile performance */}
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-2 border-gray-200 ${getThemeColors()} border-t-transparent ${
            sizeClasses[size]
          } will-change-transform`}
          style={{
            animationDuration: isMobile ? "0.8s" : "1s", // Faster on mobile for better perceived performance
          }}
        />
        {/* Inner dot for better visual feedback */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${
            theme === "blue"
              ? "from-blue-400 to-blue-600"
              : `from-${theme}-400 to-${theme}-600`
          } opacity-20 animate-pulse`}
        />
      </div>

      {showMessage && (
        <div className={`${isMobile ? "mt-2" : "mt-3"} text-center max-w-xs`}>
          <p
            className={`${mobileClasses.text.sm} ${filipinoTheme.colors.text.secondary} font-medium`}
          >
            {message}
          </p>
          {/* Progress dots for better mobile UX */}
          <div className="flex justify-center space-x-1 mt-2">
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}

      {fullScreen && (
        <div className={`${isMobile ? "mt-4" : "mt-6"} text-center`}>
          <div
            className={`inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg`}
          >
            <span className={`${isMobile ? "text-lg" : "text-xl"}`}>🎓</span>
            <span
              className={`${mobileClasses.text.sm} font-medium text-gray-700`}
            >
              Jose Rizal Learning
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
