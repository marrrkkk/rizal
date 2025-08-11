import { useState, useEffect, useCallback } from "react"

export default function LettersAbroadGame({ onComplete }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Rizal's correspondences
  const correspondences = [
    { id: 1, recipient: "Ferdinand Blumentritt", content: "Discussed Philippine history and culture" },
    { id: 2, recipient: "Paciano Rizal", content: "Family matters and revolutionary ideas" },
    { id: 3, recipient: "Marcelo H. del Pilar", content: "Propaganda Movement strategies" },
    { id: 4, recipient: "Jose Ma. Basa", content: "Financial support for the movement" },
    { id: 5, recipient: "Graciano Lopez Jaena", content: "La Solidaridad publication" },
    { id: 6, recipient: "Mariano Ponce", content: "Political developments in Europe" }
  ]

  // Create card pairs
  const createCards = useCallback(() => {
    const items = [...correspondences]
    const cardPairs = []
    
    items.forEach((item, index) => {
      // Add recipient card
      cardPairs.push({
        id: index * 2,
        type: 'recipient',
        content: item.recipient,
        pairId: item.id,
        isFlipped: false
      })
      
      // Add content card
      cardPairs.push({
        id: index * 2 + 1,
        type: 'content',
        content: item.content,
        pairId: item.id,
        isFlipped: false
      })
    })
    
    // Shuffle cards
    return cardPairs.sort(() => Math.random() - 0.5)
  }, [])

  // Initialize game
  useEffect(() => {
    setCards(createCards())
  }, [createCards])

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstIndex, secondIndex] = flipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setSolved(prev => [...prev, firstCard.pairId])
        setFlipped([])
        
        // Check if game is complete
        if (solved.length + 1 === correspondences.length) {
          setIsComplete(true)
          onComplete()
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }, [flipped, cards, solved.length, onComplete])

  const handleCardClick = (index) => {
    // Don't allow clicking if 2 cards are already flipped or card is already flipped
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(cards[index].pairId)) {
      return
    }
    
    setFlipped(prev => [...prev, index])
  }

  const resetGame = () => {
    setCards(createCards())
    setFlipped([])
    setSolved([])
    setMoves(0)
    setIsComplete(false)
  }

  // Render card
  const renderCard = (card, index) => {
    const isFlipped = flipped.includes(index) || solved.includes(card.pairId)
    const isClickable = !isFlipped && flipped.length < 2 && !solved.includes(card.pairId)
    
    return (
      <div
        key={card.id}
        onClick={() => isClickable && handleCardClick(index)}
        className={`relative h-40 rounded-lg shadow-md transition-all duration-300 transform ${
          isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'
        } ${isFlipped ? 'bg-white' : 'bg-blue-600 text-white'}`}
      >
        <div className={`absolute inset-0 flex items-center justify-center p-4 text-center transition-opacity duration-300 ${
          isFlipped ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-sm md:text-base">{card.content}</p>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isFlipped ? 'opacity-0' : 'opacity-100'
        }`}>
          {card.type === 'recipient' ? (
            <span className="text-lg font-medium">To: {card.content}</span>
          ) : (
            <span className="text-lg">Letter Content</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rizal's Correspondence</h2>
        <div className="text-gray-600">Moves: {moves}</div>
      </div>
      
      <p className="mb-6 text-gray-700">
        Match each recipient with the corresponding content of Rizal's letters.
        Click on a card to reveal its content and find all matching pairs.
      </p>
      
      {isComplete ? (
        <div className="text-center py-10">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h3>
          <p className="mb-6">You've matched all of Rizal's correspondences in {moves} moves!</p>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cards.map((card, index) => renderCard(card, index))}
        </div>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={resetGame}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
        >
          Reset Game
        </button>
        <div className="text-sm text-gray-500">
          Matched: {solved.length} of {correspondences.length}
        </div>
      </div>
    </div>
  )
}
