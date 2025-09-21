import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LevelUnlockNotification = ({ chapter, level, onClose, onGoToLevel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show notification with animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  const chapterNames = {
    1: "Childhood in Calamba",
    2: "Education in Manila",
    3: "Studies Abroad",
    4: "Noli Me Tangere",
    5: "Return to the Philippines",
  };

  const chapterColors = {
    1: "from-blue-400 to-blue-600",
    2: "from-orange-400 to-amber-600",
    3: "from-green-400 to-emerald-600",
    4: "from-pink-400 to-rose-600",
    5: "from-purple-400 to-indigo-600",
  };

  const chapterEmojis = {
    1: "🏠",
    2: "📚",
    3: "✈️",
    4: "📖",
    5: "🇵🇭",
  };

  const handleGoToLevel = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onGoToLevel) {
        onGoToLevel(chapter, level);
      } else {
        // Default navigation logic
        navigate(`/chapter/${chapter}/level/${level}`);
      }
      onClose();
    }, 300);
  };

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-4 border-yellow-300 p-6 max-w-sm">
        <div className="text-center">
          {/* Unlock icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-2xl">🔓</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-gray-800 mb-2">
            New Level Unlocked!
          </h3>

          {/* Level info */}
          <div
            className={`bg-gradient-to-r ${chapterColors[chapter]} text-white rounded-xl p-4 mb-4`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">{chapterEmojis[chapter]}</span>
              <span className="font-bold">Chapter {chapter}</span>
            </div>
            <p className="text-sm opacity-90 mb-1">{chapterNames[chapter]}</p>
            <p className="font-bold">Level {level}</p>
          </div>

          {/* Encouragement */}
          <p className="text-gray-600 text-sm font-medium mb-4">
            Great job! Keep learning about Jose Rizal!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleGoToLevel}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🚀</span>
              <span>Go to Next Level</span>
            </button>

            <button
              onClick={handleContinue}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Continue Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUnlockNotification;
