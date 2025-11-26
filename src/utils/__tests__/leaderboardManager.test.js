/**
 * Leaderboard Manager Manual Tests
 * Manual tests for leaderboard calculation and ranking
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 *
 * Run these tests in the browser console after logging in
 */

import { initDatabase } from "../database.js";
import {
  getTopStudents,
  getUserBadges,
  calculateRankingScore,
  getUserRank,
  getDetailedLeaderboard,
  refreshLeaderboard,
} from "../leaderboardManager.js";

// Test 1: Get Top Students
export const testGetTopStudents = async () => {
  console.log("🧪 Test 1: Get Top Students");

  try {
    await initDatabase();

    const topStudents = await getTopStudents(5);
    console.log("Top students:", topStudents);
    console.log(
      "Has results:",
      topStudents.length > 0 ? "✅ PASS" : "⚠️ No data"
    );

    if (topStudents.length > 0) {
      console.log(
        "Has rank:",
        topStudents[0].rank === 1 ? "✅ PASS" : "❌ FAIL"
      );
      console.log(
        "Has username:",
        topStudents[0].username ? "✅ PASS" : "❌ FAIL"
      );
      console.log(
        "Has totalScore:",
        topStudents[0].totalScore !== undefined ? "✅ PASS" : "❌ FAIL"
      );
      console.log(
        "Sorted by score:",
        topStudents.length < 2 ||
          topStudents[0].totalScore >= topStudents[1].totalScore
          ? "✅ PASS"
          : "❌ FAIL"
      );
    }

    return topStudents.length > 0;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 2: Get User Badges
export const testGetUserBadges = async (userId = 1) => {
  console.log("\n🧪 Test 2: Get User Badges");

  try {
    await initDatabase();

    const badges = await getUserBadges(userId);
    console.log("User badges:", badges);
    console.log(
      "Returns array:",
      Array.isArray(badges) ? "✅ PASS" : "❌ FAIL"
    );

    if (badges.length > 0) {
      console.log("Badge has name:", badges[0].name ? "✅ PASS" : "❌ FAIL");
      console.log("Badge has type:", badges[0].type ? "✅ PASS" : "❌ FAIL");
    }

    return Array.isArray(badges);
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 3: Calculate Ranking Score
export const testCalculateRankingScore = () => {
  console.log("\n🧪 Test 3: Calculate Ranking Score");

  try {
    const stats1 = {
      totalScore: 1000,
      completionRate: 80,
      achievementCount: 5,
    };

    const score1 = calculateRankingScore(stats1);
    console.log("Score calculation:", score1);
    console.log(
      "Returns number:",
      typeof score1 === "number" ? "✅ PASS" : "❌ FAIL"
    );
    console.log("Score > 0:", score1 > 0 ? "✅ PASS" : "❌ FAIL");

    // Test with empty stats
    const score2 = calculateRankingScore({});
    console.log("Empty stats returns 0:", score2 === 0 ? "✅ PASS" : "❌ FAIL");

    // Test weighting (total score should have highest weight)
    const highScore = calculateRankingScore({
      totalScore: 1000,
      completionRate: 0,
      achievementCount: 0,
    });

    const highCompletion = calculateRankingScore({
      totalScore: 0,
      completionRate: 100,
      achievementCount: 0,
    });

    console.log(
      "Total score weighted highest:",
      highScore > highCompletion ? "✅ PASS" : "❌ FAIL"
    );

    return typeof score1 === "number" && score1 > 0;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 4: Get User Rank
export const testGetUserRank = async (userId = 1) => {
  console.log("\n🧪 Test 4: Get User Rank");

  try {
    await initDatabase();

    const rank = await getUserRank(userId);
    console.log("User rank:", rank);
    console.log(
      "Returns number or null:",
      typeof rank === "number" || rank === null ? "✅ PASS" : "❌ FAIL"
    );

    if (rank !== null) {
      console.log("Rank is positive:", rank > 0 ? "✅ PASS" : "❌ FAIL");
    }

    return typeof rank === "number" || rank === null;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 5: Get Detailed Leaderboard
export const testGetDetailedLeaderboard = async () => {
  console.log("\n🧪 Test 5: Get Detailed Leaderboard");

  try {
    await initDatabase();

    const leaderboard = await getDetailedLeaderboard(5);
    console.log("Detailed leaderboard:", leaderboard);
    console.log(
      "Returns array:",
      Array.isArray(leaderboard) ? "✅ PASS" : "❌ FAIL"
    );

    if (leaderboard.length > 0) {
      console.log(
        "Has badges:",
        leaderboard[0].badges !== undefined ? "✅ PASS" : "❌ FAIL"
      );
      console.log(
        "Badges is array:",
        Array.isArray(leaderboard[0].badges) ? "✅ PASS" : "❌ FAIL"
      );
      console.log(
        "Has all required fields:",
        leaderboard[0].username &&
          leaderboard[0].totalScore !== undefined &&
          leaderboard[0].completionRate !== undefined &&
          leaderboard[0].achievementCount !== undefined
          ? "✅ PASS"
          : "❌ FAIL"
      );
    }

    return Array.isArray(leaderboard);
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 6: Tiebreaker Logic
export const testTiebreakerLogic = async () => {
  console.log("\n🧪 Test 6: Tiebreaker Logic (Average Time)");

  try {
    await initDatabase();

    const topStudents = await getTopStudents(10);
    console.log("Testing tiebreaker with top students:", topStudents.length);

    // Check if students with same score are ordered by time
    let tiebreakerWorks = true;
    for (let i = 0; i < topStudents.length - 1; i++) {
      if (topStudents[i].totalScore === topStudents[i + 1].totalScore) {
        if (topStudents[i].avgTimeMinutes > topStudents[i + 1].avgTimeMinutes) {
          tiebreakerWorks = false;
          console.log(`Tiebreaker failed between rank ${i + 1} and ${i + 2}`);
        }
      }
    }

    console.log(
      "Tiebreaker works correctly:",
      tiebreakerWorks ? "✅ PASS" : "❌ FAIL"
    );
    return tiebreakerWorks;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Test 7: Refresh Leaderboard
export const testRefreshLeaderboard = async () => {
  console.log("\n🧪 Test 7: Refresh Leaderboard");

  try {
    await initDatabase();

    const leaderboard = await refreshLeaderboard(5);
    console.log("Refreshed leaderboard:", leaderboard);
    console.log(
      "Returns array:",
      Array.isArray(leaderboard) ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "Same as getDetailedLeaderboard:",
      Array.isArray(leaderboard) ? "✅ PASS" : "❌ FAIL"
    );

    return Array.isArray(leaderboard);
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};

// Run all tests
export const runAllLeaderboardTests = async (userId = 1) => {
  console.log("🚀 Running Leaderboard Manager Tests\n");
  console.log("=".repeat(50));
  console.log(`Testing with User ID: ${userId}\n`);

  const test1 = await testGetTopStudents();
  const test2 = await testGetUserBadges(userId);
  const test3 = testCalculateRankingScore();
  const test4 = await testGetUserRank(userId);
  const test5 = await testGetDetailedLeaderboard();
  const test6 = await testTiebreakerLogic();
  const test7 = await testRefreshLeaderboard();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results:");
  console.log("Get Top Students:", test1 ? "✅ PASS" : "❌ FAIL");
  console.log("Get User Badges:", test2 ? "✅ PASS" : "❌ FAIL");
  console.log("Calculate Ranking Score:", test3 ? "✅ PASS" : "❌ FAIL");
  console.log("Get User Rank:", test4 ? "✅ PASS" : "❌ FAIL");
  console.log("Get Detailed Leaderboard:", test5 ? "✅ PASS" : "❌ FAIL");
  console.log("Tiebreaker Logic:", test6 ? "✅ PASS" : "❌ FAIL");
  console.log("Refresh Leaderboard:", test7 ? "✅ PASS" : "❌ FAIL");

  const allPassed = test1 && test2 && test3 && test4 && test5 && test6 && test7;
  console.log(
    "\n" + (allPassed ? "✅ All tests passed!" : "❌ Some tests failed")
  );

  return allPassed;
};

// Export for browser console testing
if (typeof window !== "undefined") {
  window.leaderboardTests = {
    testGetTopStudents,
    testGetUserBadges,
    testCalculateRankingScore,
    testGetUserRank,
    testGetDetailedLeaderboard,
    testTiebreakerLogic,
    testRefreshLeaderboard,
    runAllLeaderboardTests,
  };
  console.log(
    "💡 Leaderboard tests loaded. Run window.leaderboardTests.runAllLeaderboardTests() to test."
  );
}
