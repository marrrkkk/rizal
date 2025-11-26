/**
 * UserStatsTable Component
 * Displays comprehensive user statistics with sorting and filtering
 */

import { useState, useMemo } from "react";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

const UserStatsTable = ({
  users,
  onUserClick,
  loading = false,
  error = null,
  onRetry = null,
}) => {
  const [sortField, setSortField] = useState("totalScore");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("all");
  const [filterAchievements, setFilterAchievements] = useState("all");

  // Sort and filter users
  const processedUsers = useMemo(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply completion filter
    if (filterCompleted === "active") {
      filtered = filtered.filter((user) => user.completedLevels > 0);
    } else if (filterCompleted === "inactive") {
      filtered = filtered.filter((user) => user.completedLevels === 0);
    } else if (filterCompleted === "high") {
      filtered = filtered.filter((user) => user.completionRate >= 75);
    } else if (filterCompleted === "low") {
      filtered = filtered.filter(
        (user) => user.completionRate < 50 && user.completedLevels > 0
      );
    }

    // Apply achievement filter
    if (filterAchievements === "withBadges") {
      filtered = filtered.filter((user) => user.achievementCount > 0);
    } else if (filterAchievements === "noBadges") {
      filtered = filtered.filter((user) => user.achievementCount === 0);
    } else if (filterAchievements === "highAchievers") {
      filtered = filtered.filter((user) => user.achievementCount >= 5);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = 0;
      if (bValue === null || bValue === undefined) bValue = 0;

      // Handle date fields
      if (sortField === "accountCreated" || sortField === "lastPlayed") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    users,
    sortField,
    sortDirection,
    searchTerm,
    filterCompleted,
    filterAchievements,
  ]);

  // Handle sort column click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <AdminLoadingState type="table" message="Loading user statistics..." />
    );
  }

  if (error) {
    return (
      <AdminErrorMessage
        error={error}
        onRetry={onRetry}
        title="Failed to Load User Statistics"
        showDetails={true}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              User Statistics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {processedUsers.length}{" "}
              {processedUsers.length === 1 ? "user" : "users"} displayed
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Completion Filter */}
            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Progress</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
              <option value="high">High Completion (≥75%)</option>
              <option value="low">Low Completion (&lt;50%)</option>
            </select>

            {/* Achievement Filter */}
            <select
              value={filterAchievements}
              onChange={(e) => setFilterAchievements(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Badges</option>
              <option value="withBadges">With Badges</option>
              <option value="noBadges">No Badges</option>
              <option value="highAchievers">High Achievers (≥5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center space-x-1">
                  <span>Username</span>
                  <span className="text-gray-400">
                    {getSortIndicator("username")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalScore")}
              >
                <div className="flex items-center space-x-1">
                  <span>Total Score</span>
                  <span className="text-gray-400">
                    {getSortIndicator("totalScore")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("averageScore")}
              >
                <div className="flex items-center space-x-1">
                  <span>Avg Score</span>
                  <span className="text-gray-400">
                    {getSortIndicator("averageScore")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("completedLevels")}
              >
                <div className="flex items-center space-x-1">
                  <span>Completed</span>
                  <span className="text-gray-400">
                    {getSortIndicator("completedLevels")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("completionRate")}
              >
                <div className="flex items-center space-x-1">
                  <span>Rate</span>
                  <span className="text-gray-400">
                    {getSortIndicator("completionRate")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("achievementCount")}
              >
                <div className="flex items-center space-x-1">
                  <span>Badges</span>
                  <span className="text-gray-400">
                    {getSortIndicator("achievementCount")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("avgTimeMinutes")}
              >
                <div className="flex items-center space-x-1">
                  <span>Avg Time</span>
                  <span className="text-gray-400">
                    {getSortIndicator("avgTimeMinutes")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("totalAttempts")}
              >
                <div className="flex items-center space-x-1">
                  <span>Attempts</span>
                  <span className="text-gray-400">
                    {getSortIndicator("totalAttempts")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("lastPlayed")}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Played</span>
                  <span className="text-gray-400">
                    {getSortIndicator("lastPlayed")}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedUsers.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <span className="text-4xl mb-2 block">🔍</span>
                    <p>No users found matching your criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">
                      {user.totalScore.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {user.averageScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.completedLevels}/{user.unlockedLevels}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.completedChapters} chapters
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {user.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      🏅 {user.achievementCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatTime(user.avgTimeMinutes)}
                    </div>
                    <div className="text-xs text-gray-500">per level</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.totalAttempts}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.totalHintsUsed} hints
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastPlayed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onUserClick && onUserClick(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      {processedUsers.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-sm">
            <div>
              <div className="text-gray-600">Total Score</div>
              <div className="font-bold text-blue-600">
                {processedUsers
                  .reduce((sum, u) => sum + u.totalScore, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Avg Completion</div>
              <div className="font-bold text-green-600">
                {Math.round(
                  processedUsers.reduce((sum, u) => sum + u.completionRate, 0) /
                    processedUsers.length
                )}
                %
              </div>
            </div>
            <div>
              <div className="text-gray-600">Total Badges</div>
              <div className="font-bold text-purple-600">
                {processedUsers.reduce((sum, u) => sum + u.achievementCount, 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Total Levels</div>
              <div className="font-bold text-orange-600">
                {processedUsers.reduce((sum, u) => sum + u.completedLevels, 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Avg Time</div>
              <div className="font-bold text-indigo-600">
                {formatTime(
                  Math.round(
                    processedUsers.reduce(
                      (sum, u) => sum + u.avgTimeMinutes,
                      0
                    ) / processedUsers.length
                  )
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Total Attempts</div>
              <div className="font-bold text-red-600">
                {processedUsers.reduce((sum, u) => sum + u.totalAttempts, 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsTable;
