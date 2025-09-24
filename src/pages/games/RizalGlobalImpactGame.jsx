import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RizalGlobalImpactGame({
  username,
  onLogout,
  onComplete,
}) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const questions = [
    {
      question:
        "In which country can you find the Rizal Monument in Wilhelmsfeld?",
      options: ["Germany", "Spain", "France", "Italy"],
      correct: 0,
      explanation:
        "The Rizal Monument in Wilhelmsfeld, Germany, commemorates Rizal's time studying there.",
    },
    {
      question:
        "What modern movement does Rizal's advocacy for education most closely align with?",
      options: [
        "Digital literacy campaigns",
        "Environmental protection",
        "Space exploration",
        "Fashion trends",
      ],
      correct: 0,
      explanation:
        "Rizal's emphasis on education as a tool for liberation aligns with modern digital literacy movements.",
    },
    {
      question:
        "Which Filipino value that Rizal embodied is most relevant in today's global community?",
      options: [
        "Pakikipagkapwa (shared identity)",
        "Utang na loob (debt of gratitude)",
        "Hiya (shame)",
        "Amor propio (self-esteem)",
      ],
      correct: 0,
      explanation:
        "Pakikipagkapwa, or shared identity with others, is crucial in our interconnected global world.",
    },
    {
      question:
        "How do modern Filipino overseas workers (OFWs) continue Rizal's legacy?",
      options: [
        "By representing Filipino values abroad",
        "By sending money home only",
        "By avoiding local cultures",
        "By staying permanently overseas",
      ],
      correct: 0,
      explanation:
        "OFWs continue Rizal's legacy by being cultural ambassadors and representing Filipino values worldwide.",
    },
    {
      question:
        "What aspect of Rizal's character is most needed in today's social media age?",
      options: [
        "Critical thinking and fact-checking",
        "Posting frequently",
        "Having many followers",
        "Using trending hashtags",
      ],
      correct: 0,
      explanation:
        "Rizal's emphasis on critical thinking and seeking truth is essential in combating misinformation today.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 20);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore =
          selectedAnswer === questions[currentQuestion].correct
            ? score + 20
            : score;
        onComplete(finalScore, timeSpent);
      }
    }, 2000);
  };

  const handleBackToChapter = () => {
    navigate("/chapter/6");
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center border-4 border-emerald-200">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-6xl">🌍</span>
          </div>
          <h2 className="text-4xl font-black text-black mb-4">
            Global Impact Mastered!
          </h2>
          <p className="text-xl text-black mb-6">
            You've learned how Rizal's legacy continues to inspire the world!
          </p>
          <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
            <div className="text-3xl font-black text-emerald-600 mb-2">
              {score}%
            </div>
            <div className="text-black font-medium">Final Score</div>
          </div>
          <button
            onClick={handleBackToChapter}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Chapter 6 🌟
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-emerald-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToChapter}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
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
            <div>
              <h1 className="text-2xl font-black text-black">
                Rizal's Global Impact
              </h1>
              <p className="text-sm text-black">Chapter 6 • Level 1</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 px-4 py-2 rounded-full">
              <span className="font-bold text-emerald-800">
                Score: {score}%
              </span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Game */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full p-8 border-4 border-emerald-200">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">🌍</span>
            </div>
            <h2 className="text-2xl font-black text-black mb-4">
              {questions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${
                  showResult
                    ? index === questions[currentQuestion].correct
                      ? "bg-green-100 border-green-400 text-green-800"
                      : index === selectedAnswer
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-black"
                    : selectedAnswer === index
                    ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-emerald-50 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      showResult
                        ? index === questions[currentQuestion].correct
                          ? "bg-green-500 text-white"
                          : index === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                        : selectedAnswer === index
                        ? "bg-emerald-500 text-white"
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

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Did you know?</h3>
              <p className="text-blue-700">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedAnswer !== null
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-black cursor-not-allowed"
              }`}
            >
              {currentQuestion === questions.length - 1
                ? "Complete Level"
                : "Next Question"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
