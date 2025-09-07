import { useState, useEffect } from "react";

const CelebrationAnimation = ({
  type = "level", // 'level', 'chapter', 'badge'
  onComplete,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles for confetti effect
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      delay: Math.random() * 1000,
      color: getRandomColor(),
      size: Math.random() * 10 + 5,
      emoji: getRandomEmoji(type),
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete, type]);

  const getRandomColor = () => {
    const colors = [
      "text-yellow-400",
      "text-blue-400",
      "text-green-400",
      "text-red-400",
      "text-purple-400",
      "text-pink-400",
      "text-indigo-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomEmoji = (type) => {
    const emojiSets = {
      level: ["⭐", "🌟", "✨", "🎉", "🎊", "🏆", "👏"],
      chapter: ["🎉", "🎊", "🏆", "🥇", "🌟", "⭐", "🎯"],
      badge: ["🏅", "🏆", "🥇", "⭐", "🌟", "✨", "🎖️"],
    };
    const emojis = emojiSets[type] || emojiSets.level;
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const getCelebrationMessage = () => {
    const messages = {
      level: [
        "Level Complete! 🎉",
        "Great Job! ⭐",
        "Well Done! 👏",
        "Excellent Work! 🌟",
      ],
      chapter: [
        "Chapter Complete! 🏆",
        "Amazing Progress! 🎊",
        "Outstanding! 🥇",
        "Chapter Mastered! 🌟",
      ],
      badge: [
        "Badge Earned! 🏅",
        "Achievement Unlocked! 🏆",
        "New Badge! ⭐",
        "Congratulations! 🎖️",
      ],
    };
    const messageList = messages[type] || messages.level;
    return messageList[Math.floor(Math.random() * messageList.length)];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl ${particle.color} animate-bounce`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: "2s",
            fontSize: `${particle.size}px`,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Central celebration message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center transform animate-pulse">
          <div className="text-6xl mb-4">
            {type === "level" && "🎉"}
            {type === "chapter" && "🏆"}
            {type === "badge" && "🏅"}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {getCelebrationMessage()}
          </h2>
          <div className="flex justify-center space-x-2 text-2xl animate-bounce">
            <span style={{ animationDelay: "0ms" }}>🌟</span>
            <span style={{ animationDelay: "200ms" }}>⭐</span>
            <span style={{ animationDelay: "400ms" }}>✨</span>
          </div>
        </div>
      </div>

      {/* Fireworks effect */}
      <div className="absolute top-1/4 left-1/4 animate-ping">
        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
      </div>
      <div
        className="absolute top-1/3 right-1/4 animate-ping"
        style={{ animationDelay: "500ms" }}
      >
        <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
      </div>
      <div
        className="absolute bottom-1/3 left-1/3 animate-ping"
        style={{ animationDelay: "1000ms" }}
      >
        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
      </div>
      <div
        className="absolute bottom-1/4 right-1/3 animate-ping"
        style={{ animationDelay: "1500ms" }}
      >
        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default CelebrationAnimation;
