# Accessibility Quick Reference

## Quick Start Guide for Developers

### 1. Using Accessible Components

#### Buttons

```javascript
import AccessibleButton from "../components/AccessibleButton";

<AccessibleButton
  variant="primary"
  ariaLabel="Submit form"
  onClick={handleSubmit}
>
  Submit
</AccessibleButton>;
```

#### Links

```javascript
import AccessibleLink from "../components/AccessibleLink";

<AccessibleLink to="/chapter/1" ariaLabel="Go to Chapter 1">
  Chapter 1
</AccessibleLink>;
```

#### Inputs

```javascript
import AccessibleInput from "../components/AccessibleInput";

<AccessibleInput
  id="username"
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required={true}
  error={error}
/>;
```

### 2. Adding Accessibility to Existing Components

#### Focus States

```javascript
import { getFocusRing } from "../utils/accessibility";

<div className={`your-classes ${getFocusRing()}`}>Content</div>;
```

#### Touch Targets

```javascript
import { getTouchTarget } from "../utils/accessibility";

<button className={`your-classes ${getTouchTarget("recommended")}`}>
  Click me
</button>;
```

#### ARIA Labels

```javascript
import { getButtonA11yProps } from "../utils/accessibilityEnhancements";

<button {...getButtonA11yProps("Submit form")}>Submit</button>;
```

### 3. Screen Reader Announcements

```javascript
import {
  announceSuccess,
  announceError,
} from "../utils/accessibilityEnhancements";

// On success
announceSuccess("Form submitted successfully");

// On error
announceError("Failed to submit form");
```

### 4. Keyboard Navigation

```javascript
import { onKeyboardActivate } from "../utils/accessibilityEnhancements";

<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={onKeyboardActivate(handleClick)}
>
  Click or press Enter/Space
</div>;
```

### 5. Color Contrast Validation

```javascript
import { validateColorContrast } from "../utils/accessibilityEnhancements";

const result = validateColorContrast(
  { r: 33, g: 53, b: 71 }, // foreground
  { r: 255, g: 255, b: 255 }, // background
  false // isLargeText
);

console.log(result.passes); // true/false
console.log(result.ratio); // "12.63"
```

## Common Patterns

### Interactive Card

```javascript
<div
  role="button"
  tabIndex={0}
  aria-label="Chapter 1: Childhood in Calamba"
  className={`${getFocusRing()} ${getTouchTarget("minimum")}`}
  onClick={handleClick}
  onKeyDown={onKeyboardActivate(handleClick)}
>
  <h3>Chapter 1</h3>
  <p>Childhood in Calamba</p>
</div>
```

### Form with Error

```javascript
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={error ? "true" : "false"}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <div id="email-error" role="alert" aria-live="polite">
      {error}
    </div>
  )}
</div>
```

### Loading State

```javascript
<div role="status" aria-live="polite" aria-label="Loading, please wait">
  <LoadingSpinner />
  <span className="sr-only">Loading, please wait</span>
</div>
```

## Checklist for New Components

- [ ] All interactive elements have focus states
- [ ] Touch targets are at least 44x44px
- [ ] All buttons have aria-label
- [ ] All form inputs have labels
- [ ] Error messages have role="alert"
- [ ] Loading states have role="status"
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader announcements for dynamic content

## Testing Commands

```bash
# Check for accessibility issues (manual)
# 1. Tab through all interactive elements
# 2. Use only keyboard to navigate
# 3. Check focus indicators are visible
# 4. Verify touch targets are large enough
# 5. Test with screen reader (NVDA/JAWS)
```

## Resources

- Full Guide: `src/utils/ACCESSIBILITY_GUIDE.md`
- Utilities: `src/utils/accessibility.js`
- Enhancements: `src/utils/accessibilityEnhancements.js`
- Components: `src/components/Accessible*.jsx`
