/**
 * Design System Demo Component
 * Demonstrates all design system utilities and components
 * For testing and reference purposes
 */

import React, { useState } from "react";
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
  getBadgeClasses,
  getInputClasses,
  getLoadingSpinner,
  spacing,
  transitions,
  shadows,
} from "../utils/designSystem";
import {
  getInteractiveFeedback,
  getSuccessClasses,
  getErrorClasses,
  getWarningClasses,
  showSuccessFeedback,
  showErrorFeedback,
} from "../utils/interactiveFeedback";
import {
  getFocusRing,
  getTouchTarget,
  getAccessibleColors,
  announceToScreenReader,
} from "../utils/accessibility";
import {
  getContainer,
  getGrid,
  getFlex,
  getTextSize,
  getMobileClass,
  getVisibility,
} from "../utils/responsiveDesign";

const DesignSystemDemo = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuccessDemo = () => {
    setShowSuccess(true);
    announceToScreenReader("Success! Operation completed successfully.");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleErrorDemo = () => {
    setShowError(true);
    announceToScreenReader("Error! Something went wrong.");
    setTimeout(() => setShowError(false), 3000);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    announceToScreenReader("Loading, please wait.");
    setTimeout(() => {
      setLoading(false);
      announceToScreenReader("Loading complete.");
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12`}
    >
      <div className={getContainer("xl")}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`${getTextSize(
              "3xl",
              true
            )} font-black text-gray-900 mb-4`}
          >
            Design System Demo
          </h1>
          <p className={`${getTextSize("lg")} text-gray-600`}>
            Comprehensive UI components and utilities
          </p>
        </div>

        {/* Button Variants */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Button Variants
          </h2>
          <div className={getFlex("colToRow", "start", "md")}>
            <button className={getButtonClasses("primary", "md")}>
              Primary Button
            </button>
            <button className={getButtonClasses("secondary", "md")}>
              Secondary Button
            </button>
            <button className={getButtonClasses("success", "md")}>
              Success Button
            </button>
            <button className={getButtonClasses("danger", "md")}>
              Danger Button
            </button>
            <button className={getButtonClasses("warning", "md")}>
              Warning Button
            </button>
            <button className={getButtonClasses("ghost", "md")}>
              Ghost Button
            </button>
          </div>
        </section>

        {/* Button Sizes */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Button Sizes
          </h2>
          <div className={getFlex("colToRow", "center", "md")}>
            <button className={getButtonClasses("primary", "xs")}>
              Extra Small
            </button>
            <button className={getButtonClasses("primary", "sm")}>Small</button>
            <button className={getButtonClasses("primary", "md")}>
              Medium
            </button>
            <button className={getButtonClasses("primary", "lg")}>Large</button>
            <button className={getButtonClasses("primary", "xl")}>
              Extra Large
            </button>
          </div>
        </section>

        {/* Card Variants */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Card Variants
          </h2>
          <div className={getGrid(3, "md")}>
            <div className={`${getCardClasses("default")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Default Card</h3>
              <p className="text-gray-600">Standard card with shadow</p>
            </div>
            <div className={`${getCardClasses("elevated")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Elevated Card</h3>
              <p className="text-gray-600">Card with larger shadow</p>
            </div>
            <div className={`${getCardClasses("interactive")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Interactive Card</h3>
              <p className="text-gray-600">Hover to see effect</p>
            </div>
            <div className={`${getCardClasses("success")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Success Card</h3>
              <p className="text-green-700">Success state styling</p>
            </div>
            <div className={`${getCardClasses("warning")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Warning Card</h3>
              <p className="text-yellow-700">Warning state styling</p>
            </div>
            <div className={`${getCardClasses("error")} p-6`}>
              <h3 className="font-bold text-lg mb-2">Error Card</h3>
              <p className="text-red-700">Error state styling</p>
            </div>
          </div>
        </section>

        {/* Interactive Feedback */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Interactive Feedback
          </h2>
          <div className={getFlex("colToRow", "start", "md")}>
            <button
              onClick={handleSuccessDemo}
              className={getButtonClasses("success", "md")}
            >
              Show Success
            </button>
            <button
              onClick={handleErrorDemo}
              className={getButtonClasses("danger", "md")}
            >
              Show Error
            </button>
            <button
              onClick={handleLoadingDemo}
              className={getButtonClasses("primary", "md")}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className={getLoadingSpinner("sm", "white")} />
                  Loading...
                </span>
              ) : (
                "Show Loading"
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          <div className="mt-6 space-y-4">
            {showSuccess && (
              <div
                className={`${getSuccessClasses("alert")} ${getAnimationClass(
                  "slideDown"
                )}`}
              >
                <strong>Success!</strong> Operation completed successfully.
              </div>
            )}
            {showError && (
              <div
                className={`${getErrorClasses("alert")} ${getAnimationClass(
                  "slideDown"
                )}`}
              >
                <strong>Error!</strong> Something went wrong.
              </div>
            )}
          </div>
        </section>

        {/* Badges */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Badges
          </h2>
          <div className={getFlex("colToRow", "start", "md")}>
            <span className={getBadgeClasses("default")}>Default</span>
            <span className={getBadgeClasses("primary")}>Primary</span>
            <span className={getBadgeClasses("success")}>Success</span>
            <span className={getBadgeClasses("warning")}>Warning</span>
            <span className={getBadgeClasses("danger")}>Danger</span>
            <span className={getBadgeClasses("info")}>Info</span>
          </div>
        </section>

        {/* Form Inputs */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Form Inputs
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Input
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className={getInputClasses("default")}
                aria-label="Default input field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Error Input
              </label>
              <input
                type="text"
                placeholder="Invalid input..."
                className={getInputClasses("error")}
                aria-label="Error input field"
                aria-invalid="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Success Input
              </label>
              <input
                type="text"
                placeholder="Valid input..."
                className={getInputClasses("success")}
                aria-label="Success input field"
              />
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className={`${getCardClasses("info")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-blue-900 mb-6`}>
            Accessibility Features
          </h2>
          <div className="space-y-4 text-blue-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>WCAG AA compliant color contrast ratios</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Minimum 44x44px touch targets for mobile</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Keyboard navigation with visible focus states</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Screen reader announcements for state changes</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>ARIA labels and semantic HTML</span>
            </div>
          </div>
        </section>

        {/* Responsive Grid */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Responsive Grid
          </h2>
          <div className={getGrid(4, "md")}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div
                key={num}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-lg text-center font-bold"
              >
                Item {num}
              </div>
            ))}
          </div>
        </section>

        {/* Animations */}
        <section className={`${getCardClasses("default")} ${spacing.xl} mb-8`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Animations
          </h2>
          <div className={getGrid(3, "md")}>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "fadeIn"
              )}`}
            >
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-bold">Fade In</h3>
            </div>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "slideUp"
              )}`}
            >
              <div className="text-4xl mb-2">⬆️</div>
              <h3 className="font-bold">Slide Up</h3>
            </div>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "scaleIn"
              )}`}
            >
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold">Scale In</h3>
            </div>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "bounce"
              )}`}
            >
              <div className="text-4xl mb-2">🎈</div>
              <h3 className="font-bold">Bounce</h3>
            </div>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "pulse"
              )}`}
            >
              <div className="text-4xl mb-2">💓</div>
              <h3 className="font-bold">Pulse</h3>
            </div>
            <div
              className={`${getCardClasses("default")} p-6 ${getAnimationClass(
                "wiggle"
              )}`}
            >
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-bold">Wiggle</h3>
            </div>
          </div>
        </section>

        {/* Touch Targets */}
        <section className={`${getCardClasses("default")} ${spacing.xl}`}>
          <h2 className={`${getTextSize("2xl")} font-bold text-gray-900 mb-6`}>
            Touch-Friendly Targets
          </h2>
          <div className={getFlex("colToRow", "start", "md")}>
            <button
              className={`${getButtonClasses("primary", "md")} ${getTouchTarget(
                "recommended"
              )}`}
            >
              Touch Target
            </button>
            <button
              className={`${getButtonClasses("success", "md")} ${getTouchTarget(
                "large"
              )}`}
            >
              Large Touch Target
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            All interactive elements meet WCAG 2.1 minimum touch target size of
            44x44px
          </p>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
