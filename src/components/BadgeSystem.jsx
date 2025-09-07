import { useState, useEffect } from "react";

// Badge definitions
const BADGE_DEFINITIONS = {
  // Chapter completion badges
  chapter_1_complete: {
    id: "chapter_1_complete",
    name: "Childhood Explorer",
    description: "Completed all levels in Chapter 1: Childhood in Calamba",
    icon: "🏠",
    color: "from-blue-400 to-blue-600",
    rarity: "common",
  },
  chapter_2_complete: {
    id: "chapter_2_complete",
    name: "Student Scholar",
    description: "Completed all levels in Chapter 2: Education in Manila",
    icon: "📚",
    color: "from-amber-400 to-orange-500",
    rarity: "common",
  },
  chapter_3_complete: {
    id: "chapter_3_complete",
    name: "World Traveler",
    description: "Completed all levels in Chapter 3: Studies Abroad",
    icon: "✈️",
    color: "from-emerald-400 to-green-600",
    rarity: "common",
  },
  chapter_4_complete: {
    id: "chapter_4_complete",
    name: "Literary Master",
    description: "Completed all levels in Chapter 4: Noli Me Tangere",
    icon: "📖",
    color: "from-pink-400 to-rose-500",
    rarity: "common",
  },
  chapter_5_complete: {
    id: "chapter_5_complete",
    name: "Hero's Legacy",
    description: "Completed all levels in Chapter 5: Return & Legacy",
    icon: "🇵🇭",
    color: "from-purple-400 to-indigo-500",
    rarity: "common",
  },

  // Achievement badges
  first_level_complete: {
    id: "first_level_complete",
    name: "First Steps",
    description: "Completed your first level",
    icon: "👶",
    color: "from-green-400 to-emerald-500",
    rarity: "common",
  },
  perfect_score: {
    id: "perfect_score",
    name: "Perfect Scholar",
    description: "Achieved a perfect score on any level",
    icon: "⭐",
    color: "from-yellow-400 to-orange-500",
    rarity: "rare",
  },
  speed_runner: {
    id: "speed_runner",
    name: "Quick Learner",
    description: "Completed 5 levels in one session",
    icon: "⚡",
    color: "from-cyan-400 to-blue-500",
    rarity: "rare",
  },
  knowledge_seeker: {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Completed 10 levels total",
    icon: "🧠",
    color: "from-indigo-400 to-purple-500",
    rarity: "uncommon",
  },
  rizal_expert: {
    id: "rizal_expert",
    name: "Rizal Expert",
    description: "Completed all available chapters",
    icon: "🏆",
    color: "from-yellow-500 to-amber-600",
    rarity: "legendary",
  },
  dedication: {
    id: "dedication",
    name: "Dedicated Student",
    description: "Played for 7 consecutive days",
    icon: "📅",
    color: "from-purple-500 to-pink-500",
    rarity: "rare",
  },
};

const BadgeCard = ({ badge, isNew = false, size = "medium" }) => {
  const badgeInfo = BADGE_DEFINITIONS[badge] || {
    name: "Unknown Badge",
    description: "Badge description not found",
    icon: "🏅",
    color: "from-gray-400 to-gray-600",
    rarity: "common",
  };

  const sizeClasses = {
    small: "w-12 h-12 text-2xl",
    medium: "w-16 h-16 text-3xl",
    large: "w-20 h-20 text-4xl",
  };

  const rarityBorders = {
    common: "border-gray-300",
    uncommon: "border-green-400",
    rare: "border-blue-400",
    legendary: "border-yellow-400",
  };

  return (
    <div className={`relative group ${isNew ? "animate-bounce" : ""}`}>
      <div
        className={`bg-gradient-to-br ${badgeInfo.color} ${
          sizeClasses[size]
        } rounded-full flex items-center justify-center shadow-lg border-2 ${
          rarityBorders[badgeInfo.rarity]
        } transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
      >
        <span className="text-white drop-shadow-lg">{badgeInfo.icon}</span>
      </div>

      {isNew && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <div className="font-semibold">{badgeInfo.name}</div>
          <div className="text-gray-300 text-xs mt-1">
            {badgeInfo.description}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

const BadgeShowcase = ({ badges, title = "Your Badges", maxDisplay = 6 }) => {
  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = Math.max(0, badges.length - maxDisplay);

  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-gray-400">🏅</span>
        </div>
        <p className="text-gray-500">No badges earned yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Complete levels to earn your first badge!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {displayBadges.map((badge, index) => (
          <BadgeCard key={`${badge}-${index}`} badge={badge} />
        ))}
        {remainingCount > 0 && (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
            <span className="text-gray-600 font-bold">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const BadgeNotification = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const badgeInfo = BADGE_DEFINITIONS[badge];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!badgeInfo) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${badgeInfo.color} rounded-full flex items-center justify-center shadow-lg animate-pulse`}
          >
            <span className="text-2xl text-white">{badgeInfo.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-gray-800">Badge Earned!</h4>
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {badgeInfo.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {badgeInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BadgeCard, BadgeShowcase, BadgeNotification, BADGE_DEFINITIONS };
export default BadgeShowcase;
