/**
 * Accessible Button Component
 * WCAG AA compliant button with proper focus states, touch targets, and ARIA labels
 * Implements Requirement 15.4
 */

import React from "react";
import {
  getButtonA11yProps,
  onKeyboardActivate,
} from "../utils/accessibilityEnhancements";
import { getTouchTarget, getFocusRing } from "../utils/accessibility";

const AccessibleButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  pressed = false,
  expanded = false,
  controls = null,
  describedBy = null,
  ariaLabel,
  className = "",
  type = "button",
  ...props
}) => {
  const a11yProps = getButtonA11yProps(
    ariaLabel || (typeof children === "string" ? children : "Button"),
    {
      variant,
      disabled,
      pressed,
      expanded,
      controls,
      describedBy,
    }
  );

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    ${getTouchTarget("recommended")}
    ${getFocusRing(variant)}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={onKeyboardActivate(onClick)}
      disabled={disabled}
      className={`${baseClasses} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...a11yProps}
      {...props}
    >
      {children}
    </button>
  );
};

export default AccessibleButton;
