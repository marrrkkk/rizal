import adminApiSeparate from './adminApiSeparate';

// Admin API functions for dashboard data
export const adminApi = {
  // Get dashboard overview stats from real database
  async getDashboardStats() {
    try {
      // Use the correct admin endpoints
      const [usersResponse, statsResponse] = await Promise.all([
        adminApiSeparate.get('/admin/users'), // Get all users with their progress
        adminApiSeparate.get('/admin/stats')  // Get basic stats
      ]);

      const users = usersResponse.data || [];
      const stats = statsResponse.data || {};

      // Calculate real stats
      const totalUsers = stats.totalUsers || users.length;
      const today = new Date().toDateString();
      const activeToday = users.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at).toDateString();
        return userDate === today;
      }).length;

      const completedGames = stats.totalCompletedLevels || 0;
      const avgScore = users.length > 0 
        ? Math.round(users.reduce((sum, u) => sum + (u.average_score || 0), 0) / users.length)
        : 0;

      // Get recent activity from users
      const recentActivity = [];
      
      // Recent registrations (last 5 users)
      const recentUsers = users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
      
      recentUsers.forEach((user, index) => {
        recentActivity.push({
          id: `reg_${index}`,
          type: 'user_registered',
          message: `New user "${user.username}" registered`,
          timestamp: user.created_at || new Date().toISOString(),
          color: 'green'
        });
      });

      // Recent completions (users with high completed levels)
      const activeUsers = users
        .filter(u => u.completed_levels > 0)
        .sort((a, b) => b.completed_levels - a.completed_levels)
        .slice(0, 3);

      activeUsers.forEach((user, index) => {
        recentActivity.push({
          id: `comp_${index}`,
          type: 'level_completed',
          message: `User "${user.username}" completed ${user.completed_levels} levels`,
          timestamp: user.created_at || new Date().toISOString(),
          color: 'blue'
        });
      });

      return {
        totalUsers,
        activeToday,
        completedGames,
        avgScore,
        recentActivity: recentActivity.slice(0, 5) // Show last 5 activities
      };
    } catch (error) {
      console.error('❌ Error fetching real dashboard stats:', error);
      console.error('❌ Error details:', error.message);
      // Fallback to basic data
      return {
        totalUsers: 0,
        activeToday: 0,
        completedGames: 0,
        avgScore: 0,
        recentActivity: []
      };
    }
  },

  // Get all users with pagination from real database
  async getUsers(page = 1, limit = 20, search = '') {
    try {
      const response = await adminApiSeparate.get('/admin/users');
      const allUsers = response.data || [];

      // Filter out admin users and apply search filter
      const filteredUsers = allUsers
        .filter(user => user.is_admin !== 1) // Remove admin users
        .filter(user => search 
          ? user.username.toLowerCase().includes(search.toLowerCase())
          : true
        );

      // Map users with their progress (data already comes with progress from backend)
      const usersWithProgress = filteredUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: 'N/A', // Email not in current schema
        registeredAt: user.created_at || new Date().toISOString(),
        lastActive: user.created_at || new Date().toISOString(), // Using created_at as fallback
        totalScore: Math.round(user.total_score || 0),
        completedLevels: user.completed_levels || 0,
        currentChapter: user.completed_chapters || 1,
        averageScore: Math.round(user.average_score || 0),
        achievementCount: user.achievement_count || 0,
        status: user.is_active === 1 ? 'active' : 'disabled',
        isAdmin: user.is_admin === 1
      }));

      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = usersWithProgress.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        totalPages: Math.ceil(filteredUsers.length / limit)
      };
    } catch (error) {
      console.error('❌ Error fetching real users:', error);
      console.error('❌ Error details:', error.message);
      return {
        users: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
  },

  // Get analytics data from real database
  async getAnalytics(timeRange = '7d') {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        adminApiSeparate.get('/admin/users'),
        adminApiSeparate.get('/admin/stats')
      ]);

      const users = usersResponse.data || [];
      const stats = statsResponse.data || {};

      // Calculate user growth over time
      const userGrowth = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const usersUpToDate = users.filter(user => 
          new Date(user.created_at) <= date
        ).length;
        
        userGrowth.push({
          date: dateStr,
          users: usersUpToDate
        });
      }

      // Calculate game completions by chapter (estimated from user data)
      const gameCompletions = [];
      for (let chapter = 1; chapter <= 6; chapter++) {
        const completions = users.filter(u => (u.completed_chapters || 0) >= chapter).length;
        gameCompletions.push({
          chapter: `Chapter ${chapter}`,
          completions
        });
      }

      // Calculate average scores by level (estimated)
      const averageScores = [];
      const levelNames = ['Birth Game', 'Family Game', 'Childhood Game', 'Teacher Game', 'Reading Game'];
      
      // Group users by completion level and calculate averages
      for (let level = 1; level <= 5; level++) {
        const usersAtLevel = users.filter(u => (u.completed_levels || 0) >= level);
        const avgScore = usersAtLevel.length > 0
          ? Math.round(usersAtLevel.reduce((sum, u) => sum + (u.average_score || 0), 0) / usersAtLevel.length)
          : 0;
        
        averageScores.push({
          level: levelNames[level - 1] || `Level ${level}`,
          avgScore
        });
      }

      // Calculate daily activity (estimated from registration dates)
      const dailyActivity = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const activeUsers = users.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate.toISOString().split('T')[0] === dateStr;
        }).length;
        
        dailyActivity.push({
          date: dateStr,
          activeUsers
        });
      }

      return {
        userGrowth,
        gameCompletions,
        averageScores,
        dailyActivity
      };
    } catch (error) {
      console.error('Error fetching real analytics:', error);
      return {
        userGrowth: [],
        gameCompletions: [],
        averageScores: [],
        dailyActivity: []
      };
    }
  },



  // Delete user
  async deleteUser(userId) {
    try {
      const response = await adminApiSeparate.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get individual user details
  async getUserDetails(userId) {
    try {
      const response = await adminApiSeparate.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  // Reset user progress
  async resetUserProgress(userId) {
    try {
      const response = await adminApiSeparate.post(`/admin/users/${userId}/reset`);
      return response.data;
    } catch (error) {
      console.error('Error resetting user progress:', error);
      throw error;
    }
  },

  // Update user admin status
  async updateUserAdminStatus(userId, isAdmin) {
    try {
      const response = await adminApiSeparate.put(`/admin/users/${userId}/admin`, { isAdmin });
      return response.data;
    } catch (error) {
      console.error('Error updating admin status:', error);
      throw error;
    }
  },

  // Update user status (enable/disable login)
  async updateUserStatus(userId, status) {
    try {
      const response = await adminApiSeparate.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
};

export default adminApi;