/**
 * Skip Link Component
 * Provides a "Skip to main content" link for keyboard users
 * Implements WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 * Requirement 15.4
 */

import React from "react";

const SkipLink = ({ targetId = "main-content" }) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-2xl focus:font-bold focus:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[48px] min-w-[48px] flex items-center justify-center"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
