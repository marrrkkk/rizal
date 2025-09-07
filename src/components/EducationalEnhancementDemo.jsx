import { useState, useEffect } from "react";
import {
  HintSystem,
  GameHints,
  EncouragingHints,
  ContextualHints,
} from "./HintSystem";
import {
  EducationalFact,
  KidsEducationalFact,
  ContextualEducationalContent,
} from "./EducationalFact";
import {
  ChildFriendlyError,
  ChildFriendlyHelp,
  EncouragingMessage,
} from "./ChildFriendlyMessages";
import {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
  CelebrationAnimation,
} from "./VisualFeedback";
import {
  EducationalGameManager,
  educationalEnhancementRegistry,
} from "../utils/educationalEnhancementIntegrator";
import {
  getRandomResponse,
  triggerHapticFeedback,
} from "../utils/childFriendlyInteractions";

/**
 * Educational Enhancement Demo Component
 * Demonstrates all educational features and how to integrate them
 */
export default function EducationalEnhancementDemo({
  username = "Student",
  onClose = () => {},
  gameType = "quiz",
  chapter = 1,
  level = 1,
}) {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [demoScore, setDemoScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [educationalManager] = useState(
    () =>
      new EducationalGameManager({
        gameType,
        playerAge: 8,
        difficulty: "medium",
      })
  );

  const demos = [
    {
      id: "hints",
      title: "Hint System Demo",
      description: "Shows how hints help children learn",
      component: "HintSystem",
    },
    {
      id: "facts",
      title: "Educational Facts Demo",
      description: "Displays interesting facts about José Rizal",
      component: "EducationalFact",
    },
    {
      id: "messages",
      title: "Child-Friendly Messages Demo",
      description: "Shows encouraging and helpful messages",
      component: "ChildFriendlyMessages",
    },
    {
      id: "feedback",
      title: "Visual Feedback Demo",
      description: "Demonstrates interactive visual feedback",
      component: "VisualFeedback",
    },
    {
      id: "integration",
      title: "Full Integration Demo",
      description: "Shows all features working together",
      component: "FullIntegration",
    },
  ];

  const currentDemoData = demos[currentDemo];

  const handleAnswer = (isCorrect) => {
    const result = educationalManager.handleAnswer(
      isCorrect ? "correct" : "incorrect",
      "correct",
      { explanation: "This is how educational feedback works!" }
    );

    setShowFeedback({
      type: isCorrect ? "success" : "error",
      message: result.feedback.message,
      duration: 2000,
    });

    if (isCorrect) {
      setDemoScore((prev) => prev + result.scoreGained);
    }

    setTimeout(() => setShowFeedback(null), 2000);
  };

  const handleHintUsed = (hint) => {
    const result = educationalManager.useHint(hint, { demoMode: true });
    setShowFeedback({
      type: "hint",
      message: result.message,
      duration: 2000,
    });
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const renderHintSystemDemo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">
          Basic Hint System
        </h3>
        <HintSystem
          hints={[
            "🤔 Think about what you learned about José Rizal",
            "📚 Remember his childhood in Calamba",
            "💡 Consider his family background",
          ]}
          onHintUsed={handleHintUsed}
          maxHints={3}
        />
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Game-Specific Hints
        </h3>
        <GameHints gameType="quiz" level={level} onHintUsed={handleHintUsed} />
      </div>

      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">
          Encouraging Hints
        </h3>
        <EncouragingHints difficulty="medium" onHintUsed={handleHintUsed} />
      </div>

      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-800 mb-4">
          Contextual Hints
        </h3>
        <ContextualHints
          gameType="quiz"
          currentScore={demoScore}
          attempts={2}
          onHintUsed={handleHintUsed}
        />
      </div>
    </div>
  );

  const renderEducationalFactDemo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">
          Random Educational Fact
        </h3>
        <EducationalFact showRandomFact={true} />
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Kids-Friendly Facts
        </h3>
        <KidsEducationalFact topic="childhood" showAnimation={true} />
      </div>

      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">
          Contextual Educational Content
        </h3>
        <ContextualEducationalContent
          gameType="quiz"
          level={level}
          chapter={chapter}
          playerProgress={75}
        />
      </div>
    </div>
  );

  const renderChildFriendlyMessagesDemo = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">
          Child-Friendly Error
        </h3>
        <ChildFriendlyError
          errorType="general"
          onRetry={() => console.log("Retry clicked")}
          onHelp={() => console.log("Help clicked")}
        />
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">Game Help</h3>
        <ChildFriendlyHelp gameType="quiz" />
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Encouraging Messages
        </h3>
        <div className="space-y-3">
          <EncouragingMessage situation="trying" playerName={username} />
          <EncouragingMessage situation="success" playerName={username} />
          <EncouragingMessage situation="learning" playerName={username} />
        </div>
      </div>
    </div>
  );

  const renderVisualFeedbackDemo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">
          Interactive Buttons
        </h3>
        <div className="flex flex-wrap gap-3">
          <FeedbackButton variant="primary" onClick={() => handleAnswer(true)}>
            Correct Answer! 🎉
          </FeedbackButton>
          <FeedbackButton variant="warning" onClick={() => handleAnswer(false)}>
            Wrong Answer 🤔
          </FeedbackButton>
          <FeedbackButton
            variant="success"
            onClick={() => triggerHapticFeedback("celebration")}
          >
            Celebration! 🏆
          </FeedbackButton>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Animated Progress
        </h3>
        <AnimatedProgress current={demoScore} total={100} showEmoji={true} />
      </div>

      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">
          Celebration Animation
        </h3>
        <div className="text-center">
          <FeedbackButton
            variant="primary"
            onClick={() =>
              setShowFeedback({
                type: "celebration",
                message: "Amazing work!",
                duration: 3000,
              })
            }
          >
            Trigger Celebration! 🎊
          </FeedbackButton>
        </div>
      </div>
    </div>
  );

  const renderFullIntegrationDemo = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Complete Educational Game Experience
        </h3>

        {/* Sample Quiz Question */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Sample Question:</h4>
          <p className="text-gray-700 mb-4">When was José Rizal born?</p>

          <div className="grid grid-cols-1 gap-2 mb-4">
            <FeedbackButton
              variant="primary"
              onClick={() => handleAnswer(true)}
              className="text-left"
            >
              June 19, 1861 ✓
            </FeedbackButton>
            <FeedbackButton
              variant="secondary"
              onClick={() => handleAnswer(false)}
              className="text-left"
            >
              July 19, 1861
            </FeedbackButton>
          </div>
        </div>

        {/* Educational Enhancements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Hints Available:
            </h4>
            <HintSystem
              hints={[
                "Think about summer months",
                "It's in June",
                "The 19th day",
              ]}
              maxHints={2}
              onHintUsed={handleHintUsed}
            />
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Educational Fact:
            </h4>
            <KidsEducationalFact topic="childhood" />
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Your Progress:</h4>
          <AnimatedProgress current={demoScore} total={100} />

          <div className="mt-3 text-sm text-gray-600">
            <p>Score: {demoScore} points</p>
            <p>Hints Used: {educationalManager.hintsUsed}</p>
            <p>Attempts: {educationalManager.attempts}</p>
          </div>
        </div>
      </div>

      {/* Integration Code Example */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Integration Code Example:
        </h3>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
          {`// Import educational components
import { HintSystem } from './components/HintSystem';
import { EducationalFact } from './components/EducationalFact';
import { ChildFriendlyError } from './components/ChildFriendlyMessages';
import { VisualFeedback } from './components/VisualFeedback';

// Use in your game component
function MyGame() {
  return (
    <div>
      {/* Your game content */}
      
      {/* Add educational enhancements */}
      <HintSystem hints={gameHints} onHintUsed={handleHint} />
      <EducationalFact topic="childhood" />
      <VisualFeedback type="success" message="Great job!" />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );

  const renderCurrentDemo = () => {
    switch (currentDemoData.component) {
      case "HintSystem":
        return renderHintSystemDemo();
      case "EducationalFact":
        return renderEducationalFactDemo();
      case "ChildFriendlyMessages":
        return renderChildFriendlyMessagesDemo();
      case "VisualFeedback":
        return renderVisualFeedbackDemo();
      case "FullIntegration":
        return renderFullIntegrationDemo();
      default:
        return <div>Demo not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Visual Feedback Overlay */}
      {showFeedback && (
        <VisualFeedback
          type={showFeedback.type}
          message={showFeedback.message}
          duration={showFeedback.duration}
          onComplete={() => setShowFeedback(null)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🎓 Educational Enhancement Demo
              </h1>
              <p className="text-gray-600">
                Explore all the child-friendly features that make learning about
                José Rizal fun!
              </p>
            </div>
            <FeedbackButton variant="secondary" onClick={onClose}>
              Close Demo
            </FeedbackButton>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {demos.map((demo, index) => (
              <button
                key={demo.id}
                onClick={() => setCurrentDemo(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentDemo === index
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Demo */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentDemoData.title}
            </h2>
            <p className="text-gray-600">{currentDemoData.description}</p>
          </div>

          {renderCurrentDemo()}
        </div>

        {/* Integration Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mt-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Educational Enhancement Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-semibold text-green-800">Hint Systems</h4>
              <p className="text-sm text-green-600">
                Fully implemented across all game types
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-semibold text-blue-800">Educational Facts</h4>
              <p className="text-sm text-blue-600">
                Age-appropriate content for all chapters
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-semibold text-purple-800">
                Child-Friendly Messages
              </h4>
              <p className="text-sm text-purple-600">
                Encouraging and supportive feedback
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2">
              🎯 Implementation Complete!
            </h4>
            <p className="text-sm text-orange-700">
              All educational enhancements have been successfully integrated
              into the José Rizal learning app. Children now have access to
              hints, educational facts, child-friendly error messages, and
              engaging visual feedback throughout their learning journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
