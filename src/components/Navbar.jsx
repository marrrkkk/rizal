import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../utils/responsiveUtils";
import { getUserAchievements } from "../utils/achievementSystem";
import { getUserIdFromUsername } from "../utils/auth";
import { EPIC_ACHIEVEMENTS } from "../utils/achievementConfig";
import {
  getButtonClasses,
  getCardClasses,
  transitions,
} from "../utils/designSystem";
import {
  getInteractiveFeedback,
  getFocusClasses,
} from "../utils/interactiveFeedback";
import { getTouchTarget, getFocusRing } from "../utils/accessibility";

const Navbar = ({
  username,
  onLogout,
  onShowAnalytics,
  progressData,
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [achievementCount, setAchievementCount] = useState(0);
  const [latestAchievement, setLatestAchievement] = useState(null);

  // Calculate overall progress
  const overallProgress = progressData?.overall || {};
  const completionPercentage =
    overallProgress.totalLevels > 0
      ? Math.round(
        (overallProgress.completedLevels / overallProgress.totalLevels) * 100
      )
      : 0;

  // Load achievement count
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        if (username) {
          const userId = await getUserIdFromUsername(username);
          if (userId) {
            const achievements = await getUserAchievements(userId);
            setAchievementCount(achievements.length);

            // Get latest achievement
            if (achievements.length > 0) {
              const latest = achievements[0]; // Already sorted by earned_at DESC
              const achievementData =
                EPIC_ACHIEVEMENTS[latest.achievement_name];
              if (achievementData) {
                setLatestAchievement({
                  ...achievementData,
                  earnedAt: latest.earned_at,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading achievements:", err);
      }
    };

    loadAchievements();
  }, [username, progressData]);

  const handleUserStatsClick = () => {
    navigate("/user-stats");
    setShowUserMenu(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setShowUserMenu(false);
  };

  return (
    <header
      className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-gradient-to-r from-green-400 via-emerald-400 to-green-500 backdrop-blur-sm"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div
            className={`flex items-center space-x-3 cursor-pointer ${getInteractiveFeedback(
              "subtle"
            )} ${getFocusRing()}`}
            onClick={handleHomeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleHomeClick();
              }
            }}
            aria-label="Go to home page"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-lg font-bold">📚</span>
              </div>
              {/* Progress ring */}
              <div className="absolute -inset-1">
                <svg
                  className="w-12 h-12 transform -rotate-90"
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

            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-gray-800">
                Rizal Adventure
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                Learning Journey
              </p>
            </div>
          </div>

          {/* Center - Progress Summary (Desktop) */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-6 bg-gray-50 rounded-full px-4 py-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {overallProgress.completedLevels || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Completed
                </div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {completionPercentage}%
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Progress
                </div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div
                className="text-center relative group cursor-pointer"
                onClick={() => navigate("/user-stats")}
              >
                <div className="text-lg font-bold text-purple-600 flex items-center justify-center">
                  {achievementCount}
                  {latestAchievement && (
                    <span className="ml-1 text-sm animate-bounce">
                      {latestAchievement.icon}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Achievements
                </div>

                {/* Latest Achievement Tooltip */}
                {latestAchievement && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div
                      className={`bg-gradient-to-br ${latestAchievement.color} text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap`}
                    >
                      <div className="font-bold">{latestAchievement.name}</div>
                      <div className="text-xs opacity-90">
                        Latest Achievement
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-purple-600 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-2">


            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              {onShowAnalytics && (
                <button
                  onClick={onShowAnalytics}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
                  title="Learning Analytics"
                >
                  <span className="text-lg">📊</span>
                </button>
              )}

              <button
                onClick={() => navigate("/admin")}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                title="Admin Dashboard"
              >
                <span className="text-lg">⚙️</span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-full hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                {!isMobile && (
                  <span className="font-semibold text-sm">
                    {username || "User"}
                  </span>
                )}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 py-2 z-50 animate-slide-down">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative">
                        <span className="text-white font-bold">
                          {username?.charAt(0).toUpperCase() || "U"}
                        </span>
                        {/* Achievement Badge Indicator */}
                        {achievementCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg">
                            {achievementCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {username || "User"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {completionPercentage}% Complete
                        </div>
                        {/* Latest Achievement Display */}
                        {latestAchievement && (
                          <div className="text-xs text-purple-600 font-medium mt-1 flex items-center">
                            <span className="mr-1">
                              {latestAchievement.icon}
                            </span>
                            <span className="truncate">
                              {latestAchievement.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleHomeClick}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2"
                    >
                      <span>🏠</span>
                      <span className="font-medium">Home</span>
                    </button>

                    <button
                      onClick={handleUserStatsClick}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2"
                    >
                      <span>📈</span>
                      <span className="font-medium">My Stats</span>
                    </button>

                    {onShowAnalytics && (
                      <button
                        onClick={() => {
                          onShowAnalytics();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2"
                      >
                        <span>📊</span>
                        <span className="font-medium">Analytics</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigate("/admin");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-800 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2"
                    >
                      <span>⚙️</span>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 flex items-center space-x-2 rounded-lg mx-2 font-medium"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      {isMobile && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600">
              Progress: {overallProgress.completedLevels || 0}/
              {overallProgress.totalLevels || 30}
            </span>
            <span className="font-bold text-green-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
