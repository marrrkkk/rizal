/**
 * Placeholder Content Utility
 * Provides emoji-based placeholder images and descriptive text for games
 */

export const placeholderImages = {
  // Character placeholders
  characters: {
    rizal: "👨‍🎓",
    maria_clara: "👩‍🦳",
    ibarra: "👨‍💼",
    padre_damaso: "👨‍💼",
    elias: "👨‍🌾",
    sisa: "👩‍👧‍👦",
    basilio: "👦",
    crispin: "👶",
    captain_tiago: "👨‍💼",
    dona_victorina: "👩‍🦳",
  },

  // Historical scenes
  scenes: {
    birth: "🏠",
    childhood: "👶",
    school: "🏫",
    family: "👨‍👩‍👧‍👦",
    reading: "📚",
    writing: "✍️",
    travel: "🚢",
    europe: "🏰",
    university: "🎓",
    medicine: "⚕️",
    trial: "⚖️",
    execution: "🕊️",
    legacy: "🏛️",
  },

  // Objects and symbols
  objects: {
    book: "📖",
    letter: "✉️",
    quill: "🪶",
    map: "🗺️",
    church: "⛪",
    house: "🏠",
    school: "🏫",
    ship: "🚢",
    train: "🚂",
    flag: "🇵🇭",
    sun: "☀️",
    stars: "⭐",
    cross: "✝️",
    crown: "👑",
  },

  // Locations
  locations: {
    calamba: "🏘️",
    manila: "🏙️",
    ateneo: "🏫",
    ust: "🏛️",
    madrid: "🏰",
    paris: "🗼",
    berlin: "🏛️",
    heidelberg: "🏰",
    dapitan: "🏝️",
    bagumbayan: "🌅",
  },

  // Activities
  activities: {
    studying: "📚",
    writing: "✍️",
    teaching: "👨‍🏫",
    healing: "⚕️",
    traveling: "🧳",
    painting: "🎨",
    sculpting: "🗿",
    researching: "🔬",
    gardening: "🌱",
    fishing: "🎣",
  },
};

export const placeholderDescriptions = {
  // Character descriptions
  characters: {
    rizal: "José Protasio Rizal Mercado y Alonso Realonda - Our national hero",
    maria_clara: "Beautiful and kind-hearted daughter of Captain Tiago",
    ibarra: "Crisostomo Ibarra - Idealistic young Filipino gentleman",
    padre_damaso: "Corrupt Spanish friar representing colonial oppression",
    elias: "Mysterious ally who helps Ibarra, represents the common Filipino",
    sisa: "Tragic mother of Basilio and Crispin, symbol of suffering",
    basilio: "Elder son of Sisa, represents hope for the future",
    crispin: "Younger son of Sisa, innocent victim of injustice",
    captain_tiago: "Wealthy Filipino who collaborates with Spanish authorities",
    dona_victorina: "Social climber who represents colonial mentality",
  },

  // Scene descriptions
  scenes: {
    birth: "The birthplace of José Rizal in Calamba, Laguna on June 19, 1861",
    childhood:
      "Young José's formative years filled with learning and curiosity",
    school:
      "Educational institutions that shaped Rizal's intellectual development",
    family: "The loving Mercado family that nurtured José's values",
    reading: "José's early love for books and literature",
    writing: "The development of Rizal's literary talents",
    travel: "Rizal's journeys across Europe for education and enlightenment",
    europe: "The European cities where Rizal studied and wrote his novels",
    university: "Higher education institutions where Rizal excelled",
    medicine: "Rizal's medical studies and practice",
    trial: "The military trial that led to Rizal's martyrdom",
    execution: "Rizal's sacrifice at Bagumbayan field on December 30, 1896",
    legacy: "The enduring impact of Rizal's life and works",
  },

  // Educational content
  educational: {
    fact_childhood:
      "Did you know? José learned to read at age 3 from his mother!",
    fact_languages: "Rizal could speak 22 languages fluently!",
    fact_novels:
      "His novels Noli Me Tangere and El Filibusterismo awakened Filipino nationalism!",
    fact_medicine: "He was an ophthalmologist who performed eye surgeries!",
    fact_arts: "Rizal was also a sculptor, painter, and poet!",
    fact_science: "He discovered several new species of animals in Dapitan!",
    fact_martyrdom: "His execution sparked the Philippine Revolution!",
    fact_legacy: "December 30 is celebrated as Rizal Day in the Philippines!",
  },
};

export const comingSoonContent = {
  // Coming soon messages for different types of content
  games: {
    title: "🎮 Coming Soon!",
    message:
      "This exciting game is being developed to make learning about Rizal even more fun!",
    features: [
      "Interactive gameplay",
      "Educational content",
      "Fun animations",
      "Progress tracking",
    ],
  },

  levels: {
    title: "🚀 New Level Coming Soon!",
    message:
      "We're working on an amazing new level that will teach you more about José Rizal's life!",
    preview: "Get ready for more adventures in learning!",
  },

  chapters: {
    title: "📚 New Chapter in Development!",
    message:
      "More chapters about Rizal's incredible life story are being created!",
    teaser: "Stay tuned for more historical adventures!",
  },
};

export const createPlaceholderImage = (type, key, size = "large") => {
  const emoji = placeholderImages[type]?.[key] || "❓";
  const description =
    placeholderDescriptions[type]?.[key] || "Educational content";

  const sizeClasses = {
    small: "w-12 h-12 text-2xl",
    medium: "w-24 h-24 text-4xl",
    large: "w-32 h-32 text-6xl",
    xlarge: "w-48 h-48 text-8xl",
  };

  return {
    emoji,
    description,
    className: `${sizeClasses[size]} bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-lg`,
  };
};

export const createComingSoonCard = (type = "games", customMessage = null) => {
  const content = comingSoonContent[type];

  return {
    title: content.title,
    message: customMessage || content.message,
    features: content.features || [],
    preview: content.preview || content.teaser || "",
    icon: "🔮",
    className:
      "bg-gradient-to-br from-purple-100 to-pink-200 border-2 border-dashed border-purple-300 rounded-xl p-6 text-center",
  };
};

export const educationalFacts = [
  "🌟 José Rizal was born on June 19, 1861, in Calamba, Laguna",
  "📚 He learned to read at the age of 3 from his mother, Teodora Alonso",
  "🗣️ Rizal could speak 22 languages including Tagalog, Spanish, French, German, and Japanese",
  "⚕️ He was a licensed ophthalmologist who performed eye surgeries in Europe",
  "🎨 Besides writing, he was also a sculptor, painter, and inventor",
  "🔬 In Dapitan, he discovered new species of animals and sent specimens to European museums",
  "✍️ His novels 'Noli Me Tangere' and 'El Filibusterismo' exposed Spanish colonial abuses",
  "🏫 He established a school in Dapitan where he taught children for free",
  "💕 He had relationships with several women but never married",
  "🕊️ His execution on December 30, 1896, sparked the Philippine Revolution",
];

export const getRandomFact = () => {
  return educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
};

export default {
  placeholderImages,
  placeholderDescriptions,
  comingSoonContent,
  createPlaceholderImage,
  createComingSoonCard,
  educationalFacts,
  getRandomFact,
};
