import { useState, useEffect } from "react";
import {
  getOverallProgress,
  getChapterProgress,
  getAllBadges,
  getAchievementStats,
  chapterConfigs,
} from "../utils/progressManager";
import ProgressBar from "./ProgressBar";
import BadgeShowcase from "./BadgeSystem";

const ProgressDashboard = ({
  type = "overview", // 'overview', 'detailed', 'compact'
  chapterId = null,
  showBadges = true,
  showStats = true,
}) => {
  const [overallProgress, setOverallProgress] = useState(null);
  const [chapterProgress, setChapterProgress] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [achievementStats, setAchievementStats] = useState(null);

  useEffect(() => {
    // Load overall progress
    const overall = getOverallProgress();
    setOverallProgress(overall);

    // Load chapter-specific progress if requested
    if (chapterId) {
      const chapter = getChapterProgress(chapterId);
      setChapterProgress(chapter);
    }

    // Load badges and achievements
    if (showBadges || showStats) {
      const badges = getAllBadges();
      setUserBadges(badges);

      const stats = getAchievementStats();
      setAchievementStats(stats);
    }
  }, [chapterId, showBadges, showStats]);

  const renderOverviewDashboard = () => (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Your Learning Journey
      </h3>

      {/* Overall Progress */}
      <div className="mb-8">
        <ProgressBar
          current={overallProgress?.completedLevels || 0}
          total={overallProgress?.totalLevels || 25}
          theme="blue"
          size="large"
          showLabels={true}
        />
      </div>

      {/* Stats Grid */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">
                {overallProgress?.completedLevels || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Levels Complete</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">{userBadges.length}</span>
            </div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">
                {overallProgress?.averageScore || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">
                {achievementStats?.consecutiveDays || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      )}

      {/* Badge Showcase */}
      {showBadges && <BadgeShowcase badges={userBadges} maxDisplay={8} />}
    </div>
  );

  const renderChapterDashboard = () => (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
      <ProgressBar
        current={chapterProgress?.completedLevels || 0}
        total={chapterProgress?.totalLevels || 5}
        theme="blue"
        size="large"
        showLabels={true}
      />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          {chapterProgress?.unlockedLevels || 0} of{" "}
          {chapterProgress?.totalLevels || 5} levels available
        </span>
        {chapterProgress?.averageScore > 0 && (
          <span className="text-sm font-medium text-blue-600">
            Average Score: {chapterProgress.averageScore}%
          </span>
        )}
      </div>

      {/* Chapter Badges */}
      {showBadges &&
        chapterProgress?.badges &&
        chapterProgress.badges.length > 0 && (
          <div className="mt-6">
            <BadgeShowcase
              badges={chapterProgress.badges}
              title="Chapter Badges"
              maxDisplay={4}
            />
          </div>
        )}
    </div>
  );

  const renderCompactDashboard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-bold text-gray-800">
          {overallProgress?.completionPercentage || 0}%
        </span>
      </div>

      <ProgressBar
        current={overallProgress?.completedLevels || 0}
        total={overallProgress?.totalLevels || 25}
        theme="blue"
        size="small"
        showLabels={false}
        showPercentage={false}
      />

      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>{overallProgress?.completedLevels || 0} levels</span>
        <span>{userBadges.length} badges</span>
      </div>
    </div>
  );

  const renderDetailedDashboard = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Overall Progress
        </h3>

        <ProgressBar
          current={overallProgress?.completedLevels || 0}
          total={overallProgress?.totalLevels || 25}
          theme="blue"
          size="large"
          showLabels={true}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {overallProgress?.completedLevels || 0}
            </div>
            <div className="text-sm text-gray-600">Levels Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userBadges.length}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {overallProgress?.averageScore || 0}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {achievementStats?.consecutiveDays || 0}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {achievementStats?.perfectScores || 0}
            </div>
            <div className="text-sm text-gray-600">Perfect Scores</div>
          </div>
        </div>
      </div>

      {/* Chapter Progress */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Chapter Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(chapterConfigs).map((chapterId) => {
            const progress = getChapterProgress(parseInt(chapterId));
            const isComplete = progress?.isComplete || false;

            return (
              <div key={chapterId} className="bg-white/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Chapter {chapterId}
                  </h4>
                  {isComplete && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <ProgressBar
                  current={progress?.completedLevels || 0}
                  total={progress?.totalLevels || 5}
                  theme="blue"
                  size="small"
                  showLabels={false}
                />

                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>{progress?.completedLevels || 0}/5 levels</span>
                  <span>{progress?.averageScore || 0}% avg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {showBadges && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <BadgeShowcase
            badges={userBadges}
            title="All Badges"
            maxDisplay={12}
          />
        </div>
      )}
    </div>
  );

  // Render based on type
  switch (type) {
    case "detailed":
      return renderDetailedDashboard();
    case "compact":
      return renderCompactDashboard();
    case "chapter":
      return renderChapterDashboard();
    default:
      return renderOverviewDashboard();
  }
};

export default ProgressDashboard;
