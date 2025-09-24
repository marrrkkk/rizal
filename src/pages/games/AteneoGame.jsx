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
  CelebrationAnimation as NewCelebrationAnimation,
} from "../../components/VisualFeedback";
import {
  KidsEducationalFact,
  ContextualEducationalContent,
} from "../../components/EducationalFact";
import {
  ChildFriendlyError,
  EncouragingMessage,
} from "../../components/ChildFriendlyMessages";

export default function AteneoGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { getOptimizedTouchProps, debounce } = usePerformanceOptimization();
  const touchProps = getOptimizedTouchProps();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  // Analytics tracking
  const { trackLevelStart, trackInteraction } = useAnalytics(username);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameStartTime] = useState(Date.now());

  // Track level start
  useEffect(() => {
    trackLevelStart(2, 1);
  }, [trackLevelStart]);

  const questions = [
    {
      question:
        "In what year did Jose Rizal enroll at Ateneo Municipal de Manila?",
      options: ["1872", "1877", "1882", "1892"],
      correct: 0,
      explanation:
        "Jose Rizal enrolled at Ateneo Municipal de Manila in 1872 at the age of 11. This was the beginning of his formal education in Manila.",
      hint: "Think about when Rizal was around 11 years old. He was born in 1861.",
      funFact:
        "🎓 Rizal was initially placed in the lower section but quickly moved up due to his excellent performance!",
      difficulty: "easy",
    },
    {
      question: "What was Rizal's nickname while studying at Ateneo?",
      options: ["Pepe", "Pingkian", "Dimasalang", "Laong Laan"],
      correct: 0,
      explanation:
        "He was called 'Pepe' by his family and close friends throughout his life. This was a common nickname for José.",
      hint: "This nickname is a common Filipino diminutive for the name José.",
      funFact:
        "👨‍🎓 'Pepe' was not just used at Ateneo - his family called him this his whole life!",
      difficulty: "easy",
    },
    {
      question: "What literary society did Rizal join at Ateneo?",
      options: [
        "Marian Congregation",
        "Sodality of Our Lady",
        "Literary Society",
        "Ateneo Writers Club",
      ],
      correct: 0,
      explanation:
        "Rizal joined the Marian Congregation, a religious and literary society that helped develop his writing skills.",
      hint: "This society was dedicated to the Virgin Mary and focused on both religious and literary activities.",
      funFact:
        "📚 This society helped Rizal develop his love for literature and writing!",
      difficulty: "medium",
    },
    {
      question: "What was Rizal's academic performance like at Ateneo?",
      options: [
        "Average student",
        "Excellent student with highest honors",
        "Good but not outstanding",
        "Struggled with studies",
      ],
      correct: 1,
      explanation:
        "Rizal was an excellent student who graduated with the highest honors (sobresaliente) from Ateneo in 1877.",
      hint: "Rizal was known for being exceptionally bright and dedicated to his studies.",
      funFact:
        "🏆 Rizal received a gold medal for being the best student in his class!",
      difficulty: "medium",
    },
    {
      question: "Which subject did Rizal particularly excel in at Ateneo?",
      options: ["Mathematics", "Literature and Poetry", "Science", "History"],
      correct: 1,
      explanation:
        "Rizal excelled in literature and poetry, winning several literary contests and developing his writing skills that would later make him famous.",
      hint: "Think about what Rizal became most famous for - his novels and writings.",
      funFact:
        "✍️ Rizal's poems at Ateneo showed early signs of his future as a great writer!",
      difficulty: "medium",
    },
  ];

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);
    setAttempts(attempts + 1);
    const correct = answerIndex === questions[currentQuestion].correct;
    setIsCorrect(correct);

    // Track interaction
    trackInteraction(2, 1, "quiz_answer", {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex,
      correct: correct,
      attempts: attempts + 1,
    });

    if (correct) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }

    // Show feedback briefly before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        handleGameComplete();
      }
    }, 2500);
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
    trackInteraction(2, 1, "hint_used", {
      questionIndex: currentQuestion,
      hintsUsed: hintsUsed + 1,
    });
  };

  const handleGameComplete = () => {
    setShowResult(true);
    const timeSpent = Date.now() - gameStartTime;
    const finalScore = Math.round((score / questions.length) * 100);

    // Call completion callback
    if (onComplete) {
      onComplete(finalScore, timeSpent);
    }
  };

  const handleBackToChapter = () => {
    navigationHelper.goToChapter(2);
  };

  const handleComplete = () => {
    // In a real app, you would save progress here
    navigate("/chapter/2");
  };

  const chapterTheme = getChapterTheme(2);
  const celebrationTheme = getCelebrationTheme("completion");

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-25 animate-float"></div>
          </div>

          <ResponsiveContainer className="relative z-10 py-8">
            {/* Header */}
            <GameHeader
              title="Ateneo Municipal"
              subtitle="Chapter 2 - Level 1"
              onBack={handleBackToChapter}
              onLogout={onLogout}
              theme={chapterTheme}
            />

            {/* Completion Card */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-orange-200">
                {/* Celebration Animation */}
                {showCelebration && (
                  <NewCelebrationAnimation
                    type="completion"
                    duration={2000}
                    onComplete={() => setShowCelebration(false)}
                  />
                )}

                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-4xl text-white">🎓</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">
                    Ateneo Quiz Complete!
                  </h2>
                  <p className="text-lg text-gray-600">
                    You've learned about Rizal's school years!
                  </p>
                </div>

                {/* Score Display */}
                <div className="text-center mb-8">
                  <div className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border-2 border-orange-200">
                    <p className="text-sm text-black mb-2">Your Score</p>
                    <p className="text-5xl font-black text-orange-600 mb-2">
                      {finalScore}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {score} out of {questions.length} correct
                    </p>
                  </div>
                </div>

                {/* Encouraging Message */}
                <div className="text-center mb-8">
                  <EncouragingMessage
                    score={finalScore}
                    attempts={attempts}
                    hintsUsed={hintsUsed}
                    context="ateneo_quiz"
                  />
                </div>

                {/* Educational Fact */}
                <div className="mb-8">
                  <KidsEducationalFact
                    fact="🎓 Did you know? Rizal was such a good student at Ateneo that he received a gold medal and graduated with the highest honors! He was only 16 years old when he finished his studies there."
                    title="Amazing Fact about Rizal's Education!"
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
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-25 animate-float"></div>
        </div>

        <ResponsiveContainer className="relative z-10 py-8">
          {/* Header */}
          <GameHeader
            title="Ateneo Municipal"
            subtitle="Chapter 2 - Level 1"
            onBack={handleBackToChapter}
            onLogout={onLogout}
            theme={chapterTheme}
          />

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <ProgressBar
              current={currentQuestion + 1}
              total={questions.length}
              label={`Question ${currentQuestion + 1} of ${questions.length}`}
              theme={chapterTheme}
            />
          </div>

          {/* Main Game Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-orange-200">
              {/* Celebration Animation */}
              {showCelebration && (
                <NewCelebrationAnimation
                  type="success"
                  duration={1000}
                  onComplete={() => setShowCelebration(false)}
                />
              )}

              {/* Question Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🎓</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 leading-relaxed">
                  {questions[currentQuestion].question}
                </h3>

                {/* Difficulty Indicator */}
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    questions[currentQuestion].difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : questions[currentQuestion].difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {questions[currentQuestion].difficulty.toUpperCase()}
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => {
                  let buttonStyle =
                    "group w-full text-left p-5 rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 ";

                  if (selectedAnswer !== null) {
                    if (index === questions[currentQuestion].correct) {
                      buttonStyle +=
                        "bg-green-100 border-green-400 text-green-800 shadow-lg";
                    } else if (index === selectedAnswer && !isCorrect) {
                      buttonStyle +=
                        "bg-red-100 border-red-400 text-red-800 shadow-lg";
                    } else {
                      buttonStyle += "bg-gray-100 border-gray-300 text-black";
                    }
                  } else {
                    buttonStyle +=
                      "bg-white border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-gray-800 shadow-md hover:shadow-xl";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={buttonStyle}
                      {...touchProps}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            selectedAnswer !== null &&
                            index === questions[currentQuestion].correct
                              ? "bg-green-500 text-white"
                              : selectedAnswer !== null &&
                                index === selectedAnswer &&
                                !isCorrect
                              ? "bg-red-500 text-white"
                              : "bg-orange-200 text-orange-800 group-hover:bg-orange-300"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium text-lg text-black">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hint Button */}
              {!showHint && selectedAnswer === null && (
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
              {showHint && selectedAnswer === null && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-bold text-blue-800 mb-1">Hint:</p>
                      <p className="text-blue-700">
                        {questions[currentQuestion].hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Display */}
              {selectedAnswer !== null && (
                <div
                  className={`p-6 rounded-2xl border-4 ${
                    isCorrect
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-red-50 border-red-300 text-red-800"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{isCorrect ? "🎉" : "🤔"}</span>
                    <div>
                      <p className="font-black text-xl mb-2">
                        {isCorrect ? "Excellent!" : "Not quite right!"}
                      </p>
                      <p className="font-medium mb-3">
                        {questions[currentQuestion].explanation}
                      </p>
                      <div className="bg-white/50 p-3 rounded-xl">
                        <p className="text-sm font-medium">
                          {questions[currentQuestion].funFact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Score Display */}
              <div className="flex justify-between items-center pt-6 border-t-2 border-orange-200 mt-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-orange-800 font-bold">
                      Score: {score}/{questions.length}
                    </span>
                  </div>
                  {hintsUsed > 0 && (
                    <div className="bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-blue-700 text-sm">
                        💡 {hintsUsed} hints used
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBackToChapter}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                  {...touchProps}
                >
                  Exit Quiz
                </button>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </ErrorBoundary>
  );
}
