# Design System Quick Reference

## Import

```javascript
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
  getBadgeClasses,
  getLoadingSpinner,
  getInputClasses,
  spacing,
  animations,
  colors,
} from "../utils/designSystem";
```

## Buttons

```javascript
// Syntax: getButtonClasses(variant, size, customClasses)
<button className={getButtonClasses("primary", "md")}>Click Me</button>

// Variants: primary, secondary, success, danger, warning, ghost, outline
// Sizes: xs, sm, md, lg, xl
```

## Cards

```javascript
// Syntax: getCardClasses(variant, withHover, customClasses)
<div className={getCardClasses("default", true, "p-6")}>Content</div>

// Variants: default, elevated, interactive, success, warning, error, info, gradient
// withHover: true/false (adds hover effects)
```

## Animations

```javascript
// Syntax: getAnimationClass(animationName)
<div className={getAnimationClass("fadeIn")}>Animated</div>

// Animations: fadeIn, slideUp, slideDown, scaleIn, bounce, pulse, wiggle, spin, shimmer
```

## Badges

```javascript
// Syntax: getBadgeClasses(variant, customClasses)
<span className={getBadgeClasses("success")}>Badge</span>

// Variants: default, primary, success, warning, danger, info
```

## Loading Spinners

```javascript
// Syntax: getLoadingSpinner(size, color)
<div className={getLoadingSpinner("md", "blue")} />

// Sizes: xs, sm, md, lg, xl
// Colors: blue, green, red, yellow, gray
```

## Form Inputs

```javascript
// Syntax: getInputClasses(variant, customClasses)
<input className={getInputClasses("default")} />

// Variants: default, error, success, disabled
```

## Spacing

```javascript
// Direct values
padding: spacing.md; // "1rem"

// Sizes: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
```

## Colors

```javascript
// Philippine flag colors
<div className={`bg-gradient-to-r ${colors.primary.blue}`}>

// Status colors
<div className={`bg-gradient-to-r ${colors.success}`}>
```

## Complete Example

```javascript
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
} from "../utils/designSystem";

const MyComponent = () => (
  <div
    className={`${getCardClasses(
      "interactive",
      true,
      "p-6"
    )} ${getAnimationClass("slideUp")}`}
  >
    <h2 className="text-xl font-semibold mb-4">Title</h2>
    <p className="text-gray-600 mb-4">Description</p>
    <button className={getButtonClasses("primary", "lg")}>Action</button>
  </div>
);
```

## Accessibility Checklist

- ✅ All buttons have focus states (built-in)
- ✅ Touch targets are 44x44px minimum (built-in)
- ✅ Color contrast meets WCAG AA (built-in)
- ✅ Use semantic HTML elements
- ✅ Add ARIA labels where needed
- ✅ Test keyboard navigation

## Common Patterns

### Game Level Card

```javascript
<div className={getCardClasses("interactive", true, "p-6")}>
  <h3 className="text-lg font-semibold">Level 1</h3>
  <button className={getButtonClasses("primary", "md")}>Start</button>
</div>
```

### Success Message

```javascript
<div
  className={`${getCardClasses("success", false, "p-4")} ${getAnimationClass(
    "slideUp"
  )}`}
>
  <p>✅ Level completed!</p>
</div>
```

### Loading State

```javascript
<div className="text-center">
  <div className={getLoadingSpinner("lg", "blue")} />
  <p>Loading...</p>
</div>
```

### Error Message

```javascript
<div className={getCardClasses("error", false, "p-4")}>
  <p>❌ Something went wrong</p>
</div>
```

## Tips

1. Always use design system utilities instead of custom styles
2. Combine animations with cards for engaging UX
3. Use appropriate button variants for different actions
4. Test on mobile devices for touch targets
5. Verify color contrast for accessibility
