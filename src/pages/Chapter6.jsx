import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chapter6({ username, onLogout }) {
  const navigate = useNavigate();
  const [completedLevels, setCompletedLevels] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load completed levels from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`chapter6_progress_${username}`);
    if (savedProgress) {
      setCompletedLevels(JSON.parse(savedProgress));
    }
    setIsLoading(false);
  }, [username]);

  const levels = [
    {
      id: 1,
      title: "Rizal's Global Impact",
      description:
        "Explore how José Rizal's legacy continues to inspire people around the world today",
      path: "/chapter/6/level/1",
      icon: "🌍",
      color: "from-emerald-400 to-green-500",
    },
    {
      id: 2,
      title: "Rizal in the Digital Age",
      description:
        "Discover how Rizal's ideas apply to modern technology and social media",
      path: "/chapter/6/level/2",
      icon: "💻",
      color: "from-cyan-400 to-blue-500",
    },
    {
      id: 3,
      title: "Rizal Monuments Worldwide",
      description:
        "Take a virtual tour of Rizal monuments and memorials around the globe",
      path: "/chapter/6/level/3",
      icon: "🗿",
      color: "from-purple-400 to-indigo-500",
    },
    {
      id: 4,
      title: "Modern Filipino Heroes",
      description:
        "Learn about contemporary Filipinos who follow Rizal's example",
      path: "/chapter/6/level/4",
      icon: "🦸",
      color: "from-orange-400 to-red-500",
    },
    {
      id: 5,
      title: "Rizal's Eternal Legacy",
      description:
        "Understand how Rizal's teachings remain relevant in today's world",
      path: "/chapter/6/level/5",
      icon: "⭐",
      color: "from-pink-400 to-rose-500",
    },
  ];

  const handleLevelClick = (levelId, path) => {
    // Allow access to level 1 or any completed level
    if (levelId === 1 || completedLevels[levelId - 1]) {
      navigate(path);
    } else {
      alert("Please complete the previous levels first!");
    }
  };

  const handleLevelComplete = (levelId) => {
    const updatedLevels = { ...completedLevels, [levelId]: true };
    setCompletedLevels(updatedLevels);
    localStorage.setItem(
      `chapter6_progress_${username}`,
      JSON.stringify(updatedLevels)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-100 via-pink-100 to-rose-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-red-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-rose-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-orange-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-red-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">6</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-black">
                  Exile and Legacy
                </h1>
                <p className="text-sm text-black font-medium">
                  5 lessons • Chapter 6
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg border-b-2 border-red-700 active:border-b-0"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Duolingo-style Chapter Hero */}
        <div className="text-center mb-12 relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <div className="text-white text-6xl">⭐</div>
              </div>
              {/* Floating elements around mascot */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                Final chapter!
              </div>
              <div className="absolute -bottom-1 -left-1 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                🌟
              </div>
            </div>
            <h2 className="text-4xl font-black text-black mb-4">
              Exile and Legacy
            </h2>
            <p className="text-lg text-black font-medium max-w-2xl mx-auto mb-6">
              Discover Rizal's final years, his lasting legacy, and how his
              influence continues to inspire the world today
            </p>

            {/* Progress indicator */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black">Chapter Progress</span>
                <span className="text-red-600 font-bold text-sm">
                  {Object.keys(completedLevels).length}/5 complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (Object.keys(completedLevels).length / levels.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Duolingo-style Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
          {levels.map((level, index) => {
            const isUnlocked = level.id === 1 || completedLevels[level.id - 1];
            const isCompleted = completedLevels[level.id];

            return (
              <div
                key={level.id}
                className={`group relative bg-white rounded-3xl shadow-lg transition-all duration-300 transform cursor-pointer border-4 border-white/50 overflow-hidden ${
                  isUnlocked
                    ? "hover:shadow-2xl hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() =>
                  isUnlocked && handleLevelClick(level.id, level.path)
                }
              >
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                        : isUnlocked
                        ? "w-1/2 bg-gradient-to-r from-red-400 to-pink-500"
                        : "w-0 bg-gray-300"
                    }`}
                  ></div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm">
                    {isCompleted ? "✅" : isUnlocked ? "🔓" : "🔒"}
                  </span>
                </div>

                <div className="p-6">
                  {/* Level icon with Duolingo-style design */}
                  <div className="relative mb-4">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${
                        level.color
                      } rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${
                        isUnlocked ? "group-hover:scale-110" : ""
                      } transition-transform duration-300`}
                    >
                      <span className="text-3xl">{level.icon}</span>
                    </div>
                    {/* Completion stars */}
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </div>

                  {/* Level info */}
                  <div className="text-center">
                    <h3
                      className={`text-xl font-black mb-2 transition-colors ${
                        isUnlocked
                          ? "text-black group-hover:text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {level.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 leading-relaxed ${
                        isUnlocked ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {level.description}
                    </p>

                    {/* Status badge */}
                    <div className="mb-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide ${
                          isCompleted
                            ? "text-green-600"
                            : isUnlocked
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {isCompleted
                          ? "Complete"
                          : isUnlocked
                          ? "Ready"
                          : "Locked"}
                      </span>
                    </div>

                    {/* Action button */}
                    <button
                      className={`w-full font-black py-3 px-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-2 uppercase tracking-wide text-sm ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 hover:shadow-lg"
                          : isUnlocked
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white border-pink-700 hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isUnlocked}
                    >
                      {isCompleted
                        ? "Play Again"
                        : isUnlocked
                        ? "Start"
                        : "Locked"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
