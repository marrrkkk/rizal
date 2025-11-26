# Achievement System Quick Reference

## 🚀 Quick Start (Copy & Paste)

### 1. Add to Game Component

```javascript
import { useAchievementNotifications } from "../hooks/useAchievementNotifications";
import AchievementNotificationContainer from "../components/AchievementNotificationContainer";
import { checkLevelCompletionAchievements } from "../utils/achievementSystem";

function YourGameComponent() {
  const { notifications, showAchievements, clearNotification } =
    useAchievementNotifications();

  const handleComplete = async (score) => {
    const userId = 1; // Get from auth context
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      1,
      1,
      score,
      { timeTaken: 60, estimatedTime: 120 }
    );
    if (newAchievements.length > 0) showAchievements(newAchievements);
  };

  return (
    <>
      {/* Your game UI */}
      <AchievementNotificationContainer
        notifications={notifications}
        onClearNotification={clearNotification}
      />
    </>
  );
}
```

### 2. Add Badge Gallery to Profile

```javascript
import BadgeGallery from "../components/BadgeGallery";
import { getUserAchievements } from "../utils/achievementSystem";

function ProfilePage() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    getUserAchievements(userId).then((achievements) =>
      setBadges(achievements.map((a) => a.achievement_name))
    );
  }, []);

  return <BadgeGallery badges={badges} />;
}
```

---

## 📋 All Achievement IDs

### Milestone

- `heros_awakening` - First level
- `knowledge_hunter` - 10 levels

### Chapter

- `dawn_of_destiny` - Chapter 1
- `scholars_resolve` - Chapter 2
- `wanderers_odyssey` - Chapter 3
- `pens_revolution` - Chapter 4
- `eternal_flame` - Chapter 5
- `path_of_enlightenment` - Any chapter

### Performance

- `flawless_victory` - Perfect score
- `lightning_strike` - Speed record
- `wisdoms_embrace` - 90% avg (5+ levels)
- `masters_touch` - 90% avg (10+ levels)
- `unstoppable_force` - 5 levels/session
- `iron_will` - 3+ attempts
- `rising_phoenix` - Comeback perfect

### Ultimate

- `legacy_unleashed` - All chapters
- `timeless_wisdom` - All chapter achievements
- `legend_reborn` - All levels 90%+

---

## 🔧 Core Functions

### Award Achievement

```javascript
import { awardAchievement } from "../utils/achievementSystem";
await awardAchievement(userId, "heros_awakening");
```

### Check Achievements (Auto)

```javascript
import { checkLevelCompletionAchievements } from "../utils/achievementSystem";
const newAchievements = await checkLevelCompletionAchievements(
  userId,
  chapterId,
  levelId,
  score,
  {
    timeTaken: 60, // seconds
    estimatedTime: 120, // seconds
    attempts: 1,
    previousScore: 0,
    hintsUsed: 0,
  }
);
```

### Get User Achievements

```javascript
import { getUserAchievements } from "../utils/achievementSystem";
const achievements = await getUserAchievements(userId);
// Returns: [{ achievement_name, achievement_type, earned_at }, ...]
```

### Check if Has Achievement

```javascript
import { hasAchievement } from "../utils/achievementSystem";
const hasIt = await hasAchievement(userId, "flawless_victory");
```

---

## 🎨 Component Props

### AchievementNotification

```javascript
<AchievementNotification
  achievementId="heros_awakening" // Required
  onClose={() => {}} // Required
  delay={0} // Optional (ms)
/>
```

### AchievementNotificationContainer

```javascript
<AchievementNotificationContainer
  notifications={[
    // Required
    { id: "1", achievementId: "heros_awakening", timestamp: Date.now() },
  ]}
  onClearNotification={(id) => {}} // Required
/>
```

### BadgeGallery

```javascript
<BadgeGallery
  badges={["heros_awakening", "flawless_victory"]} // Required
  className="custom-class" // Optional
/>
```

---

## 🎯 Automatic Triggers

| Condition             | Achievement       | Rarity        |
| --------------------- | ----------------- | ------------- |
| First level complete  | Hero's Awakening  | Common        |
| Score = 100%          | Flawless Victory  | Rare          |
| Time ≤ 50% estimated  | Lightning Strike  | Rare          |
| Attempts ≥ 3          | Iron Will         | Uncommon      |
| Fail then 100%        | Rising Phoenix    | Rare          |
| 10 levels done        | Knowledge Hunter  | Uncommon      |
| Chapter complete      | Chapter-specific  | Uncommon/Rare |
| All chapters done     | Legacy Unleashed  | Legendary     |
| Avg ≥ 90% (5 levels)  | Wisdom's Embrace  | Rare          |
| Avg ≥ 90% (10 levels) | Master's Touch    | Legendary     |
| 5 levels/session      | Unstoppable Force | Rare          |

---

## 🎭 Rarity Levels

| Rarity    | Border | Glow       | Special            |
| --------- | ------ | ---------- | ------------------ |
| Common    | Gray   | Standard   | -                  |
| Uncommon  | Green  | Green glow | -                  |
| Rare      | Blue   | Blue glow  | Enhanced animation |
| Legendary | Gold   | Gold glow  | ✨ Sparkles!       |

---

## 📦 Import Paths

```javascript
// Configuration
import { EPIC_ACHIEVEMENTS, RARITY_CONFIG } from "../utils/achievementConfig";

// System Functions
import {
  awardAchievement,
  hasAchievement,
  getUserAchievements,
  checkLevelCompletionAchievements,
  checkSessionAchievements,
} from "../utils/achievementSystem";

// Components
import AchievementNotification from "../components/AchievementNotification";
import AchievementNotificationContainer from "../components/AchievementNotificationContainer";
import BadgeGallery from "../components/BadgeGallery";

// Hook
import { useAchievementNotifications } from "../hooks/useAchievementNotifications";
```

---

## 🐛 Common Issues

### Achievements not showing?

1. Check database is initialized
2. Verify userId is correct
3. Check console for errors
4. Ensure `AchievementNotificationContainer` is rendered

### Duplicate achievements?

- System prevents duplicates automatically
- Check you're not calling `awardAchievement` multiple times

### Notifications not clearing?

- Ensure `onClearNotification` callback is connected
- Check notification IDs are unique

---

## 📊 Database Queries

### Get achievement count

```javascript
const result = await executeQuery(
  "SELECT COUNT(*) as count FROM achievements WHERE user_id = ?",
  [userId]
);
```

### Get achievements by type

```javascript
const result = await executeQuery(
  "SELECT * FROM achievements WHERE user_id = ? AND achievement_type = ?",
  [userId, "legendary"]
);
```

### Check if earned

```javascript
const result = await executeQuery(
  "SELECT id FROM achievements WHERE user_id = ? AND achievement_name = ?",
  [userId, "heros_awakening"]
);
const hasIt = result.length > 0;
```

---

## 🎮 Testing

### Test in Demo Component

```javascript
import AchievementSystemDemo from "../components/AchievementSystemDemo";
// Render this component to test all achievements
```

### Manual Award for Testing

```javascript
import { awardAchievement } from "../utils/achievementSystem";
await awardAchievement(userId, "legacy_unleashed"); // Test legendary!
```

---

## 📝 Notes

- Achievements are saved to SQLite database
- Notifications auto-dismiss after 5 seconds
- Multiple achievements are staggered by 500ms
- Legendary achievements have extra sparkle effects
- All components are responsive and mobile-friendly
- System is child-friendly with encouraging language

---

## 🔗 Related Files

- **Config**: `src/utils/achievementConfig.js`
- **System**: `src/utils/achievementSystem.js`
- **Components**: `src/components/Achievement*.jsx`
- **Hook**: `src/hooks/useAchievementNotifications.js`
- **Docs**: `src/utils/ACHIEVEMENT_SYSTEM_README.md`
- **Visual Guide**: `src/utils/ACHIEVEMENT_VISUAL_GUIDE.md`
- **Demo**: `src/components/AchievementSystemDemo.jsx`
