"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../../components/GameHeader";
import ProgressBar from "../../components/ProgressBar";
import ErrorBoundary from "../../components/ErrorBoundary";
import { CharacterPlaceholder } from "../../components/PlaceholderImage";
import { getChapterTheme, getCelebrationTheme } from "../../theme/config";

export default function FamilyBackgroundGame({ username, onLogout }) {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);


  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  // Family Tree State
  const [familyTreeAnswers, setFamilyTreeAnswers] = useState({});

  // Matching Game State
  const [matchingPairs, setMatchingPairs] = useState([]);
  const [selectedMatching, setSelectedMatching] = useState([]);

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "Jose's Parents",
      question: "Who were Jose Rizal's parents?",
      options: [
        "Francisco Mercado and Teodora Alonso",
        "Juan Mercado and Maria Alonso",
        "Pedro Mercado and Carmen Alonso",
        "Antonio Mercado and Rosa Alonso",
      ],
      correct: 0,
    },
    {
      id: 1,
      type: "memory",
      title: "Family Members Memory Game",
      cards: [
        {
          id: 1,
          name: "Francisco",
          role: "Father",
          emoji: "👨‍💼",
        },
        {
          id: 2,
          name: "Teodora",
          role: "Mother",
          emoji: "👩‍🏫",
        },
        {
          id: 3,
          name: "Saturnina",
          role: "Sister",
          emoji: "👩‍🦳",
        },
        {
          id: 4,
          name: "Paciano",
          role: "Brother",
          emoji: "👨‍🎓",
        },
        {
          id: 5,
          name: "Narcisa",
          role: "Sister",
          emoji: "👩‍🦰",
        },
        {
          id: 6,
          name: "Olimpia",
          role: "Sister",
          emoji: "👩‍🦱",
        },
      ],
    },
    {
      id: 2,
      type: "familytree",
      title: "Complete the Family Tree",
      positions: [
        { id: "father", label: "Father", x: 200, y: 50 },
        { id: "mother", label: "Mother", x: 400, y: 50 },
        { id: "jose", label: "Jose", x: 300, y: 150, fixed: true },
        { id: "paciano", label: "Older Brother", x: 150, y: 150 },
        { id: "saturnina", label: "Older Sister", x: 450, y: 150 },
      ],
      options: [
        "Francisco Mercado",
        "Teodora Alonso",
        "Paciano Rizal",
        "Saturnina Rizal",
      ],
      correct: {
        father: "Francisco Mercado",
        mother: "Teodora Alonso",
        paciano: "Paciano Rizal",
        saturnina: "Saturnina Rizal",
      },
    },
    {
      id: 3,
      type: "matching",
      title: "Match Family Facts",
      pairs: [
        {
          left: "Francisco Mercado",
          right: "Jose's father, a farmer and businessman",
        },
        { left: "Teodora Alonso", right: "Jose's mother, his first teacher" },
        {
          left: "Paciano Rizal",
          right: "Jose's older brother, a revolutionary",
        },
        { left: "11 children", right: "Total number of Rizal siblings" },
        { left: "7th child", right: "Jose's birth order in the family" },
        { left: "Calamba", right: "The family's hometown" },
      ],
    },
  ];

  useEffect(() => {
    if (currentGame === 1) {
      // Initialize memory game
      const cards = games[1].cards;
      const duplicatedCards = [...cards, ...cards].map((card, index) => ({
        ...card,
        uniqueId: index,
        isFlipped: false,
      }));
      setMemoryCards(duplicatedCards.sort(() => Math.random() - 0.5));
    } else if (currentGame === 3) {
      // Initialize matching game
      const pairs = games[3].pairs;
      const leftItems = pairs.map((pair, index) => ({
        id: `left-${index}`,
        text: pair.left,
        type: "left",
      }));
      const rightItems = pairs.map((pair, index) => ({
        id: `right-${index}`,
        text: pair.right,
        type: "right",
      }));
      setMatchingPairs([
        ...leftItems,
        ...rightItems.sort(() => Math.random() - 0.5),
      ]);
    }
  }, [currentGame]);

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowQuizResult(true);

    setTimeout(() => {
      if (answerIndex === games[currentGame].correct) {
        setScore(score + 25);
      }
      nextGame();
    }, 2000);
  };

  const handleMemoryCardClick = (cardIndex) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardIndex) ||
      matchedCards.includes(cardIndex)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const firstCard = memoryCards[first];
      const secondCard = memoryCards[second];

      if (firstCard.id === secondCard.id) {
        // Match found
        setMatchedCards([...matchedCards, first, second]);
        setScore(score + 15);
        setFlippedCards([]);

        // Check if game is complete
        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => nextGame(), 1000);
        }
      } else {
        // No match
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleFamilyTreeAnswer = (position, answer) => {
    const newAnswers = { ...familyTreeAnswers, [position]: answer };
    setFamilyTreeAnswers(newAnswers);

    if (answer === games[2].correct[position]) {
      setScore(score + 20);
    }

    // Check if all positions are filled correctly
    const requiredPositions = Object.keys(games[2].correct);
    const allCorrect = requiredPositions.every(
      (pos) => newAnswers[pos] === games[2].correct[pos]
    );

    if (
      allCorrect &&
      Object.keys(newAnswers).length === requiredPositions.length
    ) {
      setTimeout(() => nextGame(), 1000);
    }
  };

  const handleMatchingClick = (item) => {
    if (selectedMatching.length === 0) {
      setSelectedMatching([item]);
    } else if (selectedMatching.length === 1) {
      const [firstItem] = selectedMatching;
      if (firstItem.id === item.id) {
        setSelectedMatching([]);
        return;
      }

      // Check if it's a valid pair
      const firstIndex = Number.parseInt(firstItem.id.split("-")[1]);
      const secondIndex = Number.parseInt(item.id.split("-")[1]);

      if (
        firstIndex === secondIndex &&
        ((firstItem.type === "left" && item.type === "right") ||
          (firstItem.type === "right" && item.type === "left"))
      ) {
        // Correct match
        setScore(score + 15);
        setMatchingPairs(
          matchingPairs.filter((p) => p.id !== firstItem.id && p.id !== item.id)
        );
        setSelectedMatching([]);

        if (matchingPairs.length <= 2) {
          setTimeout(() => nextGame(), 1000);
        }
      } else {
        // Wrong match
        setTimeout(() => setSelectedMatching([]), 1000);
      }
    }
  };

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setFamilyTreeAnswers({});
      setFlippedCards([]);
      setMatchedCards([]);
      setSelectedMatching([]);
    } else {
      setGameCompleted(true);
    }
  };

  const handleBackToChapter = () => {
    navigate("/chapter/1");
  };

  const chapterTheme = getChapterTheme(1);
  const celebrationTheme = getCelebrationTheme("completion");

  const renderQuizGame = (game) => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
        <h3 className="text-2xl font-black text-gray-800 mb-8 text-center leading-relaxed">
          {game.question}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {game.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(index)}
              disabled={showQuizResult}
              className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold ${showQuizResult
                  ? index === game.correct
                    ? "bg-green-100 border-green-400 text-green-800"
                    : index === selectedAnswer
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-100 border-gray-300 text-black"
                  : selectedAnswer === index
                    ? "bg-purple-100 border-purple-400 text-purple-800"
                    : "bg-gray-50 border-gray-200 text-black hover:bg-purple-50 hover:border-purple-300"
                }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${showQuizResult
                      ? index === game.correct
                        ? "bg-green-500 text-white"
                        : index === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-black"
                      : selectedAnswer === index
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg text-black">{option}</span>
              </div>
            </button>
          ))}
        </div>
        {showQuizResult && (
          <div className="mt-8 text-center">
            <div
              className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl font-black text-lg shadow-lg ${selectedAnswer === game.correct
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                }`}
            >
              <span className="text-2xl">
                {selectedAnswer === game.correct ? "🎉" : "💪"}
              </span>
              <span>
                {selectedAnswer === game.correct
                  ? "Excellent! You know Jose's family!"
                  : "Good try! Think about Jose's parents!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMemoryGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Find the matching pairs of family members
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {memoryCards.map((card, index) => (
          <div
            key={card.uniqueId}
            onClick={() => handleMemoryCardClick(index)}
            className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 ${flippedCards.includes(index) || matchedCards.includes(index)
                ? "bg-white border-2 border-purple-300"
                : "bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700"
              }`}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? (
              <div className="h-full flex flex-col items-center justify-center p-2">
                <div className="w-12 h-12 rounded-full mb-2 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-2xl">
                  {card.emoji}
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {card.name}
                </div>
                <div className="text-xs text-gray-600">{card.role}</div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-white text-2xl">?</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFamilyTreeGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Complete Jose's Family Tree
      </h3>

      {/* Family Tree Diagram */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 mb-6 min-h-[300px]">
        {game.positions.map((position) => (
          <div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(position.x / 600) * 100}%`,
              top: `${(position.y / 200) * 100}%`,
            }}
          >
            <div className="text-center">
              <div className="bg-white rounded-xl p-3 shadow-md border-2 border-gray-200 min-w-[120px]">
                <div className="text-xs text-gray-500 mb-1">
                  {position.label}
                </div>
                {position.fixed ? (
                  <div className="font-bold text-gray-800">Jose Rizal</div>
                ) : (
                  <select
                    value={familyTreeAnswers[position.id] || ""}
                    onChange={(e) =>
                      handleFamilyTreeAnswer(position.id, e.target.value)
                    }
                    className={`w-full text-sm border rounded px-2 py-1 ${familyTreeAnswers[position.id] ===
                        game.correct[position.id]
                        ? "border-green-400 bg-green-50 text-green-800"
                        : familyTreeAnswers[position.id]
                          ? "border-red-400 bg-red-50 text-red-800"
                          : "border-gray-300"
                      }`}
                  >
                    <option value="">Choose...</option>
                    {game.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Family Tree Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1="33%"
            y1="25%"
            x2="67%"
            y2="25%"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
          <line
            x1="50%"
            y1="25%"
            x2="50%"
            y2="75%"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
          <line
            x1="25%"
            y1="75%"
            x2="75%"
            y2="75%"
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Available Options */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          Available Family Members:
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {game.options.map((option, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {option}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMatchingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Match family members with their descriptions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">
            Family Members
          </h4>
          {matchingPairs
            .filter((item) => item.type === "left")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleMatchingClick(item)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${selectedMatching.some((s) => s.id === item.id)
                    ? "bg-blue-200 border-2 border-blue-400"
                    : "bg-orange-50 hover:bg-orange-100 border-2 border-orange-200"
                  }`}
              >
                {item.text}
              </button>
            ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 text-center">
            Descriptions
          </h4>
          {matchingPairs
            .filter((item) => item.type === "right")
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleMatchingClick(item)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${selectedMatching.some((s) => s.id === item.id)
                    ? "bg-blue-200 border-2 border-blue-400"
                    : "bg-green-50 hover:bg-green-100 border-2 border-green-200"
                  }`}
              >
                {item.text}
              </button>
            ))}
        </div>
      </div>

      {selectedMatching.length > 0 && (
        <div className="mt-6 text-center">
          <div className="text-blue-600 font-medium">
            Selected: {selectedMatching[0].text}
          </div>
          <div className="text-sm text-gray-500">
            Click on a matching item from the other column
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentGame = () => {
    const game = games[currentGame];
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game);
      case "memory":
        return renderMemoryGame(game);
      case "familytree":
        return renderFamilyTreeGame(game);
      case "matching":
        return renderMatchingGame(game);
      default:
        return null;
    }
  };

  if (gameCompleted) {
    return (
      <ErrorBoundary onGoBack={handleBackToChapter}>
        <div
          className={`min-h-screen w-full bg-gradient-to-br ${chapterTheme.background} flex items-center justify-center p-6`}
        >
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto border border-white/20">

              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                👨‍👩‍👧‍👦 Family Expert!
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Outstanding! You've mastered Jose Rizal's family background and
                learned about his loving parents and siblings!
              </p>
              <div
                className={`bg-gradient-to-r ${celebrationTheme.colors} text-white rounded-2xl p-6 mb-8 shadow-lg`}
              >
                <div className="text-3xl font-bold mb-2">
                  Final Score: {score}/100
                </div>
                <div className="text-white/90">
                  Outstanding work, {username}! 🌟
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-4 mb-6">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm text-purple-100">
                  Family Background Master
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBackToChapter}
                  className={`w-full bg-gradient-to-r ${chapterTheme.primary} text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  Continue to Chapter 1 🏠
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-purple-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-pink-300 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-rose-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-purple-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToChapter}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-b-2 border-gray-700 active:border-b-0"
            >
              <svg
                className="w-6 h-6 text-white"
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
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800">
                  Family Background
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Level 2 • Chapter 1
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/90 rounded-full px-4 py-2 shadow-md border-2 border-purple-200">
              <span className="text-purple-600 font-bold">Score: {score}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg border-b-2 border-red-700 active:border-b-0"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-purple-600">
                {currentGame + 1}/{games.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentGame + 1) / games.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-purple-200">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {games[currentGame].title}
            </h2>
            <p className="text-gray-600 font-medium">
              Discover Jose's loving family
            </p>
          </div>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Fact */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  Family Facts
                </h3>
                <p className="text-gray-600">Learn about Jose's family</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">👨</span>
                  <span className="font-bold text-gray-800">
                    Father - Francisco
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  A successful farmer and businessman in Calamba
                </p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">👩</span>
                  <span className="font-bold text-gray-800">
                    Mother - Teodora
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  An educated woman who became Jose's first teacher
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
