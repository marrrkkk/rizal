import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NextLevelButton = ({
  currentChapter,
  currentLevel,
  nextLevelUnlocked,
  nextChapterUnlocked,
  onClose,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const getNextLevel = () => {
    if (nextLevelUnlocked) {
      return nextLevelUnlocked;
    }
    if (nextChapterUnlocked) {
      return nextChapterUnlocked;
    }
    return null;
  };

  const handleNextLevel = async () => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return;

    setIsNavigating(true);

    // Add a small delay for better UX
    setTimeout(() => {
      navigate(`/chapter/${nextLevel.chapter}/level/${nextLevel.level}`);
      if (onClose) onClose();
    }, 500);
  };

  const handleBackToChapter = () => {
    navigate(`/chapter/${currentChapter}`);
    if (onClose) onClose();
  };

  const nextLevel = getNextLevel();

  if (!nextLevel) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-green-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-white">🎉</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Chapter Complete!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Great job completing Chapter {currentChapter}!
            </p>
            <button
              onClick={handleBackToChapter}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Back to Chapter {currentChapter}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isNewChapter = nextLevel.chapter !== currentChapter;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-blue-300 max-w-sm">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl text-white">
              {isNewChapter ? "🚀" : "➡️"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {isNewChapter ? "New Chapter Unlocked!" : "Next Level Ready!"}
          </h3>

          {/* Level Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-4">
            <p className="text-sm font-medium text-gray-700">
              {isNewChapter ? "🎯 " : "📚 "}
              Chapter {nextLevel.chapter} - Level {nextLevel.level}
            </p>
            {isNewChapter && (
              <p className="text-xs text-gray-600 mt-1">
                Starting a new chapter!
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleNextLevel}
              disabled={isNavigating}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                isNavigating ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isNavigating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>🎮</span>
                  <span>
                    {isNewChapter
                      ? "Start New Chapter"
                      : "Continue to Next Level"}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleBackToChapter}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-medium transition-colors duration-200"
            >
              Back to Chapter {currentChapter}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextLevelButton;
