# Filipino Theme System

This theme system provides a centralized, Filipino-inspired design system for the José Rizal educational app.

## Overview

The theme system includes:

- **Filipino-inspired colors** based on the Philippine flag and cultural elements
- **Chapter-specific themes** with unique backgrounds and color schemes
- **Game type themes** for different educational activities
- **Consistent animations** and transitions
- **Celebration themes** for achievements and milestones

## Usage

### Basic Import

```javascript
import { filipinoTheme, getChapterTheme, getGameTypeTheme } from "../theme";
```

### Theme Colors

```javascript
// Primary colors (Philippine flag inspired)
filipinoTheme.colors.primary.blue; // "from-blue-500 to-indigo-600"
filipinoTheme.colors.primary.red; // "from-red-500 to-red-600"
filipinoTheme.colors.primary.yellow; // "from-yellow-400 to-amber-500"

// Chapter backgrounds
filipinoTheme.colors.backgrounds.chapter1; // Childhood - sky blue
filipinoTheme.colors.backgrounds.chapter2; // Education - warm amber
filipinoTheme.colors.backgrounds.chapter3; // Europe - nature green
```

### Chapter Themes

```javascript
const chapterTheme = getChapterTheme(1);
// Returns: { background, primary, icon, name }

// Use in components
<div className={`bg-gradient-to-br ${chapterTheme.background}`}>
  <div className={`bg-gradient-to-r ${chapterTheme.primary}`}>
    {chapterTheme.icon} {chapterTheme.name}
  </div>
</div>;
```

### Game Type Themes

```javascript
const gameTheme = getGameTypeTheme("quiz");
// Returns: { primary, accent, icon }

<div className={`bg-gradient-to-r ${gameTheme.primary}`}>
  {gameTheme.icon} Quiz Game
</div>;
```

### Animations

```javascript
// Apply animations using theme classes
<div className={filipinoTheme.animations.fadeIn}>
  Content with fade-in animation
</div>

<div className={filipinoTheme.animations.bounce}>
  Bouncing element
</div>
```

## Components

### GameHeader

A consistent header component for all games.

```javascript
import { GameHeader } from "../components";

<GameHeader
  title="Jose's Birth"
  level={1}
  chapter={1}
  score={85}
  onBack={() => navigate("/chapter/1")}
  onLogout={handleLogout}
  username="Student"
  theme="blue"
  showScore={true}
  maxScore={100}
/>;
```

**Props:**

- `title` (string): Game title
- `level` (number): Current level number
- `chapter` (number): Chapter number
- `score` (number): Current score (optional)
- `onBack` (function): Back button handler
- `onLogout` (function): Logout button handler
- `username` (string): User's name
- `theme` (string): Color theme ('blue', 'red', 'yellow', 'green', 'purple', 'pink')
- `showScore` (boolean): Whether to show score
- `maxScore` (number): Maximum possible score

### ProgressBar

An animated progress indicator with milestone support.

```javascript
import { ProgressBar } from "../components";

<ProgressBar
  current={3}
  total={5}
  theme="blue"
  showLabels={true}
  showPercentage={true}
  animated={true}
  milestones={[
    { value: 1, label: "Started" },
    { value: 3, label: "Halfway" },
    { value: 5, label: "Complete" },
  ]}
/>;
```

**Props:**

- `current` (number): Current progress value
- `total` (number): Total/maximum value
- `theme` (string): Color theme
- `showLabels` (boolean): Show progress labels
- `showPercentage` (boolean): Show percentage
- `animated` (boolean): Enable animations
- `milestones` (array): Milestone markers with value and label
- `size` (string): Size variant ('sm', 'md', 'lg', 'xl')

### GameCard

Interactive cards for game levels with status indicators.

```javascript
import { GameCard } from "../components";

<GameCard
  level={1}
  title="Jose's Birth"
  description="Learn about when and where Jose was born"
  isUnlocked={true}
  isCompleted={false}
  onClick={() => startGame(1)}
  theme="blue"
  icon="👶"
  estimatedTime={5}
  difficulty="easy"
  score={95}
  maxScore={100}
/>;
```

**Props:**

- `level` (number): Level number
- `title` (string): Game title
- `description` (string): Game description
- `isUnlocked` (boolean): Whether level is accessible
- `isCompleted` (boolean): Whether level is completed
- `onClick` (function): Click handler
- `theme` (string): Color theme
- `icon` (string): Emoji or icon
- `estimatedTime` (number): Estimated completion time in minutes
- `difficulty` (string): Difficulty level ('easy', 'medium', 'hard')
- `score` (number): Player's score (if completed)
- `maxScore` (number): Maximum possible score

## Styling Utilities

### Game Styles

```javascript
import gameStyles from "../utils/gameStyles";

// Button styles
const buttonClass = gameStyles.getButtonStyles("primary", "blue", "md");

// Card styles
const cardClass = gameStyles.getCardStyles("default", true);

// Input styles
const inputClass = gameStyles.getInputStyles("default", false);

// Quiz option styles
const optionClass = gameStyles.getQuizOptionStyles(
  isSelected,
  isCorrect,
  isRevealed
);
```

### Container Styles

```javascript
// Game container with chapter background
const containerClass = gameStyles.getGameContainerStyles(1);

// Content area with responsive padding
const contentClass = gameStyles.getGameContentStyles("md");
```

## Color Palette

### Primary Colors (Philippine Flag)

- **Blue**: `from-blue-500 to-indigo-600` - Philippine flag blue
- **Red**: `from-red-500 to-red-600` - Philippine flag red
- **Yellow**: `from-yellow-400 to-amber-500` - Philippine sun yellow

### Chapter Backgrounds

- **Chapter 1**: `from-blue-50 via-sky-50 to-indigo-100` - Childhood (sky blue)
- **Chapter 2**: `from-amber-50 via-orange-50 to-amber-100` - Education (warm amber)
- **Chapter 3**: `from-emerald-50 via-green-50 to-teal-100` - Europe (nature green)
- **Chapter 4**: `from-pink-50 via-rose-50 to-red-100` - Literature (literary rose)
- **Chapter 5**: `from-purple-50 via-indigo-50 to-blue-100` - Legacy (royal purple)

### Status Colors

- **Success**: `from-green-400 to-emerald-500`
- **Warning**: `from-yellow-400 to-orange-500`
- **Error**: `from-red-400 to-red-500`
- **Info**: `from-blue-400 to-indigo-500`

## Animations

All animations are defined in `src/index.css` and available through the theme:

- `animate-fade-in` - Fade in with slight upward movement
- `animate-slide-up` - Slide up from bottom
- `animate-slide-down` - Slide down from top
- `animate-scale-in` - Scale in from center
- `animate-wiggle` - Playful wiggle animation
- `animate-bounce` - Tailwind's bounce animation
- `animate-pulse` - Tailwind's pulse animation

## Best Practices

1. **Consistent Theming**: Always use theme colors instead of hardcoded values
2. **Chapter Context**: Use `getChapterTheme()` to get appropriate colors for each chapter
3. **Responsive Design**: All components are mobile-first and responsive
4. **Accessibility**: Components include proper ARIA labels and keyboard navigation
5. **Performance**: Animations use CSS transforms for optimal performance

## Examples

### Complete Game Page

```javascript
import { GameHeader, ProgressBar, GameCard } from "../components";
import { getChapterTheme } from "../theme";
import gameStyles from "../utils/gameStyles";

const ChapterPage = ({ chapterId, username, onLogout }) => {
  const theme = getChapterTheme(chapterId);

  return (
    <div className={gameStyles.getGameContainerStyles(chapterId)}>
      <GameHeader
        title={theme.name}
        chapter={chapterId}
        username={username}
        onLogout={onLogout}
        theme={chapterId === 1 ? "blue" : "yellow"}
      />

      <main className={gameStyles.getGameContentStyles("md")}>
        <ProgressBar
          current={completedLevels}
          total={totalLevels}
          theme={chapterId === 1 ? "blue" : "yellow"}
          showLabels={true}
          animated={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {levels.map((level) => (
            <GameCard
              key={level.id}
              {...level}
              theme={chapterId === 1 ? "blue" : "yellow"}
              onClick={() => startLevel(level.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
```

This theme system ensures consistent, culturally-appropriate design across all games while maintaining flexibility for different content types and user interactions.
