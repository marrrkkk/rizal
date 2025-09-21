# Level Unlocking Debug Guide

## 🐛 **Issue: Level 2 Not Unlocking After Completing Level 1**

The issue where Level 2 doesn't unlock after completing Level 1 in Chapter 1 is likely due to one of these problems:

## 🔍 **Debugging Steps**

### 1. **Check Database Tables**

The progress system requires these tables:

- `user_progress` - Tracks level unlocking and completion
- `user_badges` - Stores earned badges
- `user_statistics` - Overall progress tracking

### 2. **Check JWT Token Issues**

Fixed JWT function name mismatch:

- ❌ `verifyJWT()` (was being called)
- ✅ `validateJWT()` (actual function name)

### 3. **Check User Initialization**

New users need Chapter 1, Level 1 unlocked by default.

### 4. **Check API Endpoints**

Verify these endpoints are accessible:

- `POST /api/progress/initialize_progress.php`
- `POST /api/progress/complete_level.php`
- `GET /api/progress/get_progress.php`

## 🔧 **Fixes Applied**

### 1. **JWT Function Name Fix**

```php
// Fixed in all API files:
$username = validateJWT($jwt); // Was: verifyJWT($jwt)
```

### 2. **Enhanced Debugging**

Added comprehensive logging to:

- `src/utils/progressAPI.js` - API calls
- `src/hooks/useProgressAPI.js` - Hook processing
- `src/App.jsx` - Level completion flow

### 3. **Debug Tools Created**

- `ProgressDebugger.jsx` - Frontend debugging component
- `fix_progress_system.php` - Backend fix script
- `check_database.php` - Database verification script

## 🚀 **Quick Fix Instructions**

### Step 1: Use the Debug Component

1. Log into the app
2. Click "Debug Progress" button (top-left)
3. Check if progress data is loading
4. Click "🔧 Fix Progress System" button

### Step 2: Manual Database Setup (if needed)

```sql
-- Run this SQL in your MySQL database:
SOURCE backend/rizal/api/init_progress_tables.sql;

-- Or manually create tables and initialize:
INSERT IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
SELECT id, 1, 1, TRUE FROM users;
```

### Step 3: Test Level Completion

1. Complete Level 1 in Chapter 1
2. Check browser console for debug logs
3. Verify Level 2 becomes unlocked

## 🔍 **Debug Console Output**

Look for these console messages:

```
🎮 Attempting to complete Level 1 of Chapter 1 with score 85
🌐 Sending request to complete level 1-1
🌐 Response data: {success: true, nextLevelUnlocked: {chapter: 1, level: 2}}
📡 API Success, reloading progress...
✅ User username: Level 1 of Chapter 1 completed with score 85!
🔓 Next level unlocked: {chapter: 1, level: 2}
```

## 🎯 **Expected Behavior After Fix**

### Level 1 Completion Flow:

1. **User completes Level 1** → Game calls `onComplete(score, timeSpent)`
2. **API processes completion** → Updates database, unlocks Level 2
3. **Success notifications** → Toast: "🎉 Level 1 completed!"
4. **Unlock notification** → Toast: "🔓 Level 2 unlocked!"
5. **Quick action button** → Floating "Next Level" button appears
6. **User clicks button** → Navigates to `/chapter/1/level/2`

### Database State After Level 1:

```sql
-- user_progress table should show:
user_id | chapter_id | level_id | is_unlocked | is_completed | score
   1    |     1      |    1     |    TRUE     |    TRUE      |  85
   1    |     1      |    2     |    TRUE     |    FALSE     |   0
```

## 🛠 **Common Issues & Solutions**

### Issue 1: "Authorization token required"

**Solution:** User needs to be logged in with valid JWT token

### Issue 2: "Database connection failed"

**Solution:** Check MySQL server is running and credentials in `db.php`

### Issue 3: "Table doesn't exist"

**Solution:** Run the SQL initialization script

### Issue 4: "Level is not unlocked"

**Solution:** Initialize user progress with Level 1-1 unlocked

### Issue 5: API returns success but UI doesn't update

**Solution:** Check if `loadProgress()` is being called after completion

## 📱 **Testing on Different Scenarios**

### New User Test:

1. Register new account
2. Should have Level 1-1 unlocked only
3. Complete Level 1-1
4. Should unlock Level 1-2

### Existing User Test:

1. Login with existing account
2. Run fix script if needed
3. Complete any unlocked level
4. Should unlock next level in sequence

### Chapter Completion Test:

1. Complete all 5 levels in Chapter 1
2. Should unlock Chapter 2, Level 1
3. Should award "Chapter 1 Master" badge

## 🔧 **Manual Fix Commands**

If the automatic fix doesn't work, run these SQL commands:

```sql
-- 1. Ensure tables exist
SOURCE backend/rizal/api/init_progress_tables.sql;

-- 2. Initialize specific user (replace USER_ID)
INSERT IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
VALUES (USER_ID, 1, 1, TRUE);

-- 3. Test level completion (replace USER_ID)
UPDATE user_progress
SET is_completed = TRUE, score = 85
WHERE user_id = USER_ID AND chapter_id = 1 AND level_id = 1;

INSERT IGNORE INTO user_progress (user_id, chapter_id, level_id, is_unlocked)
VALUES (USER_ID, 1, 2, TRUE);

-- 4. Verify results
SELECT * FROM user_progress WHERE user_id = USER_ID ORDER BY chapter_id, level_id;
```

## ✅ **Success Indicators**

The system is working correctly when:

1. ✅ Debug component shows progress data loading
2. ✅ Level 1-1 shows as unlocked initially
3. ✅ Completing Level 1-1 shows success in console
4. ✅ Level 1-2 becomes unlocked after completion
5. ✅ Quick "Next Level" button appears
6. ✅ Clicking button navigates to Level 1-2

The level unlocking system should now work properly with persistent database storage and real-time UI updates!
