import { useState } from "react";
import GameHeader from "../../components/GameHeader";
import { EducationalFact } from "../../components/EducationalFact";
import { HintSystem } from "../../components/HintSystem";
import { ScenePlaceholder } from "../../components/PlaceholderImage";

export default function BasicEducationalGame({
  username,
  onLogout,
  onComplete,
  gameTitle = "Educational Game",
  level = 1,
  chapter = 1,
  theme = "blue",
  questions = [],
  educationalContent = null,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Default questions if none provided
  const defaultQuestions = [
    {
      id: 1,
      question: "When was José Rizal born?",
      options: [
        "June 19, 1861",
        "June 19, 1862",
        "July 19, 1861",
        "July 19, 1862",
      ],
      correct: 0,
      explanation: "José Rizal was born on June 19, 1861, in Calamba, Laguna.",
      emoji: "🎂",
    },
    {
      id: 2,
      question: "What was the title of Rizal's first novel?",
      options: [
        "El Filibusterismo",
        "Noli Me Tangere",
        "Mi Último Adiós",
        "La Solidaridad",
      ],
      correct: 1,
      explanation:
        "Noli Me Tangere (Touch Me Not) was Rizal's first novel, published in 1887.",
      emoji: "📚",
    },
    {
      id: 3,
      question: "Where did Rizal study medicine?",
      options: [
        "University of Santo Tomas",
        "Ateneo Municipal",
        "Universidad Central de Madrid",
        "University of Heidelberg",
      ],
      correct: 2,
      explanation:
        "Rizal studied medicine at Universidad Central de Madrid in Spain.",
      emoji: "⚕️",
    },
  ];

  const gameQuestions = questions.length > 0 ? questions : defaultQuestions;
  const currentQ = gameQuestions[currentQuestion];

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    if (answerIndex === currentQ.correct) {
      const points = 10 - hintsUsed; // Reduce points for hints used
      setScore((prev) => prev + Math.max(points, 5)); // Minimum 5 points
    }
  };

  const handleNext = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameComplete(true);
      if (onComplete) {
        onComplete(score);
      }
    }
  };

  const handleHintUsed = () => {
    setHintsUsed((prev) => prev + 1);
  };

  const getScoreMessage = () => {
    const percentage = (score / (gameQuestions.length * 10)) * 100;
    if (percentage >= 90) return "Outstanding! You're a Rizal expert! 🌟";
    if (percentage >= 75) return "Excellent work! You know Rizal well! 🏆";
    if (percentage >= 60) return "Good job! Keep learning about our hero! 👍";
    return "Great effort! Every step helps you learn more! 💪";
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <GameHeader
          title={gameTitle}
          level={level}
          chapter={chapter}
          score={score}
          onBack={() => window.history.back()}
          onLogout={onLogout}
          username={username}
          theme={theme}
        />

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You've finished learning about José Rizal!
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="text-2xl font-bold text-blue-800 mb-2">
                Final Score: {score} / {gameQuestions.length * 10}
              </div>
              <div className="text-blue-700">
                {Math.round((score / (gameQuestions.length * 10)) * 100)}%
                Accuracy
              </div>
              {hintsUsed > 0 && (
                <div className="text-sm text-blue-600 mt-2">
                  Hints used: {hintsUsed}
                </div>
              )}
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-green-800">{getScoreMessage()}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
              >
                Play Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <GameHeader
        title={gameTitle}
        level={level}
        chapter={chapter}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme={theme}
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-700">
              {currentQuestion + 1} / {gameQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestion + 1) / gameQuestions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              {/* Question Visual */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4">
                  <ScenePlaceholder
                    scene="education"
                    size="large"
                    title={currentQ.emoji || "🎓"}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Question {currentQuestion + 1}
                </h3>
                <p className="text-lg text-gray-700">{currentQ.question}</p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQ.correct;
                  const showResult = showFeedback && isSelected;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        showFeedback
                          ? isCorrect
                            ? "border-green-500 bg-green-50"
                            : isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                      } ${
                        showFeedback ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                            showFeedback && isCorrect
                              ? "border-green-500 bg-green-500"
                              : showFeedback && isSelected && !isCorrect
                              ? "border-red-500 bg-red-500"
                              : isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {showFeedback && isCorrect && (
                            <span className="text-white text-sm">✓</span>
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <span className="text-white text-sm">✗</span>
                          )}
                          {!showFeedback && isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-800">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className="mb-6">
                  <div
                    className={`p-4 rounded-lg ${
                      selectedAnswer === currentQ.correct
                        ? "bg-green-50 border-l-4 border-green-500"
                        : "bg-red-50 border-l-4 border-red-500"
                    }`}
                  >
                    <p
                      className={`font-medium mb-2 ${
                        selectedAnswer === currentQ.correct
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {selectedAnswer === currentQ.correct
                        ? "Correct! 🎉"
                        : "Not quite right. 🤔"}
                    </p>
                    <p
                      className={
                        selectedAnswer === currentQ.correct
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {currentQ.explanation}
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentQuestion < gameQuestions.length - 1
                        ? "Next Question"
                        : "Complete Game"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hint System */}
            <HintSystem
              hints={[
                "Think about what you've learned in previous levels",
                "Consider the historical context of the question",
                "Use the process of elimination if unsure",
              ]}
              onHintUsed={handleHintUsed}
              disabled={showFeedback}
            />

            {/* Educational Fact */}
            <EducationalFact />
          </div>
        </div>
      </div>
    </div>
  );
}
