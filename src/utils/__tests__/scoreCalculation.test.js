// Basic tests for score calculation
// Run with: npm test

import { describe, it, expect } from "vitest";
import {
  calculateFinalScore,
  calculateTimeBonus,
  calculateHintPenalty,
  createGameState,
  calculateScoreBreakdown,
} from "../scoreCalculation.js";

describe("Score Calculation", () => {
  describe("calculateTimeBonus", () => {
    it("should return 2.0 for very fast completion", () => {
      const bonus = calculateTimeBonus(90, 180); // Half the time
      expect(bonus).toBe(2.0);
    });

    it("should return 1.0 for completion at estimated time", () => {
      const bonus = calculateTimeBonus(180, 180);
      expect(bonus).toBe(1.0);
    });

    it("should return 0.5 for slow completion", () => {
      const bonus = calculateTimeBonus(360, 180); // Double the time
      expect(bonus).toBe(0.5);
    });

    it("should handle zero times gracefully", () => {
      const bonus = calculateTimeBonus(0, 180);
      expect(bonus).toBe(1.0);
    });
  });

  describe("calculateHintPenalty", () => {
    it("should calculate correct penalty for hints used", () => {
      const penalty = calculateHintPenalty(3, 10);
      expect(penalty).toBe(30);
    });

    it("should return 0 for no hints", () => {
      const penalty = calculateHintPenalty(0, 10);
      expect(penalty).toBe(0);
    });
  });

  describe("calculateFinalScore", () => {
    it("should calculate score with all factors", () => {
      const gameState = createGameState({
        score: 100,
        hintsUsed: 2,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:03:00"), // 180 seconds
      });

      const levelConfig = {
        type: "quiz",
      };

      const finalScore = calculateFinalScore(gameState, levelConfig);

      // Quiz: 70% accuracy + 20% speed - hints
      // Base: 100 * 0.7 = 70
      // Time bonus: 100 * 0.2 * 1.0 = 20 (completed in estimated time)
      // Hint penalty: 2 * 10 = 20
      // Final: 70 + 20 - 20 = 70
      expect(finalScore).toBe(70);
    });

    it("should not return negative scores", () => {
      const gameState = createGameState({
        score: 20,
        hintsUsed: 10, // Lots of hints
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:10:00"), // Slow completion
      });

      const finalScore = calculateFinalScore(gameState, { type: "quiz" });
      expect(finalScore).toBeGreaterThanOrEqual(0);
    });

    it("should reward fast completion", () => {
      const slowGameState = createGameState({
        score: 100,
        hintsUsed: 0,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:06:00"), // 360 seconds (slow)
      });

      const fastGameState = createGameState({
        score: 100,
        hintsUsed: 0,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:01:30"), // 90 seconds (fast)
      });

      const slowScore = calculateFinalScore(slowGameState, { type: "quiz" });
      const fastScore = calculateFinalScore(fastGameState, { type: "quiz" });

      expect(fastScore).toBeGreaterThan(slowScore);
    });

    it("should penalize hint usage", () => {
      const noHintsState = createGameState({
        score: 100,
        hintsUsed: 0,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:03:00"),
      });

      const withHintsState = createGameState({
        score: 100,
        hintsUsed: 5,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:03:00"),
      });

      const noHintsScore = calculateFinalScore(noHintsState, { type: "quiz" });
      const withHintsScore = calculateFinalScore(withHintsState, {
        type: "quiz",
      });

      expect(noHintsScore).toBeGreaterThan(withHintsScore);
    });
  });

  describe("calculateScoreBreakdown", () => {
    it("should provide detailed score breakdown", () => {
      const gameState = createGameState({
        score: 100,
        hintsUsed: 2,
        startTime: new Date("2024-01-01T10:00:00"),
        endTime: new Date("2024-01-01T10:03:00"),
      });

      const breakdown = calculateScoreBreakdown(gameState, { type: "quiz" });

      expect(breakdown).toHaveProperty("baseScore");
      expect(breakdown).toHaveProperty("timeBonus");
      expect(breakdown).toHaveProperty("hintPenalty");
      expect(breakdown).toHaveProperty("finalScore");
      expect(breakdown).toHaveProperty("timeTaken");
      expect(breakdown).toHaveProperty("timeMultiplier");

      expect(breakdown.baseScore).toBe(70);
      expect(breakdown.timeBonus).toBe(20);
      expect(breakdown.hintPenalty).toBe(20);
      expect(breakdown.finalScore).toBe(70);
    });
  });

  describe("createGameState", () => {
    it("should create valid game state with defaults", () => {
      const state = createGameState({});

      expect(state).toHaveProperty("score");
      expect(state).toHaveProperty("attempts");
      expect(state).toHaveProperty("hintsUsed");
      expect(state).toHaveProperty("startTime");
      expect(state).toHaveProperty("endTime");
      expect(state).toHaveProperty("accuracy");

      expect(state.score).toBe(0);
      expect(state.attempts).toBe(1);
      expect(state.hintsUsed).toBe(0);
      expect(state.accuracy).toBe(100);
    });

    it("should override defaults with provided values", () => {
      const state = createGameState({
        score: 85,
        attempts: 3,
        hintsUsed: 2,
      });

      expect(state.score).toBe(85);
      expect(state.attempts).toBe(3);
      expect(state.hintsUsed).toBe(2);
    });
  });
});
