/**
 * Tests for level unlocking functionality
 * Validates Requirements 9.2 and 9.3
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  unlockNextLevel,
  checkLevelUnlocked,
  checkChapterUnlocked,
  validateLevelAccess,
  initializeFirstLevel,
  markLevelCompleted,
  getChapterUnlockStatus,
  CHAPTER_CONFIG,
} from "../levelUnlocking";
import { initDatabase, executeUpdate } from "../database";

describe("Level Unlocking System", () => {
  let testUserId;

  beforeEach(async () => {
    // Initialize database before each test
    await initDatabase();

    // Use a unique user ID for each test to avoid conflicts
    testUserId = Math.floor(Math.random() * 1000000);

    // Clean up any existing test data
    executeUpdate("DELETE FROM user_progress WHERE user_id = ?", [testUserId]);
  });

  describe("Chapter Configuration", () => {
    it("should have correct chapter configuration", () => {
      expect(CHAPTER_CONFIG[1]).toBeDefined();
      expect(CHAPTER_CONFIG[1].totalLevels).toBe(5);
      expect(CHAPTER_CONFIG[1].name).toBe("Childhood in Calamba");

      // Verify all chapters are configured
      for (let i = 1; i <= 6; i++) {
        expect(CHAPTER_CONFIG[i]).toBeDefined();
        expect(CHAPTER_CONFIG[i].totalLevels).toBe(5);
      }
    });
  });

  describe("First Level Initialization", () => {
    it("should initialize first level for new user", async () => {
      const result = await initializeFirstLevel(testUserId);
      expect(result).toBe(true);

      // Verify first level is unlocked
      const isUnlocked = await checkLevelUnlocked(testUserId, 1, 1);
      expect(isUnlocked).toBe(true);
    });

    it("should validate first level is always accessible", async () => {
      await initializeFirstLevel(testUserId);

      const validation = await validateLevelAccess(testUserId, 1, 1);
      expect(validation.valid).toBe(true);
      expect(validation.canAccess).toBe(true);
    });
  });

  describe("Sequential Level Unlocking (Requirement 9.2)", () => {
    it("should unlock next level in same chapter after completion", async () => {
      await initializeFirstLevel(testUserId);

      // Mark level 1 as completed
      await markLevelCompleted(testUserId, 1, 1, 100, 100);

      // Unlock next level
      const result = await unlockNextLevel(testUserId, 1, 1);

      expect(result.success).toBe(true);
      expect(result.nextLevelUnlocked).toBeDefined();
      expect(result.nextLevelUnlocked.chapter).toBe(1);
      expect(result.nextLevelUnlocked.level).toBe(2);

      // Verify level 2 is now unlocked
      const isLevel2Unlocked = await checkLevelUnlocked(testUserId, 1, 2);
      expect(isLevel2Unlocked).toBe(true);
    });

    it("should unlock levels sequentially through a chapter", async () => {
      await initializeFirstLevel(testUserId);

      // Complete and unlock levels 1-4
      for (let level = 1; level <= 4; level++) {
        await markLevelCompleted(testUserId, 1, level, 100, 100);
        const result = await unlockNextLevel(testUserId, 1, level);

        expect(result.success).toBe(true);
        expect(result.nextLevelUnlocked.level).toBe(level + 1);

        // Verify next level is unlocked
        const isUnlocked = await checkLevelUnlocked(testUserId, 1, level + 1);
        expect(isUnlocked).toBe(true);
      }
    });

    it("should prevent unlocking if current level is not completed", async () => {
      await initializeFirstLevel(testUserId);

      // Try to unlock next level without completing current level
      const result = await unlockNextLevel(testUserId, 1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toContain("must be completed");
    });
  });

  describe("Chapter Unlocking (Requirement 9.3)", () => {
    it("should unlock next chapter when final level is completed", async () => {
      await initializeFirstLevel(testUserId);

      // Complete all levels in chapter 1
      for (let level = 1; level <= 5; level++) {
        await markLevelCompleted(testUserId, 1, level, 100, 100);
        const result = await unlockNextLevel(testUserId, 1, level);

        if (level === 5) {
          // Last level should unlock next chapter
          expect(result.success).toBe(true);
          expect(result.chapterCompleted).toBe(true);
          expect(result.nextChapterUnlocked).toBeDefined();
          expect(result.nextChapterUnlocked.chapter).toBe(2);
          expect(result.nextChapterUnlocked.level).toBe(1);
        }
      }

      // Verify chapter 2, level 1 is unlocked
      const isChapter2Unlocked = await checkLevelUnlocked(testUserId, 2, 1);
      expect(isChapter2Unlocked).toBe(true);
    });

    it("should check if chapter is unlocked", async () => {
      await initializeFirstLevel(testUserId);

      // Chapter 1 should be unlocked (has level 1 unlocked)
      const isChapter1Unlocked = await checkChapterUnlocked(testUserId, 1);
      expect(isChapter1Unlocked).toBe(true);

      // Chapter 2 should not be unlocked yet
      const isChapter2Unlocked = await checkChapterUnlocked(testUserId, 2);
      expect(isChapter2Unlocked).toBe(false);
    });
  });

  describe("Level Access Validation (Prevent Skipping)", () => {
    it("should prevent access to locked levels", async () => {
      await initializeFirstLevel(testUserId);

      // Try to access level 2 without completing level 1
      const validation = await validateLevelAccess(testUserId, 1, 2);
      expect(validation.canAccess).toBe(false);
      expect(validation.message).toContain("Complete");
      expect(validation.requiredLevel).toBeDefined();
      expect(validation.requiredLevel.chapter).toBe(1);
      expect(validation.requiredLevel.level).toBe(1);
    });

    it("should allow access to unlocked levels", async () => {
      await initializeFirstLevel(testUserId);
      await markLevelCompleted(testUserId, 1, 1, 100, 100);
      await unlockNextLevel(testUserId, 1, 1);

      // Level 2 should now be accessible
      const validation = await validateLevelAccess(testUserId, 1, 2);
      expect(validation.valid).toBe(true);
      expect(validation.canAccess).toBe(true);
    });

    it("should prevent skipping to later chapters", async () => {
      await initializeFirstLevel(testUserId);

      // Try to access chapter 2 without completing chapter 1
      const validation = await validateLevelAccess(testUserId, 2, 1);
      expect(validation.canAccess).toBe(false);
    });
  });

  describe("Chapter Unlock Status", () => {
    it("should get complete chapter unlock status", async () => {
      await initializeFirstLevel(testUserId);
      await markLevelCompleted(testUserId, 1, 1, 85, 90);
      await unlockNextLevel(testUserId, 1, 1);

      const status = await getChapterUnlockStatus(testUserId, 1);

      expect(status.chapterId).toBe(1);
      expect(status.chapterName).toBe("Childhood in Calamba");
      expect(status.totalLevels).toBe(5);
      expect(status.levels[1].unlocked).toBe(true);
      expect(status.levels[1].completed).toBe(true);
      expect(status.levels[1].score).toBe(85);
      expect(status.levels[2].unlocked).toBe(true);
      expect(status.levels[2].completed).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid chapter ID", async () => {
      const result = await unlockNextLevel(testUserId, 999, 1);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid chapter ID");
    });

    it("should handle completing last level of last chapter", async () => {
      // Initialize and complete all chapters up to chapter 6
      await initializeFirstLevel(testUserId);

      // Fast-forward to chapter 6, level 5
      for (let chapter = 1; chapter <= 6; chapter++) {
        for (let level = 1; level <= 5; level++) {
          await markLevelCompleted(testUserId, chapter, level, 100, 100);
          const result = await unlockNextLevel(testUserId, chapter, level);

          if (chapter === 6 && level === 5) {
            // Last level of last chapter
            expect(result.success).toBe(true);
            expect(result.chapterCompleted).toBe(true);
            expect(result.nextChapterUnlocked).toBeNull();
          }
        }
      }
    });

    it("should not unlock next level if not all previous levels are completed", async () => {
      await initializeFirstLevel(testUserId);

      // Complete level 1
      await markLevelCompleted(testUserId, 1, 1, 100, 100);
      await unlockNextLevel(testUserId, 1, 1);

      // Skip level 2, try to complete level 3 (shouldn't be unlocked)
      const isLevel3Unlocked = await checkLevelUnlocked(testUserId, 1, 3);
      expect(isLevel3Unlocked).toBe(false);
    });
  });
});
