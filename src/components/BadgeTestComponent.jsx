/**
 * Badge Test Component
 * For testing and demonstrating the badge notification system
 */

import { useState } from "react";
import { useBadgeNotifications } from "./BadgeNotificationSystem";
import BadgeNotificationSystem from "./BadgeNotificationSystem";
import BadgeGallery from "./BadgeGallery";

const BadgeTestComponent = () => {
  const {
    notifications,
    showBadgeNotification,
    showLevelCompleteNotification,
    clearNotification,
  } = useBadgeNotifications();

  const [earnedBadges, setEarnedBadges] = useState([
    "first_level_complete",
    "chapter_1_complete",
    "perfect_score",
    "knowledge_seeker",
  ]);

  const testBadges = [
    "first_level_complete",
    "chapter_1_complete",
    "chapter_2_complete",
    "chapter_3_complete",
    "chapter_4_complete",
    "chapter_5_complete",
    "perfect_score",
    "knowledge_seeker",
    "speed_runner",
    "efficiency_master",
    "persistent_learner",
    "dedication",
    "marathon_learner",
    "rizal_expert",
  ];

  const handleTestBadge = (badge) => {
    showBadgeNotification(badge);
    if (!earnedBadges.includes(badge)) {
      setEarnedBadges((prev) => [...prev, badge]);
    }
  };

  const handleTestLevelComplete = () => {
    const chapter = Math.floor(Math.random() * 5) + 1;
    const level = Math.floor(Math.random() * 5) + 1;
    const score = Math.floor(Math.random() * 40) + 60; // 60-100

    showLevelCompleteNotification(chapter, level, score);
  };

  const handleEarnRandomBadge = () => {
    const availableBadges = testBadges.filter(
      (badge) => !earnedBadges.includes(badge)
    );
    if (availableBadges.length > 0) {
      const randomBadge =
        availableBadges[Math.floor(Math.random() * availableBadges.length)];
      handleTestBadge(randomBadge);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Badge Notification System */}
      <BadgeNotificationSystem
        notifications={notifications}
        onClearNotification={clearNotification}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🏆 Badge System Demo
        </h1>
        <p className="text-gray-600">
          Test the badge notification system and view the badge gallery
        </p>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Test Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleTestLevelComplete}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🎯 Test Level Complete
          </button>

          <button
            onClick={handleEarnRandomBadge}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🎲 Earn Random Badge
          </button>

          <button
            onClick={() => setEarnedBadges([])}
            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🗑️ Clear All Badges
          </button>
        </div>

        {/* Individual Badge Tests */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Test Individual Badges:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {testBadges.map((badge) => (
              <button
                key={badge}
                onClick={() => handleTestBadge(badge)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  earnedBadges.includes(badge)
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={badge
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              >
                {badge
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Gallery */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <BadgeGallery badges={earnedBadges} />
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          How to Use:
        </h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>
            • <strong>Test Level Complete:</strong> Shows a level completion
            notification with random score
          </li>
          <li>
            • <strong>Earn Random Badge:</strong> Awards a random badge you
            haven't earned yet
          </li>
          <li>
            • <strong>Individual Badge Buttons:</strong> Test specific badge
            notifications
          </li>
          <li>
            • <strong>Badge Gallery:</strong> Click on badges to see detailed
            information
          </li>
          <li>
            • <strong>Filter Badges:</strong> Use the filter buttons to view
            badges by category
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BadgeTestComponent;
