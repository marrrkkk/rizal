"use client";

import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import UserStats from "./pages/UserStats";
import Chapter1 from "./pages/Chapter1";
import Chapter2 from "./pages/Chapter2";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
// Chapter 1 Games
import JoseBirthGame from "./pages/games/JoseBirthGame";
import FamilyBackgroundGame from "./pages/games/FamilyBackgroundGame";
import EarlyChildhoodGame from "./pages/games/EarlyChildhoodGame";
import FirstTeacherGame from "./pages/games/FirstTeacherGame";
import LoveForReadingGame from "./pages/games/LoveForReadingGame";

// Chapter 2 Games
import AteneoGame from "./pages/games/AteneoGame";
import UstGame from "./pages/games/UstGame";
import AchievementsGame from "./pages/games/AchievementsGame";
import LiteraryWorksGame from "./pages/games/LiteraryWorksGame";
import EducationPuzzleGame from "./pages/games/EducationPuzzleGame";
import Chapter3 from "./pages/Chapter3";

// Chapter 3 Games
import EuropeanJourneyGame from "./pages/games/EuropeanJourneyGame";
import LiteraryCrosswordGame from "./pages/games/LiteraryCrosswordGame";
import LettersAbroadGame from "./pages/games/LettersAbroadGame";
import EuropeanQuizGame from "./pages/games/EuropeanQuizGame";
import TravelMapGame from "./pages/games/TravelMapGame";

// Chapter 4 Games
import Chapter4 from "./pages/Chapter4";
import CharacterConnectionsGame from "./pages/games/CharacterConnectionsGame";
import PlotReconstructionGame from "./pages/games/PlotReconstructionGame";
import SymbolismHuntGame from "./pages/games/SymbolismHuntGame";
import QuoteUnscrambleGame from "./pages/games/QuoteUnscrambleGame";
import SceneExplorerGame from "./pages/games/SceneExplorerGame";

// Chapter 5 Games
import Chapter5 from "./pages/Chapter5";
import LigaTimelineGame from "./pages/games/LigaTimelineGame";
import DapitanLifeGame from "./pages/games/DapitanLifeGame";
import RizalCorrespondenceGame from "./pages/games/RizalCorrespondenceGame";
import TrialMartyrdomGame from "./pages/games/TrialMartyrdomGame";
import LegacyBuilderGame from "./pages/games/LegacyBuilderGame";

// Chapter 6 Games
import Chapter6 from "./pages/Chapter6";
import RizalGlobalImpactGame from "./pages/games/RizalGlobalImpactGame";
import RizalDigitalAgeGame from "./pages/games/RizalDigitalAgeGame";
import RizalMonumentsGame from "./pages/games/RizalMonumentsGame";
import ModernFilipinoHeroesGame from "./pages/games/ModernFilipinoHeroesGame";
import RizalEternalLegacyGame from "./pages/games/RizalEternalLegacyGame";
import { setAuthToken, clearAuthToken } from "./utils/api";
import { resetSessionTracking } from "./utils/progressManager";
import { BadgeNotification } from "./components/BadgeSystem";
import CelebrationAnimation from "./components/CelebrationAnimation";
import BadgeNotificationSystem, {
  useBadgeNotifications,
} from "./components/BadgeNotificationSystem";
import BadgeTestComponent from "./components/BadgeTestComponent";
import GameIntegrationExample from "./components/GameIntegrationExample";
import LevelUnlockNotification from "./components/LevelUnlockNotification";
import ChapterUnlockNotification from "./components/ChapterUnlockNotification";
import LevelCompletionModal from "./components/LevelCompletionModal";
import QuickNextLevelButton from "./components/QuickNextLevelButton";
import ProgressDebugger from "./components/ProgressDebugger";
import ToastManager, { useToast } from "./components/ToastManager";
import { usePerformanceOptimization } from "./hooks/usePerformanceOptimization";
import { useProgressAPI } from "./hooks/useProgressAPI";
import { useAnalytics } from "./hooks/useAnalytics";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ConnectionStatus from "./components/ConnectionStatus";
import {
  handleGameCompletion,
  getLevelType,
  createGameStateTracker,
} from "./utils/gameCompletionHandler";
import { calculateScoreBreakdown } from "./utils/scoreCalculation";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  const [showCelebration, setShowCelebration] = useState(null);
  const [levelUnlockNotification, setLevelUnlockNotification] = useState(null);
  const [chapterUnlockNotification, setChapterUnlockNotification] =
    useState(null);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [levelCompletionModal, setLevelCompletionModal] = useState(null);
  const [showNextLevelButton, setShowNextLevelButton] = useState(null);
  const { preloadResource, isLowEndDevice } = usePerformanceOptimization();

  // Enhanced badge notification system
  const {
    notifications,
    showBadgeNotification,
    showLevelCompleteNotification,
    clearNotification,
  } = useBadgeNotifications();

  // Analytics system
  const { trackLevelComplete } = useAnalytics(username);

  // Toast notifications
  const { showSuccess, showInfo, setToastManager } = useToast();
  const toastManagerRef = useRef(null);

  // Connect toast manager
  useEffect(() => {
    if (toastManagerRef.current) {
      setToastManager(toastManagerRef.current);
    }
  }, [setToastManager]);

  // Use the database-backed progress system
  const {
    progressData,
    loading: progressLoading,
    error: progressError,
    completeLevel: completeUserLevel,
    refreshProgress,
    isLevelUnlocked,
    isLevelCompleted,
  } = useProgressAPI(username);

  useEffect(() => {
    setAuthToken(token);

    // Add developer testing functions to window (only in development)
    if (process.env.NODE_ENV === "development") {
      // Add progress data to window for debugging
      window.getProgressData = () => progressData;
      window.refreshProgress = refreshProgress;
      // console.log("🧪 Developer tools available:");
      // console.log("  - window.getProgressData() - View current progress data");
      // console.log(
      //   "  - window.refreshProgress() - Refresh progress from database"
      // );
    }

    // Add performance monitoring
    if ("performance" in window && "mark" in performance) {
      performance.mark("app-init-start");
    }

    if (!token) {
      setUsername(null);
      return;
    }

    // Use SQLite authentication to decode token
    try {
      // Decode JWT token to get username using new auth utilities
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.username) {
          setUsername(payload.username);
        }
      }
    } catch (error) {
      console.warn("Could not decode token:", error);
      // Token is invalid, clear it
      setToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogout = () => {
    resetSessionTracking();
    setToken(null);
    setUsername(null);
    clearAuthToken();
    localStorage.removeItem("user");
  };

  const handleGoToLevel = (chapter, level) => {
    // Navigate to the specific level
    window.location.href = `/chapter/${chapter}/level/${level}`;
  };

  const handleLevelComplete = async (
    chapter,
    level,
    score = 0,
    timeSpent = 0,
    gameState = {}
  ) => {
    if (!username) {
      console.error("No user logged in");
      return;
    }

    try {
      // console.log(
      //   `🎮 Attempting to complete Level ${level} of Chapter ${chapter} with raw score ${score}`
      // );

      // Get user ID from localStorage or username
      const userId = localStorage.getItem("userId") || username;

      // Get level type for score calculation
      const levelType = getLevelType(chapter, level);

      // Calculate final score using the game completion handler
      const completionResult = await handleGameCompletion({
        userId,
        chapterId: chapter,
        levelId: level,
        score,
        gameState: {
          attempts: gameState.attempts || 1,
          hintsUsed: gameState.hintsUsed || 0,
          startTime: gameState.startTime || new Date(Date.now() - timeSpent),
          endTime: gameState.endTime || new Date(),
          accuracy: gameState.accuracy || score,
        },
        levelConfig: {
          type: levelType,
        },
      });

      if (!completionResult.success) {
        console.error(
          "Failed to calculate final score:",
          completionResult.error
        );
        // Fall back to using raw score
        var finalScore = score;
      } else {
        var finalScore = completionResult.finalScore;
        // console.log(
        //   `📊 Final score calculated: ${finalScore} (raw score: ${score})`
        // );
      }

      // Use the new user-specific progress system with final score
      const result = await completeUserLevel(
        chapter,
        level,
        finalScore,
        timeSpent
      );

      // console.log("🔍 Complete level result:", result);

      if (result.success) {
        // console.log(
        //   `✅ User ${username}: Level ${level} of Chapter ${chapter} completed with score ${score}!`
        // );
        // console.log("🔓 Next level unlocked:", result.nextLevelUnlocked);
        // console.log("🚀 Next chapter unlocked:", result.nextChapterUnlocked);

        // Track analytics for level completion
        trackLevelComplete(chapter, level, {
          score,
          timeSpent,
          attempts: 1, // Could be enhanced to track actual attempts
          perfectScore: score === 100,
        });

        // Show level completion notification
        showLevelCompleteNotification(chapter, level, score);

        // Show immediate success notification with final score
        showSuccess(`🎉 Level ${level} completed! Final Score: ${finalScore}`, {
          duration: 3000,
          icon: "✅",
        });

        // Show celebration animation
        setShowCelebration("level");

        // Calculate fallback next level if missing
        let nextLevelUnlocked = result.nextLevelUnlocked;
        if (!nextLevelUnlocked && !result.nextChapterUnlocked && level < 5) {
          nextLevelUnlocked = { chapter, level: level + 1 };
        }

        // Show toast notifications for unlocks
        if (nextLevelUnlocked) {
          setTimeout(() => {
            showSuccess(
              `🔓 Level ${nextLevelUnlocked.level} unlocked in Chapter ${nextLevelUnlocked.chapter}!`,
              { duration: 4000, icon: "🆕" }
            );
          }, 1500);
        }

        if (result.nextChapterUnlocked) {
          setTimeout(() => {
            showInfo(
              `🚀 New Chapter ${result.nextChapterUnlocked.chapter} unlocked!`,
              { duration: 5000, icon: "📚" }
            );
            // Show chapter unlock notification with celebration
            setChapterUnlockNotification({
              chapter: result.nextChapterUnlocked.chapter,
              chapterName: result.nextChapterUnlocked.chapterName,
            });
          }, 2500);
        }

        // Show quick next level button immediately after celebration
        const nextLevel =
          nextLevelUnlocked || result.nextChapterUnlocked;
        if (nextLevel) {
          setTimeout(() => {
            setShowNextLevelButton(nextLevel);
          }, 500);
        }

        // Show comprehensive completion modal after celebration
        setTimeout(() => {
          setLevelCompletionModal({
            completedLevel: { chapter, level },
            score: finalScore, // Use final score instead of raw score
            rawScore: score, // Keep raw score for reference
            finalScore: finalScore, // Explicitly include final score
            nextLevelUnlocked: nextLevelUnlocked,
            nextChapterUnlocked: result.nextChapterUnlocked,
            newBadges: result.newBadges || [],
          });
        }, 1000);

        // Show new badge notifications
        if (result.newBadges && result.newBadges.length > 0) {
          result.newBadges.forEach((badge, index) => {
            setTimeout(() => {
              showBadgeNotification(badge);
            }, (index + 1) * 1000); // Stagger badge notifications
          });
          setNewBadges(result.newBadges);
        }

        // Log progress to console for debugging
        // console.log(`Progress saved for user ${username}:`, {
        //   chapter,
        //   level,
        //   score,
        //   timeSpent,
        //   totalCompleted: result.progress?.overall?.completedLevels || 0,
        //   newBadges: result.newBadges,
        // });
      } else {
        console.error(
          `Failed to save completion for Level ${level} of Chapter ${chapter}:`,
          result.error
        );
      }
    } catch (error) {
      console.error("Error completing level:", error);
    }
  };

  const handleBadgeNotificationClose = () => {
    setNewBadges((prev) => prev.slice(1));
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(null);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>

        {/* Celebration Animation */}
        {showCelebration && (
          <CelebrationAnimation
            type={showCelebration}
            onComplete={handleCelebrationComplete}
          />
        )}

        {/* Enhanced Badge Notification System */}
        <BadgeNotificationSystem
          notifications={notifications}
          onClearNotification={clearNotification}
        />

        {/* Legacy Badge Notifications (for backward compatibility) */}
        {newBadges.length > 0 && (
          <BadgeNotification
            badge={newBadges[0]}
            onClose={handleBadgeNotificationClose}
          />
        )}

        {/* Level Unlock Notification */}
        {levelUnlockNotification && (
          <LevelUnlockNotification
            chapter={levelUnlockNotification.chapter}
            level={levelUnlockNotification.level}
            onClose={() => setLevelUnlockNotification(null)}
            onGoToLevel={handleGoToLevel}
          />
        )}

        {/* Chapter Unlock Notification */}
        {chapterUnlockNotification && (
          <ChapterUnlockNotification
            chapter={chapterUnlockNotification.chapter}
            chapterName={chapterUnlockNotification.chapterName}
            onClose={() => setChapterUnlockNotification(null)}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <Home
                  username={username}
                  onLogout={handleLogout}
                  onShowAnalytics={() => setShowAnalyticsDashboard(true)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/user-stats"
            element={
              token ? (
                <UserStats
                  username={username}
                  onLogout={handleLogout}
                  onShowAnalytics={() => setShowAnalyticsDashboard(true)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1"
            element={
              token ? (
                <Chapter1 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1/level/1"
            element={
              token ? (
                <JoseBirthGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(1, 1, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1/level/2"
            element={
              token ? (
                <FamilyBackgroundGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(1, 2, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1/level/3"
            element={
              token ? (
                <EarlyChildhoodGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(1, 3, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1/level/4"
            element={
              token ? (
                <FirstTeacherGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(1, 4, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/1/level/5"
            element={
              token ? (
                <LoveForReadingGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score) => handleLevelComplete(1, 5, score)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Chapter 2 Routes */}
          <Route
            path="/chapter/2"
            element={
              token ? (
                <Chapter2 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/2/level/1"
            element={
              token ? (
                <AteneoGame
                  username={username}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(2, 1, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/2/level/2"
            element={
              token ? (
                <UstGame
                  username={username}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(2, 2, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/2/level/3"
            element={
              token ? (
                <AchievementsGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(2, 3, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/2/level/4"
            element={
              token ? (
                <LiteraryWorksGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(2, 4, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/2/level/5"
            element={
              token ? (
                <EducationPuzzleGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(2, 5, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Chapter 3 Routes */}
          <Route
            path="/chapter/3"
            element={
              token ? (
                <Chapter3 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/3/level/1"
            element={
              token ? (
                <EuropeanJourneyGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(3, 1, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/3/level/2"
            element={
              token ? (
                <LiteraryCrosswordGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(3, 2, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/3/level/3"
            element={
              token ? (
                <LettersAbroadGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(3, 3, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/3/level/4"
            element={
              token ? (
                <EuropeanQuizGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(3, 4, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/3/level/5"
            element={
              token ? (
                <TravelMapGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(3, 5, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Chapter 4 Routes */}
          <Route
            path="/chapter/4"
            element={
              token ? (
                <Chapter4 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/4/level/1"
            element={
              token ? (
                <CharacterConnectionsGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(4, 1, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/4/level/2"
            element={
              token ? (
                <PlotReconstructionGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(4, 2, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/4/level/3"
            element={
              token ? (
                <SymbolismHuntGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(4, 3, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/4/level/4"
            element={
              token ? (
                <QuoteUnscrambleGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(4, 4, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/4/level/5"
            element={
              token ? (
                <SceneExplorerGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(4, 5, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Chapter 5 Routes */}
          <Route
            path="/chapter/5"
            element={
              token ? (
                <Chapter5 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/5/level/1"
            element={
              token ? (
                <LigaTimelineGame
                  username={username}
                  onComplete={(score) =>
                    handleLevelComplete(5, 1, score !== undefined ? score : 100)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/5/level/2"
            element={
              token ? (
                <DapitanLifeGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score) => handleLevelComplete(5, 2, score)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/5/level/3"
            element={
              token ? (
                <RizalCorrespondenceGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score) => handleLevelComplete(5, 3, score)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/5/level/4"
            element={
              token ? (
                <TrialMartyrdomGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score) => handleLevelComplete(5, 4, score)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/5/level/5"
            element={
              token ? (
                <LegacyBuilderGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score) => handleLevelComplete(5, 5, score)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Chapter 6 Routes */}
          <Route
            path="/chapter/6"
            element={
              token ? (
                <Chapter6 username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/6/level/1"
            element={
              token ? (
                <RizalGlobalImpactGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(6, 1, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/6/level/2"
            element={
              token ? (
                <RizalDigitalAgeGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(6, 2, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/6/level/3"
            element={
              token ? (
                <RizalMonumentsGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(6, 3, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/6/level/4"
            element={
              token ? (
                <ModernFilipinoHeroesGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(6, 4, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/chapter/6/level/5"
            element={
              token ? (
                <RizalEternalLegacyGame
                  username={username}
                  onLogout={handleLogout}
                  onComplete={(score, timeSpent, gameState) =>
                    handleLevelComplete(6, 5, score, timeSpent, gameState)
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              !token ? <Login setToken={setToken} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/register"
            element={
              !token ? <Register setToken={setToken} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin"
            element={
              token ? (
                <AdminDashboard username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/badge-test" element={<BadgeTestComponent />} />
          <Route
            path="/game-example"
            element={<GameIntegrationExample username={username} />}
          />
        </Routes>

        {/* Quick Next Level Button */}
        {showNextLevelButton && (
          <QuickNextLevelButton
            nextLevel={showNextLevelButton}
            onClose={() => setShowNextLevelButton(null)}
          />
        )}

        {/* Level Completion Modal */}
        {levelCompletionModal && (
          <LevelCompletionModal
            isOpen={!!levelCompletionModal}
            onClose={() => {
              setLevelCompletionModal(null);
              setShowNextLevelButton(null); // Hide next level button when modal closes
            }}
            completedLevel={levelCompletionModal.completedLevel}
            score={levelCompletionModal.score}
            nextLevelUnlocked={levelCompletionModal.nextLevelUnlocked}
            nextChapterUnlocked={levelCompletionModal.nextChapterUnlocked}
            newBadges={levelCompletionModal.newBadges}
          />
        )}

        {/* Analytics Dashboard */}
        {showAnalyticsDashboard && (
          <AnalyticsDashboard
            username={username}
            onClose={() => setShowAnalyticsDashboard(false)}
          />
        )}

        {/* Progress Debugger (temporary) */}
        {/* {username && <ProgressDebugger username={username} />} */}

        {/* Toast Notifications */}
        <ToastManager ref={toastManagerRef} />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
