/**
 * Accessibility Tests
 * Tests for WCAG AA compliance utilities
 * Validates Requirement 15.4
 */

import { describe, it, expect } from "vitest";
import {
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGAA,
  getFocusRing,
  getTouchTarget,
  getTouchPadding,
  getAccessibleColors,
} from "../accessibility";

describe("Color Contrast - WCAG AA Compliance", () => {
  it("should calculate relative luminance correctly", () => {
    // White
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 2);
    // Black
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 2);
  });

  it("should calculate contrast ratio correctly", () => {
    // White on black should have maximum contrast
    const whiteOnBlack = getContrastRatio(
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 }
    );
    expect(whiteOnBlack).toBeCloseTo(21, 0);

    // Same color should have minimum contrast
    const sameColor = getContrastRatio(
      { r: 128, g: 128, b: 128 },
      { r: 128, g: 128, b: 128 }
    );
    expect(sameColor).toBeCloseTo(1, 0);
  });

  it("should validate WCAG AA compliance for normal text", () => {
    // 4.5:1 is the minimum for normal text
    expect(meetsWCAGAA(4.5, false)).toBe(true);
    expect(meetsWCAGAA(4.4, false)).toBe(false);
    expect(meetsWCAGAA(7, false)).toBe(true);
  });

  it("should validate WCAG AA compliance for large text", () => {
    // 3:1 is the minimum for large text
    expect(meetsWCAGAA(3, true)).toBe(true);
    expect(meetsWCAGAA(2.9, true)).toBe(false);
    expect(meetsWCAGAA(4.5, true)).toBe(true);
  });

  it("should provide accessible color combinations", () => {
    const colors = getAccessibleColors("darkOnLight", "gray-900-on-white");
    expect(colors).toHaveProperty("text");
    expect(colors).toHaveProperty("bg");
    expect(colors).toHaveProperty("ratio");
    expect(colors.ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe("Focus States", () => {
  it("should return default focus ring classes", () => {
    const focusRing = getFocusRing();
    expect(focusRing).toContain("focus:outline-none");
    expect(focusRing).toContain("focus:ring-2");
    expect(focusRing).toContain("focus:ring-blue-500");
  });

  it("should return variant-specific focus ring classes", () => {
    const primaryFocus = getFocusRing("primary");
    expect(primaryFocus).toContain("focus:ring-blue-600");

    const successFocus = getFocusRing("success");
    expect(successFocus).toContain("focus:ring-green-500");

    const dangerFocus = getFocusRing("danger");
    expect(dangerFocus).toContain("focus:ring-red-500");
  });
});

describe("Touch Target Sizes - WCAG AA Compliance", () => {
  it("should return minimum touch target size (44x44px)", () => {
    const touchTarget = getTouchTarget("minimum");
    expect(touchTarget).toContain("min-w-[44px]");
    expect(touchTarget).toContain("min-h-[44px]");
  });

  it("should return recommended touch target size (48x48px)", () => {
    const touchTarget = getTouchTarget("recommended");
    expect(touchTarget).toContain("min-w-[48px]");
    expect(touchTarget).toContain("min-h-[48px]");
  });

  it("should return large touch target size (56x56px)", () => {
    const touchTarget = getTouchTarget("large");
    expect(touchTarget).toContain("min-w-[56px]");
    expect(touchTarget).toContain("min-h-[56px]");
  });

  it("should default to recommended size", () => {
    const touchTarget = getTouchTarget();
    expect(touchTarget).toContain("min-w-[48px]");
    expect(touchTarget).toContain("min-h-[48px]");
  });
});

describe("Touch Padding", () => {
  it("should return button padding", () => {
    const padding = getTouchPadding("button");
    expect(padding).toContain("px-6");
    expect(padding).toContain("py-3");
  });

  it("should return icon padding", () => {
    const padding = getTouchPadding("icon");
    expect(padding).toContain("p-3");
  });

  it("should return input padding", () => {
    const padding = getTouchPadding("input");
    expect(padding).toContain("px-4");
    expect(padding).toContain("py-3");
  });

  it("should default to button padding", () => {
    const padding = getTouchPadding();
    expect(padding).toContain("px-6");
    expect(padding).toContain("py-3");
  });
});

describe("Accessible Colors", () => {
  it("should return dark on light color combinations", () => {
    const colors = getAccessibleColors("darkOnLight", "gray-900-on-white");
    expect(colors.text).toBe("text-gray-900");
    expect(colors.bg).toBe("bg-white");
    expect(colors.ratio).toBe(21);
  });

  it("should return light on dark color combinations", () => {
    const colors = getAccessibleColors("lightOnDark", "white-on-gray-900");
    expect(colors.text).toBe("text-white");
    expect(colors.bg).toBe("bg-gray-900");
    expect(colors.ratio).toBe(21);
  });

  it("should default to gray-900-on-white", () => {
    const colors = getAccessibleColors();
    expect(colors.text).toBe("text-gray-900");
    expect(colors.bg).toBe("bg-white");
  });

  it("should handle invalid theme gracefully", () => {
    const colors = getAccessibleColors("invalid", "invalid");
    expect(colors.text).toBe("text-gray-900");
    expect(colors.bg).toBe("bg-white");
  });
});
