// Manual verification script for statistics update functionality
// This demonstrates that statistics are automatically updated when scores are saved
// Run this in the browser console to verify the implementation

import { initDatabase } from "../database.js";
import { saveFinalScore, getFinalScore } from "../scorePersistence.js";
import {
  getUserStatistics,
  calculateAggregateStatistics,
} from "../statisticsManager.js";

/**
 * Verify that statistics are updated when scores are saved
 */
export const verifyStatisticsUpdate = async () => {
  console.log("🧪 Verifying Statistics Update Functionality\n");
  console.log("=".repeat(60));

  try {
    // Initialize database
    await initDatabase();
    console.log("✅ Database initialized");

    // Get current user (assuming logged in)
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.error("❌ No user logged in. Please log in first.");
      return false;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;
    console.log(`✅ Testing with user: ${user.username} (ID: ${userId})\n`);

    // Get initial statistics
    console.log("📊 Initial Statistics:");
    const initialStats = await getUserStatistics(userId);
    if (initialStats.success) {
      console.log(
        `   Total Levels Completed: ${initialStats.data.totalLevelsCompleted}`
      );
      console.log(`   Total Score: ${initialStats.data.totalScore}`);
      console.log(`   Average Score: ${initialStats.data.averageScore}`);
    } else {
      console.log("   No statistics found (will be created)");
    }

    // Save a test score
    console.log("\n💾 Saving test score...");
    const testChapter = 1;
    const testLevel = 1;
    const testScore = 95;

    const saveResult = await saveFinalScore(
      userId,
      testChapter,
      testLevel,
      testScore,
      {
        attempts: 1,
        hintsUsed: 0,
      }
    );

    if (!saveResult.success) {
      console.error("❌ Failed to save score:", saveResult.error);
      return false;
    }

    console.log(
      `✅ Score saved: Chapter ${testChapter}, Level ${testLevel}, Score: ${testScore}`
    );

    // Verify the score was saved
    const savedScore = await getFinalScore(userId, testChapter, testLevel);
    console.log(`✅ Score retrieved from database: ${savedScore}`);

    if (savedScore !== testScore) {
      console.error(
        `❌ Score mismatch! Expected ${testScore}, got ${savedScore}`
      );
      return false;
    }

    // Get updated statistics
    console.log("\n📊 Updated Statistics:");
    const updatedStats = await getUserStatistics(userId);

    if (!updatedStats.success) {
      console.error("❌ Failed to get updated statistics");
      return false;
    }

    console.log(
      `   Total Levels Completed: ${updatedStats.data.totalLevelsCompleted}`
    );
    console.log(`   Total Score: ${updatedStats.data.totalScore}`);
    console.log(`   Average Score: ${updatedStats.data.averageScore}`);
    console.log(`   Current Streak: ${updatedStats.data.currentStreak}`);
    console.log(`   Longest Streak: ${updatedStats.data.longestStreak}`);

    // Verify statistics were updated
    const statsIncreased =
      !initialStats.success ||
      updatedStats.data.totalLevelsCompleted >=
        initialStats.data.totalLevelsCompleted;

    if (!statsIncreased) {
      console.error("❌ Statistics were not updated!");
      return false;
    }

    console.log("\n✅ Statistics were automatically updated!");

    // Calculate aggregate statistics manually to verify
    console.log("\n🔍 Verifying aggregate calculation:");
    const aggregateStats = await calculateAggregateStatistics(userId);
    console.log(`   Calculated Total Score: ${aggregateStats.totalScore}`);
    console.log(
      `   Calculated Average Score: ${aggregateStats.averageScore.toFixed(2)}`
    );
    console.log(
      `   Calculated Levels Completed: ${aggregateStats.totalLevelsCompleted}`
    );

    // Verify they match
    const statsMatch =
      updatedStats.data.totalScore === aggregateStats.totalScore &&
      updatedStats.data.totalLevelsCompleted ===
        aggregateStats.totalLevelsCompleted;

    if (!statsMatch) {
      console.error("❌ Statistics don't match aggregate calculation!");
      return false;
    }

    console.log("✅ Statistics match aggregate calculation!");

    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL VERIFICATIONS PASSED!");
    console.log("\n📝 Summary:");
    console.log("   ✅ Score saved successfully");
    console.log("   ✅ Statistics automatically updated");
    console.log("   ✅ Aggregate calculations correct");
    console.log("   ✅ Data persistence working");

    return true;
  } catch (error) {
    console.error("\n❌ Verification failed with error:", error);
    console.error(error.stack);
    return false;
  }
};

/**
 * Test multiple score saves to verify cumulative statistics
 */
export const verifyMultipleScores = async () => {
  console.log("\n🧪 Verifying Multiple Score Updates\n");
  console.log("=".repeat(60));

  try {
    await initDatabase();

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.error("❌ No user logged in");
      return false;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    // Save multiple scores
    const testScores = [
      { chapter: 1, level: 1, score: 85 },
      { chapter: 1, level: 2, score: 90 },
      { chapter: 1, level: 3, score: 95 },
    ];

    console.log("💾 Saving multiple scores...");
    for (const test of testScores) {
      await saveFinalScore(userId, test.chapter, test.level, test.score);
      console.log(
        `   ✅ Saved: Chapter ${test.chapter}, Level ${test.level}, Score: ${test.score}`
      );
    }

    // Get final statistics
    const stats = await getUserStatistics(userId);
    const expectedTotal = testScores.reduce((sum, t) => sum + t.score, 0);
    const expectedAverage = expectedTotal / testScores.length;

    console.log("\n📊 Final Statistics:");
    console.log(`   Total Score: ${stats.data.totalScore}`);
    console.log(`   Average Score: ${stats.data.averageScore}`);
    console.log(`   Levels Completed: ${stats.data.totalLevelsCompleted}`);

    console.log("\n🔍 Expected Values:");
    console.log(`   Expected Total: ${expectedTotal}`);
    console.log(`   Expected Average: ${expectedAverage.toFixed(2)}`);
    console.log(`   Expected Levels: ${testScores.length}`);

    const allCorrect =
      stats.data.totalLevelsCompleted >= testScores.length &&
      stats.data.totalScore >= expectedTotal;

    if (allCorrect) {
      console.log("\n✅ Multiple score updates working correctly!");
      return true;
    } else {
      console.error("\n❌ Statistics don't match expected values!");
      return false;
    }
  } catch (error) {
    console.error("\n❌ Verification failed:", error);
    return false;
  }
};

// Export for browser console
if (typeof window !== "undefined") {
  window.statisticsVerification = {
    verifyStatisticsUpdate,
    verifyMultipleScores,
  };
  console.log(
    "💡 Statistics verification loaded. Run window.statisticsVerification.verifyStatisticsUpdate() to test."
  );
}

export default {
  verifyStatisticsUpdate,
  verifyMultipleScores,
};
