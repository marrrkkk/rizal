import { useState } from "react";
import api, { setAuthToken } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";
import LoadingSpinner from "../components/LoadingSpinner";
import RizalIntroSlideshow from "../components/RizalIntroSlideshow";
import { getButtonClasses, getInputClasses } from "../utils/designSystem";
import { getErrorClasses } from "../utils/interactiveFeedback";
import { getFormFieldAttrs, getFocusRing } from "../utils/accessibility";
import {
  getInputA11yProps,
  getErrorA11yProps,
  getButtonA11yProps,
  announceError,
  announceSuccess,
} from "../utils/accessibilityEnhancements";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const navigate = useNavigate();
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const touchProps = getTouchFriendlyProps(isTouchDevice);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use SQLite-based authentication
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      // Set token in parent component
      if (setToken) {
        setToken(response.data.token);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Announce success to screen readers
      announceSuccess("Login successful. Loading introduction.");

      // Show slideshow instead of navigating immediately
      setShowSlideshow(true);
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      // Announce error to screen readers
      announceError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlideshowComplete = () => {
    // Navigate to home page after slideshow
    navigate("/");
  };

  // Show slideshow if login was successful
  if (showSlideshow) {
    return <RizalIntroSlideshow onComplete={handleSlideshowComplete} />;
  }

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
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-white/20"
          role="main"
        >
          <form
            onSubmit={handleLogin}
            className="space-y-6"
            aria-label="Login form"
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-3 text-lg"
              >
                Username
              </label>
              <div className="relative group">
                <input
                  {...getInputA11yProps("username", "Username", {
                    required: true,
                    type: "text",
                    autocomplete: "username",
                  })}
                  placeholder="Enter your username"
                  className={`w-full px-6 ${isTouchDevice ? "py-5" : "py-4"
                    } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white hover:border-gray-300 transition-all duration-300 text-lg font-medium shadow-inner min-h-[48px]`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-200 group-focus-within:scale-110"
                  aria-hidden="true"
                >
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-green-600 text-base">👤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-3 text-lg"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  {...getInputA11yProps("password", "Password", {
                    required: true,
                    type: "password",
                    autocomplete: "current-password",
                  })}
                  placeholder="Enter your password"
                  className={`w-full px-6 ${isTouchDevice ? "py-5" : "py-4"
                    } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white hover:border-gray-300 transition-all duration-300 text-lg font-medium shadow-inner min-h-[48px]`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-200 group-focus-within:scale-110"
                  aria-hidden="true"
                >
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-green-600 text-base">🔒</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-label={
                isLoading ? "Logging in, please wait" : "Login to your account"
              }
              className={`w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white ${isTouchDevice ? "py-5" : "py-4"
                } rounded-2xl font-black text-lg ${isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : `${isTouchDevice
                    ? "active:from-green-600 active:to-green-700 active:scale-95"
                    : "hover:from-green-600 hover:via-green-700 hover:to-green-600 hover:scale-105 hover:-translate-y-1"
                  } transition-all duration-300 shadow-xl hover:shadow-2xl`
                } border-b-4 border-green-700 active:border-b-2 uppercase tracking-wide min-h-[48px] focus:outline-none focus:ring-4 focus:ring-green-300`}
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
                  <span className="text-xl" aria-hidden="true">
                    🚀
                  </span>
                </div>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div
              {...getErrorA11yProps("login")}
              className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl shadow-md animate-wiggle"
            >
              <div className="flex items-center space-x-3">
                <span className="text-red-500 text-2xl" aria-hidden="true">
                  😞
                </span>
                <p className="text-red-800 font-bold">{error}</p>
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
              aria-label="Create a new account"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-b-4 border-blue-700 active:border-b-2 min-h-[48px] min-w-[48px] focus:outline-none focus:ring-4 focus:ring-blue-300"
              {...touchProps}
            >
              <span>Create Account</span>
              <span className="ml-2" aria-hidden="true">
                🎯
              </span>
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
