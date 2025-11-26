/**
 * Accessible Link Component
 * WCAG AA compliant link with proper focus states, touch targets, and ARIA labels
 * Implements Requirement 15.4
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  getLinkA11yProps,
  onKeyboardActivate,
} from "../utils/accessibilityEnhancements";
import { getTouchTarget, getFocusRing } from "../utils/accessibility";

const AccessibleLink = ({
  children,
  to,
  external = false,
  download = false,
  describedBy = null,
  ariaLabel,
  className = "",
  ...props
}) => {
  const a11yProps = getLinkA11yProps(
    ariaLabel || (typeof children === "string" ? children : "Link"),
    {
      external,
      download,
      describedBy,
    }
  );

  const baseClasses = `
    inline-flex items-center
    transition-all duration-200
    ${getTouchTarget("minimum")}
    ${getFocusRing()}
  `;

  if (external) {
    return (
      <a
        href={to}
        className={`${baseClasses} ${className}`}
        {...a11yProps}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${className}`}
      {...a11yProps}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AccessibleLink;
