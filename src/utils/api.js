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

// API methods for authentication
const api = {
  // Login endpoint
  post: async (endpoint, data) => {
    if (endpoint === "/auth/login") {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const result = await response.json();
      setAuthToken(result.token);
      return { data: result };
    }

    if (endpoint === "/auth/register") {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const result = await response.json();

      // After registration, log the user in
      if (result.success) {
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: data.username, password: data.password }),
        });

        if (loginResponse.ok) {
          const loginResult = await loginResponse.json();
          setAuthToken(loginResult.token);
          return { data: loginResult };
        }
      }

      return { data: result };
    }

    throw new Error(`Unknown endpoint: ${endpoint}`);
  },

  // Get endpoint (for future use)
  get: async (endpoint) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    // Add more endpoints as needed
    throw new Error(`Unknown endpoint: ${endpoint}`);
  },
};

export default api;
