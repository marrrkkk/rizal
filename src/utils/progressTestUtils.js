// Test utilities for progress tracking system
import {
  completeLevel,
  getProgress,
  getAllBadges,
  getAchievementStats,
  resetProgress,
  unlockAllLevels,
} from "./progressManager";

// Test completing levels and earning badges
export const testProgressSystem = () => {
  console.log("🧪 Testing Progress Tracking System...");

  // Reset progress for clean test
  resetProgress();
  console.log("✅ Progress reset");

  // Test completing first level (should earn first_level_complete badge)
  console.log("\n📝 Testing first level completion...");
  const result1 = completeLevel(1, 1, 85);
  console.log("Result:", result1);
  console.log("Badges after first level:", getAllBadges());

  // Test perfect score (should earn perfect_score badge)
  console.log("\n⭐ Testing perfect score...");
  const result2 = completeLevel(1, 2, 100);
  console.log("Result:", result2);
  console.log("Badges after perfect score:", getAllBadges());

  // Complete more levels to test knowledge_seeker badge
  console.log("\n📚 Testing knowledge seeker badge (10 levels)...");
  for (let i = 3; i <= 5; i++) {
    completeLevel(1, i, 90);
  }
  for (let i = 1; i <= 5; i++) {
    completeLevel(2, i, 85);
  }

  const badges = getAllBadges();
  console.log("All badges earned:", badges);

  // Test chapter completion
  console.log("\n🏆 Testing chapter completion...");
  const progress = getProgress();
  console.log("Chapter 1 progress:", progress.chapters[1]);
  console.log("Chapter 2 progress:", progress.chapters[2]);

  // Test achievement stats
  console.log("\n📊 Achievement stats:");
  const stats = getAchievementStats();
  console.log(stats);

  console.log("\n✅ Progress tracking system test completed!");
  return { badges, stats, progress };
};

// Test speed runner badge (5 levels in one session)
export const testSpeedRunner = () => {
  console.log("🏃‍♂️ Testing Speed Runner badge...");

  resetProgress();

  // Complete 5 levels quickly
  for (let i = 1; i <= 5; i++) {
    const result = completeLevel(1, i, 80);
    console.log(`Level ${i} completed:`, result);
  }

  const badges = getAllBadges();
  console.log("Badges earned:", badges);

  return badges.includes("speed_runner");
};

// Test all chapter completion (Rizal Expert badge)
export const testRizalExpert = () => {
  console.log("🎓 Testing Rizal Expert badge...");

  resetProgress();

  // Complete all chapters
  for (let chapter = 1; chapter <= 5; chapter++) {
    for (let level = 1; level <= 5; level++) {
      completeLevel(chapter, level, 90);
    }
  }

  const badges = getAllBadges();
  console.log("All badges earned:", badges);

  return badges.includes("rizal_expert");
};

// Utility to unlock all levels for testing
export const unlockAllForTesting = () => {
  console.log("🔓 Unlocking all levels for testing...");
  unlockAllLevels();
  console.log("✅ All levels unlocked");
};

// Export for console testing
if (typeof window !== "undefined") {
  window.testProgressSystem = testProgressSystem;
  window.testSpeedRunner = testSpeedRunner;
  window.testRizalExpert = testRizalExpert;
  window.unlockAllForTesting = unlockAllForTesting;
}

export default {
  testProgressSystem,
  testSpeedRunner,
  testRizalExpert,
  unlockAllForTesting,
};
