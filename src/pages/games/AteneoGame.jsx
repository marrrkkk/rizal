"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AteneoGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)

  const questions = [
    {
      question: "In what year did Jose Rizal enroll at Ateneo Municipal de Manila?",
      options: ["1872", "1877", "1882", "1892"],
      correct: 0,
      explanation: "Jose Rizal enrolled at Ateneo Municipal de Manila in 1872 at the age of 11."
    },
    {
      question: "What was Rizal's nickname while studying at Ateneo?",
      options: ["Pepe", "Pingkian", "Dimasalang", "Laong Laan"],
      correct: 0,
      explanation: "He was called 'Pepe' by his family and close friends."
    },
    {
      question: "What was the name of Rizal's first award-winning poem written at Ateneo?",
      options: ["Mi Primera Inspiración", "A La Juventud Filipina", "Sa Aking Mga Kabata", "El Consejo de los Dioses"],
      correct: 2,
      explanation: "'Sa Aking Mga Kabata' (To My Fellow Youth) is considered one of his earliest literary works."
    }
  ]

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === questions[currentQuestion].correct
    setIsCorrect(correct)
    if (correct) {
      setScore(score + 1)
    }
    
    // Show feedback briefly before moving to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const handleComplete = () => {
    // In a real app, you would save progress here
    navigate("/chapter/2")
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">Quiz Complete!</h2>
          <div className="text-6xl mb-6">🎉</div>
          <p className="text-xl text-gray-700 mb-2">You scored:</p>
          <p className="text-5xl font-bold text-indigo-600 mb-8">{score} / {questions.length}</p>
          <p className="text-gray-600 mb-8">
            {score === questions.length 
              ? "Perfect! You know Rizal's Ateneo years well!" 
              : score > questions.length / 2 
                ? "Good job! You know quite a bit about this period." 
                : "Keep learning! Rizal's life is full of interesting facts!"}
          </p>
          <button
            onClick={handleComplete}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors w-full"
          >
            Return to Chapter 2
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-800">Ateneo Municipal</h2>
          <div className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              let buttonStyle = "w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors"
              
              if (selectedAnswer !== null) {
                if (index === questions[currentQuestion].correct) {
                  buttonStyle += " bg-green-100 border-green-400"
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonStyle += " bg-red-100 border-red-400"
                }
              } else {
                buttonStyle += " hover:bg-gray-50"
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonStyle}
                >
                  {option}
                </button>
              )
            })}
          </div>
          
          {selectedAnswer !== null && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-medium">{isCorrect ? 'Correct!' : 'Not quite right.'}</p>
              <p className="text-sm mt-1">{questions[currentQuestion].explanation}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Score: {score}</span>
            <button
              onClick={() => navigate("/chapter/2")}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Exit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
