# Design System Migration Guide

## Overview

This guide helps you migrate existing components to use the new design system utilities. The design system provides consistent styling, better accessibility, and improved maintainability.

---

## Why Migrate?

✅ **Consistency**: All components follow the same design language
✅ **Accessibility**: Built-in WCAG AA compliance
✅ **Maintainability**: Centralized styling makes updates easier
✅ **Performance**: Optimized animations and responsive design
✅ **Developer Experience**: Simple, intuitive API

---

## Migration Steps

### Step 1: Import Design System Utilities

**Before**:

```javascript
import React from "react";
```

**After**:

```javascript
import React from "react";
import {
  getButtonClasses,
  getCardClasses,
  getAnimationClass,
} from "../utils/designSystem";
```

### Step 2: Replace Button Styles

**Before**:

```javascript
<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all">
  Click Me
</button>
```

**After**:

```javascript
<button className={getButtonClasses("primary", "md")}>Click Me</button>
```

### Step 3: Replace Card Styles

**Before**:

```javascript
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
  Content
</div>
```

**After**:

```javascript
<div className={getCardClasses("default", true, "p-6")}>Content</div>
```

### Step 4: Add Animations

**Before**:

```javascript
<div className="opacity-0 animate-fade-in">Content</div>
```

**After**:

```javascript
<div className={getAnimationClass("fadeIn")}>Content</div>
```

---

## Common Migration Patterns

### Pattern 1: Primary Action Button

**Before**:

```javascript
<button
  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
  onClick={handleClick}
>
  Start Game
</button>
```

**After**:

```javascript
<button className={getButtonClasses("primary", "lg")} onClick={handleClick}>
  Start Game
</button>
```

**Benefits**:

- 90% less code
- Consistent styling
- Built-in accessibility
- Easier to maintain

---

### Pattern 2: Level Card

**Before**:

```javascript
<div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <h3 className="text-xl font-semibold mb-2">Level 1</h3>
  <p className="text-gray-600 mb-4">Complete this level</p>
  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
    Start
  </button>
</div>
```

**After**:

```javascript
<div
  className={`${getCardClasses("interactive", true, "p-6")} ${getAnimationClass(
    "slideUp"
  )}`}
>
  <h3 className="text-xl font-semibold mb-2">Level 1</h3>
  <p className="text-gray-600 mb-4">Complete this level</p>
  <button className={getButtonClasses("success", "md")}>Start</button>
</div>
```

**Benefits**:

- Consistent hover effects
- Smooth animations
- Better accessibility
- Responsive design

---

### Pattern 3: Success Message

**Before**:

```javascript
<div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4">
  <p className="text-green-800">✅ Level completed!</p>
</div>
```

**After**:

```javascript
<div
  className={`${getCardClasses(
    "success",
    false,
    "p-4 mb-4"
  )} ${getAnimationClass("slideUp")}`}
>
  <p className="text-green-800">✅ Level completed!</p>
</div>
```

**Benefits**:

- Consistent success styling
- Smooth entrance animation
- Better visual feedback

---

### Pattern 4: Loading State

**Before**:

```javascript
<div className="text-center">
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  <p className="mt-4 text-gray-600">Loading...</p>
</div>
```

**After**:

```javascript
import { getLoadingSpinner } from "../utils/designSystem";

<div className="text-center">
  <div className={getLoadingSpinner("lg", "blue")} />
  <p className="mt-4 text-gray-600">Loading...</p>
</div>;
```

**Benefits**:

- Consistent spinner styling
- Multiple size options
- Color variations

---

### Pattern 5: Form Input

**Before**:

```javascript
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text"
/>
```

**After**:

```javascript
import { getInputClasses } from "../utils/designSystem";

<input
  type="text"
  className={getInputClasses("default")}
  placeholder="Enter text"
/>;
```

**Benefits**:

- Consistent input styling
- Built-in focus states
- Validation states available

---

## Migration Checklist

Use this checklist when migrating a component:

### Buttons

- [ ] Replace custom button styles with `getButtonClasses()`
- [ ] Choose appropriate variant (primary, secondary, success, danger)
- [ ] Select appropriate size (xs, sm, md, lg, xl)
- [ ] Test hover and focus states
- [ ] Verify accessibility (keyboard navigation)

### Cards

- [ ] Replace custom card styles with `getCardClasses()`
- [ ] Add hover effects where appropriate
- [ ] Choose appropriate variant for state (success, error, warning)
- [ ] Test responsive behavior

### Animations

- [ ] Add entrance animations with `getAnimationClass()`
- [ ] Use appropriate animation (fadeIn, slideUp, etc.)
- [ ] Test on mobile devices
- [ ] Verify reduced motion support

### Accessibility

- [ ] Verify focus states are visible
- [ ] Test keyboard navigation
- [ ] Check color contrast (WCAG AA)
- [ ] Ensure touch targets are 44x44px minimum
- [ ] Add ARIA labels where needed

### Responsive Design

- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet (768px - 1023px)
- [ ] Test on desktop (1024px+)
- [ ] Verify touch interactions on mobile

---

## Component-Specific Migration

### Game Components

**Key Changes**:

1. Use `getButtonClasses('primary', 'lg')` for start buttons
2. Use `getCardClasses('interactive', true)` for level cards
3. Add `getAnimationClass('slideUp')` for entrance animations
4. Use `getCardClasses('success')` for completion messages

**Example**:

```javascript
// Before
<div className="bg-white rounded-xl shadow-md p-6">
  <button className="bg-blue-500 text-white py-3 px-6 rounded-lg">
    Start
  </button>
</div>

// After
<div className={getCardClasses('default', false, 'p-6')}>
  <button className={getButtonClasses('primary', 'lg')}>
    Start
  </button>
</div>
```

### Navigation Components

**Key Changes**:

1. Use `getButtonClasses('ghost')` for nav links
2. Use consistent spacing with `spacing` utilities
3. Add focus states for accessibility

### Modal Components

**Key Changes**:

1. Use `getCardClasses('elevated')` for modal container
2. Use `getAnimationClass('scaleIn')` for modal entrance
3. Use `getButtonClasses('danger')` for close/cancel buttons

---

## Testing After Migration

### Visual Testing

1. Compare before/after screenshots
2. Verify hover states work correctly
3. Check animations are smooth
4. Ensure responsive behavior is maintained

### Functional Testing

1. Test all interactive elements
2. Verify keyboard navigation
3. Test on multiple devices
4. Check accessibility with screen reader

### Performance Testing

1. Verify animations are smooth (60fps)
2. Check load times haven't increased
3. Test on low-end devices

---

## Common Issues & Solutions

### Issue 1: Custom Styles Not Working

**Problem**: Custom classes are being overridden

**Solution**: Add custom classes as the third parameter

```javascript
getButtonClasses("primary", "md", "w-full mt-4");
```

### Issue 2: Animation Not Showing

**Problem**: Animation class not applied correctly

**Solution**: Ensure you're using the correct animation name

```javascript
// Wrong
getAnimationClass("fade-in");

// Correct
getAnimationClass("fadeIn");
```

### Issue 3: Button Too Small on Mobile

**Problem**: Touch target is less than 44x44px

**Solution**: Use at least 'md' size on mobile

```javascript
getButtonClasses("primary", "md"); // Minimum for mobile
```

---

## Gradual Migration Strategy

You don't need to migrate everything at once. Follow this strategy:

### Phase 1: New Components (Week 1)

- Use design system for all new components
- Get familiar with the API
- Build confidence

### Phase 2: High-Traffic Components (Week 2)

- Migrate home page
- Migrate chapter pages
- Migrate frequently used games

### Phase 3: Remaining Components (Week 3-4)

- Migrate remaining game components
- Migrate admin dashboard
- Migrate utility components

### Phase 4: Cleanup (Week 5)

- Remove unused custom styles
- Update documentation
- Final testing

---

## Getting Help

### Resources

- **Comprehensive Guide**: `src/utils/DESIGN_SYSTEM_GUIDE.md`
- **Quick Reference**: `src/utils/DESIGN_SYSTEM_QUICK_REFERENCE.md`
- **Verification Component**: `src/components/DesignSystemVerification.jsx`
- **Example Component**: `src/components/DesignSystemExample.jsx`

### Examples

Look at these components for migration examples:

- `DesignSystemExample.jsx` - Complete working example
- `DesignSystemVerification.jsx` - All utilities demonstrated

---

## Benefits Summary

After migration, you'll have:

✅ **80% less styling code** in components
✅ **Consistent design** across the entire app
✅ **Better accessibility** (WCAG AA compliant)
✅ **Improved maintainability** (centralized styles)
✅ **Enhanced UX** (smooth animations, hover effects)
✅ **Mobile optimization** (responsive, touch-friendly)
✅ **Better performance** (optimized animations)

---

## Questions?

If you have questions during migration:

1. Check the comprehensive guide
2. Look at example components
3. Test with the verification component
4. Refer to this migration guide

Happy migrating! 🚀
