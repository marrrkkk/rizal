/**
 * Achievement Notification Container
 * Manages and displays multiple achievement notifications
 * Requirements: 12.3
 */

import AchievementNotification from "./AchievementNotification";

const AchievementNotificationContainer = ({
  notifications,
  onClearNotification,
}) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <>
      {notifications.map((notification, index) => (
        <AchievementNotification
          key={notification.id}
          achievementId={notification.achievementId}
          delay={index * 500} // Stagger notifications
          onClose={() => onClearNotification(notification.id)}
        />
      ))}
    </>
  );
};

export default AchievementNotificationContainer;
