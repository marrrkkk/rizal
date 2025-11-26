/**
 * Achievement Indicator Component
 * Compact display of achievement count and latest achievement
 * Requirements: 12.3
 */

import React from "react";
import { EPIC_ACHIEVEMENTS } from "../utils/achievementConfig";

const AchievementIndicator = ({
  achievementCount = 0,
  latestAchievementId = null,
  size = "md",
  showTooltip = true,
  onClick = null,
}) => {
  const latestAchievement = latestAchievementId
    ? EPIC_ACHIEVEMENTS[latestAchievementId]
    : null;

  const sizeClasses = {
    sm: {
      container: "w-8 h-8",
      icon: "text-lg",
      badge: "w-4 h-4 text-xs",
    },
    md: {
      container: "w-10 h-10",
      icon: "text-xl",
      badge: "w-5 h-5 text-xs",
    },
    lg: {
      container: "w-12 h-12",
      icon: "text-2xl",
      badge: "w-6 h-6 text-sm",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  if (achievementCount === 0) {
    return null;
  }

  return (
    <div
      className={`relative group ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* Achievement Icon */}
      <div
        className={`${classes.container} bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg`}
      >
        <span className={`${classes.icon} animate-pulse`}>
          {latestAchievement ? latestAchievement.icon : "🏆"}
        </span>
      </div>

      {/* Count Badge */}
      <div
        className={`absolute -top-1 -right-1 ${classes.badge} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white border-2 border-white shadow-lg`}
      >
        {achievementCount}
      </div>

      {/* Tooltip */}
      {showTooltip && latestAchievement && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div
            className={`bg-gradient-to-br ${latestAchievement.color} text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap`}
          >
            <div className="font-bold">{latestAchievement.name}</div>
            <div className="text-xs opacity-90">Latest Achievement</div>
          </div>
          <div className="w-2 h-2 bg-purple-600 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      )}

      {/* Glow Effect */}
      {latestAchievement && latestAchievement.rarity === "legendary" && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-50 blur-md animate-pulse"></div>
      )}
    </div>
  );
};

export default AchievementIndicator;
