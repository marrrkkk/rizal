import React from "react";
import { filipinoTheme } from "../theme/theme";
import {
  handleChildFriendlyError,
  getRandomResponse,
} from "../utils/childFriendlyInteractions";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("Game Error Caught by ErrorBoundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    } else {
      // Default navigation - go back in history
      window.history.back();
    }
  };

  render() {
    if (this.state.hasError) {
      // Get child-friendly error message
      const friendlyError = handleChildFriendlyError({
        type: "general",
        message: this.state.error?.message,
      });
      const encouragement = getRandomResponse("encouragement");

      // Fallback UI with child-friendly messaging
      return (
        <div
          className={`min-h-screen w-full bg-gradient-to-br ${filipinoTheme.colors.backgrounds.chapter1} flex items-center justify-center p-6`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="text-6xl mb-6">{friendlyError.emoji}</div>

            {/* Error Title */}
            <h1
              className={`text-3xl font-bold mb-4 ${filipinoTheme.colors.text.primary}`}
            >
              {friendlyError.title}
            </h1>

            {/* Error Message */}
            <p
              className={`text-lg mb-6 ${filipinoTheme.colors.text.secondary}`}
            >
              {friendlyError.message}
            </p>

            {/* Child-friendly explanation */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <div className="text-4xl mb-3">🔧</div>
              <h3
                className={`text-lg font-semibold mb-2 ${filipinoTheme.colors.text.primary}`}
              >
                What happened?
              </h3>
              <p className={`text-sm ${filipinoTheme.colors.text.secondary}`}>
                The learning game had a little hiccup and needs to restart. This
                is totally normal - even the best games need a break sometimes!
              </p>
            </div>

            {/* Action Buttons with child-friendly labels */}
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className={`w-full bg-gradient-to-r ${filipinoTheme.colors.primary.blue} text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 ${filipinoTheme.transitions.normal} ${filipinoTheme.shadows.lg} hover:shadow-xl transform hover:-translate-y-0.5 text-lg`}
              >
                🔄 Let's Try Again!
              </button>

              <button
                onClick={this.handleGoBack}
                className={`w-full bg-gradient-to-r ${filipinoTheme.colors.gradients.warning} text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 ${filipinoTheme.transitions.normal} ${filipinoTheme.shadows.lg} hover:shadow-xl transform hover:-translate-y-0.5 text-lg`}
              >
                🏠 Go Back Home
              </button>
            </div>

            {/* Encouraging message with José Rizal connection */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-l-4 border-green-400">
              <div className="text-3xl mb-3">🌟</div>
              <p
                className={`text-base font-medium ${filipinoTheme.colors.text.primary} mb-2`}
              >
                Remember what José Rizal taught us:
              </p>
              <p className="text-green-700 italic">
                "Never give up when things get difficult - every challenge makes
                us stronger and smarter!"
              </p>
            </div>

            {/* Fun fact to keep learning spirit alive */}
            <div className="mt-6 bg-purple-50 rounded-2xl p-4">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-sm text-purple-700">
                <strong>Did you know?</strong> José Rizal faced many challenges
                while writing his books, but he never gave up. That's how he
                became our national hero!
              </p>
            </div>

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  🔍 Debug Information (Development Only)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong>{" "}
                    {this.state.error && this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
