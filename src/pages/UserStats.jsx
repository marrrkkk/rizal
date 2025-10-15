import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgressAPI } from "../hooks/useProgressAPI";
import { useResponsive } from "../utils/responsiveUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const UserStats = ({ username, onLogout, onShowAnalytics, usingFallback }) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    progressData,
    loading,
    error,
    getChapterProgress,
    getOverallProgress,
    getAllBadges,
  } = useProgressAPI(username);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        <Navbar
          username={username}
          onLogout={onLogout}
          onShowAnalytics={onShowAnalytics}
          progressData={progressData}
          usingFallback={usingFallback}
        />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" message="Loading your stats..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        <Navbar
          username={username}
          onLogout={onLogout}
          onShowAnalytics={onShowAnalytics}
          progressData={progressData}
          usingFallback={usingFallback}
        />
        <div className="flex items-center justify-center h-96">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-black mb-4">
              Error Loading Stats
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
      </div>
    );
  }

  const overallProgress = getOverallProgress() || {};
  const badges = getAllBadges() || [];
  const completionPercentage =
    overallProgress.totalLevels > 0
      ? Math.round(
          (overallProgress.completedLevels / overallProgress.totalLevels) * 100
        )
      : 0;

  // Calculate chapter stats
  const chapterStats = [];
  for (let i = 1; i <= 6; i++) {
    const chapterProgress = getChapterProgress(i);
    if (chapterProgress) {
      chapterStats.push(chapterProgress);
    }
  }

  // Calculate streaks and achievements
  const achievements = [
    {
      id: "first_level",
      name: "First Steps",
      description: "Complete your first level",
      icon: "🎯",
      earned: overallProgress.completedLevels > 0,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "chapter_complete",
      name: "Chapter Master",
      description: "Complete an entire chapter",
      icon: "📚",
      earned: chapterStats.some((ch) => ch.isComplete),
      color: "from-green-400 to-green-600",
    },
    {
      id: "half_way",
      name: "Halfway Hero",
      description: "Complete 50% of all levels",
      icon: "⭐",
      earned: completionPercentage >= 50,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "perfect_score",
      name: "Perfect Scholar",
      description: "Get a perfect score on any level",
      icon: "💯",
      earned: overallProgress.averageScore >= 100,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "all_chapters",
      name: "Rizal Expert",
      description: "Complete all chapters",
      icon: "🏆",
      earned: completionPercentage >= 100,
      color: "from-red-400 to-red-600",
    },
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "chapters", name: "Chapters", icon: "📚" },
    { id: "achievements", name: "Achievements", icon: "🏆" },
    { id: "badges", name: "Badges", icon: "🎖️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <Navbar
        username={username}
        onLogout={onLogout}
        onShowAnalytics={onShowAnalytics}
        progressData={progressData}
        usingFallback={usingFallback}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white mx-auto mb-4">
              <span className="text-white text-3xl font-bold">
                {username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            {/* Progress ring around avatar */}
            <div className="absolute -inset-2">
              <svg
                className="w-28 h-28 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-800 mb-2">
            {username}'s Learning Journey
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {completionPercentage}% Complete •{" "}
            {overallProgress.completedLevels || 0} Levels Finished
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div
              className={`grid ${
                isMobile ? "grid-cols-2" : "grid-cols-4"
              } gap-2`}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {!isMobile && <span>{tab.name}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Stats Cards */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">
                    {overallProgress.completedLevels || 0}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">
                  Levels Completed
                </h3>
                <p className="text-sm text-gray-600">
                  Out of {overallProgress.totalLevels || 30} total
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">⭐</span>
                  </div>
                  <span className="text-2xl font-black text-green-600">
                    {Math.round(overallProgress.averageScore || 0)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Average Score</h3>
                <p className="text-sm text-gray-600">Across all levels</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🎖️</span>
                  </div>
                  <span className="text-2xl font-black text-purple-600">
                    {badges.length}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Badges Earned</h3>
                <p className="text-sm text-gray-600">Achievements unlocked</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🔥</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600">
                    {overallProgress.currentStreak || 0}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Current Streak</h3>
                <p className="text-sm text-gray-600">Days in a row</p>
              </div>
            </div>
          )}

          {/* Chapters Tab */}
          {activeTab === "chapters" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {chapterStats.map((chapter) => (
                <div
                  key={chapter.chapterId}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">{chapter.name}</h3>
                    <span className="text-2xl">
                      {chapter.isComplete
                        ? "✅"
                        : chapter.completedLevels > 0
                        ? "🔄"
                        : "⏳"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {chapter.completedLevels}/{chapter.totalLevels}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (chapter.completedLevels / chapter.totalLevels) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    {chapter.averageScore > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Average Score</span>
                        <span className="font-semibold text-green-600">
                          {chapter.averageScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${
                    achievement.earned ? "" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${
                        achievement.color
                      } rounded-full flex items-center justify-center shadow-lg ${
                        achievement.earned ? "" : "grayscale"
                      }`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {achievement.earned ? "✅" : "🔒"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === "badges" && (
            <div className="space-y-6">
              {badges.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                          <span className="text-2xl">🎖️</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          {badge.badge_name || badge.badge_type}
                        </h3>
                        {badge.earned_date && (
                          <p className="text-sm text-gray-600">
                            Earned:{" "}
                            {new Date(badge.earned_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎖️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Badges Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complete levels to earn your first badge!
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Start Learning
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
