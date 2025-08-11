import { useState, useEffect } from "react"

export default function LiteraryCrosswordGame({ onComplete }) {
  const [grid, setGrid] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [showSolution, setShowSolution] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState("")

  // Simplified crossword data
  const puzzle = {
    grid: [
      [1, 2, 3, 0, 4, 0, 5],
      [0, 0, 0, 0, 0, 0, 0],
      [6, 0, 0, 0, 7, 0, 8],
      [0, 0, 0, 0, 0, 0, 0],
      [9, 10, 11, 0, 12, 0, 13],
      [0, 0, 0, 0, 0, 0, 0],
      [14, 15, 16, 0, 17, 0, 18]
    ],
    clues: {
      across: {
        1: { answer: "NOLI", clue: "Rizal's first novel (abbr.)", row: 0, col: 0 },
        4: { answer: "FILI", clue: "Rizal's second novel (abbr.)", row: 0, col: 4 },
        6: { answer: "BERLIN", clue: "Where Noli was published", row: 2, col: 0 },
        9: { answer: "MARIA", clue: "Rizal's first love", row: 4, col: 0 },
        12: { answer: "CLARA", clue: "Symbolic Filipina character", row: 4, col: 4 },
        14: { answer: "PARIS", clue: "City where Rizal studied", row: 6, col: 0 },
        15: { answer: "VIOLA", clue: "Helped publish Noli", row: 6, col: 1 }
      },
      down: {
        1: { answer: "NOLI", clue: "First novel (abbr.)", row: 0, col: 0 },
        2: { answer: "ELIAS", clue: "Symbolic character", row: 0, col: 1 },
        3: { answer: "SISA", clue: "Tragic mother character", row: 0, col: 2 },
        4: { answer: "FILI", clue: "Second novel (abbr.)", row: 0, col: 4 },
        5: { answer: "PADRE", clue: "Title for Spanish priests", row: 0, col: 6 },
        7: { answer: "DAMASO", clue: "Villainous friar", row: 2, col: 4 },
        8: { answer: "LAONG", clue: "Part of Rizal's pen name", row: 2, col: 6 },
        10: { answer: "RIZAL", clue: "Hero's surname", row: 4, col: 1 },
        11: { answer: "JOSE", clue: "Hero's first name", row: 4, col: 2 },
        13: { answer: "MORGATANZAUER", clue: "Sisa of Europe", row: 4, col: 6 },
        16: { answer: "BERNADINO", clue: "Rizal's brother-in-law", row: 6, col: 2 },
        17: { answer: "MADRID", clue: "Where Rizal studied medicine", row: 6, col: 4 },
        18: { answer: "BLUMENTRITT", clue: "Rizal's Austrian friend", row: 6, col: 6 }
      }
    }
  }

  // Initialize grid
  useEffect(() => {
    const newGrid = JSON.parse(JSON.stringify(puzzle.grid))
    setGrid(newGrid)
  }, [])

  const handleInputChange = (e, row, col) => {
    const value = e.target.value.toUpperCase()
    const newAnswers = { ...userAnswers, [`${row}-${col}`]: value }
    setUserAnswers(newAnswers)
    checkCompletion(newAnswers)
  }

  const checkCompletion = (answers) => {
    let correct = true
    Object.entries(puzzle.clues.across).forEach(([num, clue]) => {
      const word = getWord(clue.row, clue.col, true, answers)
      if (word !== clue.answer) correct = false
    })
    Object.entries(puzzle.clues.down).forEach(([num, clue]) => {
      const word = getWord(clue.row, clue.col, false, answers)
      if (word !== clue.answer) correct = false
    })
    
    if (correct) {
      setIsComplete(true)
      onComplete()
    }
  }

  const getWord = (row, col, isAcross, answers) => {
    let word = ''
    let r = row
    let c = col
    
    while (r < puzzle.grid.length && c < puzzle.grid[0].length && puzzle.grid[r][c] !== 0) {
      const key = `${r}-${c}`
      word += answers[key] || '?'
      if (isAcross) c++
      else r++
    }
    
    return word
  }

  const toggleSolution = () => setShowSolution(!showSolution)

  const renderClues = (direction) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{direction.toUpperCase()}</h3>
      <ul className="space-y-2">
        {Object.entries(puzzle.clues[direction])
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([num, clue]) => (
            <li key={`${direction}-${num}`} className="text-sm">
              <span className="font-medium">{num}.</span> {clue.clue}
            </li>
          ))}
      </ul>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rizal's Literary Crossword</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-7 gap-0 border border-gray-300">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                  cell === 0 ? (
                    <div key={`${rowIndex}-${colIndex}`} className="aspect-square bg-black" />
                  ) : (
                    <div key={`${rowIndex}-${colIndex}`} className="relative border border-gray-300">
                      <span className="absolute top-0 left-0 text-xs p-1">
                        {Object.entries(puzzle.clues.across).find(
                          ([_, clue]) => clue.row === rowIndex && clue.col === colIndex
                        )?.[0] || 
                        Object.entries(puzzle.clues.down).find(
                          ([_, clue]) => clue.row === rowIndex && clue.col === colIndex
                        )?.[0]}
                      </span>
                      <input
                        type="text"
                        maxLength={1}
                        value={userAnswers[`${rowIndex}-${colIndex}`] || ''}
                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                        className="w-full h-full text-center uppercase font-medium bg-transparent"
                        disabled={showSolution}
                      />
                    </div>
                  )
                )
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={toggleSolution}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            {isComplete && (
              <div className="text-green-600 font-medium">
                Complete! All answers are correct!
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          {renderClues('across')}
          {renderClues('down')}
        </div>
      </div>
    </div>
  )
}
