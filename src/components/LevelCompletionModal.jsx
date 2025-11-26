import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getButtonClasses, shadows } from "../utils/designSystem";
import { getSuccessClasses } from "../utils/interactiveFeedback";
import { trapFocus, getFocusRing } from "../utils/accessibility";

const LevelCompletionModal = ({
  isOpen,
  onClose,
  completedLevel,
  score,
  rawScore,
  finalScore,
  nextLevelUnlocked,
  nextChapterUnlocked,
  newBadges = [],
}) => {
  // Use finalScore if provided, otherwise fall back to score
  const displayScore = finalScore !== undefined ? finalScore : score;
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className={`transform transition-all duration-500 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-green-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white p-8 rounded-t-3xl text-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div
                className="absolute top-0 left-1/4 w-20 h-20 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute top-10 right-1/4 w-16 h-16 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute bottom-10 left-1/3 w-12 h-12 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce shadow-2xl border-4 border-white/50">
                <span className="text-5xl">🎉</span>
              </div>
              <h2 className="text-4xl font-black mb-2 drop-shadow-lg">
                Level Complete!
              </h2>
              <p className="text-green-100 text-lg font-semibold">
                Chapter {completedLevel.chapter} - Level {completedLevel.level}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wide">
                  Final Score
                </div>
                <div
                  className={`inline-block px-8 py-4 rounded-2xl text-4xl font-black shadow-lg ${getScoreColor(
                    displayScore
                  )} transform hover:scale-105 transition-transform duration-200`}
                >
                  {Math.round(displayScore)}
                </div>
              </div>
              {rawScore !== undefined && rawScore !== displayScore && (
                <div className="text-sm text-gray-600 mb-2 bg-gray-50 inline-block px-4 py-2 rounded-full">
                  Base Score: {Math.round(rawScore)} → Final Score:{" "}
                  {Math.round(displayScore)}
                </div>
              )}
              <p className="text-xl text-gray-700 mt-4 font-bold">
                {getScoreMessage(displayScore)}
              </p>
            </div>

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className="mb-8 animate-slide-up">
                <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
                  🏆 New Badges Earned!
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {newBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl border-2 border-yellow-300 transform hover:scale-110 transition-transform duration-200 animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {badge.name || badge}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Level Unlocked */}
            {nextLevel && (
              <div className="mb-8 animate-slide-up">
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-3 border-blue-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl animate-pulse border-4 border-blue-200">
                    <span className="text-3xl text-white">🔓</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-3">
                    New Level Unlocked!
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl">
                      {chapterEmojis[nextLevel.chapter]}
                    </span>
                    <span className="font-bold text-gray-700 text-lg">
                      Chapter {nextLevel.chapter} - Level {nextLevel.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
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
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 border-b-4 border-green-700 hover:border-green-800"
                >
                  <span className="text-2xl">🚀</span>
                  <span>Continue to Next Level</span>
                </button>
              )}

              <button
                onClick={handleBackToChapter}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 border-b-4 border-blue-700 hover:border-blue-800"
              >
                <span className="text-2xl">📚</span>
                <span>Back to Chapter {completedLevel.chapter}</span>
              </button>

              <button
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-102 active:scale-98"
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
