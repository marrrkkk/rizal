import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RizalMonumentsGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate();
  const [currentMonument, setCurrentMonument] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const monuments = [
    {
      name: "Rizal Monument, Luneta Park",
      location: "Manila, Philippines",
      image: "🏛️",
      question: "What is special about the Rizal Monument in Luneta Park?",
      options: [
        "It marks the exact spot where Rizal was executed",
        "It's the tallest monument in the Philippines",
        "It was built by Spanish colonizers",
        "It's made entirely of gold",
      ],
      correct: 0,
      fact: "The Rizal Monument in Luneta Park stands at the exact spot where José Rizal was executed on December 30, 1896. It serves as his final resting place and is a symbol of Filipino nationalism.",
    },
    {
      name: "Rizal Monument, Madrid",
      location: "Madrid, Spain",
      image: "🇪🇸",
      question: "Why is there a Rizal monument in Madrid, Spain?",
      options: [
        "To honor his studies and writings there",
        "Spain conquered the Philippines",
        "It was built by accident",
        "Rizal was born in Spain",
      ],
      correct: 0,
      fact: "The Rizal monument in Madrid honors his time studying medicine there and writing his famous novels. It represents the reconciliation between Spain and the Philippines.",
    },
    {
      name: "Rizal Monument, Wilhelmsfeld",
      location: "Germany",
      image: "🇩🇪",
      question: "What did Rizal do in Wilhelmsfeld, Germany?",
      options: [
        "Studied ophthalmology and wrote parts of Noli Me Tangere",
        "Learned to speak German only",
        "Built a hospital",
        "Started a revolution",
      ],
      correct: 0,
      fact: "In Wilhelmsfeld, Germany, Rizal studied ophthalmology and wrote significant portions of his novel 'Noli Me Tangere.' The monument commemorates his intellectual development there.",
    },
    {
      name: "Rizal Shrine, Calamba",
      location: "Laguna, Philippines",
      image: "🏠",
      question: "What makes the Rizal Shrine in Calamba significant?",
      options: [
        "It's built on his childhood home's original site",
        "It's the largest shrine in Asia",
        "It contains his treasure",
        "It's where he wrote his last poem",
      ],
      correct: 0,
      fact: "The Rizal Shrine in Calamba is built on the original site of Rizal's childhood home. It showcases his early life and the influences that shaped the future national hero.",
    },
    {
      name: "Rizal Monument, Dapitan",
      location: "Zamboanga del Norte, Philippines",
      image: "🏝️",
      question: "What does the Rizal Monument in Dapitan commemorate?",
      options: [
        "His four years of exile and community service",
        "His escape from prison",
        "His wedding ceremony",
        "His first novel publication",
      ],
      correct: 0,
      fact: "The Dapitan monument commemorates Rizal's four years of exile (1892-1896) where he served as a doctor, teacher, and community leader, showing his dedication to helping others even in exile.",
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

  const handleNextMonument = () => {
    if (selectedAnswer === monuments[currentMonument].correct) {
      setScore(score + 20);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentMonument < monuments.length - 1) {
        setCurrentMonument(currentMonument + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore =
          selectedAnswer === monuments[currentMonument].correct
            ? score + 20
            : score;
        onComplete(finalScore, timeSpent);
      }
    }, 3000);
  };

  const handleBackToChapter = () => {
    navigate("/chapter/6");
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center border-4 border-purple-200">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-6xl">🗿</span>
          </div>
          <h2 className="text-4xl font-black text-black mb-4">
            World Tour Complete!
          </h2>
          <p className="text-xl text-black mb-6">
            You've explored Rizal monuments around the globe!
          </p>
          <div className="bg-purple-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <div className="text-3xl font-black text-purple-600 mb-2">
              {score}%
            </div>
            <div className="text-black font-medium">Final Score</div>
          </div>
          <button
            onClick={handleBackToChapter}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Chapter 6 🌍
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-purple-400">
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
                Rizal Monuments Worldwide
              </h1>
              <p className="text-sm text-black">Chapter 6 • Level 3</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 px-4 py-2 rounded-full">
              <span className="font-bold text-purple-800">Score: {score}%</span>
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
        <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full p-8 border-4 border-purple-200">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Monument {currentMonument + 1} of {monuments.length}
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Math.round(((currentMonument + 1) / monuments.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentMonument + 1) / monuments.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Monument Info */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">
                {monuments[currentMonument].image}
              </span>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              {monuments[currentMonument].name}
            </h2>
            <p className="text-lg text-purple-600 font-semibold mb-6">
              📍 {monuments[currentMonument].location}
            </p>
            <h3 className="text-xl font-bold text-black mb-4">
              {monuments[currentMonument].question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {monuments[currentMonument].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${
                  showResult
                    ? index === monuments[currentMonument].correct
                      ? "bg-green-100 border-green-400 text-green-800"
                      : index === selectedAnswer
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                    : selectedAnswer === index
                    ? "bg-purple-100 border-purple-400 text-purple-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-purple-50 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      showResult
                        ? index === monuments[currentMonument].correct
                          ? "bg-green-500 text-white"
                          : index === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-gray-600"
                        : selectedAnswer === index
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Monument Fact:</h3>
              <p className="text-blue-700">{monuments[currentMonument].fact}</p>
            </div>
          )}

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextMonument}
              disabled={selectedAnswer === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedAnswer !== null
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentMonument === monuments.length - 1
                ? "Complete Tour"
                : "Next Monument"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
