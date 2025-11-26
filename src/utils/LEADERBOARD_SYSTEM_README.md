# Leaderboard System

## Overview

The leaderboard system displays the top 5 students based on their overall performance in the José Rizal educational app. It considers multiple factors including total score, completion rate, and achievement count, with average completion time used as a tiebreaker.

## Features

- **Top 5 Rankings**: Displays the top 5 performing students
- **Multi-Factor Scoring**: Considers total score, completion rate, and achievements
- **Tiebreaker Logic**: Uses average completion time when scores are equal
- **Badge Display**: Shows earned achievements for each student
- **Real-time Updates**: Optional auto-refresh functionality
- **Special Styling**: Distinctive visual treatment for 1st, 2nd, and 3rd place

## Components

### LeaderboardWidget

The main display component for the leaderboard.

**Props:**

- `limit` (number, default: 5): Number of top students to display
- `autoRefresh` (boolean, default: false): Enable automatic refresh
- `refreshInterval` (number, default: 30000): Refresh interval in milliseconds

**Usage:**

```jsx
import LeaderboardWidget from './components/LeaderboardWidget';

// Basic usage
<LeaderboardWidget />

// With auto-refresh
<LeaderboardWidget limit={5} autoRefresh={true} refreshInterval={60000} />
```

## Utility Functions

### getTopStudents(limit)

Retrieves the top students based on performance.

**Parameters:**

- `limit` (number): Number of students to return

**Returns:** Array of student objects with rankings

**Example:**

```javascript
import { getTopStudents } from "./utils/leaderboardManager";

const topStudents = await getTopStudents(5);
console.log(topStudents);
// [
//   {
//     rank: 1,
//     userId: 1,
//     username: 'student1',
//     totalScore: 1000,
//     completedLevels: 10,
//     completionRate: 80,
//     achievementCount: 5,
//     avgTimeMinutes: 15
//   },
//   ...
// ]
```

### getUserBadges(userId)

Gets all badges/achievements for a specific user.

**Parameters:**

- `userId` (number): User ID

**Returns:** Array of badge objects

**Example:**

```javascript
import { getUserBadges } from "./utils/leaderboardManager";

const badges = await getUserBadges(1);
console.log(badges);
// [
//   { name: "Hero's Awakening", type: 'milestone', earnedAt: '2024-01-01' },
//   ...
// ]
```

### calculateRankingScore(stats)

Calculates a ranking score based on user statistics.

**Parameters:**

- `stats` (object): User statistics object
  - `totalScore` (number): Total score across all levels
  - `completionRate` (number): Percentage of levels completed
  - `achievementCount` (number): Number of achievements earned

**Returns:** Calculated ranking score (number)

**Weighting:**

- Total Score: 60%
- Completion Rate: 30%
- Achievement Count: 10%

**Example:**

```javascript
import { calculateRankingScore } from "./utils/leaderboardManager";

const score = calculateRankingScore({
  totalScore: 1000,
  completionRate: 80,
  achievementCount: 5,
});
console.log(score); // 674
```

### getUserRank(userId)

Gets a user's current rank in the leaderboard.

**Parameters:**

- `userId` (number): User ID

**Returns:** User's rank (number) or null if not ranked

**Example:**

```javascript
import { getUserRank } from "./utils/leaderboardManager";

const rank = await getUserRank(1);
console.log(rank); // 3
```

### getDetailedLeaderboard(limit)

Gets the leaderboard with full details including badges.

**Parameters:**

- `limit` (number): Number of students to return

**Returns:** Array of detailed student objects with badges

**Example:**

```javascript
import { getDetailedLeaderboard } from "./utils/leaderboardManager";

const leaderboard = await getDetailedLeaderboard(5);
console.log(leaderboard);
// [
//   {
//     rank: 1,
//     userId: 1,
//     username: 'student1',
//     totalScore: 1000,
//     completedLevels: 10,
//     completionRate: 80,
//     achievementCount: 5,
//     avgTimeMinutes: 15,
//     badges: [...]
//   },
//   ...
// ]
```

### refreshLeaderboard(limit)

Refreshes and returns the latest leaderboard data.

**Parameters:**

- `limit` (number): Number of students to return

**Returns:** Fresh leaderboard data

**Example:**

```javascript
import { refreshLeaderboard } from "./utils/leaderboardManager";

const freshData = await refreshLeaderboard(5);
```

## Ranking Algorithm

The leaderboard uses a SQL query that:

1. **Aggregates user data** from multiple tables (users, user_progress, achievements)
2. **Calculates metrics**:
   - Total score (sum of all final_score values)
   - Completed levels count
   - Completion rate percentage
   - Achievement count
   - Average completion time in minutes
3. **Orders results** by:
   - Primary: Total score (descending)
   - Tiebreaker: Average time (ascending - faster is better)
4. **Filters** admin users and users with no completed levels
5. **Limits** results to top N students

## Tiebreaker Logic

When two or more students have the same total score, the ranking is determined by average completion time:

- **Lower time = Higher rank** (faster completion is better)
- Time is calculated as the average of all completed levels
- Measured in minutes from level start to completion

## Visual Styling

### Rank Badges

- **1st Place**: 👑 Gold gradient with yellow theme
- **2nd Place**: 🥈 Silver gradient with gray theme
- **3rd Place**: 🥉 Bronze gradient with orange theme
- **4th-5th Place**: 🎯 Blue gradient theme

### Special Effects

- Top 3 entries have larger badges and enhanced styling
- Hover effects with scale and shadow transitions
- Animated refresh button
- Badge icons displayed for achievements

## Integration with Analytics Dashboard

The leaderboard is integrated into the AnalyticsDashboard component in two places:

1. **Overview Tab**: Displays prominently at the top
2. **Dedicated Leaderboard Tab**: Full-screen view with auto-refresh

## Testing

Manual tests are available in `src/utils/__tests__/leaderboardManager.test.js`.

**To run tests in browser console:**

```javascript
// Load the app and log in
// Open browser console
window.leaderboardTests.runAllLeaderboardTests();
```

**Individual tests:**

```javascript
window.leaderboardTests.testGetTopStudents();
window.leaderboardTests.testTiebreakerLogic();
window.leaderboardTests.testGetDetailedLeaderboard();
```

## Requirements Validation

This implementation validates the following requirements:

- **13.1**: Top 5 students list based on overall performance
- **13.2**: Ranking considers total score, completion rate, and achievements
- **13.3**: Displays student names, scores, and achievement badges
- **13.4**: Uses completion time as tiebreaker
- **13.5**: Real-time updates with refresh functionality

## Database Schema

The leaderboard queries the following tables:

### users

- `id`: User ID
- `username`: Display name
- `is_admin`: Admin flag (excluded from leaderboard)

### user_progress

- `user_id`: Foreign key to users
- `chapter_id`: Chapter identifier
- `level_id`: Level identifier
- `is_completed`: Completion status
- `final_score`: Score for the level
- `completion_date`: When level was completed
- `created_at`: When level was started

### achievements

- `user_id`: Foreign key to users
- `achievement_name`: Achievement identifier
- `achievement_type`: Type of achievement
- `earned_at`: When achievement was earned

## Performance Considerations

- Leaderboard queries are optimized with proper indexing
- Results are limited to top 5 to minimize data transfer
- Auto-refresh can be disabled to reduce database load
- Badge data is fetched in parallel for better performance

## Future Enhancements

Potential improvements for the leaderboard system:

1. **Pagination**: Support for viewing beyond top 5
2. **Filtering**: Filter by chapter or time period
3. **User Highlighting**: Highlight current user's position
4. **Historical Data**: Track rank changes over time
5. **Animations**: Smooth transitions when rankings change
6. **Export**: Download leaderboard data as CSV/PDF
7. **Notifications**: Alert users when they enter top 5
