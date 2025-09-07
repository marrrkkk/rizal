import { useState, useEffect } from "react";
import { getRandomFact, educationalFacts } from "../utils/placeholderContent";

export default function EducationalFact({
  fact = null,
  showRandomFact = true,
  className = "",
  dismissible = true,
  autoRotate = false,
  rotateInterval = 10000,
}) {
  const [currentFact, setCurrentFact] = useState(fact || getRandomFact());
  const [isVisible, setIsVisible] = useState(true);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (autoRotate && !fact) {
      const interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % educationalFacts.length);
        setCurrentFact(educationalFacts[factIndex]);
      }, rotateInterval);

      return () => clearInterval(interval);
    }
  }, [autoRotate, fact, rotateInterval, factIndex]);

  const handleNewFact = () => {
    if (!fact) {
      setCurrentFact(getRandomFact());
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-indigo-100 border-l-4 border-blue-400 rounded-xl p-4 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">💡</span>
            <h4 className="font-bold text-blue-800">Did You Know?</h4>
          </div>
          <p className="text-blue-700 leading-relaxed">
            {currentFact.replace(/^🌟\s*/, "")}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {!fact && (
            <button
              onClick={handleNewFact}
              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
              title="Get another fact"
            >
              🔄
            </button>
          )}

          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
              title="Dismiss"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized fact components
export function RandomFactRotator({ interval = 15000, className = "" }) {
  return (
    <EducationalFact
      autoRotate={true}
      rotateInterval={interval}
      dismissible={false}
      className={className}
    />
  );
}

export function FactOfTheDay({ className = "" }) {
  // Use date to get consistent fact for the day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const factIndex = dayOfYear % educationalFacts.length;
  const dailyFact = educationalFacts[factIndex];

  return (
    <div
      className={`bg-gradient-to-r from-amber-50 to-orange-100 border-l-4 border-amber-400 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">📅</span>
        <h4 className="font-bold text-amber-800">Fact of the Day</h4>
      </div>
      <p className="text-amber-700 leading-relaxed">
        {dailyFact.replace(/^🌟\s*/, "")}
      </p>
    </div>
  );
}

// New component for age-appropriate educational facts
export function KidsEducationalFact({
  topic = "general",
  showAnimation = true,
  className = "",
}) {
  const kidsFriendlyFacts = {
    general: [
      "🎂 José was born on June 19th - that's in the middle of summer!",
      "👨‍👩‍👧‍👦 José had 10 brothers and sisters - imagine how fun family dinners were!",
      "📚 José learned to read when he was only 3 years old - younger than most kids start school!",
      "🗣️ José could speak 22 different languages - he was like a human translator!",
      "👨‍⚕️ José was a doctor who helped people see better by fixing their eyes!",
    ],
    childhood: [
      "🍼 Baby José was very curious and loved to explore everything around him!",
      "👩‍🏫 His mom was his first teacher - she taught him letters and numbers at home!",
      "🐛 Young José loved collecting insects and studying nature - he was like a little scientist!",
      "📖 José's favorite activity was reading books under the shade of trees!",
      "🎨 He loved to draw and paint pictures of the beautiful things he saw!",
    ],
    family: [
      "👨‍💼 José's dad was a farmer who grew rice and other crops to feed families!",
      "👩‍🏫 His mom was very smart and taught José to love learning!",
      "👨‍🎓 His big brother Paciano helped pay for José's education because he believed in him!",
      "🏠 The Rizal family lived in a big house in Calamba where they were very happy!",
      "💕 José's family loved each other very much and always supported each other!",
    ],
    education: [
      "🏫 José went to a school run by kind priests who taught him many subjects!",
      "🏆 He was always one of the best students in his class because he studied hard!",
      "📚 José loved reading so much that he would read books even during playtime!",
      "✍️ He started writing poems and stories when he was still a young boy!",
      "🌟 His teachers were amazed by how smart and hardworking he was!",
    ],
  };

  const [currentFact, setCurrentFact] = useState(
    kidsFriendlyFacts[topic]?.[0] || kidsFriendlyFacts.general[0]
  );
  const [factIndex, setFactIndex] = useState(0);

  const getNewFact = () => {
    const facts = kidsFriendlyFacts[topic] || kidsFriendlyFacts.general;
    const newIndex = (factIndex + 1) % facts.length;
    setFactIndex(newIndex);
    setCurrentFact(facts[newIndex]);
  };

  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-blue-100 border-l-4 border-green-400 rounded-xl p-4 ${className} ${
        showAnimation ? "animate-pulse" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🤓</span>
            <h4 className="font-bold text-green-800">Cool Fact!</h4>
          </div>
          <p className="text-green-700 leading-relaxed text-sm">
            {currentFact}
          </p>
        </div>
        <button
          onClick={getNewFact}
          className="text-green-600 hover:text-green-800 p-1 rounded transition-colors ml-2"
          title="Get another cool fact!"
        >
          🎲
        </button>
      </div>
    </div>
  );
}

// Component for contextual educational content based on game progress
export function ContextualEducationalContent({
  gameType,
  level,
  chapter,
  playerProgress = 0,
  className = "",
}) {
  const getContextualContent = () => {
    if (chapter === 1) {
      if (level === 1) {
        return {
          title: "José's Amazing Beginning! 🌟",
          content:
            "José Rizal was born in a beautiful town called Calamba. His family was very loving and they all lived together in a big, happy house!",
          emoji: "🏠",
        };
      } else if (level === 2) {
        return {
          title: "José's Wonderful Family! 👨‍👩‍👧‍👦",
          content:
            "José had the most amazing family! His mom and dad loved him very much, and he had many brothers and sisters to play with every day!",
          emoji: "💕",
        };
      }
    }

    return {
      title: "Learning About José! 📚",
      content:
        "José Rizal was a very special person who loved to learn new things every day, just like you!",
      emoji: "🌟",
    };
  };

  const content = getContextualContent();

  return (
    <div
      className={`bg-gradient-to-r from-purple-50 to-pink-100 border-l-4 border-purple-400 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{content.emoji}</span>
        <h4 className="font-bold text-purple-800">{content.title}</h4>
      </div>
      <p className="text-purple-700 leading-relaxed text-sm">
        {content.content}
      </p>

      {playerProgress > 50 && (
        <div className="mt-3 bg-purple-100 rounded-lg p-2">
          <p className="text-xs text-purple-600 font-medium">
            🎉 Great job! You're learning so much about José Rizal!
          </p>
        </div>
      )}
    </div>
  );
}
