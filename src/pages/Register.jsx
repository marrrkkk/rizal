import { useState } from "react";
import api, { setAuthToken } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";
import LoadingSpinner from "../components/LoadingSpinner";

import bgImage from "../assets/bg-kids.png";

export default function Register({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isMobile, isTouchDevice } = useResponsive();
  const touchProps = getTouchFriendlyProps(isTouchDevice);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Use SQLite-based authentication
      const response = await api.post("/auth/register", {
        username,
        password,
        email: null, // Email is optional for now
      });

      // Show success message
      setSuccess("Account created successfully!");

      // Set token in parent component
      if (setToken) {
        setToken(response.data.token);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-16 right-16 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 left-12 w-16 h-16 bg-blue-300 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-24 right-24 w-24 h-24 bg-green-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-16 left-16 w-12 h-12 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-purple-300 rounded-full opacity-25"></div>
        <div className="absolute top-2/3 left-1/4 w-14 h-14 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div
        className={`relative w-full ${isMobile ? "max-w-sm" : "max-w-md"} z-10`}
      >
        {/* Header with Duolingo-style mascot */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* Mascot container */}
            <div className="w-28 h-28 mx-auto mb-4 relative">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <div className="text-white text-4xl font-bold">🎓</div>
              </div>
              {/* Speech bubble */}
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-2 rounded-full shadow-md animate-bounce">
                Let's go!
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
              Join the fun!
            </h1>
            <p className="text-white/90 font-medium text-lg">
              Start your learning adventure today
            </p>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-white/20">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-black font-bold mb-3 text-lg">
                Choose your username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Pick something cool!"
                  className={`w-full px-6 ${isTouchDevice ? "py-5" : "py-4"
                    } bg-gray-50 border-3 border-gray-200 rounded-2xl text-black placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:bg-white hover:border-gray-300 transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-200 group-focus-within:scale-110">
                  <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-pink-600 text-base">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-black font-bold mb-3 text-lg">
                Create a password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Make it super secure!"
                  className={`w-full px-6 ${isTouchDevice ? "py-5" : "py-4"
                    } bg-gray-50 border-3 border-gray-200 rounded-2xl text-black placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:bg-white hover:border-gray-300 transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-200 group-focus-within:scale-110">
                  <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-pink-600 text-base">🛡️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 text-white ${isTouchDevice ? "py-5" : "py-4"
                } rounded-2xl font-black text-lg ${isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : `${isTouchDevice
                    ? "active:from-pink-600 active:to-purple-700 active:scale-95"
                    : "hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 hover:scale-105 hover:-translate-y-1"
                  } transition-all duration-300 shadow-xl hover:shadow-2xl`
                } border-b-4 border-purple-700 active:border-b-2 uppercase tracking-wide focus:outline-none focus:ring-4 focus:ring-purple-300`}
              {...touchProps}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <LoadingSpinner size="sm" showMessage={false} />
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Start Learning</span>
                  <span className="text-xl">🌟</span>
                </div>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl shadow-md animate-wiggle">
              <div className="flex items-center space-x-3">
                <span className="text-red-500 text-2xl">😞</span>
                <p className="text-red-800 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-300 rounded-2xl shadow-md animate-slide-up">
              <div className="flex items-center space-x-3">
                <span className="text-green-500 text-2xl animate-bounce">
                  🎉
                </span>
                <div>
                  <p className="text-green-800 font-bold">{success}</p>
                  <p className="text-green-700 text-sm mt-1 font-medium">
                    Taking you to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-black font-medium mb-4">
              Already part of our community?
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-b-4 border-blue-700 active:border-b-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
              {...touchProps}
            >
              Sign In 🚀
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border-2 border-white/50">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-sm font-bold text-black">Fun Fact!</p>
                <p className="text-xs text-black">
                  Jose Rizal wrote his first novel at age 26!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
