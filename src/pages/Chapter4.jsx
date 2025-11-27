import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProgressAPI } from "../hooks/useProgressAPI";
import { getCurrentUserFromToken } from "../utils/api";
import { createNavigationHelper } from "../utils/navigationHelper";
import ChapterHeader from "../components/ChapterHeader";

export default function Chapter4({ username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationHelper = createNavigationHelper(navigate);
  const { progressData, getChapterProgress, isLevelUnlocked, isLevelCompleted, loading, refreshProgress } = useProgressAPI();
  const [userId, setUserId] = useState(null);

  // Refresh progress when returning to chapter page
  useEffect(() => {
    if (location.pathname === '/chapter/4' && username) {
      console.log('🔄 Returned to Chapter 4, refreshing progress...');
      refreshProgress();
    }
  }, [location.pathname, username, refreshProgress]);

  // Get chapter progress
  const chapterProgress = progressData ? getChapterProgress(4) : null;

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
      title: "Character Connections",
      description:
        "Match characters with their relationships and roles in the story",
      path: "/chapter/4/level/1",
      icon: "👥",
      color: "from-purple-400 to-indigo-600",
    },
    {
      id: 2,
      title: "Plot Reconstruction",
      description: "Arrange key events in the correct order",
      path: "/chapter/4/level/2",
      icon: "🧩",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 3,
      title: "Symbolism Hunt",
      description: "Identify symbols and their meanings in the novel",
      path: "/chapter/4/level/3",
      icon: "🔍",
      color: "from-emerald-400 to-green-600",
    },
    {
      id: 4,
      title: "Quote Unscramble",
      description: "Reconstruct important quotes from the novel",
      path: "/chapter/4/level/4",
      icon: "📜",
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 5,
      title: "Scene Explorer",
      description:
        "Explore and analyze key scenes through interactive questions",
      path: "/chapter/4/level/5",
      icon: "🎭",
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
      navigationHelper.goToLevel(4, level.id);
    } else {
      alert(`Level ${level.id}: ${level.title} - Coming Soon!`);
    }
  };

  const handleBackToHome = () => {
    navigationHelper.goHome();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-purple-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-rose-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-red-300 rounded-full opacity-10"></div>
      </div>

      {/* Modern Chapter Header */}
      <ChapterHeader
        chapterNumber={4}
        chapterTitle="Noli Me Tangere"
        icon="📖"
        totalLessons={5}
        onLogout={onLogout}
        themeColor="pink"
      />

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Duolingo-style Chapter Hero */}
        <div className="text-center mb-12 relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <div className="text-white text-6xl">📖</div>
              </div>
              {/* Floating elements around mascot */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                Read & Play!
              </div>
              <div className="absolute -bottom-1 -left-1 bg-purple-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                📚
              </div>
            </div>
            <h2 className="text-4xl font-black text-black mb-4">
              Noli Me Tangere
            </h2>
            <p className="text-lg text-black font-medium max-w-2xl mx-auto mb-6">
              Explore Rizal's masterpiece through interactive games and discover
              the story behind his famous novel
            </p>

            {/* Progress indicator */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto border-2 border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black">
                  Chapter Progress
                </span>
                <span className="text-pink-600 font-bold text-sm">
                  {chapterProgress
                    ? `${chapterProgress.completedLevels}/${chapterProgress.totalLevels}`
                    : "0/5"}{" "}
                  complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
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
            // All levels are unlocked in this chapter
            const levelUnlocked = true; // Override to unlock all levels
            const levelCompleted = isLevelCompleted(4, level.id);
            const levelScore = progressData?.chapters?.[4]?.scores?.[level.id] || 0;

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
                        ? "w-1/2 bg-gradient-to-r from-pink-400 to-rose-500"
                        : "w-0 bg-gray-300"
                      }`}
                  ></div>
                </div>

                {/* Status indicator */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${levelCompleted
                    ? "bg-green-400"
                    : levelUnlocked
                      ? "bg-pink-400"
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
                      <span className="text-3xl">{level.icon}</span>
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
                            ? "text-pink-600"
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
                          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white border-rose-700 hover:shadow-lg hover:scale-105"
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
                  <div className="absolute inset-0 bg-gray-900/50 rounded-3xl flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-sm font-bold mb-1">Locked</p>
                      <p className="text-xs text-white">
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
      </main>
    </div>
  );
}
