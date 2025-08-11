"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function FirstTeacherGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState(0)
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showQuizResult, setShowQuizResult] = useState(false)

  // Lesson Simulation State
  const [lessonProgress, setLessonProgress] = useState(0)
  const [currentLessonStep, setCurrentLessonStep] = useState(0)

  // Letter Tracing State
  const [tracedLetters, setTracedLetters] = useState([])
  const [currentLetter, setCurrentLetter] = useState(0)

  // Reading Practice State
  const [readingAnswers, setReadingAnswers] = useState({})

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "Jose's First Teacher",
      question: "Who was Jose Rizal's first teacher?",
      options: ["A school teacher", "His father Francisco", "His mother Teodora", "His brother Paciano"],
      correct: 2,
    },
    {
      id: 1,
      type: "lesson",
      title: "A Day with Mother Teodora",
      steps: [
        {
          id: 1,
          instruction: "Good morning, Jose! Let's start with our prayers.",
          action: "Click to pray with Jose",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 2,
          instruction: "Now, let's practice reading this story together.",
          action: "Click to read with Jose",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 3,
          instruction: "Very good! Now let's practice writing letters.",
          action: "Click to write with Jose",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 4,
          instruction: "Excellent work! Let's end with a story about good values.",
          action: "Click to listen to the story",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    {
      id: 2,
      type: "tracing",
      title: "Learn to Write Like Jose",
      letters: [
        { letter: "J", instruction: "Trace the letter J for Jose" },
        { letter: "O", instruction: "Trace the letter O" },
        { letter: "S", instruction: "Trace the letter S" },
        { letter: "E", instruction: "Trace the letter E" },
      ],
    },
    {
      id: 3,
      type: "reading",
      title: "Reading Comprehension",
      story:
        "Jose's mother, Teodora, was a very smart woman. She taught Jose to read when he was only three years old. Every morning, they would sit together under the mango tree. Teodora would point to letters and words, and Jose would repeat them. She was patient and kind, always encouraging Jose to learn more.",
      questions: [
        {
          question: "How old was Jose when he learned to read?",
          options: ["Two years old", "Three years old", "Four years old"],
          correct: 1,
        },
        {
          question: "Where did they have their lessons?",
          options: ["In the house", "Under the mango tree", "At school"],
          correct: 1,
        },
        {
          question: "What kind of teacher was Teodora?",
          options: ["Strict and harsh", "Patient and kind", "Busy and rushed"],
          correct: 1,
        },
      ],
    },
  ]

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

  const handleLessonStep = () => {
    if (currentLessonStep < games[1].steps.length - 1) {
      setCurrentLessonStep(currentLessonStep + 1)
      setScore(score + 15)
    } else {
      setScore(score + 15)
      setTimeout(() => nextGame(), 1000)
    }
  }

  const handleLetterTrace = (letterIndex) => {
    if (!tracedLetters.includes(letterIndex)) {
      setTracedLetters([...tracedLetters, letterIndex])
      setScore(score + 10)

      if (tracedLetters.length + 1 === games[2].letters.length) {
        setTimeout(() => nextGame(), 1000)
      }
    }
  }

  const handleReadingAnswer = (questionIndex, answerIndex) => {
    const newAnswers = { ...readingAnswers, [questionIndex]: answerIndex }
    setReadingAnswers(newAnswers)

    const question = games[3].questions[questionIndex]
    if (answerIndex === question.correct) {
      setScore(score + 20)
    }

    // Check if all questions are answered correctly
    const allCorrect = games[3].questions.every((q, index) => newAnswers[index] === q.correct)
    if (allCorrect && Object.keys(newAnswers).length === games[3].questions.length) {
      setTimeout(() => nextGame(), 1000)
    }
  }

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1)
      setSelectedAnswer(null)
      setShowQuizResult(false)
      setCurrentLessonStep(0)
      setReadingAnswers({})
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
                : "bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 hover:border-rose-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showQuizResult && (
        <div className="mt-6 text-center">
          {selectedAnswer === game.correct ? (
            <div className="text-green-600 font-semibold">Correct! Teodora was Jose's first teacher! 👩‍🏫</div>
          ) : (
            <div className="text-red-600 font-semibold">Try again! Think about Jose's family! 💭</div>
          )}
        </div>
      )}
    </div>
  )

  const renderLessonGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Experience a lesson with Mother Teodora</h3>

      <div className="text-center mb-8">
        <div className="inline-block bg-rose-100 rounded-full px-4 py-2 mb-4">
          <span className="text-rose-800 font-medium">
            Step {currentLessonStep + 1} of {game.steps.length}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-md mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👩</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Mother Teodora</h4>
                  <p className="text-sm text-gray-600">Jose's First Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{game.steps[currentLessonStep].instruction}"</p>
            </div>

            <button
              onClick={handleLessonStep}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-500 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              {game.steps[currentLessonStep].action}
            </button>
          </div>

          <div className="flex-shrink-0">
            <img
              src={game.steps[currentLessonStep].image || "/placeholder.svg"}
              alt="Lesson scene"
              className="w-64 h-48 object-cover rounded-xl shadow-md bg-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2">
        {game.steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index <= currentLessonStep ? "bg-rose-400" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  )

  const renderTracingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Practice writing letters like Jose did</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {game.letters.map((letterData, index) => (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-3">
              <div
                className={`w-24 h-24 mx-auto rounded-xl flex items-center justify-center text-6xl font-bold cursor-pointer transition-all duration-300 ${
                  tracedLetters.includes(index)
                    ? "bg-green-200 text-green-800 scale-110"
                    : "bg-white hover:bg-yellow-100 text-gray-600 hover:scale-105"
                }`}
                onClick={() => handleLetterTrace(index)}
              >
                {letterData.letter}
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{letterData.instruction}</p>
            {tracedLetters.includes(index) && (
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Great job! ✓
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block bg-yellow-100 rounded-full px-4 py-2">
          <span className="text-yellow-800 font-medium">
            Letters traced: {tracedLetters.length} / {game.letters.length}
          </span>
        </div>
      </div>
    </div>
  )

  const renderReadingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Read and answer questions</h3>

      {/* Story */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">📖</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">Story Time</h4>
        </div>
        <p className="text-gray-700 leading-relaxed">{game.story}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {game.questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl p-6 shadow-md">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">
              {qIndex + 1}. {question.question}
            </h5>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleReadingAnswer(qIndex, oIndex)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    readingAnswers[qIndex] === oIndex
                      ? oIndex === question.correct
                        ? "bg-green-100 border-2 border-green-400 text-green-800"
                        : "bg-red-100 border-2 border-red-400 text-red-800"
                      : "bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCurrentGame = () => {
    const game = games[currentGame]
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game)
      case "lesson":
        return renderLessonGame(game)
      case "tracing":
        return renderTracingGame(game)
      case "reading":
        return renderReadingGame(game)
      default:
        return null
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">
            {showCelebration && <div className="text-6xl mb-6 animate-bounce">👩‍🏫</div>}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Learning Champion!</h1>
            <p className="text-xl text-gray-600 mb-6">
              You've learned about Jose's first teacher, his mother Teodora! You discovered how she taught him to read,
              write, and become the brilliant person he was destined to be.
            </p>
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-rose-100 mt-2">Wonderful learning, {username}!</div>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
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
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👩‍🏫</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">First Teacher</h1>
              <p className="text-sm text-gray-600">Level 4 - Learning with Mother Teodora</p>
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
              className="bg-gradient-to-r from-rose-500 to-pink-600 h-3 rounded-full transition-all duration-500"
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
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">About Teodora Alonso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👩‍🎓</span>
              <div>
                <strong>Educated Woman:</strong> Teodora was well-educated for her time, able to read and write in both
                Spanish and Tagalog.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📚</span>
              <div>
                <strong>First Teacher:</strong> She taught Jose to read at age 3, giving him a strong foundation for
                learning.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">❤️</span>
              <div>
                <strong>Patient & Kind:</strong> Teodora was known for her patience and gentle teaching methods with all
                her children.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🌟</span>
              <div>
                <strong>Strong Influence:</strong> Her love for learning and strong character greatly influenced Jose's
                development.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
