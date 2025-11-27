/**
 * UserDetailModal Component
 * Displays detailed user information with edit and delete capabilities
 */

import { useState, useEffect } from "react";
import { getUserDetailedProgress } from "../utils/adminDataManager";
import {
  updateUser,
  deleteUser,
  resetUserProgress,
} from "../utils/userManagement";
import AdminLoadingState from "./AdminLoadingState";
import AdminErrorMessage from "./AdminErrorMessage";

// Icons
const Icons = {
  Star: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Trophy: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Diamond: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Crown: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Lightning: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Book: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Medal: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Warning: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Loading: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`animate-spin ${props.className}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Save: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
  Edit: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Reset: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Delete: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Close: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
};

const UserDetailModal = ({ user, onClose, onUpdate }) => {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDetailedData();
  }, [user.userId]);

  const loadDetailedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserDetailedProgress(user.userId);
      if (!data) {
        throw new Error("User data not found");
      }
      setDetailedData(data);
    } catch (err) {
      console.error("Failed to load user details:", err);
      setError(err.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (editing) {
      // Save changes
      setActionLoading(true);
      setActionError(null);
      try {
        const success = await updateUser(user.userId, editForm);
        if (success) {
          setEditing(false);
          onUpdate && onUpdate();
        } else {
          setActionError("Failed to update user");
        }
      } catch (err) {
        setActionError(err.message || "Failed to update user");
      } finally {
        setActionLoading(false);
      }
    } else {
      setEditing(true);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const success = await deleteUser(user.userId);
      if (success) {
        onUpdate && onUpdate();
        onClose();
      } else {
        setActionError("Failed to delete user");
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      setActionError(err.message || "Failed to delete user");
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const success = await resetUserProgress(user.userId);
      if (success) {
        setShowResetConfirm(false);
        await loadDetailedData();
        onUpdate && onUpdate();
      } else {
        setActionError("Failed to reset user progress");
        setShowResetConfirm(false);
      }
    } catch (err) {
      setActionError(err.message || "Failed to reset user progress");
      setShowResetConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  const getChapterName = (chapterId) => {
    const names = {
      1: "Childhood in Calamba",
      2: "Education in Manila",
      3: "Studies Abroad",
      4: "Noli Me Tangere",
      5: "Return to the Philippines",
      6: "Exile and Legacy",
    };
    return names[chapterId] || `Chapter ${chapterId}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getBadgeIcon = (type) => {
    const icons = {
      milestone: Icons.Star,
      chapter: Icons.Trophy,
      performance: Icons.Diamond,
      ultimate: Icons.Crown,
      speed: Icons.Lightning,
      mastery: Icons.Book,
    };
    return icons[type] || Icons.Medal;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    className="text-2xl font-bold bg-white/20 px-3 py-1 rounded text-white"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                )}
                {editing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="text-sm bg-white/20 px-3 py-1 rounded text-white mt-1"
                  />
                ) : (
                  <p className="text-blue-100">{user.email}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <Icons.Close className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <AdminLoadingState
              type="spinner"
              message="Loading user details..."
            />
          </div>
        ) : error ? (
          <div className="p-6">
            <AdminErrorMessage
              error={error}
              onRetry={loadDetailedData}
              title="Failed to Load User Details"
              showDetails={true}
            />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user.totalScore.toLocaleString()}
                </div>
                <div className="text-sm text-blue-800">Total Score</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {user.completedLevels}
                </div>
                <div className="text-sm text-green-800">Levels Completed</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {user.achievementCount}
                </div>
                <div className="text-sm text-purple-800">Achievements</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {user.completionRate}%
                </div>
                <div className="text-sm text-orange-800">Completion Rate</div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account Created:</span>
                  <span className="ml-2 font-medium">
                    {formatDate(user.accountCreated)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Played:</span>
                  <span className="ml-2 font-medium">
                    {formatDate(user.lastPlayed)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Attempts:</span>
                  <span className="ml-2 font-medium">{user.totalAttempts}</span>
                </div>
                <div>
                  <span className="text-gray-600">Hints Used:</span>
                  <span className="ml-2 font-medium">
                    {user.totalHintsUsed}
                  </span>
                </div>
              </div>
            </div>

            {/* Chapter Progress */}
            {detailedData && detailedData.chapterProgress && (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">
                  Chapter Progress
                </h3>
                <div className="space-y-3">
                  {Object.values(detailedData.chapterProgress).map(
                    (chapter) => (
                      <div
                        key={chapter.chapterId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {getChapterName(chapter.chapterId)}
                          </h4>
                          <span className="text-sm text-gray-600">
                            {chapter.completedCount}/5 levels
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {chapter.levels.map((level) => (
                            <div
                              key={level.levelId}
                              className={`p-2 rounded text-center text-xs ${level.isCompleted
                                  ? "bg-green-100 text-green-800"
                                  : level.isUnlocked
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                            >
                              <div className="font-bold">L{level.levelId}</div>
                              {level.isCompleted && (
                                <div className="text-xs">
                                  {level.finalScore}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Achievements */}
            {detailedData &&
              detailedData.achievements &&
              detailedData.achievements.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedData.achievements.map((achievement, idx) => {
                      const BadgeIcon = getBadgeIcon(achievement.type);
                      return (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3"
                        >
                          <span className="text-2xl text-yellow-600">
                            <BadgeIcon className="w-8 h-8" />
                          </span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">
                              {achievement.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDate(achievement.earnedAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Action Error Display */}
            {actionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">
                    <Icons.Warning className="w-5 h-5" />
                  </span>
                  <p className="text-red-700">{actionError}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${editing
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {actionLoading ? (
                  <>
                    <Icons.Loading className="w-4 h-4" /> Processing...
                  </>
                ) : editing ? (
                  <>
                    <Icons.Save className="w-4 h-4" /> Save Changes
                  </>
                ) : (
                  <>
                    <Icons.Edit className="w-4 h-4" /> Edit User
                  </>
                )}
              </button>

              {editing && (
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditForm({ username: user.username, email: user.email });
                    setActionError(null);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => setShowResetConfirm(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icons.Reset className="w-4 h-4" /> Reset Progress
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icons.Delete className="w-4 h-4" /> Delete User
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <Icons.Warning className="w-6 h-6" /> Confirm Deletion
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{user.username}</strong>
                ? This will permanently remove all their data, progress, and
                achievements. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading ? <><Icons.Loading className="w-4 h-4" /> Deleting...</> : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <Icons.Reset className="w-6 h-6" /> Confirm Reset
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to reset all progress for{" "}
                <strong>{user.username}</strong>? This will clear all completed
                levels and achievements, but keep the user account. This action
                cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading ? <><Icons.Loading className="w-4 h-4" /> Resetting...</> : "Yes, Reset"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;
