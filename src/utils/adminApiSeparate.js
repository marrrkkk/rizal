// Separate admin API utility with its own token management
const API_BASE_URL = "http://localhost:3000/api";

// Custom error classes for different failure scenarios
export class AdminAPIError extends Error {
  constructor(message, type, statusCode = null, originalError = null) {
    super(message);
    this.name = 'AdminAPIError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export class TokenExpiredError extends AdminAPIError {
  constructor(message = 'Admin session expired') {
    super(message, 'TOKEN_EXPIRED', 401);
    this.name = 'TokenExpiredError';
  }
}

export class NetworkError extends AdminAPIError {
  constructor(message = 'Network request failed', originalError = null) {
    super(message, 'NETWORK_ERROR', null, originalError);
    this.name = 'NetworkError';
  }
}

export class AuthorizationError extends AdminAPIError {
  constructor(message = 'Insufficient admin permissions', statusCode = 403) {
    super(message, 'AUTHORIZATION_ERROR', statusCode);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AdminAPIError {
  constructor(message = 'Request validation failed', statusCode = 400) {
    super(message, 'VALIDATION_ERROR', statusCode);
    this.name = 'ValidationError';
  }
}

export class ServerError extends AdminAPIError {
  constructor(message = 'Internal server error', statusCode = 500) {
    super(message, 'SERVER_ERROR', statusCode);
    this.name = 'ServerError';
  }
}

// Admin-specific token management
export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.removeItem("adminToken");
  }
};

export const clearAdminToken = () => {
  localStorage.removeItem("adminToken");
};

// Complete admin session cleanup
export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminAuthenticated");
  localStorage.removeItem("adminLoginTime");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("adminSessionData");
  console.log('Admin session cleared due to authentication failure');
};

// Admin API methods
const adminApiSeparate = {
  // Configuration for retry mechanism
  config: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryMultiplier: 2,
    timeout: 30000, // 30 seconds
  },

  // Helper to create timeout promise
  createTimeoutPromise: (timeout) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new NetworkError('Request timeout')), timeout);
    });
  },

  // Helper to wait for retry delay
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Enhanced error handling
  handleError: (error, response = null) => {
    console.error('Admin API Error Details:', {
      message: error.message,
      status: response?.status,
      url: response?.url,
      timestamp: new Date().toISOString()
    });

    if (response) {
      switch (response.status) {
        case 401:
          clearAdminSession();
          throw new TokenExpiredError('Admin session expired. Please log in again.');
        case 403:
          throw new AuthorizationError('Insufficient admin permissions for this operation.');
        case 400:
          throw new ValidationError('Invalid request data provided.');
        case 404:
          throw new AdminAPIError('Requested resource not found.', 'NOT_FOUND', 404);
        case 429:
          throw new AdminAPIError('Too many requests. Please try again later.', 'RATE_LIMITED', 429);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ServerError('Server error occurred. Please try again.');
        default:
          throw new AdminAPIError(`Request failed with status ${response.status}`, 'HTTP_ERROR', response.status);
      }
    }

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Network connection failed. Please check your internet connection.');
    }

    if (error.name === 'AbortError') {
      throw new NetworkError('Request was cancelled or timed out.');
    }

    // Re-throw custom errors as-is
    if (error instanceof AdminAPIError) {
      throw error;
    }

    // Default error handling
    throw new AdminAPIError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR', null, error);
  },

  // Retry mechanism for network failures
  retryRequest: async (requestFn, maxRetries = null) => {
    const retries = maxRetries ?? adminApiSeparate.config.maxRetries;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry certain error types
        if (error instanceof TokenExpiredError || 
            error instanceof AuthorizationError || 
            error instanceof ValidationError ||
            (error instanceof AdminAPIError && error.statusCode >= 400 && error.statusCode < 500)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = adminApiSeparate.config.retryDelay * Math.pow(adminApiSeparate.config.retryMultiplier, attempt);
        console.warn(`Admin API request failed (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delay}ms...`, error.message);
        
        await adminApiSeparate.wait(delay);
      }
    }

    throw lastError;
  },

  // Enhanced request method with comprehensive error handling and retry
  request: async (endpoint, method = 'GET', data = null, options = {}) => {
    const requestFn = async () => {
      const token = getAdminToken();
      
      if (!token) {
        throw new TokenExpiredError('No admin token found. Please log in.');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      };

      const config = {
        method,
        headers,
        signal: options.signal,
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const timeout = options.timeout ?? adminApiSeparate.config.timeout;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          signal: controller.signal
        });

        const response = await Promise.race([
          fetchPromise,
          adminApiSeparate.createTimeoutPromise(timeout)
        ]);

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (parseError) {
            // Response body is not JSON, use default error handling
          }
          
          adminApiSeparate.handleError(
            new Error(errorData.error || errorData.message || `Request failed`),
            response
          );
        }

        const result = await response.json();
        return { data: result, status: response.status };
      } catch (error) {
        clearTimeout(timeoutId);
        adminApiSeparate.handleError(error);
      }
    };

    // Use retry mechanism unless explicitly disabled
    if (options.noRetry) {
      return await requestFn();
    } else {
      return await adminApiSeparate.retryRequest(requestFn, options.maxRetries);
    }
  },

  // HTTP Methods with enhanced error handling
  get: (endpoint, options = {}) => adminApiSeparate.request(endpoint, 'GET', null, options),
  post: (endpoint, data, options = {}) => adminApiSeparate.request(endpoint, 'POST', data, options),
  put: (endpoint, data, options = {}) => adminApiSeparate.request(endpoint, 'PUT', data, options),
  delete: (endpoint, options = {}) => adminApiSeparate.request(endpoint, 'DELETE', null, options),

  // Admin-specific methods with enhanced error handling
  updateUserStatus: async (userId, status) => {
    if (!userId || typeof userId !== 'number' && typeof userId !== 'string') {
      throw new ValidationError('Valid user ID is required for status update.');
    }
    
    if (typeof status !== 'boolean' && status !== 0 && status !== 1) {
      throw new ValidationError('Status must be a boolean or 0/1 value.');
    }

    try {
      const response = await adminApiSeparate.put(`/admin/users/${userId}/status`, { status });
      console.log(`Successfully updated user ${userId} status to ${status}`);
      return response.data;
    } catch (error) {
      if (error instanceof AdminAPIError) {
        throw error;
      }
      console.error('Error updating user status:', error);
      throw new AdminAPIError(`Failed to update user status: ${error.message}`, 'UPDATE_FAILED', null, error);
    }
  },

  getDashboardStats: async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.allSettled([
        adminApiSeparate.get('/admin/users'),
        adminApiSeparate.get('/admin/stats')
      ]);

      // Handle partial failures gracefully
      const users = usersResponse.status === 'fulfilled' ? (usersResponse.value.data || []) : [];
      const stats = statsResponse.status === 'fulfilled' ? (statsResponse.value.data || {}) : {};

      if (usersResponse.status === 'rejected') {
        console.warn('Failed to fetch users for dashboard stats:', usersResponse.reason);
      }
      if (statsResponse.status === 'rejected') {
        console.warn('Failed to fetch stats for dashboard stats:', statsResponse.reason);
      }

      const totalUsers = stats.totalUsers || users.length;
      const today = new Date().toDateString();
      const activeToday = users.filter(user => {
        if (!user.created_at) return false;
        try {
          const userDate = new Date(user.created_at).toDateString();
          return userDate === today;
        } catch (dateError) {
          console.warn('Invalid date format for user:', user.id, user.created_at);
          return false;
        }
      }).length;

      const completedGames = stats.totalCompletedLevels || 0;
      const avgScore = users.length > 0 
        ? Math.round(users.reduce((sum, u) => sum + (u.average_score || 0), 0) / users.length)
        : 0;

      const recentActivity = [];
      const recentUsers = users
        .filter(user => user.created_at) // Only users with valid created_at
        .sort((a, b) => {
          try {
            return new Date(b.created_at) - new Date(a.created_at);
          } catch (error) {
            console.warn('Error sorting users by date:', error);
            return 0;
          }
        })
        .slice(0, 3);
      
      recentUsers.forEach((user, index) => {
        recentActivity.push({
          id: `reg_${index}`,
          type: 'user_registered',
          message: `New user "${user.username || 'Unknown'}" registered`,
          timestamp: user.created_at || new Date().toISOString(),
          color: 'green'
        });
      });

      return {
        totalUsers,
        activeToday,
        completedGames,
        avgScore,
        recentActivity: recentActivity.slice(0, 5)
      };
    } catch (error) {
      if (error instanceof AdminAPIError) {
        console.error('Admin API error fetching dashboard stats:', error);
        // For dashboard stats, we want to show partial data rather than fail completely
        if (error instanceof TokenExpiredError || error instanceof AuthorizationError) {
          throw error; // These should bubble up to trigger re-authentication
        }
      } else {
        console.error('Unexpected error fetching dashboard stats:', error);
      }
      
      // Return empty stats as fallback
      return {
        totalUsers: 0,
        activeToday: 0,
        completedGames: 0,
        avgScore: 0,
        recentActivity: []
      };
    }
  },

  getUsers: async (page = 1, limit = 20, search = '') => {
    // Validate input parameters
    if (page < 1 || !Number.isInteger(page)) {
      throw new ValidationError('Page must be a positive integer.');
    }
    if (limit < 1 || limit > 100 || !Number.isInteger(limit)) {
      throw new ValidationError('Limit must be an integer between 1 and 100.');
    }
    if (typeof search !== 'string') {
      throw new ValidationError('Search parameter must be a string.');
    }

    try {
      const response = await adminApiSeparate.get('/admin/users');
      const allUsers = response.data || [];

      if (!Array.isArray(allUsers)) {
        throw new AdminAPIError('Invalid response format: expected array of users', 'INVALID_RESPONSE');
      }

      const filteredUsers = allUsers
        .filter(user => user && user.is_admin !== 1) // Filter out admin users and null entries
        .filter(user => {
          if (!search.trim()) return true;
          try {
            return user.username && user.username.toLowerCase().includes(search.toLowerCase());
          } catch (error) {
            console.warn('Error filtering user by search term:', user.id, error);
            return false;
          }
        });

      const usersWithProgress = filteredUsers.map(user => {
        try {
          return {
            id: user.id,
            username: user.username || 'Unknown',
            email: user.email || 'N/A',
            registeredAt: user.created_at || new Date().toISOString(),
            lastActive: user.last_active || user.created_at || new Date().toISOString(),
            totalScore: Math.round(Number(user.total_score) || 0),
            completedLevels: Number(user.completed_levels) || 0,
            currentChapter: Number(user.completed_chapters) || 1,
            averageScore: Math.round(Number(user.average_score) || 0),
            achievementCount: Number(user.achievement_count) || 0,
            status: user.is_active === 1 ? 'active' : 'disabled',
            isAdmin: user.is_admin === 1
          };
        } catch (error) {
          console.warn('Error processing user data:', user.id, error);
          return {
            id: user.id || 'unknown',
            username: 'Data Error',
            email: 'N/A',
            registeredAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            totalScore: 0,
            completedLevels: 0,
            currentChapter: 1,
            averageScore: 0,
            achievementCount: 0,
            status: 'disabled',
            isAdmin: false
          };
        }
      });

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
      if (error instanceof AdminAPIError) {
        throw error;
      }
      console.error('Error fetching users:', error);
      throw new AdminAPIError(`Failed to fetch users: ${error.message}`, 'FETCH_FAILED', null, error);
    }
  },

  getAnalytics: async (timeRange = '7d') => {
    // Validate timeRange parameter
    const validRanges = ['7d', '30d', '90d'];
    if (!validRanges.includes(timeRange)) {
      throw new ValidationError(`Invalid time range. Must be one of: ${validRanges.join(', ')}`);
    }

    try {
      const [usersResponse, statsResponse] = await Promise.allSettled([
        adminApiSeparate.get('/admin/users'),
        adminApiSeparate.get('/admin/stats')
      ]);

      // Handle partial failures gracefully
      const users = usersResponse.status === 'fulfilled' ? (usersResponse.value.data || []) : [];
      const stats = statsResponse.status === 'fulfilled' ? (statsResponse.value.data || {}) : {};

      if (usersResponse.status === 'rejected') {
        console.warn('Failed to fetch users for analytics:', usersResponse.reason);
      }
      if (statsResponse.status === 'rejected') {
        console.warn('Failed to fetch stats for analytics:', statsResponse.reason);
      }

      if (!Array.isArray(users)) {
        throw new AdminAPIError('Invalid users data format for analytics', 'INVALID_DATA');
      }

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      const userGrowth = [];
      for (let i = days - 1; i >= 0; i--) {
        try {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const usersUpToDate = users.filter(user => {
            try {
              return user.created_at && new Date(user.created_at) <= date;
            } catch (dateError) {
              console.warn('Invalid date in user data:', user.id, user.created_at);
              return false;
            }
          }).length;
          
          userGrowth.push({
            date: dateStr,
            users: usersUpToDate
          });
        } catch (error) {
          console.warn('Error processing user growth data for day', i, error);
          userGrowth.push({
            date: new Date().toISOString().split('T')[0],
            users: 0
          });
        }
      }

      const gameCompletions = [];
      for (let chapter = 1; chapter <= 6; chapter++) {
        try {
          const completions = users.filter(u => {
            const completed = Number(u.completed_chapters) || 0;
            return completed >= chapter;
          }).length;
          gameCompletions.push({
            chapter: `Chapter ${chapter}`,
            completions
          });
        } catch (error) {
          console.warn('Error processing game completions for chapter', chapter, error);
          gameCompletions.push({
            chapter: `Chapter ${chapter}`,
            completions: 0
          });
        }
      }

      const averageScores = [];
      const levelNames = ['Birth Game', 'Family Game', 'Childhood Game', 'Teacher Game', 'Reading Game'];
      
      for (let level = 1; level <= 5; level++) {
        try {
          const usersAtLevel = users.filter(u => {
            const completed = Number(u.completed_levels) || 0;
            return completed >= level;
          });
          const avgScore = usersAtLevel.length > 0
            ? Math.round(usersAtLevel.reduce((sum, u) => {
                const score = Number(u.average_score) || 0;
                return sum + score;
              }, 0) / usersAtLevel.length)
            : 0;
          
          averageScores.push({
            level: levelNames[level - 1] || `Level ${level}`,
            avgScore
          });
        } catch (error) {
          console.warn('Error processing average scores for level', level, error);
          averageScores.push({
            level: levelNames[level - 1] || `Level ${level}`,
            avgScore: 0
          });
        }
      }

      const dailyActivity = [];
      for (let i = days - 1; i >= 0; i--) {
        try {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const activeUsers = users.filter(user => {
            try {
              if (!user.created_at) return false;
              const userDate = new Date(user.created_at);
              return userDate.toISOString().split('T')[0] === dateStr;
            } catch (dateError) {
              console.warn('Invalid date in daily activity:', user.id, user.created_at);
              return false;
            }
          }).length;
          
          dailyActivity.push({
            date: dateStr,
            activeUsers
          });
        } catch (error) {
          console.warn('Error processing daily activity for day', i, error);
          dailyActivity.push({
            date: new Date().toISOString().split('T')[0],
            activeUsers: 0
          });
        }
      }

      return {
        userGrowth,
        gameCompletions,
        averageScores,
        dailyActivity
      };
    } catch (error) {
      if (error instanceof AdminAPIError) {
        throw error;
      }
      console.error('Error fetching analytics:', error);
      throw new AdminAPIError(`Failed to fetch analytics: ${error.message}`, 'ANALYTICS_FAILED', null, error);
    }
  },

  deleteUser: async (userId) => {
    if (!userId || (typeof userId !== 'number' && typeof userId !== 'string')) {
      throw new ValidationError('Valid user ID is required for deletion.');
    }

    try {
      const response = await adminApiSeparate.delete(`/admin/users/${userId}`);
      console.log(`Successfully deleted user ${userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AdminAPIError) {
        throw error;
      }
      console.error('Error deleting user:', error);
      throw new AdminAPIError(`Failed to delete user: ${error.message}`, 'DELETE_FAILED', null, error);
    }
  },

  resetUserProgress: async (userId) => {
    if (!userId || (typeof userId !== 'number' && typeof userId !== 'string')) {
      throw new ValidationError('Valid user ID is required for progress reset.');
    }

    try {
      const response = await adminApiSeparate.post(`/admin/users/${userId}/reset`);
      console.log(`Successfully reset progress for user ${userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AdminAPIError) {
        throw error;
      }
      console.error('Error resetting user progress:', error);
      throw new AdminAPIError(`Failed to reset user progress: ${error.message}`, 'RESET_FAILED', null, error);
    }
  },

  // Health check method for monitoring API status
  healthCheck: async () => {
    try {
      const response = await adminApiSeparate.get('/admin/health', { 
        timeout: 5000, 
        noRetry: true 
      });
      return { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        data: response.data 
      };
    } catch (error) {
      console.warn('Admin API health check failed:', error.message);
      return { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        error: error.message 
      };
    }
  },

  // Batch operations with enhanced error handling
  batchUpdateUserStatus: async (userIds, status) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new ValidationError('User IDs array is required and cannot be empty.');
    }
    
    if (userIds.length > 50) {
      throw new ValidationError('Batch operations are limited to 50 users at a time.');
    }

    const results = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const result = await adminApiSeparate.updateUserStatus(userId, status);
        results.push({ userId, success: true, data: result });
      } catch (error) {
        console.error(`Failed to update status for user ${userId}:`, error.message);
        errors.push({ userId, success: false, error: error.message });
      }
    }

    return {
      results,
      errors,
      totalProcessed: userIds.length,
      successCount: results.length,
      errorCount: errors.length
    };
  }
};

export default adminApiSeparate;