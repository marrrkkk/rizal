import { useState, useEffect } from "react";

const BaseModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-4xl",
  showCloseButton = false,
  zIndex = "z-50",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('BaseModal opening...');
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) {
    console.log('BaseModal: isOpen is false, not rendering');
    return null;
  }
  
  console.log('BaseModal: Rendering with isVisible:', isVisible);

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center ${zIndex} p-4 animate-fade-in overflow-y-auto`}>
      <div
        className={`transform transition-all duration-500 my-auto ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-10"
        }`}
      >
        <div className={`bg-white rounded-3xl shadow-2xl ${maxWidth} w-full border-4 border-green-200 relative`}>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
