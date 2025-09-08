/**
 * Admin Progress View Component
 * Displays progress for all users (for teachers/parents)
 */

import { useState } from "react";
import { useMultiUserProgress } from "../hooks/useUserProgress";

const AdminProgressView = ({ className = "" }) => {
  const { users, loading, error, refreshUsers, getTopPerformers, totalUsers } =
    useMultiUserProgress();

  const [sortBy, setSortBy] = useState("completionPercentage");
  const [showDetails, setShowDetails] = useState({});

  const toggleDetails = (username) => {
    setShowDetails((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    return bValue - aValue;
  });

  const topPerformers = getTopPerformers("completionPercentage", 3);

  if (loading) {
    return (
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">⚠️</span>
          <h3 className="text-lg font-semibold text-red-800">
            Error Loading Users
          </h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshUsers}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">👥</span>
            All Users Progress
          </h3>
          <p className="text-sm text-gray-600">
            {totalUsers} {totalUsers === 1 ? "user" : "users"} registered
          </p>
        </div>
        <button
          onClick={refreshUsers}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            🏆 Top Performers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topPerformers.map((user, index) => (
              <div
                key={user.username}
                className={`p-3 rounded-lg text-center ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-300"
                    : index === 1
                    ? "bg-gray-100 border-2 border-gray-300"
                    : "bg-orange-100 border-2 border-orange-300"
                }`}
              >
                <div className="text-2xl mb-1">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <div className="font-semibold text-gray-800">
                  {user.username}
                </div>
                <div className="text-sm text-gray-600">
                  {user.completionPercentage}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="completionPercentage">Completion %</option>
          <option value="totalLevelsCompleted">Levels Completed</option>
          <option value="averageScore">Average Score</option>
          <option value="totalBadges">Total Badges</option>
          <option value="currentStreak">Current Streak</option>
          <option value="totalTimeSpent">Time Spent</option>
        </select>
      </div>

      {/* Users List */}
      {sortedUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-4 block">📚</span>
          <p>
            No users found. Users will appear here after they start playing!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedUsers.map((user) => (
            <div
              key={user.username}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* User Summary */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleDetails(user.username)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.totalLevelsCompleted}/25 levels •{" "}
                      {user.completionPercentage}% complete
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {user.averageScore}%
                    </div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {user.totalBadges}
                    </div>
                    <div className="text-xs text-gray-500">Badges</div>
                  </div>
                  <div className="text-gray-400">
                    {showDetails[user.username] ? "▼" : "▶"}
                  </div>
                </div>
              </div>

              {/* Detailed View */}
              {showDetails[user.username] && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Perfect Scores
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {user.perfectScores}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Current Streak
                      </div>
                      <div className="text-lg font-semibold text-orange-600">
                        {user.currentStreak} days
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Time Spent</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {Math.floor(user.totalTimeSpent / 60)}m
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Games Played</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {user.gamesPlayed}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Favorite Chapter:</span>
                      <span className="ml-2 font-medium">
                        {user.favoriteChapter
                          ? `Chapter ${user.favoriteChapter}`
                          : "None yet"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Strongest Subject:</span>
                      <span className="ml-2 font-medium">
                        {user.strongestSubject
                          ? `Chapter ${user.strongestSubject}`
                          : "None yet"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Played:</span>
                      <span className="ml-2 font-medium">
                        {user.lastPlayed
                          ? new Date(user.lastPlayed).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Account Created:</span>
                      <span className="ml-2 font-medium">
                        {new Date(user.accountCreated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {users.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">
            📊 Summary Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(
                  users.reduce(
                    (sum, user) => sum + user.completionPercentage,
                    0
                  ) / users.length
                )}
                %
              </div>
              <div className="text-xs text-blue-800">Avg Completion</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-600">
                {Math.round(
                  users.reduce((sum, user) => sum + user.averageScore, 0) /
                    users.length
                )}
                %
              </div>
              <div className="text-xs text-green-800">Avg Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600">
                {users.reduce((sum, user) => sum + user.totalBadges, 0)}
              </div>
              <div className="text-xs text-purple-800">Total Badges</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">
                {Math.floor(
                  users.reduce((sum, user) => sum + user.totalTimeSpent, 0) / 60
                )}
              </div>
              <div className="text-xs text-orange-800">Total Minutes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgressView;
