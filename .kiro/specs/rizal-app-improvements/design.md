# Design Document

## Overview

The José Rizal educational app improvements will focus on enhancing the user interface with Filipino-themed design elements, fixing existing game functionality, completing missing levels, and ensuring a smooth learning experience for children. The design maintains the existing React architecture while introducing consistent theming, improved game mechanics, and better progress tracking.

## Architecture

### Current Architecture

- **Frontend**: React 19.1.0 with React Router for navigation
- **Styling**: Tailwind CSS 4.1.10 for responsive design
- **Interactions**: @dnd-kit for drag-and-drop functionality
- **State Management**: React hooks (useState, useEffect) with localStorage for persistence
- **Authentication**: JWT-based authentication with PHP backend

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

### Progress Tracking

```javascript
const ProgressModel = {
  userId: string,
  chapters: {
    [chapterId]: {
      unlockedLevels: number[],
      completedLevels: number[],
      scores: { [levelId]: number },
      badges: string[],
      completionDate: Date
    }
  },
  overallProgress: {
    totalLevels: number,
    completedLevels: number,
    averageScore: number,
    badges: string[]
  }
}
```

### Game State

```javascript
const GameState = {
  currentLevel: number,
  score: number,
  attempts: number,
  startTime: Date,
  endTime: Date,
  interactions: InteractionLog[],
  hintsUsed: number,
  completed: boolean
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
  theme: ThemeConfig
}
```

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
