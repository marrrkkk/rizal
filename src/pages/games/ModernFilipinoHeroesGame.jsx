import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModernFilipinoHeroesGame({
  username,
  onLogout,
  onComplete,
}) {
  const navigate = useNavigate();
  const [currentHero, setCurrentHero] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const heroes = [
    {
      name: "Gina Lopez",
      field: "Environmental Protection",
      image: "🌱",
      rizalConnection: "Education and Reform",
      achievements: [
        "Led environmental rehabilitation programs",
        "Fought against destructive mining",
        "Promoted sustainable development",
        "Educated communities about environmental protection",
      ],
      correct: 2,
      explanation:
        "Like Rizal who advocated for reforms through education, Gina Lopez used education and advocacy to protect the Philippines' environment and promote sustainable development.",
    },
    {
      name: "Efren Peñaflorida",
      field: "Education",
      image: "📚",
      rizalConnection: "Education as Liberation",
      achievements: [
        "Created the Dynamic Teen Company",
        "Brought education to street children through pushcart classrooms",
        "Won CNN Hero of the Year 2009",
        "Promoted youth leadership and community service",
      ],
      correct: 1,
      explanation:
        "Efren Peñaflorida embodies Rizal's belief that education is the key to liberation. He brought learning directly to underprivileged children, just as Rizal advocated for accessible education for all Filipinos.",
    },
    {
      name: "Leila de Lima",
      field: "Human Rights",
      image: "⚖️",
      rizalConnection: "Fighting Injustice",
      achievements: [
        "Served as Commission on Human Rights Chairperson",
        "Investigated extrajudicial killings",
        "Advocated for victims' rights",
        "Stood up against human rights violations",
      ],
      correct: 0,
      explanation:
        "Like Rizal who exposed the injustices of his time through his writings, Leila de Lima fought against human rights violations and stood up for the oppressed, even at personal cost.",
    },
    {
      name: "Manny Pacquiao",
      field: "Sports and Philanthropy",
      image: "🥊",
      rizalConnection: "National Pride and Service",
      achievements: [
        "Became world boxing champion",
        "Brought honor to the Philippines globally",
        "Engaged in public service and politics",
        "Helped poor communities through charity work",
      ],
      correct: 3,
      explanation:
        "Manny Pacquiao, like Rizal, brought pride to the Filipino people on the world stage and used his influence to serve his countrymen through public service and charitable works.",
    },
    {
      name: "Maria Ressa",
      field: "Journalism and Press Freedom",
      image: "📰",
      rizalConnection: "Truth and Free Expression",
      achievements: [
        "Founded Rappler news website",
        "Won Nobel Peace Prize 2021",
        "Defended press freedom and democracy",
        "Exposed disinformation and fake news",
      ],
      correct: 0,
      explanation:
        "Maria Ressa continues Rizal's legacy of using the written word to expose truth and fight for freedom. Like Rizal's novels that revealed colonial abuses, her journalism exposes threats to democracy.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMatchSelect = (matchIndex) => {
    setSelectedMatch(matchIndex);
  };

  const handleNextHero = () => {
    if (selectedMatch === heroes[currentHero].correct) {
      setScore(score + 20);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentHero < heroes.length - 1) {
        setCurrentHero(currentHero + 1);
        setSelectedMatch(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore =
          selectedMatch === heroes[currentHero].correct ? score + 20 : score;
        onComplete(finalScore, timeSpent);
      }
    }, 4000);
  };

  const handleBackToChapter = () => {
    navigate("/chapter/6");
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center border-4 border-orange-200">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-6xl">🦸</span>
          </div>
          <h2 className="text-4xl font-black text-black mb-4">
            Heroes Recognized!
          </h2>
          <p className="text-xl text-black mb-6">
            You've learned about modern Filipinos following Rizal's example!
          </p>
          <div className="bg-orange-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
            <div className="text-3xl font-black text-orange-600 mb-2">
              {score}%
            </div>
            <div className="text-black font-medium">Final Score</div>
          </div>
          <button
            onClick={handleBackToChapter}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Continue to Chapter 6 🌟
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-orange-400">
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
                Modern Filipino Heroes
              </h1>
              <p className="text-sm text-black">Chapter 6 • Level 4</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-orange-100 px-4 py-2 rounded-full">
              <span className="font-bold text-orange-800">Score: {score}%</span>
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
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full p-8 border-4 border-orange-200">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Hero {currentHero + 1} of {heroes.length}
              </span>
              <span className="text-sm font-bold text-orange-600">
                {Math.round(((currentHero + 1) / heroes.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentHero + 1) / heroes.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Hero Profile */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">{heroes[currentHero].image}</span>
            </div>
            <h2 className="text-3xl font-black text-black mb-2">
              {heroes[currentHero].name}
            </h2>
            <p className="text-lg text-orange-600 font-semibold mb-6">
              {heroes[currentHero].field}
            </p>
            <h3 className="text-xl font-bold text-black mb-6">
              Match this hero's achievements with Rizal's values:
            </h3>
          </div>

          {/* Achievements List */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-gray-200">
            <h4 className="font-bold text-black mb-4">Key Achievements:</h4>
            <ul className="space-y-2">
              {heroes[currentHero].achievements.map((achievement, index) => (
                <li key={index} className="flex items-center text-black">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          {/* Matching Options */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-black mb-4 text-center">
              Which Rizal value does this hero best represent?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Fighting Injustice and Oppression",
                "Education as the Key to Liberation",
                "Peaceful Reform and Environmental Care",
                "National Pride and Public Service",
              ].map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleMatchSelect(index)}
                  disabled={showResult}
                  className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${
                    showResult
                      ? index === heroes[currentHero].correct
                        ? "bg-green-100 border-green-400 text-green-800"
                        : index === selectedMatch
                        ? "bg-red-100 border-red-400 text-red-800"
                        : "bg-gray-100 border-gray-300 text-black"
                      : selectedMatch === index
                      ? "bg-orange-100 border-orange-400 text-orange-800"
                      : "bg-gray-50 border-gray-200 text-black hover:bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                        showResult
                          ? index === heroes[currentHero].correct
                            ? "bg-green-500 text-white"
                            : index === selectedMatch
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-black"
                          : selectedMatch === index
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg text-black">{value}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">
                Connection to Rizal:
              </h3>
              <p className="text-blue-700">{heroes[currentHero].explanation}</p>
            </div>
          )}

          {/* Next Button */}
          <div className="text-center">
            <button
              onClick={handleNextHero}
              disabled={selectedMatch === null}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                selectedMatch !== null
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                  : "bg-gray-300 text-black cursor-not-allowed"
              }`}
            >
              {currentHero === heroes.length - 1
                ? "Complete Level"
                : "Next Hero"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
