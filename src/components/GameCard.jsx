import { filipinoTheme } from "../theme/theme";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";
import { getCardClasses, transitions, shadows } from "../utils/designSystem";
import { getInteractiveFeedback } from "../utils/interactiveFeedback";
import { getTouchTarget, getFocusRing } from "../utils/accessibility";

const GameCard = ({
  level,
  title,
  description,
  isUnlocked = true,
  isCompleted = false,
  onClick,
  theme = "blue",
  icon = null,
  estimatedTime = null,
  difficulty = null,
  score = null,
  maxScore = null,
  className = "",
  size = "md",
}) => {
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const touchProps = getTouchFriendlyProps(isTouchDevice);
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

  const getDifficultyColor = () => {
    const difficultyMap = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return difficultyMap[difficulty] || "bg-gray-100 text-gray-600";
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: isMobile ? "p-3" : "p-4",
      md: isMobile ? "p-4" : isTablet ? "p-5" : "p-6",
      lg: isMobile ? "p-5" : isTablet ? "p-6" : "p-8",
    };
    return sizeMap[size] || sizeMap.md;
  };

  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        badge: "Completed",
        badgeColor: "bg-green-100 text-green-800",
        icon: (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        iconBg: "bg-green-500",
      };
    } else if (isUnlocked) {
      return {
        badge: "Available",
        badgeColor: `bg-gradient-to-r ${getThemeColors()} text-white`,
        icon: (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        ),
        iconBg: `bg-gradient-to-br ${getThemeColors()}`,
      };
    } else {
      return {
        badge: "Locked",
        badgeColor: "bg-gray-100 text-gray-500",
        icon: (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ),
        iconBg: "bg-gray-400",
      };
    }
  };

  const statusInfo = getStatusInfo();

  const handleClick = () => {
    if (isUnlocked && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${shadows.lg} ${
        transitions.slow
      } transform cursor-pointer ${getTouchTarget("minimum")} ${
        isUnlocked
          ? `bg-white ${getInteractiveFeedback("card")} ${getFocusRing()} ${
              isTouchDevice
                ? "active:shadow-xl active:scale-95"
                : "hover:shadow-2xl hover:-translate-y-2"
            }`
          : "bg-gray-100 opacity-60 cursor-not-allowed"
      } ${isTouchDevice ? "min-h-[120px]" : ""} ${className}`}
      onClick={handleClick}
      {...(isUnlocked ? touchProps : {})}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
      aria-label={`${title}, ${
        isCompleted ? "completed" : isUnlocked ? "available" : "locked"
      }`}
      aria-disabled={!isUnlocked}
      onKeyDown={(e) => {
        if (isUnlocked && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Background Pattern */}
      {isUnlocked && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getThemeColors()} opacity-5 group-hover:opacity-10 ${
            filipinoTheme.transitions.normal
          }`}
        />
      )}

      {/* Status Icon */}
      <div
        className={`absolute ${
          isMobile ? "top-2 right-2" : "top-4 right-4"
        } z-10`}
      >
        <div
          className={`${isTouchDevice ? "w-10 h-10" : "w-8 h-8"} ${
            statusInfo.iconBg
          } rounded-full flex items-center justify-center shadow-md`}
        >
          {statusInfo.icon}
        </div>
      </div>

      {/* Level Number */}
      {level && (
        <div
          className={`absolute ${
            isMobile ? "top-2 left-2" : "top-4 left-4"
          } z-10`}
        >
          <div
            className={`${
              isTouchDevice ? "w-12 h-12" : "w-10 h-10"
            } rounded-full flex items-center justify-center shadow-md ${
              isUnlocked ? "bg-white/90" : "bg-gray-300/90"
            }`}
          >
            <span
              className={`${isTouchDevice ? "text-xl" : "text-lg"} font-bold ${
                isUnlocked
                  ? filipinoTheme.colors.text.primary
                  : filipinoTheme.colors.text.light
              }`}
            >
              {level}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`relative ${getSizeClasses()} ${
          level ? (isMobile ? "pt-12" : "pt-16") : isMobile ? "pt-4" : "pt-6"
        }`}
      >
        {/* Game Icon */}
        {icon && (
          <div className={`${isMobile ? "mb-3" : "mb-4"}`}>
            <div
              className={`${
                isTouchDevice ? "w-20 h-20" : "w-16 h-16"
              } rounded-2xl flex items-center justify-center shadow-lg ${
                isTouchDevice ? "active:scale-105" : "group-hover:scale-110"
              } ${filipinoTheme.transitions.normal} ${
                isUnlocked
                  ? `bg-gradient-to-br ${getThemeColors()}`
                  : "bg-gray-300"
              }`}
            >
              <span className={`${isTouchDevice ? "text-3xl" : "text-2xl"}`}>
                {icon}
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <h3
          className={`${isMobile ? "text-base" : "text-lg"} font-bold ${
            isMobile ? "mb-1" : "mb-2"
          } ${filipinoTheme.transitions.normal} ${
            isUnlocked
              ? `${filipinoTheme.colors.text.primary} ${
                  isTouchDevice
                    ? "active:text-gray-900"
                    : "group-hover:text-gray-900"
                }`
              : filipinoTheme.colors.text.muted
          } line-clamp-2`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`${isMobile ? "text-xs" : "text-sm"} leading-relaxed ${
            isMobile ? "mb-3" : "mb-4"
          } ${
            isUnlocked
              ? filipinoTheme.colors.text.secondary
              : filipinoTheme.colors.text.light
          } line-clamp-3`}
        >
          {description}
        </p>

        {/* Game Info */}
        <div
          className={`flex flex-wrap gap-1 sm:gap-2 ${
            isMobile ? "mb-3" : "mb-4"
          }`}
        >
          {/* Difficulty Badge */}
          {difficulty && (
            <span
              className={`inline-block px-2 py-1 rounded-full ${
                isMobile ? "text-xs" : "text-xs"
              } font-medium ${getDifficultyColor()}`}
            >
              {isMobile
                ? difficulty.charAt(0).toUpperCase()
                : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          )}

          {/* Estimated Time */}
          {estimatedTime && (
            <span
              className={`inline-block px-2 py-1 rounded-full ${
                isMobile ? "text-xs" : "text-xs"
              } font-medium bg-blue-100 text-blue-800`}
            >
              ⏱️ {estimatedTime}
              {isMobile ? "m" : " min"}
            </span>
          )}

          {/* Score Display */}
          {isCompleted && score !== null && (
            <span
              className={`inline-block px-2 py-1 rounded-full ${
                isMobile ? "text-xs" : "text-xs"
              } font-medium bg-yellow-100 text-yellow-800`}
            >
              ⭐ {score}
              {maxScore && `/${maxScore}`}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-block px-2 sm:px-3 py-1 rounded-full ${
              isMobile ? "text-xs" : "text-xs"
            } font-medium ${statusInfo.badgeColor}`}
          >
            {statusInfo.badge}
          </span>

          {/* Action Arrow */}
          {isUnlocked && (
            <div
              className={`${
                isTouchDevice ? "w-10 h-10" : "w-8 h-8"
              } bg-gradient-to-br ${getThemeColors()} rounded-full flex items-center justify-center shadow-md ${
                isTouchDevice ? "active:shadow-lg" : "group-hover:shadow-lg"
              } ${filipinoTheme.transitions.normal}`}
            >
              <svg
                className={`${
                  isTouchDevice ? "w-5 h-5" : "w-4 h-4"
                } text-white`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      {isUnlocked && (
        <div
          className={`absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-2xl ${filipinoTheme.transitions.normal}`}
        />
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <div className="absolute top-2 left-2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;
