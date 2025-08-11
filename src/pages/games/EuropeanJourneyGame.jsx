import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function EuropeanJourneyGame({ onComplete }) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [shuffledOptions, setShuffledOptions] = useState([])

  const events = [
    { year: 1882, event: "Departed for Spain", description: "Left Philippines to study in Spain", location: "Manila to Barcelona" },
    { year: 1883, event: "Moved to Madrid", description: "Studied medicine and philosophy", location: "Madrid, Spain" },
    { year: 1885, event: "Earned Medical Degree", description: "Graduated as a physician", location: "Madrid, Spain" },
    { year: 1886, event: "Studied in Paris", description: "Specialized in ophthalmology", location: "Paris, France" },
    { year: 1887, event: "Published Noli Me Tangere", description: "First novel published in Berlin", location: "Berlin, Germany" }
  ]

  useEffect(() => startNewRound(), [currentEventIndex])

  const startNewRound = () => {
    if (currentEventIndex >= events.length) {
      onComplete(score, events.length)
      return
    }

    const currentEvent = events[currentEventIndex]
    const otherYears = events
      .filter(e => e.year !== currentEvent.year)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(e => e.year)
    
    setShuffledOptions([...otherYears, currentEvent.year].sort(() => 0.5 - Math.random()))
    setFeedback("")
    setIsCorrect(null)
    setSelectedOption(null)
  }

  const handleAnswer = (selectedYear) => {
    const correctYear = events[currentEventIndex].year
    const correct = selectedYear === correctYear
    
    setSelectedOption(selectedYear)
    setIsCorrect(correct)
    setScore(prev => correct ? prev + 1 : prev)
    
    const event = events[currentEventIndex]
    setFeedback(correct 
      ? `Correct! ${event.description}` 
      : `Incorrect. The correct answer is ${correctYear}: ${event.event}`)
    
    setTimeout(() => setCurrentEventIndex(prev => prev + 1), 1500)
  }

  if (currentEventIndex >= events.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Journey Complete!</h2>
        <p className="text-lg mb-6">Score: {score} out of {events.length}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    )
  }

  const currentEvent = events[currentEventIndex]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Rizal's European Journey</h2>
        <p className="text-gray-600 mb-4">
          Place the events in chronological order. What year did this happen?
        </p>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-lg">{currentEvent.event}</h3>
          <p className="text-gray-700">{currentEvent.location}</p>
          <p className="text-sm text-gray-500 mt-1">{currentEvent.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {shuffledOptions.map((year) => (
            <button
              key={year}
              onClick={() => !selectedOption && handleAnswer(year)}
              disabled={selectedOption !== null}
              className={`p-3 rounded-md text-center font-medium transition-colors ${
                !selectedOption
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  : selectedOption === year
                  ? isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  : year === currentEvent.year
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`p-3 rounded-md ${
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Question {currentEventIndex + 1} of {events.length}</div>
        <div>Score: {score}</div>
      </div>
    </div>
  )
}
