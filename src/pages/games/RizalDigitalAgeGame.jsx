import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RizalDigitalAgeGame({
  username,
  onLogout,
  onComplete,
}) {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const scenarios = [
    {
      situation:
        "You see fake news about Philippine history being shared on social media. What would Rizal do?",
      image: "📱",
      choices: [
        "Share counter-information with reliable sources",
        "Ignore it completely",
        "Argue aggressively with the poster",
        "Share it without checking",
      ],
      correct: 0,
      explanation:
        "Rizal believed in education and truth. He would counter misinformation with facts and reliable sources, just like how he wrote to educate people about the real situation in the Philippines.",
    },
    {
      situation:
        "A online learning platform asks you to create content about Filipino culture. How do you apply Rizal's approach?",
      image: "💻",
      choices: [
        "Create engaging, accurate content that promotes Filipino pride",
        "Copy content from other sources",
        "Focus only on negative aspects",
        "Make content only for entertainment",
      ],
      correct: 0,
      explanation:
        "Rizal used his writings to showcase Filipino culture and intelligence. He would create original, educational content that builds national pride and identity.",
    },
    {
      situation:
        "You witness cyberbullying of a fellow Filipino online. What's the Rizal-inspired response?",
      image: "🛡️",
      choices: [
        "Defend them respectfully and report the bullying",
        "Join in the bullying",
        "Stay silent and scroll past",
        "Screenshot and share for gossip",
      ],
      correct: 0,
      explanation:
        "Rizal stood up for his fellow Filipinos against injustice. He would defend others with dignity and work to stop the harmful behavior.",
    },
    {
      situation:
        "A viral challenge promotes dangerous behavior. How do you respond using Rizal's wisdom?",
      image: "⚠️",
      choices: [
        "Create educational content about the dangers",
        "Participate to gain followers",
        "Share it without thinking",
        "Criticize participants harshly",
      ],
      correct: 0,
      explanation:
        "Rizal was an educator who cared about people's wellbeing. He would use his platform to educate others about dangers and promote safer alternatives.",
    },
    {
      situation:
        "You have the opportunity to use technology to help your community. What's the most Rizal-like approach?",
      image: "🌟",
      choices: [
        "Create digital solutions for education and community building",
        "Use it only for personal gain",
        "Avoid technology completely",
        "Use it just for entertainment",
      ],
      correct: 0,
      explanation:
        "Rizal always used his talents to serve his community. He would leverage technology to educate, connect, and uplift his fellow Filipinos.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChoiceSelect = (choiceIndex) => {
    setSelectedChoice(choiceIndex);
  };

  const handleNextScenario = () => {
    if (selectedChoice === scenarios[currentScenario].correct) {
      setScore(score + 20);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setSelectedChoice(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore =
          selectedChoice === scenarios[currentScenario].correct
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
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center border-4 border-cyan-200">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-6xl">💻</span>
          </div>
          <h2 className="text-4xl font-black text-black mb-4">
            Digital Wisdom Achieved!
          </h2>
          <p className="text-xl text-black mb-6">
            You've learned to apply Rizal's principles in the digital age!
          </p>
          <div className="bg-cyan-50 rounded-2xl p-6 mb-6 border-2 border-cyan-200">
            <div className="text-3xl font-black text-cyan-600 mb-2">
              {score}%
            </div>
            <div className="text-black font-medium">Final Score</div>
          </div>
          <button
            onClick={handleBackToChapter}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Chapter 6 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-cyan-400">
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
                Rizal in the Digital Age
              </h1>
              <p className="text-sm text-black">Chapter 6 • Level 2</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 px-4 py-2 rounded-full">
              <span className="font-bold text-cyan-800">Score: {score}%</span>
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
        <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full p-8 border-4 border-cyan-200">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Scenario {currentScenario + 1} of {scenarios.length}
              </span>
              <span className="text-sm font-bold text-cyan-600">
                {Math.round(((currentScenario + 1) / scenarios.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentScenario + 1) / scenarios.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Scenario */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">
                {scenarios[currentScenario].image}
              </span>
            </div>
            <h2 className="text-2xl font-black text-black mb-4">
              Digital Dilemma
            </h2>
            <p className="text-lg text-black mb-6 leading-relaxed">
              {scenarios[currentScenario].situation}
            </p>
          </div>

          {/* Choice Options */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {scenarios[currentScenario].choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(index)}
                disabled={showResult}
                className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${
                  showResult
                    ? index === scenarios[currentScenario].correct
                      ? "bg-green-100 border-green-400 text-green-800"
                      : index === selectedChoice
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-black"
                    : selectedChoice === index
                    ? "bg-cyan-100 border-cyan-400 text-cyan-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-cyan-50 hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      showResult
                        ? index === scenarios[currentScenario].correct
                          ? "bg-green-500 text-white"
                          : index === selectedChoice
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                        : selectedChoice === index
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg text-black">{choice}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Rizal's Wisdom:</h3>
              <p className="text-blue-700">
                {scenarios[currentScenario].explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextScenario}
              disabled={selectedChoice === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedChoice !== null
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-black cursor-not-allowed"
              }`}
            >
              {currentScenario === scenarios.length - 1
                ? "Complete Level"
                : "Next Scenario"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
