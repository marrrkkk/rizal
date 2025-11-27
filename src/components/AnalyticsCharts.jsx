import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsCharts = ({ analytics }) => {
  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Prepare data for charts
  const userGrowthData = analytics?.userGrowth?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.users
  })) || [];

  const chapterCompletionsData = analytics?.gameCompletions?.map(item => ({
    name: item.chapter,
    completions: item.completions
  })) || [];

  const averageScoresData = analytics?.averageScores?.map(item => ({
    name: item.level.replace('Chapter ', 'Ch'),
    score: item.avgScore
  })) || [];

  const dailyActivityData = analytics?.dailyActivity?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.activeUsers
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
        <div className="text-sm text-gray-600">
          Real-time data from user performance
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Users</div>
          <div className="text-3xl font-bold">
            {userGrowthData.reduce((sum, item) => sum + item.users, 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Completions</div>
          <div className="text-3xl font-bold">
            {chapterCompletionsData.reduce((sum, item) => sum + item.completions, 0)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Score</div>
          <div className="text-3xl font-bold">
            {averageScoresData.length > 0
              ? Math.round(averageScoresData.reduce((sum, item) => sum + item.score, 0) / averageScoresData.length)
              : 0}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Active Today</div>
          <div className="text-3xl font-bold">
            {dailyActivityData[0]?.users || 0}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">User Growth Trend</h3>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No user growth data available
            </div>
          )}
        </div>

        {/* Chapter Completions Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Completions by Chapter</h3>
          {chapterCompletionsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chapterCompletionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No completion data available
            </div>
          )}
        </div>

        {/* Average Scores Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Average Scores by Level</h3>
          {averageScoresData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageScoresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No score data available
            </div>
          )}
        </div>

        {/* Daily Active Users Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Active Users</h3>
          {dailyActivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No activity data available
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default AnalyticsCharts;
