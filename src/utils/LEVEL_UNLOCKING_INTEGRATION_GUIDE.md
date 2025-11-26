# Level Unlocking System Integration Guide

This guide explains how to integrate the new level unlocking system into your application.

## Overview

The level unlocking system provides:

- Sequential level unlocking (complete level N to unlock level N+1)
- Chapter unlocking (complete all levels in chapter N to unlock chapter N+1)
- Validation to prevent skipping levels
- Visual notifications when levels/chapters are unlocked
- Database-backed unlock status

## Components

### 1. Core Utilities (`src/utils/levelUnlocking.js`)

```javascript
import {
  unlockNextLevel,
  checkLevelUnlocked,
  validateLevelAccess,
  getChapterUnlockStatus,
  initializeFirstLevel,
} from "../utils/levelUnlocking";
```

**Key Functions:**

- `unlockNextLevel(userId, chapterId, levelId)` - Unlocks next level after completion
- `checkLevelUnlocked(userId, chapterId, levelId)` - Check if level is unlocked
- `validateLevelAccess(userId, chapterId, levelId)` - Validate user can access level
- `getChapterUnlockStatus(userId, chapterId)` - Get all level statuses for a chapter
- `initializeFirstLevel(userId)` - Initialize first level for new users

### 2. Notification Components

```javascript
import LevelUnlockNotification from "../components/LevelUnlockNotification";
import ChapterUnlockNotification from "../components/ChapterUnlockNotification";
```

### 3. Notification Hook

```javascript
import { useUnlockNotifications } from "../hooks/useUnlockNotifications";
```

## Integration Steps

### Step 1: Update Score Persistence

The `saveFinalScore` function in `src/utils/scorePersistence.js` now automatically calls `unlockNextLevel` after saving a score. This is already integrated!

```javascript
// In scorePersistence.js (already done)
const unlockResult = await unlockNextLevel(userId, chapterId, levelId);
```

### Step 2: Show Unlock Notifications in App.jsx

Add unlock notifications to your main App component:

```javascript
import { useUnlockNotifications } from "./hooks/useUnlockNotifications";
import LevelUnlockNotification from "./components/LevelUnlockNotification";
import ChapterUnlockNotification from "./components/ChapterUnlockNotification";

function App() {
  const {
    levelUnlock,
    chapterUnlock,
    showLevelUnlock,
    showChapterUnlock,
    clearLevelUnlock,
    clearChapterUnlock,
  } = useUnlockNotifications();

  // When a level is completed and score is saved
  const handleLevelComplete = async (chapterId, levelId, score) => {
    // ... save score logic ...

    // The unlockResult comes from saveFinalScore
    if (unlockResult.success) {
      if (unlockResult.nextLevelUnlocked) {
        showLevelUnlock(
          unlockResult.nextLevelUnlocked.chapter,
          unlockResult.nextLevelUnlocked.level,
          unlockResult.nextLevelUnlocked.chapterName
        );
      }

      if (unlockResult.nextChapterUnlocked) {
        showChapterUnlock(
          unlockResult.nextChapterUnlocked.chapter,
          unlockResult.nextChapterUnlocked.chapterName
        );
      }
    }
  };

  return (
    <div>
      {/* Your app content */}

      {/* Unlock notifications */}
      {levelUnlock && (
        <LevelUnlockNotification
          chapter={levelUnlock.chapter}
          level={levelUnlock.level}
          chapterName={levelUnlock.chapterName}
          onClose={clearLevelUnlock}
        />
      )}

      {chapterUnlock && (
        <ChapterUnlockNotification
          chapter={chapterUnlock.chapter}
          chapterName={chapterUnlock.chapterName}
          onClose={clearChapterUnlock}
        />
      )}
    </div>
  );
}
```

### Step 3: Update Chapter Pages

Use the database-backed unlock status in chapter pages:

```javascript
import {
  getChapterUnlockStatus,
  validateLevelAccess,
} from "../utils/levelUnlocking";
import { getUser } from "../utils/auth";

function ChapterPage() {
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserId(user.id);
      loadUnlockStatus(user.id);
    }
  }, []);

  const loadUnlockStatus = async (uid) => {
    const status = await getChapterUnlockStatus(uid, chapterId);
    setUnlockStatus(status);
  };

  const handleLevelClick = async (levelId) => {
    if (!userId) return;

    const validation = await validateLevelAccess(userId, chapterId, levelId);

    if (validation.canAccess) {
      // Navigate to level
      navigate(`/chapter/${chapterId}/level/${levelId}`);
    } else {
      // Show error message
      alert(validation.message);
    }
  };

  return (
    <div>
      {levels.map((level) => {
        const levelStatus = unlockStatus?.levels?.[level.id];
        const isUnlocked = levelStatus?.unlocked || false;
        const isCompleted = levelStatus?.completed || false;
        const score = levelStatus?.finalScore || 0;

        return (
          <LevelCard
            key={level.id}
            level={level.id}
            title={level.title}
            description={level.description}
            isUnlocked={isUnlocked}
            isCompleted={isCompleted}
            score={score}
            chapterId={chapterId}
            onClick={() => handleLevelClick(level.id)}
          />
        );
      })}
    </div>
  );
}
```

### Step 4: Initialize First Level for New Users

When a user registers or first logs in:

```javascript
import { initializeFirstLevel } from "../utils/levelUnlocking";

const handleUserRegistration = async (userId) => {
  // ... registration logic ...

  // Initialize first level
  await initializeFirstLevel(userId);
};
```

## Example: Complete Game Completion Flow

Here's a complete example of handling game completion with unlocking:

```javascript
import { handleGameCompletion } from "../utils/gameCompletionHandler";
import { useUnlockNotifications } from "../hooks/useUnlockNotifications";

function GameComponent({ chapterId, levelId, userId }) {
  const { showLevelUnlock, showChapterUnlock } = useUnlockNotifications();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleComplete = async (score, timeSpent, gameState) => {
    // Calculate and save final score (this also unlocks next level)
    const result = await handleGameCompletion({
      userId,
      chapterId,
      levelId,
      score,
      gameState,
      levelConfig: {
        type: "quiz",
        estimatedTime: 300,
      },
    });

    if (result.success) {
      // Show completion modal
      setShowCompletionModal(true);

      // Show unlock notifications
      const unlockResult = result.unlockResult;
      if (unlockResult?.nextLevelUnlocked) {
        setTimeout(() => {
          showLevelUnlock(
            unlockResult.nextLevelUnlocked.chapter,
            unlockResult.nextLevelUnlocked.level,
            unlockResult.nextLevelUnlocked.chapterName
          );
        }, 1000);
      }

      if (unlockResult?.nextChapterUnlocked) {
        setTimeout(() => {
          showChapterUnlock(
            unlockResult.nextChapterUnlocked.chapter,
            unlockResult.nextChapterUnlocked.chapterName
          );
        }, 2000);
      }
    }
  };

  return (
    <div>
      {/* Game content */}

      {showCompletionModal && (
        <LevelCompletionModal
          score={finalScore}
          nextLevelUnlocked={unlockResult?.nextLevelUnlocked}
          nextChapterUnlocked={unlockResult?.nextChapterUnlocked}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}
```

## Visual Indicators

The `LevelCard` component provides visual indicators for:

- **Locked levels**: Gray overlay with lock icon and unlock requirement message
- **Unlocked levels**: Colored theme with "Ready" badge and play button
- **Completed levels**: Green checkmark, completion badge, and score display
- **Recently unlocked**: "NEW!" badge for recently unlocked levels

## Database Schema

The system uses the `user_progress` table:

```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  chapter_id INTEGER NOT NULL,
  level_id INTEGER NOT NULL,
  is_unlocked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  final_score INTEGER,
  completion_date DATETIME NULL,
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, chapter_id, level_id)
);
```

## Testing

To test the unlocking system:

1. Complete a level and verify next level unlocks
2. Complete all levels in a chapter and verify next chapter unlocks
3. Try to access a locked level and verify validation prevents access
4. Check that unlock notifications appear correctly
5. Verify unlock status persists across sessions

## Troubleshooting

**Issue**: Levels not unlocking after completion

- Check that `saveFinalScore` is being called with correct parameters
- Verify database is initialized with `initDatabase()`
- Check console for error messages from `unlockNextLevel`

**Issue**: Unlock notifications not showing

- Verify `useUnlockNotifications` hook is used in parent component
- Check that notification components are rendered in the component tree
- Ensure `showLevelUnlock` or `showChapterUnlock` is called after completion

**Issue**: User can access locked levels

- Use `validateLevelAccess` before allowing navigation
- Check that level click handlers respect unlock status
- Verify database has correct unlock status

## Best Practices

1. Always validate level access before allowing navigation
2. Show clear unlock requirements on locked levels
3. Provide visual feedback when levels are unlocked
4. Initialize first level for new users
5. Handle errors gracefully and provide user feedback
6. Test unlock flow thoroughly across all chapters
