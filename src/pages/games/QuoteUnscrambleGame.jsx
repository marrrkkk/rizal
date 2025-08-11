import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableWord } from "../../components/SortableWord"

export default function QuoteUnscrambleGame({ username, onComplete }) {
  const quotes = [
    {
      id: 1,
      text: "The school is the basis of the world's progress and honor.",
      scrambled: "progress school the of basis is The world's honor and.",
      author: "Crisostomo Ibarra",
      explanation: "Emphasizes the importance of education in societal progress."
    },
    {
      id: 2,
      text: "I die without seeing the dawn brighten over my native land.",
      scrambled: "brighten over my native land I die without seeing the dawn.",
      author: "Elias",
      explanation: "Expresses sorrow at not living to see the country's freedom."
    }
  ]

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [scrambledWords, setScrambledWords] = useState([])
  const [orderedWords, setOrderedWords] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isCorrect, setIsCorrect] = useState(null)

  // Initialize quote
  useEffect(() => {
    if (quotes.length > 0) {
      const currentQuote = quotes[currentQuoteIndex]
      const words = currentQuote.scrambled.split(' ')
      setScrambledWords(words)
      setOrderedWords([...words].sort(() => Math.random() - 0.5))
      setTimeLeft(120)
      setShowHint(false)
      setIsCorrect(null)
    }
  }, [currentQuoteIndex])

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && currentQuoteIndex < quotes.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      nextQuote()
    }
  }, [timeLeft, currentQuoteIndex])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setOrderedWords((words) => {
        const oldIndex = words.findIndex(word => word === active.id)
        const newIndex = words.findIndex(word => word === over?.id)
        return arrayMove(words, oldIndex, newIndex)
      })
    }
  }

  const checkAnswer = () => {
    const currentQuote = quotes[currentQuoteIndex]
    const userAnswer = orderedWords.join(' ')
    const isAnswerCorrect = userAnswer === currentQuote.scrambled
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      const timeBonus = Math.max(10, Math.floor(timeLeft / 10)) * 5
      setScore(prev => prev + 100 + timeBonus)
      setTimeout(nextQuote, 1500)
    } else {
      setScore(prev => Math.max(0, prev - 20))
    }
  }

  const nextQuote = () => {
    if (currentQuoteIndex < quotes.length - 1) {
      setCurrentQuoteIndex(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!quotes.length) return null
  const currentQuote = quotes[currentQuoteIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Quote Unscramble</h1>
            <p className="text-indigo-700">Reconstruct quotes from Noli Me Tangere</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-700">{score}</div>
            <div className="text-sm text-indigo-600">Score</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-indigo-800 italic">"{isCorrect === false ? currentQuote.scrambled : currentQuote.text}"</p>
            <p className="text-right text-indigo-600 mt-2">— {currentQuote.author}</p>
          </div>

          <div className="mb-4">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-20">
                {orderedWords.map((word, index) => (
                  <SortableWord key={`${word}-${index}`} id={word} word={word} />
                ))}
              </div>
            </DndContext>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">{formatTime(timeLeft)}</div>
              <button
                onClick={checkAnswer}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Check Answer
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-blue-700">{currentQuote.explanation}</p>
            </div>
          )}

          {isCorrect === true && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-green-700">Correct! Well done!</p>
            </div>
          )}
          
          {isCorrect === false && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700">Not quite right. Try again!</p>
            </div>
          )}
        </div>

        <div className="text-center text-gray-600">
          Quote {currentQuoteIndex + 1} of {quotes.length}
        </div>
      </div>
    </div>
  )
}
