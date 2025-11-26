# Level Unlocking System

## Overview

The level unlocking system implements sequential progression through the José Rizal educational app, ensuring students learn content in the proper order. This system validates **Requirements 9.2** (sequential level unlocking) and **9.3** (chapter unlocking on completion).

## Architecture

### Database Schema

The system uses the `user_progress` table in SQLite:

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
)
```

### Chapter Configuration

The system supports 6 chapters, each with 5 levels:

```javascript
const CHAPTER_CONFIG = {
  1: { totalLevels: 5, name: "Childhood in Calamba" },
  2: { totalLevels: 5, name: "Education in Manila" },
  3: { totalLevels: 5, name: "Studies Abroad" },
  4: { totalLevels: 5, name: "Noli Me Tangere" },
  5: { totalLevels: 5, name: "Return to the Philippines" },
  6: { totalLevels: 5, name: "Exile and Legacy" },
};
```

## Core Functions

### 1. `unlockNextLevel(userId, chapterId, levelId)`

**Purpose**: Unlocks the next level in sequence after completing a level.

**Requirements Validated**:

- **9.2**: Sequential level unlocking
- **9.3**: Chapter unlocking on completion

**Logic Flow**:

1. Validates that the current level is completed
2. If not the last level in chapter:
   - Unlocks the next level in the same chapter
3. If last level in chapter:
   - Checks if all levels in chapter are completed
   - If yes, unlocks the first level of the next chapter
   - Marks chapter as completed

**Returns**:

```javascript
{
  success: boolean,
  nextLevelUnlocked: { chapter, level, chapterName } | null,
  nextChapterUnlocked: { chapter, level, chapterName } | null,
  chapterCompleted: boolean,
  error?: string
}
```

**Example Usage**:

```javascript
// After completing Chapter 1, Level 1
await markLevelCompleted(userId, 1, 1, 85, 90);
const result = await unlockNextLevel(userId, 1, 1);

// Result:
// {
//   success: true,
//   nextLevelUnlocked: { chapter: 1, level: 2, chapterName: "Childhood in Calamba" },
//   nextChapterUnlocked: null,
//   chapterCompleted: false
// }
```

### 2. `markLevelCompleted(userId, chapterId, levelId, score, finalScore)`

**Purpose**: Marks a level as completed with scores.

**Logic**:

- Updates or inserts progress record
- Sets `is_completed = 1`
- Stores score and final_score
- Sets completion_date

**Example Usage**:

```javascript
await markLevelCompleted(userId, 1, 1, 85, 90);
```

### 3. `checkLevelUnlocked(userId, chapterId, levelId)`

**Purpose**: Checks if a specific level is unlocked for a user.

**Returns**: `boolean`

**Example Usage**:

```javascript
const isUnlocked = await checkLevelUnlocked(userId, 1, 2);
if (isUnlocked) {
  // Allow user to play level
}
```

### 4. `checkChapterUnlocked(userId, chapterId)`

**Purpose**: Checks if a chapter has any unlocked levels.

**Returns**: `boolean`

**Example Usage**:

```javascript
const isChapterUnlocked = await checkChapterUnlocked(userId, 2);
if (isChapterUnlocked) {
  // Show chapter in navigation
}
```

### 5. `validateLevelAccess(userId, chapterId, levelId)`

**Purpose**: Validates that a user can access a level (prevents skipping).

**Requirements Validated**: **9.2** (prevent skipping levels)

**Logic**:

- Chapter 1, Level 1 is always accessible
- Other levels must be unlocked
- Returns required level if access is denied

**Returns**:

```javascript
{
  valid: boolean,
  canAccess: boolean,
  message: string,
  requiredLevel?: { chapter, level }
}
```

**Example Usage**:

```javascript
const validation = await validateLevelAccess(userId, 1, 3);
if (!validation.canAccess) {
  alert(
    `Please complete Chapter ${validation.requiredLevel.chapter}, Level ${validation.requiredLevel.level} first`
  );
}
```

### 6. `getChapterUnlockStatus(userId, chapterId)`

**Purpose**: Gets complete unlock status for all levels in a chapter.

**Returns**:

```javascript
{
  chapterId: number,
  chapterName: string,
  totalLevels: number,
  levels: {
    1: { unlocked: boolean, completed: boolean, score: number, finalScore: number },
    2: { ... },
    // ... for all levels
  }
}
```

**Example Usage**:

```javascript
const status = await getChapterUnlockStatus(userId, 1);
console.log(
  `Chapter 1: ${status.levels[1].completed ? "Completed" : "In Progress"}`
);
```

### 7. `initializeFirstLevel(userId)`

**Purpose**: Initializes the first level for a new user.

**Logic**:

- Unlocks Chapter 1, Level 1
- Called during user registration or first login

**Example Usage**:

```javascript
// After user registration
await initializeFirstLevel(newUserId);
```

## Integration Guide

### Game Completion Flow

When a game is completed, follow this sequence:

```javascript
import { markLevelCompleted, unlockNextLevel } from "./utils/levelUnlocking.js";
import { calculateFinalScore } from "./utils/scoreCalculation.js";

async function handleGameCompletion(userId, chapterId, levelId, gameState) {
  // 1. Calculate final score
  const finalScore = calculateFinalScore(gameState, levelConfig);

  // 2. Mark level as completed
  await markLevelCompleted(
    userId,
    chapterId,
    levelId,
    gameState.score,
    finalScore
  );

  // 3. Unlock next level
  const unlockResult = await unlockNextLevel(userId, chapterId, levelId);

  // 4. Show appropriate notifications
  if (unlockResult.nextLevelUnlocked) {
    showNotification(`Level ${unlockResult.nextLevelUnlocked.level} unlocked!`);
  }

  if (unlockResult.nextChapterUnlocked) {
    showNotification(
      `Chapter ${unlockResult.nextChapterUnlocked.chapter} unlocked!`
    );
  }

  if (unlockResult.chapterCompleted) {
    showChapterCompletionCelebration();
  }
}
```

### Level Access Control

Before allowing a user to start a level:

```javascript
import { validateLevelAccess } from "./utils/levelUnlocking.js";

async function canStartLevel(userId, chapterId, levelId) {
  const validation = await validateLevelAccess(userId, chapterId, levelId);

  if (!validation.canAccess) {
    const required = validation.requiredLevel;
    alert(
      `Complete Chapter ${required.chapter}, Level ${required.level} first!`
    );
    return false;
  }

  return true;
}
```

### Chapter Navigation

Display chapters based on unlock status:

```javascript
import { checkChapterUnlocked } from "./utils/levelUnlocking.js";

async function renderChapterList(userId) {
  const chapters = [];

  for (let chapterId = 1; chapterId <= 6; chapterId++) {
    const isUnlocked = await checkChapterUnlocked(userId, chapterId);

    chapters.push({
      id: chapterId,
      name: CHAPTER_CONFIG[chapterId].name,
      unlocked: isUnlocked,
      locked: !isUnlocked,
    });
  }

  return chapters;
}
```

## Testing

### Manual Testing

Use the manual test script:

```javascript
import { testLevelUnlocking } from "./utils/testLevelUnlockingManual.js";

// In browser console
await testLevelUnlocking();
```

### Test Scenarios

1. **First Level Access**: New user can access Chapter 1, Level 1
2. **Sequential Unlocking**: Completing a level unlocks the next level
3. **Chapter Completion**: Completing all levels unlocks next chapter
4. **Access Prevention**: Cannot access locked levels
5. **Validation**: System prevents skipping levels

## Error Handling

The system handles various error cases:

- **Invalid Chapter ID**: Returns error message
- **Level Not Completed**: Prevents unlocking next level
- **Database Errors**: Catches and logs errors
- **Missing Data**: Handles missing progress records

## Performance Considerations

- **Database Queries**: Optimized with proper indexing on `(user_id, chapter_id, level_id)`
- **Caching**: Consider caching unlock status for frequently accessed data
- **Batch Operations**: Use transactions for multiple updates

## Future Enhancements

Potential improvements:

1. **Parallel Paths**: Allow multiple unlocked levels at once
2. **Prerequisites**: Complex dependency graphs
3. **Temporary Unlocks**: Time-limited access to preview levels
4. **Admin Override**: Allow admins to unlock levels manually
5. **Progress Sync**: Sync progress across devices

## Troubleshooting

### Common Issues

**Issue**: Level doesn't unlock after completion

- **Solution**: Verify `markLevelCompleted` was called before `unlockNextLevel`

**Issue**: User can access locked levels

- **Solution**: Ensure `validateLevelAccess` is called before level start

**Issue**: Chapter doesn't unlock after completing all levels

- **Solution**: Check that all 5 levels are marked as completed in database

## References

- **Requirements**: See `.kiro/specs/rizal-app-improvements/requirements.md`
- **Design**: See `.kiro/specs/rizal-app-improvements/design.md`
- **Database Schema**: See `src/utils/database.js`
