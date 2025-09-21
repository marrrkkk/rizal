import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LevelCompletionModal = ({
  isOpen,
  onClose,
  completedLevel,
  score,
  nextLevelUnlocked,
  nextChapterUnlocked,
  newBadges = [],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleGoToNextLevel = () => {
    const nextLevel = nextLevelUnlocked || nextChapterUnlocked;
    if (nextLevel) {
      setIsVisible(false);
      setTimeout(() => {
        navigate(`/chapter/${nextLevel.chapter}/level/${nextLevel.level}`);
        onClose();
      }, 300);
    }
  };

  const handleBackToChapter = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate(`/chapter/${completedLevel.chapter}`);
      onClose();
    }, 300);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreMessage = (score) => {
    if (score >= 95) return "Perfect! Outstanding work! 🌟";
    if (score >= 85) return "Excellent job! Well done! 🎉";
    if (score >= 75) return "Great work! Keep it up! 👏";
    if (score >= 65) return "Good effort! You're learning! 👍";
    return "Nice try! Practice makes perfect! 💪";
  };

  const chapterNames = {
    1: "Childhood in Calamba",
    2: "Education in Manila",
    3: "Studies Abroad",
    4: "Noli Me Tangere",
    5: "Return to the Philippines",
  };

  const chapterEmojis = {
    1: "🏠",
    2: "📚",
    3: "✈️",
    4: "📖",
    5: "🇵🇭",
  };

  if (!isOpen) return null;

  const nextLevel = nextLevelUnlocked || nextChapterUnlocked;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-t-3xl text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Level Complete!</h2>
            <p className="text-green-100">
              Chapter {completedLevel.chapter} - Level {completedLevel.level}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div
                className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(
                  score
                )}`}
              >
                {score}%
              </div>
              <p className="text-lg text-gray-700 mt-3 font-medium">
                {getScoreMessage(score)}
              </p>
            </div>

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  🏆 New Badges Earned!
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {newBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                    >
                      {badge.name || badge}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Level Unlocked */}
            {nextLevel && (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">🔓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    New Level Unlocked!
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">
                      {chapterEmojis[nextLevel.chapter]}
                    </span>
                    <span className="font-bold text-gray-700">
                      Chapter {nextLevel.chapter} - Level {nextLevel.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {chapterNames[nextLevel.chapter]}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {nextLevel && (
                <button
                  onClick={handleGoToNextLevel}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <span>🚀</span>
                  <span>Continue to Next Level</span>
                </button>
              )}

              <button
                onClick={handleBackToChapter}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>📚</span>
                <span>Back to Chapter {completedLevel.chapter}</span>
              </button>

              <button
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCompletionModal;
