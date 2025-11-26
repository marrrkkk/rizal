/**
 * AdminErrorMessage Component
 * Displays error messages with retry functionality
 */

const AdminErrorMessage = ({
  error,
  onRetry,
  title = "Error Loading Data",
  showDetails = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>

        {/* Error Message */}
        <p className="text-gray-600 mb-4">
          {typeof error === "string"
            ? error
            : "An unexpected error occurred while loading the data."}
        </p>

        {/* Error Details (if enabled) */}
        {showDetails && error && typeof error === "object" && (
          <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message || error.toString()}
            </p>
          </div>
        )}

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Try Again</span>
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Possible solutions:</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Make sure the database is properly initialized</li>
            <li>• Try logging out and logging back in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorMessage;
