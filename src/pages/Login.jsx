import { useState } from "react";
import api, { setAuthToken } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const touchProps = getTouchFriendlyProps(isTouchDevice);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("login.php", { username, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300 rounded-full opacity-25"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-purple-300 rounded-full opacity-30"></div>
      </div>

      <div
        className={`relative w-full ${isMobile ? "max-w-sm" : "max-w-md"} z-10`}
      >
        {/* Header with Duolingo-style mascot */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* Mascot container */}
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <div className="text-white text-3xl font-bold">📚</div>
              </div>
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                Hi!
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
              Welcome back!
            </h1>
            <p className="text-white/90 font-medium">
              Ready to continue learning?
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full px-6 ${
                    isTouchDevice ? "py-5" : "py-4"
                  } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">👤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full px-6 ${
                    isTouchDevice ? "py-5" : "py-4"
                  } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🔒</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white ${
                isTouchDevice ? "py-5" : "py-4"
              } rounded-2xl font-black text-lg ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : `${
                      isTouchDevice
                        ? "active:from-green-600 active:to-green-700 active:scale-95"
                        : "hover:from-green-600 hover:to-green-700 hover:scale-105"
                    } transition-all duration-200 shadow-lg hover:shadow-xl`
              } border-b-4 border-green-700 active:border-b-2 uppercase tracking-wide`}
              {...touchProps}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <LoadingSpinner size="sm" showMessage={false} />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <span className="text-xl">🚀</span>
                </div>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-lg">😞</span>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium mb-4">
              New to our learning adventure?
            </p>
            <Link
              to="/register"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg border-b-4 border-blue-700 active:border-b-2"
              {...touchProps}
            >
              Create Account 🎯
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border-2 border-white/50">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm font-bold text-gray-800">Did you know?</p>
                <p className="text-xs text-gray-600">
                  Jose Rizal could speak 22 languages!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
