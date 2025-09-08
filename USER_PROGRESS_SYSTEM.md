# User Progress System Documentation

## Overview

The José Rizal Learning App now includes a comprehensive user-specific progress management system that saves level completion data, scores, time spent, and achievements along with the username/ID to local storage and optionally to local files.

## 🎯 Key Features

### 1. User-Specific Progress Tracking

- **Individual Progress**: Each user's progress is stored separately using their username
- **Detailed Statistics**: Tracks completion time, attempts, scores, and badges per user
- **Session Management**: Monitors learning sessions and consecutive day streaks
- **Achievement System**: Enhanced badge system with user-specific milestones

### 2. Local File Storage

- **Export Progress**: Users can download their progress as JSON backup files
- **Import Progress**: Users can restore progress from previously exported files
- **Automatic Naming**: Files are named with username and date for easy organization
- **Cross-Device Sync**: Progress files can be transferred between devices

### 3. Admin Dashboard

- **Multi-User View**: Teachers/parents can see all users' progress
- **Performance Analytics**: Compare users, view top performers, and track trends
- **Detailed Statistics**: Individual user breakdowns with time spent, badges, and achievements
- **Export Capabilities**: Bulk export of all user data for record keeping

## 📁 File Structure

```
src/
├── utils/
│   ├── userProgressManager.js      # Core user progress management
│   └── progressManager.js          # Legacy progress system (still used)
├── hooks/
│   └── useUserProgress.js          # React hooks for progress management
├── components/
│   ├── UserProgressManager.jsx     # Individual user progress display
│   └── AdminProgressView.jsx       # Multi-user admin view
└── pages/
    └── AdminDashboard.jsx          # Admin dashboard page
```

## 🔧 Implementation Details

### Core Functions

#### `userProgressManager.js`

- `getUserProgress(username)` - Get user-specific progress data
- `saveUserProgress(username, data)` - Save progress to localStorage and file
- `completeUserLevel(username, chapter, level, score, timeSpent)` - Complete a level
- `exportUserProgress(username)` - Export progress as downloadable file
- `loadProgressFromFile(username)` - Import progress from file
- `getUserStatistics(username)` - Get comprehensive user statistics

#### `useUserProgress.js` Hook

```javascript
const {
  progress, // Current user progress
  statistics, // User statistics
  completeLevel, // Complete a level function
  exportProgress, // Export to file
  importProgress, // Import from file
  isLevelUnlocked, // Check if level is unlocked
  getAllBadges, // Get all earned badges
} = useUserProgress(username);
```

### Data Structure

Each user's progress includes:

```javascript
{
  username: "student_name",
  userId: "student_name",
  createdAt: "2025-01-09T...",
  lastSaved: "2025-01-09T...",
  lastAccessed: "2025-01-09T...",
  chapters: {
    1: {
      unlockedLevels: [1, 2, 3],
      completedLevels: [1, 2],
      scores: { 1: 85, 2: 92 },
      badges: ["chapter_1_complete"],
      timeSpent: 1200,        // seconds
      attempts: { 1: 1, 2: 2 }
    }
    // ... chapters 2-5
  },
  overall: {
    totalLevelsCompleted: 10,
    averageScore: 88,
    totalTimeSpent: 3600,
    badges: ["first_level_complete", "knowledge_seeker"],
    achievements: {
      perfectScores: 3,
      consecutiveDays: 5,
      streakRecord: 7
    },
    statistics: {
      gamesPlayed: 15,
      averageTimePerLevel: 180,
      favoriteChapter: 2,
      strongestSubject: 1
    }
  }
}
```

## 🎮 Usage Examples

### Basic Usage in Components

```javascript
import { useUserProgress } from "../hooks/useUserProgress";

function GameComponent({ username }) {
  const { completeLevel, isLevelUnlocked } = useUserProgress(username);

  const handleGameComplete = async (score, timeSpent) => {
    const result = await completeLevel(1, 1, score, timeSpent);
    if (result.success) {
      console.log("Level completed!", result.newBadges);
    }
  };

  return (
    <div>
      {isLevelUnlocked(1, 2) ? (
        <button onClick={() => startLevel(1, 2)}>Play Level 2</button>
      ) : (
        <p>Complete Level 1 first!</p>
      )}
    </div>
  );
}
```

### Admin Dashboard Usage

```javascript
import { useMultiUserProgress } from "../hooks/useUserProgress";

function AdminView() {
  const { users, getTopPerformers } = useMultiUserProgress();
  const topStudents = getTopPerformers("completionPercentage", 5);

  return (
    <div>
      <h2>Top Performers</h2>
      {topStudents.map((user) => (
        <div key={user.username}>
          {user.username}: {user.completionPercentage}% complete
        </div>
      ))}
    </div>
  );
}
```

## 💾 File Management

### Automatic File Naming

Progress files are automatically named using the pattern:

```
rizal_progress_[username]_[date].json
```

Example: `rizal_progress_john_doe_2025-01-09.json`

### File Operations

- **Export**: Creates downloadable JSON file with complete progress data
- **Import**: Validates and loads progress from JSON file
- **Backup**: Automatic localStorage backup with every save
- **Cross-Platform**: Files work across different devices and browsers

## 🏆 Enhanced Badge System

### New Badges

- **Efficiency Master**: Complete 5+ levels with average time < 2 minutes
- **Persistent Learner**: Complete a level after 3+ attempts
- **Marathon Learner**: 30 consecutive days of play
- **Speed Runner**: 5 levels completed in one session

### Badge Categories

- **Progress Badges**: Level and chapter completion
- **Performance Badges**: Perfect scores and high averages
- **Dedication Badges**: Consecutive days and persistence
- **Milestone Badges**: Major achievements and expertise

## 📊 Statistics Tracked

### Per User

- Total levels completed
- Average score across all games
- Total time spent learning
- Number of badges earned
- Current and longest streak
- Favorite chapter (most time spent)
- Strongest subject (highest average score)
- Games played and attempts made

### System-Wide (Admin View)

- Total registered users
- Average completion percentage
- Total badges awarded
- Total learning time across all users
- Top performers in various categories

## 🔒 Privacy & Security

### Data Storage

- **Local Storage**: Primary storage in browser localStorage
- **File Export**: Optional user-controlled file downloads
- **No Server Storage**: All data remains on user's device
- **Username-Based**: Progress tied to username, not personal info

### Data Protection

- **Validation**: All imported data is validated before use
- **Error Handling**: Graceful handling of corrupted or invalid data
- **Backup**: Multiple storage methods prevent data loss
- **User Control**: Users can export, import, or delete their data

## 🚀 Getting Started

### For Students

1. **Login**: Use your username to access personalized progress
2. **Play Games**: Complete levels to earn scores and badges
3. **Track Progress**: View your statistics in the progress manager
4. **Export Data**: Download your progress for backup or transfer

### For Teachers/Parents

1. **Access Admin**: Click the "Dashboard" button on the home page
2. **View Students**: See all registered users and their progress
3. **Monitor Performance**: Track completion rates and learning time
4. **Export Reports**: Download progress data for assessment

### For Developers

1. **Import Hook**: `import { useUserProgress } from '../hooks/useUserProgress'`
2. **Initialize**: `const { completeLevel } = useUserProgress(username)`
3. **Complete Levels**: `await completeLevel(chapter, level, score, timeSpent)`
4. **Access Data**: Use hook methods to get progress information

## 🔧 Configuration

### Storage Keys

- Individual users: `rizal_progress_[username]`
- Legacy system: `rizal_app_progress` (still supported)

### File Formats

- **Export Format**: JSON with full progress data
- **Import Validation**: Checks username match and data integrity
- **Backup Format**: Same as export, stored in localStorage

## 📈 Future Enhancements

### Planned Features

- **Cloud Sync**: Optional cloud storage for cross-device sync
- **Advanced Analytics**: Detailed learning pattern analysis
- **Group Management**: Class/group organization for teachers
- **Custom Badges**: Teacher-defined achievement criteria
- **Progress Reports**: Automated progress report generation

### API Integration

The system is designed to easily integrate with backend APIs:

- User authentication and management
- Cloud storage and synchronization
- Advanced analytics and reporting
- Multi-school deployment support

## 🐛 Troubleshooting

### Common Issues

1. **Progress Not Saving**: Check browser localStorage permissions
2. **File Export Not Working**: Ensure browser supports File System Access API
3. **Import Fails**: Verify file format and username match
4. **Missing Progress**: Check correct username spelling

### Debug Mode

Enable debug information by setting `NODE_ENV=development`:

- Shows detailed progress data in components
- Logs all progress operations to console
- Displays validation errors and warnings

## 📞 Support

For technical support or questions about the user progress system:

1. Check the browser console for error messages
2. Verify localStorage is enabled and has space
3. Test with a simple username (no special characters)
4. Try exporting/importing progress to verify file operations

The system is designed to be robust and user-friendly while providing comprehensive progress tracking for the José Rizal educational experience!
