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
    <div
      className={`min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center ${
        isMobile ? "p-4" : "p-6"
      }`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute ${
            isMobile ? "top-10 left-10 w-24 h-24" : "top-20 left-20 w-32 h-32"
          } bg-blue-200/30 rounded-full blur-xl`}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "bottom-10 right-10 w-28 h-28"
              : "bottom-20 right-20 w-40 h-40"
          } bg-purple-200/30 rounded-full blur-xl`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/4 ${
            isMobile ? "w-16 h-16" : "w-24 h-24"
          } bg-indigo-200/30 rounded-full blur-xl`}
        ></div>
      </div>

      <div className={`relative w-full ${isMobile ? "max-w-sm" : "max-w-md"}`}>
        {/* Header Section */}
        <div className={`text-center ${isMobile ? "mb-6" : "mb-8"}`}>
          <div
            className={`inline-block ${
              isMobile ? "p-3" : "p-4"
            } bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg ${
              isMobile ? "mb-3" : "mb-4"
            }`}
          >
            <div
              className={`${
                isMobile ? "w-16 h-16" : "w-20 h-20"
              } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto ${
                isMobile ? "mb-2" : "mb-3"
              } flex items-center justify-center shadow-lg`}
            >
              <span
                className={`text-white font-bold ${
                  isMobile ? "text-xl" : "text-2xl"
                }`}
              >
                JR
              </span>
            </div>
            <h1
              className={`${
                isMobile ? "text-2xl" : "text-3xl"
              } font-bold text-gray-800 ${isMobile ? "mb-1" : "mb-2"}`}
            >
              Welcome Back!
            </h1>
            <p
              className={`text-gray-600 ${isMobile ? "text-sm" : "text-base"}`}
            >
              Continue your journey with Jose Rizal
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div
          className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl ${
            isMobile ? "p-6" : "p-8"
          }`}
        >
          <form
            onSubmit={handleLogin}
            className={`space-y-${isMobile ? "5" : "6"}`}
          >
            <div>
              <label
                className={`block ${
                  isMobile ? "text-xs" : "text-sm"
                } font-semibold text-gray-700 mb-2`}
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`w-full px-4 ${
                    isTouchDevice ? "py-4" : "py-3"
                  } bg-white/80 border-2 border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 ${
                    isMobile ? "text-base" : "text-base"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className={`${
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    } text-gray-400`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                className={`block ${
                  isMobile ? "text-xs" : "text-sm"
                } font-semibold text-gray-700 mb-2`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full px-4 ${
                    isTouchDevice ? "py-4" : "py-3"
                  } bg-white/80 border-2 border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 ${
                    isMobile ? "text-base" : "text-base"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className={`${
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    } text-gray-400`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white ${
                isTouchDevice ? "py-4" : "py-3"
              } rounded-xl font-semibold ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : `${
                      isTouchDevice
                        ? "active:from-blue-600 active:to-indigo-700"
                        : "hover:from-blue-600 hover:to-indigo-700"
                    } transition-all duration-200 shadow-lg ${
                      isTouchDevice
                        ? "active:shadow-xl active:scale-95"
                        : "hover:shadow-xl hover:-translate-y-0.5"
                    }`
              } ${isTouchDevice ? "min-h-[48px]" : ""}`}
              {...touchProps}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" showMessage={false} />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Start Learning"
              )}
            </button>
          </form>

          {error && (
            <div
              className={`mt-4 p-3 bg-red-100 border border-red-300 rounded-xl`}
            >
              <p
                className={`text-red-700 ${
                  isMobile ? "text-xs" : "text-sm"
                } font-medium`}
              >
                {error}
              </p>
            </div>
          )}

          <div className={`${isMobile ? "mt-5" : "mt-6"} text-center`}>
            <p
              className={`text-gray-600 ${isMobile ? "text-sm" : "text-base"}`}
            >
              New to our learning platform?{" "}
              <Link
                to="/register"
                className={`text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors ${
                  isTouchDevice ? "active:text-blue-800" : ""
                }`}
                {...touchProps}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className={`${isMobile ? "mt-6" : "mt-8"} text-center`}>
          <div
            className={`inline-block bg-white/50 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-md`}
          >
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600`}>
              <span className="font-semibold text-blue-600">Did you know?</span>{" "}
              Jose Rizal could speak 22 languages!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
