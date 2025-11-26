/**
 * Accessibility Enhancements
 * Comprehensive accessibility improvements for WCAG AA compliance
 * Implements Requirement 15.4
 */

import {
  getFocusRing,
  getTouchTarget,
  getTouchPadding,
  getAccessibleColors,
  meetsWCAGAA,
  getContrastRatio,
  announceToScreenReader,
  handleKeyboardNavigation,
} from "./accessibility";

// ============================================================================
// ENHANCED BUTTON ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive button accessibility attributes
 * Includes focus states, touch targets, and ARIA labels
 */
export const getButtonA11yProps = (label, options = {}) => {
  const {
    variant = "primary",
    disabled = false,
    pressed = false,
    expanded = false,
    controls = null,
    describedBy = null,
  } = options;

  const props = {
    className: `${getFocusRing(variant)} ${getTouchTarget(
      "recommended"
    )} ${getTouchPadding("button")}`,
    "aria-label": label,
    role: "button",
    tabIndex: disabled ? -1 : 0,
  };

  if (disabled) {
    props["aria-disabled"] = "true";
  }

  if (pressed !== undefined) {
    props["aria-pressed"] = pressed ? "true" : "false";
  }

  if (expanded !== undefined) {
    props["aria-expanded"] = expanded ? "true" : "false";
  }

  if (controls) {
    props["aria-controls"] = controls;
  }

  if (describedBy) {
    props["aria-describedby"] = describedBy;
  }

  return props;
};

// ============================================================================
// ENHANCED LINK ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive link accessibility attributes
 */
export const getLinkA11yProps = (label, options = {}) => {
  const { external = false, download = false, describedBy = null } = options;

  const props = {
    className: `${getFocusRing()} ${getTouchTarget("minimum")}`,
    "aria-label": label,
  };

  if (external) {
    props["aria-label"] = `${label}, opens in new window`;
    props["rel"] = "noopener noreferrer";
    props["target"] = "_blank";
  }

  if (download) {
    props["aria-label"] = `${label}, download file`;
  }

  if (describedBy) {
    props["aria-describedby"] = describedBy;
  }

  return props;
};

// ============================================================================
// ENHANCED FORM ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive form input accessibility attributes
 */
export const getInputA11yProps = (id, label, options = {}) => {
  const {
    required = false,
    error = null,
    type = "text",
    autocomplete = null,
    describedBy = null,
  } = options;

  const props = {
    id,
    className: `${getFocusRing()} ${getTouchPadding("input")}`,
    "aria-label": label,
    "aria-required": required ? "true" : "false",
    type,
  };

  if (error) {
    props["aria-invalid"] = "true";
    props["aria-describedby"] = `${id}-error`;
  } else if (describedBy) {
    props["aria-describedby"] = describedBy;
  }

  if (autocomplete) {
    props["autoComplete"] = autocomplete;
  }

  return props;
};

/**
 * Get error message accessibility attributes
 */
export const getErrorA11yProps = (fieldId) => {
  return {
    id: `${fieldId}-error`,
    role: "alert",
    "aria-live": "polite",
    className: "text-red-600 text-sm mt-1",
  };
};

// ============================================================================
// ENHANCED CARD ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive card accessibility attributes
 */
export const getCardA11yProps = (title, options = {}) => {
  const {
    clickable = false,
    disabled = false,
    selected = false,
    describedBy = null,
  } = options;

  const props = {
    className: `${getFocusRing()} ${getTouchTarget("minimum")}`,
  };

  if (clickable) {
    props.role = "button";
    props.tabIndex = disabled ? -1 : 0;
    props["aria-label"] = title;

    if (disabled) {
      props["aria-disabled"] = "true";
    }

    if (selected !== undefined) {
      props["aria-pressed"] = selected ? "true" : "false";
    }
  } else {
    props.role = "article";
    props["aria-label"] = title;
  }

  if (describedBy) {
    props["aria-describedby"] = describedBy;
  }

  return props;
};

// ============================================================================
// ENHANCED MODAL/DIALOG ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive modal accessibility attributes
 */
export const getModalA11yProps = (title, options = {}) => {
  const { describedBy = null, labelledBy = null } = options;

  const props = {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    tabIndex: -1,
  };

  if (labelledBy) {
    props["aria-labelledby"] = labelledBy;
    delete props["aria-label"];
  }

  if (describedBy) {
    props["aria-describedby"] = describedBy;
  }

  return props;
};

// ============================================================================
// ENHANCED NAVIGATION ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive navigation accessibility attributes
 */
export const getNavA11yProps = (label) => {
  return {
    role: "navigation",
    "aria-label": label,
  };
};

/**
 * Get breadcrumb navigation accessibility attributes
 */
export const getBreadcrumbA11yProps = () => {
  return {
    role: "navigation",
    "aria-label": "Breadcrumb",
  };
};

// ============================================================================
// ENHANCED LIST ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive list accessibility attributes
 */
export const getListA11yProps = (label, options = {}) => {
  const { ordered = false } = options;

  return {
    role: ordered ? "list" : "list",
    "aria-label": label,
  };
};

/**
 * Get list item accessibility attributes
 */
export const getListItemA11yProps = (index, total) => {
  return {
    role: "listitem",
    "aria-setsize": total,
    "aria-posinset": index + 1,
  };
};

// ============================================================================
// ENHANCED TAB ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive tab accessibility attributes
 */
export const getTabA11yProps = (id, label, options = {}) => {
  const { selected = false, controls = null } = options;

  const props = {
    id,
    role: "tab",
    "aria-label": label,
    "aria-selected": selected ? "true" : "false",
    tabIndex: selected ? 0 : -1,
    className: `${getFocusRing()} ${getTouchTarget("recommended")}`,
  };

  if (controls) {
    props["aria-controls"] = controls;
  }

  return props;
};

/**
 * Get tab panel accessibility attributes
 */
export const getTabPanelA11yProps = (id, labelledBy) => {
  return {
    id,
    role: "tabpanel",
    "aria-labelledby": labelledBy,
    tabIndex: 0,
  };
};

/**
 * Get tab list accessibility attributes
 */
export const getTabListA11yProps = (label) => {
  return {
    role: "tablist",
    "aria-label": label,
  };
};

// ============================================================================
// ENHANCED TOOLTIP ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive tooltip accessibility attributes
 */
export const getTooltipA11yProps = (id, visible = false) => {
  return {
    id,
    role: "tooltip",
    "aria-hidden": visible ? "false" : "true",
  };
};

/**
 * Get tooltip trigger accessibility attributes
 */
export const getTooltipTriggerA11yProps = (tooltipId) => {
  return {
    "aria-describedby": tooltipId,
  };
};

// ============================================================================
// ENHANCED LOADING STATE ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive loading state accessibility attributes
 */
export const getLoadingA11yProps = (message = "Loading") => {
  return {
    role: "status",
    "aria-live": "polite",
    "aria-label": `${message}, please wait`,
  };
};

/**
 * Get spinner accessibility attributes
 */
export const getSpinnerA11yProps = () => {
  return {
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-label": "Loading",
  };
};

// ============================================================================
// ENHANCED ALERT ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive alert accessibility attributes
 */
export const getAlertA11yProps = (type = "info") => {
  const roleMap = {
    error: "alert",
    warning: "alert",
    success: "status",
    info: "status",
  };

  return {
    role: roleMap[type] || "status",
    "aria-live":
      type === "error" || type === "warning" ? "assertive" : "polite",
    "aria-atomic": "true",
  };
};

// ============================================================================
// ENHANCED MENU ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive menu accessibility attributes
 */
export const getMenuA11yProps = (label) => {
  return {
    role: "menu",
    "aria-label": label,
  };
};

/**
 * Get menu item accessibility attributes
 */
export const getMenuItemA11yProps = (label, options = {}) => {
  const { disabled = false, selected = false } = options;

  const props = {
    role: "menuitem",
    "aria-label": label,
    tabIndex: disabled ? -1 : 0,
    className: `${getFocusRing()} ${getTouchTarget("recommended")}`,
  };

  if (disabled) {
    props["aria-disabled"] = "true";
  }

  if (selected !== undefined) {
    props["aria-current"] = selected ? "true" : "false";
  }

  return props;
};

// ============================================================================
// ENHANCED PROGRESS BAR ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive progress bar accessibility attributes
 */
export const getProgressBarA11yProps = (
  value,
  max = 100,
  label = "Progress"
) => {
  return {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemin": 0,
    "aria-valuemax": max,
    "aria-label": `${label}: ${value} of ${max}`,
  };
};

// ============================================================================
// ENHANCED TOGGLE ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive toggle/switch accessibility attributes
 */
export const getToggleA11yProps = (id, label, checked = false) => {
  return {
    id,
    role: "switch",
    "aria-label": label,
    "aria-checked": checked ? "true" : "false",
    tabIndex: 0,
    className: `${getFocusRing()} ${getTouchTarget("recommended")}`,
  };
};

// ============================================================================
// ENHANCED CHECKBOX ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive checkbox accessibility attributes
 */
export const getCheckboxA11yProps = (id, label, options = {}) => {
  const { checked = false, indeterminate = false, required = false } = options;

  const props = {
    id,
    type: "checkbox",
    "aria-label": label,
    "aria-checked": indeterminate ? "mixed" : checked ? "true" : "false",
    className: `${getFocusRing()} ${getTouchTarget("minimum")}`,
  };

  if (required) {
    props["aria-required"] = "true";
  }

  return props;
};

// ============================================================================
// ENHANCED RADIO ACCESSIBILITY
// ============================================================================

/**
 * Get comprehensive radio button accessibility attributes
 */
export const getRadioA11yProps = (id, label, options = {}) => {
  const { checked = false, required = false } = options;

  const props = {
    id,
    type: "radio",
    "aria-label": label,
    "aria-checked": checked ? "true" : "false",
    className: `${getFocusRing()} ${getTouchTarget("minimum")}`,
  };

  if (required) {
    props["aria-required"] = "true";
  }

  return props;
};

// ============================================================================
// KEYBOARD NAVIGATION HELPERS
// ============================================================================

/**
 * Handle keyboard navigation for interactive elements
 */
export const onKeyboardActivate = (callback) => (event) => {
  handleKeyboardNavigation(event, callback);
};

/**
 * Handle arrow key navigation in lists
 */
export const handleArrowKeyNavigation = (
  event,
  items,
  currentIndex,
  setCurrentIndex
) => {
  const { key } = event;

  if (key === "ArrowDown" || key === "ArrowRight") {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    items[nextIndex]?.focus();
  } else if (key === "ArrowUp" || key === "ArrowLeft") {
    event.preventDefault();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    items[prevIndex]?.focus();
  } else if (key === "Home") {
    event.preventDefault();
    setCurrentIndex(0);
    items[0]?.focus();
  } else if (key === "End") {
    event.preventDefault();
    const lastIndex = items.length - 1;
    setCurrentIndex(lastIndex);
    items[lastIndex]?.focus();
  }
};

// ============================================================================
// SCREEN READER ANNOUNCEMENTS
// ============================================================================

/**
 * Announce success message to screen readers
 */
export const announceSuccess = (message) => {
  announceToScreenReader(`Success: ${message}`, "polite");
};

/**
 * Announce error message to screen readers
 */
export const announceError = (message) => {
  announceToScreenReader(`Error: ${message}`, "assertive");
};

/**
 * Announce navigation change to screen readers
 */
export const announceNavigation = (location) => {
  announceToScreenReader(`Navigated to ${location}`, "polite");
};

/**
 * Announce loading state to screen readers
 */
export const announceLoading = (message = "Loading") => {
  announceToScreenReader(`${message}, please wait`, "polite");
};

/**
 * Announce completion to screen readers
 */
export const announceCompletion = (message) => {
  announceToScreenReader(`Completed: ${message}`, "polite");
};

// ============================================================================
// COLOR CONTRAST VALIDATION
// ============================================================================

/**
 * Validate color contrast for WCAG AA compliance
 */
export const validateColorContrast = (
  foreground,
  background,
  isLargeText = false
) => {
  const ratio = getContrastRatio(foreground, background);
  const passes = meetsWCAGAA(ratio, isLargeText);

  return {
    ratio: ratio.toFixed(2),
    passes,
    level: passes ? "AA" : "Fail",
    recommendation: passes
      ? "Color contrast meets WCAG AA standards"
      : `Color contrast ratio ${ratio.toFixed(
          2
        )}:1 does not meet WCAG AA standards. Minimum required: ${
          isLargeText ? "3:1" : "4.5:1"
        }`,
  };
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  getButtonA11yProps,
  getLinkA11yProps,
  getInputA11yProps,
  getErrorA11yProps,
  getCardA11yProps,
  getModalA11yProps,
  getNavA11yProps,
  getBreadcrumbA11yProps,
  getListA11yProps,
  getListItemA11yProps,
  getTabA11yProps,
  getTabPanelA11yProps,
  getTabListA11yProps,
  getTooltipA11yProps,
  getTooltipTriggerA11yProps,
  getLoadingA11yProps,
  getSpinnerA11yProps,
  getAlertA11yProps,
  getMenuA11yProps,
  getMenuItemA11yProps,
  getProgressBarA11yProps,
  getToggleA11yProps,
  getCheckboxA11yProps,
  getRadioA11yProps,
  onKeyboardActivate,
  handleArrowKeyNavigation,
  announceSuccess,
  announceError,
  announceNavigation,
  announceLoading,
  announceCompletion,
  validateColorContrast,
};
