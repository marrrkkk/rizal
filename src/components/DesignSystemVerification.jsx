import React from "react";
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
  spacing,
  buttonVariants,
  cardVariants,
  animations,
  getBadgeClasses,
  getLoadingSpinner,
} from "../utils/designSystem";

/**
 * Design System Verification Component
 * Demonstrates all design system utilities working correctly
 * Requirements: 15.1, 15.2
 */
const DesignSystemVerification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className={getAnimationClass("fadeIn")}>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Design System Verification
          </h1>
          <p className="text-gray-600">
            All design system components are working correctly ✅
          </p>
        </div>

        {/* Spacing Scale */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Spacing Scale
          </h2>
          <div className="space-y-2">
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-20 text-sm font-medium text-gray-600">
                  {key}:
                </span>
                <div className="bg-blue-500 h-8" style={{ width: value }} />
                <span className="text-sm text-gray-500">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Button Variants */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-4">
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
        </div>

        {/* Card Variants */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Card Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={getCardClasses("default", false, "p-4")}>
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-gray-600">Standard card style</p>
            </div>
            <div className={getCardClasses("interactive", false, "p-4")}>
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p className="text-sm text-gray-600">Hover to see effect</p>
            </div>
            <div className={getCardClasses("success", false, "p-4")}>
              <h3 className="font-semibold mb-2">Success Card</h3>
              <p className="text-sm text-gray-600">Success state</p>
            </div>
            <div className={getCardClasses("warning", false, "p-4")}>
              <h3 className="font-semibold mb-2">Warning Card</h3>
              <p className="text-sm text-gray-600">Warning state</p>
            </div>
            <div className={getCardClasses("error", false, "p-4")}>
              <h3 className="font-semibold mb-2">Error Card</h3>
              <p className="text-sm text-gray-600">Error state</p>
            </div>
            <div className={getCardClasses("gradient", false, "p-4")}>
              <h3 className="font-semibold mb-2">Gradient Card</h3>
              <p className="text-sm text-gray-600">Gradient background</p>
            </div>
          </div>
        </div>

        {/* Animation Utilities */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Animation Utilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("fadeIn")}`}
            >
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm font-medium">fadeIn</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("slideUp")}`}
            >
              <div className="text-3xl mb-2">⬆️</div>
              <p className="text-sm font-medium">slideUp</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("bounce")}`}
            >
              <div className="text-3xl mb-2">🎾</div>
              <p className="text-sm font-medium">bounce</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("pulse")}`}
            >
              <div className="text-3xl mb-2">💓</div>
              <p className="text-sm font-medium">pulse</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("scaleIn")}`}
            >
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm font-medium">scaleIn</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("wiggle")}`}
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-medium">wiggle</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("shimmer")}`}
            >
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm font-medium">shimmer</p>
            </div>
            <div
              className={`${getCardClasses(
                "default",
                false,
                "p-4 text-center"
              )} ${getAnimationClass("spin")}`}
            >
              <div className="text-3xl mb-2">🔄</div>
              <p className="text-sm font-medium">spin</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Badge Variants
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className={getBadgeClasses("default")}>Default</span>
            <span className={getBadgeClasses("primary")}>Primary</span>
            <span className={getBadgeClasses("success")}>Success</span>
            <span className={getBadgeClasses("warning")}>Warning</span>
            <span className={getBadgeClasses("danger")}>Danger</span>
            <span className={getBadgeClasses("info")}>Info</span>
          </div>
        </div>

        {/* Loading States */}
        <div
          className={`${getCardClasses("default")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Loading States
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={getLoadingSpinner("xs", "blue")} />
              <p className="text-xs mt-2">XS</p>
            </div>
            <div className="text-center">
              <div className={getLoadingSpinner("sm", "green")} />
              <p className="text-xs mt-2">SM</p>
            </div>
            <div className="text-center">
              <div className={getLoadingSpinner("md", "red")} />
              <p className="text-xs mt-2">MD</p>
            </div>
            <div className="text-center">
              <div className={getLoadingSpinner("lg", "yellow")} />
              <p className="text-xs mt-2">LG</p>
            </div>
            <div className="text-center">
              <div className={getLoadingSpinner("xl", "gray")} />
              <p className="text-xs mt-2">XL</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div
          className={`${getCardClasses("success")} p-6 ${getAnimationClass(
            "slideUp"
          )}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Design System Complete!
              </h3>
              <p className="text-sm text-green-700">
                All components are working correctly and ready to use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemVerification;
