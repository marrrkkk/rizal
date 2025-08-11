import { useState } from "react"
import api, { setAuthToken } from "../utils/api"
import { Link, useNavigate } from "react-router-dom"

export default function Login({ setToken }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post("login.php", { username, password })
      localStorage.setItem("token", res.data.token)
      setAuthToken(res.data.token)
      setToken(res.data.token)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">JR</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Continue your journey with Jose Rizal</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-blue-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Learning
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New to our learning platform?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Did you know?</span> Jose Rizal could speak 22 languages!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
