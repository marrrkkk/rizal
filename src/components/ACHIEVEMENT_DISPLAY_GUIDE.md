# Achievement Display Components Guide

This guide explains how to use the achievement display components in the Rizal educational app.

## Overview

The achievement display system consists of three main components:

1. **AchievementNotification** - Dramatic anime-style notifications when achievements are earned
2. **BadgeGallery** - Interactive gallery displaying all earned achievements
3. **AchievementIndicator** - Compact achievement count display for navbars and profiles

## Components

### 1. AchievementNotification

Displays a dramatic, full-screen notification when an achievement is earned.

**Features:**

- Anime-style dramatic entrance animations
- Rarity-based styling (common, uncommon, rare, legendary)
- Auto-dismisses after 5 seconds
- Epic title banners and glow effects
- Sparkle effects for legendary achievements

**Usage:**

```jsx
import AchievementNotification from "./components/AchievementNotification";

<AchievementNotification
  achievementId="heros_awakening"
  onClose={() => console.log("Notification closed")}
  delay={0} // Optional delay in ms
/>;
```

**Props:**

- `achievementId` (string, required) - ID of the achievement from EPIC_ACHIEVEMENTS
- `onClose` (function, required) - Callback when notification is dismissed
- `delay` (number, optional) - Delay before showing notification in milliseconds

### 2. AchievementNotificationContainer

Manages multiple achievement notifications in a queue.

**Usage:**

```jsx
import AchievementNotificationContainer from "./components/AchievementNotificationContainer";
import { useAchievementNotifications } from "./hooks/useAchievementNotifications";

const MyComponent = () => {
  const { notifications, clearNotification } = useAchievementNotifications();

  return (
    <AchievementNotificationContainer
      notifications={notifications}
      onClearNotification={clearNotification}
    />
  );
};
```

**Props:**

- `notifications` (array, required) - Array of notification objects
- `onClearNotification` (function, required) - Callback to clear a notification

### 3. BadgeGallery

Interactive gallery displaying all earned achievements with filtering and details.

**Features:**

- Filter by achievement type (chapter, performance, milestone, ultimate)
- Sort by rarity (legendary, rare, uncommon, common)
- Click to view detailed achievement information
- Statistics summary (total badges, legendary count, etc.)
- Shows earned dates when available

**Usage:**

```jsx
import BadgeGallery from "./components/BadgeGallery";

<BadgeGallery
  badges={["heros_awakening", "flawless_victory"]}
  badgesWithDates={[
    { achievement_name: "heros_awakening", earned_at: "2024-01-15" },
    { achievement_name: "flawless_victory", earned_at: "2024-01-16" },
  ]}
  className="my-custom-class"
/>;
```

**Props:**

- `badges` (array, required) - Array of achievement IDs
- `badgesWithDates` (array, optional) - Array of achievement objects with earned_at dates
- `className` (string, optional) - Additional CSS classes

### 4. AchievementIndicator

Compact display of achievement count and latest achievement for navbars and profiles.

**Features:**

- Three size options (sm, md, lg)
- Shows achievement count badge
- Displays latest achievement icon
- Hover tooltip with achievement details
- Glow effect for legendary achievements
- Click handler support

**Usage:**

```jsx
import AchievementIndicator from "./components/AchievementIndicator";

<AchievementIndicator
  achievementCount={5}
  latestAchievementId="legacy_unleashed"
  size="md"
  showTooltip={true}
  onClick={() => navigate("/user-stats")}
/>;
```

**Props:**

- `achievementCount` (number, optional) - Total number of achievements earned
- `latestAchievementId` (string, optional) - ID of the most recent achievement
- `size` (string, optional) - Size variant: 'sm', 'md', 'lg' (default: 'md')
- `showTooltip` (boolean, optional) - Show hover tooltip (default: true)
- `onClick` (function, optional) - Click handler

## Hook: useAchievementNotifications

Manages achievement notification queue and display.

**Usage:**

```jsx
import { useAchievementNotifications } from "./hooks/useAchievementNotifications";

const MyComponent = () => {
  const {
    notifications,
    showAchievement,
    showAchievements,
    clearNotification,
    clearAllNotifications,
  } = useAchievementNotifications();

  // Show single achievement
  const handleAchievement = () => {
    showAchievement("heros_awakening");
  };

  // Show multiple achievements
  const handleMultipleAchievements = () => {
    showAchievements(["heros_awakening", "flawless_victory"]);
  };

  return (
    <>
      <button onClick={handleAchievement}>Show Achievement</button>
      <AchievementNotificationContainer
        notifications={notifications}
        onClearNotification={clearNotification}
      />
    </>
  );
};
```

**Methods:**

- `showAchievement(achievementId)` - Show a single achievement notification
- `showAchievements(achievementIds)` - Show multiple achievement notifications
- `clearNotification(notificationId)` - Clear a specific notification
- `clearAllNotifications()` - Clear all notifications

## Integration Example

### Complete Game Integration

```jsx
import React, { useState } from "react";
import { useAchievementNotifications } from "./hooks/useAchievementNotifications";
import { AchievementNotificationContainer } from "./components";
import { checkLevelCompletionAchievements } from "./utils/achievementSystem";
import { getCurrentUserId } from "./utils/auth";

const MyGame = () => {
  const [score, setScore] = useState(0);
  const { notifications, showAchievements, clearNotification } =
    useAchievementNotifications();

  const handleGameComplete = async (finalScore, stats) => {
    const userId = getCurrentUserId();

    // Check for new achievements
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      chapterId,
      levelId,
      finalScore,
      stats
    );

    // Show achievement notifications
    if (newAchievements.length > 0) {
      showAchievements(newAchievements);
    }

    // Continue with game completion logic...
  };

  return (
    <div>
      {/* Your game content */}

      {/* Achievement notifications */}
      <AchievementNotificationContainer
        notifications={notifications}
        onClearNotification={clearNotification}
      />
    </div>
  );
};
```

### User Profile Integration

```jsx
import React, { useState, useEffect } from "react";
import { BadgeGallery, AchievementIndicator } from "./components";
import { getUserAchievements } from "./utils/achievementSystem";
import { getCurrentUserId } from "./utils/auth";

const UserProfile = () => {
  const [achievements, setAchievements] = useState([]);
  const [achievementsWithDates, setAchievementsWithDates] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const userId = getCurrentUserId();
      const data = await getUserAchievements(userId);
      setAchievementsWithDates(data);
      setAchievements(data.map((a) => a.achievement_name));
    };
    loadAchievements();
  }, []);

  return (
    <div>
      {/* Achievement indicator in header */}
      <div className="flex items-center space-x-4">
        <h1>My Profile</h1>
        <AchievementIndicator
          achievementCount={achievements.length}
          latestAchievementId={achievements[0]}
          size="lg"
        />
      </div>

      {/* Badge gallery */}
      <BadgeGallery
        badges={achievements}
        badgesWithDates={achievementsWithDates}
      />
    </div>
  );
};
```

### Navbar Integration

```jsx
import React, { useState, useEffect } from "react";
import { AchievementIndicator } from "./components";
import { getUserAchievements } from "./utils/achievementSystem";
import { getCurrentUserId } from "./utils/auth";

const Navbar = () => {
  const [achievementCount, setAchievementCount] = useState(0);
  const [latestAchievement, setLatestAchievement] = useState(null);

  useEffect(() => {
    const loadAchievements = async () => {
      const userId = getCurrentUserId();
      const achievements = await getUserAchievements(userId);
      setAchievementCount(achievements.length);
      if (achievements.length > 0) {
        setLatestAchievement(achievements[0].achievement_name);
      }
    };
    loadAchievements();
  }, []);

  return (
    <nav>
      {/* Other nav items */}
      <AchievementIndicator
        achievementCount={achievementCount}
        latestAchievementId={latestAchievement}
        size="md"
        onClick={() => navigate("/user-stats")}
      />
    </nav>
  );
};
```

## Achievement System Functions

### checkLevelCompletionAchievements

Checks and awards achievements based on level completion.

```jsx
import { checkLevelCompletionAchievements } from "./utils/achievementSystem";

const newAchievements = await checkLevelCompletionAchievements(
  userId, // User ID
  chapterId, // Chapter ID (1-5)
  levelId, // Level ID
  score, // Final score (0-100)
  stats // Additional stats object
);

// stats object example:
const stats = {
  timeTaken: 120, // Time in seconds
  estimatedTime: 300, // Estimated time in seconds
  attempts: 1, // Number of attempts
  previousScore: 50, // Previous score (for comeback achievements)
};
```

**Returns:** Array of newly awarded achievement IDs

### getUserAchievements

Gets all achievements for a user.

```jsx
import { getUserAchievements } from "./utils/achievementSystem";

const achievements = await getUserAchievements(userId);

// Returns array of objects:
// [
//   {
//     achievement_name: 'heros_awakening',
//     achievement_type: 'milestone',
//     earned_at: '2024-01-15T10:30:00Z'
//   },
//   ...
// ]
```

## Styling and Customization

### Rarity Colors

Achievements have four rarity levels with distinct styling:

- **Common** - Gray colors, subtle effects
- **Uncommon** - Green colors, moderate glow
- **Rare** - Blue colors, strong glow
- **Legendary** - Yellow/gold colors, sparkle effects, maximum glow

### Animation Styles

Each achievement has a unique animation style defined in `achievementConfig.js`:

- `dramatic-entrance` - Bounce animation
- `radiant-glow` - Pulse animation
- `crystal-shine` - Ping animation
- `legendary-burst` - Bounce with extra effects
- And more...

### Custom Styling

All components accept a `className` prop for custom styling:

```jsx
<BadgeGallery badges={achievements} className="my-custom-styles" />
```

## Best Practices

1. **Always use AchievementNotificationContainer** - Don't render AchievementNotification directly
2. **Check for achievements after every level completion** - Use `checkLevelCompletionAchievements`
3. **Show multiple achievements with delay** - The system automatically staggers notifications
4. **Load achievements on component mount** - Use useEffect to load user achievements
5. **Update achievement displays after earning new ones** - Reload achievements after showing notifications
6. **Use AchievementIndicator in navbars** - Provides quick visual feedback
7. **Use BadgeGallery in profile pages** - Gives users a complete view of their achievements

## Troubleshooting

### Notifications not showing

- Ensure AchievementNotificationContainer is rendered in your component
- Check that the achievement ID exists in EPIC_ACHIEVEMENTS
- Verify the notification is being added to the notifications array

### Badges not displaying

- Verify achievement IDs are correct
- Check that getUserAchievements is returning data
- Ensure the user is logged in and has a valid user ID

### Achievement indicator not updating

- Make sure to reload achievements after earning new ones
- Check that the useEffect dependency array includes relevant props
- Verify getCurrentUserId() returns a valid user ID

## Related Files

- `src/utils/achievementSystem.js` - Achievement awarding logic
- `src/utils/achievementConfig.js` - Achievement definitions
- `src/hooks/useAchievementNotifications.js` - Notification management hook
- `src/components/AchievementSystemIntegrationExample.jsx` - Complete integration example

## Requirements

This achievement display system fulfills **Requirement 12.3**:

- Build AchievementNotification component with dramatic animations ✓
- Create BadgeGallery component to display earned achievements ✓
- Add achievement indicators to user profile ✓
