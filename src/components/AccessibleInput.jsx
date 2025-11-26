/**
 * Accessible Input Component
 * WCAG AA compliant input with proper focus states, touch targets, and ARIA labels
 * Implements Requirement 15.4
 */

import React from "react";
import {
  getInputA11yProps,
  getErrorA11yProps,
} from "../utils/accessibilityEnhancements";
import { getFocusRing, getTouchPadding } from "../utils/accessibility";

const AccessibleInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = null,
  autocomplete = null,
  describedBy = null,
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) => {
  const inputA11yProps = getInputA11yProps(id, label, {
    required,
    error,
    type,
    autocomplete,
    describedBy,
  });

  const baseClasses = `
    w-full px-4 py-3
    border-2 rounded-lg
    transition-all duration-200
    ${getFocusRing()}
    ${getTouchPadding("input")}
    ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}
    ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
    min-h-[48px]
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${className}`}
        {...inputA11yProps}
        {...props}
      />
      {error && (
        <div {...getErrorA11yProps(id)}>
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <span className="mr-1" aria-hidden="true">
              ⚠️
            </span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessibleInput;
