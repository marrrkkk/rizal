/**
 * Admin Dashboard Page
 * Provides overview of all users' progress for teachers/parents
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProgressView from "../components/AdminProgressView";
import ResponsiveContainer from "../components/ResponsiveContainer";
import ErrorBoundary from "../components/ErrorBoundary";

const AdminDashboard = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "users", label: "All Users", icon: "👥" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full">
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
            <button onClick={onLogout} className="btn-kid-warning">
              <span className="text-sm">👋 Logout</span>
            </button>
          </ResponsiveContainer>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
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
                    Monitor student progress, view achievements, and track
                    learning outcomes in the José Rizal educational adventure.
                  </p>
                </div>

                <AdminProgressView />

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
                          View All Users
                        </div>
                        <div className="text-sm text-blue-600">
                          See detailed progress for each student
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <div className="font-medium text-green-800">
                          Analytics
                        </div>
                        <div className="text-sm text-green-600">
                          View learning trends and insights
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
                          Monitor time spent to ensure balanced learning
                          sessions
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>
                          Export progress data for record keeping and assessment
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
                    All Users Progress
                  </h2>
                  <p className="text-gray-600">
                    Detailed view of each student's learning journey and
                    achievements.
                  </p>
                </div>
                <AdminProgressView />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📈</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Analytics Coming Soon!
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Advanced analytics and reporting features will be available in
                  a future update. For now, you can view individual user
                  progress in the Users tab.
                </p>
                <button
                  onClick={() => setActiveTab("users")}
                  className="mt-6 btn-kid-primary"
                >
                  View Users Instead
                </button>
              </div>
            )}
          </ResponsiveContainer>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
