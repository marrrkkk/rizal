import { useState, useEffect } from "react";
import GameHeader from "../../components/GameHeader";
import { filipinoTheme } from "../../theme/theme";

export default function LegacyBuilderGame({ username, onLogout, onComplete }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [legacyPoints, setLegacyPoints] = useState({
    education: 0,
    nationalism: 0,
    literature: 0,
    reform: 0,
    inspiration: 0,
  });
  const [totalScore, setTotalScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  const rounds = [
    {
      id: 1,
      title: "Educational Impact",
      description:
        "How will Rizal's educational philosophy influence future generations?",
      icon: "🎓",
      actions: [
        {
          name: "Establish Schools Nationwide",
          description:
            "Create educational institutions based on Rizal's teaching methods",
          effects: { education: 25, nationalism: 10, reform: 5 },
          points: 40,
          outcome:
            "Schools across the Philippines adopt Rizal's progressive teaching methods, emphasizing critical thinking and love of country.",
        },
        {
          name: "Translate His Works",
          description: "Make Rizal's writings accessible in local languages",
          effects: { education: 15, literature: 20, nationalism: 15 },
          points: 50,
          outcome:
            "Rizal's novels and essays reach more Filipinos, spreading his ideas of reform and national identity.",
        },
        {
          name: "Create Educational Scholarships",
          description: "Fund students to study abroad like Rizal did",
          effects: { education: 20, reform: 15, inspiration: 10 },
          points: 45,
          outcome:
            "Filipino scholars study overseas and return with knowledge to modernize the country.",
        },
      ],
    },
    {
      id: 2,
      title: "Literary Legacy",
      description: "How will Rizal's literary works continue to inspire?",
      icon: "📚",
      actions: [
        {
          name: "Adapt Works for Modern Media",
          description:
            "Create films, TV shows, and digital content based on his novels",
          effects: { literature: 25, inspiration: 20, nationalism: 10 },
          points: 55,
          outcome:
            "Rizal's stories reach new audiences through movies, series, and online platforms, keeping his message alive.",
        },
        {
          name: "International Translation",
          description: "Translate Rizal's works into world languages",
          effects: { literature: 20, education: 10, inspiration: 15 },
          points: 45,
          outcome:
            "The world learns about Philippine history and Rizal's advocacy for human rights and social justice.",
        },
        {
          name: "Literary Competitions",
          description: "Organize writing contests inspired by Rizal's themes",
          effects: { literature: 15, education: 15, nationalism: 15 },
          points: 45,
          outcome:
            "Young writers explore themes of patriotism, social reform, and national identity in their works.",
        },
      ],
    },
    {
      id: 3,
      title: "Reform Movement",
      description: "How will Rizal's reform ideals shape the nation's future?",
      icon: "⚖️",
      actions: [
        {
          name: "Peaceful Advocacy Training",
          description: "Teach Rizal's methods of peaceful reform and dialogue",
          effects: { reform: 25, education: 15, inspiration: 10 },
          points: 50,
          outcome:
            "Citizens learn to advocate for change through peaceful means, following Rizal's example of reasoned discourse.",
        },
        {
          name: "Anti-Corruption Campaigns",
          description: "Use Rizal's writings to fight modern corruption",
          effects: { reform: 20, nationalism: 15, inspiration: 15 },
          points: 50,
          outcome:
            "Rizal's criticism of colonial abuse inspires modern anti-corruption movements and good governance.",
        },
        {
          name: "Human Rights Education",
          description: "Promote Rizal's ideas about human dignity and rights",
          effects: { reform: 15, education: 20, inspiration: 10 },
          points: 45,
          outcome:
            "Rizal's belief in human equality and dignity becomes foundation for human rights education.",
        },
      ],
    },
    {
      id: 4,
      title: "National Identity",
      description: "How will Rizal's vision of Filipino identity evolve?",
      icon: "🇵🇭",
      actions: [
        {
          name: "Cultural Preservation Programs",
          description:
            "Protect Filipino culture and traditions as Rizal advocated",
          effects: { nationalism: 25, education: 10, inspiration: 15 },
          points: 50,
          outcome:
            "Filipino culture and languages are preserved and celebrated, maintaining national identity in a global world.",
        },
        {
          name: "Unity in Diversity Campaigns",
          description:
            "Promote Rizal's vision of a united but diverse Philippines",
          effects: { nationalism: 20, reform: 15, inspiration: 15 },
          points: 50,
          outcome:
            "Different Filipino communities unite while celebrating their unique traditions, as Rizal envisioned.",
        },
        {
          name: "Global Filipino Network",
          description:
            "Connect overseas Filipinos with Rizal's patriotic ideals",
          effects: { nationalism: 15, inspiration: 20, education: 10 },
          points: 45,
          outcome:
            "Overseas Filipinos maintain strong connections to their homeland, inspired by Rizal's love of country.",
        },
      ],
    },
    {
      id: 5,
      title: "Inspirational Impact",
      description: "How will Rizal continue to inspire future heroes?",
      icon: "⭐",
      actions: [
        {
          name: "Youth Leadership Programs",
          description: "Train young leaders using Rizal's example",
          effects: { inspiration: 25, education: 15, nationalism: 10 },
          points: 50,
          outcome:
            "Young Filipinos develop leadership skills and moral courage, following Rizal's example of service.",
        },
        {
          name: "Heroism Recognition Awards",
          description: "Honor modern heroes who embody Rizal's values",
          effects: { inspiration: 20, nationalism: 15, reform: 15 },
          points: 50,
          outcome:
            "Teachers, doctors, activists, and public servants are recognized for their Rizal-like dedication to country.",
        },
        {
          name: "International Peace Advocacy",
          description:
            "Promote Rizal's peaceful approach to conflict resolution globally",
          effects: { inspiration: 15, reform: 20, education: 10 },
          points: 45,
          outcome:
            "Rizal's philosophy of peaceful reform influences international diplomacy and conflict resolution.",
        },
      ],
    },
  ];

  const achievements = [
    {
      id: 1,
      name: "Education Champion",
      requirement: "education >= 50",
      icon: "🎓",
      description: "Master of Educational Reform",
    },
    {
      id: 2,
      name: "Literary Giant",
      requirement: "literature >= 50",
      icon: "📖",
      description: "Keeper of Literary Legacy",
    },
    {
      id: 3,
      name: "Reform Leader",
      requirement: "reform >= 50",
      icon: "⚖️",
      description: "Advocate for Peaceful Change",
    },
    {
      id: 4,
      name: "National Hero",
      requirement: "nationalism >= 50",
      icon: "🇵🇭",
      description: "Guardian of Filipino Identity",
    },
    {
      id: 5,
      name: "Inspiration Source",
      requirement: "inspiration >= 50",
      icon: "⭐",
      description: "Beacon of Hope and Courage",
    },
    {
      id: 6,
      name: "Balanced Legacy",
      requirement: "all >= 30",
      icon: "🏆",
      description: "Well-Rounded Impact Builder",
    },
    {
      id: 7,
      name: "Perfect Vision",
      requirement: "total >= 250",
      icon: "🌟",
      description: "Master Legacy Builder",
    },
  ];

  const handleActionSelect = (action) => {
    setSelectedAction(action);

    // Apply effects
    const newPoints = { ...legacyPoints };
    Object.entries(action.effects).forEach(([key, value]) => {
      newPoints[key] = Math.min(100, newPoints[key] + value);
    });
    setLegacyPoints(newPoints);
    setTotalScore((prev) => prev + action.points);

    // Check for achievements
    checkAchievements(newPoints);

    setShowResult(true);

    setTimeout(() => {
      if (currentRound < rounds.length) {
        setCurrentRound((prev) => prev + 1);
        setShowResult(false);
        setSelectedAction(null);
      } else {
        setGameComplete(true);
        onComplete(totalScore);
      }
    }, 3000);
  };

  const checkAchievements = (points) => {
    const newAchievements = [];
    const total = Object.values(points).reduce((sum, val) => sum + val, 0);

    achievements.forEach((achievement) => {
      if (!unlockedAchievements.find((a) => a.id === achievement.id)) {
        let unlocked = false;

        if (achievement.requirement === "all >= 30") {
          unlocked = Object.values(points).every((val) => val >= 30);
        } else if (achievement.requirement === "total >= 250") {
          unlocked = total >= 250;
        } else {
          const [category, operator, threshold] =
            achievement.requirement.split(" ");
          unlocked = points[category] >= parseInt(threshold);
        }

        if (unlocked) {
          newAchievements.push(achievement);
        }
      }
    });

    if (newAchievements.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newAchievements]);
    }
  };

  const getStatColor = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-blue-600";
    if (value >= 40) return "text-yellow-600";
    if (value >= 20) return "text-orange-600";
    return "text-gray-600";
  };

  const getStatBg = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    if (value >= 20) return "bg-orange-500";
    return "bg-gray-400";
  };

  const getFinalMessage = () => {
    const total = Object.values(legacyPoints).reduce(
      (sum, val) => sum + val,
      0
    );
    const average = total / 5;

    if (average >= 80)
      return "Extraordinary! You've built a legacy that would make Rizal proud! His impact will resonate for generations! 🌟";
    if (average >= 60)
      return "Excellent! You've successfully extended Rizal's influence across multiple areas of society! 🏆";
    if (average >= 40)
      return "Good work! You've made meaningful contributions to preserving and extending Rizal's legacy! 👏";
    return "You've started building Rizal's legacy. Every small step contributes to his enduring impact! 💪";
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100">
        <GameHeader
          title="Legacy Builder"
          level={5}
          chapter={5}
          score={totalScore}
          onBack={() => window.history.back()}
          onLogout={onLogout}
          username={username}
          theme="purple"
        />

        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏛️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Legacy Complete!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                You've shaped how José Rizal's impact will continue through
                history!
              </p>
            </div>

            {/* Final Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(legacyPoints).map(([category, value]) => (
                <div
                  key={category}
                  className="text-center bg-gray-50 rounded-xl p-4"
                >
                  <div className="text-2xl mb-2">
                    {category === "education" && "🎓"}
                    {category === "nationalism" && "🇵🇭"}
                    {category === "literature" && "📚"}
                    {category === "reform" && "⚖️"}
                    {category === "inspiration" && "⭐"}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-2 capitalize">
                    {category}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`${getStatBg(
                        value
                      )} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <div className={`text-lg font-bold ${getStatColor(value)}`}>
                    {value}%
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            {unlockedAchievements.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">
                  🏆 Achievements Unlocked
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-lg p-3 text-center"
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="font-bold text-sm text-gray-800">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-purple-50 rounded-xl p-6 mb-6 text-center">
              <div className="text-2xl font-bold text-purple-800 mb-2">
                Total Impact Score: {totalScore}
              </div>
              <p className="text-purple-700">{getFinalMessage()}</p>
            </div>

            <div className="space-y-4 text-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Build Again
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

  const round = rounds[currentRound - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100">
      <GameHeader
        title="Legacy Builder"
        level={5}
        chapter={5}
        score={totalScore}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="purple"
      />

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Legacy Building Progress
            </span>
            <span className="text-sm font-medium text-purple-700">
              Round {currentRound} / {rounds.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentRound / rounds.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Legacy Impact Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(legacyPoints).map(([category, value]) => (
              <div key={category} className="text-center">
                <div className="text-2xl mb-1">
                  {category === "education" && "🎓"}
                  {category === "nationalism" && "🇵🇭"}
                  {category === "literature" && "📚"}
                  {category === "reform" && "⚖️"}
                  {category === "inspiration" && "⭐"}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1 capitalize">
                  {category}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className={`${getStatBg(
                      value
                    )} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <div className={`text-sm font-bold ${getStatColor(value)}`}>
                  {value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Round Content */}
        {!showResult ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{round.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {round.title}
              </h2>
              <p className="text-gray-600">{round.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {round.actions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleActionSelect(action)}
                  className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg text-white"
                >
                  <h4 className="font-bold text-lg mb-3">{action.name}</h4>
                  <p className="text-sm opacity-90 mb-4">
                    {action.description}
                  </p>
                  <div className="text-xs space-y-1">
                    {Object.entries(action.effects).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="text-green-200">+{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold pt-1 border-t border-white/20">
                      <span>Points:</span>
                      <span className="text-yellow-200">+{action.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedAction.name}
            </h3>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <p className="text-blue-800">{selectedAction.outcome}</p>
            </div>
            <div className="text-gray-600">
              {currentRound < rounds.length
                ? "Moving to next round..."
                : "Completing legacy..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
