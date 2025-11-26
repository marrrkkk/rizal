# Level Unlocking System - Quick Reference

## 🚀 Quick Start

### Import Functions

```javascript
import {
  unlockNextLevel,
  markLevelCompleted,
  checkLevelUnlocked,
  validateLevelAccess,
  initializeFirstLevel,
} from "./utils/levelUnlocking.js";
```

## 📋 Common Use Cases

### 1. New User Registration

```javascript
await initializeFirstLevel(userId);
```

### 2. Complete a Level

```javascript
// Step 1: Mark as completed
await markLevelCompleted(userId, chapterId, levelId, score, finalScore);

// Step 2: Unlock next level
const result = await unlockNextLevel(userId, chapterId, levelId);

// Step 3: Show notifications
if (result.nextLevelUnlocked) {
  showNotification(`Level ${result.nextLevelUnlocked.level} unlocked!`);
}
```

### 3. Check if User Can Access Level

```javascript
const validation = await validateLevelAccess(userId, chapterId, levelId);
if (!validation.canAccess) {
  alert(validation.message);
  return;
}
// Proceed with level
```

### 4. Check if Level is Unlocked

```javascript
const isUnlocked = await checkLevelUnlocked(userId, chapterId, levelId);
if (isUnlocked) {
  // Show "Play" button
} else {
  // Show "Locked" icon
}
```

## 🎯 Function Reference

| Function                                                            | Purpose                             | Returns                                                                 |
| ------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `unlockNextLevel(userId, chapterId, levelId)`                       | Unlock next level after completion  | `{ success, nextLevelUnlocked, nextChapterUnlocked, chapterCompleted }` |
| `markLevelCompleted(userId, chapterId, levelId, score, finalScore)` | Mark level as completed             | `boolean`                                                               |
| `checkLevelUnlocked(userId, chapterId, levelId)`                    | Check if level is unlocked          | `boolean`                                                               |
| `checkChapterUnlocked(userId, chapterId)`                           | Check if chapter is unlocked        | `boolean`                                                               |
| `validateLevelAccess(userId, chapterId, levelId)`                   | Validate user can access level      | `{ valid, canAccess, message, requiredLevel? }`                         |
| `getChapterUnlockStatus(userId, chapterId)`                         | Get all level statuses for chapter  | `{ chapterId, chapterName, totalLevels, levels }`                       |
| `initializeFirstLevel(userId)`                                      | Initialize first level for new user | `boolean`                                                               |

## 🔄 Typical Flow

```
User Completes Game
        ↓
Calculate Final Score
        ↓
Mark Level Completed
        ↓
Unlock Next Level
        ↓
Show Notifications
```

## ⚠️ Important Rules

1. **Always mark level as completed BEFORE unlocking next level**

   ```javascript
   // ✅ Correct
   await markLevelCompleted(userId, chapterId, levelId, score, finalScore);
   await unlockNextLevel(userId, chapterId, levelId);

   // ❌ Wrong
   await unlockNextLevel(userId, chapterId, levelId); // Will fail!
   ```

2. **Always validate access before starting a level**

   ```javascript
   // ✅ Correct
   const validation = await validateLevelAccess(userId, chapterId, levelId);
   if (validation.canAccess) {
     startLevel();
   }

   // ❌ Wrong
   startLevel(); // User might access locked level!
   ```

3. **Chapter 1, Level 1 is always accessible**
   - No need to check for first level
   - Automatically unlocked for new users

## 🎮 React Component Example

```javascript
function GameCompletionHandler({ userId, chapterId, levelId }) {
  const handleComplete = async (gameState, levelConfig) => {
    // Calculate score
    const finalScore = calculateFinalScore(gameState, levelConfig);

    // Mark completed
    await markLevelCompleted(
      userId,
      chapterId,
      levelId,
      gameState.score,
      finalScore
    );

    // Unlock next
    const result = await unlockNextLevel(userId, chapterId, levelId);

    // Show notifications
    if (result.success) {
      if (result.nextLevelUnlocked) {
        toast.success(`Level ${result.nextLevelUnlocked.level} Unlocked!`);
      }
      if (result.nextChapterUnlocked) {
        toast.success(
          `Chapter ${result.nextChapterUnlocked.chapter} Unlocked!`
        );
      }
      if (result.chapterCompleted) {
        showCelebration();
      }
    }
  };

  return <GameComponent onComplete={handleComplete} />;
}
```

## 🔍 Debugging

### Check User Progress

```javascript
const status = await getChapterUnlockStatus(userId, chapterId);
console.log("Chapter Status:", status);
```

### Run Manual Tests

```javascript
import { testLevelUnlocking } from "./utils/testLevelUnlockingManual.js";
await testLevelUnlocking();
```

### Common Issues

**Issue**: Next level doesn't unlock

- **Fix**: Ensure `markLevelCompleted()` was called first

**Issue**: User can access locked levels

- **Fix**: Add `validateLevelAccess()` check before level start

**Issue**: Chapter doesn't unlock

- **Fix**: Verify all 5 levels in chapter are completed

## 📊 Database Queries

### Check Progress

```sql
SELECT * FROM user_progress
WHERE user_id = ?
ORDER BY chapter_id, level_id;
```

### Reset User Progress (Testing)

```sql
DELETE FROM user_progress WHERE user_id = ?;
```

### Unlock All Levels (Testing)

```sql
UPDATE user_progress
SET is_unlocked = 1
WHERE user_id = ?;
```

## 🎨 UI States

```javascript
// Level Card States
if (level.completed) {
  // Show: ✅ Completed, Score: X, "Replay" button
} else if (level.unlocked) {
  // Show: 🔓 Unlocked, "Play" button
} else {
  // Show: 🔒 Locked, "Complete previous level" message
}
```

## 📚 Documentation Files

- **LEVEL_UNLOCKING_SYSTEM.md** - Complete documentation
- **LEVEL_UNLOCKING_FLOW.md** - Visual flow diagrams
- **levelUnlockingIntegrationExample.js** - Code examples
- **TASK_16.1_IMPLEMENTATION_SUMMARY.md** - Implementation details

## 🧪 Testing

### Automated Tests

```bash
npm install -D vitest
npm test
```

### Manual Tests

Open browser console and run:

```javascript
import { testLevelUnlocking } from "./utils/testLevelUnlockingManual.js";
await testLevelUnlocking();
```

## 💡 Tips

1. **Use helper functions** from `levelUnlockingIntegrationExample.js`
2. **Check unlock status** before rendering level cards
3. **Show clear messages** when levels are locked
4. **Celebrate achievements** when chapters are completed
5. **Test thoroughly** with multiple users and scenarios

## 🔗 Related Systems

- **Score Calculation**: `src/utils/scoreCalculation.js`
- **Progress Management**: `src/utils/progressManager.js`
- **Database**: `src/utils/database.js`
- **Authentication**: `src/utils/auth.js`

---

**Need Help?** Check the full documentation in `LEVEL_UNLOCKING_SYSTEM.md`
