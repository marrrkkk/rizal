/**
 * Admin Dashboard Page
 * Comprehensive admin interface with user management, analytics, and leaderboard
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initDatabase } from "../utils/database";
import ResponsiveContainer from "../components/ResponsiveContainer";
import AdminErrorBoundary from "../components/AdminErrorBoundary";
import AdminLoadingState from "../components/AdminLoadingState";
import AdminErrorMessage from "../components/AdminErrorMessage";
import UserStatsTable from "../components/UserStatsTable";
import UserDetailModal from "../components/UserDetailModal";
import SystemAnalytics from "../components/SystemAnalytics";
import LeaderboardWidget from "../components/LeaderboardWidget";
import { getAllUsersData } from "../utils/adminDataManager";

const AdminDashboard = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  ];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize database
      await initDatabase();

      // Load users data
      await loadUsersData();
    } catch (err) {
      console.error("Failed to initialize admin dashboard:", err);
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    try {
      const usersData = await getAllUsersData();
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load users:", err);
      throw err;
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserUpdate = async () => {
    await loadUsersData();
  };

  const handleRefresh = async () => {
    await initializeData();
  };

  if (loading) {
    return (
      <AdminErrorBoundary>
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
          <header className="glass-card sticky top-0 z-10 modern-shadow">
            <ResponsiveContainer className="py-6 sm:py-8 flex justify-between items-center">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Back to Home"
                >
                  <span className="text-2xl">🏠</span>
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    José Rizal Learning Progress Overview
                  </p>
                </div>
              </div>
              <button onClick={onLogout} className="btn-kid-warning">
                <span className="text-sm">👋 Logout</span>
              </button>
            </ResponsiveContainer>
          </header>
          <main className="w-full">
            <ResponsiveContainer className="py-6 sm:py-8">
              <AdminLoadingState
                type="default"
                message="Loading admin dashboard..."
              />
            </ResponsiveContainer>
          </main>
        </div>
      </AdminErrorBoundary>
    );
  }

  if (error) {
    return (
      <AdminErrorBoundary>
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
          <header className="glass-card sticky top-0 z-10 modern-shadow">
            <ResponsiveContainer className="py-6 sm:py-8 flex justify-between items-center">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Back to Home"
                >
                  <span className="text-2xl">🏠</span>
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    José Rizal Learning Progress Overview
                  </p>
                </div>
              </div>
              <button onClick={onLogout} className="btn-kid-warning">
                <span className="text-sm">👋 Logout</span>
              </button>
            </ResponsiveContainer>
          </header>
          <main className="w-full">
            <ResponsiveContainer className="py-6 sm:py-8">
              <AdminErrorMessage
                error={error}
                onRetry={handleRefresh}
                title="Failed to Load Dashboard"
                showDetails={true}
              />
            </ResponsiveContainer>
          </main>
        </div>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <header className="glass-card sticky top-0 z-10 modern-shadow">
          <ResponsiveContainer className="py-6 sm:py-8 flex justify-between items-center">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Back to Home"
              >
                <span className="text-2xl">🏠</span>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  José Rizal Learning Progress Overview
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh data"
              >
                <svg
                  className="w-5 h-5"
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
              <button onClick={onLogout} className="btn-kid-warning">
                <span className="text-sm">👋 Logout</span>
              </button>
            </div>
          </ResponsiveContainer>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-[88px] z-10">
          <ResponsiveContainer className="py-4">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </ResponsiveContainer>
        </div>

        {/* Main Content */}
        <main className="w-full">
          <ResponsiveContainer className="py-6 sm:py-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to the Admin Dashboard! 👨‍🏫
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Monitor student progress, manage users, view analytics, and
                    track learning outcomes in the José Rizal educational
                    adventure.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {users.length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Users
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {users.reduce((sum, u) => sum + u.completedLevels, 0)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Levels Completed
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {users.reduce((sum, u) => sum + u.achievementCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Badges
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {users.length > 0
                        ? Math.round(
                            users.reduce(
                              (sum, u) => sum + u.completionRate,
                              0
                            ) / users.length
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Avg Completion
                    </div>
                  </div>
                </div>

                {/* Leaderboard */}
                <LeaderboardWidget limit={5} />

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-kid p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🎯</span>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab("users")}
                        className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <div className="font-medium text-blue-800">
                          Manage Users
                        </div>
                        <div className="text-sm text-blue-600">
                          View, edit, and manage student accounts
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <div className="font-medium text-green-800">
                          View Analytics
                        </div>
                        <div className="text-sm text-green-600">
                          Explore learning trends and insights
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("leaderboard")}
                        className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <div className="font-medium text-purple-800">
                          Leaderboard
                        </div>
                        <div className="text-sm text-purple-600">
                          See top performing students
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="card-kid p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">💡</span>
                      Tips for Educators
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Encourage students to complete levels in order for the
                          best learning experience
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>
                          Use the badge system to motivate and recognize
                          achievements
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          Monitor difficult levels to provide targeted support
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>
                          Review analytics regularly to track class progress
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    User Management
                  </h2>
                  <p className="text-gray-600">
                    View detailed user statistics, manage accounts, and track
                    individual progress.
                  </p>
                </div>
                <UserStatsTable
                  users={users}
                  onUserClick={handleUserClick}
                  loading={false}
                  error={null}
                  onRetry={handleRefresh}
                />
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    System Analytics
                  </h2>
                  <p className="text-gray-600">
                    Comprehensive analytics and insights about learning patterns
                    and system usage.
                  </p>
                </div>
                <SystemAnalytics />
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Student Leaderboard
                  </h2>
                  <p className="text-gray-600">
                    Top performing students based on scores, completion rates,
                    and achievements.
                  </p>
                </div>
                <LeaderboardWidget limit={10} autoRefresh={true} />
              </div>
            )}
          </ResponsiveContainer>
        </main>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            onUpdate={handleUserUpdate}
          />
        )}
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
