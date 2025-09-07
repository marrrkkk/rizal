import { useState, useEffect } from "react";

const ProgressBar = ({
  current,
  total,
  theme = "blue",
  showLabels = true,
  animated = true,
  size = "medium",
  showPercentage = true,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(percentage);
    }
  }, [percentage, animated]);

  const themeClasses = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-indigo-600",
    orange: "from-orange-500 to-amber-600",
    red: "from-red-500 to-pink-600",
    yellow: "from-yellow-400 to-orange-500",
  };

  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4",
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-800">
              {displayProgress}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}
      >
        <div
          className={`bg-gradient-to-r ${themeClasses[theme]} ${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${displayProgress}%` }}
        >
          {animated && displayProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>

      {showLabels && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {current} of {total} completed
          </span>
          {percentage === 100 && (
            <span className="text-xs font-medium text-green-600 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Complete!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
