// Performance optimization utilities for mobile devices

// Lazy loading utility
export const createLazyLoader = (threshold = 0.1) => {
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const src = element.dataset.src;

          if (src) {
            element.src = src;
            element.removeAttribute("data-src");
          }

          // Trigger custom event for component lazy loading
          element.dispatchEvent(new CustomEvent("lazyload"));
        }
      });
    },
    { threshold }
  );
};

// Image optimization utility
export const optimizeImage = (src, options = {}) => {
  const {
    width = "auto",
    height = "auto",
    quality = 80,
    format = "webp",
  } = options;

  // For now, return the original src
  // In a real app, this would integrate with an image optimization service
  return src;
};

// Debounce utility for performance
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory management utilities
export const cleanupEventListeners = (element, events) => {
  events.forEach(({ event, handler }) => {
    element.removeEventListener(event, handler);
  });
};

// Preload critical resources
export const preloadResource = (href, as = "script", crossorigin = null) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;

  if (crossorigin) {
    link.crossOrigin = crossorigin;
  }

  document.head.appendChild(link);
};

// Check if device has limited resources
export const isLowEndDevice = () => {
  // Check for various indicators of low-end devices
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;

  // Device has limited memory (less than 4GB)
  if (memory && memory < 4) return true;

  // Device has few CPU cores
  if (cores && cores < 4) return true;

  // Slow network connection
  if (
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g")
  ) {
    return true;
  }

  return false;
};

// Optimize animations for low-end devices
export const getOptimizedAnimationClasses = (
  normalClasses,
  reducedClasses = ""
) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isLowEnd = isLowEndDevice();

  if (prefersReducedMotion || isLowEnd) {
    return reducedClasses;
  }

  return normalClasses;
};

// Virtual scrolling utility for large lists
export class VirtualScroller {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.items = [];
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.scrollTop = 0;

    this.handleScroll = throttle(this.updateVisibleItems.bind(this), 16);
    this.container.addEventListener("scroll", this.handleScroll);
  }

  setItems(items) {
    this.items = items;
    this.updateVisibleItems();
  }

  updateVisibleItems() {
    const containerHeight = this.container.clientHeight;
    const scrollTop = this.container.scrollTop;

    this.visibleStart = Math.floor(scrollTop / this.itemHeight);
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(containerHeight / this.itemHeight) + 1,
      this.items.length
    );

    this.render();
  }

  render() {
    const visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);
    const offsetY = this.visibleStart * this.itemHeight;

    // Clear container
    this.container.innerHTML = "";

    // Create wrapper with proper height
    const wrapper = document.createElement("div");
    wrapper.style.height = `${this.items.length * this.itemHeight}px`;
    wrapper.style.position = "relative";

    // Create visible items container
    const itemsContainer = document.createElement("div");
    itemsContainer.style.transform = `translateY(${offsetY}px)`;

    // Render visible items
    visibleItems.forEach((item, index) => {
      const element = this.renderItem(item, this.visibleStart + index);
      itemsContainer.appendChild(element);
    });

    wrapper.appendChild(itemsContainer);
    this.container.appendChild(wrapper);
  }

  destroy() {
    this.container.removeEventListener("scroll", this.handleScroll);
  }
}

// Resource loading priority utility
export const loadResourceWithPriority = async (url, priority = "low") => {
  if ("requestIdleCallback" in window && priority === "low") {
    return new Promise((resolve, reject) => {
      requestIdleCallback(async () => {
        try {
          const response = await fetch(url);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return fetch(url);
};

// Battery API utility for performance optimization
export const getBatteryInfo = async () => {
  if ("getBattery" in navigator) {
    try {
      const battery = await navigator.getBattery();
      return {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      console.warn("Battery API not available:", error);
      return null;
    }
  }
  return null;
};

// Adaptive loading based on device capabilities
export const getAdaptiveLoadingStrategy = async () => {
  const isLowEnd = isLowEndDevice();
  const battery = await getBatteryInfo();
  const connection = navigator.connection;

  let strategy = "normal";

  if (isLowEnd) {
    strategy = "minimal";
  } else if (battery && !battery.charging && battery.level < 0.2) {
    strategy = "power-saving";
  } else if (
    connection &&
    (connection.effectiveType === "2g" ||
      connection.effectiveType === "slow-2g")
  ) {
    strategy = "data-saving";
  }

  return {
    strategy,
    shouldPreloadImages: strategy === "normal",
    shouldUseAnimations: strategy === "normal",
    shouldLoadNonCriticalResources: strategy === "normal",
    maxConcurrentRequests:
      strategy === "minimal" ? 2 : strategy === "power-saving" ? 3 : 6,
  };
};
