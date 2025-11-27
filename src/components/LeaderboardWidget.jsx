import { useState, useEffect } from "react";
import {
  getDetailedLeaderboard,
} from "../utils/leaderboardManager";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

// Icons
const Icons = {
  Crown: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Medal: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Trophy: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Star: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  User: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
};

/**
 * LeaderboardWidget - Displays top students with rankings
 * Minimalist Design Update
 */
const LeaderboardWidget = ({
  limit = 5,
  autoRefresh = false,
  refreshInterval = 30000,
  compact = false
}) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDetailedLeaderboard(limit);
      setLeaderboard(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError(err.message || "Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = async () => {
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
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-800",
          icon: Icons.Trophy,
          border: "border-yellow-200",
        };
      case 2:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          badge: "bg-slate-200 text-slate-800",
          icon: Icons.Medal,
          border: "border-slate-200",
        };
      case 3:
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          badge: "bg-orange-100 text-orange-800",
          icon: Icons.Medal,
          border: "border-orange-200",
        };
      default:
        return {
          bg: "bg-white",
          text: "text-slate-600",
          badge: "bg-slate-100 text-slate-600",
          icon: null,
          border: "border-slate-100",
        };
    }
  };

  if (loading && leaderboard.length === 0) {
    return <AdminLoadingState type="spinner" message="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <AdminErrorMessage
        error={error}
        onRetry={handleRefresh}
        title="Failed to Load Leaderboard"
        showDetails={false}
      />
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
        <div className="flex justify-center mb-3">
          <Icons.User className="w-12 h-12 text-slate-300" />
        </div>
        <p className="text-slate-600 font-medium">No students ranked yet</p>
        <p className="text-sm text-slate-500">Be the first to complete a level!</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {leaderboard.map((student) => {
          const rankStyle = getRankStyle(student.rank);
          const RankIcon = rankStyle.icon;

          return (
            <div
              key={student.userId}
              className={`flex items-center justify-between p-3 rounded-lg border ${rankStyle.border} ${rankStyle.bg}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${rankStyle.badge}`}>
                  {student.rank <= 3 && RankIcon ? <RankIcon className="w-5 h-5" /> : student.rank}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{student.username}</div>
                  <div className="text-xs text-slate-500">{student.totalScore.toLocaleString()} pts</div>
                </div>
              </div>
              <div className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                {student.completionRate}%
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-500">
          {lastUpdated && `Updated ${lastUpdated.toLocaleTimeString()}`}
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-3">
        {leaderboard.map((student) => {
          const rankStyle = getRankStyle(student.rank);
          const RankIcon = rankStyle.icon;

          return (
            <div
              key={student.userId}
              className={`
                relative rounded-xl border ${rankStyle.border} ${rankStyle.bg}
                p-4 transition-all hover:shadow-md
              `}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`
                  flex-shrink-0 w-12 h-12 flex items-center justify-center 
                  rounded-xl font-bold text-xl ${rankStyle.badge}
                `}>
                  {student.rank <= 3 && RankIcon ? <RankIcon className="w-6 h-6" /> : student.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-800 truncate">
                      {student.username}
                    </h4>
                    <div className="flex items-center gap-1">
                      {student.badges && student.badges.slice(0, 3).map((badge, idx) => (
                        <span key={idx} title={badge.name} className="text-slate-600">
                          <Icons.Star className="w-4 h-4 text-yellow-500" />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 text-xs block">Score</span>
                      <span className="font-bold text-blue-600">{student.totalScore.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Progress</span>
                      <span className="font-bold text-green-600">{student.completionRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Avg Time</span>
                      <span className="font-bold text-purple-600">{formatTime(student.avgTimeMinutes)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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

export default LeaderboardWidget;
