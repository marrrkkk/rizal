import React from "react";

const ConnectionStatus = ({ usingFallback, error }) => {
  if (!usingFallback && !error) {
    return null; // Don't show anything when everything is working
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: usingFallback ? "#fff3cd" : "#f8d7da",
        color: usingFallback ? "#856404" : "#721c24",
        padding: "8px 12px",
        borderRadius: "4px",
        border: `1px solid ${usingFallback ? "#ffeaa7" : "#f5c6cb"}`,
        fontSize: "12px",
        zIndex: 1000,
        maxWidth: "300px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        {usingFallback ? "📱 Offline Mode" : "⚠️ Connection Issue"}
      </div>
      <div style={{ fontSize: "11px" }}>
        {usingFallback
          ? "Progress is saved locally. Connect to server to sync."
          : error || "Unable to connect to server"}
      </div>
    </div>
  );
};

export default ConnectionStatus;
