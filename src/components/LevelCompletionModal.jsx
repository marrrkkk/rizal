import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getButtonClasses, shadows } from "../utils/designSystem";
import { getSuccessClasses } from "../utils/interactiveFeedback";
import { trapFocus, getFocusRing } from "../utils/accessibility";
import BaseModal from "./BaseModal";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Play correct sound when modal opens
      const audio = new Audio('/music/CorrectSounds.mp3');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch(error => {
        console.log('Could not play sound:', error);
      });
    }
  }, [isOpen]);

  const handleGoToNextLevel = () => {
    const nextLevel = nextLevelUnlocked || nextChapterUnlocked;
    if (nextLevel) {
      navigate(`/chapter/${nextLevel.chapter}/level/${nextLevel.level}`);
      onClose();
    }
  };

  const handleBackToChapter = () => {
    navigate(`/chapter/${completedLevel.chapter}`);
    onClose();
  };

  const handleGoHome = () => {
    navigate('/');
    onClose();
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

  const nextLevel = nextLevelUnlocked || nextChapterUnlocked;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white p-5 rounded-t-3xl text-center relative overflow-hidden">
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
            <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-2 flex items-center justify-center shadow-2xl border-4 border-white/50">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-black mb-1 drop-shadow-lg">
              Level Complete!
            </h2>
            <p className="text-green-100 text-base font-semibold">
              Chapter {completedLevel.chapter} - Level {completedLevel.level}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Score Display */}
          <div className="text-center mb-5">
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                Final Score
              </div>
              <div
                className={`inline-block px-6 py-3 rounded-xl text-3xl font-black shadow-lg ${getScoreColor(
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
            <p className="text-lg text-gray-700 mt-3 font-bold">
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
          <div className="flex flex-col gap-3">
            {nextLevel && (
              <button
                onClick={handleGoToNextLevel}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-xl">🚀</span>
                <span>Continue</span>
              </button>
            )}

            <button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🏠</span>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default LevelCompletionModal;
