/**
 * Achievement Notification Component
 * Displays dramatic anime-style notifications when achievements are earned
 * Requirements: 12.3
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  EPIC_ACHIEVEMENTS,
  RARITY_CONFIG,
  ANIMATION_STYLES,
} from "../utils/achievementConfig";

const AchievementNotification = ({ achievementId, onClose, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const achievement = EPIC_ACHIEVEMENTS[achievementId];

  useEffect(() => {
    if (!achievement) {
      onClose();
      return;
    }

    // Show notification after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      // Show details after initial entrance
      setTimeout(() => setShowDetails(true), 500);
    }, delay);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 800);
    }, 5000 + delay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [achievement, delay, onClose]);

  if (!achievement) return null;

  const rarityConfig = RARITY_CONFIG[achievement.rarity];
  const animationClass = ANIMATION_STYLES[achievement.animationStyle];

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-800 ${
        isVisible && !isExiting ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop with dramatic effect */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-800 ${
          isVisible && !isExiting ? "opacity-60" : "opacity-0"
        }`}
      />

      {/* Achievement Card */}
      <div
        className={`relative pointer-events-auto transform transition-all duration-800 ${
          isVisible && !isExiting
            ? "scale-100 translate-y-0"
            : isExiting
            ? "scale-95 translate-y-10"
            : "scale-95 -translate-y-10"
        }`}
      >
        <div
          className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 max-w-md shadow-2xl border-4 ${rarityConfig.borderColor} ${rarityConfig.glowColor} shadow-2xl`}
        >
          {/* Epic Title Banner */}
          <div className="text-center mb-6">
            <div
              className={`inline-block px-4 py-1 rounded-full ${rarityConfig.bgColor} ${rarityConfig.borderColor} border-2 mb-3`}
            >
              <span
                className={`text-xs font-bold ${rarityConfig.color} uppercase tracking-wider`}
              >
                {rarityConfig.label} Achievement
              </span>
            </div>
            <h3 className="text-sm text-gray-400 font-medium mb-1">
              {achievement.epicTitle}
            </h3>
          </div>

          {/* Achievement Icon with Dramatic Animation */}
          <div className="flex justify-center mb-6">
            <div
              className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center ${animationClass} shadow-2xl ${rarityConfig.glowColor}`}
            >
              <span className="text-6xl drop-shadow-2xl">
                {achievement.icon}
              </span>

              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${achievement.color} opacity-50 blur-xl ${animationClass}`}
              />

              {/* Sparkle effects for legendary */}
              {achievement.rarity === "legendary" && (
                <>
                  <div className="absolute -top-2 -right-2 text-2xl animate-ping">
                    ✨
                  </div>
                  <div className="absolute -bottom-2 -left-2 text-2xl animate-ping delay-100">
                    ✨
                  </div>
                  <div className="absolute -top-2 -left-2 text-2xl animate-ping delay-200">
                    ⭐
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-2xl animate-ping delay-300">
                    ⭐
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Achievement Name */}
          <h2
            className={`text-3xl font-bold text-center mb-3 bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}
          >
            {achievement.name}
          </h2>

          {/* Achievement Description with Fade-in */}
          <div
            className={`text-center transition-all duration-500 ${
              showDetails
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {achievement.description}
            </p>

            {/* Achievement Unlocked Badge */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl animate-bounce">🎉</span>
              <span className="text-white font-bold text-lg">
                Achievement Unlocked!
              </span>
              <span className="text-2xl animate-bounce delay-100">🎉</span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsExiting(true);
                setTimeout(onClose, 500);
              }}
              className={`px-6 py-3 rounded-full bg-gradient-to-r ${achievement.color} text-white font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              Awesome!
            </button>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 text-yellow-400 opacity-50">
            ⚡
          </div>
          <div className="absolute top-4 right-4 text-yellow-400 opacity-50">
            ⚡
          </div>
          <div className="absolute bottom-4 left-4 text-yellow-400 opacity-50">
            ⭐
          </div>
          <div className="absolute bottom-4 right-4 text-yellow-400 opacity-50">
            ⭐
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AchievementNotification;
