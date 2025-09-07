import {
  createComingSoonCard,
  getRandomFact,
} from "../utils/placeholderContent";

export default function ComingSoon({
  type = "games",
  title = null,
  message = null,
  features = null,
  showFact = true,
  className = "",
  size = "medium",
}) {
  const comingSoon = createComingSoonCard(type, message);
  const fact = getRandomFact();

  const sizeClasses = {
    small: "p-4 text-sm",
    medium: "p-6 text-base",
    large: "p-8 text-lg",
  };

  return (
    <div
      className={`${comingSoon.className} ${sizeClasses[size]} ${className}`}
    >
      <div className="text-6xl mb-4">{comingSoon.icon}</div>

      <h3 className="text-xl font-bold text-purple-800 mb-3">
        {title || comingSoon.title}
      </h3>

      <p className="text-purple-700 mb-4">{message || comingSoon.message}</p>

      {(features || comingSoon.features.length > 0) && (
        <div className="mb-4">
          <h4 className="font-semibold text-purple-800 mb-2">
            What to expect:
          </h4>
          <ul className="text-sm text-purple-600 space-y-1">
            {(features || comingSoon.features).map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="text-purple-500 mr-2">✨</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {comingSoon.preview && (
        <div className="bg-white/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-purple-700 italic">{comingSoon.preview}</p>
        </div>
      )}

      {showFact && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Did you know?</span>{" "}
            {fact.replace("🌟 ", "")}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-purple-500">
        Stay tuned for updates! 🚀
      </div>
    </div>
  );
}

// Specialized coming soon components
export function ComingSoonLevel({ levelNumber, chapterNumber, title = null }) {
  return (
    <ComingSoon
      type="levels"
      title={title || `Level ${levelNumber} Coming Soon!`}
      message={`We're developing an exciting new level for Chapter ${chapterNumber} that will teach you more about José Rizal's incredible journey!`}
      features={[
        "Interactive storytelling",
        "Historical accuracy",
        "Fun mini-games",
        "Educational rewards",
      ]}
      size="medium"
    />
  );
}

export function ComingSoonGame({ gameName, description = null }) {
  return (
    <ComingSoon
      type="games"
      title={`${gameName} - Coming Soon!`}
      message={
        description ||
        "This exciting educational game is being developed to make learning about Rizal even more engaging!"
      }
      features={[
        "Interactive gameplay",
        "Historical content",
        "Progress tracking",
        "Achievement system",
      ]}
      size="large"
    />
  );
}

export function ComingSoonChapter({ chapterNumber, title = null }) {
  return (
    <ComingSoon
      type="chapters"
      title={title || `Chapter ${chapterNumber} - In Development!`}
      message="More chapters about Rizal's life story are being carefully crafted to provide you with the best learning experience!"
      features={[
        "New historical periods",
        "Advanced game mechanics",
        "Rich storytelling",
        "Cultural insights",
      ]}
      size="large"
    />
  );
}
