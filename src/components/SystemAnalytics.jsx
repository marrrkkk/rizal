/**
 * SystemAnalytics Component
 * Displays comprehensive system analytics with visualizations
 * Minimalist Design Update
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

// Icons
const Icons = {
  Users: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Chart: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
  Check: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Badge: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Fire: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  Warning: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Star: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Clock: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const SystemAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [popularLevels, setPopularLevels] = useState([]);
  const [difficultLevels, setDifficultLevels] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chapterStats, setChapterStats] = useState([]);
  const [difficultyMetrics, setDifficultyMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("popular");
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
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className="w-24 font-medium text-slate-600 truncate text-right">
              {item.label}
            </div>
            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${colorClasses[color] || "bg-slate-500"} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-12 font-bold text-slate-700 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Difficulty color helper
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Very Hard": return "red";
      case "Hard": return "orange";
      case "Medium": return "yellow";
      case "Easy": return "green";
      default: return "slate";
    }
  };

  if (loading) {
    return <AdminLoadingState type="stats" message="Loading analytics data..." />;
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          System Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, color: "blue" },
            { label: "Active (7d)", value: stats.activeUsers, color: "green" },
            { label: "Levels Done", value: stats.totalLevelsCompleted, color: "purple" },
            { label: "Completion", value: `${stats.avgCompletionRate}%`, color: "orange" },
            { label: "Badges", value: stats.totalAchievements, color: "pink" },
            { label: "Avg Score", value: stats.avgScore, color: "indigo" },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-${stat.color}-50 rounded-lg p-4 text-center border border-${stat.color}-100`}>
              <div className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className={`text-xs font-medium text-${stat.color}-700 mt-1 uppercase tracking-wide`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* System Health Indicator */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              System Health
            </span>
            <span className={`text-sm font-bold ${stats.activeUsers > 0 ? "text-green-600" : "text-slate-500"}`}>
              {stats.activeUsers > 0 ? "Healthy" : "Inactive"}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${stats.activeUsers > stats.totalUsers * 0.5
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
          <p className="text-xs text-slate-500 mt-2">
            {stats.activeUsers} of {stats.totalUsers} users active in the last 7 days
          </p>
        </div>
      </div>

      {/* Chapter Performance Chart */}
      {chapterStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Chapter Performance Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Completions by Chapter */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Total Completions
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
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Average Scores
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
        </div>
      )}

      {/* Level Difficulty Heatmap */}
      {difficultyMetrics.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Level Difficulty Heatmap
          </h3>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-6 gap-2">
                {/* Header */}
                <div className="font-semibold text-slate-500 text-xs uppercase tracking-wider py-2">
                  Chapter
                </div>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className="font-semibold text-slate-500 text-xs uppercase tracking-wider text-center py-2"
                  >
                    L{level}
                  </div>
                ))}

                {/* Difficulty cells */}
                {[1, 2, 3, 4, 5, 6].map((chapterId) => (
                  <>
                    <div
                      key={`ch-${chapterId}`}
                      className="font-medium text-slate-700 text-sm py-3"
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
                            className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100"
                          >
                            <span className="text-xs text-slate-300">-</span>
                          </div>
                        );
                      }

                      const color = getDifficultyColor(metric.difficultyLevel);
                      return (
                        <div
                          key={`${chapterId}-${levelId}`}
                          className={`bg-${color}-50 border border-${color}-200 rounded-lg p-2 text-center hover:shadow-md transition-all cursor-help group relative`}
                        >
                          <div className={`text-lg font-bold text-${color}-700`}>
                            {metric.avgScore}
                          </div>
                          <div className={`text-xs text-${color}-600`}>
                            {metric.completionRate}%
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-48">
                            <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl">
                              <div className="font-bold mb-2 border-b border-slate-700 pb-1">
                                {metric.difficultyLevel} Difficulty
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span>Score:</span> <span className="text-right">{metric.avgScore}</span>
                                <span>Attempts:</span> <span className="text-right">{metric.avgAttempts}</span>
                                <span>Hints:</span> <span className="text-right">{metric.avgHints}</span>
                                <span>Rate:</span> <span className="text-right">{metric.completionRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                  <span>Easy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
                  <span>Hard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                  <span>Very Hard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="flex space-x-1 p-2">
            {[
              { id: "popular", label: "Popular", icon: Icons.Fire },
              { id: "difficult", label: "Difficult", icon: Icons.Warning },
              { id: "activity", label: "Activity", icon: Icons.Chart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Popular Levels */}
          {activeTab === "popular" && (
            <div>
              <h4 className="font-bold text-slate-800 mb-4">
                Most Completed Levels
              </h4>
              {popularLevels.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  <p>No level data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {popularLevels.map((level, index) => (
                    <div
                      key={`${level.chapterId}-${level.levelId}`}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {getChapterName(level.chapterId)} - Level {level.levelId}
                          </div>
                          <div className="text-xs text-slate-500">
                            {level.completionCount} completions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {level.avgScore}
                        </div>
                        <div className="text-xs text-slate-600">
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
              <h4 className="font-bold text-slate-800 mb-4">
                Challenging Levels (Lowest Scores)
              </h4>
              {difficultLevels.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  <p>No difficulty data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {difficultLevels.map((level, index) => (
                    <div
                      key={`${level.chapterId}-${level.levelId}`}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                          <Icons.Warning className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">
                            {getChapterName(level.chapterId)} - Level {level.levelId}
                          </div>
                          <div className="text-xs text-slate-500">
                            {level.attemptCount} attempts • Avg {level.avgAttempts} tries
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {level.avgScore}
                        </div>
                        <div className="text-xs text-slate-600">
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
              <h4 className="font-bold text-slate-800 mb-4">
                Recent Activity Timeline
              </h4>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500">
                          {activity.type === "level_completed" ? <Icons.Check className="w-5 h-5 text-green-500" /> : <Icons.Badge className="w-5 h-5 text-purple-500" />}
                        </span>
                        <div>
                          <div className="text-sm text-slate-800">
                            <span className="font-bold">
                              {activity.username}
                            </span>
                            {activity.type === "level_completed" ? (
                              <>
                                <span className="text-slate-500"> completed </span>
                                <span className="text-blue-600 font-medium">
                                  {getChapterName(activity.chapterId)} - L{activity.levelId}
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-500"> earned an achievement</span>
                            )}
                          </div>
                          {activity.type === "level_completed" && (
                            <div className="text-xs text-slate-500">
                              Score: {activity.finalScore}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 whitespace-nowrap ml-4">
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
