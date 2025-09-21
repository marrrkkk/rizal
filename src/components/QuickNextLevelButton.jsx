import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuickNextLevelButton = ({ nextLevel, onClose, autoShow = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoShow && nextLevel) {
      // Show button with animation after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoShow, nextLevel]);

  const handleNextLevel = () => {
    if (!nextLevel || isNavigating) return;

    setIsNavigating(true);

    // Navigate to next level
    setTimeout(() => {
      navigate(`/chapter/${nextLevel.chapter}/level/${nextLevel.level}`);
      if (onClose) onClose();
    }, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!nextLevel) return null;

  const isNewChapter = nextLevel.chapter > 1; // Assuming we start from chapter 1

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-16 opacity-0 scale-95"
      }`}
    >
      <div className="relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>

        {/* Main button */}
        <button
          onClick={handleNextLevel}
          disabled={isNavigating}
          className={`relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-110 flex items-center space-x-3 ${
            isNavigating
              ? "opacity-75 cursor-not-allowed"
              : "hover:shadow-green-500/50"
          }`}
        >
          {isNavigating ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="text-2xl">{isNewChapter ? "🚀" : "➡️"}</span>
              <div className="hidden sm:block">
                <div className="text-sm font-bold">
                  {isNewChapter ? "New Chapter!" : "Next Level"}
                </div>
                <div className="text-xs opacity-90">
                  Chapter {nextLevel.chapter} - Level {nextLevel.level}
                </div>
              </div>
            </>
          )}
        </button>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-200"
        >
          ✕
        </button>

        {/* Tooltip for mobile */}
        <div className="sm:hidden absolute bottom-full right-0 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isNewChapter ? "Start New Chapter" : "Continue to Next Level"}
        </div>
      </div>
    </div>
  );
};

export default QuickNextLevelButton;
