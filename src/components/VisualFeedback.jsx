import { useState, useEffect } from "react";

// Visual feedback component for user interactions
export function VisualFeedback({
  type = "success",
  message = "",
  duration = 3000,
  onComplete = null,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const feedbackStyles = {
    success: {
      emoji: "🎉",
      colors: "from-green-400 to-emerald-500",
      textColor: "text-white",
      animation: "animate-bounce",
      sound: "✨",
    },
    error: {
      emoji: "🤔",
      colors: "from-orange-400 to-red-500",
      textColor: "text-white",
      animation: "animate-pulse",
      sound: "💭",
    },
    hint: {
      emoji: "💡",
      colors: "from-yellow-400 to-amber-500",
      textColor: "text-white",
      animation: "animate-pulse",
      sound: "🔔",
    },
    encouragement: {
      emoji: "💪",
      colors: "from-blue-400 to-indigo-500",
      textColor: "text-white",
      animation: "animate-bounce",
      sound: "🌟",
    },
    celebration: {
      emoji: "🏆",
      colors: "from-purple-400 to-pink-500",
      textColor: "text-white",
      animation: "animate-spin",
      sound: "🎊",
    },
  };

  const style = feedbackStyles[type] || feedbackStyles.success;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${className}`}
    >
      <div
        className={`bg-gradient-to-r ${style.colors} rounded-xl p-4 shadow-lg max-w-sm`}
      >
        <div className="flex items-center space-x-3">
          <span className={`text-2xl ${style.animation}`}>{style.emoji}</span>
          <div className="flex-1">
            <p className={`font-medium ${style.textColor}`}>{message}</p>
          </div>
          <span className="text-lg">{style.sound}</span>
        </div>
      </div>
    </div>
  );
}

// Interactive button with visual feedback
export function FeedbackButton({
  children,
  onClick = null,
  disabled = false,
  variant = "primary",
  size = "medium",
  className = "",
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;

    setIsPressed(true);
    setShowRipple(true);

    // Visual feedback timing
    setTimeout(() => setIsPressed(false), 150);
    setTimeout(() => setShowRipple(false), 600);

    if (onClick) onClick(e);
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white",
    warning:
      "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white",
    secondary:
      "bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white",
  };

  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-6 py-4 text-lg",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${isPressed ? "scale-95" : "scale-100"}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg transform hover:-translate-y-0.5"
        }
        ${className}
      `}
    >
      {/* Ripple effect */}
      {showRipple && (
        <span className="absolute inset-0 bg-white opacity-30 animate-ping rounded-xl"></span>
      )}

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Animated progress indicator
export function AnimatedProgress({
  current,
  total,
  showEmoji = true,
  className = "",
}) {
  const percentage = Math.round((current / total) * 100);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getProgressEmoji = () => {
    if (percentage === 100) return "🏆";
    if (percentage >= 75) return "🌟";
    if (percentage >= 50) return "💪";
    if (percentage >= 25) return "📚";
    return "🌱";
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Your Progress</span>
        <div className="flex items-center space-x-2">
          {showEmoji && <span className="text-lg">{getProgressEmoji()}</span>}
          <span className="text-sm font-bold text-blue-600">
            {current} / {total}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-600">{percentage}% Complete</span>
      </div>
    </div>
  );
}

// Celebration animation component
export function CelebrationAnimation({
  type = "confetti",
  duration = 2000,
  onComplete = null,
}) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isActive) return null;

  const animations = {
    confetti: (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          >
            <span className="text-2xl">
              {["🎉", "🌟", "✨", "🎊", "💫"][Math.floor(Math.random() * 5)]}
            </span>
          </div>
        ))}
      </div>
    ),
    stars: (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          >
            <span className="text-3xl">⭐</span>
          </div>
        ))}
      </div>
    ),
    hearts: (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          >
            <span className="text-2xl">💖</span>
          </div>
        ))}
      </div>
    ),
  };

  return animations[type] || animations.confetti;
}

// Hover effect component for interactive elements
export function HoverEffect({ children, effect = "lift", className = "" }) {
  const effects = {
    lift: "transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg",
    glow: "transition-all duration-200 hover:shadow-lg hover:shadow-blue-200",
    scale: "transform transition-transform duration-200 hover:scale-105",
    rotate: "transform transition-transform duration-200 hover:rotate-1",
    bounce: "transform transition-transform duration-200 hover:animate-bounce",
  };

  return <div className={`${effects[effect]} ${className}`}>{children}</div>;
}

export default {
  VisualFeedback,
  FeedbackButton,
  AnimatedProgress,
  CelebrationAnimation,
  HoverEffect,
};
