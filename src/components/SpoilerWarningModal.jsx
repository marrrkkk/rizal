import { useEffect } from 'react';

const SpoilerWarningModal = ({ isOpen, onClose, onContinue, chapterNumber }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - lighter */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-20"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Spoiler Alert
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-6">
          You are attempting to access <span className="font-bold text-blue-600">Chapter {chapterNumber}</span> without completing the preceding chapters.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpoilerWarningModal;
