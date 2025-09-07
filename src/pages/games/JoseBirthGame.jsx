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
import TouchFriendlyDragDrop from "../../components/TouchFriendlyDragDrop";
import MobileOptimizedGame from "../../components/MobileOptimizedGame";

// Import new child-friendly components
import { ContextualHints, EncouragingHints } from "../../components/HintSystem";
import {
  KidsEducationalFact,
  ContextualEducationalContent,
} from "../../components/EducationalFact";
import {
  ChildFriendlyError,
  EncouragingMessage,
} from "../../components/ChildFriendlyMessages";
import {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
  CelebrationAnimation as NewCelebrationAnimation,
} from "../../components/VisualFeedback";
import {
  getRandomResponse,
  triggerHapticFeedback,
  createChildFriendlyContext,
} from "../../utils/childFriendlyInteractions";

export default function JoseBirthGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { getOptimizedTouchProps, debounce } = usePerformanceOptimization();
  const touchProps = getOptimizedTouchProps();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Puzzle Game State
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);

  // Fill in the Blanks State
  const [blanksAnswers, setBlanksAnswers] = useState({});

  // Child-friendly enhancement state
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [childFriendlyContext] = useState(
    createChildFriendlyContext({ age: 8 })
  );

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "When was Jose born?",
      question: "On what date was Jose Rizal born?",
      options: [
        "June 19, 1861",
        "July 19, 1861",
        "June 19, 1862",
        "May 19, 1861",
      ],
      correct: 0,
    },
    {
      id: 1,
      type: "quiz",
      title: "Where was Jose born?",
      question: "In which town was Jose Rizal born?",
      options: ["Manila", "Calamba", "Laguna", "Bataan"],
      correct: 1,
    },
    {
      id: 2,
      type: "puzzle",
      title: "Complete Jose's Full Name",
      pieces: [
        "José",
        "Protasio",
        "Rizal",
        "Mercado",
        "y",
        "Alonso",
        "Realonda",
      ],
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: 3,
      type: "blanks",
      title: "Fill in the Facts",
      sentence:
        "Jose Rizal was born on _____ in the town of _____, _____. His father was _____ and his mother was _____.",
      blanks: [
        "June 19, 1861",
        "Calamba",
        "Laguna",
        "Francisco Mercado",
        "Teodora Alonso",
      ],
      options: [
        ["June 19, 1861", "July 19, 1861", "May 19, 1861"],
        ["Calamba", "Manila", "Bataan"],
        ["Laguna", "Batangas", "Cavite"],
        ["Francisco Mercado", "Juan Mercado", "Pedro Mercado"],
        ["Teodora Alonso", "Maria Alonso", "Carmen Alonso"],
      ],
    },
  ];

  useEffect(() => {
    if (currentGame === 2) {
      // Initialize puzzle pieces
      const shuffled = [...games[2].pieces].sort(() => Math.random() - 0.5);
      setPuzzlePieces(
        shuffled.map((piece, index) => ({
          id: index,
          text: piece,
          placed: false,
        }))
      );
    }
  }, [currentGame]);

  const handleQuizAnswer = debounce((answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowQuizResult(true);
    setAttempts((prev) => prev + 1);

    const isCorrect = answerIndex === games[currentGame].correct;

    // Enhanced haptic feedback with child-friendly patterns
    if (isCorrect) {
      triggerHapticFeedback("correct");
      setFeedbackMessage({
        type: "success",
        message: getRandomResponse("correct"),
        duration: 2000,
      });
    } else {
      triggerHapticFeedback("incorrect");
      setFeedbackMessage({
        type: "error",
        message: getRandomResponse("incorrect"),
        duration: 2500,
      });
    }

    const delay = isMobile ? 2000 : 2500; // More time for child-friendly messages
    setTimeout(() => {
      if (isCorrect) {
        setScore(score + Math.max(25 - hintsUsed * 5, 10)); // Reduce score for hints but keep minimum
        nextGame();
      } else {
        // Show encouragement after multiple attempts
        if (attempts >= 2) {
          setShowEncouragement(true);
          setTimeout(() => setShowEncouragement(false), 3000);
        }
        // Allow retry
        setSelectedAnswer(null);
        setShowQuizResult(false);
      }
      setFeedbackMessage(null);
    }, delay);
  }, 300);

  const handlePuzzleDrop = (e) => {
    e.preventDefault();
    const dropZoneIndex = Number.parseInt(e.target.dataset.index);
    if (draggedPiece !== null && dropZoneIndex !== undefined) {
      const newPieces = [...puzzlePieces];
      const piece = newPieces.find((p) => p.id === draggedPiece);
      if (piece && games[2].pieces[dropZoneIndex] === piece.text) {
        piece.placed = true;
        setPuzzlePieces(newPieces);
        setScore(score + 15);

        // Check if puzzle is complete
        if (newPieces.every((p) => p.placed)) {
          setTimeout(() => nextGame(), 1000);
        }
      }
    }
    setDraggedPiece(null);
  };

  const handleBlanksAnswer = (blankIndex, answer) => {
    const newAnswers = { ...blanksAnswers, [blankIndex]: answer };
    setBlanksAnswers(newAnswers);

    if (answer === games[3].blanks[blankIndex]) {
      setScore(score + 20);
    }

    // Check if all blanks are filled correctly
    if (Object.keys(newAnswers).length === games[3].blanks.length) {
      const allCorrect = games[3].blanks.every(
        (correct, index) => newAnswers[index] === correct
      );
      if (allCorrect) {
        setTimeout(() => nextGame(), 1000);
      }
    }
  };

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setBlanksAnswers({});
    } else {
      handleGameComplete();
    }
  };

  const handleBackToChapter = () => {
    navigationHelper.goToChapter(1);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowCelebration(true);

    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(score);
    }
  };

  const renderQuizGame = (game) => (
    <ResponsiveContainer size="2xl">
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-3xl ${
          isMobile ? "p-6" : "p-8"
        } shadow-2xl border border-white/20`}
      >
        <div className="text-center mb-4 sm:mb-6">
          <div
            className={`inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg`}
          >
            <span className={`${isMobile ? "text-xl" : "text-2xl"}`}>❓</span>
            <span className={`font-bold ${isMobile ? "text-sm" : "text-base"}`}>
              Quiz Time!
            </span>
          </div>
        </div>
        <h3
          className={`${
            isMobile ? "text-lg" : "text-xl sm:text-2xl"
          } font-bold text-gray-800 ${
            isMobile ? "mb-6" : "mb-8"
          } text-center leading-relaxed`}
        >
          {game.question}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {game.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(index)}
              disabled={showQuizResult}
              className={`group ${
                isMobile ? "p-4" : "p-5"
              } rounded-2xl text-left transition-all duration-300 transform ${
                isTouchDevice ? "active:scale-95" : "hover:-translate-y-1"
              } ${isTouchDevice ? "min-h-[60px]" : ""} ${
                showQuizResult
                  ? index === game.correct
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 shadow-lg scale-105"
                    : index === selectedAnswer
                    ? "bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-800 shadow-lg"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-200"
                  : `bg-gradient-to-r from-blue-50 to-indigo-50 ${
                      isTouchDevice
                        ? "active:from-blue-100 active:to-indigo-100"
                        : "hover:from-blue-100 hover:to-indigo-100"
                    } border-2 border-blue-200 ${
                      isTouchDevice
                        ? "active:border-blue-400 active:shadow-xl"
                        : "hover:border-blue-400 hover:shadow-xl"
                    }`
              }`}
              {...touchProps}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`${
                    isTouchDevice ? "w-10 h-10" : "w-8 h-8"
                  } rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 flex-shrink-0 ${
                    showQuizResult && index === game.correct
                      ? "bg-green-500 animate-bounce"
                      : showQuizResult && index === selectedAnswer
                      ? "bg-red-500"
                      : `bg-blue-500 ${
                          isTouchDevice
                            ? "group-active:bg-blue-600"
                            : "group-hover:bg-blue-600"
                        }`
                  }`}
                >
                  <span
                    className={`${isTouchDevice ? "text-base" : "text-sm"}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    isMobile ? "text-sm" : "text-base"
                  } leading-tight`}
                >
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
        {showQuizResult && (
          <div className={`${isMobile ? "mt-6" : "mt-8"} text-center`}>
            <div
              className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold ${
                isMobile ? "text-base" : "text-lg"
              } ${
                selectedAnswer === game.correct
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-bounce"
                  : "bg-gradient-to-r from-orange-400 to-red-500 text-white animate-pulse"
              }`}
            >
              <span className={`${isMobile ? "text-xl" : "text-2xl"}`}>
                {selectedAnswer === game.correct ? "🎉" : "🤗"}
              </span>
              <span className={`${isMobile ? "text-sm" : "text-base"}`}>
                {selectedAnswer === game.correct
                  ? childFriendlyContext.getResponse("correct")
                  : childFriendlyContext.getResponse("incorrect")}
              </span>
            </div>

            {/* Additional encouragement for incorrect answers */}
            {selectedAnswer !== game.correct && attempts > 1 && (
              <div className="mt-4">
                <EncouragingMessage
                  situation="trying"
                  playerName={username}
                  className="max-w-md mx-auto"
                />
              </div>
            )}
          </div>
        )}

        {/* Visual feedback overlay */}
        {feedbackMessage && (
          <VisualFeedback
            type={feedbackMessage.type}
            message={feedbackMessage.message}
            duration={feedbackMessage.duration}
            onComplete={() => setFeedbackMessage(null)}
          />
        )}

        {/* Encouragement overlay */}
        {showEncouragement && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm text-center shadow-2xl">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                You're Doing Great!
              </h3>
              <p className="text-gray-600 text-sm">
                José Rizal had to practice a lot too. Keep trying - you're
                learning so much!
              </p>
            </div>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );

  const renderPuzzleGame = (game) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto border border-white/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl px-6 py-3 shadow-lg">
          <span className="text-2xl">🧩</span>
          <span className="font-bold">Name Puzzle</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">
        Drag the pieces to complete Jose's full name
      </h3>

      {/* Drop zones */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-dashed border-blue-300">
        <div className="flex flex-wrap justify-center gap-3 min-h-[80px] items-center">
          {game.pieces.map((_, index) => (
            <div
              key={index}
              data-index={index}
              onDrop={handlePuzzleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`min-w-[120px] h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                puzzlePieces.find(
                  (p) => p.text === game.pieces[index] && p.placed
                )
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105 animate-pulse"
                  : "bg-white border-2 border-gray-300 text-gray-500 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {puzzlePieces.find(
                (p) => p.text === game.pieces[index] && p.placed
              )
                ? game.pieces[index]
                : `${index + 1}`}
            </div>
          ))}
        </div>
      </div>

      {/* Draggable pieces */}
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-700">
          Available Pieces:
        </h4>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {puzzlePieces
          .filter((p) => !p.placed)
          .map((piece) => (
            <div
              key={piece.id}
              draggable
              onDragStart={() => setDraggedPiece(piece.id)}
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl cursor-move hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="group-hover:animate-pulse">{piece.text}</span>
            </div>
          ))}
      </div>

      {puzzlePieces.filter((p) => !p.placed).length === 0 && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold animate-bounce">
            <span className="text-2xl">🎉</span>
            <span>Perfect! You completed Jose's full name!</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderBlanksGame = (game) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto border border-white/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl px-6 py-3 shadow-lg">
          <span className="text-2xl">📝</span>
          <span className="font-bold">Fill the Facts</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-8 text-center">
        Complete the story about Jose's birth
      </h3>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="text-lg leading-relaxed text-gray-800 font-medium">
          {game.sentence.split("_____").map((part, index) => (
            <span key={index}>
              {part}
              {index < game.blanks.length && (
                <select
                  value={blanksAnswers[index] || ""}
                  onChange={(e) => handleBlanksAnswer(index, e.target.value)}
                  className={`mx-2 px-4 py-2 border-2 rounded-xl font-bold text-center min-w-[160px] transition-all duration-300 ${
                    blanksAnswers[index] === game.blanks[index]
                      ? "border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg animate-pulse"
                      : blanksAnswers[index]
                      ? "border-red-400 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 shadow-lg"
                      : "border-amber-400 bg-white hover:border-amber-500 hover:shadow-md"
                  }`}
                >
                  <option value="">Choose...</option>
                  {game.options[index].map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-100 rounded-full px-4 py-2">
          <span className="text-amber-600 font-medium">
            Completed:{" "}
            {
              Object.keys(blanksAnswers).filter(
                (key) => blanksAnswers[key] === game.blanks[key]
              ).length
            }{" "}
            / {game.blanks.length}
          </span>
          {Object.keys(blanksAnswers).filter(
            (key) => blanksAnswers[key] === game.blanks[key]
          ).length === game.blanks.length && (
            <span className="text-2xl animate-bounce">🎉</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    const game = games[currentGame];
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game);
      case "puzzle":
        return renderPuzzleGame(game);
      case "blanks":
        return renderBlanksGame(game);
      default:
        return null;
    }
  };

  const chapterTheme = getChapterTheme(1);
  const celebrationTheme = getCelebrationTheme("completion");

  if (gameCompleted) {
    const finalPercentage = Math.round((score / 100) * 100);
    const celebrationMessage =
      finalPercentage >= 90
        ? "🌟 Outstanding! You're a true José Rizal expert!"
        : finalPercentage >= 75
        ? "🏆 Excellent work! You know José's story so well!"
        : finalPercentage >= 60
        ? "👍 Great job! You're learning so much about our hero!"
        : "💪 Wonderful effort! Every step helps you learn more!";

    return (
      <ErrorBoundary onGoBack={handleBackToChapter}>
        <div
          className={`min-h-screen w-full bg-gradient-to-br ${chapterTheme.background} flex items-center justify-center p-6`}
        >
          {/* Celebration Animation */}
          {showCelebration && (
            <NewCelebrationAnimation
              type="confetti"
              duration={3000}
              onComplete={() => setShowCelebration(false)}
            />
          )}

          <div className="text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto border border-white/20">
              {/* Celebration Icon */}
              <div className="text-8xl mb-6 animate-bounce">🎂</div>

              {/* Title with child-friendly language */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                🎉 Amazing Work, {username}!
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                You've become a real expert on José Rizal's birth story! José
                would be so proud of how hard you worked to learn about his
                beginning!
              </p>

              {/* Enhanced Score Display */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  Your Score: {score} points!
                </div>
                <div className="text-blue-100 mb-3">{celebrationMessage}</div>

                {/* Progress indicators */}
                <div className="bg-white/20 rounded-full p-1">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-1000"
                    style={{ width: `${finalPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-blue-100 mt-2">
                  {finalPercentage}% Mastery
                </div>
              </div>

              {/* Achievement Badge with child-friendly messaging */}
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl p-6 mb-6 shadow-lg">
                <div className="text-4xl mb-3">🏆</div>
                <div className="text-xl font-bold mb-2">
                  Achievement Unlocked!
                </div>
                <div className="text-lg text-yellow-100 mb-2">
                  José's Birth Story Expert
                </div>
                <div className="text-sm text-yellow-200">
                  You learned about when and where our national hero was born!
                </div>
              </div>

              {/* Learning Summary */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-bold text-green-800 mb-2">
                  What You Learned Today:
                </h3>
                <ul className="text-sm text-green-700 text-left space-y-1">
                  <li>• José was born on June 19, 1861</li>
                  <li>• He was born in Calamba, Laguna</li>
                  <li>• His full name was very long and special</li>
                  <li>• His parents loved him very much</li>
                </ul>
              </div>

              {/* Performance feedback */}
              {hintsUsed === 0 && (
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                  <div className="text-2xl mb-2">🧠</div>
                  <p className="text-purple-700 font-medium">
                    Wow! You solved everything on your own without any hints!
                    José was independent like you!
                  </p>
                </div>
              )}

              {attempts > games.length * 2 && (
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <div className="text-2xl mb-2">💪</div>
                  <p className="text-orange-700 font-medium">
                    You showed great persistence! José never gave up when things
                    were hard, just like you!
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="space-y-4">
                <FeedbackButton
                  onClick={handleBackToChapter}
                  variant="primary"
                  size="large"
                  className="w-full text-lg"
                >
                  🏠 Continue Your Adventure!
                </FeedbackButton>
              </div>

              {/* Encouraging message */}
              <div className="mt-6 bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl p-4">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-pink-700 text-sm font-medium">
                  Keep learning about José Rizal - there are so many more
                  amazing stories to discover!
                </p>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <MobileOptimizedGame
      title="Jose's Birth"
      onBack={handleBackToChapter}
      loading={isLoading}
      className={`bg-gradient-to-br ${chapterTheme.background}`}
    >
      <GameHeader
        title="Jose's Birth"
        level={1}
        chapter={1}
        score={score}
        onBack={handleBackToChapter}
        onLogout={onLogout}
        username={username}
        theme="blue"
        showScore={true}
        maxScore={100}
      />

      {/* Main Content */}
      <main className="w-full">
        <ResponsiveContainer className="py-6 sm:py-8">
          {/* Progress */}
          <div className={`${isMobile ? "mb-6" : "mb-8"}`}>
            <ProgressBar
              current={currentGame + 1}
              total={games.length}
              theme="blue"
              showLabels={true}
              showPercentage={true}
              animated={true}
              className="max-w-2xl mx-auto"
            />
          </div>

          {/* Game Title */}
          <div className={`text-center ${isMobile ? "mb-6" : "mb-8"}`}>
            <div
              className={`inline-flex items-center space-x-2 sm:space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-white/20`}
            >
              <span className={`${isMobile ? "text-2xl" : "text-3xl"}`}>
                🎂
              </span>
              <div>
                <h2
                  className={`${
                    isMobile ? "text-lg" : "text-xl sm:text-2xl"
                  } font-bold text-gray-800`}
                >
                  {games[currentGame].title}
                </h2>
                <p
                  className={`${
                    isMobile ? "text-xs" : "text-sm"
                  } text-gray-600`}
                >
                  Learn about Jose's beginning
                </p>
              </div>
            </div>
          </div>

          {/* Current Game */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-3">{renderCurrentGame()}</div>

            {/* Sidebar with Hints and Educational Content */}
            <div className="lg:col-span-1 space-y-4">
              {/* Contextual Hints */}
              <ContextualHints
                gameType="quiz"
                currentScore={score}
                attempts={attempts}
                onHintUsed={() => {
                  setHintsUsed((prev) => prev + 1);
                  setFeedbackMessage({
                    type: "hint",
                    message: getRandomResponse("hints"),
                    duration: 2000,
                  });
                }}
                className="lg:block hidden"
              />

              {/* Educational Facts */}
              <KidsEducationalFact
                topic="childhood"
                showAnimation={true}
                className="lg:block hidden"
              />

              {/* Contextual Educational Content */}
              <ContextualEducationalContent
                gameType="quiz"
                level={1}
                chapter={1}
                playerProgress={(currentGame / games.length) * 100}
                className="lg:block hidden"
              />
            </div>
          </div>

          {/* Mobile Hints and Educational Content */}
          <div className="lg:hidden mt-6 space-y-4">
            <ContextualHints
              gameType="quiz"
              currentScore={score}
              attempts={attempts}
              onHintUsed={() => {
                setHintsUsed((prev) => prev + 1);
                setFeedbackMessage({
                  type: "hint",
                  message: getRandomResponse("hints"),
                  duration: 2000,
                });
              }}
            />

            <KidsEducationalFact topic="childhood" showAnimation={true} />
          </div>

          {/* Educational Info */}
          <div
            className={`${
              isMobile ? "mt-8" : "mt-12"
            } bg-white/80 backdrop-blur-sm rounded-3xl ${
              isMobile ? "p-6" : "p-8"
            } shadow-xl max-w-4xl mx-auto border border-white/20`}
          >
            <div className={`text-center ${isMobile ? "mb-4" : "mb-6"}`}>
              <div
                className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full px-3 sm:px-4 py-2`}
              >
                <span className={`${isMobile ? "text-lg" : "text-xl"}`}>
                  💡
                </span>
                <span
                  className={`font-bold ${isMobile ? "text-sm" : "text-base"}`}
                >
                  Did You Know?
                </span>
              </div>
            </div>
            <div
              className={`grid gap-4 sm:gap-6 ${
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              <div
                className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl ${
                  isMobile ? "p-3" : "p-4"
                } border border-blue-100`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3`}>
                  <span
                    className={`${
                      isMobile ? "text-2xl" : "text-3xl"
                    } flex-shrink-0`}
                  >
                    📅
                  </span>
                  <div className="min-w-0">
                    <h4
                      className={`font-bold text-blue-800 ${
                        isMobile ? "text-sm" : "text-base"
                      } mb-1`}
                    >
                      Birth Date
                    </h4>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-blue-700 leading-tight`}
                    >
                      Jose Rizal was born on June 19, 1861, during the Spanish
                      colonial period.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl ${
                  isMobile ? "p-3" : "p-4"
                } border border-green-100`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3`}>
                  <span
                    className={`${
                      isMobile ? "text-2xl" : "text-3xl"
                    } flex-shrink-0`}
                  >
                    🏠
                  </span>
                  <div className="min-w-0">
                    <h4
                      className={`font-bold text-green-800 ${
                        isMobile ? "text-sm" : "text-base"
                      } mb-1`}
                    >
                      Birthplace
                    </h4>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-green-700 leading-tight`}
                    >
                      He was born in Calamba, Laguna, in a house that still
                      stands today as a shrine.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl ${
                  isMobile ? "p-3" : "p-4"
                } border border-purple-100`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3`}>
                  <span
                    className={`${
                      isMobile ? "text-2xl" : "text-3xl"
                    } flex-shrink-0`}
                  >
                    👨‍👩‍👧‍👦
                  </span>
                  <div className="min-w-0">
                    <h4
                      className={`font-bold text-purple-800 ${
                        isMobile ? "text-sm" : "text-base"
                      } mb-1`}
                    >
                      Family
                    </h4>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-purple-700 leading-tight`}
                    >
                      He was the seventh of eleven children in the Mercado-Rizal
                      family.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl ${
                  isMobile ? "p-3" : "p-4"
                } border border-amber-100`}
              >
                <div className={`flex items-start space-x-2 sm:space-x-3`}>
                  <span
                    className={`${
                      isMobile ? "text-2xl" : "text-3xl"
                    } flex-shrink-0`}
                  >
                    📜
                  </span>
                  <div className="min-w-0">
                    <h4
                      className={`font-bold text-amber-800 ${
                        isMobile ? "text-sm" : "text-base"
                      } mb-1`}
                    >
                      Full Name
                    </h4>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-amber-700 leading-tight`}
                    >
                      His complete name was José Protasio Rizal Mercado y Alonso
                      Realonda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
    </MobileOptimizedGame>
  );
}
