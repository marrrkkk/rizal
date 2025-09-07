// Loading state management for better UX
import { useState, useEffect, useCallback } from "react";

// Global loading state manager
class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = new Set();
  }

  setLoading(key, isLoading, message = "Loading...") {
    const prevState = this.loadingStates.get(key);
    const newState = { isLoading, message, timestamp: Date.now() };

    this.loadingStates.set(key, newState);

    // Notify listeners if state changed
    if (!prevState || prevState.isLoading !== isLoading) {
      this.notifyListeners(key, newState);
    }
  }

  getLoading(key) {
    return (
      this.loadingStates.get(key) || {
        isLoading: false,
        message: "",
        timestamp: 0,
      }
    );
  }

  isAnyLoading() {
    for (const state of this.loadingStates.values()) {
      if (state.isLoading) return true;
    }
    return false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(key, state) {
    this.listeners.forEach((listener) => {
      try {
        listener(key, state);
      } catch (error) {
        console.error("Error in loading state listener:", error);
      }
    });
  }

  clear(key) {
    this.loadingStates.delete(key);
    this.notifyListeners(key, { isLoading: false, message: "", timestamp: 0 });
  }

  clearAll() {
    const keys = Array.from(this.loadingStates.keys());
    this.loadingStates.clear();
    keys.forEach((key) => {
      this.notifyListeners(key, {
        isLoading: false,
        message: "",
        timestamp: 0,
      });
    });
  }
}

// Global instance
export const loadingManager = new LoadingManager();

// React hook for loading states
export const useLoading = (key) => {
  const [state, setState] = useState(() => loadingManager.getLoading(key));

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loadingKey, loadingState) => {
      if (loadingKey === key) {
        setState(loadingState);
      }
    });

    // Update initial state
    setState(loadingManager.getLoading(key));

    return unsubscribe;
  }, [key]);

  const setLoading = useCallback(
    (isLoading, message) => {
      loadingManager.setLoading(key, isLoading, message);
    },
    [key]
  );

  const clearLoading = useCallback(() => {
    loadingManager.clear(key);
  }, [key]);

  return {
    isLoading: state.isLoading,
    message: state.message,
    timestamp: state.timestamp,
    setLoading,
    clearLoading,
  };
};

// Hook for global loading state
export const useGlobalLoading = () => {
  const [isAnyLoading, setIsAnyLoading] = useState(() =>
    loadingManager.isAnyLoading()
  );

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe(() => {
      setIsAnyLoading(loadingManager.isAnyLoading());
    });

    return unsubscribe;
  }, []);

  return isAnyLoading;
};

// Higher-order component for loading states
export const withLoading = (WrappedComponent, loadingKey) => {
  return function LoadingWrapper(props) {
    const { isLoading, message, setLoading, clearLoading } =
      useLoading(loadingKey);

    return (
      <WrappedComponent
        {...props}
        isLoading={isLoading}
        loadingMessage={message}
        setLoading={setLoading}
        clearLoading={clearLoading}
      />
    );
  };
};

// Utility functions for common loading patterns
export const withAsyncLoading = async (
  key,
  asyncFn,
  message = "Loading..."
) => {
  try {
    loadingManager.setLoading(key, true, message);
    const result = await asyncFn();
    return result;
  } finally {
    loadingManager.setLoading(key, false);
  }
};

// Loading state for API calls
export const createApiLoadingWrapper = (apiFunction, loadingKey) => {
  return async (...args) => {
    return withAsyncLoading(
      loadingKey,
      () => apiFunction(...args),
      "Loading..."
    );
  };
};

// Preload resources with loading states
export const preloadWithLoading = async (resources, onProgress) => {
  const total = resources.length;
  let completed = 0;

  const loadingKey = "preload";
  loadingManager.setLoading(
    loadingKey,
    true,
    `Loading resources... (0/${total})`
  );

  try {
    const results = await Promise.allSettled(
      resources.map(async (resource, index) => {
        try {
          const result = await resource.load();
          completed++;

          const message = `Loading resources... (${completed}/${total})`;
          loadingManager.setLoading(loadingKey, true, message);

          if (onProgress) {
            onProgress(completed, total, resource);
          }

          return result;
        } catch (error) {
          completed++;
          console.error(`Failed to load resource ${index}:`, error);
          throw error;
        }
      })
    );

    return results;
  } finally {
    loadingManager.setLoading(loadingKey, false);
  }
};

// Debounced loading state
export const useDebouncedLoading = (key, delay = 300) => {
  const {
    isLoading,
    message,
    setLoading: originalSetLoading,
    clearLoading,
  } = useLoading(key);
  const [debouncedLoading, setDebouncedLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isLoading) {
      // Show loading immediately when starting
      setDebouncedLoading(true);
    } else {
      // Delay hiding loading to prevent flicker
      timeoutId = setTimeout(() => {
        setDebouncedLoading(false);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  const setLoading = useCallback(
    (loading, msg) => {
      if (loading) {
        // Clear any pending hide timeout
        setDebouncedLoading(true);
      }
      originalSetLoading(loading, msg);
    },
    [originalSetLoading]
  );

  return {
    isLoading: debouncedLoading,
    message,
    setLoading,
    clearLoading,
  };
};

// Loading state for form submissions
export const useFormLoading = (formKey) => {
  const { isLoading, setLoading, clearLoading } = useLoading(`form-${formKey}`);

  const submitWithLoading = useCallback(
    async (submitFn, successMessage = "Success!") => {
      try {
        setLoading(true, "Submitting...");
        const result = await submitFn();

        // Brief success state
        setLoading(true, successMessage);
        setTimeout(() => clearLoading(), 1000);

        return result;
      } catch (error) {
        clearLoading();
        throw error;
      }
    },
    [setLoading, clearLoading]
  );

  return {
    isLoading,
    submitWithLoading,
    clearLoading,
  };
};

// Performance monitoring for loading states
export const createLoadingPerformanceMonitor = () => {
  const metrics = new Map();

  const startTiming = (key) => {
    metrics.set(key, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    });
  };

  const endTiming = (key) => {
    const metric = metrics.get(key);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
    }
  };

  const getMetrics = (key) => {
    return metrics.get(key);
  };

  const getAllMetrics = () => {
    return Object.fromEntries(metrics);
  };

  const clearMetrics = () => {
    metrics.clear();
  };

  return {
    startTiming,
    endTiming,
    getMetrics,
    getAllMetrics,
    clearMetrics,
  };
};

export const performanceMonitor = createLoadingPerformanceMonitor();
