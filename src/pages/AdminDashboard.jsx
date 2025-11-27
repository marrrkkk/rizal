/**
 * Admin Dashboard Page
 * Modern, minimalist admin interface with sidebar layout
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { initDatabase } from "../utils/database"; // Removed as we use backend API
import AdminErrorBoundary from "../components/AdminErrorBoundary";
import AdminLoadingState from "../components/AdminLoadingState";
import AdminErrorMessage from "../components/AdminErrorMessage";
import UserStatsTable from "../components/UserStatsTable";
import UserDetailModal from "../components/UserDetailModal";
import SystemAnalytics from "../components/SystemAnalytics";
import LeaderboardWidget from "../components/LeaderboardWidget";
import { getAllUsersData } from "../utils/adminDataManager";

// Icons
const Icons = {
  Overview: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Users: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Analytics: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
  Leaderboard: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Logout: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Menu: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Home: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Admin: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Check: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Badge: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Chart: (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
};

const AdminDashboard = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: Icons.Overview },
    { id: "users", label: "User Management", icon: Icons.Users },
    { id: "analytics", label: "Analytics", icon: Icons.Analytics },
    { id: "leaderboard", label: "Leaderboard", icon: Icons.Leaderboard },
  ];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Backend API is used instead of client-side DB
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

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <AdminLoadingState type="default" message="Loading dashboard..." />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
          <AdminErrorMessage
            error={error}
            onRetry={handleRefresh}
            title="Dashboard Error"
            showDetails={true}
          />
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full py-2 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 shadow-sm z-20">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Icons.Admin className="w-8 h-8 text-blue-600" />
              <span>Admin</span>
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
            >
              <Icons.Home className="w-5 h-5 mr-3" /> Home
            </button>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icons.Logout className="w-5 h-5 mr-3" /> Logout
            </button>
          </div>
        </aside>

        {/* Mobile Header & Overlay */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Icons.Admin className="w-6 h-6 text-blue-600" /> Admin
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-xl flex flex-col animate-slide-right">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Menu</h2>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg mb-2"
                >
                  <Icons.Home className="w-5 h-5 mr-3" /> Home
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Icons.Logout className="w-5 h-5 mr-3" /> Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">

              {/* Page Header */}
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-slate-500 mt-1">
                    {activeTab === 'overview' && "Welcome back to your dashboard."}
                    {activeTab === 'users' && "Manage student accounts and progress."}
                    {activeTab === 'analytics' && "Insights into learning performance."}
                    {activeTab === 'leaderboard' && "Top performing students."}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Refresh Data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>

              {/* Tab Content */}
              <div className="animate-fade-in">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        label="Total Users"
                        value={users.length}
                        icon={Icons.Users}
                        color="blue"
                      />
                      <StatCard
                        label="Levels Completed"
                        value={users.reduce((sum, u) => sum + u.completedLevels, 0)}
                        icon={Icons.Check}
                        color="green"
                      />
                      <StatCard
                        label="Badges Earned"
                        value={users.reduce((sum, u) => sum + u.achievementCount, 0)}
                        icon={Icons.Badge}
                        color="purple"
                      />
                      <StatCard
                        label="Avg Completion"
                        value={`${users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.completionRate, 0) / users.length) : 0}%`}
                        icon={Icons.Chart}
                        color="orange"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Leaderboard Preview */}
                      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-slate-800">Top Students</h3>
                          <button
                            onClick={() => setActiveTab('leaderboard')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View All
                          </button>
                        </div>
                        <LeaderboardWidget limit={5} compact={true} />
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <ActionButton
                            onClick={() => setActiveTab("users")}
                            icon={Icons.Users}
                            title="Manage Users"
                            desc="View and edit accounts"
                            color="blue"
                          />
                          <ActionButton
                            onClick={() => setActiveTab("analytics")}
                            icon={Icons.Analytics}
                            title="View Analytics"
                            desc="Check performance trends"
                            color="green"
                          />
                        </div>

                        <div className="mt-8">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Tips</h3>
                          <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>Check analytics weekly to identify struggling students.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>Encourage badge collection for motivation.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "users" && (
                  <UserStatsTable
                    users={users}
                    onUserClick={handleUserClick}
                    loading={false}
                    error={null}
                    onRetry={handleRefresh}
                  />
                )}

                {activeTab === "analytics" && (
                  <SystemAnalytics />
                )}

                {activeTab === "leaderboard" && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <LeaderboardWidget limit={20} autoRefresh={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
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

// Helper Components
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon: Icon, title, desc, color }) => {
  const hoverClasses = {
    blue: "hover:bg-blue-50 hover:border-blue-200",
    green: "hover:bg-green-50 hover:border-green-200",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border border-slate-100 transition-all duration-200 group ${hoverClasses[color] || "hover:bg-slate-50"}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <div className="font-bold text-slate-800">{title}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
      </div>
    </button>
  );
};

export default AdminDashboard;
