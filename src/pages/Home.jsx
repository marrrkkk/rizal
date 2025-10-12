import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createNavigationHelper } from "../utils/navigationHelper";
import ErrorBoundary from "../components/ErrorBoundary";
import { useResponsive } from "../utils/responsiveUtils.jsx";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";
import { useProgressAPI } from "../hooks/useProgressAPI";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home({ username, onLogout, onShowAnalytics }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const { isTouchDevice, isMobile } = useResponsive();
  const { debounce } = usePerformanceOptimization();

  // Use the progress API hook
  const {
    progressData,
    loading,
    error,
    isLevelUnlocked,
    getChapterProgress,
    getOverallProgress,
  } = useProgressAPI(username);

  const chapters = [
    {
      id: 1,
      title: "Childhood in Calamba",
      description: "Discover young Jose's early years",
      color: "from-blue-400 to-blue-600",
      icon: "🏠",
      path: "/chapter/1",
    },
    {
      id: 2,
      title: "Education in Manila",
      description: "Follow his school adventures",
      color: "from-amber-400 to-orange-500",
      icon: "📚",
      path: "/chapter/2",
    },
    {
      id: 3,
      title: "Studies Abroad",
      description: "Journey across the world",
      color: "from-emerald-400 to-green-600",
      icon: "✈️",
      path: "/chapter/3",
    },
    {
      id: 4,
      title: "Noli Me Tangere",
      description: "The story behind his famous book",
      color: "from-pink-400 to-rose-500",
      icon: "📖",
      path: "/chapter/4",
    },
    {
      id: 5,
      title: "Return to the Philippines",
      description: "Coming back to help his country",
      color: "from-purple-400 to-indigo-500",
      icon: "🇵🇭",
      path: "/chapter/5",
    },
    {
      id: 6,
      title: "Exile and Legacy",
      description: "His final years and lasting impact",
      color: "from-red-400 to-pink-500",
      icon: "⭐",
      path: "/chapter/6",
    },
  ];

  const handleChapterClick = debounce((chapter) => {
    // Add haptic feedback
    if (navigator.vibrate && isTouchDevice) {
      navigator.vibrate(25);
    }

    // Check if chapter is unlocked (Chapter 1 is always unlocked, others need level 1 unlocked)
    const isChapterUnlocked =
      chapter.id === 1 || isLevelUnlocked(chapter.id, 1);

    if (isChapterUnlocked) {
      navigationHelper.goToChapter(chapter.id);
    } else {
      const message = "Complete previous chapters to unlock this one!";
      if (
        isMobile &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("Chapter Locked", { body: message });
      } else {
        alert(message);
      }
    }
  }, 300);

  // Show loading spinner while progress is loading
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <LoadingSpinner
          size={isMobile ? "md" : "lg"}
          message="Loading your progress..."
        />
      </div>
    );
  }

  // Show error if progress failed to load
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md mx-auto text-center border-4 border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-black mb-4">
            Error Loading Progress
          </h2>
          <p className="text-black mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        {/* Clean Header */}
        <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-green-400">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-xl font-bold">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-black">
                  Hi {username}! 👋
                </h1>
                <p className="text-sm text-black font-medium">
                  Choose a chapter to continue learning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate("/admin")}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                title="Admin Dashboard"
              >
                <span className="text-lg">⚙️</span>
              </button>
              {onShowAnalytics && (
                <button
                  onClick={onShowAnalytics}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                  title="Learning Analytics"
                >
                  <span className="text-lg">📊</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg"
              >
                Exit
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - Only Chapters */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-black mb-4">
              Jose Rizal Adventure
            </h2>
            <p className="text-lg text-black font-medium max-w-2xl mx-auto">
              Discover the incredible story of our national hero through
              interactive lessons
            </p>
          </div>

          {/* Chapters Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter, index) => {
              const chapterProgress = getChapterProgress(chapter.id);
              const isChapterUnlocked =
                chapter.id === 1 || isLevelUnlocked(chapter.id, 1);
              const completedLevels = chapterProgress?.completedLevels || 0;
              const totalLevels = 5;
              const progressPercentage = (completedLevels / totalLevels) * 100;
              const isChapterComplete = completedLevels >= totalLevels;

              return (
                <div
                  key={chapter.id}
                  className={`group relative bg-white rounded-3xl shadow-lg transition-all duration-300 transform border-4 border-white/50 overflow-hidden ${
                    isChapterUnlocked
                      ? "hover:shadow-2xl hover:scale-105 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleChapterClick(chapter)}
                >
                  {/* Progress indicator */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                    <div
                      className={`h-full bg-gradient-to-r ${chapter.color} transition-all duration-500`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  {/* Lock/unlock indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm">
                      {isChapterComplete
                        ? "✅"
                        : isChapterUnlocked
                        ? "🔓"
                        : "🔒"}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Chapter icon */}
                    <div className="relative mb-4">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${
                          chapter.color
                        } rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${
                          isChapterUnlocked ? "group-hover:scale-110" : ""
                        } transition-transform duration-300 ${
                          !isChapterUnlocked ? "grayscale" : ""
                        }`}
                      >
                        <span className="text-3xl">{chapter.icon}</span>
                      </div>
                      {/* Completion stars */}
                      {isChapterComplete && (
                        <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          <span className="text-xs">⭐</span>
                        </div>
                      )}
                    </div>

                    {/* Chapter info */}
                    <div className="text-center">
                      <h3
                        className={`text-xl font-black mb-2 transition-colors ${
                          isChapterUnlocked
                            ? "text-black group-hover:text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {chapter.title}
                      </h3>
                      <p
                        className={`text-sm mb-4 leading-relaxed ${
                          isChapterUnlocked ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {chapter.description}
                      </p>

                      {/* Lesson count */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span
                          className={`text-xs font-bold uppercase tracking-wide ${
                            isChapterUnlocked ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {totalLevels} Lessons
                        </span>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-xs font-bold text-green-600">
                          {completedLevels} Complete
                        </span>
                      </div>

                      {/* Start button */}
                      <button
                        className={`w-full font-black py-3 px-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-2 uppercase tracking-wide text-sm ${
                          isChapterUnlocked
                            ? `bg-gradient-to-r ${chapter.color} text-white border-opacity-50 border-gray-700 hover:shadow-lg`
                            : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isChapterUnlocked}
                      >
                        {!isChapterUnlocked
                          ? "Locked"
                          : completedLevels === 0
                          ? "Start"
                          : isChapterComplete
                          ? "Complete"
                          : "Continue"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
