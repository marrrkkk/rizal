import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RizalIntroSlideshow = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    const slides = [
        {
            title: "José Protasio Rizal Mercado y Alonso Realonda",
            subtitle: "The Pride of the Malay Race",
            description: "Born on June 19, 1861, in Calamba, Laguna, Philippines",
            emoji: "🇵🇭",
            gradient: "from-blue-500 via-red-500 to-yellow-500"
        },
        {
            title: "A Brilliant Mind",
            subtitle: "Polymath & Visionary",
            description: "Ophthalmologist, novelist, poet, sculptor, painter, educator, and nationalist",
            emoji: "📚",
            gradient: "from-purple-500 via-pink-500 to-red-500"
        },
        {
            title: "Master of Languages",
            subtitle: "A True Linguist",
            description: "Fluent in 22 languages including Spanish, French, German, and Japanese",
            emoji: "🗣️",
            gradient: "from-green-500 via-teal-500 to-blue-500"
        },
        {
            title: "Literary Genius",
            subtitle: "Noli Me Tángere & El Filibusterismo",
            description: "His novels exposed the injustices of Spanish colonial rule",
            emoji: "✍️",
            gradient: "from-orange-500 via-red-500 to-pink-500"
        },
        {
            title: "National Hero",
            subtitle: "Martyr for Freedom",
            description: "Executed on December 30, 1896, his sacrifice inspired Philippine independence",
            emoji: "⭐",
            gradient: "from-yellow-500 via-orange-500 to-red-500"
        },
        {
            title: "His Legacy Lives On",
            subtitle: "Inspiring Generations",
            description: "Let's explore the extraordinary life of José Rizal",
            emoji: "🎓",
            gradient: "from-indigo-500 via-purple-500 to-pink-500"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev < slides.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    return prev;
                }
            });
        }, 3500); // 3.5 seconds per slide

        return () => clearInterval(timer);
    }, []);

    const handleSkip = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 300);
    };

    const handleContinue = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            handleSkip();
        }
    };

    if (!isVisible) return null;

    const slide = slides[currentSlide];

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90 transition-all duration-1000`}></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* Emoji */}
                <div
                    className="text-9xl mb-8 animate-bounce-slow"
                    style={{
                        animation: 'bounce-slow 2s ease-in-out infinite',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                    }}
                >
                    {slide.emoji}
                </div>

                {/* Title */}
                <h1
                    className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    {slide.title}
                </h1>

                {/* Subtitle */}
                <h2
                    className="text-2xl md:text-4xl font-bold text-white/90 mb-6 drop-shadow-lg animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    {slide.subtitle}
                </h2>

                {/* Description */}
                <p
                    className="text-lg md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto drop-shadow-md animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                >
                    {slide.description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center space-x-3 mb-8">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white w-8'
                                    : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <button
                        onClick={handleContinue}
                        className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-b-4 border-gray-300 active:border-b-2 min-w-[200px]"
                    >
                        {currentSlide < slides.length - 1 ? 'Next →' : 'Start Learning 🚀'}
                    </button>

                    {currentSlide < slides.length - 1 && (
                        <button
                            onClick={handleSkip}
                            className="text-white/80 hover:text-white px-6 py-3 font-semibold text-lg transition-all duration-300 underline decoration-2 underline-offset-4"
                        >
                            Skip Intro
                        </button>
                    )}
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default RizalIntroSlideshow;
