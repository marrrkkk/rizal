/**
 * SystemAnalytics Component
 * Displays comprehensive system analytics with visualizations
 * Implements aggregate statistics, charts, activity timeline, and system health indicators
 */

import { useState, useEffect } from "react";
import {
  getSystemStatistics,
  getPopularLevels,
  getDifficultLevels,
  getRecentActivity,
  getChapterStatistics,
  getLevelDifficultyMetrics,
} from "../utils/adminDataManager";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

const SystemAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [popularLevels, setPopularLevels] = useState([]);
  const [difficultLevels, setDifficultLevels] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chapterStats, setChapterStats] = useState([]);
  const [difficultyMetrics, setDifficultyMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, [retryCount]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, popular, difficult, activity, chapters, difficulty] =
        await Promise.all([
          getSystemStatistics(),
          getPopularLevels(10),
          getDifficultLevels(10),
          getRecentActivity(20),
          getChapterStatistics(),
          getLevelDifficultyMetrics(),
        ]);

      setStats(statsData);
      setPopularLevels(popular);
      setDifficultLevels(difficult);
      setRecentActivity(activity);
      setChapterStats(chapters);
      setDifficultyMetrics(difficulty);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setError(error.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const getChapterName = (chapterId) => {
    const names = {
      1: "Childhood",
      2: "Education",
      3: "Europe",
      4: "Noli Me Tangere",
      5: "Return & Legacy",
      6: "Exile",
    };
    return names[chapterId] || `Ch ${chapterId}`;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  // Chart rendering helper - Simple bar chart
  const renderBarChart = (data, maxValue, color = "blue") => {
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Difficulty color helper
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Very Hard":
        return "red";
      case "Hard":
        return "orange";
      case "Medium":
        return "yellow";
      case "Easy":
        return "green";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <AdminLoadingState type="stats" message="Loading analytics data..." />
    );
  }

  if (error) {
    return (
      <AdminErrorMessage
        error={error}
        onRetry={handleRetry}
        title="Failed to Load Analytics"
        showDetails={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          System Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-blue-800 mt-1">Total Users</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
            <div className="text-sm text-green-800 mt-1">Active (7d)</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalLevelsCompleted}
            </div>
            <div className="text-sm text-purple-800 mt-1">Levels Done</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.avgCompletionRate}%
            </div>
            <div className="text-sm text-orange-800 mt-1">Avg Completion</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">
              {stats.totalAchievements}
            </div>
            <div className="text-sm text-pink-800 mt-1">Achievements</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats.avgScore}
            </div>
            <div className="text-sm text-indigo-800 mt-1">Avg Score</div>
          </div>
        </div>

        {/* System Health Indicator */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              System Health
            </span>
            <span className="text-sm font-bold text-green-600">
              {stats.activeUsers > 0 ? "Healthy" : "Inactive"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                stats.activeUsers > stats.totalUsers * 0.5
                  ? "bg-green-500"
                  : stats.activeUsers > 0
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {stats.activeUsers} of {stats.totalUsers} users active in the last 7
            days
          </p>
        </div>
      </div>

      {/* Chapter Performance Chart */}
      {chapterStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">📚</span>
            Chapter Performance Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completions by Chapter */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">
                Total Completions by Chapter
              </h4>
              {renderBarChart(
                chapterStats.map((ch) => ({
                  label: `Ch ${ch.chapterId}`,
                  value: ch.totalCompletions,
                })),
                Math.max(...chapterStats.map((ch) => ch.totalCompletions), 1),
                "blue"
              )}
            </div>

            {/* Average Scores by Chapter */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">
                Average Scores by Chapter
              </h4>
              {renderBarChart(
                chapterStats.map((ch) => ({
                  label: `Ch ${ch.chapterId}`,
                  value: ch.avgScore,
                })),
                100,
                "green"
              )}
            </div>
          </div>

          {/* Chapter Details Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Chapter
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Users
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Completions
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Avg Score
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Avg Attempts
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Hints Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {chapterStats.map((chapter) => (
                  <tr
                    key={chapter.chapterId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {getChapterName(chapter.chapterId)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {chapter.uniqueUsers}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {chapter.totalCompletions}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          chapter.avgScore >= 80
                            ? "bg-green-100 text-green-800"
                            : chapter.avgScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {chapter.avgScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {chapter.avgAttempts}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {chapter.totalHintsUsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Level Difficulty Heatmap */}
      {difficultyMetrics.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            Level Difficulty Heatmap
          </h3>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-6 gap-2">
                {/* Header */}
                <div className="font-semibold text-gray-700 text-sm">
                  Chapter
                </div>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className="font-semibold text-gray-700 text-sm text-center"
                  >
                    L{level}
                  </div>
                ))}

                {/* Difficulty cells */}
                {[1, 2, 3, 4, 5, 6].map((chapterId) => (
                  <>
                    <div
                      key={`ch-${chapterId}`}
                      className="font-medium text-gray-700 text-sm"
                    >
                      Ch {chapterId}
                    </div>
                    {[1, 2, 3, 4, 5].map((levelId) => {
                      const metric = difficultyMetrics.find(
                        (m) =>
                          m.chapterId === chapterId && m.levelId === levelId
                      );

                      if (!metric) {
                        return (
                          <div
                            key={`${chapterId}-${levelId}`}
                            className="bg-gray-100 rounded-lg p-3 text-center"
                          >
                            <span className="text-xs text-gray-400">N/A</span>
                          </div>
                        );
                      }

                      const color = getDifficultyColor(metric.difficultyLevel);
                      return (
                        <div
                          key={`${chapterId}-${levelId}`}
                          className={`bg-${color}-100 border-2 border-${color}-300 rounded-lg p-3 text-center hover:shadow-lg transition-all cursor-pointer group relative`}
                          title={`${metric.difficultyLevel} - Avg Score: ${metric.avgScore}, Attempts: ${metric.avgAttempts}`}
                        >
                          <div
                            className={`text-lg font-bold text-${color}-800`}
                          >
                            {metric.avgScore}
                          </div>
                          <div className="text-xs text-gray-600">
                            {metric.completionRate}%
                          </div>

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                              <div className="font-bold mb-1">
                                {metric.difficultyLevel}
                              </div>
                              <div>Score: {metric.avgScore}</div>
                              <div>Attempts: {metric.avgAttempts}</div>
                              <div>Hints: {metric.avgHints}</div>
                              <div>Completion: {metric.completionRate}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-300 rounded"></div>
                  <span className="text-gray-700">Easy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                  <span className="text-gray-700">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-300 rounded"></div>
                  <span className="text-gray-700">Hard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-300 rounded"></div>
                  <span className="text-gray-700">Very Hard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {[
              { id: "popular", label: "Popular Levels", icon: "🔥" },
              { id: "difficult", label: "Difficult Levels", icon: "⚠️" },
              { id: "activity", label: "Recent Activity", icon: "📈" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Popular Levels */}
          {activeTab === "popular" && (
            <div>
              <h4 className="font-bold text-gray-800 mb-4">
                Most Completed Levels
              </h4>
              {popularLevels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">📚</span>
                  <p>No level data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {popularLevels.map((level, index) => (
                    <div
                      key={`${level.chapterId}-${level.levelId}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {getChapterName(level.chapterId)} - Level{" "}
                            {level.levelId}
                          </div>
                          <div className="text-sm text-gray-600">
                            {level.completionCount} completions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {level.avgScore}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(level.avgTimeMinutes)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Difficult Levels */}
          {activeTab === "difficult" && (
            <div>
              <h4 className="font-bold text-gray-800 mb-4">
                Challenging Levels (Lowest Scores)
              </h4>
              {difficultLevels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🎯</span>
                  <p>No difficulty data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {difficultLevels.map((level, index) => (
                    <div
                      key={`${level.chapterId}-${level.levelId}`}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          ⚠️
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {getChapterName(level.chapterId)} - Level{" "}
                            {level.levelId}
                          </div>
                          <div className="text-sm text-gray-600">
                            {level.attemptCount} attempts • Avg{" "}
                            {level.avgAttempts} tries
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {level.avgScore}
                        </div>
                        <div className="text-xs text-gray-500">
                          {level.avgHints} hints used
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Activity */}
          {activeTab === "activity" && (
            <div>
              <h4 className="font-bold text-gray-800 mb-4">
                Recent Activity Timeline
              </h4>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">📅</span>
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {activity.type === "level_completed" ? "✅" : "🏅"}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            <span className="font-bold">
                              {activity.username}
                            </span>
                            {activity.type === "level_completed" ? (
                              <>
                                {" "}
                                completed{" "}
                                <span className="text-blue-600">
                                  {getChapterName(activity.chapterId)} - Level{" "}
                                  {activity.levelId}
                                </span>
                              </>
                            ) : (
                              " earned an achievement"
                            )}
                          </div>
                          {activity.type === "level_completed" && (
                            <div className="text-xs text-gray-600">
                              Score: {activity.finalScore}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
