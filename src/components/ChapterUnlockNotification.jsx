/**
 * Chapter Unlock Notification Component
 * Shows animated celebration when a new chapter is unlocked
 * Implements Requirement 9.5
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const ChapterUnlockNotification = ({
  chapter,
  chapterName,
  onClose,
  autoClose = true,
  duration = 5000,
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
    1: "from-blue-400 via-blue-500 to-blue-600",
    2: "from-purple-400 via-purple-500 to-purple-600",
    3: "from-orange-400 via-orange-500 to-orange-600",
    4: "from-pink-400 via-pink-500 to-pink-600",
    5: "from-red-400 via-red-500 to-red-600",
    6: "from-indigo-400 via-indigo-500 to-indigo-600",
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-500 ${
        isVisible && !isExiting ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`transform transition-all duration-500 ${
          isVisible && !isExiting
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Celebration Header */}
          <div
            className={`bg-gradient-to-r ${
              chapterColors[chapter] || chapterColors[1]
            } p-8 text-center relative overflow-hidden`}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-10 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            {/* Main icon */}
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <span className="text-6xl">
                  {chapterEmojis[chapter] || "🎉"}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                New Chapter Unlocked!
              </h2>
              <p className="text-white/90 text-lg">
                Chapter {chapter} is now available!
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Chapter info */}
            <div className="text-center mb-6">
              <div
                className={`inline-block px-6 py-3 bg-gradient-to-r ${
                  chapterColors[chapter] || chapterColors[1]
                } rounded-full mb-4`}
              >
                <span className="text-white font-bold text-xl">
                  Chapter {chapter}
                </span>
              </div>
              {chapterName && (
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {chapterName}
                </h3>
              )}
              <p className="text-gray-600">
                Continue your journey learning about José Rizal!
              </p>
            </div>

            {/* Celebration elements */}
            <div className="flex justify-center space-x-2 mb-6">
              <span
                className="text-4xl animate-bounce"
                style={{ animationDelay: "0s" }}
              >
                🎉
              </span>
              <span
                className="text-4xl animate-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                🌟
              </span>
              <span
                className="text-4xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                🎊
              </span>
            </div>

            {/* Achievement message */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Great Progress!</p>
                  <p className="text-sm text-gray-600">
                    You completed the previous chapter
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleClose}
              className={`w-full bg-gradient-to-r ${
                chapterColors[chapter] || chapterColors[1]
              } hover:shadow-xl text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105`}
            >
              Continue Learning! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChapterUnlockNotification;
