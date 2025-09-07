import { useState, useEffect } from "react";
import GameHeader from "../../components/GameHeader";
import { filipinoTheme } from "../../theme/theme";

export default function DapitanLifeGame({ username, onLogout, onComplete }) {
  const [currentDay, setCurrentDay] = useState(1);
  const [energy, setEnergy] = useState(100);
  const [happiness, setHappiness] = useState(80);
  const [knowledge, setKnowledge] = useState(60);
  const [community, setCommunity] = useState(40);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [dayResults, setDayResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const activities = [
    {
      id: 1,
      name: "Teach at the School",
      description: "Educate local children in various subjects",
      icon: "👨‍🏫",
      effects: { energy: -15, happiness: +10, knowledge: +20, community: +15 },
      points: 25,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Practice Medicine",
      description: "Treat patients at your clinic",
      icon: "⚕️",
      effects: { energy: -20, happiness: +15, knowledge: +10, community: +25 },
      points: 30,
      color: "from-green-400 to-green-600",
    },
    {
      id: 3,
      name: "Study Nature",
      description: "Collect specimens and conduct research",
      icon: "🔬",
      effects: { energy: -10, happiness: +20, knowledge: +25, community: +5 },
      points: 20,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 4,
      name: "Write Letters",
      description: "Correspond with family and friends",
      icon: "✍️",
      effects: { energy: -5, happiness: +25, knowledge: +5, community: +10 },
      points: 15,
      color: "from-amber-400 to-amber-600",
    },
    {
      id: 5,
      name: "Community Projects",
      description: "Help improve local infrastructure",
      icon: "🏗️",
      effects: { energy: -25, happiness: +5, knowledge: +5, community: +30 },
      points: 35,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 6,
      name: "Rest and Reflect",
      description: "Take time to rest and plan",
      icon: "🧘‍♂️",
      effects: { energy: +30, happiness: +10, knowledge: +5, community: 0 },
      points: 10,
      color: "from-teal-400 to-teal-600",
    },
  ];

  const handleActivitySelect = (activity) => {
    if (
      energy < Math.abs(activity.effects.energy) &&
      activity.effects.energy < 0
    ) {
      alert("Not enough energy for this activity! Try resting first.");
      return;
    }

    setSelectedActivity(activity);

    // Apply effects
    setEnergy((prev) =>
      Math.max(0, Math.min(100, prev + activity.effects.energy))
    );
    setHappiness((prev) =>
      Math.max(0, Math.min(100, prev + activity.effects.happiness))
    );
    setKnowledge((prev) =>
      Math.max(0, Math.min(100, prev + activity.effects.knowledge))
    );
    setCommunity((prev) =>
      Math.max(0, Math.min(100, prev + activity.effects.community))
    );
    setScore((prev) => prev + activity.points);

    // Record day result
    const result = {
      day: currentDay,
      activity: activity.name,
      effects: activity.effects,
      points: activity.points,
    };
    setDayResults((prev) => [...prev, result]);

    // Move to next day
    setTimeout(() => {
      if (currentDay >= 30) {
        completeGame();
      } else {
        setCurrentDay((prev) => prev + 1);
        setSelectedActivity(null);
      }
    }, 2000);
  };

  const completeGame = () => {
    setGameComplete(true);
    setShowResults(true);
    onComplete(score);
  };

  const getStatColor = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    if (value >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getStatBg = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getFinalMessage = () => {
    const avgStats = (energy + happiness + knowledge + community) / 4;
    if (avgStats >= 80)
      return "Excellent! You've made Dapitan a better place while maintaining your well-being! 🌟";
    if (avgStats >= 60)
      return "Good work! You've balanced your activities well during your exile. 👏";
    if (avgStats >= 40)
      return "Not bad! You've made some positive contributions to Dapitan. 👍";
    return "You struggled during your exile, but every experience teaches us something valuable. 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <GameHeader
        title="Dapitan Life Management"
        level={2}
        chapter={5}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="emerald"
      />

      <div className="max-w-6xl mx-auto p-6">
        {!gameComplete ? (
          <>
            {/* Game Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Day {currentDay} of 30
                </h2>
                <div className="text-lg font-semibold text-emerald-600">
                  Score: {score}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentDay / 30) * 100}%` }}
                ></div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Energy", value: energy, icon: "⚡", color: "blue" },
                  {
                    name: "Happiness",
                    value: happiness,
                    icon: "😊",
                    color: "yellow",
                  },
                  {
                    name: "Knowledge",
                    value: knowledge,
                    icon: "🧠",
                    color: "purple",
                  },
                  {
                    name: "Community",
                    value: community,
                    icon: "🤝",
                    color: "green",
                  },
                ].map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className={`${getStatBg(
                          stat.value
                        )} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${stat.value}%` }}
                      ></div>
                    </div>
                    <div
                      className={`text-sm font-bold ${getStatColor(
                        stat.value
                      )}`}
                    >
                      {stat.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                What would you like to do today?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivitySelect(activity)}
                    className={`bg-gradient-to-br ${activity.color} rounded-xl p-4 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg text-white`}
                  >
                    <div className="text-3xl mb-2">{activity.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{activity.name}</h4>
                    <p className="text-sm opacity-90 mb-3">
                      {activity.description}
                    </p>
                    <div className="text-xs space-y-1">
                      {Object.entries(activity.effects).map(
                        ([key, value]) =>
                          value !== 0 && (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span
                                className={
                                  value > 0 ? "text-green-200" : "text-red-200"
                                }
                              >
                                {value > 0 ? "+" : ""}
                                {value}
                              </span>
                            </div>
                          )
                      )}
                      <div className="flex justify-between font-semibold">
                        <span>Points:</span>
                        <span className="text-yellow-200">
                          +{activity.points}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Result */}
            {selectedActivity && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                  <div className="text-4xl mb-4">{selectedActivity.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedActivity.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedActivity.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    Day {currentDay} completed! Moving to next day...
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Game Complete */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Exile Complete!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You've successfully managed 30 days of Rizal's life in Dapitan!
            </p>

            <div className="bg-emerald-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">
                Final Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { name: "Energy", value: energy, icon: "⚡" },
                  { name: "Happiness", value: happiness, icon: "😊" },
                  { name: "Knowledge", value: knowledge, icon: "🧠" },
                  { name: "Community", value: community, icon: "🤝" },
                ].map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </div>
                    <div
                      className={`text-lg font-bold ${getStatColor(
                        stat.value
                      )}`}
                    >
                      {stat.value}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-lg font-bold text-emerald-800">
                Total Score: {score} points
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-800">{getFinalMessage()}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mr-4"
              >
                Play Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
