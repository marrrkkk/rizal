import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Chapter3({ username, onLogout }) {
  const navigate = useNavigate()
  const [unlockedLevels, setUnlockedLevels] = useState([1]) // Start with first level unlocked
  const [completedLevels, setCompletedLevels] = useState([])

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('chapter3Progress')
    if (savedProgress) {
      const { unlocked, completed } = JSON.parse(savedProgress)
      setUnlockedLevels(unlocked)
      setCompletedLevels(completed)
    }
  }, [])

  // Save progress whenever it changes
  useEffect(() => {
    const progress = {
      unlocked: unlockedLevels,
      completed: completedLevels
    }
    localStorage.setItem('chapter3Progress', JSON.stringify(progress))
  }, [unlockedLevels, completedLevels])

  const levels = [
    {
      id: 1,
      title: "European Journey",
      description: "Follow Rizal's travels across Europe",
      path: "/chapter/3/level/1",
    },
    {
      id: 2,
      title: "Literary Crossroads",
      description: "Solve the crossword about Rizal's works",
      path: "/chapter/3/level/2",
    },
    {
      id: 3,
      title: "Letters Abroad",
      description: "Match Rizal's correspondences with their recipients",
      path: "/chapter/3/level/3",
    },
    {
      id: 4,
      title: "European Quiz",
      description: "Test your knowledge of Rizal's time in Europe",
      path: "/chapter/3/level/4",
    },
    {
      id: 5,
      title: "Travel Map",
      description: "Trace Rizal's journey across Europe",
      path: "/chapter/3/level/5",
    },
  ]

  const handleLevelComplete = (levelId) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId])
      
      // Unlock next level if not already unlocked
      const nextLevel = levelId + 1
      if (nextLevel <= levels.length && !unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels([...unlockedLevels, nextLevel])
      }
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chapter 3: Rizal in Europe</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Chapter</h2>
          <p className="text-gray-700 mb-4">
            Explore Rizal's journey through Europe, where he pursued higher education, wrote his famous novels, and became a key figure in the Propaganda Movement. This chapter covers his experiences from 1882 to 1887.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                !unlockedLevels.includes(level.id) ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'
              }`}
              onClick={() => unlockedLevels.includes(level.id) && navigate(level.path)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{level.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Level {level.id}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{level.description}</p>
                
                <div className="flex justify-between items-center">
                  {completedLevels.includes(level.id) ? (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Completed
                    </span>
                  ) : unlockedLevels.includes(level.id) ? (
                    <span className="text-blue-600 text-sm font-medium">
                      Click to start
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Complete previous level
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Rizal Interactive Learning Platform</p>
        </div>
      </footer>
    </div>
  )
}
