/**
 * Achievement System Manual Tests
 * Manual tests for achievement awarding, checking, and triggers
 * Requirements: 12.1
 *
 * Run these tests in the browser console after logging in
 */

import { initDatabase } from "../database.js";
import {
  awardAchievement,
  hasAchievement,
  getUserAchievements,
  getAchievementCounts,
  checkLevelCompletionAchievements,
  checkSessionAchievements,
} from "../achievementSystem.js";

// Test 1: Award Achievement
export const testAwardAchievement = async (userId = 1) => {
  console.log("🧪 Test 1: Award Achievement");

  try {
    await initDatabase();

    // Award a test achievement
    const awarded = await awardAchievement(userId, "heros_awakening");
    console.log("First award attempt:", awarded ? "✅ PASS (new)" : "❌ FAIL");

    // Try to award the same achievement again (should return false)
    const duplicate = await awardAchievement(userId, "heros_awakening");
    console.log(
      "Duplicate prevention:",
      !duplicate ? "✅ PASS (prevented)" : "❌ FAIL"
    );

    // Try invalid achievement
    const invalid = await awardAchievement(userId, "invalid_achievement");
    console.log(
      "Invalid achievement rejected:",
      !invalid ? "✅ PASS" : "❌ FAIL"
    );

    return awarded && !duplicate && !invalid;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 2: Check Achievement
export const testHasAchievement = async (userId = 1) => {
  console.log("\n🧪 Test 2: Check Achievement");

  try {
    await initDatabase();

    // Award an achievement first
    await awardAchievement(userId, "flawless_victory");

    // Check if user has it
    const hasIt = await hasAchievement(userId, "flawless_victory");
    console.log("Has awarded achievement:", hasIt ? "✅ PASS" : "❌ FAIL");

    // Check for achievement user doesn't have
    const doesntHave = await hasAchievement(userId, "legacy_unleashed");
    console.log(
      "Doesn't have unawarded achievement:",
      !doesntHave ? "✅ PASS" : "❌ FAIL"
    );

    return hasIt && !doesntHave;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 3: Get User Achievements
export const testGetUserAchievements = async (userId = 1) => {
  console.log("\n🧪 Test 3: Get User Achievements");

  try {
    await initDatabase();

    // Award multiple achievements
    await awardAchievement(userId, "heros_awakening");
    await awardAchievement(userId, "lightning_strike");
    await awardAchievement(userId, "wisdoms_embrace");

    // Get all achievements
    const achievements = await getUserAchievements(userId);
    console.log("Retrieved achievements:", achievements);
    console.log(
      "Has achievements:",
      achievements.length > 0 ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "Achievement structure valid:",
      achievements[0]?.achievement_name ? "✅ PASS" : "❌ FAIL"
    );

    return achievements.length > 0 && achievements[0]?.achievement_name;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 4: Get Achievement Counts
export const testGetAchievementCounts = async (userId = 1) => {
  console.log("\n🧪 Test 4: Get Achievement Counts");

  try {
    await initDatabase();

    // Award achievements of different types
    await awardAchievement(userId, "heros_awakening"); // milestone
    await awardAchievement(userId, "flawless_victory"); // performance
    await awardAchievement(userId, "dawn_of_destiny"); // chapter

    // Get counts
    const counts = await getAchievementCounts(userId);
    console.log("Achievement counts:", counts);
    console.log("Has total count:", counts.total > 0 ? "✅ PASS" : "❌ FAIL");
    console.log(
      "Has type breakdown:",
      counts.milestone !== undefined ? "✅ PASS" : "❌ FAIL"
    );

    return counts.total > 0 && counts.milestone !== undefined;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 5: Level Completion Triggers - First Level
export const testFirstLevelTrigger = async (userId = 1) => {
  console.log("\n🧪 Test 5: First Level Completion Trigger");

  try {
    await initDatabase();

    // Simulate first level completion
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      1,
      1,
      85
    );

    console.log("New achievements awarded:", newAchievements);
    console.log(
      "Hero's Awakening awarded:",
      newAchievements.includes("heros_awakening") ? "✅ PASS" : "❌ FAIL"
    );

    return newAchievements.includes("heros_awakening");
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 6: Perfect Score Trigger
export const testPerfectScoreTrigger = async (userId = 1) => {
  console.log("\n🧪 Test 6: Perfect Score Trigger");

  try {
    await initDatabase();

    // Simulate perfect score
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      1,
      2,
      100
    );

    console.log("New achievements awarded:", newAchievements);
    console.log(
      "Flawless Victory awarded:",
      newAchievements.includes("flawless_victory") ? "✅ PASS" : "❌ FAIL"
    );

    return newAchievements.includes("flawless_victory");
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 7: Speed Record Trigger
export const testSpeedRecordTrigger = async (userId = 1) => {
  console.log("\n🧪 Test 7: Speed Record Trigger");

  try {
    await initDatabase();

    // Simulate fast completion (30 seconds when estimated is 120)
    const newAchievements = await checkLevelCompletionAchievements(
      userId,
      1,
      3,
      90,
      {
        timeTaken: 30,
        estimatedTime: 120,
      }
    );

    console.log("New achievements awarded:", newAchievements);
    console.log(
      "Lightning Strike awarded:",
      newAchievements.includes("lightning_strike") ? "✅ PASS" : "❌ FAIL"
    );

    return newAchievements.includes("lightning_strike");
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 8: Session Achievements
export const testSessionAchievements = async (userId = 1) => {
  console.log("\n🧪 Test 8: Session Achievements");

  try {
    await initDatabase();

    // Simulate completing 5 levels in one session
    const newAchievements = await checkSessionAchievements(userId, 5);

    console.log("New achievements awarded:", newAchievements);
    console.log(
      "Unstoppable Force awarded:",
      newAchievements.includes("unstoppable_force") ? "✅ PASS" : "❌ FAIL"
    );

    return newAchievements.includes("unstoppable_force");
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Run all tests
export const runAllAchievementTests = async (userId = 1) => {
  console.log("🚀 Running Achievement System Tests\n");
  console.log("=".repeat(50));
  console.log(`Testing with User ID: ${userId}\n`);

  const test1 = await testAwardAchievement(userId);
  const test2 = await testHasAchievement(userId);
  const test3 = await testGetUserAchievements(userId);
  const test4 = await testGetAchievementCounts(userId);
  const test5 = await testFirstLevelTrigger(userId);
  const test6 = await testPerfectScoreTrigger(userId);
  const test7 = await testSpeedRecordTrigger(userId);
  const test8 = await testSessionAchievements(userId);

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results:");
  console.log("Award Achievement:", test1 ? "✅ PASS" : "❌ FAIL");
  console.log("Check Achievement:", test2 ? "✅ PASS" : "❌ FAIL");
  console.log("Get User Achievements:", test3 ? "✅ PASS" : "❌ FAIL");
  console.log("Get Achievement Counts:", test4 ? "✅ PASS" : "❌ FAIL");
  console.log("First Level Trigger:", test5 ? "✅ PASS" : "❌ FAIL");
  console.log("Perfect Score Trigger:", test6 ? "✅ PASS" : "❌ FAIL");
  console.log("Speed Record Trigger:", test7 ? "✅ PASS" : "❌ FAIL");
  console.log("Session Achievements:", test8 ? "✅ PASS" : "❌ FAIL");

  const allPassed =
    test1 && test2 && test3 && test4 && test5 && test6 && test7 && test8;
  console.log(
    "\n" + (allPassed ? "✅ All tests passed!" : "❌ Some tests failed")
  );

  return allPassed;
};

// Export for browser console testing
if (typeof window !== "undefined") {
  window.achievementTests = {
    testAwardAchievement,
    testHasAchievement,
    testGetUserAchievements,
    testGetAchievementCounts,
    testFirstLevelTrigger,
    testPerfectScoreTrigger,
    testSpeedRecordTrigger,
    testSessionAchievements,
    runAllAchievementTests,
  };
  console.log(
    "💡 Achievement tests loaded. Run window.achievementTests.runAllAchievementTests() to test."
  );
}
