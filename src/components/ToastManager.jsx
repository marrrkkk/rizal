import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import ToastNotification from "./ToastNotification";

const ToastManager = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      addToast,
      removeToast,
      clearAllToasts,
    }),
    [addToast, removeToast, clearAllToasts]
  );

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 80}px)`,
            zIndex: 1000 - index,
          }}
          className="fixed top-4 right-4"
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            icon={toast.icon}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
});

ToastManager.displayName = "ToastManager";

// Hook to use toast notifications
export const useToast = () => {
  const [toastManager, setToastManager] = useState(null);

  const showToast = useCallback(
    (message, type = "success", options = {}) => {
      if (toastManager) {
        return toastManager.addToast({
          message,
          type,
          duration: options.duration || 3000,
          icon: options.icon,
        });
      }
    },
    [toastManager]
  );

  const showSuccess = useCallback(
    (message, options = {}) => {
      return showToast(message, "success", options);
    },
    [showToast]
  );

  const showError = useCallback(
    (message, options = {}) => {
      return showToast(message, "error", options);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return showToast(message, "info", options);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return showToast(message, "warning", options);
    },
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    setToastManager,
  };
};

export default ToastManager;
