import { useNavigate } from "react-router-dom";
import { filipinoTheme } from "../theme/theme";
import {
  useResponsive,
  getTouchFriendlyProps,
  getMobileOptimizedClasses,
} from "../utils/responsiveUtils.jsx";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";

const GameHeader = ({
  title,
  level,
  chapter,
  score = null,
  onBack,
  onLogout,
  username,
  theme = "blue",
  showScore = false,
  maxScore = null,
}) => {
  const navigate = useNavigate();
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { getOptimizedTouchProps } = usePerformanceOptimization();
  const touchProps = getOptimizedTouchProps();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default back navigation to chapter page
      navigate(`/chapter/${chapter}`);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const getThemeColors = () => {
    const themeMap = {
      blue: filipinoTheme.colors.primary.blue,
      red: filipinoTheme.colors.primary.red,
      yellow: filipinoTheme.colors.primary.yellow,
      green: "from-emerald-400 to-green-600",
      purple: "from-purple-400 to-indigo-500",
      pink: "from-pink-400 to-rose-500",
    };
    return themeMap[theme] || themeMap.blue;
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 will-change-transform">
      <div
        className={`w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center ${
          isMobile ? "min-h-[60px]" : ""
        }`}
        style={touchProps.style}
      >
        {/* Left Section - Navigation and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`${
              isTouchDevice ? "w-12 h-12" : "w-10 h-10"
            } bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 ${
              filipinoTheme.transitions.normal
            } ${filipinoTheme.shadows.md} flex-shrink-0`}
            title="Go back"
            {...touchProps}
          >
            <svg
              className={`${isTouchDevice ? "w-6 h-6" : "w-5 h-5"} text-white`}
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

          {/* Home Button */}
          <button
            onClick={handleHome}
            className={`${
              isTouchDevice ? "w-12 h-12" : "w-10 h-10"
            } bg-gradient-to-br ${getThemeColors()} rounded-full flex items-center justify-center hover:scale-110 ${
              filipinoTheme.transitions.normal
            } ${filipinoTheme.shadows.md} flex-shrink-0`}
            title="Go to home"
            {...touchProps}
          >
            <svg
              className={`${isTouchDevice ? "w-6 h-6" : "w-5 h-5"} text-white`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>

          {/* Chapter and Level Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {chapter && (
              <div
                className={`${
                  isTouchDevice ? "w-12 h-12" : "w-10 h-10"
                } bg-gradient-to-br ${getThemeColors()} rounded-full flex items-center justify-center ${
                  filipinoTheme.shadows.md
                } flex-shrink-0`}
              >
                <span
                  className={`text-white font-bold ${
                    isTouchDevice ? "text-xl" : "text-lg"
                  }`}
                >
                  {chapter}
                </span>
              </div>
            )}
            <div className="hidden sm:block min-w-0 flex-1">
              <h1
                className={`${
                  isMobile ? "text-lg" : "text-xl sm:text-2xl"
                } font-bold ${filipinoTheme.colors.text.primary} truncate`}
              >
                {title}
              </h1>
              {level && (
                <p
                  className={`text-xs sm:text-sm ${filipinoTheme.colors.text.secondary} truncate`}
                >
                  Level {level} {chapter && `• Chapter ${chapter}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Score (if enabled) */}
        {showScore && !isMobile && (
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">⭐</span>
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${filipinoTheme.colors.text.secondary}`}
                  >
                    Score
                  </p>
                  <p
                    className={`text-sm sm:text-lg font-bold ${filipinoTheme.colors.text.primary}`}
                  >
                    {score !== null ? score : 0}
                    {maxScore && (
                      <span
                        className={`text-xs sm:text-sm ${filipinoTheme.colors.text.muted}`}
                      >
                        /{maxScore}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Section - User Info and Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* User Info */}
          {username && !isMobile && (
            <div className="hidden md:flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-md">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${getThemeColors()} rounded-full flex items-center justify-center`}
              >
                <span className="text-white font-bold text-xs sm:text-sm">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${filipinoTheme.colors.text.primary} max-w-[80px] truncate`}
              >
                {username}
              </span>
            </div>
          )}

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`bg-gradient-to-r ${
                filipinoTheme.colors.primary.red
              } text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 ${
                filipinoTheme.transitions.normal
              } ${
                filipinoTheme.shadows.lg
              } hover:shadow-xl transform hover:-translate-y-0.5 ${
                isTouchDevice ? "min-w-[44px] min-h-[44px]" : ""
              }`}
              {...touchProps}
            >
              <span className="hidden md:inline text-sm">Logout</span>
              <svg
                className={`${
                  isTouchDevice ? "w-6 h-6" : "w-4 h-4 sm:w-5 sm:h-5"
                } md:hidden`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Title and Info (shown on small screens) */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1
              className={`text-base sm:text-lg font-bold ${filipinoTheme.colors.text.primary} truncate`}
            >
              {title}
            </h1>
            {level && (
              <p
                className={`text-xs sm:text-sm ${filipinoTheme.colors.text.secondary} truncate`}
              >
                Level {level} {chapter && `• Chapter ${chapter}`}
              </p>
            )}
          </div>

          {/* Mobile Score and User Info */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {showScore && (
              <div className="inline-flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                <span className="text-sm">⭐</span>
                <span
                  className={`text-xs font-bold ${filipinoTheme.colors.text.primary}`}
                >
                  {score !== null ? score : 0}
                  {maxScore && (
                    <span
                      className={`text-xs ${filipinoTheme.colors.text.muted}`}
                    >
                      /{maxScore}
                    </span>
                  )}
                </span>
              </div>
            )}

            {username && (
              <div className="inline-flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                <div
                  className={`w-5 h-5 bg-gradient-to-br ${getThemeColors()} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-xs">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium ${filipinoTheme.colors.text.primary} max-w-[60px] truncate`}
                >
                  {username}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
