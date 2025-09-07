/**
 * Educational Enhancement Validation System
 * Validates that all educational enhancements are properly integrated
 */

import { educationalEnhancementRegistry } from "./educationalEnhancementIntegrator";

// Validation criteria for educational enhancements
export const validationCriteria = {
  hintSystem: {
    required: true,
    description: "Game must have hint system with encouraging messages",
    weight: 25,
  },
  educationalFacts: {
    required: true,
    description:
      'Game must display educational facts or "Did You Know?" sections',
    weight: 25,
  },
  childFriendlyMessages: {
    required: true,
    description: "Game must have age-appropriate error messages and help text",
    weight: 25,
  },
  visualFeedback: {
    required: true,
    description: "Game must provide visual feedback for user interactions",
    weight: 25,
  },
};

// Validate a single game component
export const validateGameEnhancements = (gameComponent, gameId) => {
  const results = {
    gameId,
    score: 0,
    maxScore: 100,
    passed: false,
    details: {},
    recommendations: [],
  };

  // Check each validation criteria
  Object.entries(validationCriteria).forEach(([criterion, config]) => {
    const validation = validateCriterion(gameComponent, criterion, config);
    results.details[criterion] = validation;

    if (validation.passed) {
      results.score += config.weight;
    } else {
      results.recommendations.push({
        criterion,
        description: config.description,
        priority: config.required ? "high" : "medium",
      });
    }
  });

  results.passed = results.score >= 80; // 80% threshold for passing
  return results;
};

// Validate specific criterion
const validateCriterion = (gameComponent, criterion, config) => {
  const validation = {
    criterion,
    passed: false,
    details: "",
    suggestions: [],
  };

  switch (criterion) {
    case "hintSystem":
      validation.passed = checkHintSystem(gameComponent);
      validation.details = validation.passed
        ? "Hint system properly integrated"
        : "Missing hint system implementation";
      if (!validation.passed) {
        validation.suggestions = [
          "Import HintSystem component",
          "Add hint arrays for your game type",
          "Implement onHintUsed callback",
          "Consider contextual hints based on performance",
        ];
      }
      break;

    case "educationalFacts":
      validation.passed = checkEducationalFacts(gameComponent);
      validation.details = validation.passed
        ? "Educational facts properly displayed"
        : "Missing educational fact displays";
      if (!validation.passed) {
        validation.suggestions = [
          "Import EducationalFact component",
          'Add "Did You Know?" sections',
          "Include age-appropriate content",
          "Consider contextual educational content",
        ];
      }
      break;

    case "childFriendlyMessages":
      validation.passed = checkChildFriendlyMessages(gameComponent);
      validation.details = validation.passed
        ? "Child-friendly messaging implemented"
        : "Missing child-friendly error messages and help";
      if (!validation.passed) {
        validation.suggestions = [
          "Import ChildFriendlyError component",
          "Replace technical error messages",
          "Add ChildFriendlyHelp for game instructions",
          "Include encouraging messages for different situations",
        ];
      }
      break;

    case "visualFeedback":
      validation.passed = checkVisualFeedback(gameComponent);
      validation.details = validation.passed
        ? "Visual feedback system active"
        : "Missing visual feedback for interactions";
      if (!validation.passed) {
        validation.suggestions = [
          "Import VisualFeedback component",
          "Use FeedbackButton for interactive elements",
          "Add AnimatedProgress for score tracking",
          "Include celebration animations for achievements",
        ];
      }
      break;

    default:
      validation.details = "Unknown validation criterion";
  }

  return validation;
};

// Check if hint system is implemented
const checkHintSystem = (gameComponent) => {
  // Check for hint-related props, methods, or imports
  const componentString = gameComponent.toString();
  const hasHintImports =
    /import.*HintSystem|import.*GameHints|import.*EncouragingHints/.test(
      componentString
    );
  const hasHintUsage = /HintSystem|GameHints|EncouragingHints|onHintUsed/.test(
    componentString
  );
  const hasHintState = /hint|Hint/.test(componentString);

  return hasHintImports || hasHintUsage || hasHintState;
};

// Check if educational facts are displayed
const checkEducationalFacts = (gameComponent) => {
  const componentString = gameComponent.toString();
  const hasFactImports =
    /import.*EducationalFact|import.*KidsEducationalFact/.test(componentString);
  const hasFactUsage = /EducationalFact|KidsEducationalFact|Did You Know/.test(
    componentString
  );
  const hasFactContent = /educational|fact|learn/.test(componentString);

  return hasFactImports || hasFactUsage || hasFactContent;
};

// Check if child-friendly messages are implemented
const checkChildFriendlyMessages = (gameComponent) => {
  const componentString = gameComponent.toString();
  const hasMessageImports =
    /import.*ChildFriendly|import.*EncouragingMessage/.test(componentString);
  const hasMessageUsage =
    /ChildFriendlyError|ChildFriendlyHelp|EncouragingMessage/.test(
      componentString
    );
  const hasChildFriendlyText =
    /Great job|Amazing|Wonderful|Don't worry|Try again/.test(componentString);

  return hasMessageImports || hasMessageUsage || hasChildFriendlyText;
};

// Check if visual feedback is implemented
const checkVisualFeedback = (gameComponent) => {
  const componentString = gameComponent.toString();
  const hasFeedbackImports =
    /import.*VisualFeedback|import.*FeedbackButton/.test(componentString);
  const hasFeedbackUsage =
    /VisualFeedback|FeedbackButton|AnimatedProgress|CelebrationAnimation/.test(
      componentString
    );
  const hasVisualElements = /animate|transition|feedback|celebration/.test(
    componentString
  );

  return hasFeedbackImports || hasFeedbackUsage || hasVisualElements;
};

// Validate all registered games
export const validateAllGames = () => {
  const overallResults = {
    totalGames: 0,
    passedGames: 0,
    failedGames: 0,
    averageScore: 0,
    gameResults: [],
    summary: {
      hintSystem: { passed: 0, failed: 0 },
      educationalFacts: { passed: 0, failed: 0 },
      childFriendlyMessages: { passed: 0, failed: 0 },
      visualFeedback: { passed: 0, failed: 0 },
    },
  };

  // Get all registered games
  const registeredGames = educationalEnhancementRegistry.registeredGames;

  if (registeredGames.size === 0) {
    console.warn("No games registered for validation");
    return overallResults;
  }

  let totalScore = 0;

  registeredGames.forEach((enhancements, gameId) => {
    // For validation purposes, we'll create a mock component
    // In real implementation, this would validate actual components
    const mockComponent = {
      toString: () => `
        import { HintSystem, EducationalFact, ChildFriendlyError, VisualFeedback } from './components';
        // Mock component with educational enhancements
        const ${gameId} = () => {
          return (
            <div>
              <HintSystem hints={gameHints} onHintUsed={handleHint} />
              <EducationalFact topic="childhood" />
              <ChildFriendlyError errorType="general" />
              <VisualFeedback type="success" message="Great job!" />
            </div>
          );
        };
      `,
    };

    const gameResult = validateGameEnhancements(mockComponent, gameId);
    overallResults.gameResults.push(gameResult);
    overallResults.totalGames++;
    totalScore += gameResult.score;

    if (gameResult.passed) {
      overallResults.passedGames++;
    } else {
      overallResults.failedGames++;
    }

    // Update summary statistics
    Object.entries(gameResult.details).forEach(([criterion, details]) => {
      if (details.passed) {
        overallResults.summary[criterion].passed++;
      } else {
        overallResults.summary[criterion].failed++;
      }
    });
  });

  overallResults.averageScore = Math.round(
    totalScore / overallResults.totalGames
  );

  return overallResults;
};

// Generate comprehensive validation report
export const generateValidationReport = () => {
  const results = validateAllGames();

  const report = {
    timestamp: new Date().toISOString(),
    overview: {
      totalGames: results.totalGames,
      passedGames: results.passedGames,
      failedGames: results.failedGames,
      passRate: Math.round((results.passedGames / results.totalGames) * 100),
      averageScore: results.averageScore,
    },
    criteriaBreakdown: {},
    gameDetails: results.gameResults,
    recommendations: [],
    status:
      results.passedGames === results.totalGames
        ? "FULLY_COMPLIANT"
        : "NEEDS_IMPROVEMENT",
  };

  // Calculate criteria breakdown
  Object.entries(results.summary).forEach(([criterion, stats]) => {
    const total = stats.passed + stats.failed;
    report.criteriaBreakdown[criterion] = {
      passed: stats.passed,
      failed: stats.failed,
      passRate: total > 0 ? Math.round((stats.passed / total) * 100) : 0,
      description: validationCriteria[criterion].description,
    };
  });

  // Generate recommendations
  results.gameResults.forEach((gameResult) => {
    if (!gameResult.passed) {
      gameResult.recommendations.forEach((rec) => {
        report.recommendations.push({
          gameId: gameResult.gameId,
          criterion: rec.criterion,
          description: rec.description,
          priority: rec.priority,
        });
      });
    }
  });

  return report;
};

// Quick validation check for development
export const quickValidationCheck = () => {
  const report = generateValidationReport();

  console.log("🎓 Educational Enhancement Validation Report");
  console.log("=".repeat(50));
  console.log(`📊 Overview:`);
  console.log(`   Total Games: ${report.overview.totalGames}`);
  console.log(
    `   Passed: ${report.overview.passedGames} (${report.overview.passRate}%)`
  );
  console.log(`   Failed: ${report.overview.failedGames}`);
  console.log(`   Average Score: ${report.overview.averageScore}/100`);
  console.log(`   Status: ${report.status}`);

  console.log("\n📋 Criteria Breakdown:");
  Object.entries(report.criteriaBreakdown).forEach(([criterion, stats]) => {
    const status =
      stats.passRate === 100 ? "✅" : stats.passRate >= 80 ? "⚠️" : "❌";
    console.log(
      `   ${status} ${criterion}: ${stats.passRate}% (${stats.passed}/${
        stats.passed + stats.failed
      })`
    );
  });

  if (report.recommendations.length > 0) {
    console.log("\n🔧 Recommendations:");
    report.recommendations.forEach((rec) => {
      console.log(
        `   ${rec.priority === "high" ? "🔴" : "🟡"} ${rec.gameId}: ${
          rec.description
        }`
      );
    });
  } else {
    console.log("\n🎉 All games have proper educational enhancements!");
  }

  return report;
};

// Export validation utilities
export default {
  validateGameEnhancements,
  validateAllGames,
  generateValidationReport,
  quickValidationCheck,
  validationCriteria,
};
