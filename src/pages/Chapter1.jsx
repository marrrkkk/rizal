"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getChapterProgress,
  isLevelUnlocked,
  isLevelCompleted,
  getChapterBadges,
} from "../utils/progressManager";
import ProgressDashboard from "../components/ProgressDashboard";
import CompletionCertificate from "../components/CompletionCertificate";
import { createNavigationHelper } from "../utils/navigationHelper";

export default function Chapter1({ username, onLogout }) {
  const navigate = useNavigate();
  const navigationHelper = createNavigationHelper(navigate);
  const [chapterProgress, setChapterProgress] = useState(null);
  const [chapterBadges, setChapterBadges] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    // Load chapter progress
    const progress = getChapterProgress(1);
    setChapterProgress(progress);

    // Load chapter badges
    const badges = getChapterBadges(1);
    setChapterBadges(badges);
  }, []);

  const levels = [
    {
      id: 1,
      title: "Jose's Birth",
      description: "Learn about when and where Jose was born",
      path: "/chapter/1/level/1",
    },
    {
      id: 2,
      title: "Family Background",
      description: "Meet Jose's parents and siblings",
      path: "/chapter/1/level/2",
    },
    {
      id: 3,
      title: "Early Childhood",
      description: "Discover Jose's first years in Calamba",
      path: "/chapter/1/level/3",
    },
    {
      id: 4,
      title: "First Teacher",
      description: "Learn about Jose's mother as his first teacher",
      path: "/chapter/1/level/4",
    },
    {
      id: 5,
      title: "Love for Reading",
      description: "How Jose developed his passion for books",
      path: "/chapter/1/level/5",
    },
  ];

  const handleLevelClick = (level) => {
    const isUnlocked = isLevelUnlocked(1, level.id);

    if (isUnlocked) {
      if (level.path) {
        navigationHelper.goToLevel(1, level.id);
      } else {
        alert(`Level ${level.id}: ${level.title} - Coming Soon!`);
      }
    } else {
      alert("Complete previous levels to unlock this one!");
    }
  };

  const handleBackToHome = () => {
    navigationHelper.goHome();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-green-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-blue-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-b-2 border-gray-700 active:border-b-0"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-black">
                  Childhood in Calamba
                </h1>
                <p className="text-sm text-black font-medium">
                  5 lessons • Chapter 1
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg border-b-2 border-red-700 active:border-b-0"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Duolingo-style Chapter Hero */}
        <div className="text-center mb-12 relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <div className="text-white text-6xl">🏠</div>
              </div>
              {/* Floating elements around mascot */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                Start here!
              </div>
              <div className="absolute -bottom-1 -left-1 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                👶
              </div>
            </div>
            <h2 className="text-4xl font-black text-black mb-4">
              Childhood in Calamba
            </h2>
            <p className="text-lg text-black font-medium max-w-2xl mx-auto mb-6">
              Discover the early years of Jose Rizal in his hometown of Calamba,
              Laguna
            </p>

            {/* Progress indicator */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md mx-auto border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black">Chapter Progress</span>
                <span className="text-blue-600 font-bold text-sm">
                  3/5 complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="w-3/5 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <ProgressDashboard type="chapter" chapterId={1} showBadges={true} />
        </div>

        {/* Duolingo-style Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(1, level.id);
            const isCompleted = isLevelCompleted(1, level.id);

            return (
              <div
                key={level.id}
                className={`group relative bg-white rounded-3xl shadow-lg transition-all duration-300 transform cursor-pointer border-4 border-white/50 overflow-hidden ${
                  isUnlocked
                    ? "hover:shadow-2xl hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleLevelClick(level)}
              >
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                        : isUnlocked
                        ? "w-1/2 bg-gradient-to-r from-blue-400 to-blue-500"
                        : "w-0 bg-gray-300"
                    }`}
                  ></div>
                </div>

                {/* Status indicator */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                    isCompleted
                      ? "bg-green-400"
                      : isUnlocked
                      ? "bg-blue-400"
                      : "bg-gray-400"
                  }`}
                >
                  <span className="text-white text-sm font-bold">
                    {isCompleted ? "✓" : isUnlocked ? "▶" : "🔒"}
                  </span>
                </div>

                {/* NEW indicator for recently unlocked levels */}
                {isUnlocked && !isCompleted && level.id > 1 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    NEW!
                  </div>
                )}

                <div className="p-6">
                  {/* Level icon with Duolingo-style design */}
                  <div className="relative mb-4">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg mx-auto border-4 border-white ${
                        isUnlocked ? "group-hover:scale-110" : ""
                      } transition-transform duration-300`}
                    >
                      <span className="text-white font-black text-2xl">
                        {level.id}
                      </span>
                    </div>
                    {/* Completion stars */}
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </div>

                  {/* Level info */}
                  <div className="text-center">
                    <h3
                      className={`text-xl font-black mb-2 transition-colors ${
                        isUnlocked
                          ? "text-black group-hover:text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {level.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 leading-relaxed ${
                        isUnlocked ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {level.description}
                    </p>

                    {/* Status badge */}
                    <div className="mb-4">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide ${
                          isCompleted
                            ? "text-green-600"
                            : isUnlocked
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {isCompleted
                          ? "Complete"
                          : isUnlocked
                          ? "Ready"
                          : "Locked"}
                      </span>
                    </div>

                    {/* Action button */}
                    <button
                      className={`w-full font-black py-3 px-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-2 uppercase tracking-wide text-sm ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 hover:shadow-lg hover:scale-105"
                          : isUnlocked
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 hover:shadow-lg hover:scale-105"
                          : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-60"
                      }`}
                      disabled={!isUnlocked}
                    >
                      {isCompleted
                        ? "✓ Review"
                        : isUnlocked
                        ? "▶ Start"
                        : "🔒 Complete Previous Level"}
                    </button>
                  </div>
                </div>

                {/* Locked overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-gray-900/50 rounded-3xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-sm font-bold">
                        Complete Level {level.id - 1}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Chapter Completion Message */}
        {chapterProgress && chapterProgress.isComplete && (
          <div className="mt-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold mb-2">Chapter 1 Complete!</h3>
            <p className="text-xl text-green-100 mb-6">
              Congratulations! You've learned all about Jose Rizal's childhood
              in Calamba!
            </p>
            <div className="bg-white/20 rounded-2xl p-4 inline-block mb-6">
              <span className="text-2xl font-bold">
                🏆 Childhood Expert Badge Earned!
              </span>
            </div>
            <div>
              <button
                onClick={() => setShowCertificate(true)}
                className="bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                🏅 View Certificate
              </button>
            </div>
          </div>
        )}

        {/* Completion Certificate Modal */}
        {showCertificate && chapterProgress && (
          <CompletionCertificate
            username={username}
            chapterTitle="Chapter 1: Childhood in Calamba"
            chapterId={1}
            completionDate={
              chapterProgress.completionDate || new Date().toISOString()
            }
            score={chapterProgress.averageScore}
            onClose={() => setShowCertificate(false)}
          />
        )}

        {/* Chapter Info */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            About This Chapter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                What You'll Learn
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Jose Rizal's birth and early family life</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>His childhood experiences in Calamba</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Early signs of his exceptional abilities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Family values that shaped his character</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>His love for learning and reading</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Key Highlights
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      1861
                    </span>
                  </div>
                  <span className="text-gray-600">
                    Year Jose Rizal was born
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <span className="text-gray-600">
                    Age when he learned to read
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">
                      👩
                    </span>
                  </div>
                  <span className="text-gray-600">
                    His mother was his first teacher
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">
                      📚
                    </span>
                  </div>
                  <span className="text-gray-600">
                    Loved reading from a very young age
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
