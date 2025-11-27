// API utilities for Node.js backend authentication
const API_BASE_URL = "http://localhost:3000/api";

// Token management for JWT-based authentication
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
};

// Get current user from stored token (decode JWT)
export const getCurrentUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT token (without verification - that's done server-side)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id,
      username: payload.username,
      isAdmin: payload.isAdmin || false,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// API methods for authentication and data access
const api = {
  // Helper for making requests
  request: async (endpoint, method = 'GET', data = null) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized (token expired or invalid)
      if (response.status === 401) {
        clearAuthToken();
        // Optionally redirect to login, but let the caller handle it for now
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Auto-manage token if present in response
      if (result.token) {
        setAuthToken(result.token);
      }

      // Return in the format expected by the application { data: result }
      return { data: result };
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  },

  // HTTP Methods
  get: (endpoint) => api.request(endpoint, 'GET'),

  post: (endpoint, data) => api.request(endpoint, 'POST', data),

  put: (endpoint, data) => api.request(endpoint, 'PUT', data),

  delete: (endpoint) => api.request(endpoint, 'DELETE'),
};

export default api;
