"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function LoveForReadingGame({ username, onLogout }) {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState(0)
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Book Creation Workshop State
  const [bookElements, setBookElements] = useState({
    title: "",
    character: "",
    setting: "",
    theme: "",
    illustration: "",
  })
  const [availableElements, setAvailableElements] = useState({
    titles: ["The Brave Little Bird", "Adventures in Calamba", "The Magic Mango Tree", "Stories of Friendship"],
    characters: ["A curious boy", "A wise old man", "A talking animal", "A brave hero"],
    settings: ["Under the mango tree", "In a magical forest", "By the river", "In a distant land"],
    themes: ["Helping others", "Learning new things", "Being brave", "Family love"],
    illustrations: ["🐦", "🌳", "🏞️", "⭐"],
  })

  // Reading Adventure State
  const [adventureProgress, setAdventureProgress] = useState(0)
  const [currentScene, setCurrentScene] = useState(0)
  const [adventureChoices, setAdventureChoices] = useState([])

  // Word Collection State
  const [collectedWords, setCollectedWords] = useState([])
  const [wordCombinations, setWordCombinations] = useState([])
  const [floatingWords, setFloatingWords] = useState([])

  // Story Theater State
  const [theaterStory, setTheaterStory] = useState({
    characters: [],
    plot: [],
    ending: "",
  })
  const [theaterScene, setTheaterScene] = useState(0)

  const games = [
    {
      id: 0,
      type: "workshop",
      title: "Help Jose Create His First Book",
      description: "Choose elements to help Jose write his very first story!",
    },
    {
      id: 1,
      type: "adventure",
      title: "Reading Adventure Quest",
      description: "Join Jose on a magical reading adventure where your choices matter!",
      scenes: [
        {
          id: 0,
          text: "Jose finds a mysterious glowing book under the mango tree. What should he do?",
          image: "🌳📖✨",
          choices: [
            { text: "Open the book carefully", next: 1, skill: "curiosity" },
            { text: "Ask mother for permission first", next: 2, skill: "respect" },
            { text: "Share the discovery with siblings", next: 3, skill: "sharing" },
          ],
        },
        {
          id: 1,
          text: "The book magically transports Jose to a land of living words! Letters dance around him.",
          image: "🔤💫🌈",
          choices: [
            { text: "Try to catch the dancing letters", next: 4, skill: "action" },
            { text: "Observe and learn their pattern", next: 5, skill: "wisdom" },
            { text: "Speak to the letters kindly", next: 6, skill: "kindness" },
          ],
        },
        {
          id: 2,
          text: "Mother Teodora smiles and joins Jose. Together they discover the book's secret.",
          image: "👩‍👦📚💝",
          choices: [
            { text: "Read the book together", next: 7, skill: "family" },
            { text: "Take turns reading pages", next: 8, skill: "sharing" },
          ],
        },
      ],
    },
    {
      id: 2,
      type: "collection",
      title: "Word Collection Garden",
      description: "Help Jose collect magical words that grow like flowers in his reading garden!",
      wordCategories: {
        emotions: ["happy", "brave", "kind", "curious", "gentle"],
        nature: ["tree", "flower", "river", "mountain", "sunshine"],
        actions: ["read", "write", "learn", "explore", "discover"],
        values: ["truth", "justice", "love", "freedom", "wisdom"],
      },
    },
    {
      id: 3,
      type: "theater",
      title: "Story Imagination Theater",
      description: "Direct Jose's first theatrical performance based on his favorite stories!",
      storyElements: {
        characters: [
          { name: "The Wise Turtle", personality: "patient and thoughtful", emoji: "🐢" },
          { name: "The Brave Eagle", personality: "courageous and free", emoji: "🦅" },
          { name: "The Kind Farmer", personality: "hardworking and generous", emoji: "👨‍🌾" },
          { name: "The Curious Child", personality: "eager to learn", emoji: "👶" },
        ],
        conflicts: [
          "A drought threatens the village",
          "A bully is bothering smaller animals",
          "Someone has lost their way home",
          "A treasure needs to be found",
        ],
        solutions: [
          "Working together as a team",
          "Using wisdom instead of force",
          "Showing kindness to enemies",
          "Never giving up hope",
        ],
      },
    },
  ]

  useEffect(() => {
    if (currentGame === 2) {
      // Initialize floating words
      const allWords = Object.values(games[2].wordCategories).flat()
      const shuffled = allWords.sort(() => Math.random() - 0.5).slice(0, 12)
      setFloatingWords(
        shuffled.map((word, index) => ({
          id: index,
          word,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          collected: false,
          category: Object.keys(games[2].wordCategories).find((cat) => games[2].wordCategories[cat].includes(word)),
        })),
      )
    }
  }, [currentGame])

  const handleBookElementSelect = (elementType, value) => {
    const newElements = { ...bookElements, [elementType]: value }
    setBookElements(newElements)
    setScore(score + 20)

    // Check if book is complete
    const isComplete = Object.values(newElements).every((element) => element !== "")
    if (isComplete) {
      setTimeout(() => nextGame(), 2000)
    }
  }

  const handleAdventureChoice = (choice) => {
    setAdventureChoices([...adventureChoices, choice])
    setScore(score + 25)

    if (choice.next) {
      setCurrentScene(choice.next)
    } else {
      // Adventure complete
      setTimeout(() => nextGame(), 2000)
    }
  }

  const handleWordCollect = (wordId) => {
    const word = floatingWords.find((w) => w.id === wordId)
    if (word && !word.collected) {
      setCollectedWords([...collectedWords, word])
      setFloatingWords(floatingWords.map((w) => (w.id === wordId ? { ...w, collected: true } : w)))
      setScore(score + 15)

      // Check for word combinations
      checkWordCombinations([...collectedWords, word])

      if (collectedWords.length + 1 >= 10) {
        setTimeout(() => nextGame(), 1000)
      }
    }
  }

  const checkWordCombinations = (words) => {
    const combinations = [
      { words: ["brave", "truth"], story: "A story about standing up for what's right" },
      { words: ["kind", "sunshine"], story: "A tale about spreading joy to others" },
      { words: ["curious", "explore"], story: "An adventure about discovering new places" },
      { words: ["love", "family"], story: "A heartwarming story about family bonds" },
    ]

    combinations.forEach((combo) => {
      if (combo.words.every((word) => words.some((w) => w.word === word))) {
        if (!wordCombinations.some((wc) => wc.story === combo.story)) {
          setWordCombinations([...wordCombinations, combo])
          setScore(score + 30)
        }
      }
    })
  }

  const handleTheaterChoice = (elementType, choice) => {
    const newStory = { ...theaterStory }

    if (elementType === "character") {
      newStory.characters = [...newStory.characters, choice]
    } else if (elementType === "plot") {
      newStory.plot = [...newStory.plot, choice]
    } else if (elementType === "ending") {
      newStory.ending = choice
    }

    setTheaterStory(newStory)
    setScore(score + 25)

    // Check if story is complete
    if (newStory.characters.length >= 2 && newStory.plot.length >= 1 && newStory.ending) {
      setTimeout(() => nextGame(), 2000)
    }
  }

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1)
      setCurrentScene(0)
      setAdventureChoices([])
    } else {
      setGameCompleted(true)
      setShowCelebration(true)
    }
  }

  const handleBackToChapter = () => {
    navigate("/chapter/1")
  }

  const renderWorkshopGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jose's Book Creation Workshop</h3>

      {/* Book Preview */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-amber-600 text-white px-6 py-3 rounded-xl text-xl font-bold">
            📖 {bookElements.title || "Choose a title..."}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Story Elements</h4>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Character:</strong> {bookElements.character || "..."}
              </p>
              <p>
                <strong>Setting:</strong> {bookElements.setting || "..."}
              </p>
              <p>
                <strong>Theme:</strong> {bookElements.theme || "..."}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <h4 className="font-semibold text-gray-800 mb-2">Illustration</h4>
            <div className="text-6xl">{bookElements.illustration || "🎨"}</div>
          </div>
        </div>
      </div>

      {/* Element Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(availableElements).map(([elementType, options]) => (
          <div key={elementType} className="bg-white rounded-xl p-4 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-3 capitalize">
              {elementType === "illustrations" ? "Illustration" : elementType.slice(0, -1)}
            </h4>
            <div className="space-y-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleBookElementSelect(
                      elementType === "titles"
                        ? "title"
                        : elementType === "characters"
                          ? "character"
                          : elementType === "settings"
                            ? "setting"
                            : elementType === "themes"
                              ? "theme"
                              : "illustration",
                      option,
                    )
                  }
                  disabled={
                    bookElements[
                      elementType === "titles"
                        ? "title"
                        : elementType === "characters"
                          ? "character"
                          : elementType === "settings"
                            ? "setting"
                            : elementType === "themes"
                              ? "theme"
                              : "illustration"
                    ] === option
                  }
                  className={`w-full p-2 rounded-lg text-left text-sm transition-all duration-200 ${
                    bookElements[
                      elementType === "titles"
                        ? "title"
                        : elementType === "characters"
                          ? "character"
                          : elementType === "settings"
                            ? "setting"
                            : elementType === "themes"
                              ? "theme"
                              : "illustration"
                    ] === option
                      ? "bg-amber-200 text-amber-800 border-2 border-amber-400"
                      : "bg-gray-50 hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-300"
                  }`}
                >
                  {elementType === "illustrations" ? <span className="text-2xl">{option}</span> : option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-amber-100 rounded-full px-4 py-2">
          <span className="text-amber-800 font-medium">
            Book Progress: {Object.values(bookElements).filter((e) => e !== "").length} / 5 elements
          </span>
        </div>
      </div>
    </div>
  )

  const renderAdventureGame = (game) => {
    const scene = game.scenes.find((s) => s.id === currentScene) || game.scenes[0]

    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jose's Reading Adventure</h3>

        {/* Adventure Scene */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">{scene.image}</div>
            <p className="text-lg text-gray-700 leading-relaxed">{scene.text}</p>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scene.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAdventureChoice(choice)}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{choice.text}</p>
                    <p className="text-sm text-purple-600">Skill: {choice.skill}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Adventure Progress */}
        {adventureChoices.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-3">Your Adventure Journey:</h4>
            <div className="flex flex-wrap gap-2">
              {adventureChoices.map((choice, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {choice.skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderCollectionGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jose's Word Collection Garden</h3>

      {/* Word Garden */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 min-h-[400px] mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-2xl"></div>

        {/* Floating Words */}
        {floatingWords.map((wordObj) => (
          <div
            key={wordObj.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${wordObj.x}%`,
              top: `${wordObj.y}%`,
              animation: `float 3s ease-in-out infinite ${wordObj.id * 0.5}s`,
            }}
            onClick={() => handleWordCollect(wordObj.id)}
          >
            <div
              className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                wordObj.collected
                  ? "bg-green-400 text-white scale-75 opacity-50"
                  : `bg-gradient-to-r ${
                      wordObj.category === "emotions"
                        ? "from-pink-400 to-red-400"
                        : wordObj.category === "nature"
                          ? "from-green-400 to-emerald-400"
                          : wordObj.category === "actions"
                            ? "from-blue-400 to-indigo-400"
                            : "from-purple-400 to-violet-400"
                    } text-white hover:scale-110 hover:shadow-xl`
              }`}
            >
              <span className="font-medium">{wordObj.word}</span>
            </div>
          </div>
        ))}

        {/* Garden Elements */}
        <div className="absolute bottom-4 left-4 text-4xl">🌳</div>
        <div className="absolute bottom-4 right-4 text-4xl">🌸</div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-4xl">☀️</div>
      </div>

      {/* Collection Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collected Words */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3">Collected Words ({collectedWords.length})</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {collectedWords.map((wordObj, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-sm ${
                  wordObj.category === "emotions"
                    ? "bg-pink-100 text-pink-800"
                    : wordObj.category === "nature"
                      ? "bg-green-100 text-green-800"
                      : wordObj.category === "actions"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                }`}
              >
                {wordObj.word}
              </span>
            ))}
          </div>
        </div>

        {/* Story Combinations */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3">Story Ideas Created ({wordCombinations.length})</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {wordCombinations.map((combo, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <p className="text-sm text-yellow-800">{combo.story}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
      `}</style>
    </div>
  )

  const renderTheaterGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Jose's Story Theater</h3>

      {/* Theater Stage */}
      <div className="bg-gradient-to-b from-red-100 to-red-200 rounded-2xl p-8 mb-6 relative">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-4xl">🎭</div>
        <div className="bg-white rounded-xl p-6 mt-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Your Story So Far:</h4>

          <div className="space-y-4">
            {/* Characters */}
            <div>
              <strong>Characters:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {theaterStory.characters.map((char, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{char.emoji}</span>
                    <span>{char.name}</span>
                  </span>
                ))}
                {theaterStory.characters.length === 0 && (
                  <span className="text-gray-500 italic">Choose characters below...</span>
                )}
              </div>
            </div>

            {/* Plot */}
            <div>
              <strong>Story Problem:</strong>
              <div className="mt-2">
                {theaterStory.plot.length > 0 ? (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-sm">
                    {theaterStory.plot[0]}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Choose a problem below...</span>
                )}
              </div>
            </div>

            {/* Ending */}
            <div>
              <strong>Solution:</strong>
              <div className="mt-2">
                {theaterStory.ending ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm">
                    {theaterStory.ending}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Choose an ending below...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Characters */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3">Choose Characters (Pick 2)</h4>
          <div className="space-y-2">
            {game.storyElements.characters.map((char, index) => (
              <button
                key={index}
                onClick={() => handleTheaterChoice("character", char)}
                disabled={theaterStory.characters.length >= 2 || theaterStory.characters.includes(char)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  theaterStory.characters.includes(char)
                    ? "bg-blue-200 text-blue-800 border-2 border-blue-400"
                    : theaterStory.characters.length >= 2
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{char.emoji}</span>
                  <div>
                    <div className="font-medium">{char.name}</div>
                    <div className="text-sm text-gray-600">{char.personality}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conflicts */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3">Choose a Problem</h4>
          <div className="space-y-2">
            {game.storyElements.conflicts.map((conflict, index) => (
              <button
                key={index}
                onClick={() => handleTheaterChoice("plot", conflict)}
                disabled={theaterStory.plot.includes(conflict)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  theaterStory.plot.includes(conflict)
                    ? "bg-orange-200 text-orange-800 border-2 border-orange-400"
                    : "bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
                {conflict}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-3">Choose an Ending</h4>
          <div className="space-y-2">
            {game.storyElements.solutions.map((solution, index) => (
              <button
                key={index}
                onClick={() => handleTheaterChoice("ending", solution)}
                disabled={theaterStory.ending === solution}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  theaterStory.ending === solution
                    ? "bg-green-200 text-green-800 border-2 border-green-400"
                    : "bg-gray-50 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300"
                }`}
              >
                {solution}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentGame = () => {
    const game = games[currentGame]
    switch (game.type) {
      case "workshop":
        return renderWorkshopGame(game)
      case "adventure":
        return renderAdventureGame(game)
      case "collection":
        return renderCollectionGame(game)
      case "theater":
        return renderTheaterGame(game)
      default:
        return null
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">
            {showCelebration && <div className="text-6xl mb-6 animate-bounce">📚✨</div>}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Master Storyteller!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Incredible! You've helped Jose discover the magic of reading and storytelling! You created books, went on
              reading adventures, collected magical words, and directed amazing stories. Just like Jose, you've learned
              that books can take you anywhere and help you become anything!
            </p>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-amber-100 mt-2">Amazing creativity, {username}!</div>
            </div>

            {/* Chapter 1 Completion Badge */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-6 mb-6">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold mb-2">Chapter 1 Complete!</h2>
              <p className="text-green-100">You've mastered Jose Rizal's childhood in Calamba!</p>
              <div className="mt-4 text-sm text-green-200">
                🎂 Birth Expert • 👨‍👩‍👧‍👦 Family Expert • 🌱 Childhood Explorer • 👩‍🏫 Learning Champion • 📚 Master
                Storyteller
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
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToChapter}
              className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">📚</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Love for Reading</h1>
              <p className="text-sm text-gray-600">Level 5 - Jose's Creative Journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-gray-700">Score: {score}</span>
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
            <span className="text-sm font-medium text-gray-600">Creative Journey Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 max-w-2xl mx-auto">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentGame + 1) / games.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Activity {currentGame + 1} of {games.length}
          </p>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{games[currentGame].title}</h2>
          <p className="text-gray-600">{games[currentGame].description}</p>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Info */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Jose's Creative Spirit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📖</span>
              <div>
                <strong>Book Creator:</strong> Reading so many stories inspired Jose to create his own tales and
                eventually write famous novels.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎭</span>
              <div>
                <strong>Storyteller:</strong> Jose loved to tell stories to his siblings and friends, developing his
                narrative skills.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🌟</span>
              <div>
                <strong>Imagination:</strong> Books opened up worlds of imagination that helped Jose think creatively
                about solving problems.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💭</span>
              <div>
                <strong>Deep Thinker:</strong> Reading taught Jose to think deeply about life, justice, and how to help
                his country.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
