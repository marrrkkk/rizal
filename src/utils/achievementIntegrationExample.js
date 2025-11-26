/**
 * Achievement System Integration Example
 * Shows how to integrate the epic achievement system into game completion flow
 * Requirements: 12.1, 12.3
 */

import {
  checkLevelCompletionAchievements,
  checkSessionAchievements,
  getUserAchievements,
} from "./achievementSystem";

/**
 * Example: Handle level completion with achievement checking
 * This should be called when a user completes a level
 */
export const handleLevelCompletionWithAchievements = async (
  userId,
  chapterId,
  levelId,
  finalScore,
  gameStats = {}
) => {
  try {
    // Save level completion to database first
    // ... (existing level completion logic)

    // Check for achievements
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      chapterId,
      levelId,
      finalScore,
      {
        timeTaken: gameStats.timeTaken, // Time in seconds
        estimatedTime: gameStats.estimatedTime, // Expected time in seconds
        attempts: gameStats.attempts, // Number of attempts
        previousScore: gameStats.previousScore, // Previous attempt score
        hintsUsed: gameStats.hintsUsed, // Number of hints used
      }
    );

    // Return achievements to display notifications
    return {
      success: true,
      newAchievements,
    };
  } catch (error) {
    console.error("Error handling level completion:", error);
    return {
      success: false,
      newAchievements: [],
    };
  }
};

/**
 * Example: Check session achievements
 * Call this periodically or when tracking session progress
 */
export const handleSessionProgress = async (
  userId,
  levelsCompletedInSession
) => {
  try {
    const newAchievements = await checkSessionAchievements(
      userId,
      levelsCompletedInSession
    );
    return newAchievements;
  } catch (error) {
    console.error("Error checking session achievements:", error);
    return [];
  }
};

/**
 * Example: React component integration
 *
 * import { useAchievementNotifications } from '../hooks/useAchievementNotifications';
 * import AchievementNotificationContainer from '../components/AchievementNotificationContainer';
 * import { handleLevelCompletionWithAchievements } from '../utils/achievementIntegrationExample';
 *
 * function GameComponent() {
 *   const { notifications, showAchievements, clearNotification } = useAchievementNotifications();
 *
 *   const handleGameComplete = async (score) => {
 *     const userId = getCurrentUserId();
 *     const result = await handleLevelCompletionWithAchievements(
 *       userId,
 *       chapterId,
 *       levelId,
 *       score,
 *       {
 *         timeTaken: gameTime,
 *         estimatedTime: 120,
 *         attempts: attemptCount,
 *       }
 *     );
 *
 *     if (result.newAchievements.length > 0) {
 *       showAchievements(result.newAchievements);
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <div>Game Content</div>
 *       <AchievementNotificationContainer
 *         notifications={notifications}
 *         onClearNotification={clearNotification}
 *       />
 *     </>
 *   );
 * }
 */

/**
 * Example: Display user's achievement gallery
 *
 * import BadgeGallery from '../components/BadgeGallery';
 * import { getUserAchievements } from '../utils/achievementSystem';
 *
 * function UserProfilePage() {
 *   const [achievements, setAchievements] = useState([]);
 *
 *   useEffect(() => {
 *     const loadAchievements = async () => {
 *       const userId = getCurrentUserId();
 *       const userAchievements = await getUserAchievements(userId);
 *       const achievementIds = userAchievements.map(a => a.achievement_name);
 *       setAchievements(achievementIds);
 *     };
 *
 *     loadAchievements();
 *   }, []);
 *
 *   return (
 *     <div>
 *       <h1>Your Achievements</h1>
 *       <BadgeGallery badges={achievements} />
 *     </div>
 *   );
 * }
 */

export default {
  handleLevelCompletionWithAchievements,
  handleSessionProgress,
};
