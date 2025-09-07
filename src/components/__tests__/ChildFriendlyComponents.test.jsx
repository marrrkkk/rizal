import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  ChildFriendlyError,
  ChildFriendlyHelp,
  EncouragingMessage,
} from "../ChildFriendlyMessages";
import { VisualFeedback, FeedbackButton } from "../VisualFeedback";
import { KidsEducationalFact } from "../EducationalFact";
import { ContextualHints } from "../HintSystem";

describe("Child-Friendly Components", () => {
  describe("ChildFriendlyError", () => {
    it("renders with appropriate child-friendly messaging", () => {
      render(<ChildFriendlyError errorType="network" />);

      expect(
        screen.getByText(/Internet Connection Playing Hide and Seek/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Sometimes the internet needs a little break/)
      ).toBeInTheDocument();
    });

    it("shows help text when help button is clicked", () => {
      render(<ChildFriendlyError errorType="general" />);

      const helpButton = screen.getByText(/Get Help/);
      fireEvent.click(helpButton);

      expect(screen.getByText(/Here's how to fix it:/)).toBeInTheDocument();
    });

    it("calls onRetry when try again button is clicked", () => {
      const mockRetry = vi.fn();
      render(<ChildFriendlyError errorType="general" onRetry={mockRetry} />);

      const retryButton = screen.getByText(/Try Again/);
      fireEvent.click(retryButton);

      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe("ChildFriendlyHelp", () => {
    it("renders help content for quiz games", () => {
      render(<ChildFriendlyHelp gameType="quiz" />);

      expect(screen.getByText(/How to Play Quiz Games!/)).toBeInTheDocument();
      expect(
        screen.getByText(/Read the question and pick the best answer!/)
      ).toBeInTheDocument();
    });

    it("expands detailed help when clicked", () => {
      render(<ChildFriendlyHelp gameType="puzzle" />);

      const expandButton = screen.getByText("🔽");
      fireEvent.click(expandButton);

      expect(screen.getByText(/Step by step:/)).toBeInTheDocument();
      expect(
        screen.getByText(/José was very patient when solving problems/)
      ).toBeInTheDocument();
    });
  });

  describe("EncouragingMessage", () => {
    it("renders appropriate message for different situations", () => {
      render(
        <EncouragingMessage situation="success" playerName="TestPlayer" />
      );

      expect(screen.getByText(/Amazing Work!/)).toBeInTheDocument();
      expect(screen.getByText(/TestPlayer/)).toBeInTheDocument();
    });

    it("shows struggling message with José Rizal reference", () => {
      render(
        <EncouragingMessage situation="struggling" playerName="Student" />
      );

      expect(
        screen.getByText(/It's Okay to Find This Hard!/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/José Rizal had to practice a lot/)
      ).toBeInTheDocument();
    });
  });

  describe("VisualFeedback", () => {
    it("renders success feedback with appropriate styling", () => {
      render(<VisualFeedback type="success" message="Great job!" />);

      expect(screen.getByText(/Great job!/)).toBeInTheDocument();
      expect(screen.getByText("🎉")).toBeInTheDocument();
    });

    it("calls onComplete after duration", async () => {
      const mockComplete = vi.fn();
      render(
        <VisualFeedback
          type="success"
          message="Test"
          duration={100}
          onComplete={mockComplete}
        />
      );

      // Wait for the duration to pass
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(mockComplete).toHaveBeenCalled();
    });
  });

  describe("FeedbackButton", () => {
    it("renders with correct styling and responds to clicks", () => {
      const mockClick = vi.fn();
      render(
        <FeedbackButton onClick={mockClick} variant="primary">
          Click Me
        </FeedbackButton>
      );

      const button = screen.getByText("Click Me");
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(mockClick).toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      const mockClick = vi.fn();
      render(
        <FeedbackButton onClick={mockClick} disabled>
          Disabled Button
        </FeedbackButton>
      );

      const button = screen.getByText("Disabled Button");
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe("KidsEducationalFact", () => {
    it("renders educational facts appropriate for children", () => {
      render(<KidsEducationalFact topic="childhood" />);

      expect(screen.getByText(/Cool Fact!/)).toBeInTheDocument();
      // Should contain child-friendly language
      expect(screen.getByText(/José/)).toBeInTheDocument();
    });

    it("allows getting new facts", () => {
      render(<KidsEducationalFact topic="general" />);

      const newFactButton = screen.getByTitle(/Get another cool fact!/);
      fireEvent.click(newFactButton);

      // Should still show the Cool Fact header
      expect(screen.getByText(/Cool Fact!/)).toBeInTheDocument();
    });
  });

  describe("ContextualHints", () => {
    it("provides different hints based on attempts", () => {
      const mockHintUsed = vi.fn();
      render(
        <ContextualHints
          gameType="quiz"
          attempts={0}
          onHintUsed={mockHintUsed}
        />
      );

      expect(screen.getByText(/Hints/)).toBeInTheDocument();

      const hintButton = screen.getByText(/Get Hint/);
      fireEvent.click(hintButton);

      expect(mockHintUsed).toHaveBeenCalled();
    });

    it("shows encouraging messages for multiple attempts", () => {
      const mockHintUsed = vi.fn();
      render(
        <ContextualHints
          gameType="quiz"
          attempts={2}
          onHintUsed={mockHintUsed}
        />
      );

      // Should show persistence-related encouragement
      expect(screen.getByText(/Hints/)).toBeInTheDocument();
    });
  });
});

describe("Child-Friendly Interactions Integration", () => {
  it("components work together to provide cohesive experience", () => {
    render(
      <div>
        <EncouragingMessage situation="learning" playerName="TestStudent" />
        <KidsEducationalFact topic="family" />
        <ChildFriendlyHelp gameType="memory" />
      </div>
    );

    // All components should render without conflicts
    expect(screen.getByText(/You're Learning So Much!/)).toBeInTheDocument();
    expect(screen.getByText(/Cool Fact!/)).toBeInTheDocument();
    expect(screen.getByText(/How to Play Memory Games!/)).toBeInTheDocument();
  });
});
