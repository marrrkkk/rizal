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

export default function Home({ username, onLogout }) {
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
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <ResponsiveContainer className="py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div
                className={`${
                  isTouchDevice ? "w-12 h-12" : "w-10 h-10"
                } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span
                  className={`text-white font-bold ${
                    isTouchDevice ? "text-xl" : "text-lg"
                  }`}
                >
                  JR
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className={`${
                    isMobile ? "text-lg" : "text-xl sm:text-2xl"
                  } font-bold text-gray-800 truncate`}
                >
                  Welcome back, {username}!
                </h1>
                <p
                  className={`${
                    isMobile ? "text-xs" : "text-sm"
                  } text-gray-600 truncate`}
                >
                  Ready to learn about our national hero?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/admin")}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0 ${
                  isTouchDevice ? "min-w-[44px] min-h-[44px]" : ""
                }`}
                {...touchProps}
                title="Admin Dashboard"
              >
                <span className={`${isMobile ? "text-sm" : "text-base"}`}>
                  👨‍🏫 {isMobile ? "Admin" : "Dashboard"}
                </span>
              </button>
              <button
                onClick={onLogout}
                className={`bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0 ${
                  isTouchDevice ? "min-w-[44px] min-h-[44px]" : ""
                }`}
                {...touchProps}
              >
                <span className={`${isMobile ? "text-sm" : "text-base"}`}>
                  {isMobile ? "Out" : "Logout"}
                </span>
              </button>
            </div>
          </ResponsiveContainer>
        </header>

        {/* Main Content */}
        <main className="w-full">
          <ResponsiveContainer className="py-6 sm:py-8">
            {/* Hero Section */}
            <div className={`text-center ${isMobile ? "mb-8" : "mb-12"}`}>
              <div
                className={`inline-block ${
                  isMobile ? "p-3" : "p-4"
                } bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mb-4 sm:mb-6`}
              >
                <div
                  className={`${
                    isMobile ? "w-16 h-16" : "w-20 h-20 sm:w-24 sm:h-24"
                  } bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto ${
                    isMobile ? "mb-3" : "mb-4"
                  } flex items-center justify-center shadow-lg`}
                >
                  <span
                    className={`${
                      isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                    }`}
                  >
                    👨‍🎓
                  </span>
                </div>
                <h2
                  className={`${
                    isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                  } font-bold text-gray-800 ${isMobile ? "mb-1" : "mb-2"}`}
                >
                  Jose Rizal's Life Journey
                </h2>
                <p
                  className={`${
                    isMobile ? "text-sm" : "text-base sm:text-lg"
                  } text-gray-600 max-w-2xl mx-auto px-2`}
                >
                  Explore the amazing life of the Philippines' greatest hero
                  through interactive chapters
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

            {/* Chapters Grid - Responsive layout */}
            <div
              className={`grid gap-4 sm:gap-6 max-w-6xl mx-auto ${
                isMobile
                  ? "grid-cols-1"
                  : isTablet
                  ? "grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg ${
                    isTouchDevice
                      ? "active:shadow-xl active:scale-95"
                      : "hover:shadow-2xl hover:-translate-y-2"
                  } transition-all duration-300 transform cursor-pointer ${
                    isTouchDevice ? "min-h-[140px]" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleChapterClick(chapter)}
                  {...touchProps}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      chapter.color
                    } opacity-10 ${
                      isTouchDevice
                        ? "group-active:opacity-20"
                        : "group-hover:opacity-20"
                    } transition-opacity duration-300`}
                  ></div>

                  {/* Chapter Number Badge */}
                  <div
                    className={`absolute ${
                      isMobile ? "top-2 right-2" : "top-4 right-4"
                    } ${
                      isTouchDevice ? "w-10 h-10" : "w-8 h-8"
                    } bg-white/90 rounded-full flex items-center justify-center shadow-md`}
                  >
                    <span
                      className={`${
                        isTouchDevice ? "text-base" : "text-sm"
                      } font-bold text-gray-700`}
                    >
                      {chapter.id}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`relative ${isMobile ? "p-4" : "p-5 sm:p-6"}`}
                  >
                    {/* Icon */}
                    <div
                      className={`${
                        isMobile ? "w-12 h-12" : "w-14 h-14 sm:w-16 sm:h-16"
                      } bg-gradient-to-br ${
                        chapter.color
                      } rounded-2xl flex items-center justify-center ${
                        isMobile ? "mb-3" : "mb-4"
                      } shadow-lg ${
                        isTouchDevice
                          ? "group-active:scale-105"
                          : "group-hover:scale-110"
                      } transition-transform duration-300`}
                    >
                      <span className={`${isMobile ? "text-xl" : "text-2xl"}`}>
                        {chapter.icon}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`${
                        isMobile ? "text-lg" : "text-xl"
                      } font-bold text-gray-800 ${isMobile ? "mb-1" : "mb-2"} ${
                        isTouchDevice
                          ? "group-active:text-gray-900"
                          : "group-hover:text-gray-900"
                      } transition-colors line-clamp-2`}
                    >
                      {chapter.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-gray-600 ${
                        isMobile ? "text-xs" : "text-sm"
                      } ${
                        isMobile ? "mb-3" : "mb-4"
                      } leading-relaxed line-clamp-3`}
                    >
                      {chapter.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`${
                          isMobile ? "text-xs" : "text-xs"
                        } font-medium text-gray-500 uppercase tracking-wide`}
                      >
                        Chapter {chapter.id}
                      </span>
                      <div
                        className={`${
                          isTouchDevice ? "w-10 h-10" : "w-8 h-8"
                        } bg-gradient-to-br ${
                          chapter.color
                        } rounded-full flex items-center justify-center shadow-md ${
                          isTouchDevice
                            ? "group-active:shadow-lg"
                            : "group-hover:shadow-lg"
                        } transition-all duration-300`}
                      >
                        <svg
                          className={`${
                            isTouchDevice ? "w-5 h-5" : "w-4 h-4"
                          } text-white`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div
                    className={`absolute inset-0 border-2 border-transparent ${
                      isTouchDevice
                        ? "group-active:border-white/50"
                        : "group-hover:border-white/50"
                    } rounded-2xl transition-all duration-300`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Fun Facts Section */}
            <div
              className={`${
                isMobile ? "mt-12" : "mt-16"
              } bg-white/60 backdrop-blur-sm rounded-3xl ${
                isMobile ? "p-6" : "p-8"
              } shadow-lg max-w-6xl mx-auto`}
            >
              <h3
                className={`${
                  isMobile ? "text-xl" : "text-2xl"
                } font-bold text-center text-gray-800 ${
                  isMobile ? "mb-4" : "mb-6"
                }`}
              >
                Did You Know?
              </h3>
              <div
                className={`grid gap-4 sm:gap-6 ${
                  isMobile
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    } bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto ${
                      isMobile ? "mb-2" : "mb-3"
                    } flex items-center justify-center`}
                  >
                    <span
                      className={`text-white font-bold ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      22
                    </span>
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-xs" : "text-sm"
                    } text-gray-600`}
                  >
                    Languages Jose Rizal could speak
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    } bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto ${
                      isMobile ? "mb-2" : "mb-3"
                    } flex items-center justify-center`}
                  >
                    <span
                      className={`text-white font-bold ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      2
                    </span>
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-xs" : "text-sm"
                    } text-gray-600`}
                  >
                    Famous novels he wrote
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    } bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto ${
                      isMobile ? "mb-2" : "mb-3"
                    } flex items-center justify-center`}
                  >
                    <span
                      className={`text-white font-bold ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      35
                    </span>
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-xs" : "text-sm"
                    } text-gray-600`}
                  >
                    Years old when he died
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </main>
      </div>
    </ErrorBoundary>
  );
}
