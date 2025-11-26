# IMPORTANT: How to Fix Progress Not Saving

## Current Status

The app is now using the Node.js backend for ALL authentication and progress tracking. However, you're experiencing issues with progress not updating after completing levels.

## Root Cause

The backend server needs to be running for progress to save. When you complete a level, the frontend calls:
1. `completeUserLevel(chapter, level, score, timeSpent)` in App.jsx
2. Which calls `completeLevel()` from useProgressAPI hook  
3. Which calls the backend API at `http://localhost:3000/api/progress/complete_level`
4. The backend saves to SQLite and returns unlock information
5. The frontend refreshes progress data

## How to Verify Everything is Working

### 1. Check if Backend Server is Running

Open your browser DevTools (F12) → Network tab and look for requests to:
- `http://localhost:3000/api/progress/get_progress` (should return 200 OK)
- `http://localhost:3000/api/progress/complete_level` (when you complete a level)

If you see **403 Forbidden** or **Network Error**, the server isn't running or there's an authentication issue.

### 2. Check Server Logs

Look at the terminal where `npm run dev` is running. You should see:
```
Connected to the SQLite database.
Server running on http://localhost:3000
```

### 3. Test the Flow

1. **Log in** to the app
2. **Open DevTools** (F12) → Console tab
3. **Complete Chapter 1, Level 1**
4. **Watch the console** for these messages:
   ```
   🎮 Attempting to complete Level 1 of Chapter 1...
   📊 Final score calculated: XX
   🔍 Complete level result: {success: true, ...}
   ✅ User XXX: Level 1 of Chapter 1 completed!
   🔓 Next level unlocked: {chapter: 1, level: 2}
   ```

5. **Check Network tab** for:
   ```
   POST http://localhost:3000/api/progress/complete_level
   Status: 200 OK
   ```

## Common Issues & Solutions

### Issue 1: Server Not Running
**Symptom**: Network errors, can't connect to localhost:3000  
**Solution**: Make sure `npm run dev` is running and shows both Vite AND Node server starting

### Issue 2: Old Token
**Symptom**: 403 Forbidden errors  
**Solution**: 
1. Clear localStorage (DevTools → Application → Local Storage → Clear)
2. Log out and log in again

### Issue 3: Database Not Created
**Symptom**: Server errors about database  
**Solution**: The `rizal.db` file should be created automatically in the project root. If not, check server logs for errors.

### Issue 4: Port 3000 Already in Use
**Symptom**: Server won't start, says port in use  
**Solution**: 
1. Kill the process using port 3000
2. Or change the port in `server.cjs` (line 9)

## Quick Test

Run this in the browser console after logging in:
```javascript
// Test if you can fetch progress
fetch('http://localhost:3000/api/progress/get_progress', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(d => console.log('Progress data:', d))
.catch(e => console.error('Error:', e))
```

If this works, the backend is running correctly!

## Files Involved in Progress Saving

1. **Frontend**:
   - `src/App.jsx` - `handleLevelComplete()` function
   - `src/hooks/useProgressAPI.js` - `completeLevel()` function
   - `src/utils/progressAPI.js` - API calls to backend

2. **Backend**:
   - `server.cjs` - Express server with all API endpoints
   - `rizal.db` - SQLite database (auto-created)

## Next Steps

1. ✅ Make sure `npm run dev` is running
2. ✅ Check browser console for errors
3. ✅ Check network tab for API calls
4. ✅ Verify you're logged in with a valid token
5. ✅ Try completing a level and watch the console logs

If you're still having issues, share:
- Browser console errors
- Network tab showing the failed request
- Server terminal output
