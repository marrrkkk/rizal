import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgressAPI } from "../hooks/useProgressAPI";
import { getCurrentUserFromToken } from "../utils/api";
import { createNavigationHelper } from "../utils/navigationHelper";

export default function Chapter3({ username, onLogout }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const [userId, setUserId] = useState(null);

  // Use the unified progress API
  const { progressData, isLevelUnlocked, isLevelCompleted, getChapterProgress, loading } =
    useProgressAPI(username);

  // Get chapter progress
  const chapterProgress = progressData ? getChapterProgress(3) : null;

  useEffect(() => {
    // Get user ID
    const user = getCurrentUserFromToken();
    if (user) {
      setUserId(user.id);
    }
  }, []);

  const levels = [
    {
      id: 1,
      title: "European Journey",
      description: "Follow Rizal's travels across Europe",
      path: "/chapter/3/level/1",
      icon: "✈️",
      color: "from-blue-400 to-sky-600",
    },
    {
      id: 2,
      title: "Literary Crossroads",
      description: "Solve the crossword about Rizal's works",
      path: "/chapter/3/level/2",
      icon: "📝",
      color: "from-purple-400 to-violet-600",
    },
    {
      id: 3,
      title: "Letters Abroad",
      description: "Match Rizal's correspondences with their recipients",
      path: "/chapter/3/level/3",
      icon: "✉️",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 4,
      title: "European Quiz",
      description: "Test your knowledge of Rizal's time in Europe",
      path: "/chapter/3/level/4",
      icon: "🎓",
      color: "from-emerald-400 to-green-600",
    },
    {
      id: 5,
      title: "Travel Map",
      description: "Trace Rizal's journey across Europe",
      path: "/chapter/3/level/5",
      icon: "🗺️",
      color: "from-rose-400 to-pink-600",
    },
  ];

  const handleLevelClick = async (level) => {
    if (!userId) {
      alert("Please log in to play levels");
      return;
    }

    // Allow all levels to be played
    if (level.path) {
      navigationHelper.goToLevel(3, level.id);
    } else {
      alert(`Level ${level.id}: ${level.title} - Coming Soon!`);
    }
  };

  const handleBackToHome = () => {
    navigationHelper.goHome();
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
              onClick={handleBackToHome}
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
                <h1 className="text-2xl font-black text-black">
                  Studies Abroad
                </h1>
                <p className="text-sm text-black font-medium">
                  5 lessons • Chapter 3
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          </div>
        ) : (
          <>
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
                <h2 className="text-4xl font-black text-black mb-4">
                  Studies Abroad
                </h2>
                <p className="text-lg text-black font-medium max-w-2xl mx-auto mb-6">
                  Explore Rizal's journey through Europe, where he pursued higher
                  education and wrote his famous novels
                </p>

                {/* Progress indicator */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-black">
                      Chapter Progress
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      {chapterProgress
                        ? `${chapterProgress.completedLevels}/${chapterProgress.totalLevels}`
                        : "0/5"}{" "}
                      complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${chapterProgress
                          ? (chapterProgress.completedLevels /
                            chapterProgress.totalLevels) *
                          100
                          : 0
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
                // Use the unified progress API to check unlock status
                const levelUnlocked = isLevelUnlocked(3, level.id);
                const levelCompleted = isLevelCompleted(3, level.id);
                const levelScore = progressData?.chapters?.[3]?.scores?.[level.id] || 0;

                return (
                  <div
                    key={level.id}
                    className={`group relative bg-white rounded-3xl shadow-lg transition-all duration-300 transform cursor-pointer border-4 border-white/50 overflow-hidden ${levelUnlocked
                      ? "hover:shadow-2xl hover:scale-105"
                      : "opacity-60 cursor-not-allowed"
                      }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleLevelClick(level)}
                  >
                    {/* Progress indicator */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                      <div
                        className={`h-full transition-all duration-500 ${levelCompleted
                          ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                          : levelUnlocked
                            ? "w-1/2 bg-gradient-to-r from-green-400 to-emerald-500"
                            : "w-0 bg-gray-300"
                          }`}
                      ></div>
                    </div>

                    {/* Status indicator */}
                    <div
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${levelCompleted
                        ? "bg-green-400"
                        : levelUnlocked
                          ? "bg-emerald-400"
                          : "bg-gray-400"
                        }`}
                    >
                      <span className="text-white text-sm font-bold">
                        {levelCompleted ? "✓" : levelUnlocked ? "▶" : "🔒"}
                      </span>
                    </div>

                    {/* NEW indicator for recently unlocked levels */}
                    {levelUnlocked && !levelCompleted && level.id > 1 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                        NEW!
                      </div>
                    )}

                    <div className="p-6">
                      {/* Level icon with Duolingo-style design */}
                      <div className="relative mb-4">
                        <div
                          className={`w-20 h-20 bg-gradient-to-br ${level.color
                            } rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${levelUnlocked ? "group-hover:scale-110" : ""
                            } transition-transform duration-300`}
                        >
                          <span className="text-3xl">
                            {level.icon}
                          </span>
                        </div>
                        {/* Completion stars */}
                        {levelCompleted && (
                          <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                            <span className="text-xs">⭐</span>
                          </div>
                        )}
                      </div>

                      {/* Level info */}
                      <div className="text-center">
                        <h3
                          className={`text-xl font-black mb-2 transition-colors ${levelUnlocked
                            ? "text-black group-hover:text-black"
                            : "text-black"
                            }`}
                        >
                          {level.title}
                        </h3>
                        <p
                          className={`text-sm mb-4 leading-relaxed ${levelUnlocked ? "text-black" : "text-black"
                            }`}
                        >
                          {level.description}
                        </p>

                        {/* Score display for completed levels */}
                        {levelCompleted && levelScore > 0 && (
                          <div className="mb-4">
                            <div className="inline-block bg-yellow-100 border-2 border-yellow-300 rounded-lg px-3 py-1">
                              <span className="text-sm font-bold text-yellow-800">
                                Score: {levelScore}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Status badge */}
                        <div className="mb-4">
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${levelCompleted
                              ? "text-green-600"
                              : levelUnlocked
                                ? "text-emerald-600"
                                : "text-black"
                              }`}
                          >
                            {levelCompleted
                              ? "Complete"
                              : levelUnlocked
                                ? "Ready"
                                : "Locked"}
                          </span>
                        </div>

                        {/* Action button */}
                        <button
                          className={`w-full font-black py-3 px-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-2 uppercase tracking-wide text-sm ${levelCompleted
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 hover:shadow-lg hover:scale-105"
                            : levelUnlocked
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-emerald-700 hover:shadow-lg hover:scale-105"
                              : "bg-gray-300 text-black border-gray-400 cursor-not-allowed opacity-60"
                            }`}
                          disabled={!levelUnlocked}
                        >
                          {levelCompleted
                            ? "✓ Review"
                            : levelUnlocked
                              ? "▶ Start"
                              : "🔒 Complete Previous Level"}
                        </button>
                      </div>
                    </div>

                    {/* Locked overlay with unlock requirements */}
                    {!levelUnlocked && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-3xl flex items-center justify-center transition-all duration-300">
                        <div className="text-center text-white px-4 transform group-hover:scale-110 transition-transform duration-300">
                          <div className="text-4xl mb-2 drop-shadow-lg">🔒</div>
                          <p className="text-sm font-bold mb-1 drop-shadow-md">Locked</p>
                          <p className="text-xs text-white drop-shadow-sm">
                            {level.id === 1
                              ? "Start here!"
                              : `Complete Level ${level.id - 1} to unlock`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Completion celebration */}
                    {levelCompleted && (
                      <div className="absolute top-2 left-2 animate-bounce">
                        <span className="text-2xl">🎉</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            {/* Chapter Completion Message */}
            {chapterProgress && chapterProgress.isComplete && (
              <div className="mt-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto text-center animate-scale-in">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-3xl font-bold mb-2">Chapter 3 Complete!</h3>
                <p className="text-xl text-green-100 mb-6">
                  Congratulations! You've followed Rizal's journey across Europe!
                </p>
                <div className="bg-white/20 rounded-2xl p-4 inline-block mb-6 backdrop-blur-sm">
                  <span className="text-2xl font-bold">
                    🏆 Global Explorer Badge Earned!
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => navigate("/chapter/4")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors duration-200 shadow-lg flex items-center justify-center gap-2 animate-pulse"
                  >
                    <span>🚀</span> Start Chapter 4
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div >
  );
}
