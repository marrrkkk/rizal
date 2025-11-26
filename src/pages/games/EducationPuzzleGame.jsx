"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const PUZZLE_SIZE = 3 // 3x3 puzzle
const EMPTY_CELL = PUZZLE_SIZE * PUZZLE_SIZE - 1 // Last cell is empty

export default function EducationPuzzleGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate()
  const [puzzle, setPuzzle] = useState([])
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shuffling, setShuffling] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  // Educational facts about Rizal's education
  const educationFacts = [
    "Rizal enrolled at Ateneo Municipal de Manila in 1872 at age 11.",
    "He earned the title 'Aemilianus' for being an outstanding student at Ateneo.",
    "Rizal won first prize in a literary contest at age 18 with 'A La Juventud Filipina'.",
    "He studied medicine at the University of Santo Tomas but was unhappy with the teaching methods.",
    "Rizal excelled in painting, sculpture, and fencing during his school years.",
    "He wrote the famous poem 'Mi Ultimo Adios' the night before his execution.",
    "Rizal could speak over 20 languages including Spanish, French, German, and English.",
    "He earned a degree in Medicine from the Universidad Central de Madrid.",
    "Rizal also studied at the University of Paris and the University of Heidelberg.",
  ]

  // Initialize the puzzle
  const initializePuzzle = useCallback(() => {
    // Create solved puzzle
    const solvedPuzzle = Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, i) => ({
      id: i,
      value: i === EMPTY_CELL ? null : i + 1,
      isCorrect: true,
    }));

    // Shuffle the puzzle
    const shufflePuzzle = (puzzleArray) => {
      let newPuzzle = [...puzzleArray];
      let emptyIndex = EMPTY_CELL;
      let lastMoved = null;

      // Perform random valid moves to shuffle
      const shuffleMoves = 100 + Math.floor(Math.random() * 100);

      for (let i = 0; i < shuffleMoves; i++) {
        const possibleMoves = [];
        const row = Math.floor(emptyIndex / PUZZLE_SIZE);
        const col = emptyIndex % PUZZLE_SIZE;

        // Find all possible moves (up, down, left, right)
        if (row > 0) possibleMoves.push(emptyIndex - PUZZLE_SIZE); // Up
        if (row < PUZZLE_SIZE - 1) possibleMoves.push(emptyIndex + PUZZLE_SIZE); // Down
        if (col > 0) possibleMoves.push(emptyIndex - 1); // Left
        if (col < PUZZLE_SIZE - 1) possibleMoves.push(emptyIndex + 1); // Right

        // Remove the last moved piece to avoid back-and-forth
        const validMoves = possibleMoves.filter(move => move !== lastMoved);

        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

          // Swap empty cell with the selected move
          [newPuzzle[emptyIndex], newPuzzle[randomMove]] =
            [newPuzzle[randomMove], newPuzzle[emptyIndex]];

          lastMoved = emptyIndex;
          emptyIndex = randomMove;
        }
      }

      return { puzzle: newPuzzle, emptyIndex };
    };

    const { puzzle: shuffledPuzzle, emptyIndex } = shufflePuzzle(solvedPuzzle);

    // Check if the puzzle is solvable
    const isSolvable = (puzzleArray) => {
      let inversions = 0;
      const flatPuzzle = puzzleArray.filter(tile => tile.value !== null).map(tile => tile.value);

      for (let i = 0; i < flatPuzzle.length - 1; i++) {
        for (let j = i + 1; j < flatPuzzle.length; j++) {
          if (flatPuzzle[i] > flatPuzzle[j]) {
            inversions++;
          }
        }
      }

      // For a puzzle with odd width, number of inversions must be even
      return inversions % 2 === 0;
    };

    // If the puzzle is not solvable, swap two non-empty tiles to make it solvable
    if (!isSolvable(shuffledPuzzle)) {
      // Find first two non-empty tiles that are not in their correct positions
      let first, second;
      for (let i = 0; i < shuffledPuzzle.length - 1; i++) {
        if (shuffledPuzzle[i].value !== null &&
          shuffledPuzzle[i].value !== i + 1 &&
          shuffledPuzzle[i + 1].value !== null) {
          first = i;
          second = i + 1;
          break;
        }
      }

      // If all tiles are in correct positions (shouldn't happen with proper shuffling)
      if (first === undefined) {
        first = 0;
        second = 1;
      }

      // Swap the two tiles
      [shuffledPuzzle[first], shuffledPuzzle[second]] =
        [shuffledPuzzle[second], shuffledPuzzle[first]];
    }

    // Mark correct positions
    const finalPuzzle = shuffledPuzzle.map((tile, index) => ({
      ...tile,
      isCorrect: tile.value === null ? true : tile.value === index + 1,
    }));

    return { puzzle: finalPuzzle, emptyIndex };
  }, []);

  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const { puzzle: newPuzzle, emptyIndex } = initializePuzzle();
    setPuzzle(newPuzzle);
    setMoves(0);
    setIsComplete(false);
    setShuffling(true);

    // Auto-hide the info panel after 5 seconds
    setTimeout(() => {
      setShowInfo(false);
      setShuffling(false);
    }, 5000);
  };

  // Check if the puzzle is solved
  const checkCompletion = useCallback((currentPuzzle) => {
    return currentPuzzle.every(tile =>
      tile.value === null || tile.value === tile.id + 1
    );
  }, []);

  // Handle tile click
  const handleTileClick = (index) => {
    if (shuffling || isComplete) return;

    const emptyIndex = puzzle.findIndex(tile => tile.value === null);
    const clickedRow = Math.floor(index / PUZZLE_SIZE);
    const clickedCol = index % PUZZLE_SIZE;
    const emptyRow = Math.floor(emptyIndex / PUZZLE_SIZE);
    const emptyCol = emptyIndex % PUZZLE_SIZE;

    // Check if the clicked tile is adjacent to the empty space
    const isAdjacent =
      (clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1) || // Same row, adjacent column
      (clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1);   // Same column, adjacent row

    if (isAdjacent) {
      const newPuzzle = [...puzzle];

      // Swap the clicked tile with the empty space
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];

      // Update correctness of the moved tiles
      newPuzzle[index] = { ...newPuzzle[index], isCorrect: newPuzzle[index].value === index + 1 };
      newPuzzle[emptyIndex] = {
        ...newPuzzle[emptyIndex],
        isCorrect: newPuzzle[emptyIndex].value === emptyIndex + 1
      };

      setPuzzle(newPuzzle);
      setMoves(prevMoves => {
        const newMoves = prevMoves + 1;

        // Check if the puzzle is complete after each move
        if (checkCompletion(newPuzzle)) {
          setIsComplete(true);
        }

        return newMoves;
      });
    }
  };

  // Get a random education fact
  const getRandomFact = () => {
    return educationFacts[Math.floor(Math.random() * educationFacts.length)];
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(100); // Perfect score for completing the puzzle
    } else {
      navigate("/chapter/2");
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-rose-700 mb-6">Puzzle Solved!</h2>
          <div className="text-6xl mb-6">🎯</div>
          <p className="text-xl text-gray-700 mb-2">Congratulations!</p>
          <p className="text-gray-600 mb-6">
            You completed the puzzle in {moves} {moves === 1 ? 'move' : 'moves'}!
          </p>

          <div className="bg-rose-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-rose-800 mb-2">Did you know?</h3>
            <p className="text-sm text-rose-700">{getRandomFact()}</p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={startNewGame}
              className="bg-rose-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-rose-700 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={handleComplete}
              className="border-2 border-rose-600 text-rose-600 px-6 py-3 rounded-full text-lg font-medium hover:bg-rose-50 transition-colors"
            >
              Return to Chapter 2
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-rose-900">Education Puzzle</h1>
            <p className="text-rose-800">Slide the tiles to complete the puzzle</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mt-4 md:mt-0">
            <span className="font-medium text-rose-700">Moves: {moves}</span>
          </div>
        </div>

        {/* Puzzle Board */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-6 mx-auto"
          style={{
            width: `${PUZZLE_SIZE * 100}px`,
            maxWidth: '100%',
            aspectRatio: '1/1',
            display: 'grid',
            gridTemplateColumns: `repeat(${PUZZLE_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${PUZZLE_SIZE}, 1fr)`,
            gap: '4px',
          }}
        >
          {puzzle.map((tile, index) => {
            if (tile.value === null) {
              return (
                <div
                  key={index}
                  className="bg-rose-50 rounded-lg flex items-center justify-center"
                  style={{
                    boxShadow: 'inset 0 0 0 2px rgba(225, 29, 72, 0.2)',
                  }}
                ></div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                disabled={shuffling}
                className={`
                  flex items-center justify-center text-2xl font-bold rounded-lg
                  ${tile.isCorrect ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}
                  ${!shuffling ? 'hover:bg-rose-200 cursor-pointer transform hover:scale-105' : 'cursor-not-allowed'}
                  transition-all duration-200
                `}
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: shuffling ? 0.7 : 1,
                }}
              >
                {tile.value}
              </button>
            );
          })}
        </div>

        {/* Game Info Panel */}
        {showInfo && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-6 animate-fade-in">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-rose-800">How to Play</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-rose-500 hover:text-rose-700"
              >
                ✕
              </button>
            </div>
            <ul className="text-sm text-rose-700 space-y-2 mb-4">
              <li>• Click a tile next to the empty space to move it</li>
              <li>• Arrange the numbers in order from 1 to 8</li>
              <li>• The empty space should be at the bottom-right when complete</li>
            </ul>
            <div className="text-xs text-rose-600 italic">
              Shuffling puzzle... {shuffling ? 'Please wait' : 'Ready!'}
            </div>
          </div>
        )}

        {/* Educational Fact */}
        {!shuffling && (
          <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-lg mb-6">
            <h3 className="font-semibold text-rose-800 mb-1">Did you know?</h3>
            <p className="text-sm text-rose-700">{getRandomFact()}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <button
            onClick={() => navigate("/chapter/2")}
            className="text-rose-600 hover:text-rose-800 text-sm font-medium flex items-center"
          >
            ← Back to Chapter 2
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-rose-600 hover:text-rose-800 text-sm font-medium"
            >
              {showHint ? 'Hide' : 'Show'} Hint
            </button>

            <button
              onClick={startNewGame}
              className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors"
            >
              New Puzzle
            </button>
          </div>
        </div>

        {/* Hint */}
        {showHint && !shuffling && (
          <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-100">
            <h3 className="font-semibold text-rose-800 mb-2">Hint</h3>
            <p className="text-sm text-rose-700">
              Start by moving the tiles to form the top row from left to right.
              Then work on the second row, and so on. The empty space should
              always be used to position the next correct tile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
