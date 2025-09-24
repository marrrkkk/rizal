import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RizalEternalLegacyGame({
  username,
  onLogout,
  onComplete,
}) {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const challenges = [
    {
      title: "Climate Change Crisis",
      description:
        "The Philippines faces rising sea levels and extreme weather. How would Rizal approach this modern challenge?",
      image: "🌊",
      solutions: [
        "Educate communities about environmental protection and sustainable practices",
        "Ignore the problem and focus on other issues",
        "Wait for other countries to solve it first",
        "Only focus on economic development",
      ],
      correct: 0,
      rizalWisdom:
        "Rizal believed in education and taking responsibility for one's community. He would educate people about environmental protection and lead by example in sustainable practices, just as he did in Dapitan.",
      modernApplication:
        "Today, we can follow Rizal's example by learning about climate science, teaching others, and implementing sustainable practices in our communities.",
    },
    {
      title: "Digital Misinformation",
      description:
        "False information spreads rapidly online, dividing communities. What would be Rizal's approach?",
      image: "📱",
      solutions: [
        "Promote critical thinking and fact-checking education",
        "Spread counter-rumors without verification",
        "Avoid all social media completely",
        "Only trust information from friends",
      ],
      correct: 0,
      rizalWisdom:
        "Rizal valued truth and education above all. His novels exposed lies and revealed truth. He would promote critical thinking and encourage people to seek reliable sources.",
      modernApplication:
        "We can honor Rizal by fact-checking before sharing, promoting media literacy, and creating educational content that counters misinformation with verified facts.",
    },
    {
      title: "Social Inequality",
      description:
        "The gap between rich and poor continues to widen. How would Rizal address this persistent issue?",
      image: "⚖️",
      solutions: [
        "Advocate for equal access to quality education and opportunities",
        "Accept that inequality is natural and unchangeable",
        "Focus only on helping the wealthy",
        "Promote division between social classes",
      ],
      correct: 0,
      rizalWisdom:
        "Rizal believed education was the great equalizer. He advocated for reforms that would give all Filipinos, regardless of class, access to education and opportunities for advancement.",
      modernApplication:
        "Today, we can support educational programs, mentorship initiatives, and policies that provide equal opportunities for all, especially marginalized communities.",
    },
    {
      title: "Overseas Filipino Workers (OFW) Challenges",
      description:
        "Millions of Filipinos work abroad, facing discrimination and family separation. What would Rizal's guidance be?",
      image: "✈️",
      solutions: [
        "Maintain Filipino identity while respecting other cultures, and work for better conditions",
        "Completely abandon Filipino culture to fit in",
        "Avoid interacting with local communities",
        "Focus only on earning money without regard for dignity",
      ],
      correct: 0,
      rizalWisdom:
        "Rizal traveled extensively but never forgot his Filipino identity. He respected other cultures while proudly representing the Philippines and working for his countrymen's welfare.",
      modernApplication:
        "OFWs can follow Rizal's example by being cultural ambassadors, maintaining their Filipino values, building bridges with other communities, and advocating for fair treatment.",
    },
    {
      title: "Youth Engagement in Nation-Building",
      description:
        "Many young Filipinos feel disconnected from civic duties. How would Rizal inspire youth participation?",
      image: "🌟",
      solutions: [
        "Show how small actions can create big changes and make civic engagement meaningful",
        "Force young people to participate through punishment",
        "Tell them their opinions don't matter until they're older",
        "Focus only on entertainment and avoid serious topics",
      ],
      correct: 0,
      rizalWisdom:
        "Rizal was young when he started making a difference. He believed in the power of youth and showed that age doesn't limit one's ability to contribute to society.",
      modernApplication:
        "We can engage youth by showing them how their skills and passions can address real problems, providing platforms for their voices, and demonstrating that their contributions matter now, not just in the future.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSolutionSelect = (solutionIndex) => {
    setSelectedSolution(solutionIndex);
  };

  const handleNextChallenge = () => {
    if (selectedSolution === challenges[currentChallenge].correct) {
      setScore(score + 20);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedSolution(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore =
          selectedSolution === challenges[currentChallenge].correct
            ? score + 20
            : score;
        onComplete(finalScore, timeSpent);
      }
    }, 5000);
  };

  const handleBackToChapter = () => {
    navigate("/chapter/6");
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-3xl mx-auto text-center border-4 border-pink-200">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-6xl">⭐</span>
          </div>
          <h2 className="text-4xl font-black text-black mb-4">
            Legacy Master!
          </h2>
          <p className="text-xl text-black mb-6">
            You've learned to apply Rizal's eternal wisdom to modern challenges!
          </p>
          <div className="bg-pink-50 rounded-2xl p-6 mb-6 border-2 border-pink-200">
            <div className="text-3xl font-black text-pink-600 mb-2">
              {score}%
            </div>
            <div className="text-black font-medium">Final Score</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-yellow-200">
            <h3 className="text-xl font-black text-black mb-3">
              🎉 Chapter 6 Complete!
            </h3>
            <p className="text-black font-medium">
              You've completed your journey through Rizal's life and legacy. His
              teachings continue to guide us in building a better Philippines
              and world!
            </p>
          </div>
          <button
            onClick={handleBackToChapter}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Return to Chapter 6 🏆
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-pink-400">
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
                Rizal's Eternal Legacy
              </h1>
              <p className="text-sm text-black">Chapter 6 • Level 5</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-pink-100 px-4 py-2 rounded-full">
              <span className="font-bold text-pink-800">Score: {score}%</span>
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
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full p-8 border-4 border-pink-200">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Challenge {currentChallenge + 1} of {challenges.length}
              </span>
              <span className="text-sm font-bold text-pink-600">
                {Math.round(((currentChallenge + 1) / challenges.length) * 100)}
                % Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentChallenge + 1) / challenges.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Challenge */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">
                {challenges[currentChallenge].image}
              </span>
            </div>
            <h2 className="text-3xl font-black text-black mb-4">
              {challenges[currentChallenge].title}
            </h2>
            <p className="text-lg text-black mb-6 leading-relaxed max-w-3xl mx-auto">
              {challenges[currentChallenge].description}
            </p>
          </div>

          {/* Solution Options */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {challenges[currentChallenge].solutions.map((solution, index) => (
              <button
                key={index}
                onClick={() => handleSolutionSelect(index)}
                disabled={showResult}
                className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${
                  showResult
                    ? index === challenges[currentChallenge].correct
                      ? "bg-green-100 border-green-400 text-green-800"
                      : index === selectedSolution
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-black"
                    : selectedSolution === index
                    ? "bg-pink-100 border-pink-400 text-pink-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-pink-50 hover:border-pink-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      showResult
                        ? index === challenges[currentChallenge].correct
                          ? "bg-green-500 text-white"
                          : index === selectedSolution
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                        : selectedSolution === index
                        ? "bg-pink-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg text-black">{solution}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">
                  Rizal's Wisdom:
                </h3>
                <p className="text-blue-700">
                  {challenges[currentChallenge].rizalWisdom}
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="font-bold text-green-800 mb-2">
                  Modern Application:
                </h3>
                <p className="text-green-700">
                  {challenges[currentChallenge].modernApplication}
                </p>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextChallenge}
              disabled={selectedSolution === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedSolution !== null
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-black cursor-not-allowed"
              }`}
            >
              {currentChallenge === challenges.length - 1
                ? "Complete Journey"
                : "Next Challenge"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
