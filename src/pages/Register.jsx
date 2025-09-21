import { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import {
  useResponsive,
  getTouchFriendlyProps,
} from "../utils/responsiveUtils.jsx";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { isMobile, isTouchDevice } = useResponsive();
  const touchProps = getTouchFriendlyProps(isTouchDevice);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("register.php", { username, password });
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Choose your username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pick something cool!"
                  className={`w-full px-6 ${
                    isTouchDevice ? "py-5" : "py-4"
                  } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 text-sm">✨</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Create a password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Make it super secure!"
                  className={`w-full px-6 ${
                    isTouchDevice ? "py-5" : "py-4"
                  } bg-gray-50 border-3 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white transition-all duration-300 text-lg font-medium shadow-inner`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 text-sm">🛡️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white ${
                isTouchDevice ? "py-5" : "py-4"
              } rounded-2xl font-black text-lg hover:from-pink-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-b-4 border-purple-700 active:border-b-2 uppercase tracking-wide`}
              {...touchProps}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Start Learning</span>
                <span className="text-xl">🌟</span>
              </div>
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

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-lg">🎉</span>
                <div>
                  <p className="text-green-700 font-semibold">{success}</p>
                  <p className="text-green-600 text-sm mt-1">
                    Taking you to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium mb-4">
              Already part of our community?
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg border-b-4 border-blue-700 active:border-b-2"
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
                <p className="text-sm font-bold text-gray-800">Fun Fact!</p>
                <p className="text-xs text-gray-600">
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
