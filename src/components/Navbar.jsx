import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../utils/responsiveUtils";
import { getUserAchievements } from "../utils/achievementSystem";
import { getUserIdFromUsername } from "../utils/auth";
import { EPIC_ACHIEVEMENTS } from "../utils/achievementConfig";

// Icons
const Icons = {
  Home: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Chart: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
  Settings: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  User: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Logout: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  ChevronDown: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Book: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
};

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
      className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-green-400"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo and Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={handleHomeClick}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-200">
              <Icons.Book className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-gray-800 leading-tight">
                Rizal Adventure
              </h1>
            </div>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Analytics Button (Desktop/Tablet) */}
            {onShowAnalytics && (
              <button
                onClick={onShowAnalytics}
                className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                title="Learning Analytics"
              >
                <Icons.Chart className="w-6 h-6" />
              </button>
            )}

            {/* Admin Button */}
            <button
              onClick={() => navigate("/admin")}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              title="Admin Dashboard"
            >
              <Icons.Settings className="w-6 h-6" />
            </button>

            {/* User Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white pl-2 pr-3 py-1.5 rounded-full font-bold transition-all duration-200 shadow-md hover:shadow-lg border-b-2 border-green-700 active:border-b-0 active:translate-y-0.5"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-bold">
                  {username || "User"}
                </span>
                <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border-2 border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                          {username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-gray-800 truncate">
                            {username || "User"}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            {completionPercentage}% Complete
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 px-2">
                      <button
                        onClick={handleHomeClick}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <Icons.Home className="w-5 h-5 text-gray-600" />
                        <span>Home</span>
                      </button>

                      <button
                        onClick={handleUserStatsClick}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <Icons.User className="w-5 h-5 text-gray-600" />
                        <span>My Stats</span>
                      </button>

                      {onShowAnalytics && (
                        <button
                          onClick={() => {
                            onShowAnalytics();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Icons.Chart className="w-5 h-5 text-gray-600" />
                          <span>Analytics</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          navigate("/admin");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <Icons.Settings className="w-5 h-5 text-gray-600" />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Icons.Logout className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar (Optional - keeping it slim) */}
      {isMobile && (
        <div className="bg-gray-50 px-4 py-1 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-green-600 w-10">
              {completionPercentage}%
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
