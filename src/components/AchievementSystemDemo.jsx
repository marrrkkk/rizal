/**
 * Achievement System Demo Component
 * Demonstrates how to integrate the epic achievement system
 * This is a reference implementation for game developers
 */

import { useState, useEffect } from "react";
import { useAchievementNotifications } from "../hooks/useAchievementNotifications";
import AchievementNotificationContainer from "./AchievementNotificationContainer";
import BadgeGallery from "./BadgeGallery";
import {
  getUserAchievements,
  checkLevelCompletionAchievements,
  awardAchievement,
} from "../utils/achievementSystem";
import { EPIC_ACHIEVEMENTS } from "../utils/achievementConfig";

const AchievementSystemDemo = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [userId] = useState(1); // Demo user ID
  const { notifications, showAchievements, clearNotification } =
    useAchievementNotifications();

  // Load user achievements on mount
  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const achievements = await getUserAchievements(userId);
      const achievementIds = achievements.map((a) => a.achievement_name);
      setUserAchievements(achievementIds);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  // Simulate level completion
  const simulateLevelCompletion = async (chapterId, levelId, score) => {
    try {
      // Check for new achievements
      const newAchievements = await checkLevelCompletionAchievements(
        userId,
        chapterId,
        levelId,
        score,
        {
          timeTaken: 60,
          estimatedTime: 120,
          attempts: 1,
          hintsUsed: 0,
        }
      );

      // Show notifications for new achievements
      if (newAchievements.length > 0) {
        showAchievements(newAchievements);
        // Reload achievements to update gallery
        setTimeout(loadAchievements, 1000);
      }
    } catch (error) {
      console.error("Error simulating level completion:", error);
    }
  };

  // Manually award an achievement for demo
  const awardDemoAchievement = async (achievementId) => {
    try {
      const awarded = await awardAchievement(userId, achievementId);
      if (awarded) {
        showAchievements([achievementId]);
        setTimeout(loadAchievements, 1000);
      } else {
        alert("Achievement already earned!");
      }
    } catch (error) {
      console.error("Error awarding achievement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Epic Achievement System Demo
          </h1>
          <p className="text-gray-600">
            Test the anime-style achievement notifications and badge gallery
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Demo Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Simulate Level Completion
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => simulateLevelCompletion(1, 1, 100)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Complete Level 1-1 (Perfect Score)
                </button>
                <button
                  onClick={() => simulateLevelCompletion(1, 2, 85)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Complete Level 1-2 (Good Score)
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Award Specific Achievements
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => awardDemoAchievement("heros_awakening")}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Hero's Awakening ⚡
                </button>
                <button
                  onClick={() => awardDemoAchievement("flawless_victory")}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Flawless Victory 💎
                </button>
              </div>
            </div>
          </div>

          {/* Achievement List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              All Available Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {Object.keys(EPIC_ACHIEVEMENTS).map((achievementId) => {
                const achievement = EPIC_ACHIEVEMENTS[achievementId];
                return (
                  <button
                    key={achievementId}
                    onClick={() => awardDemoAchievement(achievementId)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-left transition-colors"
                  >
                    <div className="font-semibold text-gray-800 truncate">
                      {achievement.icon} {achievement.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {achievement.rarity}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badge Gallery */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <BadgeGallery badges={userAchievements} />
        </div>

        {/* Achievement Stats */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Achievement Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {userAchievements.length}
              </div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {
                  userAchievements.filter(
                    (id) => EPIC_ACHIEVEMENTS[id]?.rarity === "legendary"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Legendary</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {
                  userAchievements.filter(
                    (id) => EPIC_ACHIEVEMENTS[id]?.rarity === "rare"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Rare</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {Object.keys(EPIC_ACHIEVEMENTS).length -
                  userAchievements.length}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Notifications */}
      <AchievementNotificationContainer
        notifications={notifications}
        onClearNotification={clearNotification}
      />
    </div>
  );
};

export default AchievementSystemDemo;
