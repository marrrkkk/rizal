import { useState } from "react";

export default function HintSystem({
  hints = [],
  maxHints = 3,
  onHintUsed = null,
  className = "",
  disabled = false,
}) {
  const [usedHints, setUsedHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const useHint = () => {
    if (currentHintIndex < hints.length && usedHints.length < maxHints) {
      const newHint = hints[currentHintIndex];
      setUsedHints((prev) => [...prev, newHint]);
      setCurrentHintIndex((prev) => prev + 1);

      if (onHintUsed) {
        onHintUsed(newHint, usedHints.length + 1);
      }
    }
  };

  const canUseHint =
    currentHintIndex < hints.length && usedHints.length < maxHints && !disabled;

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Hints
        </h3>
        <div className="text-sm text-gray-600">
          {usedHints.length} / {maxHints} used
        </div>
      </div>

      {/* Hint Button */}
      <div className="mb-4">
        <button
          onClick={useHint}
          disabled={!canUseHint}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            canUseHint
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {canUseHint
            ? "Get Hint"
            : usedHints.length >= maxHints
            ? "No More Hints"
            : "No Hints Available"}
        </button>
      </div>

      {/* Used Hints Display */}
      {usedHints.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Your Hints:</h4>
          {usedHints.map((hint, index) => (
            <div
              key={index}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded"
            >
              <div className="flex items-start">
                <span className="text-yellow-600 font-bold mr-2">
                  #{index + 1}
                </span>
                <p className="text-yellow-800 text-sm">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Encouragement Message */}
      {usedHints.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 italic">
            {usedHints.length === 1
              ? "Great! Use the hint to help you succeed! 🌟"
              : usedHints.length < maxHints
              ? "You're doing well! Keep trying! 💪"
              : "You've used all your hints. You can do this! 🎯"}
          </p>
        </div>
      )}
    </div>
  );
}

// Specialized hint components with child-friendly encouraging messages
export function GameHints({ gameType, level, onHintUsed, className = "" }) {
  const hintSets = {
    quiz: [
      "🤔 Read each option carefully - take your time, there's no rush!",
      "💭 Think about what you learned about José Rizal in previous levels",
      "📚 Consider the time period when José lived - what was happening then?",
    ],
    puzzle: [
      "🧩 Look for patterns in the pieces - they want to fit together!",
      "🔍 Start with the corners and edges - they're easier to spot!",
      "🎨 Group similar colors or themes together - they belong as friends!",
    ],
    matching: [
      "👀 Read all options before making matches - explore everything first!",
      "🔗 Look for key words that connect items - they're like clues!",
      "✨ Use the process of elimination - cross out what doesn't fit!",
    ],
    timeline: [
      "⏰ Think about the chronological order - what happened first, then next?",
      "🔄 Consider cause and effect - one event led to another!",
      "📅 Remember important dates you've learned - they're your guideposts!",
    ],
    dragdrop: [
      "🐌 Take your time to read all the options - slow and steady wins!",
      "👁️ Look for visual or textual clues - they're hiding in plain sight!",
      "🎯 Try different combinations if unsure - experimenting is learning!",
    ],
    memory: [
      "🧠 Focus on one pair at a time - don't try to remember everything!",
      "🎭 Create a story connecting the items - it helps your memory!",
      "🔄 If you forget, flip the same cards again - practice makes perfect!",
    ],
    word: [
      "📝 Sound out the words if you're not sure - your ears can help!",
      "🔤 Look for familiar letter patterns - you know more than you think!",
      "💡 Think about what makes sense in the story - context is your friend!",
    ],
  };

  const hints = hintSets[gameType] || [
    "🌟 Take your time and think carefully - you're doing great!",
    "📖 Review what you've learned so far - knowledge builds on knowledge!",
    "💪 Don't give up - José Rizal never gave up when things got difficult!",
  ];

  return (
    <HintSystem hints={hints} onHintUsed={onHintUsed} className={className} />
  );
}

export function EncouragingHints({
  difficulty = "medium",
  onHintUsed,
  className = "",
}) {
  const encouragingHints = {
    easy: [
      "🌟 You're doing amazing! Trust your instincts - they're usually right!",
      "👶 Remember what you learned about José's happy childhood with his loving family",
      "💝 Think about the values José's parents taught him - love, respect, and learning!",
    ],
    medium: [
      "💪 This is challenging, but you're so smart and can figure it out!",
      "📚 Consider what motivated José in his studies - he loved learning new things!",
      "🏰 Think about the historical period and its challenges - José lived in interesting times!",
    ],
    hard: [
      "🧠 This is tough, but look how much you're learning - you're becoming an expert!",
      "🧩 Break down the problem into smaller parts - one step at a time!",
      "🦸‍♂️ Remember that José faced many challenges too, but never gave up - just like you!",
    ],
  };

  return (
    <HintSystem
      hints={encouragingHints[difficulty]}
      maxHints={2}
      onHintUsed={onHintUsed}
      className={className}
    />
  );
}

// New component for contextual hints based on game progress
export function ContextualHints({
  gameType,
  currentScore,
  attempts,
  onHintUsed,
  className = "",
}) {
  const getContextualHints = () => {
    // Provide different hints based on performance
    if (attempts === 0) {
      return [
        "🎯 This is your first try - take a moment to read everything carefully!",
        "🤗 Remember, there's no pressure - learning is about having fun!",
        "✨ You've got this! José would be proud of your dedication to learning!",
      ];
    } else if (attempts === 1) {
      return [
        "🔄 Great job trying again! That shows you're a determined learner!",
        "🎓 Think about what you learned from your first attempt",
        "🌈 Every mistake is a step closer to success - keep going!",
      ];
    } else {
      return [
        "🏆 You're showing real persistence - that's what makes great learners!",
        "💡 Sometimes the answer becomes clearer when we take a different approach",
        "🌟 José Rizal had to study hard too - persistence pays off!",
      ];
    }
  };

  return (
    <HintSystem
      hints={getContextualHints()}
      maxHints={1}
      onHintUsed={onHintUsed}
      className={className}
    />
  );
}
