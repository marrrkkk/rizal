/**
 * Achievement Notifications Hook
 * Manages achievement notification queue and display
 * Requirements: 12.3
 */

import { useState, useCallback } from "react";

export const useAchievementNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Show an achievement notification
   * @param {string} achievementId - The achievement ID to display
   */
  const showAchievement = useCallback((achievementId) => {
    const notification = {
      id: `${achievementId}-${Date.now()}`,
      achievementId,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);
  }, []);

  /**
   * Show multiple achievement notifications
   * @param {Array<string>} achievementIds - Array of achievement IDs
   */
  const showAchievements = useCallback((achievementIds) => {
    const newNotifications = achievementIds.map((achievementId, index) => ({
      id: `${achievementId}-${Date.now()}-${index}`,
      achievementId,
      timestamp: Date.now() + index * 100, // Slight delay between each
    }));

    setNotifications((prev) => [...prev, ...newNotifications]);
  }, []);

  /**
   * Clear a specific notification
   * @param {string} notificationId - The notification ID to clear
   */
  const clearNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showAchievement,
    showAchievements,
    clearNotification,
    clearAllNotifications,
  };
};

export default useAchievementNotifications;
