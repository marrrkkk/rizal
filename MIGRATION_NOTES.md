# ⚠️ IMPORTANT: After Migration

## You Need to Log In Again!

After migrating from PHP to Node.js, you need to **log out and log in again** to get a new authentication token.

### Why?
- The old system used client-side SQL.js with localStorage
- The new system uses server-side JWT tokens from Node.js
- Your old token won't work with the new server

### How to Fix the 403 Error:

1. **Clear your browser's localStorage:**
   - Open DevTools (F12)
   - Go to Application tab → Local Storage
   - Delete the `token` item
   - Refresh the page

2. **Or simply log out and log in again**

---

# Migration from PHP to Node.js + SQLite

## Summary
Successfully migrated the Rizal web application from PHP backend to Node.js + Express with SQLite database. Removed all offline/localStorage fallback functionality as requested.

## Changes Made

### 1. Backend Migration
- **Created `server.cjs`**: Node.js Express server with SQLite database
  - Replaced PHP backend entirely
  - Implements same API endpoints (without .php extensions)
  - Uses `sqlite3` package for database operations
  - Includes JWT authentication with `jsonwebtoken`
  - CORS enabled for frontend communication
  - Runs on port 3000

### 2. Database
- **SQLite Database**: `rizal.db` (created automatically)
  - Tables: `users`, `user_progress`, `user_badges`, `user_statistics`
  - Same schema as PHP version
  - Automatic initialization on first run

### 3. Frontend Updates
- **Updated API URLs**: Changed from `http://localhost/rizal/api` to `http://localhost:3000/api`
  - Modified `src/utils/progressAPI.js`
  - Modified `src/utils/auth.js`
- **Removed .php extensions** from all API calls
- **Removed offline mode**: 
  - Deleted localStorage fallback logic from `useProgressAPI.js`
  - Removed imports from `progressFallback.js`
  - App now requires server connection to function

### 4. Package Updates
- **New Dependencies**:
  - `express` - Web server framework
  - `sqlite3` - SQLite database driver
  - `cors` - CORS middleware
  - `body-parser` - Request body parsing
  - `jsonwebtoken` - JWT authentication
  - `concurrently` - Run multiple commands

- **Updated Scripts** in `package.json`:
  ```json
  "dev": "concurrently \"npm run server\" \"vite\"",
  "server": "node server.cjs"
  ```

### 5. API Endpoints (No PHP!)
All endpoints now use clean URLs without .php extensions:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/progress/get_progress` - Get user progress
- `POST /api/progress/complete_level` - Complete a level
- `POST /api/progress/initialize_progress` - Initialize progress

## Running the Application

```bash
npm run dev
```

This starts:
1. **Backend server** on `http://localhost:3000`
2. **Frontend (Vite)** on `http://localhost:5173`

## What Was Removed

1. ✅ All PHP files and dependencies
2. ✅ Offline mode / localStorage fallback
3. ✅ .php extensions from API routes
4. ✅ `progressFallback.js` usage
5. ✅ `usingFallback` state management

## Benefits

- ✅ Single language (JavaScript) for full stack
- ✅ No PHP/Apache required
- ✅ Direct SQLite integration
- ✅ No CORS issues (proper headers)
- ✅ Simpler deployment
- ✅ Better error handling
- ✅ Consistent codebase

## Troubleshooting

### 403 Forbidden Error
If you see a 403 error when trying to access progress:
1. Clear your browser's localStorage (old tokens won't work)
2. Log out and log in again
3. Make sure the Node.js server is running on port 3000

### Server Not Starting
- Make sure port 3000 is not already in use
- Check that all dependencies are installed: `npm install`
- Look for error messages in the terminal
