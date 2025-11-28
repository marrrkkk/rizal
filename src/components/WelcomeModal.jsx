import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

const WelcomeModal = ({ isOpen, onClose, username }) => {
  const [currentPage, setCurrentPage] = useState(0);

  console.log('WelcomeModal render:', { isOpen, username });

  useEffect(() => {
    if (isOpen) {
      console.log('✅ WelcomeModal is now OPEN');
    }
  }, [isOpen]);

  const pages = [
    {
      title: "Welcome to Jose Rizal's Journey!",
      content: "Hello, " + username + "! Get ready to discover the incredible life of the Philippines' greatest hero. Jose Rizal was not just a hero - he was a doctor, writer, artist, and a man who loved his country deeply.",
      image: "🇵🇭",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "A Special Child from Calamba",
      content: "Our story begins in a small town called Calamba. On June 19, 1861, a baby boy was born who would change the Philippines forever. His mother, Teodora, was his first teacher. She taught him to read when he was just 3 years old!",
      image: "🏠",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Your Adventure Begins!",
      content: "Explore Rizal's life and discover the importance of his works. Through his writings and bravery, he opened the eyes of Filipinos to the truth about their situation. His courage inspired a nation to fight for freedom and justice.",
      image: "🎮",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const page = pages[currentPage];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" zIndex="z-[100]">
      <div className="overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${page.color} text-white p-8 text-center`}>
          <div className="text-8xl mb-4">{page.image}</div>
          <h2 className="text-3xl font-black mb-2 text-white">{page.title}</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            {page.content}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPage
                  ? 'bg-blue-500 w-8'
                  : 'bg-gray-300'
                  }`}
              ></div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${currentPage === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600 font-medium">
              {currentPage + 1} / {pages.length}
            </div>

            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {currentPage === pages.length - 1 ? "Let's Start! 🚀" : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default WelcomeModal;
