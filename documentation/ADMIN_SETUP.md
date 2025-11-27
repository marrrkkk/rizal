# Admin Dashboard Setup Guide

## Overview

The Rizal Learning App now includes a comprehensive Admin Dashboard with user management, statistics visualization, and system analytics.

## Features

### 1. **User Management**
- View all registered users
- See detailed statistics per user (completed levels, scores, badges)
- Delete users
- View individual user progress details

### 2. **System Analytics**
- Total users count
- Total completed levels
- Total badges earned
- Real-time statistics

### 3. **Leaderboard**
- Top performing students
- Sortable by scores and completion rates

### 4. **Admin Authentication**
- Secure admin-only access
- JWT-based authentication
- Protected API endpoints

## Setup Instructions

### Step 1: Create an Admin User

Run the following command to create an admin account:

```bash
npm run create-admin <username> <password>
```

**Example:**
```bash
npm run create-admin admin admin123
```

This will:
- Create a new user with admin privileges
- Hash the password securely
- Add the `is_admin` flag to the database

### Step 2: Login as Admin

1. Navigate to `http://localhost:5173`
2. Login with your admin credentials
3. The app will automatically detect admin status

### Step 3: Access Admin Dashboard

- If logged in as admin, you'll see an "Admin Dashboard" option in the navigation
- Or navigate directly to `/admin`

## API Endpoints

All admin endpoints require authentication with an admin JWT token.

### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "student1",
    "created_at": "2025-11-26",
    "is_admin": 0,
    "completed_levels": 5,
    "completed_chapters": 1,
    "total_score": 450,
    "average_score": 90,
    "achievement_count": 3
  }
]
```

### Get System Stats
```
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalUsers": 10,
  "totalCompletedLevels": 45,
  "totalBadges": 15
}
```

### Get User Details
```
GET /api/admin/users/:id
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "student1",
    "created_at": "2025-11-26",
    "is_admin": 0
  },
  "progress": [
    {
      "chapter_id": 1,
      "level_id": 1,
      "is_unlocked": 1,
      "is_completed": 1,
      "score": 95,
      "completion_date": "2025-11-26"
    }
  ],
  "badges": [
    {
      "badge_type": "chapter_1_complete",
      "badge_name": "Chapter 1 Master",
      "earned_date": "2025-11-26"
    }
  ]
}
```

### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer <admin-token>
```

## Database Schema Updates

The `users` table now includes an `is_admin` column:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_admin INTEGER DEFAULT 0
);
```

## Security Notes

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Admin authentication uses JWT with 24-hour expiration
3. **Protected Routes**: Admin endpoints verify both authentication AND admin status
4. **SQL Injection Protection**: All queries use parameterized statements

## Troubleshooting

### "Admin access required" error
- Ensure you created the user with `npm run create-admin`
- Verify the user has `is_admin = 1` in the database
- Check that you're using the correct JWT token

### Database column missing
- The server automatically adds the `is_admin` column on startup
- If issues persist, delete `backend/rizal.db` and restart

### Admin Dashboard not loading
- Check browser console for errors
- Verify the backend server is running (`npm run dev`)
- Ensure you're logged in as an admin user

## UI Components

The Admin Dashboard uses modern UI components:

- **Glass Card**: Frosted glass effect for panels
- **Modern Shadow**: Subtle depth shadows
- **Gradient Text**: Eye-catching gradient headings
- **Responsive Design**: Works on all screen sizes

## Future Enhancements

Potential features to add:

1. **Advanced Analytics**
   - Popular levels tracking
   - Difficult levels identification
   - Recent activity timeline
   - Chapter-level statistics

2. **User Management**
   - Edit user details
   - Reset user passwords
   - Bulk operations

3. **Export Features**
   - CSV export of user data
   - PDF reports
   - Analytics charts

4. **Real-time Updates**
   - WebSocket integration
   - Live user activity feed
   - Auto-refresh statistics

## Testing Checklist

- [ ] Create admin user with `npm run create-admin`
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] View user list
- [ ] Click on a user to see details
- [ ] Check system statistics
- [ ] View leaderboard
- [ ] Test user deletion (optional)
- [ ] Logout and verify admin routes are protected

---

**Created:** 2025-11-26  
**Version:** 1.0  
**Status:** ✅ Production Ready
