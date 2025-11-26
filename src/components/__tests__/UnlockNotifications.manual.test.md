# Unlock Notifications Manual Test Guide

This document provides instructions for manually testing the unlock notification components.

## Components Tested

- `LevelUnlockNotification` - Shows when a new level is unlocked
- `ChapterUnlockNotification` - Shows when a new chapter is unlocked

## Test Scenarios

### Test 1: Level Unlock Notification

**Objective**: Verify that level unlock notification appears when completing a level

**Steps**:

1. Log in to the application
2. Navigate to Chapter 1, Level 1
3. Complete the level successfully
4. Observe the notifications that appear

**Expected Results**:

- A celebration animation should appear
- A toast notification should show "Level completed!"
- A level unlock notification should appear in the top-right corner showing:
  - Chapter emoji (🏠 for Chapter 1)
  - "New Level Unlocked!" header
  - Chapter and level number
  - "Ready to play!" message
- The notification should auto-close after 4 seconds
- A "Next Level" button should appear

**Validation**:

- ✅ Notification appears with correct chapter and level
- ✅ Notification has proper animations (slide in from right)
- ✅ Notification auto-closes after duration
- ✅ Close button works manually
- ✅ Visual design matches Filipino theme

### Test 2: Chapter Unlock Notification

**Objective**: Verify that chapter unlock notification appears when completing the last level of a chapter

**Steps**:

1. Log in to the application
2. Complete all levels in Chapter 1 (Levels 1-5)
3. When completing Level 5, observe the notifications

**Expected Results**:

- A celebration animation should appear
- A toast notification should show "New Chapter 2 unlocked!"
- A chapter unlock notification should appear as a modal overlay showing:
  - Chapter emoji (📚 for Chapter 2)
  - "New Chapter Unlocked!" header
  - Chapter number and name
  - Celebration elements (🎉 🌟 🎊)
  - "Great Progress!" achievement message
  - "Continue Learning!" button
- The notification should auto-close after 5 seconds or when clicking the button

**Validation**:

- ✅ Notification appears with correct chapter information
- ✅ Notification has proper animations (fade in with scale)
- ✅ Background overlay is semi-transparent
- ✅ Notification auto-closes after duration
- ✅ Button closes notification and allows navigation
- ✅ Visual design has celebration effects

### Test 3: Multiple Notifications

**Objective**: Verify that both level and chapter notifications can appear together

**Steps**:

1. Complete the last level of any chapter (e.g., Chapter 1, Level 5)
2. Observe the sequence of notifications

**Expected Results**:

- Celebration animation appears first
- Toast notifications appear in sequence:
  - Level completion toast (1.5s delay)
  - Chapter unlock toast (2.5s delay)
- Chapter unlock notification modal appears (2.5s delay)
- Level completion modal appears (2s delay)
- All notifications should be properly stacked and visible

**Validation**:

- ✅ Notifications appear in correct order
- ✅ No visual conflicts between notifications
- ✅ All notifications are readable and accessible
- ✅ Timing is appropriate and not overwhelming

### Test 4: Notification Interactions

**Objective**: Verify that notification interactions work correctly

**Steps**:

1. Trigger a level unlock notification
2. Click the close button (X) before auto-close
3. Trigger a chapter unlock notification
4. Click the "Continue Learning!" button
5. Click outside the modal (on the overlay)

**Expected Results**:

- Close button immediately closes the notification
- "Continue Learning!" button closes the chapter notification
- Clicking overlay closes the chapter notification
- All interactions are smooth with proper animations

**Validation**:

- ✅ Close button works immediately
- ✅ Action buttons work correctly
- ✅ Overlay click closes modal
- ✅ Exit animations play correctly

### Test 5: Responsive Design

**Objective**: Verify notifications work on different screen sizes

**Steps**:

1. Test on desktop (1920x1080)
2. Test on tablet (768x1024)
3. Test on mobile (375x667)
4. Trigger both level and chapter unlock notifications on each device

**Expected Results**:

- Level unlock notification:
  - Desktop: Appears in top-right corner
  - Tablet: Appears in top-right corner, slightly smaller
  - Mobile: Appears at top, full width with padding
- Chapter unlock notification:
  - All devices: Centered modal with appropriate sizing
  - Mobile: Takes up most of screen with proper padding

**Validation**:

- ✅ Notifications are readable on all screen sizes
- ✅ Touch targets are appropriate (minimum 44x44px)
- ✅ Text doesn't overflow or get cut off
- ✅ Animations work smoothly on all devices

### Test 6: Accessibility

**Objective**: Verify notifications are accessible

**Steps**:

1. Use keyboard navigation to interact with notifications
2. Use screen reader to read notification content
3. Check color contrast ratios

**Expected Results**:

- Keyboard navigation:
  - Tab key focuses on close button and action buttons
  - Enter/Space activates buttons
  - Escape key closes notifications
- Screen reader:
  - Announces notification content
  - Announces button labels
- Color contrast:
  - Text meets WCAG AA standards (4.5:1 minimum)

**Validation**:

- ✅ Keyboard navigation works
- ✅ Screen reader announces content
- ✅ Color contrast is sufficient
- ✅ Focus indicators are visible

## Integration Points

The unlock notifications are integrated into the game completion flow in `App.jsx`:

1. **Level Unlock**: Triggered in `handleLevelComplete` when `result.nextLevelUnlocked` is present
2. **Chapter Unlock**: Triggered in `handleLevelComplete` when `result.nextChapterUnlocked` is present

## Component Props

### LevelUnlockNotification

```jsx
<LevelUnlockNotification
  chapter={number}           // Chapter number (1-6)
  level={number}             // Level number (1-5)
  chapterName={string}       // Optional chapter name
  onClose={function}         // Callback when notification closes
  autoClose={boolean}        // Auto-close after duration (default: true)
  duration={number}          // Duration in ms (default: 4000)
/>
```

### ChapterUnlockNotification

```jsx
<ChapterUnlockNotification
  chapter={number}           // Chapter number (1-6)
  chapterName={string}       // Chapter name
  onClose={function}         // Callback when notification closes
  autoClose={boolean}        // Auto-close after duration (default: true)
  duration={number}          // Duration in ms (default: 5000)
/>
```

## Notes

- Both components use React portals to render at the document body level
- Animations are CSS-based for performance
- Components are fully self-contained with no external dependencies
- Filipino-themed colors and emojis are used throughout
- Components implement Requirement 9.5 from the design document
