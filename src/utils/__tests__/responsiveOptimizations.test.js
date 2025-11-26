/**
 * Responsive Optimizations Tests
 * Tests for responsive design utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getAccurateViewport,
  detectDevice,
  createBreakpointDetector,
  calculateOptimalColumns,
  calculateResponsiveFontSize,
  getOptimalImageSize,
  isElementInViewport,
} from "../responsiveOptimizations";

describe("Responsive Optimizations", () => {
  // Mock window dimensions
  const mockWindowDimensions = (width, height) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });
  };

  beforeEach(() => {
    // Reset window dimensions
    mockWindowDimensions(1024, 768);
  });

  describe("getAccurateViewport", () => {
    it("should return viewport dimensions", () => {
      const viewport = getAccurateViewport();
      expect(viewport).toHaveProperty("width");
      expect(viewport).toHaveProperty("height");
      expect(viewport.width).toBeGreaterThan(0);
      expect(viewport.height).toBeGreaterThan(0);
    });

    it("should handle mobile viewport", () => {
      mockWindowDimensions(375, 667);
      const viewport = getAccurateViewport();
      expect(viewport.width).toBe(375);
      expect(viewport.height).toBe(667);
    });

    it("should handle tablet viewport", () => {
      mockWindowDimensions(768, 1024);
      const viewport = getAccurateViewport();
      expect(viewport.width).toBe(768);
      expect(viewport.height).toBe(1024);
    });

    it("should handle desktop viewport", () => {
      mockWindowDimensions(1920, 1080);
      const viewport = getAccurateViewport();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    });
  });

  describe("detectDevice", () => {
    it("should detect desktop device", () => {
      mockWindowDimensions(1920, 1080);
      const device = detectDevice();
      expect(device.type).toBe("desktop");
      expect(device.isDesktop).toBe(true);
      expect(device.isMobile).toBe(false);
      expect(device.isTablet).toBe(false);
    });

    it("should detect mobile device", () => {
      mockWindowDimensions(375, 667);
      const device = detectDevice();
      expect(device.type).toBe("mobile");
      expect(device.isMobile).toBe(true);
      expect(device.isDesktop).toBe(false);
    });

    it("should detect tablet device", () => {
      mockWindowDimensions(768, 1024);
      const device = detectDevice();
      expect(device.type).toBe("tablet");
      expect(device.isTablet).toBe(true);
      expect(device.isMobile).toBe(false);
      expect(device.isDesktop).toBe(false);
    });

    it("should detect touch capability", () => {
      const device = detectDevice();
      expect(device).toHaveProperty("isTouch");
      expect(typeof device.isTouch).toBe("boolean");
    });
  });

  describe("createBreakpointDetector", () => {
    it("should detect current breakpoint", () => {
      mockWindowDimensions(1024, 768);
      const detector = createBreakpointDetector();
      const current = detector.current();
      expect(current).toBe("lg");
    });

    it("should check if viewport matches breakpoint", () => {
      mockWindowDimensions(1024, 768);
      const detector = createBreakpointDetector();
      expect(detector.is("lg")).toBe(true);
      expect(detector.is("xl")).toBe(false);
    });

    it("should check if viewport is between breakpoints", () => {
      mockWindowDimensions(800, 600);
      const detector = createBreakpointDetector();
      expect(detector.between("md", "lg")).toBe(true);
      expect(detector.between("lg", "xl")).toBe(false);
    });

    it("should support custom breakpoints", () => {
      const detector = createBreakpointDetector({ custom: 900 });
      mockWindowDimensions(950, 600);
      expect(detector.is("custom")).toBe(true);
    });

    it("should handle mobile breakpoint", () => {
      mockWindowDimensions(375, 667);
      const detector = createBreakpointDetector();
      expect(detector.current()).toBe("xs");
      expect(detector.is("sm")).toBe(false);
    });

    it("should handle tablet breakpoint", () => {
      mockWindowDimensions(768, 1024);
      const detector = createBreakpointDetector();
      expect(detector.current()).toBe("md");
      expect(detector.is("md")).toBe(true);
    });
  });

  describe("calculateOptimalColumns", () => {
    it("should calculate optimal columns for desktop", () => {
      const columns = calculateOptimalColumns(300, 1200, 16, 1, 4);
      expect(columns).toBe(4);
    });

    it("should calculate optimal columns for tablet", () => {
      const columns = calculateOptimalColumns(300, 768, 16, 1, 4);
      expect(columns).toBe(2);
    });

    it("should calculate optimal columns for mobile", () => {
      const columns = calculateOptimalColumns(300, 375, 16, 1, 4);
      expect(columns).toBe(1);
    });

    it("should respect minimum columns", () => {
      const columns = calculateOptimalColumns(500, 400, 16, 2, 4);
      expect(columns).toBeGreaterThanOrEqual(2);
    });

    it("should respect maximum columns", () => {
      const columns = calculateOptimalColumns(100, 2000, 16, 1, 4);
      expect(columns).toBeLessThanOrEqual(4);
    });

    it("should handle zero gap", () => {
      const columns = calculateOptimalColumns(300, 1200, 0, 1, 6);
      expect(columns).toBe(4);
    });
  });

  describe("calculateResponsiveFontSize", () => {
    it("should calculate font size for mobile", () => {
      const fontSize = calculateResponsiveFontSize(16, { width: 375 });
      expect(fontSize).toBeGreaterThan(0);
      expect(fontSize).toBeLessThan(20);
    });

    it("should calculate font size for desktop", () => {
      const fontSize = calculateResponsiveFontSize(16, { width: 1920 });
      expect(fontSize).toBeGreaterThan(16);
      expect(fontSize).toBeLessThanOrEqual(18);
    });

    it("should use minimum size for very small viewports", () => {
      const fontSize = calculateResponsiveFontSize(16, { width: 320 });
      expect(fontSize).toBe(16 * 0.875);
    });

    it("should use maximum size for very large viewports", () => {
      const fontSize = calculateResponsiveFontSize(16, { width: 2000 });
      expect(fontSize).toBe(16 * 1.125);
    });

    it("should scale proportionally between min and max", () => {
      const fontSize1 = calculateResponsiveFontSize(16, { width: 640 });
      const fontSize2 = calculateResponsiveFontSize(16, { width: 1280 });
      expect(fontSize2).toBeGreaterThan(fontSize1);
    });
  });

  describe("getOptimalImageSize", () => {
    it("should calculate optimal image size for mobile", () => {
      const size = getOptimalImageSize(800, 600, { width: 375 }, 2);
      expect(size.width).toBeLessThanOrEqual(800);
      expect(size.height).toBeLessThanOrEqual(600);
      expect(size.width / size.height).toBeCloseTo(800 / 600, 1);
    });

    it("should calculate optimal image size for tablet", () => {
      const size = getOptimalImageSize(800, 600, { width: 768 }, 2);
      expect(size.width).toBeLessThanOrEqual(800);
      expect(size.height).toBeLessThanOrEqual(600);
    });

    it("should calculate optimal image size for desktop", () => {
      const size = getOptimalImageSize(800, 600, { width: 1920 }, 1);
      expect(size.width).toBeLessThanOrEqual(800);
      expect(size.height).toBeLessThanOrEqual(600);
    });

    it("should maintain aspect ratio", () => {
      const size = getOptimalImageSize(1600, 900, { width: 800 }, 1);
      const aspectRatio = size.width / size.height;
      expect(aspectRatio).toBeCloseTo(1600 / 900, 1);
    });

    it("should account for device pixel ratio", () => {
      const size1 = getOptimalImageSize(800, 600, { width: 375 }, 1);
      const size2 = getOptimalImageSize(800, 600, { width: 375 }, 2);
      expect(size2.width).toBeGreaterThan(size1.width);
    });
  });

  describe("isElementInViewport", () => {
    it("should detect element in viewport", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 100,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element);
      expect(inView).toBe(true);
    });

    it("should detect element outside viewport (above)", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: -300,
          left: 100,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element);
      expect(inView).toBe(false);
    });

    it("should detect element outside viewport (below)", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: 1000,
          left: 100,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element);
      expect(inView).toBe(false);
    });

    it("should detect element outside viewport (left)", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: 100,
          left: -300,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element);
      expect(inView).toBe(false);
    });

    it("should detect element outside viewport (right)", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 1200,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element);
      expect(inView).toBe(false);
    });

    it("should handle threshold parameter", () => {
      const element = {
        getBoundingClientRect: () => ({
          top: 50,
          left: 100,
          width: 200,
          height: 200,
        }),
      };

      mockWindowDimensions(1024, 768);
      const inView = isElementInViewport(element, 100);
      expect(inView).toBe(false);
    });

    it("should return false for null element", () => {
      const inView = isElementInViewport(null);
      expect(inView).toBe(false);
    });
  });
});
