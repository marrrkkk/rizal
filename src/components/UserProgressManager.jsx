/**
 * User Progress Manager Component
 * Displays user progress and provides file export/import functionality
 */

import { useState } from "react";
import { useUserProgress } from "../hooks/useUserProgress";
import BadgeGallery from "./BadgeGallery";

const UserProgressManager = ({ username, className = "" }) => {
  const {
    progress,
    statistics,
    loading,
    error,
    exportProgress,
    importProgress,
    refreshProgress,
    getAllBadges,
    getOverallProgress,
  } = useUserProgress(username);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setMessage("");

      await exportProgress();
      setMessage("✅ Progress exported successfully!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`❌ Export failed: ${error.message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setMessage("");

      const result = await importProgress();

      if (result.success) {
        setMessage("✅ Progress imported successfully!");
        refreshProgress();
      } else {
        setMessage(`❌ Import failed: ${result.error}`);
      }

      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage(`❌ Import failed: ${error.message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            Error Loading Progress
          </h3>
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={refreshProgress}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!progress || !statistics) {
    return (
      <div
        className={`bg-gray-50 border border-gray-200 rounded-xl p-6 ${className}`}
      >
        <p className="text-gray-600">
          No progress data available for {username}
        </p>
      </div>
    );
  }

  const badges = getAllBadges();
  const completionPercentage = getOverallProgress();

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">👤</span>
            {username}'s Progress
          </h3>
          <p className="text-sm text-gray-600">
            Last played:{" "}
            {statistics.lastPlayed
              ? new Date(statistics.lastPlayed).toLocaleDateString()
              : "Never"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {completionPercentage}%
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statistics.totalLevelsCompleted}
          </div>
          <div className="text-xs text-blue-800">Levels Completed</div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statistics.averageScore}%
          </div>
          <div className="text-xs text-green-800">Average Score</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {badges.length}
          </div>
          <div className="text-xs text-purple-800">Badges Earned</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {statistics.currentStreak}
          </div>
          <div className="text-xs text-orange-800">Day Streak</div>
        </div>
      </div>

      {/* Time Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">⏱️ Time Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Time:</span>
            <span className="ml-2 font-medium">
              {Math.floor(statistics.totalTimeSpent / 60)} minutes
            </span>
          </div>
          <div>
            <span className="text-gray-600">Avg per Level:</span>
            <span className="ml-2 font-medium">
              {Math.floor(statistics.averageTimePerLevel / 60)} min{" "}
              {statistics.averageTimePerLevel % 60} sec
            </span>
          </div>
          <div>
            <span className="text-gray-600">Games Played:</span>
            <span className="ml-2 font-medium">{statistics.gamesPlayed}</span>
          </div>
          <div>
            <span className="text-gray-600">Perfect Scores:</span>
            <span className="ml-2 font-medium">{statistics.perfectScores}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Badge Gallery */}
      <div className="mb-6">
        <BadgeGallery badges={badges} />
      </div>

      {/* File Operations */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">
          💾 Progress Management
        </h4>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="mr-2">📤</span>
            {isExporting ? "Exporting..." : "Export Progress"}
          </button>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="mr-2">📥</span>
            {isImporting ? "Importing..." : "Import Progress"}
          </button>

          <button
            onClick={refreshProgress}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("✅")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Export:</strong> Download your progress as a backup file
          </p>
          <p>
            <strong>Import:</strong> Load progress from a previously exported
            file
          </p>
          <p>
            <strong>Note:</strong> Progress is automatically saved to your
            browser's local storage
          </p>
        </div>
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            🔍 Debug Information
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(
              { statistics, progress: progress?.overall },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
};

export default UserProgressManager;
