"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function JoseBirthGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState(0)
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showQuizResult, setShowQuizResult] = useState(false)

  // Puzzle Game State
  const [puzzlePieces, setPuzzlePieces] = useState([])
  const [draggedPiece, setDraggedPiece] = useState(null)

  // Fill in the Blanks State
  const [blanksAnswers, setBlanksAnswers] = useState({})

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "When was Jose born?",
      question: "On what date was Jose Rizal born?",
      options: ["June 19, 1861", "July 19, 1861", "June 19, 1862", "May 19, 1861"],
      correct: 0,
    },
    {
      id: 1,
      type: "quiz",
      title: "Where was Jose born?",
      question: "In which town was Jose Rizal born?",
      options: ["Manila", "Calamba", "Laguna", "Bataan"],
      correct: 1,
    },
    {
      id: 2,
      type: "puzzle",
      title: "Complete Jose's Full Name",
      pieces: ["José", "Protasio", "Rizal", "Mercado", "y", "Alonso", "Realonda"],
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: 3,
      type: "blanks",
      title: "Fill in the Facts",
      sentence:
        "Jose Rizal was born on _____ in the town of _____, _____. His father was _____ and his mother was _____.",
      blanks: ["June 19, 1861", "Calamba", "Laguna", "Francisco Mercado", "Teodora Alonso"],
      options: [
        ["June 19, 1861", "July 19, 1861", "May 19, 1861"],
        ["Calamba", "Manila", "Bataan"],
        ["Laguna", "Batangas", "Cavite"],
        ["Francisco Mercado", "Juan Mercado", "Pedro Mercado"],
        ["Teodora Alonso", "Maria Alonso", "Carmen Alonso"],
      ],
    },
  ]

  useEffect(() => {
    if (currentGame === 2) {
      // Initialize puzzle pieces
      const shuffled = [...games[2].pieces].sort(() => Math.random() - 0.5)
      setPuzzlePieces(shuffled.map((piece, index) => ({ id: index, text: piece, placed: false })))
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
        // Allow retry
        setSelectedAnswer(null)
        setShowQuizResult(false)
      }
    }, 2000)
  }

  const handlePuzzleDrop = (e) => {
    e.preventDefault()
    const dropZoneIndex = Number.parseInt(e.target.dataset.index)
    if (draggedPiece !== null && dropZoneIndex !== undefined) {
      const newPieces = [...puzzlePieces]
      const piece = newPieces.find((p) => p.id === draggedPiece)
      if (piece && games[2].pieces[dropZoneIndex] === piece.text) {
        piece.placed = true
        setPuzzlePieces(newPieces)
        setScore(score + 15)

        // Check if puzzle is complete
        if (newPieces.every((p) => p.placed)) {
          setTimeout(() => nextGame(), 1000)
        }
      }
    }
    setDraggedPiece(null)
  }

  const handleBlanksAnswer = (blankIndex, answer) => {
    const newAnswers = { ...blanksAnswers, [blankIndex]: answer }
    setBlanksAnswers(newAnswers)

    if (answer === games[3].blanks[blankIndex]) {
      setScore(score + 20)
    }

    // Check if all blanks are filled correctly
    if (Object.keys(newAnswers).length === games[3].blanks.length) {
      const allCorrect = games[3].blanks.every((correct, index) => newAnswers[index] === correct)
      if (allCorrect) {
        setTimeout(() => nextGame(), 1000)
      }
    }
  }

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1)
      setSelectedAnswer(null)
      setShowQuizResult(false)
      setBlanksAnswers({})
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
                : "bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showQuizResult && (
        <div className="mt-6 text-center">
          {selectedAnswer === game.correct ? (
            <div className="text-green-600 font-semibold">Correct! Great job! 🎉</div>
          ) : (
            <div className="text-red-600 font-semibold">Try again! You can do it! 💪</div>
          )}
        </div>
      )}
    </div>
  )

  const renderPuzzleGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Drag the pieces to complete Jose's full name
      </h3>

      {/* Drop zones */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-[60px] p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
        {game.pieces.map((_, index) => (
          <div
            key={index}
            data-index={index}
            onDrop={handlePuzzleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="min-w-[100px] h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium"
          >
            {puzzlePieces.find((p) => p.text === game.pieces[index] && p.placed) ? game.pieces[index] : ""}
          </div>
        ))}
      </div>

      {/* Draggable pieces */}
      <div className="flex flex-wrap justify-center gap-3">
        {puzzlePieces
          .filter((p) => !p.placed)
          .map((piece) => (
            <div
              key={piece.id}
              draggable
              onDragStart={() => setDraggedPiece(piece.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg cursor-move hover:from-blue-500 hover:to-blue-700 transition-all duration-200 font-medium shadow-md"
            >
              {piece.text}
            </div>
          ))}
      </div>
    </div>
  )

  const renderBlanksGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Fill in the blanks about Jose's birth</h3>

      <div className="text-lg leading-relaxed text-gray-700">
        {game.sentence.split("_____").map((part, index) => (
          <span key={index}>
            {part}
            {index < game.blanks.length && (
              <select
                value={blanksAnswers[index] || ""}
                onChange={(e) => handleBlanksAnswer(index, e.target.value)}
                className={`mx-2 px-3 py-1 border-2 rounded-lg font-medium ${
                  blanksAnswers[index] === game.blanks[index]
                    ? "border-green-400 bg-green-50 text-green-800"
                    : blanksAnswers[index]
                      ? "border-red-400 bg-red-50 text-red-800"
                      : "border-blue-300 bg-white"
                }`}
              >
                <option value="">Choose...</option>
                {game.options[index].map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </span>
        ))}
      </div>
    </div>
  )

  const renderCurrentGame = () => {
    const game = games[currentGame]
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game)
      case "puzzle":
        return renderPuzzleGame(game)
      case "blanks":
        return renderBlanksGame(game)
      default:
        return null
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">
            {showCelebration && <div className="text-6xl mb-6 animate-bounce">🎉</div>}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Congratulations!</h1>
            <p className="text-xl text-gray-600 mb-6">
              You've completed the Jose's Birth game and learned about our national hero!
            </p>
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-green-100 mt-2">Excellent work, {username}!</div>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🎂</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Jose's Birth</h1>
              <p className="text-sm text-gray-600">Level 1 - Interactive Learning Game</p>
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
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
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
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Did You Know?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <strong>Birth Date:</strong> Jose Rizal was born on June 19, 1861, during the Spanish colonial period.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏠</span>
              <div>
                <strong>Birthplace:</strong> He was born in Calamba, Laguna, in a house that still stands today as a
                shrine.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <strong>Family:</strong> He was the seventh of eleven children in the Mercado-Rizal family.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📜</span>
              <div>
                <strong>Full Name:</strong> His complete name was José Protasio Rizal Mercado y Alonso Realonda.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
