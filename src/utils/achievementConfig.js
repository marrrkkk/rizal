/**
 * Epic Achievement System Configuration
 * Anime-style achievement names inspired by epic openings and dramatic moments
 * Requirements: 12.4
 */

// Achievement types
export const ACHIEVEMENT_TYPES = {
  MILESTONE: "milestone",
  CHAPTER: "chapter",
  PERFORMANCE: "performance",
  ULTIMATE: "ultimate",
};

// Epic Achievement Definitions with Anime-Style Names
export const EPIC_ACHIEVEMENTS = {
  // Milestone Achievements
  heros_awakening: {
    id: "heros_awakening",
    name: "Hero's Awakening",
    epicTitle: "The Journey Begins",
    description: "Complete your first level and begin your legendary journey",
    icon: "⚡",
    color: "from-blue-400 via-cyan-500 to-blue-600",
    rarity: "common",
    type: ACHIEVEMENT_TYPES.MILESTONE,
    trigger: "first_level_complete",
    animationStyle: "dramatic-entrance",
  },

  path_of_enlightenment: {
    id: "path_of_enlightenment",
    name: "Path of Enlightenment",
    epicTitle: "Wisdom's First Steps",
    description: "Complete an entire chapter and unlock deeper knowledge",
    icon: "🌟",
    color: "from-purple-400 via-pink-500 to-purple-600",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_complete",
    animationStyle: "radiant-glow",
  },

  flawless_victory: {
    id: "flawless_victory",
    name: "Flawless Victory",
    epicTitle: "Perfection Achieved",
    description:
      "Complete a level with a perfect score - no mistakes, pure mastery",
    icon: "💎",
    color: "from-cyan-400 via-blue-500 to-indigo-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "perfect_score",
    animationStyle: "crystal-shine",
  },

  legacy_unleashed: {
    id: "legacy_unleashed",
    name: "Legacy Unleashed",
    epicTitle: "The Ultimate Power",
    description:
      "Complete all chapters and unlock the full legacy of José Rizal",
    icon: "👑",
    color: "from-yellow-400 via-orange-500 to-red-600",
    rarity: "legendary",
    type: ACHIEVEMENT_TYPES.ULTIMATE,
    trigger: "all_chapters_complete",
    animationStyle: "legendary-burst",
  },

  lightning_strike: {
    id: "lightning_strike",
    name: "Lightning Strike",
    epicTitle: "Speed of Thunder",
    description: "Complete a level in record time with blazing speed",
    icon: "⚡",
    color: "from-yellow-300 via-yellow-500 to-orange-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "speed_record",
    animationStyle: "lightning-flash",
  },

  wisdoms_embrace: {
    id: "wisdoms_embrace",
    name: "Wisdom's Embrace",
    epicTitle: "Scholar's Ascension",
    description: "Earn high scores across all levels and prove your mastery",
    icon: "📚",
    color: "from-indigo-400 via-purple-500 to-pink-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "high_average_score",
    animationStyle: "wisdom-aura",
  },

  // Chapter-Specific Epic Achievements
  dawn_of_destiny: {
    id: "dawn_of_destiny",
    name: "Dawn of Destiny",
    epicTitle: "Chapter 1: Origins Revealed",
    description: "Master the childhood of José Rizal in Calamba",
    icon: "🌅",
    color: "from-blue-300 via-sky-400 to-blue-500",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_1_complete",
    animationStyle: "sunrise-glow",
  },

  scholars_resolve: {
    id: "scholars_resolve",
    name: "Scholar's Resolve",
    epicTitle: "Chapter 2: Knowledge Forged",
    description: "Complete José's educational journey in Manila",
    icon: "📖",
    color: "from-amber-400 via-orange-500 to-amber-600",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_2_complete",
    animationStyle: "book-flip",
  },

  wanderers_odyssey: {
    id: "wanderers_odyssey",
    name: "Wanderer's Odyssey",
    epicTitle: "Chapter 3: Beyond Horizons",
    description: "Journey through José's studies abroad in Europe",
    icon: "🌍",
    color: "from-emerald-400 via-green-500 to-teal-600",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_3_complete",
    animationStyle: "world-spin",
  },

  pens_revolution: {
    id: "pens_revolution",
    name: "Pen's Revolution",
    epicTitle: "Chapter 4: Words That Shake Nations",
    description: "Discover the power of Noli Me Tangere and El Filibusterismo",
    icon: "✍️",
    color: "from-pink-400 via-rose-500 to-red-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_4_complete",
    animationStyle: "ink-splash",
  },

  eternal_flame: {
    id: "eternal_flame",
    name: "Eternal Flame",
    epicTitle: "Chapter 5: Immortal Legacy",
    description: "Witness José's return, sacrifice, and undying legacy",
    icon: "🔥",
    color: "from-purple-400 via-indigo-500 to-blue-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.CHAPTER,
    trigger: "chapter_5_complete",
    animationStyle: "flame-rise",
  },

  // Performance Achievements
  unstoppable_force: {
    id: "unstoppable_force",
    name: "Unstoppable Force",
    epicTitle: "Momentum Unleashed",
    description: "Complete 5 levels in a single session without stopping",
    icon: "🚀",
    color: "from-red-400 via-orange-500 to-yellow-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "five_levels_one_session",
    animationStyle: "rocket-boost",
  },

  iron_will: {
    id: "iron_will",
    name: "Iron Will",
    epicTitle: "Unbreakable Spirit",
    description:
      "Complete a difficult level after multiple attempts - never give up!",
    icon: "💪",
    color: "from-gray-400 via-slate-500 to-gray-600",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "persistent_completion",
    animationStyle: "steel-forge",
  },

  rising_phoenix: {
    id: "rising_phoenix",
    name: "Rising Phoenix",
    epicTitle: "Reborn from Failure",
    description: "Turn a failed attempt into a perfect score on retry",
    icon: "🔥",
    color: "from-orange-400 via-red-500 to-pink-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "comeback_perfect",
    animationStyle: "phoenix-rise",
  },

  knowledge_hunter: {
    id: "knowledge_hunter",
    name: "Knowledge Hunter",
    epicTitle: "Seeker of Truth",
    description: "Complete 10 levels and prove your dedication to learning",
    icon: "🎯",
    color: "from-green-400 via-emerald-500 to-teal-600",
    rarity: "uncommon",
    type: ACHIEVEMENT_TYPES.MILESTONE,
    trigger: "ten_levels_complete",
    animationStyle: "target-lock",
  },

  masters_touch: {
    id: "masters_touch",
    name: "Master's Touch",
    epicTitle: "Excellence Embodied",
    description:
      "Achieve 90% or higher average score across all completed levels",
    icon: "✨",
    color: "from-yellow-400 via-amber-500 to-orange-600",
    rarity: "legendary",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "high_average_90",
    animationStyle: "sparkle-burst",
  },

  // Ultimate Achievements
  legend_reborn: {
    id: "legend_reborn",
    name: "Legend Reborn",
    epicTitle: "The Hero Lives On",
    description:
      "Complete every level with high scores and become a true Rizal scholar",
    icon: "🏆",
    color: "from-yellow-300 via-yellow-500 to-orange-600",
    rarity: "legendary",
    type: ACHIEVEMENT_TYPES.ULTIMATE,
    trigger: "perfect_completion",
    animationStyle: "trophy-shine",
  },

  timeless_wisdom: {
    id: "timeless_wisdom",
    name: "Timeless Wisdom",
    epicTitle: "Knowledge Eternal",
    description:
      "Earn all chapter achievements and master José Rizal's complete story",
    icon: "📜",
    color: "from-indigo-400 via-purple-500 to-pink-600",
    rarity: "legendary",
    type: ACHIEVEMENT_TYPES.ULTIMATE,
    trigger: "all_chapters_mastered",
    animationStyle: "scroll-unfurl",
  },
};

// Rarity definitions
export const RARITY_CONFIG = {
  common: {
    label: "Common",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    glowColor: "shadow-gray-400/50",
  },
  uncommon: {
    label: "Uncommon",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    glowColor: "shadow-green-400/50",
  },
  rare: {
    label: "Rare",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
    glowColor: "shadow-blue-400/50",
  },
  legendary: {
    label: "Legendary",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    glowColor: "shadow-yellow-400/50",
  },
};

// Animation style definitions
export const ANIMATION_STYLES = {
  "dramatic-entrance": "animate-bounce",
  "radiant-glow": "animate-pulse",
  "crystal-shine": "animate-ping",
  "legendary-burst": "animate-bounce",
  "lightning-flash": "animate-pulse",
  "wisdom-aura": "animate-pulse",
  "sunrise-glow": "animate-pulse",
  "book-flip": "animate-bounce",
  "world-spin": "animate-spin",
  "ink-splash": "animate-pulse",
  "flame-rise": "animate-bounce",
  "rocket-boost": "animate-bounce",
  "steel-forge": "animate-pulse",
  "phoenix-rise": "animate-bounce",
  "target-lock": "animate-ping",
  "sparkle-burst": "animate-pulse",
  "trophy-shine": "animate-bounce",
  "scroll-unfurl": "animate-pulse",
};

// Helper function to get achievement by ID
export const getAchievementById = (achievementId) => {
  return EPIC_ACHIEVEMENTS[achievementId] || null;
};

// Helper function to get achievements by type
export const getAchievementsByType = (type) => {
  return Object.values(EPIC_ACHIEVEMENTS).filter(
    (achievement) => achievement.type === type
  );
};

// Helper function to get achievements by rarity
export const getAchievementsByRarity = (rarity) => {
  return Object.values(EPIC_ACHIEVEMENTS).filter(
    (achievement) => achievement.rarity === rarity
  );
};

// Helper function to get all achievement IDs
export const getAllAchievementIds = () => {
  return Object.keys(EPIC_ACHIEVEMENTS);
};

export default EPIC_ACHIEVEMENTS;
