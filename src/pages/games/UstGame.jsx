"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNavigationHelper } from "../../utils/navigationHelper";
import ErrorBoundary from "../../components/ErrorBoundary";
import GameHeader from "../../components/GameHeader";
import ProgressBar from "../../components/ProgressBar";
import { getChapterTheme, getCelebrationTheme } from "../../theme/config";
import {
  useResponsive,
  getTouchFriendlyProps,
  getMobileOptimizedClasses,
} from "../../utils/responsiveUtils.jsx";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";
import LoadingSpinner from "../../components/LoadingSpinner";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
} from "../../components/VisualFeedback";
import {
  KidsEducationalFact,
  ContextualEducationalContent,
} from "../../components/EducationalFact";
import {
  ChildFriendlyError,
  EncouragingMessage,
} from "../../components/ChildFriendlyMessages";

export default function UstGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { getOptimizedTouchProps, debounce } = usePerformanceOptimization();
  const touchProps = getOptimizedTouchProps();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  // Analytics tracking
  const { trackLevelStart, trackInteraction } = useAnalytics(username);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [gameStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const cardContents = [
    {
      id: 1,
      content: "Medicine",
      emoji: "🏥",
      description:
        "Rizal studied medicine at UST to help his mother's eye condition",
      funFact:
        "Rizal wanted to become a doctor to cure his mother's blindness!",
    },
    {
      id: 2,
      content: "Philosophy",
      emoji: "📜",
      description: "Philosophy helped Rizal develop his critical thinking",
      funFact: "Philosophy classes taught Rizal to question and think deeply!",
    },
    {
      id: 3,
      content: "Literature",
      emoji: "📚",
      description: "Literature studies enhanced Rizal's writing skills",
      funFact:
        "Rizal's love for literature started at UST and made him a great writer!",
    },
    {
      id: 4,
      content: "Painting",
      emoji: "🎨",
      description: "Rizal learned painting as part of his artistic education",
      funFact:
        "Rizal painted beautiful portraits and landscapes during his UST years!",
    },
    {
      id: 5,
      content: "Sculpture",
      emoji: "🗿",
      description: "Sculpture was another artistic skill Rizal developed",
      funFact: "Rizal could carve beautiful sculptures from wood and stone!",
    },
    {
      id: 6,
      content: "Fencing",
      emoji: "🤺",
      description: "Fencing taught Rizal discipline and physical fitness",
      funFact:
        "Rizal became an expert fencer and even taught fencing to others!",
    },
  ];

  // Track level start
  useEffect(() => {
    trackLevelStart(2, 2);
  }, [trackLevelStart]);

  // Initialize cards
  useEffect(() => {
    const shuffled = [...cardContents, ...cardContents]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        matched: false,
      }));
    setCards(shuffled);
  }, []);

  // Handle card matching logic
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      setMoves(moves + 1);
      setAttempts(attempts + 1);

      // Track interaction
      trackInteraction(2, 2, "card_match_attempt", {
        firstCard: firstCard.content,
        secondCard: secondCard.content,
        isMatch: firstCard.content === secondCard.content,
        moves: moves + 1,
      });

      if (firstCard.content === secondCard.content) {
        // Match found!
        const newCards = [...cards];
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        setCards(newCards);
        setSolved([...solved, firstCard.content]);
        setFlipped([]);



        // Check if game is complete
        if (solved.length + 1 === cardContents.length) {
          setTimeout(() => {
            setIsComplete(true);
            handleGameComplete();
          }, 1000);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped, cards, moves, solved, attempts]);

  const handleCardClick = (index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      cards[index].matched
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
    trackInteraction(2, 2, "hint_used", {
      hintsUsed: hintsUsed + 1,
      currentMatches: solved.length,
    });

    // Hide hint after 5 seconds
    setTimeout(() => setShowHint(false), 5000);
  };

  const handleGameComplete = () => {
    const timeSpent = Date.now() - gameStartTime;
    const efficiency = Math.max(100 - (moves - cardContents.length) * 5, 50); // Bonus for fewer moves
    const finalScore = Math.round(efficiency - hintsUsed * 5); // Penalty for hints

    if (onComplete) {
      onComplete(Math.max(finalScore, 0), timeSpent);
    }
  };

  const handleBackToChapter = () => {
    navigationHelper.goToChapter(2);
  };

  const chapterTheme = getChapterTheme(2);
  const celebrationTheme = getCelebrationTheme("completion");

  if (isComplete) {
    const efficiency = Math.max(100 - (moves - cardContents.length) * 5, 50);
    const finalScore = Math.round(efficiency - hintsUsed * 5);

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 relative overflow-hidden">


          <ResponsiveContainer className="relative z-10 py-8">
            {/* Header */}
            <GameHeader
              title="UST Memory Match"
              subtitle="Chapter 2 - Level 2"
              onBack={handleBackToChapter}
              onLogout={onLogout}
              theme={chapterTheme}
            />

            {/* Completion Card */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-orange-200">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-4xl text-white">🎓</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">
                    Memory Match Complete!
                  </h2>
                  <p className="text-lg text-gray-600">
                    You've learned about Rizal's UST studies!
                  </p>
                </div>

                {/* Score Display */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border-2 border-orange-200">
                    <p className="text-sm text-black mb-2">Your Score</p>
                    <p className="text-5xl font-black text-orange-600 mb-2">
                      {Math.max(finalScore, 0)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Completed in {moves} moves
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">{moves}</p>
                    <p className="text-sm text-blue-700">Total Moves</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {solved.length}
                    </p>
                    <p className="text-sm text-green-700">Pairs Matched</p>
                  </div>
                </div>

                {/* Encouraging Message */}
                <div className="text-center mb-8">
                  <EncouragingMessage
                    score={Math.max(finalScore, 0)}
                    attempts={moves}
                    hintsUsed={hintsUsed}
                    context="memory_game"
                  />
                </div>

                {/* Educational Fact */}
                <div className="mb-8">
                  <KidsEducationalFact
                    fact="🎓 Did you know? At UST, Rizal studied many subjects including medicine, philosophy, and literature. He was a well-rounded student who excelled in both academics and arts!"
                    title="Amazing Fact about Rizal's UST Years!"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <FeedbackButton
                    onClick={handleBackToChapter}
                    variant="primary"
                    size="large"
                    className="w-full"
                    {...touchProps}
                  >
                    <span className="mr-2">📚</span>
                    Continue to Chapter 2
                  </FeedbackButton>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 relative overflow-hidden">


        <ResponsiveContainer className="relative z-10 py-8">
          {/* Header */}
          <GameHeader
            title="UST Memory Match"
            subtitle="Chapter 2 - Level 2"
            onBack={handleBackToChapter}
            onLogout={onLogout}
            theme={chapterTheme}
          />

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <ProgressBar
              current={solved.length}
              total={cardContents.length}
              label={`${solved.length} of ${cardContents.length} pairs matched`}
              theme={chapterTheme}
            />
          </div>

          {/* Main Game Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-orange-200">


              {/* Game Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🎓</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">
                  Match Rizal's UST Studies!
                </h3>
                <p className="text-gray-600">
                  Find matching pairs of subjects Rizal studied at University of
                  Santo Tomas
                </p>
              </div>

              {/* Game Stats */}
              <div className="flex justify-center space-x-6 mb-8">
                <div className="bg-orange-100 px-4 py-2 rounded-full">
                  <span className="text-orange-800 font-bold">
                    Moves: {moves}
                  </span>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-full">
                  <span className="text-green-800 font-bold">
                    Pairs: {solved.length}/{cardContents.length}
                  </span>
                </div>
                {hintsUsed > 0 && (
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-blue-700 text-sm">
                      💡 {hintsUsed} hints
                    </span>
                  </div>
                )}
              </div>

              {/* Hint Button */}
              {!showHint && (
                <div className="text-center mb-6">
                  <button
                    onClick={handleHint}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-full font-medium transition-colors duration-200 border-2 border-blue-200"
                    {...touchProps}
                  >
                    💡 Need a hint?
                  </button>
                </div>
              )}

              {/* Hint Display */}
              {showHint && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-bold text-blue-800 mb-1">Hint:</p>
                      <p className="text-blue-700">
                        Look for cards with the same subject! Rizal studied
                        medicine to help his mother, and also learned arts like
                        painting and sculpture.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Memory Cards Grid */}
              <div
                className={`grid gap-4 mb-8 ${
                  isMobile ? "grid-cols-3" : "grid-cols-4"
                }`}
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      card.matched
                        ? "bg-green-100 border-green-400 cursor-default"
                        : flipped.includes(index)
                        ? "bg-orange-100 border-orange-400"
                        : "bg-gray-100 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                    {...touchProps}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-4">
                      {flipped.includes(index) || card.matched ? (
                        <>
                          <div className="text-4xl mb-2">{card.emoji}</div>
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-sm">
                              {card.content}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-4xl text-gray-400">❓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Educational Content */}
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                  <span className="mr-2">📚</span>
                  About Rizal's UST Years
                </h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  José Rizal studied at the University of Santo Tomas from 1877
                  to 1882. He took up medicine to help cure his mother's eye
                  condition, but he also studied philosophy, literature, and
                  various arts. His well-rounded education at UST helped shape
                  him into the brilliant person he became!
                </p>
              </div>

              {/* Exit Button */}
              <div className="flex justify-center pt-6 border-t-2 border-orange-200 mt-8">
                <button
                  onClick={handleBackToChapter}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                  {...touchProps}
                >
                  Exit Game
                </button>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
