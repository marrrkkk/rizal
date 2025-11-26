/**
 * Level Unlock Notification Component
 * Shows animated notification when a new level is unlocked
 * Implements Requirement 9.5
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LevelUnlockNotification = ({
  chapter,
  level,
  chapterName,
  onClose,
  autoClose = true,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close if enabled
    let hideTimer;
    if (autoClose) {
      hideTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const chapterEmojis = {
    1: "🏠",
    2: "📚",
    3: "✈️",
    4: "📖",
    5: "🇵🇭",
    6: "🏛️",
  };

  const chapterColors = {
    1: "from-blue-400 to-blue-600",
    2: "from-purple-400 to-purple-600",
    3: "from-orange-400 to-orange-600",
    4: "from-pink-400 to-pink-600",
    5: "from-red-400 to-red-600",
    6: "from-indigo-400 to-indigo-600",
  };

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-3 border-blue-300 overflow-hidden max-w-sm hover:shadow-3xl transition-shadow duration-300">
        {/* Header with gradient */}
        <div
          className={`bg-gradient-to-r ${
            chapterColors[chapter] || chapterColors[1]
          } p-5 relative overflow-hidden`}
        >
          {/* Animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-2 left-1/4 w-8 h-8 bg-white rounded-full animate-ping"></div>
            <div
              className="absolute top-4 right-1/4 w-6 h-6 bg-white rounded-full animate-ping"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white/50">
                <span className="text-3xl">
                  {chapterEmojis[chapter] || "🔓"}
                </span>
              </div>
              <div>
                <h3 className="text-white font-black text-lg drop-shadow-md">
                  New Level Unlocked!
                </h3>
                <p className="text-white/95 text-sm font-semibold">
                  Keep up the great work!
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200 transform hover:scale-110"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-18 h-18 bg-gradient-to-br ${
                chapterColors[chapter] || chapterColors[1]
              } rounded-full flex items-center justify-center shadow-xl border-3 border-white animate-pulse`}
            >
              <span className="text-white font-black text-2xl">{level}</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-base">
                Chapter {chapter}, Level {level}
              </p>
              {chapterName && (
                <p className="text-gray-600 text-sm font-medium">
                  {chapterName}
                </p>
              )}
            </div>
          </div>

          {/* Unlock icon */}
          <div className="flex items-center justify-center space-x-2 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200 shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-bold">Ready to play!</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LevelUnlockNotification;
