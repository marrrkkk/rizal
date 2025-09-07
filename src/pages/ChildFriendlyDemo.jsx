import { useState } from "react";
import {
  ChildFriendlyError,
  ChildFriendlyHelp,
  EncouragingMessage,
} from "../components/ChildFriendlyMessages";
import {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
  CelebrationAnimation,
} from "../components/VisualFeedback";
import {
  KidsEducationalFact,
  ContextualEducationalContent,
} from "../components/EducationalFact";
import { ContextualHints, EncouragingHints } from "../components/HintSystem";

export default function ChildFriendlyDemo() {
  const [showError, setShowError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [progress, setProgress] = useState(3);
  const [attempts, setAttempts] = useState(0);

  const handleTestError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const handleTestFeedback = () => {
    setShowFeedback(true);
  };

  const handleTestCelebration = () => {
    setShowCelebration(true);
  };

  const handleIncreaseProgress = () => {
    setProgress((prev) => Math.min(prev + 1, 10));
  };

  const handleIncreaseAttempts = () => {
    setAttempts((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 Child-Friendly Features Demo
          </h1>
          <p className="text-lg text-gray-600">
            Demonstrating educational enhancements and child-friendly
            interactions
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎮 Try the Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeedbackButton onClick={handleTestError} variant="danger">
              🚨 Test Error Message
            </FeedbackButton>
            <FeedbackButton onClick={handleTestFeedback} variant="success">
              ✨ Test Visual Feedback
            </FeedbackButton>
            <FeedbackButton onClick={handleTestCelebration} variant="primary">
              🎉 Test Celebration
            </FeedbackButton>
            <FeedbackButton
              onClick={handleIncreaseProgress}
              variant="secondary"
            >
              📈 Increase Progress
            </FeedbackButton>
          </div>
          <div className="mt-4 flex gap-4">
            <FeedbackButton onClick={handleIncreaseAttempts} size="small">
              🔄 Add Attempt ({attempts})
            </FeedbackButton>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Encouraging Messages */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💪 Encouraging Messages
              </h3>
              <div className="space-y-4">
                <EncouragingMessage
                  situation="success"
                  playerName="Demo User"
                />
                <EncouragingMessage situation="trying" playerName="Demo User" />
                <EncouragingMessage
                  situation="struggling"
                  playerName="Demo User"
                />
              </div>
            </div>

            {/* Educational Facts */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📚 Educational Content
              </h3>
              <div className="space-y-4">
                <KidsEducationalFact topic="childhood" />
                <KidsEducationalFact topic="family" />
                <ContextualEducationalContent
                  gameType="quiz"
                  level={1}
                  chapter={1}
                  playerProgress={progress * 10}
                />
              </div>
            </div>

            {/* Progress Display */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📊 Progress Tracking
              </h3>
              <AnimatedProgress current={progress} total={10} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Hint Systems */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💡 Hint Systems
              </h3>
              <div className="space-y-4">
                <ContextualHints
                  gameType="quiz"
                  currentScore={75}
                  attempts={attempts}
                  onHintUsed={() => console.log("Hint used!")}
                />
                <EncouragingHints
                  difficulty="medium"
                  onHintUsed={() => console.log("Encouraging hint used!")}
                />
              </div>
            </div>

            {/* Help System */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🆘 Help System
              </h3>
              <ChildFriendlyHelp gameType="quiz" />
            </div>

            {/* Error Handling Demo */}
            {showError && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🚨 Error Handling
                </h3>
                <ChildFriendlyError
                  errorType="network"
                  onRetry={() => setShowError(false)}
                  onHelp={() => console.log("Help requested!")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-l-4 border-green-400">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            🌟 Child-Friendly Features Implemented
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <h4 className="font-semibold mb-2">✅ Hint Systems:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Encouraging messages with emojis</li>
                <li>• Contextual hints based on performance</li>
                <li>• José Rizal-themed encouragement</li>
                <li>• Age-appropriate language</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Educational Content:</h4>
              <ul className="space-y-1 ml-4">
                <li>• "Did You Know?" sections</li>
                <li>• Child-friendly fact presentation</li>
                <li>• Contextual learning content</li>
                <li>• Interactive fact rotation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Error Messages:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Age-appropriate error explanations</li>
                <li>• Encouraging recovery messages</li>
                <li>• José Rizal inspirational quotes</li>
                <li>• Visual help and guidance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ Visual Feedback:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Animated progress indicators</li>
                <li>• Celebration animations</li>
                <li>• Haptic feedback patterns</li>
                <li>• Interactive button responses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visual Feedback Overlay */}
        {showFeedback && (
          <VisualFeedback
            type="success"
            message="🎉 Great job testing the visual feedback system!"
            duration={3000}
            onComplete={() => setShowFeedback(false)}
          />
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <CelebrationAnimation
            type="confetti"
            duration={3000}
            onComplete={() => setShowCelebration(false)}
          />
        )}
      </div>
    </div>
  );
}
