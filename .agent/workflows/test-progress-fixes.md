---
description: Test that level progress saves and unlocks work correctly
---

# Testing Progress Fixes

Follow these steps to verify that the progress saving and level unlocking fixes are working correctly.

## Prerequisites

// turbo
1. Ensure the server is running: `npm run dev`
2. Open the application in your browser: `http://localhost:5173`
3. Log in with your test account (or create a new one)

## Test Chapter 2 (Previously Broken)

### Level 3 - Achievements Game
1. Navigate to Chapter 2
2. Click on Level 3 (Achievements Game)
3. Complete the game by matching all achievements
4. **Expected Result:**
   - Completion modal appears
   - Score shows 100
   - Level 4 is now unlocked
   - Progress is saved (refresh page to verify)

### Level 4 - Literary Works Game
1. Click on Level 4 (Literary Works Game)
2. Complete the game by matching all literary works
3. **Expected Result:**
   - Completion modal appears
   - Score shows 100
   - Level 5 is now unlocked

### Level 5 - Education Puzzle Game
1. Click on Level 5 (Education Puzzle Game)
2. Complete the puzzle
3. **Expected Result:**
   - Completion modal appears
   - Score shows 100
   - Chapter 3 is now unlocked (if all Chapter 2 levels are complete)

## Test Chapter 3 (Score Handling)

### Level 1 - European Journey Game
1. Navigate to Chapter 3
2. Click on Level 1 (European Journey Game)
3. Answer all questions (try to get some right and some wrong)
4. **Expected Result:**
   - Completion modal appears
   - Score reflects your performance (not just 0 or 100)
   - Level 2 is unlocked

### Level 2 - Literary Crossword Game
1. Click on Level 2 (Literary Crossword Game)
2. Complete the crossword
3. **Expected Result:**
   - Completion modal appears
   - Score shows 100 (default for completion)
   - Level 3 is unlocked

## Test Progress Persistence

1. Complete any level
2. Note the score and unlocked levels
3. **Refresh the page** (F5)
4. **Expected Result:**
   - Completed levels still show as completed
   - Unlocked levels are still unlocked
   - Scores are preserved

## Test Chapter Unlocking

1. Complete all 5 levels of any chapter
2. **Expected Result:**
   - A "New Chapter Unlocked" notification appears
   - The next chapter becomes accessible
   - Badge awarded for chapter completion

## Verify Database

You can check the database directly to verify progress is being saved:

1. Stop the server (Ctrl+C)
2. Open `backend/rizal.db` with SQLite browser or command line
3. Query: `SELECT * FROM user_progress WHERE user_id = 1;`
4. **Expected Result:**
   - Rows exist for completed levels
   - `is_completed = 1` for finished levels
   - `is_unlocked = 1` for accessible levels
   - `score` values are saved correctly

## Common Issues

### Issue: Level doesn't unlock after completion
**Solution:**
- Check browser console for errors
- Verify you're logged in (check localStorage for token)
- Try logging out and back in
- Check server logs for API errors

### Issue: Score shows as 0
**Solution:**
- This is expected for some games that don't calculate variable scores
- The fix ensures a default score of 100 is used
- If you see 0, the game might need updating

### Issue: Progress doesn't persist after refresh
**Solution:**
- Check that backend server is running
- Verify database file exists at `backend/rizal.db`
- Check browser console for API errors
- Clear localStorage and log in again

## Success Criteria

✅ All Chapter 2 levels (3-5) save progress correctly  
✅ Scores are saved (100 or calculated value)  
✅ Next levels unlock automatically  
✅ Progress persists after page refresh  
✅ Chapter 3+ levels work correctly  
✅ Completion modals appear with correct information  
✅ Database contains correct progress records  

If all tests pass, the progress system is working correctly!
