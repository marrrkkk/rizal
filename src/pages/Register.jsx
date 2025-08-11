import { useState } from "react"
import api from "../utils/api"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      const res = await api.post("register.php", { username, password })
      setSuccess(res.data.message)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join the Adventure!</h1>
            <p className="text-gray-600">Start learning about Jose Rizal today</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choose a Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter a unique username"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Create a Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Make it strong and secure"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Begin Your Journey
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-xl">
              <p className="text-green-700 text-sm font-medium">{success}</p>
              <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-600">Fun Fact:</span> Jose Rizal wrote his first novel at age
              26!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
