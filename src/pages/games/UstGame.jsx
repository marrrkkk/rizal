"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function UstGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const cardContents = [
    { id: 1, content: "Medicine", emoji: "🏥" },
    { id: 2, content: "Philosophy", emoji: "📜" },
    { id: 3, content: "Literature", emoji: "📚" },
    { id: 4, content: "Painting", emoji: "🎨" },
    { id: 5, content: "Sculpture", emoji: "🗿" },
    { id: 6, content: "Fencing", emoji: "🤺" },
  ]

  // Duplicate cards to create pairs
  useEffect(() => {
    const shuffled = [...cardContents, ...cardContents]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        matched: false,
      }))
    setCards(shuffled)
  }, [])

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      setMoves(moves + 1)

      if (firstCard.content === secondCard.content) {
        const newCards = [...cards]
        newCards[firstIndex].matched = true
        newCards[secondIndex].matched = true
        setCards(newCards)
        setSolved([...solved, firstCard.content])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }, [flipped])

  useEffect(() => {
    if (solved.length === cardContents.length) {
      setIsComplete(true)
    }
  }, [solved])

  const handleCardClick = (index) => {
    if (flipped.length >= 2 || flipped.includes(index) || cards[index].matched) {
      return
    }

    setFlipped([...flipped, index])
  }

  const handleComplete = () => {
    // In a real app, you would save progress here
    navigate("/chapter/2")
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-orange-700 mb-6">Memory Master!</h2>
          <div className="text-6xl mb-6">🏆</div>
          <p className="text-xl text-gray-700 mb-2">You matched all pairs in</p>
          <p className="text-5xl font-bold text-orange-600 mb-2">{moves} moves</p>
          <p className="text-gray-600 mb-8">
            {moves <= cardContents.length + 2 
              ? "Incredible memory! Just like Rizal's brilliant mind!" 
              : moves <= cardContents.length * 1.5 
                ? "Great job! You've got a sharp memory!" 
                : "Well done! You've successfully completed the challenge!"}
          </p>
          <button
            onClick={handleComplete}
            className="bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-orange-700 transition-colors w-full"
          >
            Return to Chapter 2
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-orange-900">University of Santo Tomas</h1>
            <p className="text-orange-800">Match the pairs to learn about Rizal's time at UST</p>
          </div>
          <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
            <span className="font-medium text-orange-700">Moves: {moves}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="font-medium text-orange-700">
              Matched: {solved.length}/{cardContents.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || card.matched
            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform ${
                  isFlipped ? 'rotate-y-180' : 'bg-white hover:bg-orange-50'
                } ${card.matched ? 'opacity-60' : 'shadow-md hover:shadow-lg'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  background: isFlipped ? '#fff7ed' : 'white',
                  border: '2px solid #ffedd5',
                }}
              >
                {isFlipped ? (
                  <div className="text-center p-2">
                    <div className="text-3xl mb-1">{card.emoji}</div>
                    <div className="text-xs font-medium text-orange-900">{card.content}</div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg">
                    <span className="text-2xl text-orange-300">?</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-white/80 rounded-xl shadow-sm">
          <h3 className="font-semibold text-orange-800 mb-2">Did you know?</h3>
          <p className="text-sm text-gray-700">
            Rizal studied at UST from 1877 to 1882. He initially enrolled in Philosophy and Letters before shifting to Medicine. 
            During his time at UST, he excelled in both academics and extracurricular activities.
          </p>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/chapter/2")}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
          >
            ← Back to Chapter 2
          </button>
          <div className="text-xs text-gray-500">
            Match all pairs to complete this level
          </div>
        </div>
      </div>
    </div>
  )
}
