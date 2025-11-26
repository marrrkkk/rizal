/**
 * Interactive Feedback Demo Component
 * Demonstrates all interactive feedback features
 * For testing and reference purposes
 */

import React, { useState } from "react";
import {
  InteractiveButton,
  InteractiveCard,
  LoadingSpinner,
  LoadingDots,
  LoadingOverlay,
  SuccessMessage,
  ErrorMessage,
  WarningMessage,
  InfoMessage,
  ProgressBar,
  SkeletonLoader,
} from "./InteractiveFeedback";

const InteractiveFeedbackDemo = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buttonStates, setButtonStates] = useState({
    success: false,
    error: false,
    loading: false,
  });

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleProgressDemo = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleButtonStateDemo = (state) => {
    setButtonStates({ ...buttonStates, [state]: true });
    setTimeout(() => {
      setButtonStates({ ...buttonStates, [state]: false });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            Interactive Feedback Demo
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive showcase of all interactive feedback features
          </p>
        </div>

        {/* Button Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Button Variants with Hover Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InteractiveButton
              variant="primary"
              onClick={() => alert("Primary clicked!")}
            >
              Primary Button
            </InteractiveButton>
            <InteractiveButton
              variant="secondary"
              onClick={() => alert("Secondary clicked!")}
            >
              Secondary Button
            </InteractiveButton>
            <InteractiveButton
              variant="success"
              onClick={() => alert("Success clicked!")}
            >
              Success Button
            </InteractiveButton>
            <InteractiveButton
              variant="danger"
              onClick={() => alert("Danger clicked!")}
            >
              Danger Button
            </InteractiveButton>
            <InteractiveButton
              variant="warning"
              onClick={() => alert("Warning clicked!")}
            >
              Warning Button
            </InteractiveButton>
            <InteractiveButton
              variant="ghost"
              onClick={() => alert("Ghost clicked!")}
            >
              Ghost Button
            </InteractiveButton>
          </div>
        </section>

        {/* Button Sizes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Button Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <InteractiveButton size="xs">Extra Small</InteractiveButton>
            <InteractiveButton size="sm">Small</InteractiveButton>
            <InteractiveButton size="md">Medium</InteractiveButton>
            <InteractiveButton size="lg">Large</InteractiveButton>
            <InteractiveButton size="xl">Extra Large</InteractiveButton>
          </div>
        </section>

        {/* Button States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Button States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InteractiveButton
              loading={buttonStates.loading}
              onClick={() => handleButtonStateDemo("loading")}
            >
              Loading State
            </InteractiveButton>
            <InteractiveButton
              success={buttonStates.success}
              onClick={() => handleButtonStateDemo("success")}
            >
              Success State
            </InteractiveButton>
            <InteractiveButton
              error={buttonStates.error}
              onClick={() => handleButtonStateDemo("error")}
            >
              Error State
            </InteractiveButton>
            <InteractiveButton disabled>Disabled State</InteractiveButton>
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Interactive Cards with Hover Effects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InteractiveCard onClick={() => alert("Default card clicked!")}>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Default Card</h3>
                <p className="text-gray-600">Hover to see lift effect</p>
              </div>
            </InteractiveCard>
            <InteractiveCard
              variant="success"
              onClick={() => alert("Success card clicked!")}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Success Card</h3>
                <p className="text-green-700">With success styling</p>
              </div>
            </InteractiveCard>
            <InteractiveCard
              variant="error"
              onClick={() => alert("Error card clicked!")}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Error Card</h3>
                <p className="text-red-700">With error styling</p>
              </div>
            </InteractiveCard>
            <InteractiveCard
              variant="warning"
              onClick={() => alert("Warning card clicked!")}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Warning Card</h3>
                <p className="text-yellow-700">With warning styling</p>
              </div>
            </InteractiveCard>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Loading Indicators
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Spinner</h3>
                <LoadingSpinner size="lg" color="blue" text="Loading..." />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Dots</h3>
                <div className="flex justify-center items-center h-24">
                  <LoadingDots color="blue" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Overlay</h3>
                <div className="relative h-24 bg-gray-100 rounded-lg">
                  <InteractiveButton onClick={handleLoadingDemo}>
                    Show Loading Overlay
                  </InteractiveButton>
                  <LoadingOverlay show={loading} message="Processing..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Progress Bars
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Animated Progress</h3>
              <ProgressBar progress={progress} variant="primary" />
              <InteractiveButton onClick={handleProgressDemo} className="mt-4">
                Start Progress Demo
              </InteractiveButton>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Success Progress</h3>
              <ProgressBar progress={75} variant="success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Warning Progress</h3>
              <ProgressBar progress={50} variant="warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Indeterminate Progress
              </h3>
              <ProgressBar indeterminate variant="primary" showLabel={false} />
            </div>
          </div>
        </section>

        {/* Messages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Status Messages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InteractiveButton
              onClick={() => setShowSuccess(true)}
              variant="success"
            >
              Show Success Message
            </InteractiveButton>
            <InteractiveButton
              onClick={() => setShowError(true)}
              variant="danger"
            >
              Show Error Message
            </InteractiveButton>
            <InteractiveButton
              onClick={() => setShowWarning(true)}
              variant="warning"
            >
              Show Warning Message
            </InteractiveButton>
            <InteractiveButton onClick={() => setShowInfo(true)}>
              Show Info Message
            </InteractiveButton>
          </div>
          <div className="mt-6 space-y-4">
            {showSuccess && (
              <SuccessMessage
                message="Operation completed successfully!"
                onClose={() => setShowSuccess(false)}
              />
            )}
            {showError && (
              <ErrorMessage
                message="An error occurred. Please try again."
                onClose={() => setShowError(false)}
              />
            )}
            {showWarning && (
              <WarningMessage
                message="Warning: This action cannot be undone."
                onClose={() => setShowWarning(false)}
              />
            )}
            {showInfo && (
              <InfoMessage
                message="Here's some helpful information for you."
                onClose={() => setShowInfo(false)}
              />
            )}
          </div>
        </section>

        {/* Skeleton Loaders */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Skeleton Loaders
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Text Skeleton</h3>
                <SkeletonLoader variant="text" count={3} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Card Skeleton</h3>
                <SkeletonLoader variant="card" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Avatar Skeleton</h3>
                <div className="flex items-center space-x-4">
                  <SkeletonLoader variant="avatar" />
                  <div className="flex-1">
                    <SkeletonLoader variant="title" />
                    <SkeletonLoader variant="text" className="mt-2" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Button Skeleton</h3>
                <SkeletonLoader variant="button" />
              </div>
            </div>
          </div>
        </section>

        {/* Hover Effects Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Hover Effects Showcase
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md interactive-hover text-center">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm font-medium">Lift Effect</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-200 text-center cursor-pointer">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm font-medium">Scale Effect</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:brightness-110 transition-all duration-200 text-center cursor-pointer">
              <div className="text-4xl mb-2">💡</div>
              <p className="text-sm font-medium">Brighten Effect</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md button-glow text-center cursor-pointer">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-sm font-medium">Glow Effect</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InteractiveFeedbackDemo;
