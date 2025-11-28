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
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
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

  // Analytics tracking
  const { trackLevelStart, trackInteraction } = useAnalytics(username);

  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

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

  // Track level start and set start time
  useEffect(() => {
    trackLevelStart(1, 1);
    window.gameStartTime = Date.now(); // Track start time for completion
  }, [trackLevelStart]);

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
      }
      // Proceed to next game regardless of answer
      nextGame();
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
    // Track mini-game completion
    trackInteraction(1, 1, "mini_game_complete", {
      gameIndex: currentGame,
      score: score,
      attempts: attempts,
      hintsUsed: hintsUsed,
    });

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

    // Calculate time spent
    const timeSpent = Date.now() - (window.gameStartTime || Date.now());

    // Call the onComplete callback with enhanced game state
    if (onComplete) {
      onComplete(score, timeSpent, {
        attempts: attempts,
        hintsUsed: hintsUsed,
        startTime: new Date(window.gameStartTime || Date.now()),
        endTime: new Date(),
        accuracy: score,
      });
    }
  };

  const renderQuizGame = (game) => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-blue-200">
        <h3 className="text-2xl font-black text-gray-800 mb-8 text-center leading-relaxed">
          {game.question}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(index)}
              disabled={showQuizResult}
              className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${showQuizResult
                  ? index === game.correct
                    ? "bg-green-100 border-green-400 text-green-800"
                    : index === selectedAnswer
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-black"
                  : selectedAnswer === index
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-blue-50 hover:border-blue-300"
                }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${showQuizResult
                      ? index === game.correct
                        ? "bg-green-500 text-white"
                        : index === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                      : selectedAnswer === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg text-black">{option}</span>
              </div>
            </button>
          ))}
        </div>
        {showQuizResult && (
          <div className="mt-8 text-center">
            <div
              className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl font-black text-lg shadow-lg ${selectedAnswer === game.correct
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                }`}
            >
              <span className="text-2xl">
                {selectedAnswer === game.correct ? "🎉" : "💪"}
              </span>
              <span>
                {selectedAnswer === game.correct
                  ? "Awesome! You got it right!"
                  : "Good try! Keep learning!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
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
              className={`min-w-[120px] h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${puzzlePieces.find(
                (p) => p.text === game.pieces[index] && p.placed
              )
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white border-2 border-gray-300 text-black hover:border-blue-400 hover:bg-blue-50"
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
              <span>{piece.text}</span>
            </div>
          ))}
      </div>

      {puzzlePieces.filter((p) => !p.placed).length === 0 && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold">
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
                  className={`mx-2 px-4 py-2 border-2 rounded-xl font-bold text-center min-w-[160px] transition-all duration-300 ${blanksAnswers[index] === game.blanks[index]
                      ? "border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg"
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
              <span className="text-2xl">🎉</span>
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


          <div className="text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto border border-white/20">
              {/* Celebration Icon */}
              <div className="text-8xl mb-6">🎂</div>

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-green-300 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-blue-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToChapter}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-b-2 border-gray-700 active:border-b-0"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">🎂</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800">
                  Jose's Birth
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Level 1 • Chapter 1
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/90 rounded-full px-4 py-2 shadow-md border-2 border-blue-200">
              <span className="text-blue-600 font-bold">Score: {score}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg border-b-2 border-red-700 active:border-b-0"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-600">
                {currentGame + 1}/{games.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentGame + 1) / games.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-blue-200">
            <div className="text-6xl mb-4">🎂</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {games[currentGame].title}
            </h2>
            <p className="text-gray-600 font-medium">
              Learn about Jose's beginning
            </p>
          </div>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Fact */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  Did You Know?
                </h3>
                <p className="text-gray-600">
                  Fun facts about Jose Rizal's birth
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
              <p className="text-gray-700 font-medium">
                Jose Rizal was born on June 19, 1861, in Calamba, Laguna. He was
                the seventh child in a family of eleven children. His full name
                was José Protasio Rizal Mercado y Alonso Realonda!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
