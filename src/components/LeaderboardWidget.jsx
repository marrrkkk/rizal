import { useState, useEffect } from "react";
import {
  getDetailedLeaderboard,
  refreshLeaderboard,
} from "../utils/leaderboardManager";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

/**
 * LeaderboardWidget - Displays top 5 students with rankings
 * Shows student names, scores, completion rates, and achievement badges
 * Features special styling for 1st, 2nd, and 3rd place
 */
const LeaderboardWidget = ({
  limit = 5,
  autoRefresh = false,
  refreshInterval = 30000,
}) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDetailedLeaderboard(limit);
      setLeaderboard(data);
      setLastUpdated(new Date());
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError(err.message || "Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh handler with retry tracking
  const handleRefresh = async () => {
    setRetryCount((prev) => prev + 1);
    await loadLeaderboard();
  };

  // Initial load
  useEffect(() => {
    loadLeaderboard();
  }, [limit]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLeaderboard();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Get rank styling based on position
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
          text: "text-yellow-900",
          icon: "👑",
          border: "border-yellow-400",
          shadow: "shadow-yellow-200",
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-gray-300 to-gray-400",
          text: "text-gray-900",
          icon: "🥈",
          border: "border-gray-400",
          shadow: "shadow-gray-200",
        };
      case 3:
        return {
          bg: "bg-gradient-to-r from-orange-400 to-orange-500",
          text: "text-orange-900",
          icon: "🥉",
          border: "border-orange-400",
          shadow: "shadow-orange-200",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-blue-100",
          text: "text-blue-900",
          icon: "🎯",
          border: "border-blue-200",
          shadow: "shadow-blue-100",
        };
    }
  };

  // Format time display
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            Top Students
          </h3>
        </div>
        <AdminLoadingState type="spinner" message="Loading leaderboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            Top Students
          </h3>
        </div>
        <AdminErrorMessage
          error={error}
          onRetry={handleRefresh}
          title="Failed to Load Leaderboard"
          showDetails={false}
        />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            Top Students
          </h3>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-gray-600">
            No students have completed any levels yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Be the first to appear on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">🏆</span>
          Top Students
        </h3>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh leaderboard"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3">
        {leaderboard.map((student) => {
          const rankStyle = getRankStyle(student.rank);
          const isTopThree = student.rank <= 3;

          return (
            <div
              key={student.userId}
              className={`
                relative rounded-xl border-2 ${rankStyle.border} ${
                rankStyle.shadow
              } 
                shadow-lg transition-all duration-300 hover:scale-102 hover:shadow-xl
                ${isTopThree ? "p-4" : "p-3"}
              `}
            >
              {/* Rank Badge */}
              <div className="flex items-start space-x-4">
                <div
                  className={`
                    flex-shrink-0 ${rankStyle.bg} ${rankStyle.text} 
                    rounded-lg flex items-center justify-center font-bold
                    ${isTopThree ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg"}
                  `}
                >
                  {isTopThree ? rankStyle.icon : `#${student.rank}`}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`font-bold truncate ${
                        isTopThree ? "text-lg" : "text-base"
                      }`}
                    >
                      {student.username}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {student.badges &&
                        student.badges.slice(0, 3).map((badge, idx) => (
                          <span
                            key={idx}
                            className="text-lg"
                            title={badge.name}
                          >
                            {getBadgeIcon(badge.type)}
                          </span>
                        ))}
                      {student.badges && student.badges.length > 3 && (
                        <span className="text-xs text-gray-500 font-medium">
                          +{student.badges.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Total Score</p>
                      <p className="font-bold text-blue-600">
                        {student.totalScore.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Completion</p>
                      <p className="font-bold text-green-600">
                        {student.completionRate}%
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Avg Time</p>
                      <p className="font-bold text-purple-600">
                        {formatTime(student.avgTimeMinutes)}
                      </p>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>📚 {student.completedLevels} levels completed</span>
                    <span>🏅 {student.achievementCount} achievements</span>
                  </div>
                </div>
              </div>

              {/* Top 3 Special Effects */}
              {isTopThree && (
                <div className="absolute -top-1 -right-1">
                  <div className={`${rankStyle.bg} rounded-full p-1 shadow-lg`}>
                    <span className="text-xs font-bold">{rankStyle.icon}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Rankings based on total score, completion rate, and achievements
        </p>
      </div>
    </div>
  );
};

// Helper function to get badge icon based on type
const getBadgeIcon = (type) => {
  const icons = {
    milestone: "⭐",
    chapter: "🌟",
    performance: "💎",
    ultimate: "👑",
    speed: "⚡",
    mastery: "📚",
  };
  return icons[type] || "🏅";
};

export default LeaderboardWidget;
