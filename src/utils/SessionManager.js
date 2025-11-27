/**
 * Enhanced Session Manager for handling admin and user sessions separately
 * Provides persistent session storage, validation, and navigation helpers
 */
class SessionManager {
  constructor() {
    // Session storage keys
    this.ADMIN_TOKEN = 'adminToken';
    this.ADMIN_AUTH = 'adminAuthenticated';
    this.ADMIN_LOGIN_TIME = 'adminLoginTime';
    this.ADMIN_USER = 'adminUser';
    this.ADMIN_SESSION_DATA = 'adminSessionData';
    
    this.USER_TOKEN = 'token';
    this.USER_DATA = 'user';
    this.USER_SESSION_DATA = 'userSessionData';
    
    // Session expiration times (in milliseconds)
    this.ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    this.USER_SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  }

  // ==================== ADMIN SESSION METHODS ====================
  
  /**
   * Set admin session with persistent storage
   * @param {string} token - JWT token for admin
   * @param {object} userInfo - Admin user information
   * @param {object} options - Additional options (persistent, expiresIn)
   */
  setAdminSession(token, userInfo, options = {}) {
    const { persistent = true, expiresIn = this.ADMIN_SESSION_DURATION } = options;
    
    const loginTime = Date.now();
    const expiresAt = loginTime + expiresIn;
    
    const sessionData = {
      token,
      user: userInfo,
      loginTime,
      expiresAt,
      persistent,
      lastActivity: loginTime
    };

    try {
      // Store individual items for backward compatibility
      localStorage.setItem(this.ADMIN_TOKEN, token);
      localStorage.setItem(this.ADMIN_AUTH, 'true');
      localStorage.setItem(this.ADMIN_LOGIN_TIME, loginTime.toString());
      localStorage.setItem(this.ADMIN_USER, JSON.stringify(userInfo));
      
      // Store complete session data
      localStorage.setItem(this.ADMIN_SESSION_DATA, JSON.stringify(sessionData));
      
      return true;
    } catch (error) {
      console.error('Failed to set admin session:', error);
      return false;
    }
  }

  /**
   * Get admin session data
   * @returns {object|null} Admin session data or null if not found/invalid
   */
  getAdminSession() {
    try {
      const sessionDataStr = localStorage.getItem(this.ADMIN_SESSION_DATA);
      
      if (!sessionDataStr) {
        // Try to reconstruct from individual items for backward compatibility
        return this._reconstructAdminSession();
      }
      
      const sessionData = JSON.parse(sessionDataStr);
      
      // Validate session data structure
      if (!this._isValidSessionData(sessionData, 'admin')) {
        this.clearAdminSession();
        return null;
      }
      
      // Update last activity
      sessionData.lastActivity = Date.now();
      localStorage.setItem(this.ADMIN_SESSION_DATA, JSON.stringify(sessionData));
      
      return sessionData;
    } catch (error) {
      console.error('Failed to get admin session:', error);
      this.clearAdminSession();
      return null;
    }
  }

  /**
   * Clear admin session data
   */
  clearAdminSession() {
    const adminKeys = [
      this.ADMIN_TOKEN,
      this.ADMIN_AUTH,
      this.ADMIN_LOGIN_TIME,
      this.ADMIN_USER,
      this.ADMIN_SESSION_DATA
    ];
    
    adminKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
      }
    });
  }

  /**
   * Check if admin session is valid
   * @returns {boolean} True if admin session is valid
   */
  isAdminSessionValid() {
    const session = this.getAdminSession();
    
    if (!session) {
      return false;
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.clearAdminSession();
      return false;
    }
    
    // Check if user is still admin
    if (!session.user || !session.user.isAdmin) {
      this.clearAdminSession();
      return false;
    }
    
    return true;
  }

  // ==================== USER SESSION METHODS ====================
  
  /**
   * Set user session
   * @param {string} token - JWT token for user
   * @param {object} userInfo - User information
   * @param {object} options - Additional options (expiresIn)
   */
  setUserSession(token, userInfo, options = {}) {
    const { expiresIn = this.USER_SESSION_DURATION } = options;
    
    const loginTime = Date.now();
    const expiresAt = loginTime + expiresIn;
    
    const sessionData = {
      token,
      user: userInfo,
      loginTime,
      expiresAt,
      lastActivity: loginTime
    };

    try {
      // Store individual items for backward compatibility
      localStorage.setItem(this.USER_TOKEN, token);
      localStorage.setItem(this.USER_DATA, JSON.stringify(userInfo));
      
      // Store complete session data
      localStorage.setItem(this.USER_SESSION_DATA, JSON.stringify(sessionData));
      
      return true;
    } catch (error) {
      console.error('Failed to set user session:', error);
      return false;
    }
  }

  /**
   * Get user session data
   * @returns {object|null} User session data or null if not found/invalid
   */
  getUserSession() {
    try {
      const sessionDataStr = localStorage.getItem(this.USER_SESSION_DATA);
      
      if (!sessionDataStr) {
        // Try to reconstruct from individual items for backward compatibility
        return this._reconstructUserSession();
      }
      
      const sessionData = JSON.parse(sessionDataStr);
      
      // Validate session data structure
      if (!this._isValidSessionData(sessionData, 'user')) {
        this.clearUserSession();
        return null;
      }
      
      // Update last activity
      sessionData.lastActivity = Date.now();
      localStorage.setItem(this.USER_SESSION_DATA, JSON.stringify(sessionData));
      
      return sessionData;
    } catch (error) {
      console.error('Failed to get user session:', error);
      this.clearUserSession();
      return null;
    }
  }

  /**
   * Clear user session data
   */
  clearUserSession() {
    const userKeys = [
      this.USER_TOKEN,
      this.USER_DATA,
      this.USER_SESSION_DATA
    ];
    
    userKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
      }
    });
  }

  /**
   * Check if user session is valid
   * @returns {boolean} True if user session is valid
   */
  isUserSessionValid() {
    const session = this.getUserSession();
    
    if (!session) {
      return false;
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.clearUserSession();
      return false;
    }
    
    // Check if user is still active
    if (!session.user || session.user.isActive === false) {
      this.clearUserSession();
      return false;
    }
    
    return true;
  }

  // ==================== SESSION VALIDATION METHODS ====================
  
  /**
   * Validate session by type
   * @param {string} sessionType - 'admin' or 'user'
   * @returns {boolean} True if session is valid
   */
  validateSession(sessionType) {
    if (sessionType === 'admin') {
      return this.isAdminSessionValid();
    } else if (sessionType === 'user') {
      return this.isUserSessionValid();
    }
    
    console.error('Invalid session type:', sessionType);
    return false;
  }

  /**
   * Handle session expiry
   * @param {string} sessionType - 'admin' or 'user'
   */
  handleSessionExpiry(sessionType) {
    if (sessionType === 'admin') {
      this.clearAdminSession();
      this.redirectToLogin('admin');
    } else if (sessionType === 'user') {
      this.clearUserSession();
      this.redirectToLogin('user');
    }
  }

  /**
   * Get current session info
   * @returns {object} Object with session status for both admin and user
   */
  getCurrentSessionInfo() {
    return {
      admin: {
        isValid: this.isAdminSessionValid(),
        session: this.getAdminSession()
      },
      user: {
        isValid: this.isUserSessionValid(),
        session: this.getUserSession()
      }
    };
  }

  // ==================== NAVIGATION HELPERS ====================
  
  /**
   * Redirect to appropriate login page
   * @param {string} sessionType - 'admin' or 'user'
   */
  redirectToLogin(sessionType) {
    if (typeof window === 'undefined') {
      return; // Server-side rendering guard
    }
    
    if (sessionType === 'admin') {
      window.location.href = '/admin/login';
    } else if (sessionType === 'user') {
      window.location.href = '/login';
    } else {
      // Default to user login
      window.location.href = '/login';
    }
  }

  /**
   * Get appropriate dashboard URL for session type
   * @param {string} sessionType - 'admin' or 'user'
   * @returns {string} Dashboard URL
   */
  getDashboardUrl(sessionType) {
    if (sessionType === 'admin') {
      return '/admin/dashboard';
    } else if (sessionType === 'user') {
      return '/dashboard';
    }
    
    return '/';
  }

  // ==================== PRIVATE HELPER METHODS ====================
  
  /**
   * Validate session data structure
   * @param {object} sessionData - Session data to validate
   * @param {string} sessionType - 'admin' or 'user'
   * @returns {boolean} True if valid
   */
  _isValidSessionData(sessionData, sessionType) {
    if (!sessionData || typeof sessionData !== 'object') {
      return false;
    }
    
    const requiredFields = ['token', 'user', 'loginTime', 'expiresAt', 'lastActivity'];
    
    for (const field of requiredFields) {
      if (!(field in sessionData)) {
        return false;
      }
    }
    
    // Validate user object
    if (!sessionData.user || typeof sessionData.user !== 'object') {
      return false;
    }
    
    // Session type specific validation
    if (sessionType === 'admin') {
      if (!sessionData.user.isAdmin) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Reconstruct admin session from individual localStorage items
   * @returns {object|null} Reconstructed session data or null
   */
  _reconstructAdminSession() {
    try {
      const token = localStorage.getItem(this.ADMIN_TOKEN);
      const userStr = localStorage.getItem(this.ADMIN_USER);
      const loginTimeStr = localStorage.getItem(this.ADMIN_LOGIN_TIME);
      
      if (!token || !userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      const loginTime = loginTimeStr ? parseInt(loginTimeStr) : Date.now();
      const expiresAt = loginTime + this.ADMIN_SESSION_DURATION;
      
      const sessionData = {
        token,
        user,
        loginTime,
        expiresAt,
        persistent: true,
        lastActivity: Date.now()
      };
      
      // Save reconstructed session
      localStorage.setItem(this.ADMIN_SESSION_DATA, JSON.stringify(sessionData));
      
      return sessionData;
    } catch (error) {
      console.error('Failed to reconstruct admin session:', error);
      return null;
    }
  }

  /**
   * Reconstruct user session from individual localStorage items
   * @returns {object|null} Reconstructed session data or null
   */
  _reconstructUserSession() {
    try {
      const token = localStorage.getItem(this.USER_TOKEN);
      const userStr = localStorage.getItem(this.USER_DATA);
      
      if (!token || !userStr) {
        return null;
      }
      
      const user = JSON.parse(userStr);
      const loginTime = Date.now();
      const expiresAt = loginTime + this.USER_SESSION_DURATION;
      
      const sessionData = {
        token,
        user,
        loginTime,
        expiresAt,
        lastActivity: loginTime
      };
      
      // Save reconstructed session
      localStorage.setItem(this.USER_SESSION_DATA, JSON.stringify(sessionData));
      
      return sessionData;
    } catch (error) {
      console.error('Failed to reconstruct user session:', error);
      return null;
    }
  }
}

// Create and export singleton instance
const sessionManager = new SessionManager();

export default sessionManager;