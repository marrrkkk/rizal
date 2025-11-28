/**
 * SessionValidationService - Centralized session validation with proper error handling
 * Handles validation for both admin and user sessions with recovery mechanisms
 */

// Custom error classes for different validation failure types
export class TokenExpiredError extends Error {
  constructor(sessionType) {
    super(`${sessionType} token has expired`);
    this.name = 'TokenExpiredError';
    this.sessionType = sessionType;
  }
}

export class InvalidTokenError extends Error {
  constructor(sessionType, reason) {
    super(`${sessionType} token is invalid: ${reason}`);
    this.name = 'InvalidTokenError';
    this.sessionType = sessionType;
    this.reason = reason;
  }
}

export class SessionMixingError extends Error {
  constructor(attempted, expected) {
    super(`Attempted to use ${attempted} session for ${expected} operation`);
    this.name = 'SessionMixingError';
    this.attempted = attempted;
    this.expected = expected;
  }
}

export class UserInactiveError extends Error {
  constructor(userId) {
    super(`User ${userId} is inactive or disabled`);
    this.name = 'UserInactiveError';
    this.userId = userId;
  }
}

export class InsufficientPermissionsError extends Error {
  constructor(userId, requiredPermission) {
    super(`User ${userId} lacks required permission: ${requiredPermission}`);
    this.name = 'InsufficientPermissionsError';
    this.userId = userId;
    this.requiredPermission = requiredPermission;
  }
}

class SessionValidationService {
  constructor() {
    this.sessionManager = null; // Will be injected
    this.storageManager = null; // Will be injected
  }

  /**
   * Set dependencies (dependency injection pattern)
   */
  setDependencies(sessionManager, storageManager) {
    this.sessionManager = sessionManager;
    this.storageManager = storageManager;
  }

  /**
   * Validate admin session with comprehensive checks
   * @returns {Object} Validation result with session data or error
   */
  async validateAdminSession() {
    try {
      const sessionData = this.storageManager?.getItem('adminSessionData');
      
      if (!sessionData) {
        throw new InvalidTokenError('admin', 'No session data found');
      }

      // Check if session structure is valid
      if (!this._isValidSessionStructure(sessionData, 'admin')) {
        throw new InvalidTokenError('admin', 'Invalid session structure');
      }

      // Check token expiration
      if (this.isTokenExpired(sessionData.token)) {
        throw new TokenExpiredError('admin');
      }

      // Check if user is still active and has admin permissions
      if (!await this.hasAdminPermissions(sessionData.user.id)) {
        throw new InsufficientPermissionsError(sessionData.user.id, 'admin');
      }

      // Update last activity timestamp
      sessionData.lastActivity = Date.now();
      this.storageManager?.setItem('adminSessionData', sessionData);

      return {
        valid: true,
        sessionData,
        error: null
      };

    } catch (error) {
      console.error('Admin session validation failed:', error);
      return {
        valid: false,
        sessionData: null,
        error
      };
    }
  }

  /**
   * Validate user session with comprehensive checks
   * @returns {Object} Validation result with session data or error
   */
  async validateUserSession() {
    try {
      const sessionData = this.storageManager?.getItem('userSessionData');
      
      if (!sessionData) {
        throw new InvalidTokenError('user', 'No session data found');
      }

      // Check if session structure is valid
      if (!this._isValidSessionStructure(sessionData, 'user')) {
        throw new InvalidTokenError('user', 'Invalid session structure');
      }

      // Check token expiration
      if (this.isTokenExpired(sessionData.token)) {
        throw new TokenExpiredError('user');
      }

      // Check if user is still active
      if (!await this.isUserActive(sessionData.user.id)) {
        throw new UserInactiveError(sessionData.user.id);
      }

      // Update last activity timestamp
      sessionData.lastActivity = Date.now();
      this.storageManager?.setItem('userSessionData', sessionData);

      return {
        valid: true,
        sessionData,
        error: null
      };

    } catch (error) {
      console.error('User session validation failed:', error);
      return {
        valid: false,
        sessionData: null,
        error
      };
    }
  }

  /**
   * Validate a specific token with session type context
   * @param {string} token - JWT token to validate
   * @param {string} sessionType - 'admin' or 'user'
   * @returns {Object} Validation result
   */
  validateToken(token, sessionType) {
    try {
      if (!token || typeof token !== 'string') {
        throw new InvalidTokenError(sessionType, 'Token is missing or invalid format');
      }

      // Basic JWT structure check (header.payload.signature)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new InvalidTokenError(sessionType, 'Invalid JWT structure');
      }

      // Decode payload to check expiration
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        if (!payload.exp) {
          throw new InvalidTokenError(sessionType, 'Token missing expiration');
        }

        if (Date.now() >= payload.exp * 1000) {
          throw new TokenExpiredError(sessionType);
        }

        // Validate session type matches token type
        if (sessionType === 'admin' && !payload.isAdmin) {
          throw new SessionMixingError('user', 'admin');
        }

        return {
          valid: true,
          payload,
          error: null
        };

      } catch (decodeError) {
        throw new InvalidTokenError(sessionType, 'Cannot decode token payload');
      }

    } catch (error) {
      console.error(`Token validation failed for ${sessionType}:`, error);
      return {
        valid: false,
        payload: null,
        error
      };
    }
  }

  /**
   * Check if a token is expired
   * @param {string} token - JWT token to check
   * @returns {boolean} True if expired
   */
  isTokenExpired(token) {
    try {
      if (!token) return true;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;

      const payload = JSON.parse(atob(tokenParts[1]));
      return Date.now() >= (payload.exp * 1000);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if we can't parse
    }
  }

  /**
   * Check if a user is active (mock implementation - should call backend)
   * @param {number} userId - User ID to check
   * @returns {Promise<boolean>} True if user is active
   */
  async isUserActive(userId) {
    try {
      // In a real implementation, this would make an API call to check user status
      // For now, we'll simulate the check
      const userData = this.storageManager?.getItem('userSessionData');
      return userData?.user?.isActive !== false;
    } catch (error) {
      console.error('Error checking user active status:', error);
      return false;
    }
  }

  /**
   * Check if a user has admin permissions
   * @param {number} userId - User ID to check
   * @returns {Promise<boolean>} True if user has admin permissions
   */
  async hasAdminPermissions(userId) {
    try {
      // In a real implementation, this would make an API call to check admin status
      // For now, we'll check the stored session data
      const adminData = this.storageManager?.getItem('adminSessionData');
      return adminData?.user?.isAdmin === true;
    } catch (error) {
      console.error('Error checking admin permissions:', error);
      return false;
    }
  }

  /**
   * Attempt to recover a session after validation failure
   * @param {string} sessionType - 'admin' or 'user'
   * @returns {Promise<Object>} Recovery result
   */
  async attemptSessionRecovery(sessionType) {
    try {
      console.log(`Attempting session recovery for ${sessionType}`);

      // Try to restore from persistent storage
      const sessionData = sessionType === 'admin' 
        ? this.storageManager?.restoreAdminSession()
        : this.storageManager?.restoreUserSession();

      if (!sessionData) {
        throw new Error('No recoverable session data found');
      }

      // Validate the recovered session
      const validationResult = sessionType === 'admin'
        ? await this.validateAdminSession()
        : await this.validateUserSession();

      if (validationResult.valid) {
        console.log(`Session recovery successful for ${sessionType}`);
        return {
          recovered: true,
          sessionData: validationResult.sessionData,
          error: null
        };
      } else {
        throw validationResult.error;
      }

    } catch (error) {
      console.error(`Session recovery failed for ${sessionType}:`, error);
      return {
        recovered: false,
        sessionData: null,
        error
      };
    }
  }

  /**
   * Handle validation failure with appropriate cleanup and redirection
   * @param {string} sessionType - 'admin' or 'user'
   * @param {Error} error - The validation error
   */
  async handleValidationFailure(sessionType, error) {
    console.error(`Handling validation failure for ${sessionType}:`, error);

    try {
      // Log the specific reason for debugging
      this._logValidationFailure(sessionType, error);

      // Clear the invalid session data
      if (sessionType === 'admin') {
        this.sessionManager?.clearAdminSession();
      } else {
        this.sessionManager?.clearUserSession();
      }

      // Attempt recovery for certain error types
      if (error instanceof TokenExpiredError) {
        const recoveryResult = await this.attemptSessionRecovery(sessionType);
        if (recoveryResult.recovered) {
          return {
            handled: true,
            action: 'recovered',
            redirectTo: null
          };
        }
      }

      // Determine appropriate redirect
      const redirectTo = sessionType === 'admin' ? '/admin/login' : '/login';

      return {
        handled: true,
        action: 'redirect',
        redirectTo,
        error
      };

    } catch (handlingError) {
      console.error('Error handling validation failure:', handlingError);
      return {
        handled: false,
        action: 'error',
        redirectTo: sessionType === 'admin' ? '/admin/login' : '/login',
        error: handlingError
      };
    }
  }

  /**
   * Validate session structure
   * @private
   */
  _isValidSessionStructure(sessionData, sessionType) {
    if (!sessionData || typeof sessionData !== 'object') {
      return false;
    }

    const requiredFields = ['token', 'user', 'loginTime', 'expiresAt'];
    const hasRequiredFields = requiredFields.every(field => 
      sessionData.hasOwnProperty(field)
    );

    if (!hasRequiredFields) {
      return false;
    }

    // Validate user object structure
    if (!sessionData.user || typeof sessionData.user !== 'object') {
      return false;
    }

    const requiredUserFields = ['id', 'username'];
    const hasRequiredUserFields = requiredUserFields.every(field =>
      sessionData.user.hasOwnProperty(field)
    );

    if (!hasRequiredUserFields) {
      return false;
    }

    // Additional validation for admin sessions
    if (sessionType === 'admin' && !sessionData.user.isAdmin) {
      return false;
    }

    return true;
  }

  /**
   * Log validation failure for debugging
   * @private
   */
  _logValidationFailure(sessionType, error) {
    const logData = {
      timestamp: new Date().toISOString(),
      sessionType,
      errorType: error.constructor.name,
      errorMessage: error.message,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Session validation failure:', logData);

    // In a production environment, you might want to send this to a logging service
    // this._sendToLoggingService(logData);
  }
}

// Export singleton instance
export default new SessionValidationService();