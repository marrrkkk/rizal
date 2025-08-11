import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Chapter4({ username, onLogout }) {
  const navigate = useNavigate()
  const [completedLevels, setCompletedLevels] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Load completed levels from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`chapter4_progress_${username}`)
    if (savedProgress) {
      setCompletedLevels(JSON.parse(savedProgress))
    }
    setIsLoading(false)
  }, [username])

  const levels = [
    {
      id: 1,
      title: "Character Connections",
      description: "Match characters with their relationships and roles in the story",
      path: "/chapter/4/level/1",
      icon: "👥",
      color: "from-purple-400 to-indigo-600"
    },
    {
      id: 2,
      title: "Plot Reconstruction",
      description: "Arrange key events in the correct order",
      path: "/chapter/4/level/2",
      icon: "🧩",
      color: "from-amber-400 to-orange-500"
    },
    {
      id: 3,
      title: "Symbolism Hunt",
      description: "Identify symbols and their meanings in the novel",
      path: "/chapter/4/level/3",
      icon: "🔍",
      color: "from-emerald-400 to-green-600"
    },
    {
      id: 4,
      title: "Quote Unscramble",
      description: "Reconstruct important quotes from the novel",
      path: "/chapter/4/level/4",
      icon: "📜",
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 5,
      title: "Scene Explorer",
      description: "Explore and analyze key scenes through interactive questions",
      path: "/chapter/4/level/5",
      icon: "🎭",
      color: "from-rose-400 to-pink-600"
    }
  ]

  const handleLevelClick = (levelId, path) => {
    // Allow access to level 1 or any completed level
    if (levelId === 1 || completedLevels[levelId - 1]) {
      navigate(path)
    } else {
      alert("Please complete the previous levels first!")
    }
  }

  const handleLevelComplete = (levelId) => {
    const updatedLevels = { ...completedLevels, [levelId]: true }
    setCompletedLevels(updatedLevels)
    localStorage.setItem(
      `chapter4_progress_${username}`,
      JSON.stringify(updatedLevels)
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Noli Me Tangere</h1>
            <p className="text-gray-600">Explore Rizal's masterpiece through interactive games</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Welcome, {username}!</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
          <span className="text-sm font-medium text-purple-700">
            {Object.keys(completedLevels).length} / {levels.length} games completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-purple-600 h-4 rounded-full transition-all duration-500" 
            style={{
              width: `${(Object.keys(completedLevels).length / levels.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {levels.map((level, index) => {
          const isUnlocked = level.id === 1 || completedLevels[level.id - 1]
          const isCompleted = completedLevels[level.id]
          
          return (
            <div 
              key={level.id}
              onClick={() => isUnlocked && handleLevelClick(level.id, level.path)}
              className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                !isUnlocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <div 
                className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 shadow-lg h-full flex flex-col`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{level.icon}</div>
                  {isCompleted ? (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      Completed
                    </span>
                  ) : !isUnlocked ? (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      Locked
                    </span>
                  ) : null}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{level.title}</h3>
                <p className="text-white/90 text-sm mb-4">{level.description}</p>
                <div className="mt-auto pt-4 border-t border-white/20">
                  <button 
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                      isUnlocked 
                        ? 'bg-white text-purple-700 hover:bg-gray-100' 
                        : 'bg-white/50 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!isUnlocked}
                  >
                    {isCompleted ? 'Play Again' : isUnlocked ? 'Start' : 'Locked'}
                  </button>
                </div>
              </div>
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto mt-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-purple-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Chapters
        </button>
      </div>
    </div>
  )
}
