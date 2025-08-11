"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Chapter2({ username, onLogout }) {
  const navigate = useNavigate()
  const [unlockedLevels, setUnlockedLevels] = useState([1]) // Only first level unlocked initially

  const levels = [
    {
      id: 1,
      title: "Ateneo Municipal",
      description: "Jose's early education in Manila",
      path: "/chapter/2/level/1",
    },
    {
      id: 2,
      title: "University of Santo Tomas",
      description: "Higher education and early struggles",
      path: "/chapter/2/level/2",
    },
    {
      id: 3,
      title: "Academic Achievements",
      description: "Jose's excellence in studies",
      path: "/chapter/2/level/3",
    },
    {
      id: 4,
      title: "Literary Works",
      description: "Early writings and poems",
      path: "/chapter/2/level/4",
    },
    {
      id: 5,
      title: "Puzzle: Rizal's Education",
      description: "Solve the puzzle about Rizal's education",
      path: "/chapter/2/level/5",
    },
  ]

  const handleLevelComplete = (levelId) => {
    if (!unlockedLevels.includes(levelId + 1) && levelId < levels.length) {
      setUnlockedLevels([...unlockedLevels, levelId + 1])
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Chapters
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {username}!</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Chapter 2: Education in Manila</h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto">
            Follow young Jose's educational journey through the prestigious schools of Manila
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div
              key={level.id}
              onClick={() => {
                if (unlockedLevels.includes(level.id)) {
                  navigate(level.path)
                }
              }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                unlockedLevels.includes(level.id)
                  ? "opacity-100 hover:shadow-xl"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <span className="text-2xl">{level.id}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{level.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{level.description}</p>
              {!unlockedLevels.includes(level.id) && (
                <div className="text-sm text-amber-600 font-medium">
                  Complete previous levels to unlock
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
