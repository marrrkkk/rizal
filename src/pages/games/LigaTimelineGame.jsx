import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "../../components/SortableItem"
import GameHeader from "../../components/GameHeader"

export default function LigaTimelineGame({ username, onLogout, onComplete }) {
  const [events, setEvents] = useState([
    { id: 1, text: "Rizal returns to the Philippines from Europe", correctPosition: 1 },
    { id: 2, text: "Rizal founds La Liga Filipina in Tondo, Manila", correctPosition: 2 },
    { id: 3, text: "Rizal is arrested and exiled to Dapitan", correctPosition: 3 },
    { id: 4, text: "Rizal establishes a school and clinic in Dapitan", correctPosition: 4 },
    { id: 5, text: "Rizal volunteers as a military doctor in Cuba", correctPosition: 5 },
    { id: 6, text: "Rizal is arrested en route to Cuba and imprisoned in Barcelona", correctPosition: 6 },
    { id: 7, text: "Rizal is executed at Bagumbayan (now Rizal Park)", correctPosition: 7 },
  ])

  const [shuffledEvents, setShuffledEvents] = useState([])
  const [isChecking, setIsChecking] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [showHint, setShowHint] = useState(false)

  // Shuffle events on component mount
  useEffect(() => {
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    setShuffledEvents(shuffled)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setShuffledEvents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const arrayMove = (array, from, to) => {
    const newArray = [...array]
    const [movedItem] = newArray.splice(from, 1)
    newArray.splice(to, 0, movedItem)
    return newArray
  }

  const checkOrder = () => {
    setIsChecking(true)
    let correctCount = 0

    const updatedEvents = shuffledEvents.map((event, index) => {
      const isCorrect = event.correctPosition === index + 1
      if (isCorrect) correctCount++
      return { ...event, isCorrect }
    })

    const newScore = Math.floor((correctCount / events.length) * 100)
    setScore(newScore)
    setShuffledEvents(updatedEvents)

    if (correctCount === events.length) {
      setFeedback("Perfect! You've got all events in the correct order! 🎉")
      setIsComplete(true)
      if (onComplete) {
        onComplete(newScore)
      }
    } else {
      setFeedback(`You got ${correctCount} out of ${events.length} events correct. Keep trying!`)
      setTimeout(() => setFeedback(""), 3000)
    }

    setTimeout(() => setIsChecking(false), 1000)
  }

  const resetGame = () => {
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    setShuffledEvents(shuffled)
    setScore(0)
    setFeedback("")
    setIsComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <GameHeader
        title="La Liga Filipina Timeline"
        chapter={5}
        level={1}
        username={username}
        onLogout={onLogout}
      />

      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-indigo-800">La Liga Filipina Timeline</h1>
              <p className="text-gray-600">
                Arrange these events in the correct chronological order
              </p>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              Score: {score}%
            </div>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-yellow-700 hover:text-yellow-800 font-medium underline"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <p className="text-sm text-yellow-700 mt-2">
                    Drag and drop the events to arrange them in the correct historical order. The timeline should reflect the sequence of events from Rizal's return to the Philippines to his execution.
                  </p>
                )}
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`mb-6 p-4 rounded-md ${isComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback}
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={shuffledEvents}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 mb-8">
                {shuffledEvents.map((event, index) => (
                  <SortableItem
                    key={event.id}
                    id={event.id}
                    number={index + 1}
                    text={event.text}
                    isCorrect={event.isCorrect}
                    showResult={isChecking}
                    disabled={isComplete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={checkOrder}
              disabled={isChecking}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${isChecking
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isChecking ? 'Checking...' : 'Check Order'}
            </button>
          </div>

          {isComplete && (
            <div className="mt-8 p-6 bg-green-50 rounded-xl text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations! 🎉</h3>
              <p className="text-green-700 mb-4">You've completed the La Liga Filipina Timeline challenge with a score of {score}%!</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
