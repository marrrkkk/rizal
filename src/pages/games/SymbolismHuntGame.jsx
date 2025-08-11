import { useState, useEffect } from "react"

export default function SymbolismHuntGame({ username, onComplete }) {
  const [symbols, setSymbols] = useState([
    { id: 1, name: "Ibarra's House", image: "/symbols/ibarra-house.jpg", description: "Represents the declining state of the Filipino people under Spanish rule", matched: false },
    { id: 2, name: "The School", image: "/symbols/school.jpg", description: "Symbolizes hope for the future and the importance of education", matched: false },
    { id: 3, name: "The River", image: "/symbols/river.jpg", description: "Represents the flow of life and the passage of time in the story", matched: false },
    { id: 4, name: "The Storm", image: "/symbols/storm.jpg", description: "Symbolizes the brewing revolution and social unrest", matched: false },
    { id: 5, name: "The Church", image: "/symbols/church.jpg", description: "Represents the power and corruption of the Spanish friars", matched: false },
  ])

  const [descriptions, setDescriptions] = useState([
    { id: 1, text: "Represents the declining state of the Filipino people under Spanish rule", matched: false },
    { id: 2, text: "Symbolizes hope for the future and the importance of education", matched: false },
    { id: 3, text: "Represents the flow of life and the passage of time in the story", matched: false },
    { id: 4, text: "Symbolizes the brewing revolution and social unrest", matched: false },
    { id: 5, text: "Represents the power and corruption of the Spanish friars", matched: false },
  ])

  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [gameOver, setGameOver] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Shuffle descriptions on component mount
  useEffect(() => {
    setDescriptions(prev => [...prev].sort(() => Math.random() - 0.5))
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true)
    }
  }, [timeLeft, gameOver, completed])

  // Check for match when both symbol and description are selected
  useEffect(() => {
    if (selectedSymbol && selectedDescription) {
      const symbol = symbols.find(s => s.id === selectedSymbol)
      const description = descriptions.find(d => d.id === selectedDescription)
      
      if (symbol && description && symbol.description === description.text) {
        // Correct match
        setSymbols(prev => 
          prev.map(s => 
            s.id === selectedSymbol ? { ...s, matched: true } : s
          )
        )
        
        setDescriptions(prev =>
          prev.map(d =>
            d.id === selectedDescription ? { ...d, matched: true } : d
          )
        )
        
        setScore(prev => prev + 20)
        
        // Check if all symbols are matched
        const allMatched = symbols.every(s => s.matched || s.id === selectedSymbol)
        if (allMatched) {
          setCompleted(true)
          onComplete()
        }
      } else {
        // Incorrect match
        setScore(prev => Math.max(0, prev - 5))
      }
      
      // Reset selection after a short delay
      setTimeout(() => {
        setSelectedSymbol(null)
        setSelectedDescription(null)
      }, 500)
    }
  }, [selectedSymbol, selectedDescription])

  const handleSymbolClick = (id) => {
    if (selectedSymbol === id) {
      setSelectedSymbol(null)
    } else {
      setSelectedSymbol(id)
    }
  }

  const handleDescriptionClick = (id) => {
    if (selectedDescription === id) {
      setSelectedDescription(null)
    } else {
      setSelectedDescription(id)
    }
  }

  const resetGame = () => {
    setSymbols(prev => 
      prev.map(s => ({ ...s, matched: false }))
    )
    setDescriptions(prev => 
      prev.map(d => ({ ...d, matched: false }))
    )
    setSelectedSymbol(null)
    setSelectedDescription(null)
    setScore(0)
    setTimeLeft(180)
    setGameOver(false)
    setCompleted(false)
    setShowHint(false)
    // Reshuffle descriptions
    setDescriptions(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Symbolism Hunt</h1>
            <p className="text-indigo-700">Match the symbols from Noli Me Tangere with their meanings</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">{score}</div>
              <div className="text-sm text-indigo-600">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-indigo-600">Time Left</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            {showHint ? 'Hide Hints' : 'Show Hints'}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset Game
          </button>
        </div>

        {showHint && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-700">
              <strong>Hint:</strong> Pay attention to how Rizal uses objects and events to represent deeper meanings in the novel. 
              Think about what each symbol might represent in the context of Spanish colonial rule in the Philippines.
            </p>
          </div>
        )}

        {gameOver && !completed && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <h3 className="font-bold text-red-800">Time's Up!</h3>
            <p className="text-red-700">You've run out of time. Your final score is {score}.</p>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Symbols */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Symbols</h2>
            <div className="space-y-4">
              {symbols.map(symbol => (
                <div 
                  key={symbol.id}
                  onClick={() => !symbol.matched && !gameOver && handleSymbolClick(symbol.id)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    selectedSymbol === symbol.id 
                      ? 'border-blue-500 ring-2 ring-blue-300' 
                      : symbol.matched 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-blue-300'
                  } ${symbol.matched ? 'opacity-70' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{symbol.name}</h3>
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
                      {symbol.image ? (
                        <img 
                          src={symbol.image} 
                          alt={symbol.name} 
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/placeholder-symbol.jpg'
                          }}
                        />
                      ) : (
                        <span>Symbol Image</span>
                      )}
                    </div>
                    {symbol.matched && (
                      <div className="absolute inset-0 bg-green-50 bg-opacity-70 flex items-center justify-center">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Matched
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Meanings</h2>
            <div className="space-y-4">
              {descriptions.map(desc => (
                <div 
                  key={desc.id}
                  onClick={() => !desc.matched && !gameOver && handleDescriptionClick(desc.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedDescription === desc.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : desc.matched
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  } ${desc.matched ? 'opacity-70' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <p className={desc.matched ? 'text-green-800' : 'text-gray-800'}>{desc.text}</p>
                  {desc.matched && (
                    <div className="mt-2 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Matched
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {completed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">You've matched all the symbols with their meanings!</p>
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <div className="text-3xl font-bold text-indigo-700">{score} points</div>
                  <div className="text-indigo-600">Time Bonus: +{Math.floor((180 - timeLeft) / 10) * 5} points</div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/chapter/4/level/4'}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Next Level
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
