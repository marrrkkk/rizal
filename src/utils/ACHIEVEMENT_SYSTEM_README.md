# Epic Achievement System

## Overview

The Epic Achievement System provides anime-style achievement notifications with dramatic names and visual effects. This system is designed to motivate and engage young learners as they progress through José Rizal's story.

## Features

- **Epic Anime-Style Names**: Achievements have dramatic names like "Hero's Awakening", "Path of Enlightenment", and "Legacy Unleashed"
- **Multiple Achievement Types**: Milestone, Chapter, Performance, and Ultimate achievements
- **Rarity System**: Common, Uncommon, Rare, and Legendary achievements with different visual effects
- **Automatic Triggering**: Achievements are automatically awarded based on user progress
- **Dramatic Notifications**: Full-screen animated notifications with custom effects per achievement
- **Badge Gallery**: Beautiful gallery view to display all earned achievements

## Achievement Types

### Milestone Achievements

Awarded for reaching significant progress milestones:

- **Hero's Awakening**: Complete your first level
- **Knowledge Hunter**: Complete 10 levels

### Chapter Achievements

Awarded for completing entire chapters:

- **Dawn of Destiny**: Complete Chapter 1 (Childhood)
- **Scholar's Resolve**: Complete Chapter 2 (Education)
- **Wanderer's Odyssey**: Complete Chapter 3 (Europe)
- **Pen's Revolution**: Complete Chapter 4 (Noli Me Tangere)
- **Eternal Flame**: Complete Chapter 5 (Legacy)

### Performance Achievements

Awarded for exceptional performance:

- **Flawless Victory**: Perfect score on any level
- **Lightning Strike**: Complete a level in record time
- **Wisdom's Embrace**: High average score across all levels
- **Rising Phoenix**: Turn a failed attempt into a perfect score

### Ultimate Achievements

The rarest and most prestigious achievements:

- **Legacy Unleashed**: Complete all chapters
- **Legend Reborn**: Complete everything with high scores
- **Timeless Wisdom**: Master all chapters

## Quick Start

### 1. Import Required Modules

```javascript
import { useAchievementNotifications } from "../hooks/useAchievementNotifications";
import AchievementNotificationContainer from "../components/AchievementNotificationContainer";
import { checkLevelCompletionAchievements } from "../utils/achievementSystem";
```

### 2. Set Up in Your Component

```javascript
function GameComponent() {
  const { notifications, showAchievements, clearNotification } =
    useAchievementNotifications();

  const handleLevelComplete = async (score) => {
    const userId = getCurrentUserId();

    // Check for new achievements
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      chapterId,
      levelId,
      score,
      {
        timeTaken: gameTime,
        estimatedTime: 120,
        attempts: attemptCount,
      }
    );

    // Show achievement notifications
    if (newAchievements.length > 0) {
      showAchievements(newAchievements);
    }
  };

  return (
    <>
      {/* Your game content */}
      <div>Game Content Here</div>

      {/* Achievement notifications */}
      <AchievementNotificationContainer
        notifications={notifications}
        onClearNotification={clearNotification}
      />
    </>
  );
}
```

### 3. Display Achievement Gallery

```javascript
import BadgeGallery from "../components/BadgeGallery";
import { getUserAchievements } from "../utils/achievementSystem";

function ProfilePage() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const userId = getCurrentUserId();
      const userAchievements = await getUserAchievements(userId);
      const achievementIds = userAchievements.map((a) => a.achievement_name);
      setAchievements(achievementIds);
    };

    loadAchievements();
  }, []);

  return <BadgeGallery badges={achievements} />;
}
```

## API Reference

### Achievement System Functions

#### `awardAchievement(userId, achievementId)`

Manually award an achievement to a user.

```javascript
const awarded = await awardAchievement(userId, "heros_awakening");
```

#### `checkLevelCompletionAchievements(userId, chapterId, levelId, score, stats)`

Check and award achievements based on level completion.

```javascript
const newAchievements = await checkLevelCompletionAchievements(
  userId,
  1,
  1,
  95,
  {
    timeTaken: 60,
    estimatedTime: 120,
    attempts: 1,
    hintsUsed: 0,
  }
);
```

#### `getUserAchievements(userId)`

Get all achievements earned by a user.

```javascript
const achievements = await getUserAchievements(userId);
```

#### `hasAchievement(userId, achievementId)`

Check if a user has a specific achievement.

```javascript
const hasIt = await hasAchievement(userId, "flawless_victory");
```

### Hook: useAchievementNotifications

```javascript
const {
  notifications, // Array of current notifications
  showAchievement, // Show single achievement
  showAchievements, // Show multiple achievements
  clearNotification, // Clear specific notification
  clearAllNotifications, // Clear all notifications
} = useAchievementNotifications();
```

## Achievement Triggers

### Automatic Triggers

The system automatically checks for achievements when:

1. **First Level Complete**: Awards "Hero's Awakening"
2. **Perfect Score (100%)**: Awards "Flawless Victory"
3. **Fast Completion**: Awards "Lightning Strike" if completed in half the estimated time
4. **Persistent Completion**: Awards "Iron Will" after 3+ attempts
5. **Comeback Perfect**: Awards "Rising Phoenix" for perfect score after failing
6. **10 Levels Complete**: Awards "Knowledge Hunter"
7. **Chapter Complete**: Awards chapter-specific achievement
8. **All Chapters Complete**: Awards "Legacy Unleashed" and "Timeless Wisdom"
9. **High Average Score**: Awards "Wisdom's Embrace" and "Master's Touch"

### Session Triggers

Track session progress and call:

```javascript
const sessionAchievements = await checkSessionAchievements(
  userId,
  levelsCompletedInSession
);
```

Awards "Unstoppable Force" for 5 levels in one session.

## Customization

### Adding New Achievements

1. Add to `src/utils/achievementConfig.js`:

```javascript
export const EPIC_ACHIEVEMENTS = {
  // ... existing achievements

  my_new_achievement: {
    id: "my_new_achievement",
    name: "Epic New Achievement",
    epicTitle: "The Subtitle",
    description: "Description of what this achievement means",
    icon: "🎯",
    color: "from-blue-400 via-cyan-500 to-blue-600",
    rarity: "rare",
    type: ACHIEVEMENT_TYPES.PERFORMANCE,
    trigger: "custom_trigger",
    animationStyle: "dramatic-entrance",
  },
};
```

2. Add trigger logic in `src/utils/achievementSystem.js`:

```javascript
// In checkLevelCompletionAchievements or create new check function
if (customCondition) {
  const awarded = await awardAchievement(userId, "my_new_achievement");
  if (awarded) newAchievements.push("my_new_achievement");
}
```

## Visual Customization

### Rarity Styles

Each rarity has different visual effects:

- **Common**: Gray border, standard shadow
- **Uncommon**: Green border, green glow
- **Rare**: Blue border, blue glow, enhanced animations
- **Legendary**: Gold border, gold glow, sparkle effects, maximum drama

### Animation Styles

Available animation styles in `achievementConfig.js`:

- `dramatic-entrance`: Bounce animation
- `radiant-glow`: Pulse animation
- `crystal-shine`: Ping animation
- `legendary-burst`: Bounce with extra effects
- And more...

## Best Practices

1. **Check achievements after saving progress**: Always save level completion before checking achievements
2. **Batch notifications**: Use `showAchievements()` for multiple achievements to stagger them nicely
3. **Don't spam**: Limit achievement checks to significant events
4. **Test thoroughly**: Ensure achievement conditions are balanced and achievable
5. **Provide feedback**: Always show notifications when achievements are earned

## Database Schema

The achievements table:

```sql
CREATE TABLE achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Troubleshooting

### Achievements not showing

- Check that database is initialized
- Verify user ID is correct
- Check browser console for errors
- Ensure `AchievementNotificationContainer` is rendered

### Duplicate achievements

- System prevents duplicates automatically
- Check that you're not calling `awardAchievement` multiple times

### Notifications not clearing

- Ensure `onClearNotification` is properly connected
- Check that notification IDs are unique

## Requirements Validation

This implementation satisfies:

- **Requirement 12.1**: Achievement awarding system with database persistence
- **Requirement 12.3**: Achievement display components with animations
- **Requirement 12.4**: Epic anime-style achievement names

## Future Enhancements

Potential additions:

- Sound effects for achievement unlocks
- Achievement sharing functionality
- Achievement progress tracking (e.g., "Complete 5/10 levels")
- Seasonal or event-based achievements
- Achievement point system
- Leaderboards based on achievement counts
