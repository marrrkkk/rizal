/**
 * UserStatsTable Component
 * Displays comprehensive user statistics with sorting and filtering
 * Minimalist Design Update
 */

import { useState, useMemo } from "react";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

// Icons
const Icons = {
  Search: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
};

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
    if (sortField !== field) return null;
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with filters */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              User Statistics
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Showing {processedUsers.length} users
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                <Icons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Completion Filter */}
            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[
                { id: 'username', label: 'User' },
                { id: 'totalScore', label: 'Score' },
                { id: 'averageScore', label: 'Avg Score' },
                { id: 'completedLevels', label: 'Progress' },
                { id: 'completionRate', label: 'Rate' },
                { id: 'achievementCount', label: 'Badges' },
                { id: 'avgTimeMinutes', label: 'Time/Lvl' },
                { id: 'totalAttempts', label: 'Attempts' },
                { id: 'lastPlayed', label: 'Last Active' },
                { id: 'actions', label: '' }
              ].map((col) => (
                <th
                  key={col.id}
                  className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.id !== 'actions' ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-700' : ''}`}
                  onClick={() => col.id !== 'actions' && handleSort(col.id)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.id !== 'actions' && (
                      <span className={`text-slate-600 ${sortField === col.id ? 'text-blue-500' : ''}`}>
                        {getSortIndicator(col.id) || '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {processedUsers.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-12 text-center">
                  <div className="text-slate-500 flex flex-col items-center">
                    <Icons.Search className="w-12 h-12 mb-2 text-slate-300" />
                    <p>No users found matching your criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {user.username}
                        </div>
                        <div className="text-xs text-slate-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-700">
                      {user.totalScore.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${user.averageScore >= 80 ? 'text-green-600' : user.averageScore >= 60 ? 'text-yellow-600' : 'text-slate-600'}`}>
                      {user.averageScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">
                      {user.completedLevels} <span className="text-slate-600">/ {user.unlockedLevels}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {user.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      {user.achievementCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">
                      {formatTime(user.avgTimeMinutes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">
                      {user.totalAttempts}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(user.lastPlayed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onUserClick && onUserClick(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Details
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
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center text-xs">
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Score</div>
              <div className="font-bold text-slate-800 text-sm">
                {processedUsers
                  .reduce((sum, u) => sum + u.totalScore, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Avg Rate</div>
              <div className="font-bold text-slate-800 text-sm">
                {Math.round(
                  processedUsers.reduce((sum, u) => sum + u.completionRate, 0) /
                  processedUsers.length
                )}
                %
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Badges</div>
              <div className="font-bold text-slate-800 text-sm">
                {processedUsers.reduce((sum, u) => sum + u.achievementCount, 0)}
              </div>
            </div>
            <div>
              <div className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Levels</div>
              <div className="font-bold text-slate-800 text-sm">
                {processedUsers.reduce((sum, u) => sum + u.completedLevels, 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsTable;
