import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApiSeparate from "../utils/adminApiSeparate";
import sessionManager from "../utils/SessionManager";
import sessionValidationService from "../utils/SessionValidationService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Initialize SessionValidationService dependencies
  useEffect(() => {
    // Import PersistentStorageManager if available, otherwise use a simple localStorage wrapper
    const storageManager = {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          return localStorage.getItem(key);
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (error) {
          console.error('Error setting storage item:', error);
        }
      },
      restoreAdminSession: () => sessionManager.getAdminSession(),
      restoreUserSession: () => sessionManager.getUserSession()
    };
    
    sessionValidationService.setDependencies(sessionManager, storageManager);
  }, []);

  // Check admin authentication using SessionManager
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking admin authentication...');
        
        // Use SessionManager to validate admin session
        const isValidSession = sessionManager.isAdminSessionValid();
        
        if (isValidSession) {
          console.log('✅ Admin session is valid');
          setIsAuthenticated(true);
          await loadDashboardData();
        } else {
          console.log('❌ Admin session is invalid, attempting recovery...');
          
          // Attempt session recovery
          const recoveryResult = await sessionValidationService.attemptSessionRecovery('admin');
          
          if (recoveryResult.recovered) {
            console.log('✅ Admin session recovered successfully');
            setIsAuthenticated(true);
            await loadDashboardData();
          } else {
            console.log('❌ Session recovery failed, redirecting to login');
            handleSessionExpiry();
          }
        }
      } catch (error) {
        console.error('❌ Error during authentication check:', error);
        handleSessionExpiry();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Load dashboard data with session validation
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      console.log('🔍 Loading dashboard data...');
      
      // Validate admin session before making API calls
      const validationResult = await sessionValidationService.validateAdminSession();
      
      if (!validationResult.valid) {
        console.error('❌ Admin session validation failed:', validationResult.error);
        await handleValidationFailure(validationResult.error);
        return;
      }

      console.log('✅ Admin session validated, loading data...');
      
      const [dashStats, usersData, analyticsData] = await Promise.all([
        adminApiSeparate.getDashboardStats(),
        adminApiSeparate.getUsers(currentPage, 20, searchTerm),
        adminApiSeparate.getAnalytics('7d')
      ]);

      console.log('✅ Dashboard data loaded successfully');
      setDashboardData(dashStats);
      setUsers(usersData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      await handleApiError(error);
    } finally {
      setLoadingData(false);
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Enhanced session handling methods
  const handleLogout = () => {
    console.log('🔄 Admin logout initiated');
    sessionManager.clearAdminSession();
    navigate("/admin/login");
  };

  const handleSessionExpiry = () => {
    console.log('🔄 Admin session expired, clearing and redirecting');
    sessionManager.handleSessionExpiry('admin');
  };

  const handleValidationFailure = async (error) => {
    console.error('🔄 Handling admin session validation failure:', error);
    const result = await sessionValidationService.handleValidationFailure('admin', error);
    
    if (result.action === 'redirect' && result.redirectTo) {
      navigate(result.redirectTo);
    }
  };

  const handleApiError = async (error) => {
    console.error('🔄 Handling API error:', error);
    
    // Check if it's an authentication error
    if (error.message && (
      error.message.includes('Admin access') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Token expired')
    )) {
      console.log('🔄 Authentication error detected, validating session...');
      const validationResult = await sessionValidationService.validateAdminSession();
      
      if (!validationResult.valid) {
        await handleValidationFailure(validationResult.error);
      }
    } else {
      // Show user-friendly error message for non-auth errors
      console.error('Non-authentication error:', error.message);
    }
  };

  const handleBackToGame = () => {
    navigate("/");
  };

  // User action handlers

  const handleResetUser = async (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s progress? This action cannot be undone.')) {
      try {
        // Validate admin session before making the API call
        const validationResult = await sessionValidationService.validateAdminSession();
        
        if (!validationResult.valid) {
          console.error('❌ Admin session validation failed before user reset');
          await handleValidationFailure(validationResult.error);
          return;
        }

        await adminApiSeparate.resetUserProgress(userId);
        alert('User progress reset successfully');
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('❌ Error resetting user progress:', error);
        await handleApiError(error);
        alert('Error resetting user progress');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Validate admin session before making the API call
        const validationResult = await sessionValidationService.validateAdminSession();
        
        if (!validationResult.valid) {
          console.error('❌ Admin session validation failed before user deletion');
          await handleValidationFailure(validationResult.error);
          return;
        }

        await adminApiSeparate.deleteUser(userId);
        alert('User deleted successfully');
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        await handleApiError(error);
        alert('Error deleting user');
      }
    }
  };

  const handleToggleUserStatus = async (userId, isCurrentlyActive) => {
    try {
      console.log('🔄 Updating user status:', { userId, currentStatus: isCurrentlyActive ? 'active' : 'disabled' });
      
      // Validate admin session before making the API call
      const validationResult = await sessionValidationService.validateAdminSession();
      
      if (!validationResult.valid) {
        console.error('❌ Admin session validation failed before user status update');
        await handleValidationFailure(validationResult.error);
        return;
      }

      // Convert to boolean: true for active, false for disabled
      const newStatus = !isCurrentlyActive;
      console.log('✅ Session validated, updating user status to:', newStatus ? 'active' : 'disabled');
      
      // Show loading state
      setLoadingData(true);
      
      await adminApiSeparate.updateUserStatus(userId, newStatus);
      console.log('✅ User status updated successfully');
      
      // Refresh data immediately
      await loadDashboardData();
      
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      
      // Handle different types of errors with specific messages
      if (error.message && error.message.includes('Admin access')) {
        alert('Admin session expired. Please login again.');
        await handleValidationFailure(error);
      } else if (error.message && error.message.includes('Unauthorized')) {
        alert('You do not have permission to perform this action.');
        await handleApiError(error);
      } else if (error.message && error.message.includes('Network')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(`Error updating user status: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "users", name: "Users", icon: "👥" },
    { id: "analytics", name: "Analytics", icon: "📈" },
  ];

  const renderTabContent = () => {
    if (loadingData) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
              <button
                onClick={loadDashboardData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.totalUsers?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.activeToday || '0'}
                    </p>
                  </div>
                  <div className="text-3xl">🟢</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Games</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.completedGames?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="text-3xl">🎮</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.avgScore || '0'}%
                    </p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardData?.recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${activity.color === 'green' ? 'bg-green-500' :
                      activity.color === 'blue' ? 'bg-blue-500' :
                        activity.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                    <span className="text-gray-700 flex-1">{activity.message}</span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                )) || (
                    <div className="text-center py-4 text-gray-500">
                      No recent activity
                    </div>
                  )}
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Clear previous timeout
                    if (searchTimeout) {
                      clearTimeout(searchTimeout);
                    }
                    // Set new timeout for debounced search
                    const newTimeout = setTimeout(() => {
                      loadDashboardData();
                    }, 500);
                    setSearchTimeout(newTimeout);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => loadDashboardData()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.users?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center space-x-2">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                {user.isAdmin && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Chapter {user.currentChapter}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.completedLevels} levels completed
                          </div>
                          <div className="text-xs text-blue-600">
                            Avg: {user.averageScore}% | Badges: {user.achievementCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.totalScore.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Avg: {user.averageScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimeAgo(user.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.isAdmin ? (
                              <span className="text-xs text-blue-600 font-medium">
                                Always Active
                              </span>
                            ) : (
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={user.status === 'active'}
                                  onChange={() => handleToggleUserStatus(user.id, user.status === 'active')}
                                  className="sr-only"
                                />
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                                  }`}>
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </div>
                                <span className="ml-2 text-xs text-gray-600">
                                  {user.status === 'active' ? 'Enabled' : 'Disabled'}
                                </span>
                              </label>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) || (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {users?.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">{users?.users?.length || 0}</span> of{' '}
                        <span className="font-medium">{users?.total || 0}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Previous
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">User Growth</h3>
                <div className="space-y-3">
                  {analytics?.userGrowth?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <span className="font-medium">{item.users} users</span>
                    </div>
                  )) || (
                      <div className="text-center py-4 text-gray-500">No data available</div>
                    )}
                </div>
              </div>

              {/* Game Completions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Game Completions</h3>
                <div className="space-y-3">
                  {analytics?.gameCompletions?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.chapter}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(item.completions / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{item.completions}</span>
                      </div>
                    </div>
                  )) || (
                      <div className="text-center py-4 text-gray-500">No data available</div>
                    )}
                </div>
              </div>

              {/* Average Scores */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Average Scores by Level</h3>
                <div className="space-y-3">
                  {analytics?.averageScores?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${item.avgScore}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{item.avgScore}%</span>
                      </div>
                    </div>
                  )) || (
                      <div className="text-center py-4 text-gray-500">No data available</div>
                    )}
                </div>
              </div>

              {/* Daily Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Active Users</h3>
                <div className="space-y-3">
                  {analytics?.dailyActivity?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <span className="font-medium">{item.activeUsers} users</span>
                    </div>
                  )) || (
                      <div className="text-center py-4 text-gray-500">No data available</div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-md p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;