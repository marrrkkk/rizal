"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"

// Size of the word search grid
const GRID_SIZE = 12

export default function LiteraryWorksGame({ username, onLogout }) {
  const navigate = useNavigate()
  
  // Words related to Rizal's literary works
  const words = [
    { word: "NOLI", clue: "Rizal's first novel (short form)" },
    { word: "FILI", clue: "Rizal's second novel (short form)" },
    { word: "MIULTIMADIOS", clue: "Rizal's farewell poem (no spaces)" },
    { word: "ELIAS", clue: "Character who represents the Filipino people" },
    { word: "MARIA CLARA", clue: "Symbol of the ideal Filipina" },
    { word: "PADRE DAMASO", clue: "Villainous friar character" },
    { word: "LA SOLIDARIDAD", clue: "Reformist organization's newspaper" },
    { word: "LAONG LAAN", clue: "One of Rizal's pen names" },
  ]

  const [grid, setGrid] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [showClue, setShowClue] = useState("")
  const [hintIndex, setHintIndex] = useState(0)

  // Initialize the grid
  const initializeGrid = useCallback(() => {
    // Create empty grid with proper initialization
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          letter: '',
          isSelected: false,
          isFound: false,
          isHighlighted: false,
        });
      }
      newGrid.push(row);
    }

    // Place words in the grid
    const placedWords = [];
    
    const placeWord = (wordObj) => {
      const word = wordObj.word.replace(/\s+/g, '').toUpperCase(); // Remove spaces and convert to uppercase
      const wordLength = word.length;
      
      if (wordLength > GRID_SIZE) {
        console.warn(`Word '${word}' is too long for the grid`);
        return false;
      }
      
      // Try to place word with random orientation
      const orientations = [
        { dr: 0, dc: 1 },   // horizontal
        { dr: 1, dc: 0 },   // vertical
        { dr: 1, dc: 1 },   // diagonal down-right
        { dr: 1, dc: -1 },  // diagonal down-left
      ];
      
      // Shuffle orientations for more randomness
      const shuffledOrientations = [...orientations].sort(() => Math.random() - 0.5);
      
      // Try each orientation
      for (const { dr, dc } of shuffledOrientations) {
        // Calculate max starting position
        const maxRow = dr > 0 ? GRID_SIZE - wordLength * dr : GRID_SIZE - 1;
        const maxCol = dc !== 0 ? Math.abs(dc) * (wordLength - 1) : 0;
        
        // Try multiple starting positions
        const maxAttempts = 50;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const startRow = Math.floor(Math.random() * (maxRow + 1));
          const startCol = Math.floor(Math.random() * (GRID_SIZE - maxCol));
          
          // Check if word fits
          let canPlace = true;
          for (let i = 0; i < wordLength; i++) {
            const r = startRow + i * dr;
            const c = startCol + i * (dc || 0);
            
            // Make sure we're within grid bounds
            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
              canPlace = false;
              break;
            }
            
            const cell = newGrid[r][c];
            if (cell.letter !== '' && cell.letter !== word[i]) {
              canPlace = false;
              break;
            }
          }
          
          // Place the word if it fits
          if (canPlace) {
            const positions = [];
            for (let i = 0; i < wordLength; i++) {
              const r = startRow + i * dr;
              const c = startCol + i * (dc || 0);
              
              // Ensure the cell exists before trying to update it
              if (!newGrid[r] || !newGrid[r][c]) {
                console.warn(`Invalid grid position: [${r}][${c}]`);
                canPlace = false;
                break;
              }
              
              newGrid[r][c] = {
                ...newGrid[r][c],
                letter: word[i],
                word: wordObj,
                position: i,
                isWordStart: i === 0,
                isWordEnd: i === wordLength - 1,
                orientation: { dr, dc },
                startPos: { r: startRow, c: startCol },
              };
              positions.push({ r, c });
            }
            
            if (canPlace) {
              placedWords.push({
                ...wordObj,
                positions,
                orientation: { dr, dc },
                startPos: { r: startRow, c: startCol },
              });
              return true;
            }
          }
        }
      }
      
      return false;
    }
    
    // Try to place all words, starting with the longest ones first
    const wordsToPlace = [...words]
      .sort((a, b) => b.word.replace(/\s+/g, '').length - a.word.replace(/\s+/g, '').length);
    
    const unplacedWords = [];
    const maxAttempts = 10; // Maximum number of attempts to place all words
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let allPlaced = true;
      unplacedWords.length = 0; // Reset unplaced words
      
      // Reset the grid for this attempt
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          newGrid[i][j] = {
            letter: '',
            isSelected: false,
            isFound: false,
            isHighlighted: false,
          };
        }
      }
      
      // Try to place all words
      for (const word of wordsToPlace) {
        if (!placeWord(word)) {
          unplacedWords.push(word);
          allPlaced = false;
        }
      }
      
      if (allPlaced) {
        break; // All words placed successfully
      }
      
      if (attempt === maxAttempts - 1) {
        console.warn(`Could not place all words after ${maxAttempts} attempts.`);
        console.warn('Unplaced words:', unplacedWords.map(w => w.word));
      }
    }
    
    // Fill remaining cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].letter) {
          newGrid[r][c] = {
            ...newGrid[r][c],
            letter: letters[Math.floor(Math.random() * letters.length)],
            isRandom: true,
          }
        }
      }
    }
    
    return { grid: newGrid, placedWords }
  }, [])

  // Initialize the game
  useEffect(() => {
    const { grid: newGrid, placedWords } = initializeGrid()
    setGrid(newGrid)
    setFoundWords([])
    setSelectedCells([])
    setIsComplete(false)
    setShowClue("")
    setHintIndex(0)
  }, [initializeGrid])

  // Handle cell selection
  const handleCellClick = (r, c) => {
    if (isComplete) return
    
    const cell = grid[r][c]
    
    // If clicking on a found word, show its clue
    if (cell.isFound) {
      setShowClue(cell.word.clue)
      setTimeout(() => setShowClue(""), 2000)
      return
    }
    
    // If no word is selected, start a new selection
    if (selectedCells.length === 0) {
      setSelectedCells([{ r, c }])
      return
    }
    
    // If clicking the same cell, clear selection
    const isSameCell = selectedCells.some(pos => pos.r === r && pos.c === c)
    if (isSameCell) {
      setSelectedCells([])
      return
    }
    
    // Add to selection if adjacent
    const lastCell = selectedCells[selectedCells.length - 1]
    const dr = r - lastCell.r
    const dc = c - lastCell.c
    
    // Check if in a straight line
    const isStraightLine = selectedCells.length === 1 || 
      (selectedCells[1].r - selectedCells[0].r === dr && 
       selectedCells[1].c - selectedCells[0].c === dc)
    
    if (isStraightLine && (Math.abs(dr) <= 1 && Math.abs(dc) <= 1)) {
      setSelectedCells([...selectedCells, { r, c }])
    } else {
      // Start new selection
      setSelectedCells([{ r, c }])
    }
  }

  // Check if selected cells form a valid word
  useEffect(() => {
    if (selectedCells.length < 2) return
    
    const selectedWord = selectedCells
      .map(({ r, c }) => grid[r][c].letter)
      .join('')
    
    const reversedWord = [...selectedCells]
      .reverse()
      .map(({ r, c }) => grid[r][c].letter)
      .join('')
    
    // Check against word list
    const foundWord = words.find(
      word => word.word === selectedWord || word.word === reversedWord
    )
    
    if (foundWord && !foundWords.some(w => w.word === foundWord.word)) {
      // Mark cells as found
      const newGrid = [...grid]
      selectedCells.forEach(({ r, c }) => {
        newGrid[r] = [...newGrid[r]]
        newGrid[r][c] = { ...newGrid[r][c], isFound: true }
      })
      
      setGrid(newGrid)
      setFoundWords([...foundWords, foundWord])
      setShowClue(`Found: ${foundWord.word} - ${foundWord.clue}`)
      
      // Check if all words are found
      if (foundWords.length + 1 === words.length) {
        setIsComplete(true)
      }
    }
    
    setSelectedCells([])
  }, [selectedCells, grid, foundWords])

  // Show next hint
  const showNextHint = () => {
    if (hintIndex < words.length) {
      const hintWord = words[hintIndex]
      setShowClue(`Hint: ${hintWord.clue} (${hintWord.word.length} letters)`)
      setHintIndex(hintIndex + 1)
      setTimeout(() => setShowClue(""), 3000)
    }
  }

  const handleComplete = () => {
    navigate("/chapter/2")
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">Word Search Complete!</h2>
          <div className="text-6xl mb-6">🔍</div>
          <p className="text-xl text-gray-700 mb-2">You found all {words.length} words!</p>
          <p className="text-gray-600 mb-8">
            {foundWords.length === words.length 
              ? "You're a literary detective!" 
              : "Great job finding these important terms from Rizal's works!"}
          </p>
          <div className="mb-8 text-left">
            <h3 className="font-semibold text-indigo-800 mb-3">Words Found:</h3>
            <div className="grid grid-cols-2 gap-2">
              {words.map((word, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-xs text-green-600">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">{word.word}</span>
                </div>
              ))}
            </div>
          </div>
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-900 mb-1">Literary Works Word Search</h1>
          <p className="text-indigo-800">Find words related to Rizal's literary works</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Game board */}
          <div className="flex-1">
            <div 
              className="grid gap-0.5 bg-indigo-100 p-2 rounded-lg shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                aspectRatio: '1/1',
                maxWidth: '100%',
                maxHeight: '70vh',
                margin: '0 auto'
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isSelected = selectedCells.some(pos => pos.r === r && pos.c === c)
                  const isInSelectionPath = selectedCells.length > 1 &&
                    selectedCells.some((pos, i) => {
                      if (i === 0) return false
                      const prev = selectedCells[i - 1]
                      const next = selectedCells[i]
                      const minR = Math.min(prev.r, next.r)
                      const maxR = Math.max(prev.r, next.r)
                      const minC = Math.min(prev.c, next.c)
                      const maxC = Math.max(prev.c, next.c)
                      return (
                        r >= minR && r <= maxR &&
                        c >= minC && c <= maxC &&
                        (r - prev.r) * (next.c - prev.c) === (c - prev.c) * (next.r - prev.r)
                      )
                    })
                  
                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`
                        aspect-square flex items-center justify-center text-lg font-medium select-none
                        ${cell.isFound 
                          ? 'bg-green-100 text-green-800' 
                          : isSelected || isInSelectionPath
                            ? 'bg-indigo-200 text-indigo-900'
                            : 'bg-white hover:bg-indigo-50 text-indigo-800'}
                        ${cell.isWordStart ? 'rounded-tl-lg' : ''}
                        ${cell.isWordEnd ? 'rounded-br-lg' : ''}
                        transition-colors duration-200
                      `}
                    >
                      {cell.letter}
                    </div>
                  )
                })
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md mb-4">
              <h3 className="font-semibold text-indigo-800 mb-3">How to Play</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Click and drag to select words</li>
                <li>• Words can be in any direction</li>
                <li>• Find all words to complete the puzzle</li>
              </ul>
              
              <button
                onClick={showNextHint}
                className="mt-4 w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
              >
                Get a Hint ({hintIndex}/{words.length})
              </button>
              
              {showClue && (
                <div className="mt-3 p-2 bg-blue-50 text-blue-800 text-xs rounded">
                  {showClue}
                </div>
              )}
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <h3 className="font-semibold text-indigo-800 mb-3">Words to Find</h3>
              <div className="space-y-2">
                {words.map((word, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center ${foundWords.some(w => w.word === word.word) ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 ${foundWords.some(w => w.word === word.word) ? 'bg-green-400' : 'bg-indigo-200'}`}></div>
                    <span className="text-sm font-medium">{word.word}</span>
                    <span className="text-xs text-gray-500 ml-1">({word.word.length})</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{foundWords.length} / {words.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(foundWords.length / words.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/chapter/2")}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            ← Back to Chapter 2
          </button>
          
          <button
            onClick={() => {
              const { grid: newGrid, placedWords } = initializeGrid()
              setGrid(newGrid)
              setFoundWords([])
              setSelectedCells([])
              setHintIndex(0)
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ↻ New Puzzle
          </button>
        </div>
      </div>
    </div>
  )
}
