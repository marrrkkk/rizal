import { useState } from "react";

// Child-friendly error messages component
export function ChildFriendlyError({
  errorType = "general",
  onRetry = null,
  onHelp = null,
  className = "",
}) {
  const [showHelp, setShowHelp] = useState(false);

  const errorMessages = {
    general: {
      title: "Oops! Something needs fixing! 🔧",
      message:
        "Don't worry! Sometimes things don't work perfectly, and that's okay. Let's try again together!",
      emoji: "😊",
      helpText:
        "This happens to everyone, even grown-ups! The important thing is to keep trying.",
      encouragement:
        "José Rizal never gave up when things got difficult, and neither should you!",
    },
    network: {
      title: "The internet is taking a little break! 📡",
      message:
        "Sometimes the internet needs a moment to rest. Let's wait a little bit and try again!",
      emoji: "🌐",
      helpText:
        "Check if your internet connection is working, or ask a grown-up for help.",
      encouragement:
        "While we wait, think about what you've learned about José so far!",
    },
    save: {
      title: "Your progress is playing hide and seek! 🙈",
      message:
        "We're having trouble saving your amazing progress. Let's try to find it again!",
      emoji: "💾",
      helpText:
        "Don't worry - we'll do our best to keep track of how well you're doing!",
      encouragement:
        "The most important thing is what you're learning in your brain!",
    },
    load: {
      title: "We're looking for your saved game! 🔍",
      message:
        "We can't find your saved progress right now, but we can start fresh and have fun!",
      emoji: "🎮",
      helpText:
        "Starting over means you get to practice what you learned again!",
      encouragement: "Practice makes perfect - José had to practice a lot too!",
    },
    validation: {
      title: "Let's check that answer together! ✅",
      message:
        "Something about your answer doesn't look quite right. Let's take another look!",
      emoji: "🤔",
      helpText:
        "Read the question carefully and think about what you know about José Rizal.",
      encouragement: "Making mistakes is how we learn - you're doing great!",
    },
  };

  const error = errorMessages[errorType] || errorMessages.general;

  return (
    <div
      className={`bg-gradient-to-r from-yellow-50 to-orange-100 border-l-4 border-yellow-400 rounded-xl p-6 ${className}`}
    >
      {/* Error Icon and Title */}
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{error.emoji}</span>
        <h3 className="text-lg font-bold text-yellow-800">{error.title}</h3>
      </div>

      {/* Error Message */}
      <p className="text-yellow-700 mb-4 leading-relaxed">{error.message}</p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            Try Again
          </button>
        )}

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <span className="mr-2">💡</span>
          {showHelp ? "Hide Help" : "Get Help"}
        </button>

        {onHelp && (
          <button
            onClick={onHelp}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <span className="mr-2">🆘</span>
            Ask for Help
          </button>
        )}
      </div>

      {/* Help Text */}
      {showHelp && (
        <div className="bg-white/70 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">💡</span>
            <h4 className="font-semibold text-gray-800">
              Here's how to fix it:
            </h4>
          </div>
          <p className="text-gray-700 text-sm mb-3">{error.helpText}</p>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-700 text-sm font-medium">
              {error.encouragement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Child-friendly help text component
export function ChildFriendlyHelp({
  topic = "general",
  gameType = "quiz",
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const helpContent = {
    quiz: {
      title: "How to Play Quiz Games! 🧠",
      shortHelp: "Read the question and pick the best answer!",
      detailedHelp: [
        "📖 Read the question carefully - take your time!",
        "👀 Look at all the answer choices before picking one",
        "🤔 Think about what you learned about José Rizal",
        "✨ Click on the answer you think is correct",
        "🎉 Don't worry if you get it wrong - you can try again!",
      ],
      tips: "Remember: José loved to read and learn new things every day!",
    },
    puzzle: {
      title: "How to Solve Puzzles! 🧩",
      shortHelp: "Drag the pieces to the right places!",
      detailedHelp: [
        "🔍 Look at all the puzzle pieces first",
        "🎯 Try to match pieces that look like they belong together",
        "🖱️ Click and drag pieces to move them around",
        "✅ When a piece is in the right place, it will stay there",
        "🌟 Keep trying until all pieces fit perfectly!",
      ],
      tips: "José was very patient when solving problems - be patient too!",
    },
    memory: {
      title: "How to Play Memory Games! 🧠",
      shortHelp: "Find matching pairs by remembering where they are!",
      detailedHelp: [
        "👆 Click on cards to flip them over",
        "👀 Try to remember what you see on each card",
        "🔄 Click on another card to find its match",
        "✨ When you find a match, both cards stay flipped!",
        "🏆 Find all the matches to win the game!",
      ],
      tips: "José had an amazing memory - practice will make yours better too!",
    },
    dragdrop: {
      title: "How to Drag and Drop! 🖱️",
      shortHelp: "Drag items to where they belong!",
      detailedHelp: [
        "👆 Click and hold on an item to pick it up",
        "🏃‍♂️ Drag it to where you think it belongs",
        "📍 Drop it by letting go of the mouse or lifting your finger",
        "✅ If it's correct, it will stay in place",
        "🔄 If not, you can try moving it somewhere else!",
      ],
      tips: "José was very organized - think about where things make the most sense!",
    },
  };

  const help = helpContent[gameType] || helpContent.quiz;

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-indigo-100 border-l-4 border-blue-400 rounded-xl p-4 ${className}`}
    >
      {/* Help Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🆘</span>
          <h4 className="font-bold text-blue-800">{help.title}</h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? "🔼" : "🔽"}
        </button>
      </div>

      {/* Short Help */}
      <p className="text-blue-700 mb-3">{help.shortHelp}</p>

      {/* Detailed Help */}
      {isExpanded && (
        <div className="space-y-3">
          <div className="bg-white/70 rounded-lg p-3">
            <h5 className="font-semibold text-blue-800 mb-2">Step by step:</h5>
            <ul className="space-y-1">
              {help.detailedHelp.map((step, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-700 flex items-start"
                >
                  <span className="mr-2 mt-0.5">{step.split(" ")[0]}</span>
                  <span>{step.substring(step.indexOf(" ") + 1)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <span className="text-lg mr-2">💡</span>
              <h6 className="font-semibold text-green-800">Helpful Tip:</h6>
            </div>
            <p className="text-sm text-green-700">{help.tips}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Encouraging messages for different situations
export function EncouragingMessage({
  situation = "trying",
  playerName = "friend",
  className = "",
}) {
  const messages = {
    trying: {
      emoji: "💪",
      title: "You're Doing Great!",
      message: `Keep trying, ${playerName}! Every attempt makes you smarter!`,
      color: "from-green-50 to-emerald-100 border-green-400",
    },
    struggling: {
      emoji: "🤗",
      title: "It's Okay to Find This Hard!",
      message: `Don't worry, ${playerName}! Even José Rizal had to practice a lot to become so smart!`,
      color: "from-yellow-50 to-amber-100 border-yellow-400",
    },
    success: {
      emoji: "🎉",
      title: "Amazing Work!",
      message: `Fantastic job, ${playerName}! José would be so proud of your hard work!`,
      color: "from-blue-50 to-indigo-100 border-blue-400",
    },
    learning: {
      emoji: "📚",
      title: "You're Learning So Much!",
      message: `Every question teaches you something new, ${playerName}! Keep being curious!`,
      color: "from-purple-50 to-violet-100 border-purple-400",
    },
  };

  const msg = messages[situation] || messages.trying;

  return (
    <div
      className={`bg-gradient-to-r ${msg.color} border-l-4 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{msg.emoji}</span>
        <div>
          <h4 className="font-bold text-gray-800 mb-1">{msg.title}</h4>
          <p className="text-gray-700 text-sm">{msg.message}</p>
        </div>
      </div>
    </div>
  );
}

export default {
  ChildFriendlyError,
  ChildFriendlyHelp,
  EncouragingMessage,
};
