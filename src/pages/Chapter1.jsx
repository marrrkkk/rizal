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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToHome}
              className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-white"
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chapter 1: Childhood in Calamba
              </h1>
              <p className="text-sm text-gray-600">
                Choose a level to continue learning
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Chapter Hero */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-5xl">🏠</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Childhood in Calamba
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the early years of Jose Rizal in his hometown of Calamba,
              Laguna
            </p>
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <ProgressDashboard type="chapter" chapterId={1} showBadges={true} />
        </div>

        {/* Levels Grid - Now showing 5 levels in a better layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(1, level.id);
            const isCompleted = isLevelCompleted(1, level.id);

            return (
              <div
                key={level.id}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform cursor-pointer ${
                  isUnlocked
                    ? "bg-white hover:shadow-2xl hover:-translate-y-2"
                    : "bg-gray-100 opacity-60"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleLevelClick(level)}
              >
                {/* Lock/Unlock Indicator */}
                <div className="absolute top-4 right-4 z-10">
                  {isCompleted ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : isUnlocked ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Level Number */}
                <div className="absolute top-4 left-4 z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      isUnlocked ? "bg-white/90" : "bg-gray-300/90"
                    }`}
                  >
                    <span
                      className={`text-lg font-bold ${
                        isUnlocked ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {level.id}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 pt-16">
                  {/* Title */}
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors ${
                      isUnlocked
                        ? "text-gray-800 group-hover:text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {level.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed ${
                      isUnlocked ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {level.description}
                  </p>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        isCompleted
                          ? "bg-green-100 text-green-800"
                          : isUnlocked
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isCompleted
                        ? "Completed"
                        : isUnlocked
                        ? "Available"
                        : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Hover Effect Border */}
                {isUnlocked && (
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300"></div>
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
