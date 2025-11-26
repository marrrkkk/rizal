/**
 * Design System Tests
 * Validates that all design system utilities are working correctly
 * Requirements: 15.1, 15.2
 */

import { describe, it, expect } from "vitest";
import {
  spacing,
  spacingClasses,
  buttonVariants,
  buttonSizes,
  getButtonClasses,
  cardVariants,
  getCardClasses,
  animations,
  getAnimationClass,
  transitions,
  shadows,
  borderRadius,
  colors,
  typography,
  focusRing,
  loadingStates,
  getLoadingSpinner,
  responsive,
  badgeVariants,
  getBadgeClasses,
  inputVariants,
  getInputClasses,
  cn,
  getResponsiveText,
  getResponsiveSpacing,
} from "../designSystem";

describe("Design System - Spacing", () => {
  it("should export spacing scale", () => {
    expect(spacing).toBeDefined();
    expect(spacing.xs).toBe("0.25rem");
    expect(spacing.sm).toBe("0.5rem");
    expect(spacing.md).toBe("1rem");
    expect(spacing.lg).toBe("1.5rem");
    expect(spacing.xl).toBe("2rem");
  });

  it("should export spacing classes", () => {
    expect(spacingClasses).toBeDefined();
    expect(spacingClasses.md).toBe("p-4");
  });
});

describe("Design System - Buttons", () => {
  it("should export button variants", () => {
    expect(buttonVariants).toBeDefined();
    expect(buttonVariants.primary).toContain("bg-gradient-to-r");
    expect(buttonVariants.secondary).toContain("border-2");
    expect(buttonVariants.success).toContain("green");
    expect(buttonVariants.danger).toContain("red");
  });

  it("should export button sizes", () => {
    expect(buttonSizes).toBeDefined();
    expect(buttonSizes.md).toContain("px-6");
  });

  it("should generate button classes correctly", () => {
    const classes = getButtonClasses("primary", "md");
    expect(classes).toContain("bg-gradient-to-r");
    expect(classes).toContain("px-6");
  });

  it("should handle custom classes", () => {
    const classes = getButtonClasses("primary", "md", "custom-class");
    expect(classes).toContain("custom-class");
  });

  it("should default to primary variant and md size", () => {
    const classes = getButtonClasses();
    expect(classes).toContain("bg-gradient-to-r");
    expect(classes).toContain("px-6");
  });
});

describe("Design System - Cards", () => {
  it("should export card variants", () => {
    expect(cardVariants).toBeDefined();
    expect(cardVariants.default).toContain("bg-white");
    expect(cardVariants.success).toContain("green");
    expect(cardVariants.error).toContain("red");
  });

  it("should generate card classes correctly", () => {
    const classes = getCardClasses("default");
    expect(classes).toContain("bg-white");
    expect(classes).toContain("rounded-xl");
  });

  it("should add hover effects when requested", () => {
    const classes = getCardClasses("default", true);
    expect(classes).toContain("hover:shadow-xl");
  });

  it("should handle custom classes", () => {
    const classes = getCardClasses("default", false, "p-6");
    expect(classes).toContain("p-6");
  });
});

describe("Design System - Animations", () => {
  it("should export animations", () => {
    expect(animations).toBeDefined();
    expect(animations.fadeIn).toBe("animate-fade-in");
    expect(animations.slideUp).toBe("animate-slide-up");
    expect(animations.bounce).toBe("animate-bounce");
    expect(animations.shimmer).toBe("animate-shimmer");
  });

  it("should generate animation classes correctly", () => {
    const fadeIn = getAnimationClass("fadeIn");
    expect(fadeIn).toBe("animate-fade-in");

    const slideUp = getAnimationClass("slideUp");
    expect(slideUp).toBe("animate-slide-up");
  });

  it("should default to fadeIn", () => {
    const classes = getAnimationClass();
    expect(classes).toBe("animate-fade-in");
  });
});

describe("Design System - Typography", () => {
  it("should export typography utilities", () => {
    expect(typography).toBeDefined();
    expect(typography.sizes).toBeDefined();
    expect(typography.weights).toBeDefined();
    expect(typography.colors).toBeDefined();
  });

  it("should have correct font sizes", () => {
    expect(typography.sizes.base).toBe("text-base");
    expect(typography.sizes.xl).toBe("text-xl");
  });

  it("should have correct font weights", () => {
    expect(typography.weights.semibold).toBe("font-semibold");
    expect(typography.weights.bold).toBe("font-bold");
  });
});

describe("Design System - Colors", () => {
  it("should export color utilities", () => {
    expect(colors).toBeDefined();
    expect(colors.primary).toBeDefined();
    expect(colors.success).toBeDefined();
  });

  it("should have Philippine flag colors", () => {
    expect(colors.primary.blue).toContain("blue");
    expect(colors.primary.red).toContain("red");
    expect(colors.primary.yellow).toContain("yellow");
  });
});

describe("Design System - Loading States", () => {
  it("should export loading states", () => {
    expect(loadingStates).toBeDefined();
    expect(loadingStates.spinner).toContain("animate-spin");
  });

  it("should generate loading spinner classes", () => {
    const spinner = getLoadingSpinner("md", "blue");
    expect(spinner).toContain("animate-spin");
    expect(spinner).toContain("w-8");
    expect(spinner).toContain("text-blue-500");
  });

  it("should handle different sizes", () => {
    const small = getLoadingSpinner("sm", "blue");
    expect(small).toContain("w-4");

    const large = getLoadingSpinner("lg", "blue");
    expect(large).toContain("w-12");
  });
});

describe("Design System - Badges", () => {
  it("should export badge variants", () => {
    expect(badgeVariants).toBeDefined();
    expect(badgeVariants.success).toContain("green");
    expect(badgeVariants.danger).toContain("red");
  });

  it("should generate badge classes correctly", () => {
    const badge = getBadgeClasses("success");
    expect(badge).toContain("green");
    expect(badge).toContain("rounded-full");
  });

  it("should handle custom classes", () => {
    const badge = getBadgeClasses("default", "ml-2");
    expect(badge).toContain("ml-2");
  });
});

describe("Design System - Form Inputs", () => {
  it("should export input variants", () => {
    expect(inputVariants).toBeDefined();
    expect(inputVariants.default).toContain("border");
    expect(inputVariants.error).toContain("red");
    expect(inputVariants.success).toContain("green");
  });

  it("should generate input classes correctly", () => {
    const input = getInputClasses("default");
    expect(input).toContain("w-full");
    expect(input).toContain("rounded-lg");
  });

  it("should handle error state", () => {
    const input = getInputClasses("error");
    expect(input).toContain("red");
  });
});

describe("Design System - Utility Functions", () => {
  it("should combine classes correctly", () => {
    const classes = cn("class1", "class2", false && "class3", "class4");
    expect(classes).toBe("class1 class2 class4");
  });

  it("should filter out falsy values", () => {
    const classes = cn("class1", null, undefined, false, "", "class2");
    expect(classes).toBe("class1 class2");
  });

  it("should generate responsive text classes", () => {
    const text = getResponsiveText("base");
    expect(text).toContain("text-base");
    expect(text).toContain("sm:text-lg");
  });

  it("should generate responsive spacing classes", () => {
    const spacing = getResponsiveSpacing("md");
    expect(spacing).toContain("p-4");
    expect(spacing).toContain("sm:p-5");
    expect(spacing).toContain("md:p-6");
  });
});

describe("Design System - Accessibility", () => {
  it("should export focus ring utilities", () => {
    expect(focusRing).toBeDefined();
    expect(focusRing.default).toContain("focus:ring-2");
  });

  it("should have focus states for all variants", () => {
    expect(focusRing.success).toContain("focus:ring-green-500");
    expect(focusRing.danger).toContain("focus:ring-red-500");
  });
});

describe("Design System - Responsive Utilities", () => {
  it("should export responsive utilities", () => {
    expect(responsive).toBeDefined();
    expect(responsive.containers).toBeDefined();
    expect(responsive.padding).toBeDefined();
  });

  it("should have container max widths", () => {
    expect(responsive.containers.lg).toBe("max-w-screen-lg");
  });
});

describe("Design System - Transitions", () => {
  it("should export transition utilities", () => {
    expect(transitions).toBeDefined();
    expect(transitions.fast).toContain("duration-150");
    expect(transitions.normal).toContain("duration-200");
    expect(transitions.slow).toContain("duration-300");
  });
});

describe("Design System - Shadows", () => {
  it("should export shadow utilities", () => {
    expect(shadows).toBeDefined();
    expect(shadows.md).toBe("shadow-md");
    expect(shadows.lg).toBe("shadow-lg");
  });
});

describe("Design System - Border Radius", () => {
  it("should export border radius utilities", () => {
    expect(borderRadius).toBeDefined();
    expect(borderRadius.lg).toBe("rounded-lg");
    expect(borderRadius.xl).toBe("rounded-xl");
  });
});
