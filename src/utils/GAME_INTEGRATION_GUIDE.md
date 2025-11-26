# Game Integration Guide for Final Score Calculation

This guide explains how to integrate the final score calculation system into game components.

## Overview

The final score calculation system automatically:

1. Calculates a final score based on performance metrics (accuracy, time, hints)
2. Saves the score to the SQLite database
3. Updates user statistics
4. Handles level unlocking

## Automatic Integration

**Good news!** The system is already integrated at the App.jsx level through the `useProgressAPI` hook. When you call `onComplete(score, timeSpent)` from your game, the system automatically:

1. Calculates the final score based on the level type
2. Saves it to the database
3. Updates statistics
4. Unlocks the next level

## Current Game Integration Pattern

Most games already follow this pattern:

```javascript
export default function MyGame({ username, onLogout, onComplete }) {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const handleGameComplete = () => {
    const timeSpent = Date.now() - startTime;

    // This automatically triggers final score calculation!
    if (onComplete) {
      onComplete(score, timeSpent);
    }
  };

  // ... rest of game logic
}
```

## Enhanced Integration (Optional)

If you want more control over the score calculation, you can use the game state tracker:

```javascript
import { createGameStateTracker } from "../../utils/gameCompletionHandler";

export default function MyGame({ username, onLogout, onComplete }) {
  const [gameState] = useState(() => createGameStateTracker());

  const handleCorrectAnswer = () => {
    gameState.setScore(gameState.getState().score + 10);
  };

  const handleWrongAnswer = () => {
    gameState.incrementAttempts();
  };

  const handleUseHint = () => {
    gameState.useHint();
  };

  const handleGameComplete = () => {
    const state = gameState.complete();
    const timeSpent = gameState.getTimeSpent();

    // Pass the raw score - final score is calculated automatically
    if (onComplete) {
      onComplete(state.score, timeSpent);
    }
  };

  // ... rest of game logic
}
```

## Level Type Configuration

The system automatically determines the level type based on chapter and level ID. The level types are:

- **quiz**: Question-based games (70% accuracy, 20% speed, 10pt hint penalty)
- **puzzle**: Puzzle games (60% accuracy, 30% speed, 15pt hint penalty)
- **drag-drop**: Drag and drop games (65% accuracy, 25% speed, 12pt hint penalty)
- **word-collection**: Word collection games (60% accuracy, 30% speed, 10pt hint penalty)
- **timeline**: Timeline ordering games (70% accuracy, 20% speed, 15pt hint penalty)
- **matching**: Matching games (65% accuracy, 25% speed, 12pt hint penalty)
- **story**: Story-based games (75% accuracy, 15% speed, 8pt hint penalty)

## Score Calculation Formula

The final score is calculated as:

```
finalScore = (rawScore × accuracyWeight) + (rawScore × speedWeight × timeBonus) - (hintsUsed × hintPenalty)
```

Where:

- `rawScore`: The score from your game (0-100)
- `accuracyWeight`: Weight for accuracy (e.g., 0.7 for 70%)
- `speedWeight`: Weight for speed (e.g., 0.2 for 20%)
- `timeBonus`: Multiplier based on completion time (0.5x to 2.0x)
- `hintsUsed`: Number of hints used
- `hintPenalty`: Points deducted per hint (e.g., 10 points)

## Time Bonus Calculation

The time bonus rewards faster completion:

- Complete in **half the estimated time**: 2.0x multiplier (maximum)
- Complete in **estimated time**: 1.0x multiplier
- Complete in **double the estimated time**: 0.5x multiplier (minimum)

## Displaying Final Score in Completion Modals

If you want to show the final score in your completion modal, you can calculate it for display purposes:

```javascript
import { calculateScoreBreakdown } from "../../utils/scoreCalculation";
import { getLevelType } from "../../utils/gameCompletionHandler";

const showCompletionModal = () => {
  const levelType = getLevelType(chapterId, levelId);
  const breakdown = calculateScoreBreakdown(
    {
      score: rawScore,
      hintsUsed: hintsUsed,
      startTime: startTime,
      endTime: new Date(),
    },
    { type: levelType }
  );

  console.log("Score Breakdown:", breakdown);
  // {
  //   baseScore: 70,
  //   timeBonus: 15,
  //   hintPenalty: 10,
  //   finalScore: 75,
  //   timeTaken: 120,
  //   timeMultiplier: 1.5
  // }
};
```

## Testing Your Integration

1. **Play through a level** and complete it
2. **Check the console** for these messages:
   - `📊 Final score calculated: X (raw score: Y)`
   - `💾 Final score saved to database`
   - `📈 User statistics updated`
3. **Verify in database** that the `final_score` column is populated
4. **Check statistics** are updated correctly

## Common Issues

### Issue: Final score not being saved

**Solution**: Make sure you're calling `onComplete(score, timeSpent)` when the game finishes.

### Issue: Score is always the same as raw score

**Solution**: Check that `timeSpent` is being passed correctly. If it's 0, the time bonus won't apply.

### Issue: Negative scores

**Solution**: The system prevents negative scores, but check your hint penalty isn't too high.

## Example: Complete Game Integration

Here's a complete example of a quiz game with full integration:

```javascript
import { useState, useEffect } from "react";
import { createGameStateTracker } from "../../utils/gameCompletionHandler";

export default function QuizGame({ username, onLogout, onComplete }) {
  const [gameState] = useState(() => createGameStateTracker());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const questions = [
    {
      question: "When was Rizal born?",
      answer: "1861",
      hint: "It was in the 1860s",
    },
    // ... more questions
  ];

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      const newScore = gameState.getState().score + 20;
      gameState.setScore(newScore);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete();
      }
    } else {
      gameState.incrementAttempts();
    }
  };

  const handleShowHint = () => {
    gameState.useHint();
    setShowHint(true);
  };

  const handleComplete = () => {
    const state = gameState.complete();
    const timeSpent = gameState.getTimeSpent();

    console.log("Game completed!", {
      score: state.score,
      attempts: state.attempts,
      hintsUsed: state.hintsUsed,
      timeSpent: timeSpent,
    });

    // This triggers automatic final score calculation
    if (onComplete) {
      onComplete(state.score, timeSpent);
    }
  };

  return (
    <div>
      <h2>{questions[currentQuestion].question}</h2>
      <button onClick={() => handleAnswer(true)}>Correct Answer</button>
      <button onClick={() => handleAnswer(false)}>Wrong Answer</button>
      <button onClick={handleShowHint}>Show Hint</button>
      {showHint && <p>{questions[currentQuestion].hint}</p>}
    </div>
  );
}
```

## Summary

The final score calculation system is **already integrated** at the application level. You don't need to change existing games unless you want to:

1. Track hints used
2. Track multiple attempts
3. Display the final score breakdown
4. Customize score weights for specific levels

For most games, simply calling `onComplete(score, timeSpent)` is sufficient!
