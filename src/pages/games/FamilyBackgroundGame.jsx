"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FamilyBackgroundGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState(0)
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showQuizResult, setShowQuizResult] = useState(false)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])

  // Family Tree State
  const [familyTreeAnswers, setFamilyTreeAnswers] = useState({})

  // Matching Game State
  const [matchingPairs, setMatchingPairs] = useState([])
  const [selectedMatching, setSelectedMatching] = useState([])

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "Jose's Parents",
      question: "Who were Jose Rizal's parents?",
      options: [
        "Francisco Mercado and Teodora Alonso",
        "Juan Mercado and Maria Alonso",
        "Pedro Mercado and Carmen Alonso",
        "Antonio Mercado and Rosa Alonso",
      ],
      correct: 0,
    },
    {
      id: 1,
      type: "memory",
      title: "Family Members Memory Game",
      cards: [
        { id: 1, name: "Francisco", role: "Father", image: "/placeholder.svg?height=100&width=100" },
        { id: 2, name: "Teodora", role: "Mother", image: "/placeholder.svg?height=100&width=100" },
        { id: 3, name: "Saturnina", role: "Sister", image: "/placeholder.svg?height=100&width=100" },
        { id: 4, name: "Paciano", role: "Brother", image: "/placeholder.svg?height=100&width=100" },
        { id: 5, name: "Narcisa", role: "Sister", image: "/placeholder.svg?height=100&width=100" },
        { id: 6, name: "Olimpia", role: "Sister", image: "/placeholder.svg?height=100&width=100" },
      ],
    },
    {
      id: 2,
      type: "familytree",
      title: "Complete the Family Tree",
      positions: [
        { id: "father", label: "Father", x: 200, y: 50 },
        { id: "mother", label: "Mother", x: 400, y: 50 },
        { id: "jose", label: "Jose", x: 300, y: 150, fixed: true },
        { id: "paciano", label: "Older Brother", x: 150, y: 150 },
        { id: "saturnina", label: "Older Sister", x: 450, y: 150 },
      ],
      options: ["Francisco Mercado", "Teodora Alonso", "Paciano Rizal", "Saturnina Rizal"],
      correct: {
        father: "Francisco Mercado",
        mother: "Teodora Alonso",
        paciano: "Paciano Rizal",
        saturnina: "Saturnina Rizal",
      },
    },
    {
      id: 3,
      type: "matching",
      title: "Match Family Facts",
      pairs: [
        { left: "Francisco Mercado", right: "Jose's father, a farmer and businessman" },
        { left: "Teodora Alonso", right: "Jose's mother, his first teacher" },
        { left: "Paciano Rizal", right: "Jose's older brother, a revolutionary" },
        { left: "11 children", right: "Total number of Rizal siblings" },
        { left: "7th child", right: "Jose's birth order in the family" },
        { left: "Calamba", right: "The family's hometown" },
      ],
    },
  ]

  useEffect(() => {
    if (currentGame === 1) {
      // Initialize memory game
      const cards = games[1].cards
      const duplicatedCards = [...cards, ...cards].map((card, index) => ({
        ...card,
        uniqueId: index,
        isFlipped: false,
      }))
      setMemoryCards(duplicatedCards.sort(() => Math.random() - 0.5))
    } else if (currentGame === 3) {
      // Initialize matching game
      const pairs = games[3].pairs
      const leftItems = pairs.map((pair, index) => ({ id: `left-${index}`, text: pair.left, type: "left" }))
      const rightItems = pairs.map((pair, index) => ({ id: `right-${index}`, text: pair.right, type: "right" }))
      setMatchingPairs([...leftItems, ...rightItems.sort(() => Math.random() - 0.5)])
    }
  }, [currentGame])

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    setShowQuizResult(true)

    setTimeout(() => {
      if (answerIndex === games[currentGame].correct) {
        setScore(score + 25)
        nextGame()
      } else {
        setSelectedAnswer(null)
        setShowQuizResult(false)
      }
    }, 2000)
  }

  const handleMemoryCardClick = (cardIndex) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedCards.includes(cardIndex)) {
      return
    }

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      const firstCard = memoryCards[first]
      const secondCard = memoryCards[second]

      if (firstCard.id === secondCard.id) {
        // Match found
        setMatchedCards([...matchedCards, first, second])
        setScore(score + 15)
        setFlippedCards([])

        // Check if game is complete
        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => nextGame(), 1000)
        }
      } else {
        // No match
        setTimeout(() => setFlippedCards([]), 1000)
      }
    }
  }

  const handleFamilyTreeAnswer = (position, answer) => {
    const newAnswers = { ...familyTreeAnswers, [position]: answer }
    setFamilyTreeAnswers(newAnswers)

    if (answer === games[2].correct[position]) {
      setScore(score + 20)
    }

    // Check if all positions are filled correctly
    const requiredPositions = Object.keys(games[2].correct)
    const allCorrect = requiredPositions.every((pos) => newAnswers[pos] === games[2].correct[pos])

    if (allCorrect && Object.keys(newAnswers).length === requiredPositions.length) {
      setTimeout(() => nextGame(), 1000)
    }
  }

  const handleMatchingClick = (item) => {
    if (selectedMatching.length === 0) {
      setSelectedMatching([item])
    } else if (selectedMatching.length === 1) {
      const [firstItem] = selectedMatching
      if (firstItem.id === item.id) {
        setSelectedMatching([])
        return
      }

      // Check if it's a valid pair
      const firstIndex = Number.parseInt(firstItem.id.split("-")[1])
      const secondIndex = Number.parseInt(item.id.split("-")[1])

      if (
        firstIndex === secondIndex &&
        ((firstItem.type === "left" && item.type === "right") || (firstItem.type === "right" && item.type === "left"))
      ) {
        // Correct match
        setScore(score + 15)
        setMatchingPairs(matchingPairs.filter((p) => p.id !== firstItem.id && p.id !== item.id))
        setSelectedMatching([])

        if (matchingPairs.length <= 2) {
          setTimeout(() => nextGame(), 1000)
        }
      } else {
        // Wrong match
        setTimeout(() => setSelectedMatching([]), 1000)
      }
    }
  }

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1)
      setSelectedAnswer(null)
      setShowQuizResult(false)
      setFamilyTreeAnswers({})
      setFlippedCards([])
      setMatchedCards([])
      setSelectedMatching([])
    } else {
      setGameCompleted(true)
      setShowCelebration(true)
    }
  }

  const handleBackToChapter = () => {
    navigate("/chapter/1")
  }

  const renderQuizGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{game.question}</h3>
      <div className="grid grid-cols-1 gap-4">
        {game.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleQuizAnswer(index)}
            disabled={showQuizResult}
            className={`p-4 rounded-xl text-left transition-all duration-200 ${
              showQuizResult
                ? index === game.correct
                  ? "bg-green-100 border-2 border-green-400 text-green-800"
                  : index === selectedAnswer
                    ? "bg-red-100 border-2 border-red-400 text-red-800"
                    : "bg-gray-100 text-gray-600"
                : "bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showQuizResult && (
        <div className="mt-6 text-center">
          {selectedAnswer === game.correct ? (
            <div className="text-green-600 font-semibold">Excellent! You know Jose's family! 🎉</div>
          ) : (
            <div className="text-red-600 font-semibold">Try again! Think about Jose's parents! 💪</div>
          )}
        </div>
      )}
    </div>
  )

  const renderMemoryGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find the matching pairs of family members</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {memoryCards.map((card, index) => (
          <div
            key={card.uniqueId}
            onClick={() => handleMemoryCardClick(index)}
            className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? "bg-white border-2 border-purple-300"
                : "bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
            }`}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? (
              <div className="h-full flex flex-col items-center justify-center p-2">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  className="w-12 h-12 rounded-full mb-2 bg-gray-200"
                />
                <div className="text-sm font-bold text-gray-800">{card.name}</div>
                <div className="text-xs text-gray-600">{card.role}</div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-white text-2xl">?</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderFamilyTreeGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Jose's Family Tree</h3>

      {/* Family Tree Diagram */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 mb-6 min-h-[300px]">
        {game.positions.map((position) => (
          <div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(position.x / 600) * 100}%`, top: `${(position.y / 200) * 100}%` }}
          >
            <div className="text-center">
              <div className="bg-white rounded-xl p-3 shadow-md border-2 border-gray-200 min-w-[120px]">
                <div className="text-xs text-gray-500 mb-1">{position.label}</div>
                {position.fixed ? (
                  <div className="font-bold text-gray-800">Jose Rizal</div>
                ) : (
                  <select
                    value={familyTreeAnswers[position.id] || ""}
                    onChange={(e) => handleFamilyTreeAnswer(position.id, e.target.value)}
                    className={`w-full text-sm border rounded px-2 py-1 ${
                      familyTreeAnswers[position.id] === game.correct[position.id]
                        ? "border-green-400 bg-green-50 text-green-800"
                        : familyTreeAnswers[position.id]
                          ? "border-red-400 bg-red-50 text-red-800"
                          : "border-gray-300"
                    }`}
                  >
                    <option value="">Choose...</option>
                    {game.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Family Tree Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="33%" y1="25%" x2="67%" y2="25%" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="25%" y1="75%" x2="75%" y2="75%" stroke="#9CA3AF" strokeWidth="2" />
        </svg>
      </div>

      {/* Available Options */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Available Family Members:</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {game.options.map((option, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {option}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMatchingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Match family members with their descriptions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">Family Members</h4>
          {matchingPairs
            .filter((item) => item.type === "left")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleMatchingClick(item)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                  selectedMatching.some((s) => s.id === item.id)
                    ? "bg-blue-200 border-2 border-blue-400"
                    : "bg-orange-50 hover:bg-orange-100 border-2 border-orange-200"
                }`}
              >
                {item.text}
              </button>
            ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">Descriptions</h4>
          {matchingPairs
            .filter((item) => item.type === "right")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleMatchingClick(item)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                  selectedMatching.some((s) => s.id === item.id)
                    ? "bg-blue-200 border-2 border-blue-400"
                    : "bg-green-50 hover:bg-green-100 border-2 border-green-200"
                }`}
              >
                {item.text}
              </button>
            ))}
        </div>
      </div>

      {selectedMatching.length > 0 && (
        <div className="mt-6 text-center">
          <div className="text-blue-600 font-medium">Selected: {selectedMatching[0].text}</div>
          <div className="text-sm text-gray-500">Click on a matching item from the other column</div>
        </div>
      )}
    </div>
  )

  const renderCurrentGame = () => {
    const game = games[currentGame]
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game)
      case "memory":
        return renderMemoryGame(game)
      case "familytree":
        return renderFamilyTreeGame(game)
      case "matching":
        return renderMatchingGame(game)
      default:
        return null
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">
            {showCelebration && <div className="text-6xl mb-6 animate-bounce">👨‍👩‍👧‍👦</div>}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Family Expert!</h1>
            <p className="text-xl text-gray-600 mb-6">
              You've mastered Jose Rizal's family background! You now know about his parents, siblings, and family
              values.
            </p>
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-purple-100 mt-2">Outstanding work, {username}!</div>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleBackToChapter}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                Back to Chapter 1
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToChapter}
              className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Family Background</h1>
              <p className="text-sm text-gray-600">Level 2 - Meet Jose's Family</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-gray-700">Score: {score}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Game Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 max-w-2xl mx-auto">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentGame + 1) / games.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Game {currentGame + 1} of {games.length}
          </p>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{games[currentGame].title}</h2>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Info */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Jose's Family Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨</span>
              <div>
                <strong>Father - Francisco Mercado:</strong> A successful farmer and businessman who owned land in
                Calamba. He was well-respected in the community.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👩</span>
              <div>
                <strong>Mother - Teodora Alonso:</strong> An educated woman who became Jose's first teacher. She taught
                him to read and write.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨‍🎓</span>
              <div>
                <strong>Brother - Paciano:</strong> Jose's older brother who supported his education and later joined
                the revolution.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <strong>Large Family:</strong> Jose had 10 siblings, making them a family of 11 children total. He was
                the 7th child.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
