import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsive } from "../utils/responsiveUtils";

const Navbar = ({
  username,
  onLogout,
  onShowAnalytics,
  progressData,
  usingFallback,
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Calculate overall progress
  const overallProgress = progressData?.overall || {};
  const completionPercentage =
    overallProgress.totalLevels > 0
      ? Math.round(
          (overallProgress.completedLevels / overallProgress.totalLevels) * 100
        )
      : 0;

  const handleUserStatsClick = () => {
    navigate("/user-stats");
    setShowUserMenu(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-green-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
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
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {overallProgress.badges?.length || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Badges</div>
              </div>
            </div>
          )}

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            {usingFallback && (
              <div className="hidden sm:flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                <span>📱</span>
                <span>Offline</span>
              </div>
            )}

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
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
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
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {username || "User"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {completionPercentage}% Complete
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleHomeClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>🏠</span>
                      <span>Home</span>
                    </button>

                    <button
                      onClick={handleUserStatsClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>📈</span>
                      <span>My Stats</span>
                    </button>

                    {onShowAnalytics && (
                      <button
                        onClick={() => {
                          onShowAnalytics();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span>📊</span>
                        <span>Analytics</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigate("/admin");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
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
