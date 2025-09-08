/**
 * Badge Gallery Component
 * Displays all earned badges in a beautiful, interactive gallery
 */

import { useState } from "react";
import { BADGE_DEFINITIONS } from "./BadgeNotificationSystem";

const BadgeGallery = ({ badges = [], className = "" }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState("all");

  // Get badge info with fallback
  const getBadgeInfo = (badgeId) => {
    return (
      BADGE_DEFINITIONS[badgeId] || {
        name: badgeId
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        description: "Achievement unlocked!",
        icon: "🏆",
        color: "from-blue-400 to-blue-600",
        rarity: "common",
      }
    );
  };

  // Group badges by category
  const categorizedBadges = {
    chapter: badges.filter((badge) => badge.includes("chapter_")),
    performance: badges.filter((badge) =>
      [
        "perfect_score",
        "knowledge_seeker",
        "speed_runner",
        "efficiency_master",
        "persistent_learner",
      ].includes(badge)
    ),
    dedication: badges.filter((badge) =>
      ["dedication", "marathon_learner"].includes(badge)
    ),
    milestone: badges.filter((badge) =>
      ["first_level_complete", "rizal_expert"].includes(badge)
    ),
  };

  const filteredBadges =
    filter === "all" ? badges : categorizedBadges[filter] || [];

  // Rarity order for sorting
  const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 };

  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aRarity = getBadgeInfo(a).rarity;
    const bRarity = getBadgeInfo(b).rarity;
    return rarityOrder[bRarity] - rarityOrder[aRarity];
  });

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case "legendary":
        return {
          border: "border-yellow-400",
          glow: "shadow-yellow-400/50 shadow-xl",
          bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
        };
      case "rare":
        return {
          border: "border-blue-400",
          glow: "shadow-blue-400/50 shadow-lg",
          bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        };
      case "uncommon":
        return {
          border: "border-green-400",
          glow: "shadow-green-400/50 shadow-md",
          bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        };
      default:
        return {
          border: "border-gray-300",
          glow: "shadow-md",
          bg: "bg-gradient-to-br from-gray-50 to-slate-50",
        };
    }
  };

  if (badges.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4 opacity-50">🏆</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No Badges Yet
        </h3>
        <p className="text-gray-500">
          Complete levels and achieve milestones to earn your first badges!
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-3xl mr-2">🏆</span>
            Badge Collection
          </h2>
          <p className="text-gray-600">
            {badges.length} {badges.length === 1 ? "badge" : "badges"} earned
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", icon: "🎯" },
            { key: "chapter", label: "Chapters", icon: "📚" },
            { key: "performance", label: "Performance", icon: "⭐" },
            { key: "dedication", label: "Dedication", icon: "🔥" },
            { key: "milestone", label: "Milestones", icon: "👑" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedBadges.map((badgeId, index) => {
          const badgeInfo = getBadgeInfo(badgeId);
          const rarityStyle = getRarityStyle(badgeInfo.rarity);

          return (
            <div
              key={badgeId}
              className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                selectedBadge === badgeId ? "scale-105 -translate-y-1" : ""
              }`}
              onClick={() =>
                setSelectedBadge(selectedBadge === badgeId ? null : badgeId)
              }
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.glow} border-2 rounded-2xl p-4 text-center relative overflow-hidden`}
              >
                {/* Rarity Indicator */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      badgeInfo.rarity === "legendary"
                        ? "bg-yellow-400"
                        : badgeInfo.rarity === "rare"
                        ? "bg-blue-400"
                        : badgeInfo.rarity === "uncommon"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                {/* Badge Icon */}
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center text-2xl shadow-lg animate-pulse`}
                >
                  {badgeInfo.icon}
                </div>

                {/* Badge Name */}
                <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">
                  {badgeInfo.name}
                </h3>

                {/* Rarity Label */}
                <p className="text-xs text-gray-600 capitalize font-medium">
                  {badgeInfo.rarity}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-800 bg-white/80 px-2 py-1 rounded-full">
                    Click for details
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center transform animate-bounce"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const badgeInfo = getBadgeInfo(selectedBadge);
              const rarityStyle = getRarityStyle(badgeInfo.rarity);

              return (
                <>
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>

                  {/* Badge Icon Large */}
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center text-4xl ${rarityStyle.glow} animate-pulse`}
                  >
                    {badgeInfo.icon}
                  </div>

                  {/* Badge Info */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {badgeInfo.name}
                  </h2>

                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      badgeInfo.rarity === "legendary"
                        ? "bg-yellow-100 text-yellow-800"
                        : badgeInfo.rarity === "rare"
                        ? "bg-blue-100 text-blue-800"
                        : badgeInfo.rarity === "uncommon"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {badgeInfo.rarity.toUpperCase()} BADGE
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {badgeInfo.description}
                  </p>

                  {/* Achievement Date (if available) */}
                  <div className="text-sm text-gray-500 mb-4">
                    🎉 Achievement Unlocked!
                  </div>

                  <button
                    onClick={() => setSelectedBadge(null)}
                    className={`px-6 py-3 rounded-full bg-gradient-to-r ${badgeInfo.color} text-white font-semibold hover:shadow-lg transition-all duration-200`}
                  >
                    Awesome!
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Badges",
            value: badges.length,
            icon: "🏆",
            color: "bg-blue-100 text-blue-800",
          },
          {
            label: "Legendary",
            value: badges.filter((b) => getBadgeInfo(b).rarity === "legendary")
              .length,
            icon: "👑",
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            label: "Rare",
            value: badges.filter((b) => getBadgeInfo(b).rarity === "rare")
              .length,
            icon: "💎",
            color: "bg-purple-100 text-purple-800",
          },
          {
            label: "Common",
            value: badges.filter((b) =>
              ["common", "uncommon"].includes(getBadgeInfo(b).rarity)
            ).length,
            icon: "⭐",
            color: "bg-green-100 text-green-800",
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`${color} rounded-lg p-3 text-center`}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeGallery;
