/**
 * Enhanced Badge Notification System
 * Shows animated badge notifications when users complete levels or earn achievements
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Badge definitions with visual properties
const BADGE_DEFINITIONS = {
  // Level completion badges
  first_level_complete: {
    name: "First Steps",
    description: "Completed your first level!",
    icon: "🎯",
    color: "from-blue-400 to-blue-600",
    rarity: "common",
  },
  chapter_1_complete: {
    name: "Early Life Explorer",
    description: "Mastered José's childhood!",
    icon: "👶",
    color: "from-green-400 to-green-600",
    rarity: "uncommon",
  },
  chapter_2_complete: {
    name: "Student Scholar",
    description: "Learned about José's education!",
    icon: "📚",
    color: "from-purple-400 to-purple-600",
    rarity: "uncommon",
  },
  chapter_3_complete: {
    name: "Travel Companion",
    description: "Journeyed with José abroad!",
    icon: "✈️",
    color: "from-orange-400 to-orange-600",
    rarity: "uncommon",
  },
  chapter_4_complete: {
    name: "Literary Genius",
    description: "Discovered José's writings!",
    icon: "✍️",
    color: "from-pink-400 to-pink-600",
    rarity: "uncommon",
  },
  chapter_5_complete: {
    name: "Hero's Legacy",
    description: "Understood José's sacrifice!",
    icon: "🏛️",
    color: "from-red-400 to-red-600",
    rarity: "rare",
  },

  // Performance badges
  perfect_score: {
    name: "Perfect Performance",
    description: "Achieved a perfect score!",
    icon: "⭐",
    color: "from-yellow-400 to-yellow-600",
    rarity: "rare",
  },
  knowledge_seeker: {
    name: "Knowledge Seeker",
    description: "Completed 10 levels!",
    icon: "🔍",
    color: "from-indigo-400 to-indigo-600",
    rarity: "uncommon",
  },
  speed_runner: {
    name: "Speed Runner",
    description: "Completed 5 levels in one session!",
    icon: "⚡",
    color: "from-cyan-400 to-cyan-600",
    rarity: "rare",
  },
  efficiency_master: {
    name: "Efficiency Master",
    description: "Lightning-fast learning!",
    icon: "🚀",
    color: "from-emerald-400 to-emerald-600",
    rarity: "rare",
  },
  persistent_learner: {
    name: "Persistent Learner",
    description: "Never gave up!",
    icon: "💪",
    color: "from-orange-400 to-orange-600",
    rarity: "uncommon",
  },

  // Dedication badges
  dedication: {
    name: "Dedicated Student",
    description: "7 consecutive days of learning!",
    icon: "🔥",
    color: "from-red-400 to-red-600",
    rarity: "rare",
  },
  marathon_learner: {
    name: "Marathon Learner",
    description: "30 consecutive days!",
    icon: "🏃‍♂️",
    color: "from-purple-400 to-purple-600",
    rarity: "legendary",
  },

  // Ultimate badge
  rizal_expert: {
    name: "Rizal Expert",
    description: "Mastered all chapters!",
    icon: "👑",
    color: "from-yellow-400 via-orange-500 to-red-600",
    rarity: "legendary",
  },
};

// Rarity styles
const RARITY_STYLES = {
  common: {
    border: "border-gray-300",
    glow: "shadow-lg",
    animation: "animate-bounce",
  },
  uncommon: {
    border: "border-green-400",
    glow: "shadow-green-400/50 shadow-xl",
    animation: "animate-pulse",
  },
  rare: {
    border: "border-blue-400",
    glow: "shadow-blue-400/50 shadow-2xl",
    animation: "animate-bounce",
  },
  legendary: {
    border: "border-yellow-400",
    glow: "shadow-yellow-400/50 shadow-2xl",
    animation: "animate-pulse",
  },
};

// Individual Badge Notification Component
const BadgeNotification = ({ badge, onClose, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const badgeInfo = BADGE_DEFINITIONS[badge] || {
    name: badge.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Achievement unlocked!",
    icon: "🏆",
    color: "from-blue-400 to-blue-600",
    rarity: "common",
  };

  const rarityStyle = RARITY_STYLES[badgeInfo.rarity];

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 500);
    }, 4000 + delay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : isExiting
          ? "translate-x-full opacity-0 scale-95"
          : "translate-x-full opacity-0 scale-95"
      }`}
      style={{ marginTop: `${delay * 0.1}rem` }}
    >
      <div
        className={`bg-white rounded-2xl p-4 ${rarityStyle.border} border-2 ${rarityStyle.glow} ${rarityStyle.animation} max-w-sm`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center text-2xl ${rarityStyle.animation}`}
            >
              {badgeInfo.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">
                {badgeInfo.name}
              </h3>
              <p className="text-xs text-gray-600 capitalize">
                {badgeInfo.rarity} Badge
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3">{badgeInfo.description}</p>

        {/* Badge Earned Label */}
        <div className="flex items-center justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badgeInfo.color}`}
          >
            🎉 Badge Earned!
          </span>
        </div>
      </div>
    </div>
  );
};

// Level Completion Notification
const LevelCompletionNotification = ({ chapter, level, score, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getScoreColor = (score) => {
    if (score >= 90) return "from-green-400 to-green-600";
    if (score >= 80) return "from-blue-400 to-blue-600";
    if (score >= 70) return "from-yellow-400 to-yellow-600";
    return "from-orange-400 to-orange-600";
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return "🌟";
    if (score >= 80) return "⭐";
    if (score >= 70) return "👍";
    return "💪";
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible && !isExiting ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 max-w-md text-center animate-bounce">
        {/* Celebration Icon */}
        <div className="text-6xl mb-4 animate-pulse">
          {getScoreEmoji(score)}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Level Complete!
        </h2>

        {/* Level Info */}
        <p className="text-lg text-gray-600 mb-4">
          Chapter {chapter}, Level {level}
        </p>

        {/* Score */}
        <div
          className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getScoreColor(
            score
          )} text-white font-bold text-xl mb-4`}
        >
          {score}% Score!
        </div>

        {/* Encouragement */}
        <p className="text-sm text-gray-600">
          {score >= 90
            ? "Outstanding work! 🎉"
            : score >= 80
            ? "Great job! Keep it up! 👏"
            : score >= 70
            ? "Good effort! You're learning! 📚"
            : "Keep practicing! You've got this! 💪"}
        </p>
      </div>
    </div>
  );
};

// Main Badge Notification System
const BadgeNotificationSystem = ({ notifications, onClearNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-40">
      {notifications.map((notification, index) => {
        if (notification.type === "badge") {
          return (
            <BadgeNotification
              key={`${notification.badge}-${notification.timestamp}`}
              badge={notification.badge}
              delay={index * 500}
              onClose={() => onClearNotification(notification.id)}
            />
          );
        } else if (notification.type === "levelComplete") {
          return (
            <LevelCompletionNotification
              key={`level-${notification.chapter}-${notification.level}-${notification.timestamp}`}
              chapter={notification.chapter}
              level={notification.level}
              score={notification.score}
              onClose={() => onClearNotification(notification.id)}
            />
          );
        }
        return null;
      })}
    </div>,
    document.body
  );
};

// Hook for managing badge notifications
export const useBadgeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showBadgeNotification = (badge) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: "badge",
      badge,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const showLevelCompleteNotification = (chapter, level, score) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: "levelComplete",
      chapter,
      level,
      score,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    showBadgeNotification,
    showLevelCompleteNotification,
    clearNotification,
    clearAllNotifications,
  };
};

export default BadgeNotificationSystem;
export { BADGE_DEFINITIONS, BadgeNotification, LevelCompletionNotification };
