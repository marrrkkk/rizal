import { useState } from "react";
import { GameHeader, ProgressBar, GameCard } from "./index";
import { filipinoTheme, getChapterTheme } from "../theme/theme";

const ThemeDemo = () => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [progress, setProgress] = useState(3);
  const [score, setScore] = useState(85);

  const chapterTheme = getChapterTheme(currentChapter);

  const sampleLevels = [
    {
      id: 1,
      title: "Jose's Birth",
      description: "Learn about when and where Jose was born",
      isUnlocked: true,
      isCompleted: true,
      difficulty: "easy",
      estimatedTime: 5,
      score: 95,
      maxScore: 100,
      icon: "👶",
    },
    {
      id: 2,
      title: "Family Background",
      description: "Meet Jose's parents and siblings",
      isUnlocked: true,
      isCompleted: true,
      difficulty: "easy",
      estimatedTime: 7,
      score: 88,
      maxScore: 100,
      icon: "👨‍👩‍👧‍👦",
    },
    {
      id: 3,
      title: "Early Childhood",
      description: "Discover Jose's first years in Calamba",
      isUnlocked: true,
      isCompleted: false,
      difficulty: "medium",
      estimatedTime: 10,
      icon: "🏠",
    },
    {
      id: 4,
      title: "First Teacher",
      description: "Learn about Jose's mother as his first teacher",
      isUnlocked: false,
      isCompleted: false,
      difficulty: "medium",
      estimatedTime: 8,
      icon: "👩‍🏫",
    },
    {
      id: 5,
      title: "Love for Reading",
      description: "How Jose developed his passion for books",
      isUnlocked: false,
      isCompleted: false,
      difficulty: "hard",
      estimatedTime: 12,
      icon: "📚",
    },
  ];

  const handleLevelClick = (level) => {
    console.log(`Clicked level ${level.id}: ${level.title}`);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleBack = () => {
    console.log("Back clicked");
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${chapterTheme.background}`}
    >
      {/* Demo Header */}
      <GameHeader
        title={`${chapterTheme.name} - Theme Demo`}
        level={3}
        chapter={currentChapter}
        score={score}
        onBack={handleBack}
        onLogout={handleLogout}
        username="Demo User"
        theme={
          currentChapter === 1
            ? "blue"
            : currentChapter === 2
              ? "yellow"
              : "green"
        }
        showScore={true}
        maxScore={100}
      />

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Theme Selector */}
        <div className="mb-8 text-center">
          <h2
            className={`text-3xl font-bold mb-4 ${filipinoTheme.colors.text.primary}`}
          >
            Filipino Theme System Demo
          </h2>
          <div className="flex justify-center space-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((chapter) => (
              <button
                key={chapter}
                onClick={() => setCurrentChapter(chapter)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${currentChapter === chapter
                  ? `bg-gradient-to-r ${getChapterTheme(chapter).primary
                  } text-black`
                  : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Chapter {chapter}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar Demo */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3
              className={`text-xl font-bold mb-4 ${filipinoTheme.colors.text.primary}`}
            >
              Progress Bar Component
            </h3>
            <ProgressBar
              current={progress}
              total={5}
              theme={
                currentChapter === 1
                  ? "blue"
                  : currentChapter === 2
                    ? "yellow"
                    : "green"
              }
              showLabels={true}
              showPercentage={true}
              animated={true}
              milestones={[
                { value: 1, label: "Started" },
                { value: 3, label: "Halfway" },
                { value: 5, label: "Complete" },
              ]}
            />
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setProgress(Math.max(0, progress - 1))}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => setProgress(Math.min(5, progress + 1))}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        {/* Game Cards Demo */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3
              className={`text-xl font-bold mb-6 ${filipinoTheme.colors.text.primary}`}
            >
              Game Card Components
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {sampleLevels.map((level) => (
                <GameCard
                  key={level.id}
                  level={level.id}
                  title={level.title}
                  description={level.description}
                  isUnlocked={level.isUnlocked}
                  isCompleted={level.isCompleted}
                  onClick={() => handleLevelClick(level)}
                  theme={
                    currentChapter === 1
                      ? "blue"
                      : currentChapter === 2
                        ? "yellow"
                        : "green"
                  }
                  icon={level.icon}
                  estimatedTime={level.estimatedTime}
                  difficulty={level.difficulty}
                  score={level.score}
                  maxScore={level.maxScore}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Theme Colors Demo */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3
              className={`text-xl font-bold mb-6 ${filipinoTheme.colors.text.primary}`}
            >
              Theme Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(filipinoTheme.colors.primary).map(
                ([name, gradient]) => (
                  <div key={name} className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-lg mx-auto mb-2 shadow-md`}
                    ></div>
                    <p
                      className={`text-sm font-medium ${filipinoTheme.colors.text.secondary}`}
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Animation Demo */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3
              className={`text-xl font-bold mb-6 ${filipinoTheme.colors.text.primary}`}
            >
              Animations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(filipinoTheme.animations).map(
                ([name, className]) => (
                  <div key={name} className="text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${filipinoTheme.colors.primary.blue} rounded-lg mx-auto mb-2 ${className}`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-black font-bold">
                        A
                      </div>
                    </div>
                    <p
                      className={`text-xs font-medium ${filipinoTheme.colors.text.secondary}`}
                    >
                      {name}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThemeDemo;
