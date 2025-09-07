"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../../components/GameHeader";
import ProgressBar from "../../components/ProgressBar";
import ErrorBoundary from "../../components/ErrorBoundary";
import { getChapterTheme, getCelebrationTheme } from "../../theme/config";

export default function EarlyChildhoodGame({ username, onLogout }) {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Story Sequence State
  const [storySequence, setStorySequence] = useState([]);
  const [draggedStory, setDraggedStory] = useState(null);

  // Interactive Scene State
  const [sceneInteractions, setSceneInteractions] = useState({});

  // Word Search State
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "Jose's Early Learning",
      question: "At what age did Jose learn to read?",
      options: ["2 years old", "3 years old", "4 years old", "5 years old"],
      correct: 1,
    },
    {
      id: 1,
      type: "story",
      title: "Put Jose's Day in Order",
      stories: [
        { id: 1, text: "Jose wakes up early in the morning", order: 1 },
        { id: 2, text: "He helps his mother with morning prayers", order: 2 },
        { id: 3, text: "Jose reads books under the mango tree", order: 3 },
        { id: 4, text: "He plays with his pet dog in the garden", order: 4 },
        { id: 5, text: "Jose draws pictures of flowers and birds", order: 5 },
        { id: 6, text: "The family gathers for dinner together", order: 6 },
      ],
    },
    {
      id: 2,
      type: "scene",
      title: "Explore Jose's Childhood Home",
      scene: {
        items: [
          {
            id: "books",
            x: 20,
            y: 30,
            name: "Books",
            fact: "Jose loved reading even as a small child!",
          },
          {
            id: "mango",
            x: 70,
            y: 20,
            name: "Mango Tree",
            fact: "Jose often read under this tree for shade.",
          },
          {
            id: "dog",
            x: 50,
            y: 70,
            name: "Pet Dog",
            fact: "Jose had a pet dog that he loved to play with.",
          },
          {
            id: "flowers",
            x: 30,
            y: 80,
            name: "Garden",
            fact: "Jose enjoyed drawing the beautiful flowers.",
          },
          {
            id: "mother",
            x: 80,
            y: 50,
            name: "Mother",
            fact: "Teodora taught Jose to read and write at home.",
          },
        ],
      },
    },
    {
      id: 3,
      type: "wordsearch",
      title: "Find Jose's Childhood Interests",
      grid: [
        ["R", "E", "A", "D", "I", "N", "G", "X"],
        ["X", "B", "O", "O", "K", "S", "X", "P"],
        ["D", "R", "A", "W", "I", "N", "G", "L"],
        ["X", "X", "N", "A", "T", "U", "R", "E"],
        ["P", "L", "A", "Y", "I", "N", "G", "X"],
        ["X", "F", "L", "O", "W", "E", "R", "S"],
        ["L", "E", "A", "R", "N", "I", "N", "G"],
        ["X", "X", "X", "A", "N", "I", "M", "A"],
      ],
      words: [
        "READING",
        "BOOKS",
        "DRAWING",
        "NATURE",
        "PLAYING",
        "FLOWERS",
        "LEARNING",
      ],
      wordPositions: {
        READING: [
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
          [0, 6],
        ],
        BOOKS: [
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
        ],
        DRAWING: [
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
          [2, 4],
          [2, 5],
          [2, 6],
        ],
        NATURE: [
          [3, 2],
          [3, 3],
          [3, 4],
          [3, 5],
          [3, 6],
          [3, 7],
        ],
        PLAYING: [
          [4, 0],
          [4, 1],
          [4, 2],
          [4, 3],
          [4, 4],
          [4, 5],
          [4, 6],
        ],
        FLOWERS: [
          [5, 1],
          [5, 2],
          [5, 3],
          [5, 4],
          [5, 5],
          [5, 6],
          [5, 7],
        ],
        LEARNING: [
          [6, 0],
          [6, 1],
          [6, 2],
          [6, 3],
          [6, 4],
          [6, 5],
          [6, 6],
          [6, 7],
        ],
      },
    },
  ];

  useEffect(() => {
    if (currentGame === 1) {
      // Initialize story sequence
      const shuffled = [...games[1].stories].sort(() => Math.random() - 0.5);
      setStorySequence(
        shuffled.map((story, index) => ({
          ...story,
          placed: false,
          position: null,
        }))
      );
    }
  }, [currentGame]);

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowQuizResult(true);

    setTimeout(() => {
      if (answerIndex === games[currentGame].correct) {
        setScore(score + 25);
        nextGame();
      } else {
        setSelectedAnswer(null);
        setShowQuizResult(false);
      }
    }, 2000);
  };

  const handleStoryDrop = (e, position) => {
    e.preventDefault();
    if (draggedStory !== null) {
      const newSequence = [...storySequence];
      const story = newSequence.find((s) => s.id === draggedStory);
      if (story && story.order === position) {
        story.placed = true;
        story.position = position;
        setStorySequence(newSequence);
        setScore(score + 15);

        // Check if all stories are placed correctly
        if (newSequence.every((s) => s.placed)) {
          setTimeout(() => nextGame(), 1000);
        }
      }
    }
    setDraggedStory(null);
  };

  const handleSceneClick = (item) => {
    const newInteractions = { ...sceneInteractions, [item.id]: true };
    setSceneInteractions(newInteractions);
    setScore(score + 20);

    // Check if all items have been clicked
    if (Object.keys(newInteractions).length === games[2].scene.items.length) {
      setTimeout(() => nextGame(), 2000);
    }
  };

  const handleWordSearchClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    const newSelected = selectedCells.includes(cellKey)
      ? selectedCells.filter((c) => c !== cellKey)
      : [...selectedCells, cellKey];

    setSelectedCells(newSelected);

    // Check if selected cells form a word
    const game = games[3];
    for (const [word, positions] of Object.entries(game.wordPositions)) {
      if (!foundWords.includes(word)) {
        const wordCells = positions.map(([r, c]) => `${r}-${c}`);
        if (
          wordCells.every((cell) => newSelected.includes(cell)) &&
          wordCells.length === newSelected.length
        ) {
          setFoundWords([...foundWords, word]);
          setSelectedCells([]);
          setScore(score + 10);

          if (foundWords.length + 1 === game.words.length) {
            setTimeout(() => nextGame(), 1000);
          }
          return;
        }
      }
    }
  };

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setSceneInteractions({});
      setFoundWords([]);
      setSelectedCells([]);
    } else {
      setGameCompleted(true);
      setShowCelebration(true);
    }
  };

  const handleBackToChapter = () => {
    navigate("/chapter/1");
  };

  const chapterTheme = getChapterTheme(1);
  const celebrationTheme = getCelebrationTheme("completion");

  const renderQuizGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {game.question}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {game.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleQuizAnswer(index)}
            disabled={showQuizResult}
            className={`p-4 rounded-xl text-left transition-all duration-200 ${
              showQuizResult
                ? index === game.correct
                  ? "bg-green-100 border-2 border-green-400 text-green-800"
                  : index === selectedAnswer
                  ? "bg-red-100 border-2 border-red-400 text-red-800"
                  : "bg-gray-100 text-gray-600"
                : "bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showQuizResult && (
        <div className="mt-6 text-center">
          {selectedAnswer === game.correct ? (
            <div className="text-green-600 font-semibold">
              Perfect! Jose was very smart! 🌟
            </div>
          ) : (
            <div className="text-red-600 font-semibold">
              Try again! Think about young Jose! 🤔
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStoryGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Drag the activities to show Jose's daily routine
      </h3>

      {/* Drop zones */}
      <div className="space-y-3 mb-8">
        {[1, 2, 3, 4, 5, 6].map((position) => (
          <div
            key={position}
            onDrop={(e) => handleStoryDrop(e, position)}
            onDragOver={(e) => e.preventDefault()}
            className="min-h-[60px] bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl flex items-center justify-center p-4"
          >
            <span className="text-yellow-600 font-medium mr-3">
              {position}.
            </span>
            {storySequence.find((s) => s.position === position)?.text || (
              <span className="text-yellow-500 italic">Drop activity here</span>
            )}
          </div>
        ))}
      </div>

      {/* Draggable stories */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          Jose's Daily Activities:
        </h4>
        {storySequence
          .filter((s) => !s.placed)
          .map((story) => (
            <div
              key={story.id}
              draggable
              onDragStart={() => setDraggedStory(story.id)}
              className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg cursor-move hover:from-green-500 hover:to-emerald-600 transition-all duration-200 shadow-md"
            >
              {story.text}
            </div>
          ))}
      </div>
    </div>
  );

  const renderSceneGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Click on items to learn about Jose's childhood
      </h3>

      {/* Interactive Scene */}
      <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 min-h-[400px] mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-2xl"></div>

        {game.scene.items.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => handleSceneClick(item)}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                sceneInteractions[item.id]
                  ? "bg-green-400 text-white scale-110"
                  : "bg-white hover:bg-yellow-100 hover:scale-105"
              }`}
            >
              <span className="text-2xl">
                {item.id === "books" && "📚"}
                {item.id === "mango" && "🥭"}
                {item.id === "dog" && "🐕"}
                {item.id === "flowers" && "🌸"}
                {item.id === "mother" && "👩"}
              </span>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Facts Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {game.scene.items
          .filter((item) => sceneInteractions[item.id])
          .map((item) => (
            <div
              key={item.id}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">
                  {item.id === "books" && "📚"}
                  {item.id === "mango" && "🥭"}
                  {item.id === "dog" && "🐕"}
                  {item.id === "flowers" && "🌸"}
                  {item.id === "mother" && "👩"}
                </span>
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              <p className="text-sm text-gray-600">{item.fact}</p>
            </div>
          ))}
      </div>
    </div>
  );

  const renderWordSearchGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Find Jose's childhood interests
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Word Search Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-8 gap-1 bg-orange-50 p-4 rounded-xl">
            {game.grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.includes(cellKey);
                const isPartOfFoundWord = foundWords.some((word) =>
                  game.wordPositions[word].some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )
                );

                return (
                  <button
                    key={cellKey}
                    onClick={() => handleWordSearchClick(rowIndex, colIndex)}
                    className={`w-8 h-8 text-sm font-bold rounded transition-all duration-200 ${
                      isPartOfFoundWord
                        ? "bg-green-400 text-white"
                        : isSelected
                        ? "bg-blue-400 text-white"
                        : "bg-white hover:bg-orange-100 border border-orange-200"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Words List */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Find these words:
          </h4>
          <div className="space-y-2">
            {game.words.map((word) => (
              <div
                key={word}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  foundWords.includes(word)
                    ? "bg-green-100 text-green-800 line-through"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                <span className="font-medium">{word}</span>
                {foundWords.includes(word) && <span className="ml-2">✓</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Found: {foundWords.length} / {game.words.length}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    const game = games[currentGame];
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game);
      case "story":
        return renderStoryGame(game);
      case "scene":
        return renderSceneGame(game);
      case "wordsearch":
        return renderWordSearchGame(game);
      default:
        return null;
    }
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-yellow-50 to-orange-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">
            {showCelebration && (
              <div className="text-6xl mb-6 animate-bounce">🌟</div>
            )}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Childhood Explorer!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              You've discovered Jose's early childhood experiences! You learned
              about his daily life, interests, and the things that made him
              special.
            </p>
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-green-100 mt-2">
                Amazing exploration, {username}!
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleBackToChapter}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                Back to Chapter 1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToChapter}
              className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🌱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Early Childhood
              </h1>
              <p className="text-sm text-gray-600">
                Level 3 - Jose's First Years
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-gray-700">
                Score: {score}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm font-medium text-gray-600">
              Game Progress
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 max-w-2xl mx-auto">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentGame + 1) / games.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Game {currentGame + 1} of {games.length}
          </p>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {games[currentGame].title}
          </h2>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Info */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
            Jose's Early Childhood
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📚</span>
              <div>
                <strong>Love for Reading:</strong> Jose learned to read at age 3
                and spent hours reading books under the mango tree in their
                yard.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong>Artistic Nature:</strong> Young Jose loved to draw and
                paint, especially flowers, birds, and scenes from nature.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🐕</span>
              <div>
                <strong>Animal Lover:</strong> Jose had several pets including
                dogs and birds, showing his gentle and caring nature.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🌱</span>
              <div>
                <strong>Nature Explorer:</strong> He spent time exploring the
                gardens and fields around Calamba, developing his love for
                nature.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
