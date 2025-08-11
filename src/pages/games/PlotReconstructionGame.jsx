import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "../../components/SortableItem"

export default function PlotReconstructionGame({ username, onComplete }) {
  const [events, setEvents] = useState([
    { id: 1, text: "Crisostomo Ibarra returns to the Philippines after seven years in Europe", correct: true },
    { id: 2, text: "Ibarra meets Padre Damaso at a dinner party and is insulted by him", correct: false },
    { id: 3, text: "Ibarra's father, Don Rafael, dies in prison", correct: false },
    { id: 4, text: "Ibarra meets Maria Clara, his childhood sweetheart", correct: false },
    { id: 5, text: "The schoolhouse project is sabotaged, nearly killing Ibarra", correct: false },
    { id: 6, text: "Elias warns Ibarra about a plot to kill him", correct: false },
    { id: 7, text: "Maria Clara is forced to enter the convent", correct: false },
    { id: 8, text: "Ibarra is excommunicated and hunted by the authorities", correct: false },
  ])

  const [shuffled, setShuffled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [gameOver, setGameOver] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Shuffle events on component mount
  useEffect(() => {
    if (!shuffled) {
      setShuffled(true)
      setEvents(prev => [...prev].sort(() => Math.random() - 0.5))
    }
  }, [shuffled])

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !submitted && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true)
      handleSubmit()
    }
  }, [timeLeft, submitted, gameOver])

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      setEvents((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = () => {
    if (submitted) return
    
    let correctCount = 0
    const updatedEvents = events.map((event, index) => {
      const isCorrect = event.id === index + 1
      if (isCorrect) correctCount++
      return { ...event, correct: isCorrect }
    })
    
    setEvents(updatedEvents)
    setSubmitted(true)
    
    // Calculate score based on correct answers and time left
    const timeBonus = Math.floor(timeLeft / 10)
    const newScore = (correctCount / events.length) * 100 + timeBonus
    setScore(Math.min(100, Math.round(newScore)))
    
    // If all correct, mark as completed
    if (correctCount === events.length) {
      onComplete()
    }
  }

  const resetGame = () => {
    setShuffled(false)
    setSubmitted(false)
    setScore(0)
    setTimeLeft(300)
    setGameOver(false)
    setShowHint(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Plot Reconstruction</h1>
            <p className="text-indigo-700">Arrange the events in the correct chronological order</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-700">{formatTime(timeLeft)}</div>
            <div className="text-sm text-indigo-600">Time Remaining</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Events in Noli Me Tangere</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Check Order
                </button>
              )}
              {submitted && (
                <button
                  onClick={resetGame}
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>

          {showHint && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
              <p className="text-yellow-800">
                <strong>Hint:</strong> Pay attention to the sequence of Ibarra's return, his interactions with other characters, and the escalation of conflicts in the story.
              </p>
            </div>
          )}

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-3">
              <SortableContext 
                items={events}
                strategy={verticalListSortingStrategy}
              >
                {events.map((event, index) => (
                  <SortableItem 
                    key={event.id} 
                    id={event.id}
                    number={index + 1}
                    text={event.text}
                    isCorrect={event.correct}
                    showResult={submitted}
                    disabled={submitted}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>

        {submitted && (
          <div className={`p-6 rounded-xl shadow-lg ${score >= 70 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {score >= 70 ? 'Well Done!' : 'Good Try!'}
            </h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{score}%</div>
              <div className="text-gray-600">Your Score</div>
            </div>
            
            {score >= 70 ? (
              <div className="text-center">
                <p className="text-green-700 mb-4">
                  You've successfully reconstructed the plot of Noli Me Tangere!
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-red-700 mb-4">
                  Some events are out of order. Review the correct sequence and try again!
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
