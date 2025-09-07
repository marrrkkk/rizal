import { useState, useEffect } from "react";
import GameHeader from "../../components/GameHeader";
import { filipinoTheme } from "../../theme/theme";

export default function TrialMartyrdomGame({ username, onLogout, onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showingResult, setShowingResult] = useState(false);

  const scenes = [
    {
      id: 1,
      title: "Arrest in Barcelona",
      date: "October 6, 1896",
      description:
        "You have been arrested aboard the ship Isla de Panay while en route to Cuba. Spanish authorities accuse you of inciting the Philippine Revolution.",
      image: "⚖️",
      question: "How do you respond to the accusations?",
      choices: [
        {
          text: "I deny all charges and demand proof of my involvement",
          points: 10,
          feedback:
            "Correct! Rizal maintained his innocence and demanded evidence.",
          historical: true,
        },
        {
          text: "I confess to everything to protect my family",
          points: 0,
          feedback: "Rizal never confessed to crimes he didn't commit.",
          historical: false,
        },
        {
          text: "I refuse to speak without a lawyer present",
          points: 5,
          feedback:
            "While reasonable, Rizal chose to defend himself eloquently.",
          historical: false,
        },
      ],
    },
    {
      id: 2,
      title: "Return to Manila",
      date: "November 3, 1896",
      description:
        "You have been brought back to Manila and imprisoned in Fort Santiago. The preliminary investigation begins.",
      image: "🏰",
      question: "What is your strategy for the trial?",
      choices: [
        {
          text: "Present evidence of my peaceful reform advocacy",
          points: 10,
          feedback:
            "Excellent! Rizal emphasized his commitment to peaceful reform.",
          historical: true,
        },
        {
          text: "Blame other revolutionaries for the uprising",
          points: 0,
          feedback: "Rizal would never betray his fellow Filipinos.",
          historical: false,
        },
        {
          text: "Claim I was forced to write my novels",
          points: 0,
          feedback: "Rizal was proud of his literary works and their message.",
          historical: false,
        },
      ],
    },
    {
      id: 3,
      title: "The Military Trial",
      date: "December 26, 1896",
      description:
        "Your trial begins before a military court. You are charged with sedition, rebellion, and forming illegal associations.",
      image: "⚖️",
      question: "How do you address the court?",
      choices: [
        {
          text: "I have always advocated for peaceful reform, not violent revolution",
          points: 10,
          feedback:
            "Perfect! This was Rizal's consistent message throughout the trial.",
          historical: true,
        },
        {
          text: "I call for immediate independence through any means necessary",
          points: 0,
          feedback:
            "This contradicts Rizal's philosophy of gradual, peaceful reform.",
          historical: false,
        },
        {
          text: "I remain silent and refuse to participate",
          points: 0,
          feedback: "Rizal actively participated in his defense.",
          historical: false,
        },
      ],
    },
    {
      id: 4,
      title: "Final Statement",
      date: "December 28, 1896",
      description:
        "The court has found you guilty. You are given a chance to make a final statement before sentencing.",
      image: "📜",
      question: "What do you say in your final statement?",
      choices: [
        {
          text: "I forgive my enemies and pray for my country's future",
          points: 10,
          feedback:
            "Beautiful! This reflects Rizal's noble character and love for country.",
          historical: true,
        },
        {
          text: "I curse Spain and call for revenge",
          points: 0,
          feedback: "Rizal harbored no hatred and advocated forgiveness.",
          historical: false,
        },
        {
          text: "I beg for mercy and promise to stop writing",
          points: 0,
          feedback: "Rizal faced his fate with dignity and never begged.",
          historical: false,
        },
      ],
    },
    {
      id: 5,
      title: "Last Night in Prison",
      date: "December 29, 1896",
      description:
        "You spend your final night in your cell, knowing you will be executed at dawn. You have time for one last act.",
      image: "🕯️",
      question: "How do you spend your final hours?",
      choices: [
        {
          text: "Write a farewell poem and letter to my family",
          points: 10,
          feedback:
            "Yes! Rizal wrote 'Mi Último Adiós' and letters to his loved ones.",
          historical: true,
        },
        {
          text: "Plan an escape attempt",
          points: 0,
          feedback: "Rizal accepted his fate with dignity.",
          historical: false,
        },
        {
          text: "Spend the time in despair and regret",
          points: 0,
          feedback: "Rizal remained composed and used his time meaningfully.",
          historical: false,
        },
      ],
    },
    {
      id: 6,
      title: "Bagumbayan Field",
      date: "December 30, 1896",
      description:
        "You are led to Bagumbayan field for execution. A crowd has gathered. Your final moment has come.",
      image: "🌅",
      question: "What are your final thoughts as you face the firing squad?",
      choices: [
        {
          text: "I die for my country and hope my death will inspire freedom",
          points: 10,
          feedback:
            "Perfect! Rizal's martyrdom indeed inspired the Philippine independence movement.",
          historical: true,
        },
        {
          text: "I regret everything I've done for the Philippines",
          points: 0,
          feedback: "Rizal never regretted his service to his country.",
          historical: false,
        },
        {
          text: "I fear death and wish I had lived differently",
          points: 0,
          feedback: "Rizal faced death courageously without fear or regret.",
          historical: false,
        },
      ],
    },
  ];

  const handleChoiceSelect = (choiceIndex) => {
    const scene = scenes[currentScene];
    const choice = scene.choices[choiceIndex];

    setSelectedChoices((prev) => [
      ...prev,
      { sceneId: scene.id, choice, choiceIndex },
    ]);
    setScore((prev) => prev + choice.points);
    setShowingResult(true);

    setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
        setShowingResult(false);
      } else {
        setGameComplete(true);
        onComplete(score);
      }
    }, 3000);
  };

  const getScoreMessage = () => {
    const maxScore = scenes.length * 10;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90)
      return "Outstanding! You've truly understood Rizal's noble character and sacrifice! 🌟";
    if (percentage >= 75)
      return "Excellent! You've grasped the essence of Rizal's martyrdom! 🏆";
    if (percentage >= 60)
      return "Good work! You understand the significance of Rizal's final days! 👍";
    return "Keep learning about our national hero's sacrifice! 📚";
  };

  const getCurrentScene = () => scenes[currentScene];

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
        <GameHeader
          title="Trial & Martyrdom"
          level={4}
          chapter={5}
          score={score}
          onBack={() => window.history.back()}
          onLogout={onLogout}
          username={username}
          theme="rose"
        />

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🕊️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              "Consummatum Est"
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You have experienced the final chapter of José Rizal's life
            </p>

            <div className="bg-rose-50 rounded-xl p-6 mb-6">
              <div className="text-2xl font-bold text-rose-800 mb-2">
                Final Score: {score} / {scenes.length * 10}
              </div>
              <div className="text-rose-700">
                Historical Accuracy:{" "}
                {Math.round((score / (scenes.length * 10)) * 100)}%
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-800">{getScoreMessage()}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">
                Historical Note
              </h3>
              <p className="text-yellow-700 text-sm">
                José Rizal's execution on December 30, 1896, sparked the
                Philippine Revolution and made him a martyr for independence.
                His death united Filipinos in their struggle for freedom.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors mr-4"
              >
                Experience Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scene = getCurrentScene();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
      <GameHeader
        title="Trial & Martyrdom"
        level={4}
        chapter={5}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="rose"
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Story Progress
            </span>
            <span className="text-sm font-medium text-rose-700">
              {currentScene + 1} / {scenes.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-rose-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentScene + 1) / scenes.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Scene Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{scene.image}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {scene.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{scene.date}</p>
            <p className="text-gray-700 leading-relaxed">{scene.description}</p>
          </div>

          {!showingResult ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {scene.question}
              </h3>

              <div className="space-y-4">
                {scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceSelect(index)}
                    className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-rose-300 hover:bg-rose-50 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <p className="text-gray-800">{choice.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                  Your Choice:
                </h3>
                <p className="text-blue-700 mb-4">
                  {selectedChoices[selectedChoices.length - 1]?.choice.text}
                </p>
                <div
                  className={`p-4 rounded-lg ${
                    selectedChoices[selectedChoices.length - 1]?.choice
                      .historical
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <p className="font-medium mb-2">
                    {selectedChoices[selectedChoices.length - 1]?.choice
                      .historical
                      ? "✓ Historically Accurate"
                      : "⚠ Not Historically Accurate"}
                  </p>
                  <p className="text-sm">
                    {
                      selectedChoices[selectedChoices.length - 1]?.choice
                        .feedback
                    }
                  </p>
                </div>
              </div>

              <div className="text-gray-600">
                {currentScene < scenes.length - 1
                  ? "Moving to next scene..."
                  : "Completing story..."}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-600">Score: {score} points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
