# Design System Guide

## Overview

This design system provides a comprehensive set of utilities for creating consistent, accessible, and visually appealing UI components throughout the José Rizal educational app. It implements Requirements 15.1 and 15.2 for consistent design and interactive feedback.

## Table of Contents

1. [Spacing Scale](#spacing-scale)
2. [Button Variants](#button-variants)
3. [Card Styles](#card-styles)
4. [Animation Utilities](#animation-utilities)
5. [Typography](#typography)
6. [Colors](#colors)
7. [Loading States](#loading-states)
8. [Badges](#badges)
9. [Form Inputs](#form-inputs)
10. [Accessibility](#accessibility)

---

## Spacing Scale

Consistent spacing throughout the application using a predefined scale.

### Usage

```javascript
import { spacing, spacingClasses } from "../utils/designSystem";

// CSS values
const padding = spacing.md; // "1rem"

// Tailwind classes
<div className={spacingClasses.lg}>Content</div>;
```

### Available Sizes

- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)
- `4xl`: 6rem (96px)

---

## Button Variants

Pre-styled button variants with hover effects, focus states, and accessibility features.

### Usage

```javascript
import { getButtonClasses } from "../utils/designSystem";

<button className={getButtonClasses("primary", "md")}>Click Me</button>;
```

### Available Variants

- **primary**: Blue gradient with white text
- **secondary**: White background with blue border
- **success**: Green gradient with white text
- **danger**: Red gradient with white text
- **warning**: Yellow/orange gradient with white text
- **ghost**: Transparent with gray text
- **outline**: Transparent with gray border

### Available Sizes

- `xs`: Extra small (px-3 py-1.5)
- `sm`: Small (px-4 py-2)
- `md`: Medium (px-6 py-3) - Default
- `lg`: Large (px-8 py-4)
- `xl`: Extra large (px-10 py-5)

### Example

```javascript
// Primary button with medium size
<button className={getButtonClasses('primary', 'md')}>
  Submit
</button>

// Success button with large size
<button className={getButtonClasses('success', 'lg')}>
  Complete Level
</button>

// Custom classes can be added
<button className={getButtonClasses('danger', 'sm', 'w-full')}>
  Delete
</button>
```

---

## Card Styles

Flexible card components with various states and hover effects.

### Usage

```javascript
import { getCardClasses } from "../utils/designSystem";

<div className={getCardClasses("default", true, "p-6")}>Card Content</div>;
```

### Available Variants

- **default**: Standard white card with shadow
- **elevated**: Enhanced shadow for prominence
- **interactive**: Hover effects (lift and shadow)
- **success**: Green background and border
- **warning**: Yellow background and border
- **error**: Red background and border
- **info**: Blue background and border
- **gradient**: Blue gradient background

### Parameters

1. `variant`: Card style variant (default: 'default')
2. `withHover`: Enable hover effects (default: false)
3. `className`: Additional custom classes (default: '')

### Example

```javascript
// Interactive card with hover effect
<div className={getCardClasses('interactive', true, 'p-6')}>
  <h3>Level 1</h3>
  <p>Click to start</p>
</div>

// Success state card
<div className={getCardClasses('success', false, 'p-4')}>
  <p>Level completed!</p>
</div>
```

---

## Animation Utilities

Smooth, performant animations for engaging user experiences.

### Usage

```javascript
import { getAnimationClass, animations } from "../utils/designSystem";

<div className={getAnimationClass("fadeIn")}>Animated Content</div>;
```

### Available Animations

#### Entrance Animations

- **fadeIn**: Fade in with slight upward movement
- **slideUp**: Slide up from below
- **slideDown**: Slide down from above
- **scaleIn**: Scale up from smaller size

#### Attention Animations

- **bounce**: Bouncing effect
- **pulse**: Pulsing scale effect
- **wiggle**: Wiggle/shake effect

#### Loading Animations

- **spin**: Continuous rotation
- **shimmer**: Shimmer/loading effect

#### Celebration Animations

- **confetti**: Confetti falling effect
- **badgeBounce**: Badge bounce animation
- **celebrationPulse**: Celebration pulse effect

### Example

```javascript
// Fade in animation
<div className={getAnimationClass('fadeIn')}>
  Welcome!
</div>

// Multiple animations
<div className={`${getAnimationClass('slideUp')} ${getAnimationClass('pulse')}`}>
  Achievement Unlocked!
</div>
```

---

## Typography

Consistent typography scale with responsive sizing.

### Usage

```javascript
import { typography, getResponsiveText } from '../utils/designSystem';

<h1 className={typography.sizes['2xl']}>Title</h1>
<p className={getResponsiveText('base')}>Responsive text</p>
```

### Font Sizes

- `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Font Weights

- `normal`, `medium`, `semibold`, `bold`, `black`

### Text Colors

- `primary`: Dark gray (main text)
- `secondary`: Medium gray
- `muted`: Light gray
- `light`: Very light gray
- `white`: White text

---

## Colors

Filipino-themed color palette inspired by the Philippine flag.

### Primary Colors

```javascript
import { colors } from "../utils/designSystem";

// Philippine flag colors
colors.primary.blue; // "from-blue-500 to-indigo-600"
colors.primary.red; // "from-red-500 to-red-600"
colors.primary.yellow; // "from-yellow-400 to-amber-500"
```

### Status Colors

- **success**: Green gradient
- **warning**: Yellow/orange gradient
- **error**: Red gradient
- **info**: Blue gradient

### Usage in Gradients

```javascript
<div className={`bg-gradient-to-r ${colors.primary.blue}`}>Content</div>
```

---

## Loading States

Visual feedback for loading and processing states.

### Usage

```javascript
import { getLoadingSpinner } from "../utils/designSystem";

<div className={getLoadingSpinner("md", "blue")} />;
```

### Parameters

1. `size`: Spinner size ('xs', 'sm', 'md', 'lg', 'xl')
2. `color`: Spinner color ('blue', 'green', 'red', 'yellow', 'gray')

### Skeleton Loading

```javascript
<div className="skeleton skeleton-text" />
<div className="skeleton skeleton-card" />
<div className="skeleton skeleton-avatar" />
```

---

## Badges

Small status indicators and labels.

### Usage

```javascript
import { getBadgeClasses } from "../utils/designSystem";

<span className={getBadgeClasses("success")}>Completed</span>;
```

### Available Variants

- `default`: Gray badge
- `primary`: Blue badge
- `success`: Green badge
- `warning`: Yellow badge
- `danger`: Red badge
- `info`: Blue badge

---

## Form Inputs

Styled form inputs with validation states.

### Usage

```javascript
import { getInputClasses } from "../utils/designSystem";

<input
  type="text"
  className={getInputClasses("default")}
  placeholder="Enter text"
/>;
```

### Available Variants

- **default**: Standard input style
- **error**: Red border and background (validation error)
- **success**: Green border and background (validation success)
- **disabled**: Grayed out disabled state

---

## Accessibility

The design system includes built-in accessibility features:

### Focus States

All interactive elements have visible focus indicators:

```javascript
import { focusRing } from "../utils/designSystem";

<button className={focusRing.default}>Accessible Button</button>;
```

### Touch Targets

Minimum 44x44px touch targets on mobile devices (WCAG AA compliant).

### Color Contrast

All color combinations meet WCAG AA standards (4.5:1 for normal text).

### Screen Reader Support

- Use semantic HTML elements
- Include ARIA labels where needed
- Provide text alternatives for visual content

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Logical tab order is maintained

---

## Utility Functions

### Combine Classes

```javascript
import { cn } from "../utils/designSystem";

const classes = cn(
  "base-class",
  condition && "conditional-class",
  "another-class"
);
```

### Responsive Text

```javascript
import { getResponsiveText } from "../utils/designSystem";

<h1 className={getResponsiveText("xl")}>Responsive Heading</h1>;
```

### Responsive Spacing

```javascript
import { getResponsiveSpacing } from "../utils/designSystem";

<div className={getResponsiveSpacing("lg")}>Responsive Padding</div>;
```

---

## Best Practices

1. **Consistency**: Always use design system utilities instead of custom styles
2. **Accessibility**: Ensure all interactive elements have proper focus states
3. **Performance**: Use CSS animations instead of JavaScript when possible
4. **Responsive**: Test on multiple device sizes
5. **Touch-Friendly**: Maintain minimum 44x44px touch targets on mobile

---

## Examples

### Complete Button Example

```javascript
import { getButtonClasses, getAnimationClass } from "../utils/designSystem";

<button
  className={`${getButtonClasses("primary", "lg")} ${getAnimationClass(
    "fadeIn"
  )}`}
  onClick={handleClick}
>
  Start Game
</button>;
```

### Complete Card Example

```javascript
import { getCardClasses, getAnimationClass } from "../utils/designSystem";

<div
  className={`${getCardClasses("interactive", true, "p-6")} ${getAnimationClass(
    "slideUp"
  )}`}
>
  <h3 className="text-xl font-semibold mb-2">Level 1</h3>
  <p className="text-gray-600 mb-4">Complete this level to unlock the next</p>
  <button className={getButtonClasses("primary", "md")}>Start</button>
</div>;
```

### Loading State Example

```javascript
import { getLoadingSpinner, getCardClasses } from "../utils/designSystem";

<div className={getCardClasses("default", false, "p-8 text-center")}>
  <div className={`${getLoadingSpinner("lg", "blue")} mx-auto mb-4`} />
  <p className="text-gray-600">Loading...</p>
</div>;
```

---

## Testing

To verify the design system is working correctly, use the `DesignSystemVerification` component:

```javascript
import DesignSystemVerification from "./components/DesignSystemVerification";

// Render in your app to see all components
<DesignSystemVerification />;
```

---

## Support

For questions or issues with the design system, refer to:

- Design document: `.kiro/specs/rizal-app-improvements/design.md`
- Requirements: `.kiro/specs/rizal-app-improvements/requirements.md`
- Implementation: `src/utils/designSystem.js`
