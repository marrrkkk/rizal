import { useState } from "react";
import { useProgressAPI } from "../hooks/useProgressAPI";

const ProgressDebugger = ({ username }) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    progressData,
    loading,
    error,
    completeLevel: completeUserLevel,
    isLevelUnlocked,
    isLevelCompleted,
  } = useProgressAPI(username);

  const testCompleteLevel = async () => {
    console.log("🧪 Testing level completion...");
    const result = await completeUserLevel(1, 1, 85, 30000);
    console.log("🧪 Test result:", result);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-50"
      >
        Debug Progress
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-red-600">Progress Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <strong>Username:</strong> {username || "Not logged in"}
        </div>

        <div>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </div>

        <div>
          <strong>Error:</strong> {error || "None"}
        </div>

        <div>
          <strong>Progress Data:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
            {JSON.stringify(progressData, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Level 1-1 Unlocked:</strong>{" "}
          {isLevelUnlocked(1, 1) ? "Yes" : "No"}
        </div>

        <div>
          <strong>Level 1-1 Completed:</strong>{" "}
          {isLevelCompleted(1, 1) ? "Yes" : "No"}
        </div>

        <div>
          <strong>Level 1-2 Unlocked:</strong>{" "}
          {isLevelUnlocked(1, 2) ? "Yes" : "No"}
        </div>

        <button
          onClick={testCompleteLevel}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-full mb-2"
        >
          Test Complete Level 1-1
        </button>

        <button
          onClick={async () => {
            console.log("🔧 Running progress system fix...");
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                "http://localhost/rizal/api/debug/fix_progress_system.php",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              const result = await response.json();
              console.log("🔧 Fix result:", result);
              alert("Fix completed! Check console for details.");
            } catch (error) {
              console.error("🔧 Fix error:", error);
              alert("Fix failed: " + error.message);
            }
          }}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm w-full"
        >
          🔧 Fix Progress System
        </button>

        <div>
          <strong>Token:</strong>
          <div className="bg-gray-100 p-2 rounded text-xs mt-1 break-all">
            {localStorage.getItem("token") ? "Present" : "Missing"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDebugger;
