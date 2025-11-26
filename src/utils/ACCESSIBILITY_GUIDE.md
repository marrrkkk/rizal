# Accessibility Implementation Guide

## Overview

This guide documents the accessibility improvements implemented across the Rizal Adventure application to meet WCAG AA standards (Requirement 15.4).

## Key Accessibility Features

### 1. Focus States

All interactive elements have visible focus indicators that meet WCAG 2.1 Success Criterion 2.4.7 (Focus Visible).

**Implementation:**

- 3px solid blue outline with 2px offset
- Additional shadow for enhanced visibility
- High contrast mode support with 4px black outline

**Usage:**

```javascript
import { getFocusRing } from "../utils/accessibility";

<button className={getFocusRing()}>Click me</button>;
```

### 2. Touch Target Sizes

All interactive elements meet the minimum 44x44px touch target size requirement (WCAG 2.1 Success Criterion 2.5.5).

**Implementation:**

- Minimum: 44x44px (WCAG AA requirement)
- Recommended: 48x48px (better usability)
- Large: 56x56px (for primary actions)

**Usage:**

```javascript
import { getTouchTarget } from "../utils/accessibility";

<button className={getTouchTarget("recommended")}>Click me</button>;
```

### 3. ARIA Labels

Comprehensive ARIA labels for screen readers throughout the application.

**Implementation:**

- All buttons have descriptive aria-labels
- Form inputs have proper aria-required and aria-invalid attributes
- Error messages use role="alert" and aria-live="polite"
- Loading states use role="status" and aria-live="polite"

**Usage:**

```javascript
import { getButtonA11yProps } from "../utils/accessibilityEnhancements";

<button {...getButtonA11yProps("Submit form", { variant: "primary" })}>
  Submit
</button>;
```

### 4. Color Contrast

All text and background color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Implementation:**

- Validated color combinations in `accessibleColors` object
- Contrast ratio calculation utilities
- WCAG AA compliance checking

**Usage:**

```javascript
import {
  getAccessibleColors,
  validateColorContrast,
} from "../utils/accessibility";

const colors = getAccessibleColors("darkOnLight", "gray-900-on-white");
// Returns: { text: 'text-gray-900', bg: 'bg-white', ratio: 21 }

const validation = validateColorContrast(
  { r: 33, g: 53, b: 71 }, // foreground
  { r: 255, g: 255, b: 255 }, // background
  false // isLargeText
);
// Returns: { ratio: '12.63', passes: true, level: 'AA', recommendation: '...' }
```

### 5. Keyboard Navigation

Full keyboard navigation support for all interactive elements.

**Implementation:**

- Tab navigation through all interactive elements
- Enter and Space key activation for buttons
- Arrow key navigation for lists and menus
- Escape key to close modals and menus
- Focus trapping in modals

**Usage:**

```javascript
import {
  onKeyboardActivate,
  handleArrowKeyNavigation,
} from "../utils/accessibilityEnhancements";

<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={onKeyboardActivate(handleClick)}
>
  Click or press Enter/Space
</div>;
```

### 6. Screen Reader Announcements

Dynamic content changes are announced to screen readers.

**Implementation:**

- Success messages announced with aria-live="polite"
- Error messages announced with aria-live="assertive"
- Navigation changes announced
- Loading states announced

**Usage:**

```javascript
import {
  announceSuccess,
  announceError,
  announceLoading,
} from "../utils/accessibilityEnhancements";

// Announce success
announceSuccess("Form submitted successfully");

// Announce error
announceError("Failed to submit form");

// Announce loading
announceLoading("Loading your data");
```

## Accessible Components

### AccessibleButton

WCAG AA compliant button component with proper focus states, touch targets, and ARIA labels.

```javascript
import AccessibleButton from "../components/AccessibleButton";

<AccessibleButton
  variant="primary"
  ariaLabel="Submit form"
  onClick={handleSubmit}
  disabled={isLoading}
>
  Submit
</AccessibleButton>;
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
- `ariaLabel`: Descriptive label for screen readers
- `disabled`: Boolean to disable the button
- `pressed`: Boolean for toggle buttons (aria-pressed)
- `expanded`: Boolean for expandable buttons (aria-expanded)
- `controls`: ID of controlled element (aria-controls)

### AccessibleLink

WCAG AA compliant link component with proper focus states and ARIA labels.

```javascript
import AccessibleLink from "../components/AccessibleLink";

<AccessibleLink
  to="/chapter/1"
  ariaLabel="Go to Chapter 1: Childhood in Calamba"
>
  Chapter 1
</AccessibleLink>;
```

**Props:**

- `to`: Destination URL
- `ariaLabel`: Descriptive label for screen readers
- `external`: Boolean for external links (opens in new tab)
- `download`: Boolean for download links

### AccessibleInput

WCAG AA compliant input component with proper focus states, error handling, and ARIA labels.

```javascript
import AccessibleInput from "../components/AccessibleInput";

<AccessibleInput
  id="username"
  label="Username"
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required={true}
  error={usernameError}
  autocomplete="username"
/>;
```

**Props:**

- `id`: Unique identifier
- `label`: Visible label text
- `type`: Input type
- `required`: Boolean for required fields
- `error`: Error message string
- `autocomplete`: Autocomplete attribute value

## Accessibility Utilities

### Focus Management

```javascript
import { trapFocus, getFocusableElements } from "../utils/accessibility";

// Trap focus within modal
const modalElement = document.getElementById("modal");
trapFocus(modalElement);

// Get all focusable elements
const focusableElements = getFocusableElements(containerElement);
```

### Skip Links

```javascript
import { createSkipLink } from "../utils/accessibility";

// Create skip to main content link
const skipLink = createSkipLink("main-content");
document.body.prepend(skipLink);
```

### Reduced Motion

```javascript
import {
  prefersReducedMotion,
  getAccessibleAnimation,
} from "../utils/accessibility";

// Check if user prefers reduced motion
if (prefersReducedMotion()) {
  // Disable animations
}

// Get animation class respecting user preferences
const animationClass = getAccessibleAnimation("fadeIn");
```

## Testing Accessibility

### Manual Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible on all interactive elements
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets are at least 44x44px
- [ ] Screen reader announces dynamic content changes
- [ ] Modals trap focus and can be closed with Escape key
- [ ] Skip links are present and functional

### Automated Testing

Use the following tools to test accessibility:

1. **axe DevTools** - Browser extension for automated accessibility testing
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Chrome DevTools accessibility audit
4. **NVDA/JAWS** - Screen reader testing

### Color Contrast Testing

```javascript
import { validateColorContrast } from "../utils/accessibilityEnhancements";

const result = validateColorContrast(
  { r: 33, g: 53, b: 71 }, // foreground
  { r: 255, g: 255, b: 255 }, // background
  false // isLargeText
);

console.log(result);
// {
//   ratio: '12.63',
//   passes: true,
//   level: 'AA',
//   recommendation: 'Color contrast meets WCAG AA standards'
// }
```

## Common Patterns

### Accessible Card

```javascript
import { getCardA11yProps } from "../utils/accessibilityEnhancements";

<div
  {...getCardA11yProps("Chapter 1: Childhood in Calamba", {
    clickable: true,
    disabled: false,
    selected: false,
  })}
  onClick={handleClick}
>
  <h3>Chapter 1</h3>
  <p>Childhood in Calamba</p>
</div>;
```

### Accessible Modal

```javascript
import { getModalA11yProps } from "../utils/accessibilityEnhancements";

<div
  {...getModalA11yProps("Completion Certificate", {
    labelledBy: "modal-title",
    describedBy: "modal-description",
  })}
>
  <h2 id="modal-title">Completion Certificate</h2>
  <p id="modal-description">Congratulations on completing the level!</p>
</div>;
```

### Accessible Progress Bar

```javascript
import { getProgressBarA11yProps } from "../utils/accessibilityEnhancements";

<div
  {...getProgressBarA11yProps(75, 100, "Chapter progress")}
  className="progress-bar"
>
  <div className="progress-fill" style={{ width: "75%" }} />
</div>;
```

## Best Practices

1. **Always provide text alternatives** for non-text content
2. **Use semantic HTML** (header, nav, main, footer, article, section)
3. **Ensure keyboard accessibility** for all interactive elements
4. **Provide clear focus indicators** that meet contrast requirements
5. **Use ARIA labels** when native HTML semantics are insufficient
6. **Test with screen readers** (NVDA, JAWS, VoiceOver)
7. **Respect user preferences** (reduced motion, high contrast)
8. **Maintain logical heading hierarchy** (h1 → h2 → h3)
9. **Provide error messages** that are clear and actionable
10. **Ensure touch targets** are at least 44x44px

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## Support

For questions or issues related to accessibility, please refer to:

- `src/utils/accessibility.js` - Core accessibility utilities
- `src/utils/accessibilityEnhancements.js` - Enhanced accessibility helpers
- `src/components/Accessible*.jsx` - Accessible component implementations
