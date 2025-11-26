import React, { useState } from "react";
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
  getBadgeClasses,
  getLoadingSpinner,
} from "../utils/designSystem";

/**
 * Design System Example Component
 * Demonstrates how to use the design system in a real game component
 * Requirements: 15.1, 15.2
 */
const DesignSystemExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setScore(100);
      setIsCompleted(true);
    }, 2000);
  };

  const handleReset = () => {
    setIsLoading(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div
          className={`${getCardClasses(
            "gradient",
            false,
            "p-6 mb-6"
          )} ${getAnimationClass("fadeIn")}`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Design System Example
          </h1>
          <p className="text-gray-600">
            A practical example of using the design system in a game component
          </p>
          <div className="flex gap-2 mt-4">
            <span className={getBadgeClasses("primary")}>Interactive</span>
            <span className={getBadgeClasses("success")}>Responsive</span>
            <span className={getBadgeClasses("info")}>Accessible</span>
          </div>
        </div>

        {/* Main Game Card */}
        <div
          className={`${getCardClasses(
            "default",
            false,
            "p-8"
          )} ${getAnimationClass("slideUp")}`}
        >
          {!isLoading && !isCompleted && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Ready to Start?
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to see the design system in action
              </p>
              <button
                className={getButtonClasses("primary", "lg")}
                onClick={handleStart}
              >
                Start Game
              </button>
            </div>
          )}

          {isLoading && (
            <div className={`text-center ${getAnimationClass("fadeIn")}`}>
              <div
                className={`${getLoadingSpinner("xl", "blue")} mx-auto mb-4`}
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we prepare your game
              </p>
            </div>
          )}

          {isCompleted && (
            <div className={getAnimationClass("scaleIn")}>
              <div
                className={`${getCardClasses(
                  "success",
                  false,
                  "p-6 mb-6"
                )} ${getAnimationClass("bounce")}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🏆</span>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-1">
                      Congratulations!
                    </h3>
                    <p className="text-green-700">
                      You've completed the example
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  className={getCardClasses(
                    "default",
                    false,
                    "p-4 text-center"
                  )}
                >
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-2xl font-bold text-gray-800">{score}</p>
                </div>
                <div
                  className={getCardClasses(
                    "default",
                    false,
                    "p-4 text-center"
                  )}
                >
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="text-sm text-gray-600 mb-1">Speed</p>
                  <p className="text-2xl font-bold text-gray-800">Fast</p>
                </div>
                <div
                  className={getCardClasses(
                    "default",
                    false,
                    "p-4 text-center"
                  )}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-gray-800">100%</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  className={getButtonClasses("success", "lg")}
                  onClick={() => alert("Next level would load here!")}
                >
                  Next Level
                </button>
                <button
                  className={getButtonClasses("secondary", "lg")}
                  onClick={handleReset}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div
            className={`${getCardClasses(
              "interactive",
              true,
              "p-6"
            )} ${getAnimationClass("slideUp")}`}
          >
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Consistent Design
            </h3>
            <p className="text-sm text-gray-600">
              All components follow the same design language
            </p>
          </div>

          <div
            className={`${getCardClasses(
              "interactive",
              true,
              "p-6"
            )} ${getAnimationClass("slideUp")}`}
          >
            <div className="text-3xl mb-3">♿</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Accessible
            </h3>
            <p className="text-sm text-gray-600">
              WCAG AA compliant with proper focus states
            </p>
          </div>

          <div
            className={`${getCardClasses(
              "interactive",
              true,
              "p-6"
            )} ${getAnimationClass("slideUp")}`}
          >
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Responsive
            </h3>
            <p className="text-sm text-gray-600">
              Works perfectly on all device sizes
            </p>
          </div>
        </div>

        {/* Button Showcase */}
        <div
          className={`${getCardClasses(
            "default",
            false,
            "p-6 mt-6"
          )} ${getAnimationClass("slideUp")}`}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Button Variants
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className={getButtonClasses("primary", "md")}>
              Primary
            </button>
            <button className={getButtonClasses("secondary", "md")}>
              Secondary
            </button>
            <button className={getButtonClasses("success", "md")}>
              Success
            </button>
            <button className={getButtonClasses("danger", "md")}>Danger</button>
            <button className={getButtonClasses("warning", "md")}>
              Warning
            </button>
            <button className={getButtonClasses("ghost", "md")}>Ghost</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemExample;
