/**
 * Game Integration Example
 * Shows how to integrate the badge notification system into game components
 */

import { useState, useEffect } from "react";
import { useUserProgress } from "../hooks/useUserProgress";
import { useBadgeNotifications } from "./BadgeNotificationSystem";
import BadgeNotificationSystem from "./BadgeNotificationSystem";

const GameIntegrationExample = ({ username = "TestUser" }) => {
  const [gameState, setGameState] = useState("menu"); // menu, playing, completed
  const [currentScore, setCurrentScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "When was José Rizal born?",
      answer: "1861",
      options: ["1860", "1861", "1862", "1863"],
    },
    {
      id: 2,
      question: "Where was José Rizal born?",
      answer: "Calamba",
      options: ["Manila", "Calamba", "Cebu", "Davao"],
    },
    {
      id: 3,
      question: "What was José Rizal's first novel?",
      answer: "Noli Me Tangere",
      options: [
        "El Filibusterismo",
        "Noli Me Tangere",
        "Mi Ultimo Adios",
        "Sobre la Indolencia",
      ],
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const { completeLevel } = useUserProgress(username);
  const {
    notifications,
    showBadgeNotification,
    showLevelCompleteNotification,
    clearNotification,
  } = useBadgeNotifications();

  const startGame = () => {
    setGameState("playing");
    setStartTime(Date.now());
    setCurrentScore(0);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setSelectedAnswer("");
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].answer;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setCurrentScore((prev) => prev + Math.floor(100 / questions.length));
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    const finalScore = Math.floor((correctAnswers / questions.length) * 100);

    setCurrentScore(finalScore);
    setGameState("completed");

    // Show level completion notification
    showLevelCompleteNotification(1, 1, finalScore);

    // Complete the level in the progress system
    try {
      const result = await completeLevel(1, 1, finalScore, timeSpent);

      if (result.success && result.newBadges) {
        // Show badge notifications with delay
        result.newBadges.forEach((badge, index) => {
          setTimeout(() => {
            showBadgeNotification(badge);
          }, (index + 1) * 1500);
        });
      }
    } catch (error) {
      console.error("Error completing level:", error);
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setCurrentScore(0);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setSelectedAnswer("");
    setStartTime(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Badge Notification System */}
      <BadgeNotificationSystem
        notifications={notifications}
        onClearNotification={clearNotification}
      />

      {/* Game Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎮 José Rizal Quiz Game
        </h1>
        <p className="text-gray-600">
          Test your knowledge about the Philippines' national hero!
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Playing as: <strong>{username}</strong>
        </p>
      </div>

      {/* Game Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {gameState === "menu" && (
          <div className="text-center">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Learn About José Rizal?
            </h2>
            <p className="text-gray-600 mb-8">
              Answer {questions.length} questions to complete this level and
              earn badges!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              🚀 Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>Score: {currentScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {questions[currentQuestion].question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedAnswer === option
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Complete Game"}{" "}
                →
              </button>
            </div>
          </div>
        )}

        {gameState === "completed" && (
          <div className="text-center">
            <div className="text-6xl mb-6">
              {currentScore >= 90 ? "🌟" : currentScore >= 70 ? "⭐" : "👍"}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold mb-2">{currentScore}%</div>
              <div className="text-lg">Final Score</div>
              <div className="text-sm opacity-90 mt-2">
                {correctAnswers} out of {questions.length} correct answers
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-green-800">
                  Level Completed
                </div>
                <div className="text-sm text-green-600">
                  Progress saved to your account
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-semibold text-yellow-800">
                  Badges Earned
                </div>
                <div className="text-sm text-yellow-600">
                  Check notifications above!
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          How Badge System Works:
        </h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>
            • Complete the quiz to earn your first badge: "First Steps" 🎯
          </li>
          <li>
            • Get a perfect score (100%) to earn the "Perfect Performance" badge
            ⭐
          </li>
          <li>• Your progress is automatically saved with your username</li>
          <li>• Badge notifications will appear in the top-right corner</li>
          <li>
            • Level completion notification shows your score and encouragement
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GameIntegrationExample;
