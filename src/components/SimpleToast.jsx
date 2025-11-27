import { useEffect } from 'react';

const SimpleToast = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000,
  actionLabel = null,
  onAction = null 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0 && !actionLabel) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, actionLabel]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] transition-all duration-300 ease-in-out max-w-[calc(100vw-2rem)]"
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-2xl w-full sm:max-w-md">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        
        {actionLabel && onAction && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                onAction();
                onClose();
              }}
              className="bg-white text-yellow-600 hover:bg-yellow-50 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleToast;
