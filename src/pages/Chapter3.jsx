import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chapter3({ username, onLogout }) {
  const navigate = useNavigate();
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Start with first level unlocked
  const [completedLevels, setCompletedLevels] = useState([]);

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("chapter3Progress");
    if (savedProgress) {
      const { unlocked, completed } = JSON.parse(savedProgress);
      setUnlockedLevels(unlocked);
      setCompletedLevels(completed);
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    const progress = {
      unlocked: unlockedLevels,
      completed: completedLevels,
    };
    localStorage.setItem("chapter3Progress", JSON.stringify(progress));
  }, [unlockedLevels, completedLevels]);

  const levels = [
    {
      id: 1,
      title: "European Journey",
      description: "Follow Rizal's travels across Europe",
      path: "/chapter/3/level/1",
    },
    {
      id: 2,
      title: "Literary Crossroads",
      description: "Solve the crossword about Rizal's works",
      path: "/chapter/3/level/2",
    },
    {
      id: 3,
      title: "Letters Abroad",
      description: "Match Rizal's correspondences with their recipients",
      path: "/chapter/3/level/3",
    },
    {
      id: 4,
      title: "European Quiz",
      description: "Test your knowledge of Rizal's time in Europe",
      path: "/chapter/3/level/4",
    },
    {
      id: 5,
      title: "Travel Map",
      description: "Trace Rizal's journey across Europe",
      path: "/chapter/3/level/5",
    },
  ];

  const handleLevelComplete = (levelId) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);

      // Unlock next level if not already unlocked
      const nextLevel = levelId + 1;
      if (nextLevel <= levels.length && !unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels([...unlockedLevels, nextLevel]);
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-teal-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-emerald-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-green-400">
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800">
                  Studies Abroad
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  5 lessons • Chapter 3
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
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
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <div className="text-white text-6xl">✈️</div>
              </div>
              {/* Floating elements around mascot */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                Adventure!
              </div>
              <div className="absolute -bottom-1 -left-1 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                🌍
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-4">
              Studies Abroad
            </h2>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-6">
              Explore Rizal's journey through Europe, where he pursued higher
              education and wrote his famous novels
            </p>

            {/* Progress indicator */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">
                  Chapter Progress
                </span>
                <span className="text-green-600 font-bold text-sm">
                  {completedLevels.length}/5 complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedLevels.length / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Duolingo-style Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
          {levels.map((level, index) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isCompleted = completedLevels.includes(level.id);

            return (
              <div
                key={level.id}
                className={`group relative bg-white rounded-3xl shadow-lg transition-all duration-300 transform cursor-pointer border-4 border-white/50 overflow-hidden ${
                  isUnlocked
                    ? "hover:shadow-2xl hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => isUnlocked && navigate(level.path)}
              >
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                        : isUnlocked
                        ? "w-1/2 bg-gradient-to-r from-green-400 to-emerald-500"
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
                      className={`w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${
                        isUnlocked ? "group-hover:scale-110" : ""
                      } transition-transform duration-300`}
                    >
                      <span className="text-white font-black text-2xl">
                        {level.id}
                      </span>
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
                          ? "text-gray-800 group-hover:text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {level.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 leading-relaxed ${
                        isUnlocked ? "text-gray-600" : "text-gray-400"
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
                            ? "text-emerald-600"
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
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-emerald-700 hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isUnlocked}
                    >
                      {isCompleted ? "Review" : isUnlocked ? "Start" : "Locked"}
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
