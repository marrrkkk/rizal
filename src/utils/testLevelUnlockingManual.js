/**
 * Manual verification script for level unlocking functionality
 * This can be run in the browser console to test the implementation
 *
 * Usage:
 * 1. Open the app in browser
 * 2. Open developer console
 * 3. Copy and paste this script
 * 4. Run: await testLevelUnlocking()
 */

import {
  unlockNextLevel,
  checkLevelUnlocked,
  checkChapterUnlocked,
  validateLevelAccess,
  initializeFirstLevel,
  markLevelCompleted,
  getChapterUnlockStatus,
} from "./levelUnlocking.js";

export async function testLevelUnlocking() {
  console.log("🧪 Starting Level Unlocking Tests...\n");

  const testUserId = 99999; // Test user ID
  let passedTests = 0;
  let failedTests = 0;

  // Helper function to log test results
  const logTest = (testName, passed, details = "") => {
    if (passed) {
      console.log(`✅ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details: ${details}`);
      failedTests++;
    }
  };

  try {
    // Test 1: Initialize first level
    console.log("\n📝 Test 1: Initialize first level");
    const initResult = await initializeFirstLevel(testUserId);
    logTest("Initialize first level", initResult === true);

    const isLevel1Unlocked = await checkLevelUnlocked(testUserId, 1, 1);
    logTest("First level is unlocked", isLevel1Unlocked === true);

    // Test 2: Validate first level access
    console.log("\n📝 Test 2: Validate first level access");
    const validation1 = await validateLevelAccess(testUserId, 1, 1);
    logTest(
      "First level is accessible",
      validation1.valid && validation1.canAccess
    );

    // Test 3: Prevent access to locked levels
    console.log("\n📝 Test 3: Prevent access to locked levels");
    const validation2 = await validateLevelAccess(testUserId, 1, 2);
    logTest("Level 2 is locked", !validation2.canAccess);

    // Test 4: Sequential level unlocking
    console.log("\n📝 Test 4: Sequential level unlocking");
    await markLevelCompleted(testUserId, 1, 1, 100, 100);
    const unlockResult = await unlockNextLevel(testUserId, 1, 1);
    logTest("Unlock next level succeeds", unlockResult.success === true);
    logTest(
      "Next level is level 2",
      unlockResult.nextLevelUnlocked?.level === 2
    );

    const isLevel2Unlocked = await checkLevelUnlocked(testUserId, 1, 2);
    logTest("Level 2 is now unlocked", isLevel2Unlocked === true);

    // Test 5: Complete multiple levels in sequence
    console.log("\n📝 Test 5: Complete multiple levels in sequence");
    for (let level = 2; level <= 4; level++) {
      await markLevelCompleted(testUserId, 1, level, 100, 100);
      const result = await unlockNextLevel(testUserId, 1, level);
      logTest(
        `Unlock level ${level + 1}`,
        result.success && result.nextLevelUnlocked?.level === level + 1
      );
    }

    // Test 6: Chapter unlocking
    console.log("\n📝 Test 6: Chapter unlocking on completion");
    await markLevelCompleted(testUserId, 1, 5, 100, 100);
    const chapterUnlockResult = await unlockNextLevel(testUserId, 1, 5);
    logTest(
      "Chapter completed flag is set",
      chapterUnlockResult.chapterCompleted === true
    );
    logTest(
      "Next chapter unlocked",
      chapterUnlockResult.nextChapterUnlocked?.chapter === 2
    );

    const isChapter2Unlocked = await checkChapterUnlocked(testUserId, 2);
    logTest("Chapter 2 is unlocked", isChapter2Unlocked === true);

    // Test 7: Get chapter unlock status
    console.log("\n📝 Test 7: Get chapter unlock status");
    const chapterStatus = await getChapterUnlockStatus(testUserId, 1);
    logTest("Chapter status retrieved", chapterStatus.chapterId === 1);
    logTest(
      "All levels completed",
      chapterStatus.levels[5]?.completed === true
    );

    // Test 8: Prevent unlocking without completion
    console.log("\n📝 Test 8: Prevent unlocking without completion");
    const failResult = await unlockNextLevel(testUserId, 2, 1);
    logTest(
      "Cannot unlock without completion",
      failResult.success === false && failResult.error?.includes("completed")
    );

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Summary:");
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(
      `   📈 Success Rate: ${(
        (passedTests / (passedTests + failedTests)) *
        100
      ).toFixed(1)}%`
    );
    console.log("=".repeat(50));

    return {
      passed: passedTests,
      failed: failedTests,
      success: failedTests === 0,
    };
  } catch (error) {
    console.error("\n❌ Test execution failed:", error);
    return {
      passed: passedTests,
      failed: failedTests + 1,
      success: false,
      error: error.message,
    };
  }
}

// Export for use in other modules
export default testLevelUnlocking;
