/**
 * Interactive Feedback Components
 * Reusable components for hover, click, success, error, and loading states
 * Implements Requirement 15.2
 */

import React, { useState, useEffect } from "react";
import {
  getButtonHover,
  getInteractiveFeedback,
  getSuccessClasses,
  getErrorClasses,
  getWarningClasses,
  getInfoClasses,
  getLoadingSpinner,
  addRippleEffect,
} from "../utils/interactiveFeedback";
import { getFocusClasses } from "../utils/interactiveFeedback";

/**
 * Interactive Button with enhanced feedback
 */
export const InteractiveButton = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  success = false,
  error = false,
  className = "",
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Add ripple effect
    addRippleEffect(e);

    // Add click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);

    if (onClick) onClick(e);
  };

  const getVariantClasses = () => {
    if (success) return getSuccessClasses("button");
    if (error) return getErrorClasses("button");

    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
      secondary: "bg-white border-2 border-blue-500 text-blue-600",
      success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
      ghost: "bg-transparent text-gray-700",
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: "px-3 py-1.5 text-xs rounded-md",
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-lg",
      lg: "px-8 py-4 text-lg rounded-xl",
      xl: "px-10 py-5 text-xl rounded-xl",
    };
    return sizes[size] || sizes.md;
  };

  return (
    <button
      className={`
        relative overflow-hidden font-semibold
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getButtonHover(variant)}
        ${getFocusClasses()}
        ${
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${isClicked ? "click-scale" : ""}
        ${success ? "success-flash" : ""}
        ${error ? "error-shake" : ""}
        transition-all duration-200
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className={getLoadingSpinner("sm", "white")} />
          <span className="ml-2">Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Interactive Card with hover effects
 */
export const InteractiveCard = ({
  children,
  onClick,
  variant = "default",
  hover = true,
  className = "",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    const variants = {
      default: "bg-white border border-gray-200",
      success: getSuccessClasses("background"),
      error: getErrorClasses("background"),
      warning: getWarningClasses("background"),
      info: getInfoClasses("background"),
    };
    return variants[variant] || variants.default;
  };

  return (
    <div
      className={`
        rounded-xl shadow-md overflow-hidden
        ${getVariantClasses()}
        ${hover ? "card-lift cursor-pointer" : ""}
        ${getFocusClasses()}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : undefined}
      {...props}
    >
      {children}
      {hover && isHovered && (
        <div className="absolute inset-0 border-2 border-blue-500/30 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({
  size = "md",
  color = "blue",
  text = "",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={getLoadingSpinner(size, color)} />
      {text && (
        <p className="mt-3 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

/**
 * Loading Dots Component
 */
export const LoadingDots = ({ color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
  };

  return (
    <div className={`loading-dots inline-flex space-x-1 ${className}`}>
      <span className={colorClasses[color] || colorClasses.blue} />
      <span className={colorClasses[color] || colorClasses.blue} />
      <span className={colorClasses[color] || colorClasses.blue} />
    </div>
  );
};

/**
 * Loading Overlay Component
 */
export const LoadingOverlay = ({ message = "Loading...", show = true }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <div className="text-center">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-gray-700 font-semibold">{message}</p>
      </div>
    </div>
  );
};

/**
 * Success Message Component
 */
export const SuccessMessage = ({
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`${getSuccessClasses(
        "alert"
      )} animate-slide-down flex items-center justify-between`}
    >
      <div className="flex items-center space-x-3">
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            className="checkmark-animate"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="text-green-600 hover:text-green-800 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Error Message Component
 */
export const ErrorMessage = ({
  message,
  onClose,
  autoClose = false,
  duration = 5000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`${getErrorClasses(
        "alert"
      )} animate-slide-down flex items-center justify-between`}
    >
      <div className="flex items-center space-x-3">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            className="cross-animate"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="text-red-600 hover:text-red-800 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Warning Message Component
 */
export const WarningMessage = ({ message, onClose }) => {
  return (
    <div
      className={`${getWarningClasses(
        "alert"
      )} flex items-center justify-between`}
    >
      <div className="flex items-center space-x-3">
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-yellow-600 hover:text-yellow-800 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Info Message Component
 */
export const InfoMessage = ({ message, onClose }) => {
  return (
    <div
      className={`${getInfoClasses("alert")} flex items-center justify-between`}
    >
      <div className="flex items-center space-x-3">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-800 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({
  progress = 0,
  variant = "primary",
  size = "md",
  showLabel = true,
  animated = true,
  indeterminate = false,
  className = "",
}) => {
  const getVariantColor = () => {
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-600",
      success: "bg-gradient-to-r from-green-500 to-emerald-600",
      warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
      danger: "bg-gradient-to-r from-red-500 to-red-600",
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
      xl: "h-4",
    };
    return sizes[size] || sizes.md;
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}
      >
        {indeterminate ? (
          <div
            className={`${getSizeClasses()} ${getVariantColor()} progress-indeterminate`}
          />
        ) : (
          <div
            className={`${getSizeClasses()} ${getVariantColor()} ${
              animated ? "transition-all duration-500 ease-out" : ""
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader Component
 */
export const SkeletonLoader = ({
  variant = "text",
  count = 1,
  className = "",
}) => {
  const getVariantClasses = () => {
    const variants = {
      text: "h-4 w-full",
      title: "h-6 w-3/4",
      button: "h-10 w-32 rounded-lg",
      card: "h-48 w-full rounded-xl",
      avatar: "h-12 w-12 rounded-full",
      circle: "h-16 w-16 rounded-full",
    };
    return variants[variant] || variants.text;
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${getVariantClasses()} ${className} ${
            index > 0 ? "mt-2" : ""
          }`}
        />
      ))}
    </>
  );
};

export default {
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
};
