import { useState, useEffect } from "react";
import GameHeader from "../../components/GameHeader";
import { ScenePlaceholder } from "../../components/PlaceholderImage";
import { getRandomFact } from "../../utils/placeholderContent";

export default function SceneExplorerGame({ username, onLogout, onComplete }) {
  const scenes = [
    {
      id: 1,
      title: "The Dinner Party",
      description: "Ibarra's return and confrontation with Padre Damaso",
      emoji: "🍽️",
      questions: [
        {
          id: 1,
          question:
            "What was Padre Damaso's reaction when he first saw Ibarra?",
          options: [
            "He welcomed him",
            "He ignored him",
            "He left the party",
            "He insulted Ibarra's father",
          ],
          correct: 3,
          explanation:
            "Padre Damaso insulted Ibarra's late father, showing his disrespect.",
        },
      ],
    },
    {
      id: 2,
      title: "The School Inauguration",
      description: "Ibarra's dream project and its tragic end",
      emoji: "🏫",
      questions: [
        {
          id: 2,
          question: "What happened during the school's inauguration?",
          options: [
            "It was successful",
            "It was sabotaged",
            "No one came",
            "It was stopped",
          ],
          correct: 1,
          explanation:
            "The school was sabotaged, with explosives hidden in the cornerstone.",
        },
      ],
    },
    {
      id: 3,
      title: "Maria Clara's Fate",
      description: "The tragic resolution of Maria Clara's story",
      emoji: "⛪",
      questions: [
        {
          id: 3,
          question: "Why did Maria Clara enter the convent?",
          options: [
            "She chose to",
            "Her father forced her",
            "She was heartbroken",
            "To escape marriage",
          ],
          correct: 1,
          explanation: "Maria Clara was forced into the convent by her father.",
        },
      ],
    },
  ];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameCompleted, setGameCompleted] = useState(false);

  const currentScene = scenes[currentSceneIndex];
  const currentQuestion = currentScene.questions[0];
  const isLastScene = currentSceneIndex === scenes.length - 1;

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeOut();
    }
  }, [timeLeft, showFeedback, gameCompleted]);

  const handleOptionSelect = (optionIndex) => {
    if (showFeedback) return;

    setSelectedOption(optionIndex);
    setShowFeedback(true);

    if (optionIndex === currentQuestion.correct) {
      setScore((prev) => prev + 10 + Math.floor(timeLeft / 3));
    }
  };

  const handleTimeOut = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastScene) {
      setGameCompleted(true);
      onComplete();
    } else {
      setCurrentSceneIndex((prev) => prev + 1);
    }

    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(30);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <GameHeader
          title="Scene Explorer"
          level={5}
          chapter={4}
          score={score}
          onBack={() => window.history.back()}
          onLogout={onLogout}
          username={username}
          theme="purple"
        />

        <div className="flex items-center justify-center p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold text-indigo-900 mb-4">
              Scene Explorer Complete!
            </h1>
            <div className="text-5xl font-bold text-indigo-700 my-6">
              {score}
            </div>
            <p className="text-gray-600 mb-6">Total Score</p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">{getRandomFact()}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <GameHeader
        title="Scene Explorer"
        level={5}
        chapter={4}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="purple"
      />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg text-center">
          <div className="text-6xl mb-4">{currentScene.emoji}</div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">
            {currentScene.title}
          </h2>
          <p className="text-indigo-700">{currentScene.description}</p>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-indigo-600">
              Scene {currentSceneIndex + 1} of {scenes.length}
            </div>
            <div className="text-2xl font-bold text-indigo-700">{score}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold">{currentScene.title}</h2>
            <p>{currentScene.description}</p>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                Scene {currentSceneIndex + 1} of {scenes.length}
              </div>
              <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                ⏱️ {timeLeft}s
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-6">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 ${
                    showFeedback
                      ? index === currentQuestion.correct
                        ? "border-green-500 bg-green-50"
                        : selectedOption === index
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                      : "border-gray-200 hover:border-indigo-300 bg-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className="mb-6 p-4 rounded-lg bg-indigo-50 border-l-4 border-indigo-500">
                <p>{currentQuestion.explanation}</p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  {isLastScene ? "Finish" : "Next Scene"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
