/**
 * Level Card Component
 * Displays a level with unlock status, completion status, and score
 * Implements Requirement 9.4 - Visual indicators for locked, unlocked, and completed levels
 */

import { useState } from "react";
import { getCardClasses, transitions, shadows } from "../utils/designSystem";
import { getInteractiveFeedback } from "../utils/interactiveFeedback";
import { getTouchTarget, getFocusRing } from "../utils/accessibility";

const LevelCard = ({
  level,
  title,
  description,
  isUnlocked = false,
  isCompleted = false,
  score = 0,
  chapterId = 1,
  onClick,
  animationDelay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const chapterColors = {
    1: {
      gradient: "from-blue-400 to-blue-600",
      bg: "bg-blue-400",
      light: "bg-blue-50",
    },
    2: {
      gradient: "from-purple-400 to-purple-600",
      bg: "bg-purple-400",
      light: "bg-purple-50",
    },
    3: {
      gradient: "from-orange-400 to-orange-600",
      bg: "bg-orange-400",
      light: "bg-orange-50",
    },
    4: {
      gradient: "from-pink-400 to-pink-600",
      bg: "bg-pink-400",
      light: "bg-pink-50",
    },
    5: {
      gradient: "from-red-400 to-red-600",
      bg: "bg-red-400",
      light: "bg-red-50",
    },
    6: {
      gradient: "from-indigo-400 to-indigo-600",
      bg: "bg-indigo-400",
      light: "bg-indigo-50",
    },
  };

  const colors = chapterColors[chapterId] || chapterColors[1];

  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        badge: "Completed",
        badgeColor: "bg-green-500",
        icon: "✓",
        buttonText: "✓ Review",
        buttonColor: "from-green-500 to-green-600 border-green-700",
      };
    } else if (isUnlocked) {
      return {
        badge: "Ready",
        badgeColor: colors.bg,
        icon: "▶",
        buttonText: "▶ Start",
        buttonColor: `${colors.gradient} border-${colors.bg.split("-")[1]}-700`,
      };
    } else {
      return {
        badge: "Locked",
        badgeColor: "bg-gray-400",
        icon: "🔒",
        buttonText: "🔒 Locked",
        buttonColor: "bg-gray-300 border-gray-400",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`group relative bg-white rounded-3xl ${shadows.lg} ${
        transitions.slow
      } transform cursor-pointer border-4 border-white/50 overflow-hidden ${getTouchTarget(
        "minimum"
      )} ${
        isUnlocked
          ? `${getInteractiveFeedback("card")} ${getFocusRing()}`
          : "opacity-60 cursor-not-allowed"
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => isUnlocked && onClick && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
      aria-label={`Level ${level}: ${title}, ${
        isCompleted ? "completed" : isUnlocked ? "ready to start" : "locked"
      }`}
      aria-disabled={!isUnlocked}
      onKeyDown={(e) => {
        if (isUnlocked && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick && onClick();
        }
      }}
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${
            isCompleted
              ? "w-full bg-gradient-to-r from-green-400 to-green-500"
              : isUnlocked
              ? "w-1/2 bg-gradient-to-r " + colors.gradient
              : "w-0 bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Status indicator */}
      <div
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${statusInfo.badgeColor}`}
      >
        <span className="text-white text-sm font-bold">{statusInfo.icon}</span>
      </div>

      {/* NEW indicator for recently unlocked levels */}
      {isUnlocked && !isCompleted && level > 1 && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          NEW!
        </div>
      )}

      <div className="p-6">
        {/* Level icon */}
        <div className="relative mb-4">
          <div
            className={`w-20 h-20 bg-gradient-to-br ${
              colors.gradient
            } rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${
              isUnlocked && isHovered ? "scale-110" : ""
            } transition-transform duration-300`}
          >
            <span className="text-white font-black text-2xl">{level}</span>
          </div>
          {/* Completion stars */}
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
              <span className="text-xs">⭐</span>
            </div>
          )}
        </div>

        {/* Level info */}
        <div className="text-center">
          <h3
            className={`text-xl font-black mb-2 transition-colors ${
              isUnlocked
                ? "text-black group-hover:text-gray-900"
                : "text-gray-500"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mb-4 leading-relaxed ${
              isUnlocked ? "text-black" : "text-gray-400"
            }`}
          >
            {description}
          </p>

          {/* Score display for completed levels */}
          {isCompleted && score > 0 && (
            <div className="mb-4">
              <div className="inline-block bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-1">
                <span className="text-sm font-bold text-yellow-800">
                  Score: {score}
                </span>
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="mb-4">
            <span
              className={`text-xs font-bold uppercase tracking-wide ${
                isCompleted
                  ? "text-green-600"
                  : isUnlocked
                  ? `text-${colors.bg.split("-")[1]}-600`
                  : "text-gray-500"
              }`}
            >
              {statusInfo.badge}
            </span>
          </div>

          {/* Action button */}
          <button
            className={`w-full font-black py-3 px-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-2 uppercase tracking-wide text-sm ${
              isUnlocked
                ? `bg-gradient-to-r ${statusInfo.buttonColor} text-white hover:shadow-lg hover:scale-105`
                : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-60"
            }`}
            disabled={!isUnlocked}
          >
            {statusInfo.buttonText}
          </button>
        </div>
      </div>

      {/* Locked overlay with unlock requirements */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-3xl flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-sm font-bold mb-1">Locked</p>
            <p className="text-xs text-gray-300">
              {level === 1
                ? "Start here!"
                : `Complete Level ${level - 1} to unlock`}
            </p>
          </div>
        </div>
      )}

      {/* Completion celebration */}
      {isCompleted && (
        <div className="absolute top-2 left-2 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
      )}
    </div>
  );
};

export default LevelCard;
