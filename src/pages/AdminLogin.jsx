import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-kids.png";
import api from "../utils/api";
import sessionManager from "../utils/SessionManager";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if admin is already logged in on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      if (sessionManager.isAdminSessionValid()) {
        // Admin is already logged in, redirect to dashboard
        navigate("/admin", { replace: true });
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Authenticate with backend
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Validate that this is an admin user before creating session
        if (!user.isAdmin) {
          setError("Access denied. Only admin users can access this area.");
          setIsLoading(false);
          return;
        }

        // Create admin session using SessionManager with persistent storage
        const sessionCreated = sessionManager.setAdminSession(token, user, {
          persistent: true, // Enable persistent session across browser restarts
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours expiration
        });

        if (sessionCreated) {
          // Verify the session was created successfully
          if (sessionManager.isAdminSessionValid()) {
            console.log('Admin session created successfully');
            
            // Dispatch custom event to notify App.jsx of session update
            window.dispatchEvent(new Event('sessionUpdated'));
            
            // Navigate to admin dashboard
            navigate("/admin", { replace: true });
          } else {
            throw new Error("Failed to validate created admin session");
          }
        } else {
          throw new Error("Failed to create admin session");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Clear any partial session data on error
      sessionManager.clearAdminSession();
      
      // Handle different types of errors with specific messages
      if (error.response?.status === 401) {
        setError("Invalid username or password");
      } else if (error.response?.status === 403) {
        setError("Access denied. Only admin users can access this area.");
      } else if (error.message?.includes("session")) {
        setError("Failed to create admin session. Please try again.");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }

    setIsLoading(false);
  };



  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-indigo-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-slate-300 rounded-full opacity-25"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* Admin mascot container */}
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <svg
                  className="w-10 h-10 text-white"
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
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-2 bg-blue-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Admin
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg">Admin Portal</h1>
            <p className="text-white/90 font-medium">Secure access to admin dashboard</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black font-medium"
                placeholder="Enter admin username"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-black font-medium"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Login to Admin Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border-2 border-white/50">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-sm font-bold text-black">Secure Area</p>
                <p className="text-xs text-black">
                  Authorized admin access only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;