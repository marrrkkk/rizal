# Interactive Feedback Quick Reference

## Quick Start

```jsx
import {
  InteractiveButton,
  InteractiveCard,
  LoadingSpinner,
  SuccessMessage,
  ErrorMessage,
} from "../components/InteractiveFeedback";
```

## Common Patterns

### Button with Loading State

```jsx
<InteractiveButton loading={isLoading} onClick={handleClick} variant="primary">
  Submit
</InteractiveButton>
```

### Card with Hover Effect

```jsx
<InteractiveCard onClick={handleClick} hover={true}>
  <div className="p-6">Content</div>
</InteractiveCard>
```

### Success/Error Messages

```jsx
{
  success && (
    <SuccessMessage message="Success!" onClose={() => setSuccess(false)} />
  );
}
{
  error && (
    <ErrorMessage message="Error occurred" onClose={() => setError(null)} />
  );
}
```

### Loading Indicator

```jsx
<LoadingSpinner size="lg" color="blue" text="Loading..." />
```

### Progress Bar

```jsx
<ProgressBar progress={75} variant="success" />
```

## CSS Classes

### Hover Effects

- `.interactive-hover` - Lift on hover
- `.card-lift` - Card lift and scale
- `.button-glow` - Glow effect

### Click Feedback

- `.click-scale` - Scale animation
- `.click-bounce` - Bounce animation

### States

- `.success-state` - Success styling
- `.error-state` - Error styling
- `.warning-state` - Warning styling

### Loading

- `.spinner-border` - Rotating spinner
- `.loading-dots` - Animated dots
- `.skeleton` - Skeleton loader

## Utility Functions

```javascript
import {
  getButtonHover,
  getInteractiveFeedback,
  getSuccessClasses,
  getErrorClasses,
  getLoadingSpinner,
} from "../utils/interactiveFeedback";

// Usage
const classes = getButtonHover("primary");
const feedback = getInteractiveFeedback("card");
const success = getSuccessClasses("background");
```

## Button Variants

- `primary` - Blue gradient
- `secondary` - White with blue border
- `success` - Green gradient
- `danger` - Red gradient
- `warning` - Yellow/orange gradient
- `ghost` - Transparent

## Button Sizes

- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

## Card Variants

- `default` - White background
- `success` - Green background
- `error` - Red background
- `warning` - Yellow background
- `info` - Blue background

## Loading Spinner Sizes

- `xs` - 12px
- `sm` - 16px
- `md` - 32px (default)
- `lg` - 48px
- `xl` - 64px

## Loading Spinner Colors

- `blue` (default)
- `green`
- `red`
- `yellow`
- `gray`
- `white`

## Demo Page

Visit `/feedback-demo` to see all interactive feedback features in action.

## Accessibility

All components include:

- Keyboard navigation
- Focus indicators
- ARIA labels
- Screen reader support

## Performance Tips

1. Use CSS transitions over JavaScript animations
2. Apply `will-change` for frequently animated elements
3. Use `transform` and `opacity` for GPU acceleration
4. Debounce hover effects when needed

## Common Issues

### Button not showing hover effect

- Ensure you're using `InteractiveButton` component
- Check if `disabled` prop is set
- Verify CSS is loaded

### Loading spinner not visible

- Check `color` prop matches background
- Ensure parent has proper dimensions
- Verify `show` prop is true for overlays

### Messages not auto-closing

- Set `autoClose={true}`
- Adjust `duration` prop (default 3000ms)
- Ensure `onClose` handler is provided
