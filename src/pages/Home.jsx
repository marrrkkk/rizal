import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getOverallProgress,
  getChapterProgress,
  getAllBadges,
  getAchievementStats,
} from "../utils/progressManager";
import ProgressDashboard from "../components/ProgressDashboard";
import { createNavigationHelper } from "../utils/navigationHelper";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  useResponsive,
  getTouchFriendlyProps,
  getMobileOptimizedClasses,
} from "../utils/responsiveUtils.jsx";
import { usePerformanceOptimization } from "../hooks/usePerformanceOptimization";
import LoadingSpinner from "../components/LoadingSpinner";
import ResponsiveContainer from "../components/ResponsiveContainer";
import UserProgressManager from "../components/UserProgressManager";

export default function Home({ username, onLogout, onShowAnalytics }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { getOptimizedTouchProps, shouldLazyLoad, debounce } =
    usePerformanceOptimization();
  const touchProps = getOptimizedTouchProps();
  const mobileClasses = getMobileOptimizedClasses(isMobile, isTablet);

  const [overallProgress, setOverallProgress] = useState(null);
  const [chaptersProgress, setChaptersProgress] = useState({});
  const [userBadges, setUserBadges] = useState([]);
  const [achievementStats, setAchievementStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Load progress data
        const overall = getOverallProgress();
        setOverallProgress(overall);

        // Load individual chapter progress
        const chapters = {};
        for (let i = 1; i <= 5; i++) {
          chapters[i] = getChapterProgress(i);
        }
        setChaptersProgress(chapters);

        // Load badges and achievements
        const badges = getAllBadges();
        setUserBadges(badges);

        const stats = getAchievementStats();
        setAchievementStats(stats);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
    const chapterProgress = chaptersProgress[chapter.id];

    // Add haptic feedback
    if (navigator.vibrate && isTouchDevice) {
      navigator.vibrate(25);
    }

    // Check if chapter is unlocked (Chapter 1 is always unlocked)
    if (
      chapter.id === 1 ||
      (chapterProgress && chapterProgress.unlockedLevels > 0)
    ) {
      navigationHelper.goToChapter(chapter.id);
    } else {
      // Better mobile-friendly alert
      if (isMobile) {
        const message = "Complete previous chapters to unlock this one!";
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Chapter Locked", { body: message });
        } else {
          alert(message);
        }
      } else {
        alert("Complete previous chapters to unlock this one!");
      }
    }
  }, 300);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner
          size={isMobile ? "md" : "lg"}
          message="Loading your progress..."
          skeleton={shouldLazyLoad()}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative overflow-hidden">
        {/* Duolingo-style floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-blue-300 rounded-full opacity-10"></div>
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-300 rounded-full opacity-15 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-10"></div>
          <div className="absolute top-2/3 right-1/3 w-14 h-14 bg-orange-300 rounded-full opacity-15 animate-bounce"></div>
        </div>
        {/* Duolingo-style Header */}
        <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-green-400">
          <ResponsiveContainer className="py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {/* Duolingo-style mascot */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-xl font-bold">📚</span>
                </div>
                {/* Streak indicator */}
                <div className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  🔥
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-black text-gray-800 truncate">
                  Hi {username}! 👋
                </h1>
                <p className="text-sm text-gray-600 truncate font-medium">
                  Ready for today's lesson?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Progress indicator */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2">
                <span className="text-sm font-bold text-gray-700">
                  Progress
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-green-600">75%</span>
              </div>

              <button
                onClick={() => navigate("/admin")}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border-b-2 border-blue-700 active:border-b-0"
                {...touchProps}
                title="Admin Dashboard"
              >
                <span className="text-lg">⚙️</span>
              </button>
              {onShowAnalytics && (
                <button
                  onClick={onShowAnalytics}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border-b-2 border-purple-700 active:border-b-0"
                  {...touchProps}
                  title="Learning Analytics"
                >
                  <span className="text-lg">📊</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border-b-2 border-red-700 active:border-b-0"
                {...touchProps}
              >
                <span className="text-sm">Exit</span>
              </button>
            </div>
          </ResponsiveContainer>
        </header>

        {/* Main Content */}
        <main className="w-full">
          <ResponsiveContainer className="py-6 sm:py-8">
            {/* Duolingo-style Hero Section */}
            <div className="text-center mb-8 relative z-10">
              <div className="relative inline-block mb-6">
                {/* Main mascot */}
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <div className="text-white text-5xl font-bold">🎓</div>
                  </div>
                  {/* Floating elements around mascot */}
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                    Let's learn!
                  </div>
                  <div className="absolute -bottom-1 -left-1 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    📖
                  </div>
                </div>
                <h2 className="text-4xl font-black text-gray-800 mb-2">
                  Jose Rizal Adventure
                </h2>
                <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                  Discover the incredible story of our national hero through
                  fun, interactive lessons!
                </p>
              </div>

              {/* Daily goal section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🎯</span>
                    <span className="font-bold text-gray-800">
                      Today's Goal
                    </span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    2/3 lessons
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="w-2/3 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Complete 1 more lesson to reach your daily goal!
                </p>
              </div>
            </div>

            {/* User Progress Manager */}
            <div className={`${isMobile ? "mb-8" : "mb-12"} max-w-4xl mx-auto`}>
              <UserProgressManager username={username} />
            </div>

            {/* Development & Testing Section */}
            <div className={`${isMobile ? "mb-8" : "mb-12"} max-w-4xl mx-auto`}>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🧪</span>
                  Development & Testing
                </h3>
                <p className="text-gray-600 mb-4">
                  Test the enhanced badge notification system and see how it
                  integrates with games.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/badge-test")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏆</span>
                      <div>
                        <div className="font-bold">Badge System Demo</div>
                        <div className="text-sm opacity-90">
                          Test badge notifications and gallery
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/game-example")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🎮</span>
                      <div>
                        <div className="font-bold">
                          Game Integration Example
                        </div>
                        <div className="text-sm opacity-90">
                          See badges in action with a quiz game
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Section */}
            <div className={`${isMobile ? "mb-8" : "mb-12"} max-w-4xl mx-auto`}>
              <ProgressDashboard
                type="overview"
                showBadges={true}
                showStats={true}
              />
            </div>

            {/* Duolingo-style Chapters Grid */}
            <div className="grid gap-6 max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-4 border-white/50 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleChapterClick(chapter)}
                  {...touchProps}
                >
                  {/* Progress indicator */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                    <div
                      className={`h-full bg-gradient-to-r ${chapter.color} transition-all duration-500`}
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>

                  {/* Lock/unlock indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm">
                      {chapter.id === 1 ? "🔓" : "🔒"}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Chapter icon with Duolingo-style design */}
                    <div className="relative mb-4">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${chapter.color} rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className="text-3xl">{chapter.icon}</span>
                      </div>
                      {/* Completion stars */}
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        <span className="text-xs">⭐</span>
                      </div>
                    </div>

                    {/* Chapter info */}
                    <div className="text-center">
                      <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {chapter.description}
                      </p>

                      {/* Lesson count */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          5 Lessons
                        </span>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-xs font-bold text-green-600">
                          {Math.floor(Math.random() * 5)} Complete
                        </span>
                      </div>

                      {/* Start button */}
                      <button
                        className={`w-full bg-gradient-to-r ${chapter.color} text-white font-black py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-200 border-b-4 border-opacity-50 border-gray-700 active:border-b-2 uppercase tracking-wide text-sm`}
                      >
                        {chapter.id === 1 ? "Start" : "Continue"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Duolingo-style Fun Facts Section */}
            <div className="mt-16 relative z-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border-4 border-yellow-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">
                    Amazing Facts!
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Discover incredible things about Jose Rizal
                  </p>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                  <div className="text-center bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl">22</span>
                    </div>
                    <h4 className="font-black text-gray-800 mb-2">Languages</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      Jose Rizal could speak 22 different languages!
                    </p>
                  </div>

                  <div className="text-center bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl">📚</span>
                    </div>
                    <h4 className="font-black text-gray-800 mb-2">Novels</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      He wrote 2 famous novels that changed history
                    </p>
                  </div>

                  <div className="text-center bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl">35</span>
                    </div>
                    <h4 className="font-black text-gray-800 mb-2">Age</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      He accomplished so much in just 35 years of life
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </main>
      </div>
    </ErrorBoundary>
  );
}
