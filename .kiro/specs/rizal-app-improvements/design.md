# Design Document

## Overview

The José Rizal educational app improvements will focus on enhancing the user interface with Filipino-themed design elements, fixing existing game functionality, completing missing levels, and ensuring a smooth learning experience for children. The design maintains the existing React architecture while introducing consistent theming, improved game mechanics, and better progress tracking.

## Architecture

### Current Architecture

- **Frontend**: React 19.1.0 with React Router for navigation
- **Styling**: Tailwind CSS 4.1.10 for responsive design
- **Interactions**: @dnd-kit for drag-and-drop functionality
- **State Management**: React hooks (useState, useEffect) with SQLite for persistence
- **Authentication**: JWT-based authentication with SQLite database (PHP backend removed)
- **Database**: SQLite for user data, progress tracking, and analytics

### Design Improvements

- **Theme System**: Centralized theme configuration for consistent Filipino-inspired colors
- **Component Library**: Reusable UI components for games and interactions
- **Animation System**: CSS animations and transitions for engaging feedback
- **Progress System**: Enhanced progress tracking with visual indicators

## Components and Interfaces

### Theme System

```javascript
// Theme configuration
const filipinoTheme = {
  colors: {
    primary: {
      blue: "from-blue-500 to-indigo-600", // Philippine flag blue
      red: "from-red-500 to-red-600", // Philippine flag red
      yellow: "from-yellow-400 to-amber-500", // Philippine sun yellow
    },
    backgrounds: {
      chapter1: "from-blue-50 via-sky-50 to-indigo-100", // Childhood
      chapter2: "from-amber-50 via-orange-50 to-amber-100", // Education
      chapter3: "from-emerald-50 via-green-50 to-teal-100", // Europe
      chapter4: "from-pink-50 via-rose-50 to-red-100", // Noli Me Tangere
      chapter5: "from-purple-50 via-indigo-50 to-blue-100", // Return & Legacy
    },
  },
  animations: {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
  },
};
```

### Reusable Game Components

#### GameHeader Component

```javascript
const GameHeader = ({
  title,
  level,
  chapter,
  score,
  onBack,
  onLogout,
  username,
  theme = "blue",
}) => {
  // Consistent header across all games
  // Progress indicator
  // Navigation controls
};
```

#### ProgressBar Component

```javascript
const ProgressBar = ({ current, total, theme = "blue", showLabels = true }) => {
  // Animated progress visualization
  // Milestone indicators
  // Completion celebrations
};
```

#### GameCard Component

```javascript
const GameCard = ({
  level,
  isUnlocked,
  isCompleted,
  onClick,
  theme,
  icon,
  title,
  description,
}) => {
  // Consistent level card design
  // Lock/unlock states
  // Completion indicators
  // Hover animations
};
```

### Game-Specific Improvements

#### Interactive Quiz Component

```javascript
const InteractiveQuiz = ({
  questions,
  onAnswer,
  showFeedback = true,
  allowRetry = true,
  theme = "blue",
}) => {
  // Multiple choice questions
  // Immediate feedback
  // Encouraging messages
  // Score tracking
};
```

#### DragDropPuzzle Component

```javascript
const DragDropPuzzle = ({
  pieces,
  dropZones,
  onComplete,
  theme = "blue",
  showHints = true,
}) => {
  // Drag and drop functionality
  // Visual feedback
  // Hint system
  // Completion animations
};
```

#### WordCollection Component

```javascript
const WordCollection = ({ words, categories, onCollect, theme = "green" }) => {
  // Floating word elements
  // Category-based collection
  // Combination rewards
  // Visual garden theme
};
```

## Data Models

### SQLite Database Schema

#### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT 0
);
```

#### Progress Table

```sql
CREATE TABLE progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  chapter_id INTEGER NOT NULL,
  level_id INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  final_score INTEGER,
  completed BOOLEAN DEFAULT 0,
  completion_time DATETIME,
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, chapter_id, level_id)
);
```

#### Achievements Table

```sql
CREATE TABLE achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Progress Tracking Model

```javascript
const ProgressModel = {
  userId: number,
  chapters: {
    [chapterId]: {
      unlockedLevels: number[],
      completedLevels: number[],
      scores: { [levelId]: { score: number, finalScore: number } },
      badges: string[],
      completionDate: Date
    }
  },
  overallProgress: {
    totalLevels: number,
    completedLevels: number,
    averageScore: number,
    totalFinalScore: number,
    badges: string[]
  }
}
```

### Game State

```javascript
const GameState = {
  currentLevel: number,
  score: number,
  finalScore: number, // Calculated at completion
  attempts: number,
  startTime: Date,
  endTime: Date,
  interactions: InteractionLog[],
  hintsUsed: number,
  completed: boolean,
  accuracy: number, // For final score calculation
  timeBonus: number // For final score calculation
}
```

### Achievement System

```javascript
const AchievementConfig = {
  // Epic anime-style achievement names
  achievements: {
    firstLevel: {
      name: "Hero's Awakening",
      description: "Complete your first level",
      icon: "⭐",
      type: "milestone",
    },
    chapterComplete: {
      name: "Path of Enlightenment",
      description: "Complete an entire chapter",
      icon: "🌟",
      type: "chapter",
    },
    perfectScore: {
      name: "Flawless Victory",
      description: "Complete a level with perfect score",
      icon: "💎",
      type: "performance",
    },
    allChapters: {
      name: "Legacy Unleashed",
      description: "Complete all chapters",
      icon: "👑",
      type: "ultimate",
    },
    speedRunner: {
      name: "Lightning Strike",
      description: "Complete a level in record time",
      icon: "⚡",
      type: "speed",
    },
    scholar: {
      name: "Wisdom's Embrace",
      description: "Earn high scores across all levels",
      icon: "📚",
      type: "mastery",
    },
  },
};
```

### Leaderboard Model

```javascript
const LeaderboardEntry = {
  rank: number,
  userId: number,
  username: string,
  totalScore: number,
  completionRate: number, // Percentage of levels completed
  achievementCount: number,
  averageTime: number, // For tiebreaking
  badges: string[]
}
```

### Level Configuration

```javascript
const LevelConfig = {
  id: number,
  chapterId: number,
  title: string,
  description: string,
  type: 'quiz' | 'puzzle' | 'drag-drop' | 'word-collection' | 'timeline',
  difficulty: 'easy' | 'medium' | 'hard',
  estimatedTime: number,
  prerequisites: number[],
  content: GameContent,
  theme: ThemeConfig,
  scoreWeights: {
    accuracy: number, // Weight for correct answers
    speed: number, // Weight for completion time
    hints: number // Penalty for hints used
  }
}
```

## Authentication System

### SQLite-Based Authentication

The authentication system will be migrated from PHP to a client-side SQLite implementation with proper security measures.

#### Authentication Flow

```javascript
// Registration
const register = async (username, email, password) => {
  // 1. Hash password using bcrypt or similar
  const passwordHash = await hashPassword(password);

  // 2. Insert into SQLite users table
  await db.execute(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  // 3. Generate JWT token
  const token = generateJWT({ userId, username });

  return { token, user: { userId, username } };
};

// Login
const login = async (username, password) => {
  // 1. Query user from SQLite
  const user = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  // 2. Verify password
  const isValid = await verifyPassword(password, user.password_hash);

  // 3. Generate JWT token
  if (isValid) {
    const token = generateJWT({ userId: user.id, username: user.username });
    return { token, user };
  }

  throw new Error("Invalid credentials");
};
```

#### Security Considerations

- **Password Hashing**: Use bcrypt or argon2 for secure password hashing
- **JWT Tokens**: Store tokens securely in httpOnly cookies or secure localStorage
- **SQL Injection Prevention**: Use parameterized queries for all database operations
- **Session Management**: Implement token expiration and refresh mechanisms

### PHP Removal Plan

1. Remove all PHP files in `backend/rizal/api/auth/`
2. Remove PHP database connection files
3. Update frontend API calls to use SQLite directly
4. Migrate existing user data from PHP/MySQL to SQLite
5. Update authentication middleware to use JWT validation

## Score Calculation System

### Final Score Algorithm

```javascript
const calculateFinalScore = (gameState, levelConfig) => {
  const {
    score, // Raw score from game
    attempts,
    hintsUsed,
    startTime,
    endTime,
    accuracy,
  } = gameState;

  const { scoreWeights, estimatedTime } = levelConfig;

  // Base score from game performance
  let finalScore = score * scoreWeights.accuracy;

  // Time bonus (faster completion = higher bonus)
  const timeTaken = (endTime - startTime) / 1000; // seconds
  const timeRatio = Math.min(estimatedTime / timeTaken, 2); // Cap at 2x
  const timeBonus = score * scoreWeights.speed * timeRatio;

  // Hint penalty
  const hintPenalty = hintsUsed * scoreWeights.hints;

  // Calculate final score
  finalScore = Math.max(0, finalScore + timeBonus - hintPenalty);

  // Round to nearest integer
  return Math.round(finalScore);
};
```

### Score Persistence

```javascript
const saveFinalScore = async (userId, chapterId, levelId, finalScore) => {
  await db.execute(
    `UPDATE progress 
     SET final_score = ?, 
         completed = 1, 
         completion_time = CURRENT_TIMESTAMP 
     WHERE user_id = ? AND chapter_id = ? AND level_id = ?`,
    [finalScore, userId, chapterId, levelId]
  );

  // Unlock next level
  await unlockNextLevel(userId, chapterId, levelId);
};
```

## Level Unlocking System

### Unlocking Logic

```javascript
const unlockNextLevel = async (userId, chapterId, levelId) => {
  const totalLevelsInChapter = await getTotalLevels(chapterId);

  if (levelId < totalLevelsInChapter) {
    // Unlock next level in same chapter
    await db.execute(
      `INSERT OR IGNORE INTO progress (user_id, chapter_id, level_id) 
       VALUES (?, ?, ?)`,
      [userId, chapterId, levelId + 1]
    );
  } else {
    // Last level of chapter - unlock next chapter
    await db.execute(
      `INSERT OR IGNORE INTO progress (user_id, chapter_id, level_id) 
       VALUES (?, ?, 1)`,
      [userId, chapterId + 1]
    );

    // Award chapter completion achievement
    await awardAchievement(userId, "Path of Enlightenment", "chapter");
  }
};
```

### Unlock Notifications

```javascript
const UnlockNotification = ({ type, chapterName, levelName }) => {
  const messages = {
    level: `🎉 New Level Unlocked: ${levelName}!`,
    chapter: `🌟 New Chapter Unlocked: ${chapterName}!`,
  };

  return (
    <div className="unlock-notification animate-slide-up">
      <h3>{messages[type]}</h3>
      <p>Continue your journey to learn more about José Rizal!</p>
    </div>
  );
};
```

## Analytics Dashboard

### Top 5 Leaderboard

```javascript
const getTopStudents = async (limit = 5) => {
  const query = `
    SELECT 
      u.id,
      u.username,
      SUM(p.final_score) as total_score,
      COUNT(CASE WHEN p.completed = 1 THEN 1 END) as completed_levels,
      COUNT(DISTINCT p.chapter_id) as chapters_completed,
      COUNT(a.id) as achievement_count,
      AVG(
        CAST((julianday(p.completion_time) - julianday(p.created_at)) * 24 * 60 AS INTEGER)
      ) as avg_time_minutes
    FROM users u
    LEFT JOIN progress p ON u.id = p.user_id
    LEFT JOIN achievements a ON u.id = a.user_id
    WHERE u.is_admin = 0
    GROUP BY u.id
    ORDER BY total_score DESC, avg_time_minutes ASC
    LIMIT ?
  `;

  return await db.query(query, [limit]);
};
```

### Admin Dashboard Components

```javascript
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Top 5 Leaderboard */}
      <LeaderboardWidget students={topStudents} />

      {/* Overall Statistics */}
      <StatsOverview
        totalUsers={stats.totalUsers}
        activeUsers={stats.activeUsers}
        completionRate={stats.completionRate}
      />

      {/* User Management */}
      <UserManagementTable users={allUsers} />

      {/* Level Difficulty Analytics */}
      <LevelDifficultyChart data={levelStats} />

      {/* Recent Activity Feed */}
      <ActivityFeed activities={recentActivities} />
    </div>
  );
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Authentication Properties

**Property 1: Password hashing security**
_For any_ user registration with a valid password, the stored password in the database should be hashed and not equal to the plaintext password.
**Validates: Requirements 10.2**

**Property 2: Login credential validation**
_For any_ registered user, logging in with correct credentials should succeed, and logging in with incorrect credentials should fail.
**Validates: Requirements 10.3**

**Property 3: JWT token generation**
_For any_ successful authentication, the system should generate a valid JWT token that can be decoded to retrieve user information.
**Validates: Requirements 10.4**

### Score Tracking Properties

**Property 4: Final score calculation consistency**
_For any_ completed level with given performance metrics (accuracy, time, hints), the final score calculation should be deterministic and include all factors.
**Validates: Requirements 11.1, 11.4**

**Property 5: Score persistence round-trip**
_For any_ level completion, saving a final score to the database and then retrieving it should return the same score value.
**Validates: Requirements 11.2, 11.3**

**Property 6: Statistics update consistency**
_For any_ score save operation, the user's aggregate statistics (total score, average score, completion count) should reflect the new score.
**Validates: Requirements 11.5**

### Level Unlocking Properties

**Property 7: Sequential level unlocking**
_For any_ completed level that is not the last in a chapter, the next level in sequence should become unlocked.
**Validates: Requirements 9.2**

**Property 8: Chapter unlocking on completion**
_For any_ completed final level of a chapter, the first level of the next chapter should become unlocked.
**Validates: Requirements 9.3**

### Leaderboard Properties

**Property 9: Top 5 ranking correctness**
_For any_ set of users with scores, the top 5 leaderboard should contain the 5 users with highest total scores in descending order.
**Validates: Requirements 13.1, 13.2**

**Property 10: Leaderboard data completeness**
_For any_ user in the top 5 leaderboard, their entry should include username, total score, completion rate, and achievement count.
**Validates: Requirements 13.3**

**Property 11: Tiebreaker consistency**
_For any_ two users with equal total scores, the user with faster average completion time should rank higher.
**Validates: Requirements 13.4**

### Admin Dashboard Properties

**Property 12: User data completeness**
_For any_ user in the system, the admin dashboard should display their complete progress data including all completed levels and scores.
**Validates: Requirements 14.1, 14.2**

**Property 13: User management operations**
_For any_ user account, admin operations (view, edit, delete) should correctly modify the database and reflect changes immediately.
**Validates: Requirements 14.3**

**Property 14: Analytics aggregation accuracy**
_For any_ set of user activities, aggregate statistics (total completions, average scores, popular levels) should correctly sum and average the underlying data.
**Validates: Requirements 14.4**

### UI Accessibility Properties

**Property 15: Color contrast compliance**
_For any_ text and background color combination used in the UI, the contrast ratio should meet WCAG AA standards (minimum 4.5:1 for normal text).
**Validates: Requirements 15.4**

## Error Handling

### Game Error Recovery

- **Network Issues**: Offline mode with cached content
- **Save Failures**: Retry mechanism with user notification
- **Invalid States**: Automatic state reset with progress preservation
- **Component Errors**: Error boundaries with friendly messages

### User Experience Errors

- **Level Access**: Clear messaging about prerequisites
- **Input Validation**: Real-time feedback for invalid inputs
- **Progress Loss**: Automatic backup and recovery systems
- **Performance Issues**: Loading states and optimization

## Testing Strategy

### Unit Testing

- **Component Testing**: Individual game components
- **State Management**: Progress tracking and game state
- **Utility Functions**: Theme helpers and data transformations
- **Error Handling**: Error boundary and recovery mechanisms

### Integration Testing

- **Game Flow**: Complete level progression
- **Progress Persistence**: Save/load functionality
- **Navigation**: Chapter and level transitions
- **Authentication**: Login/logout with progress retention

### User Experience Testing

- **Accessibility**: Screen reader compatibility and keyboard navigation
- **Responsive Design**: Multiple device sizes and orientations
- **Performance**: Load times and smooth animations
- **Child-Friendly**: Age-appropriate content and interactions

## Implementation Phases

### Phase 1: Theme System and UI Improvements

- Implement centralized theme configuration
- Update existing components with Filipino-themed styling
- Add consistent animations and transitions
- Improve responsive design across all pages

### Phase 2: Game Functionality Fixes

- Debug and fix existing game issues
- Implement missing game mechanics
- Add proper error handling and recovery
- Enhance progress tracking system

### Phase 3: Missing Level Implementation

- Complete Chapter 5 levels 2-5
- Add placeholder implementations for Chapter 6
- Implement new game types as needed
- Add educational content and facts

### Phase 4: Enhanced Features

- Add achievement system with badges
- Implement hint systems for difficult games
- Add sound effects and visual celebrations
- Create printable certificates for completion

## Visual Design Guidelines

### Color Palette

- **Primary Colors**: Philippine flag colors (blue, red, yellow/gold)
- **Secondary Colors**: Warm earth tones (browns, greens) representing Filipino culture
- **Accent Colors**: Bright, cheerful colors for children (orange, pink, purple)
- **Neutral Colors**: Soft grays and whites for readability

### Typography

- **Headers**: Bold, friendly fonts suitable for children
- **Body Text**: Clear, readable fonts with appropriate sizing
- **Interactive Elements**: Slightly larger text for easy clicking/tapping

### Iconography

- **Cultural Icons**: Filipino symbols (sun, stars, traditional patterns)
- **Educational Icons**: Books, scrolls, quills, maps
- **Game Icons**: Puzzles, stars, trophies, badges
- **Emoji Integration**: Age-appropriate emoji for visual appeal

### Layout Principles

- **Card-Based Design**: Consistent card layouts for levels and content
- **Grid Systems**: Responsive grids that work on all devices
- **White Space**: Adequate spacing for easy reading and interaction
- **Visual Hierarchy**: Clear distinction between different content types

## UI Improvements

### Design System Enhancements

#### Consistent Spacing

```javascript
const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  xxl: "3rem", // 48px
};
```

#### Button Styles

```javascript
const ButtonVariants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300",
  secondary:
    "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300",
  success:
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300",
};
```

#### Card Improvements

```javascript
const CardStyles = {
  base: "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300",
  interactive: "cursor-pointer transform hover:scale-105 hover:-translate-y-1",
  locked: "opacity-60 cursor-not-allowed grayscale",
  completed: "border-2 border-green-500 bg-green-50",
};
```

#### Animation Enhancements

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

### Accessibility Improvements

- **Focus States**: Clear focus indicators for keyboard navigation
- **ARIA Labels**: Proper ARIA labels for screen readers
- **Color Contrast**: WCAG AA compliant color contrast ratios
- **Touch Targets**: Minimum 44x44px touch targets for mobile
- **Loading States**: Clear loading indicators with descriptive text

### Responsive Breakpoints

```javascript
const breakpoints = {
  mobile: "640px", // Small phones
  tablet: "768px", // Tablets
  laptop: "1024px", // Laptops
  desktop: "1280px", // Desktops
};
```

### Visual Feedback

- **Hover Effects**: Subtle scale and shadow changes
- **Click Feedback**: Brief scale-down animation on click
- **Success States**: Green checkmarks and celebration animations
- **Error States**: Red highlights with helpful error messages
- **Loading States**: Skeleton screens and progress indicators
