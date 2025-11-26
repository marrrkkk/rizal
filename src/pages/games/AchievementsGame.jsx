"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AchievementsGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate()
  const [events, setEvents] = useState([
    {
      id: 1,
      year: 1877,
      title: "Enrolled at UST",
      description: "Began studies in Philosophy and Letters",
      position: 0
    },
    {
      id: 2,
      year: 1878,
      title: "Won First Prize",
      description: "A La Juventud Filipina (To the Filipino Youth) poem contest",
      position: 0
    },
    {
      id: 3,
      year: 1879,
      title: "El Consejo de los Dioses",
      description: "Won first prize in literary contest",
      position: 0
    },
    {
      id: 4,
      year: 1880,
      title: "Shifted to Medicine",
      description: "Transferred to medical studies at UST",
      position: 0
    },
    {
      id: 5,
      year: 1882,
      title: "Sailed to Spain",
      description: "Left UST to continue medical studies in Madrid",
      position: 0
    },
  ])

  const [shuffledEvents, setShuffledEvents] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    // Shuffle events for the selection pool
    const shuffled = [...events].sort(() => Math.random() - 0.5)
    setShuffledEvents(shuffled)

    // Initialize positions for the timeline
    const positionedEvents = events.map((event, index) => ({
      ...event,
      position: index * 100 / (events.length - 1)
    }))
    setEvents(positionedEvents)
  }, [])

  const handleSelectEvent = (event) => {
    if (selectedEvents.some(e => e.id === event.id)) return

    const newSelection = [...selectedEvents, event]
    setSelectedEvents(newSelection)

    // Check if all events are selected
    if (newSelection.length === events.length) {
      checkOrder(newSelection)
    }
  }

  const handleDeselectEvent = (eventId) => {
    setSelectedEvents(selectedEvents.filter(e => e.id !== eventId))
  }

  const checkOrder = (selected) => {
    const isCorrect = selected.every((event, index) =>
      index === 0 || event.year >= selected[index - 1].year
    )

    if (isCorrect) {
      setFeedback("Correct! You've arranged the events in the right order!")
      setTimeout(() => {
        setIsComplete(true)
      }, 1500)
    } else {
      setFeedback("Hmm, the order doesn't look right. Try rearranging the events.")
      setShowHint(true)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(100); // Perfect score for completing the timeline
    } else {
      navigate("/chapter/2")
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-teal-700 mb-6">Timeline Master!</h2>
          <div className="text-6xl mb-6">📅</div>
          <p className="text-xl text-gray-700 mb-2">You've successfully arranged</p>
          <p className="text-4xl font-bold text-teal-600 mb-2">Rizal's Academic Journey</p>
          <div className="mt-6 space-y-2 text-left">
            {events.map((event, index) => (
              <div key={event.id} className="flex items-start p-3 bg-teal-50 rounded-lg">
                <div className="bg-teal-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-teal-900">{event.title} ({event.year})</div>
                  <div className="text-sm text-teal-700">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleComplete}
            className="mt-8 bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-teal-700 transition-colors w-full"
          >
            Return to Chapter 2
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-teal-900 mb-2">Academic Achievements</h1>
          <p className="text-teal-800">Arrange Rizal's academic milestones in chronological order</p>
        </div>

        {/* Timeline Area */}
        <div className="mb-8">
          <div className="relative h-24 mb-12">
            {/* Timeline line */}
            <div className="absolute left-4 right-4 top-1/2 h-1 bg-teal-200 transform -translate-y-1/2"></div>

            {/* Timeline markers */}
            <div className="absolute left-0 right-0 top-1/2 flex justify-between transform -translate-y-1/2">
              {[1877, 1879, 1881, 1883].map((year) => (
                <div key={year} className="relative">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs text-teal-700 font-medium">
                    {year}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected events */}
            {selectedEvents.map((event, index) => (
              <div
                key={`selected-${event.id}`}
                className="absolute top-1/2 transform -translate-y-1/2 bg-white border-2 border-teal-400 rounded-lg p-2 shadow-md w-40 text-center cursor-move"
                style={{ left: `${(index / (events.length - 1)) * 80 + 10}%` }}
              >
                <div className="font-medium text-sm text-teal-800">{event.title}</div>
                <div className="text-xs text-teal-600">{event.year}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeselectEvent(event.id)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available events */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-teal-800 mb-3 uppercase tracking-wider">
            Click to add events to the timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {shuffledEvents
              .filter(event => !selectedEvents.some(selected => selected.id === event.id))
              .map(event => (
                <div
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className="bg-white p-3 rounded-lg border border-teal-100 hover:border-teal-300 cursor-pointer transition-colors"
                >
                  <div className="font-medium text-teal-800">{event.title}</div>
                  <div className="text-sm text-teal-600">{event.year}</div>
                  <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-lg mb-6 ${feedback.includes("Correct") ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {feedback}
          </div>
        )}

        {showHint && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r">
            <p className="text-sm text-blue-700">
              <strong>Hint:</strong> Rizal enrolled at UST in 1877 and left for Spain in 1882.
              His most famous literary works from this period are "A La Juventud Filipina" and "El Consejo de los Dioses".
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate("/chapter/2")}
            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
          >
            ← Back to Chapter 2
          </button>

          <div className="text-sm text-teal-700">
            {selectedEvents.length} of {events.length} events placed
          </div>
        </div>
      </div>
    </div>
  )
}
