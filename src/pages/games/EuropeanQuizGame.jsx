import { useState, useEffect } from "react"

export default function EuropeanQuizGame({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(true)

  const questions = [
    {
      question: "In which European city did Rizal complete his novel 'Noli Me Tangere'?",
      options: ["Madrid", "Paris", "Berlin", "Brussels"],
      correct: 2,
      explanation: "Rizal completed 'Noli Me Tangere' in Berlin, Germany in 1887."
    },
    {
      question: "What was the name of the organization Rizal joined in Madrid that advocated for reforms in the Philippines?",
      options: ["La Solidaridad", "La Liga Filipina", "Circulo Hispano-Filipino", "Propaganda Movement"],
      correct: 2,
      explanation: "Rizal joined the Circulo Hispano-Filipino, a group of Filipino students in Madrid."
    },
    {
      question: "Which of Rizal's works was published in La Solidaridad under the pen name Laong Laan?",
      options: ["A La Juventud Filipina", "Mi Ultimo Adios", "A La Defensa", "A La Patria"],
      correct: 2,
      explanation: "'A La Defensa' was one of Rizal's articles published in La Solidaridad."
    },
    {
      question: "In which European city did Rizal study ophthalmology under Dr. Louis de Weckert?",
      options: ["Madrid", "Paris", "Heidelberg", "Brussels"],
      correct: 1,
      explanation: "Rizal studied ophthalmology under Dr. Louis de Weckert in Paris."
    },
    {
      question: "What was the name of Rizal's Austrian friend who became his close confidant?",
      options: ["Ferdinand Blumentritt", "Maximo Viola", "Mariano Ponce", "Graciano Lopez Jaena"],
      correct: 0,
      explanation: "Ferdinand Blumentritt was Rizal's Austrian friend and correspondent."
    },
    {
      question: "Which of these was NOT a purpose of Rizal's trip to Europe?",
      options: ["To further his studies", "To observe European society", "To escape Spanish authorities", "To publish his novels"],
      correct: 2,
      explanation: "Rizal's initial trip to Europe was for studies, observation, and writing, not to escape authorities."
    },
    {
      question: "In which European city did Rizal write most of 'El Filibusterismo'?",
      options: ["Madrid", "Brussels", "Ghent", "Barcelona"],
      correct: 2,
      explanation: "Rizal completed most of 'El Filibusterismo' in Ghent, Belgium."
    }
  ]

  // Timer effect
  useEffect(() => {
    if (!timerActive) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [currentQuestion, timerActive])

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === questions[currentQuestion].correct
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
    }
    
    setTimerActive(false)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setTimeLeft(30)
      setTimerActive(true)
    } else {
      setShowScore(true)
      onComplete(score, questions.length)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setTimeLeft(30)
    setTimerActive(true)
  }

  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100)
    let message = ''
    
    if (percentage >= 85) message = "Excellent! You're a Rizal expert!"
    else if (percentage >= 70) message = "Great job! You know your Rizal history well."
    else if (percentage >= 50) message = "Good effort! You know some about Rizal's time in Europe."
    else message = "Keep learning! Review Rizal's European experiences to improve."
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <div className="text-4xl font-bold mb-2">{score}<span className="text-lg text-gray-500">/{questions.length}</span></div>
        <div className="text-xl mb-6">{percentage}%</div>
        <p className="text-lg mb-6">{message}</p>
        <div className="space-y-4">
          <button
            onClick={resetQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Time:</span>
            <div className={`w-12 text-center font-mono font-bold ${
              timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {timeLeft}s
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-md border border-gray-300 hover:border-blue-500 transition-colors"
            
            if (selectedAnswer !== null) {
              if (index === currentQ.correct) {
                buttonClass += " bg-green-100 border-green-500"
              } else if (index === selectedAnswer && index !== currentQ.correct) {
                buttonClass += " bg-red-100 border-red-500"
              }
            } else {
              buttonClass += " hover:bg-gray-50"
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={buttonClass}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div className="mt-6 p-4 rounded-md bg-blue-50 border border-blue-200">
          <p className="font-medium text-blue-800">
            {isCorrect ? "Correct!" : "Incorrect."} {currentQ.explanation}
          </p>
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  )
}
