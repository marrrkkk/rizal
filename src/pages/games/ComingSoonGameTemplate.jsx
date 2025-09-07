import { useState } from "react";
import GameHeader from "../../components/GameHeader";
import { ComingSoonGame } from "../../components/ComingSoon";
import { getRandomFact } from "../../utils/placeholderContent";

export default function ComingSoonGameTemplate({
  username,
  onLogout,
  onComplete,
  gameName = "New Game",
  level = 1,
  chapter = 1,
  theme = "blue",
  description = null,
  features = null,
}) {
  const [showFact, setShowFact] = useState(true);
  const fact = getRandomFact();

  const handleBackToChapter = () => {
    window.history.back();
  };

  const handlePlayDemo = () => {
    // Simple demo interaction
    alert(
      "🎮 Demo coming soon! This game is being developed to provide an amazing learning experience about José Rizal!"
    );
    if (onComplete) {
      onComplete(50); // Give some points for trying
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <GameHeader
        title={gameName}
        level={level}
        chapter={chapter}
        score={0}
        onBack={handleBackToChapter}
        onLogout={onLogout}
        username={username}
        theme={theme}
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Main Coming Soon Card */}
        <div className="mb-8">
          <ComingSoonGame
            gameName={gameName}
            description={description}
            features={features}
          />
        </div>

        {/* Interactive Preview Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🎯 Game Preview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">🎮</div>
              <h4 className="font-semibold text-blue-800 mb-2">Interactive</h4>
              <p className="text-sm text-blue-600">
                Engaging gameplay that makes learning fun and memorable
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-semibold text-green-800 mb-2">Educational</h4>
              <p className="text-sm text-green-600">
                Historically accurate content about José Rizal's life
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-purple-800 mb-2">Rewarding</h4>
              <p className="text-sm text-purple-600">
                Progress tracking and achievements for completed activities
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handlePlayDemo}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🎮 Try Demo Preview
            </button>
          </div>
        </div>

        {/* Educational Fact */}
        {showFact && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-100 border-l-4 border-amber-400 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-amber-800 mb-2">
                  💡 Did You Know?
                </h4>
                <p className="text-amber-700">{fact.replace(/^🌟\s*/, "")}</p>
              </div>
              <button
                onClick={() => setShowFact(false)}
                className="text-amber-600 hover:text-amber-800 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Development Status */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🚀 Development Status
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800">✅ Game Concept</span>
              <span className="text-green-600 font-semibold">Complete</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-800">🔄 Game Development</span>
              <span className="text-yellow-600 font-semibold">In Progress</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-800">🎨 Art & Design</span>
              <span className="text-blue-600 font-semibold">Planned</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-800">🧪 Testing & Polish</span>
              <span className="text-purple-600 font-semibold">Upcoming</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              We're working hard to bring you the best educational gaming
              experience!
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToChapter}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
