// Test utility for level unlocking system

import {
  completeLevel,
  isLevelUnlocked,
  isLevelCompleted,
  getChapterProgress,
  resetProgress,
} from "./progressManager";

// Test the level unlocking system
export const testLevelUnlocking = () => {
  console.log("🧪 Testing Level Unlocking System...");

  // Reset progress to start fresh
  resetProgress();
  console.log("✅ Progress reset");

  // Check initial state - only Level 1 should be unlocked
  console.log("📊 Initial State:");
  for (let level = 1; level <= 5; level++) {
    const unlocked = isLevelUnlocked(1, level);
    const completed = isLevelCompleted(1, level);
    console.log(
      `  Level ${level}: ${unlocked ? "🔓 Unlocked" : "🔒 Locked"} ${
        completed ? "✅ Completed" : "⏳ Not Completed"
      }`
    );
  }

  // Complete Level 1
  console.log("\n🎯 Completing Level 1...");
  const result1 = completeLevel(1, 1, 85);
  console.log(`Result: ${result1.success ? "✅ Success" : "❌ Failed"}`);

  // Check state after Level 1 completion
  console.log("📊 After Level 1 Completion:");
  for (let level = 1; level <= 5; level++) {
    const unlocked = isLevelUnlocked(1, level);
    const completed = isLevelCompleted(1, level);
    console.log(
      `  Level ${level}: ${unlocked ? "🔓 Unlocked" : "🔒 Locked"} ${
        completed ? "✅ Completed" : "⏳ Not Completed"
      }`
    );
  }

  // Complete Level 2
  console.log("\n🎯 Completing Level 2...");
  const result2 = completeLevel(1, 2, 92);
  console.log(`Result: ${result2.success ? "✅ Success" : "❌ Failed"}`);

  // Check state after Level 2 completion
  console.log("📊 After Level 2 Completion:");
  for (let level = 1; level <= 5; level++) {
    const unlocked = isLevelUnlocked(1, level);
    const completed = isLevelCompleted(1, level);
    console.log(
      `  Level ${level}: ${unlocked ? "🔓 Unlocked" : "🔒 Locked"} ${
        completed ? "✅ Completed" : "⏳ Not Completed"
      }`
    );
  }

  // Complete all remaining levels
  console.log("\n🎯 Completing remaining levels...");
  completeLevel(1, 3, 88);
  completeLevel(1, 4, 95);
  completeLevel(1, 5, 90);

  // Check final state
  console.log("📊 Final State (All Levels Complete):");
  for (let level = 1; level <= 5; level++) {
    const unlocked = isLevelUnlocked(1, level);
    const completed = isLevelCompleted(1, level);
    console.log(
      `  Level ${level}: ${unlocked ? "🔓 Unlocked" : "🔒 Locked"} ${
        completed ? "✅ Completed" : "⏳ Not Completed"
      }`
    );
  }

  // Check if Chapter 2 Level 1 is unlocked
  const chapter2Level1Unlocked = isLevelUnlocked(2, 1);
  console.log(
    `\n🔗 Chapter 2 Level 1: ${
      chapter2Level1Unlocked ? "🔓 Unlocked" : "🔒 Locked"
    }`
  );

  // Get chapter progress
  const chapterProgress = getChapterProgress(1);
  console.log("\n📈 Chapter 1 Progress:", chapterProgress);

  console.log("\n✅ Level unlocking test completed!");

  return {
    chapter1Complete: chapterProgress?.isComplete,
    chapter2Level1Unlocked: chapter2Level1Unlocked,
    badges: result1.newBadges.concat(result2.newBadges || []),
  };
};

// Quick test function to verify current state
export const checkCurrentProgress = () => {
  console.log("📊 Current Progress State:");

  // Check Chapter 1 levels
  console.log("Chapter 1:");
  for (let level = 1; level <= 5; level++) {
    const unlocked = isLevelUnlocked(1, level);
    const completed = isLevelCompleted(1, level);
    console.log(
      `  Level ${level}: ${unlocked ? "🔓 Unlocked" : "🔒 Locked"} ${
        completed ? "✅ Completed" : "⏳ Not Completed"
      }`
    );
  }

  // Check Chapter 2 Level 1
  const chapter2Level1Unlocked = isLevelUnlocked(2, 1);
  console.log(
    `\nChapter 2 Level 1: ${
      chapter2Level1Unlocked ? "🔓 Unlocked" : "🔒 Locked"
    }`
  );

  const chapterProgress = getChapterProgress(1);
  console.log("\nChapter 1 Progress:", chapterProgress);
};

// Function to unlock all levels for testing
export const unlockAllForTesting = () => {
  console.log("🔓 Unlocking all levels for testing...");

  // Complete all levels with good scores
  for (let chapter = 1; chapter <= 5; chapter++) {
    for (let level = 1; level <= 5; level++) {
      completeLevel(chapter, level, 85 + Math.floor(Math.random() * 15));
    }
  }

  console.log("✅ All levels unlocked and completed!");
};

export default {
  testLevelUnlocking,
  checkCurrentProgress,
  unlockAllForTesting,
};
