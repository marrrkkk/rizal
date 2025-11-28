import { useState, useEffect } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import LeaderboardWidget from "./LeaderboardWidget";

const AnalyticsDashboard = ({ username, onClose }) => {
  const { userStats, progressReport, generateReport, exportData, loading } =
    useAnalytics(username);
  const [activeTab, setActiveTab] = useState("overview");
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (username && !loading) {
      const generatedReport = generateReport();
      setReport(generatedReport);
    }
  }, [username, loading, generateReport]);

  const handleExportData = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rizal-app-analytics-${username}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "⭐";
    return "🎯";
  };

  if (loading || !report) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Learning Analytics</h2>
              <p className="text-blue-100">Detailed insights for {username}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportData}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export</span>
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "chapters", label: "Chapters", icon: "📚" },
              { id: "patterns", label: "Learning Patterns", icon: "🧠" },
              { id: "achievements", label: "Achievements", icon: "🎖️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Leaderboard - Prominent Position */}
              <div className="mb-6">
                <LeaderboardWidget limit={5} autoRefresh={false} />
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">
                        Levels Completed
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {report.summary.totalLevelsCompleted}
                      </p>
                    </div>
                    <div className="text-2xl">🎯</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">
                        Average Score
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        {Math.min(100, Math.round(report.summary.averageScore))}%
                      </p>
                    </div>
                    <div className="text-2xl">⭐</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">
                        Current Streak
                      </p>
                      <p className="text-2xl font-bold text-purple-800">
                        {report.summary.currentStreak} days
                      </p>
                    </div>
                    <div className="text-2xl">
                      {getStreakEmoji(report.summary.currentStreak)}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">
                        Time Spent
                      </p>
                      <p className="text-2xl font-bold text-orange-800">
                        {report.summary.totalTimeSpent}
                      </p>
                    </div>
                    <div className="text-2xl">⏱️</div>
                  </div>
                </div>
              </div>

              {/* Efficiency Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Learning Efficiency
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, report.summary.efficiency)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.min(100, Math.round(report.summary.efficiency))}%
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on score, completion time, and attempts
                </p>
              </div>

              {/* Recommendations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {report.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          rec.priority === "high"
                            ? "border-red-400 bg-red-50"
                            : rec.priority === "medium"
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-green-400 bg-green-50"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {rec.message}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            rec.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {rec.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Chapter Performance
              </h3>
              {Object.entries(report.chapterProgress).map(
                ([chapter, stats]) => (
                  <div
                    key={chapter}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-800">
                        Chapter {chapter}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(
                          stats.averageScore
                        )}`}
                      >
                        {stats.performance}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Levels Completed
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {stats.levelsCompleted}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Score</p>
                        <p className="text-xl font-bold text-gray-800">
                          {stats.averageScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Best Score</p>
                        <p className="text-xl font-bold text-gray-800">
                          {stats.bestScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time Spent</p>
                        <p className="text-xl font-bold text-gray-800">
                          {stats.timeFormatted}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stats.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "patterns" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Learning Patterns
              </h3>

              {/* Learning Time Preferences */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Preferred Learning Time
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {report.learningPatterns.preferredLearningHour}
                </p>
                <p className="text-sm text-gray-600">
                  Most active learning hour
                </p>
              </div>

              {/* Session Length */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Session Patterns
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Average Session</p>
                    <p className="text-xl font-bold text-gray-800">
                      {report.learningPatterns.averageSessionLength}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consistency Score</p>
                    <p className="text-xl font-bold text-gray-800">
                      {report.learningPatterns.consistencyScore}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Difficulty Performance */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Performance by Difficulty
                </h4>
                <div className="space-y-3">
                  {Object.entries(
                    report.learningPatterns.difficultyPerformance
                  ).map(([difficulty, data]) => (
                    <div
                      key={difficulty}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="capitalize font-medium text-gray-700">
                          {difficulty.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            data.performance === "strong"
                              ? "bg-green-100 text-green-700"
                              : data.performance === "moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {data.performance}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          {data.averageScore}%
                        </p>
                        <p className="text-xs text-gray-600">
                          {data.attempts} attempts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Achievements
              </h3>
              {report.achievements && report.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-bold text-yellow-800">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-yellow-700">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Earned{" "}
                            {new Date(
                              achievement.earnedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-gray-600">
                    No achievements yet. Keep learning to earn your first badge!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
