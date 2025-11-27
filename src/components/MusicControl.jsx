import { useState, useEffect } from 'react';
import chapterMusicPlayer from '../utils/chapterMusic';

export default function MusicControl({ chapterId }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(30);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    useEffect(() => {
        // Auto-play music when component mounts
        // Note: This might be blocked by browser autoplay policies
        chapterMusicPlayer.play(chapterId);
        setIsPlaying(true);

        // Cleanup: stop music when component unmounts
        return () => {
            chapterMusicPlayer.stop();
        };
    }, [chapterId]);

    const toggleMusic = () => {
        if (isPlaying) {
            chapterMusicPlayer.pause();
            setIsPlaying(false);
        } else {
            chapterMusicPlayer.resume();
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        chapterMusicPlayer.setVolume(newVolume / 100);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white rounded-full shadow-2xl border-4 border-green-400 p-2 flex items-center gap-2">
                {/* Music toggle button */}
                <button
                    onClick={toggleMusic}
                    className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
                    title={isPlaying ? 'Pause Music' : 'Play Music'}
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Volume control button */}
                <button
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                    title="Volume Control"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                </button>

                {/* Volume slider */}
                {showVolumeSlider && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-gray-700">Volume</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                style={{
                                    writingMode: 'bt-lr',
                                    WebkitAppearance: 'slider-vertical',
                                    height: '100px',
                                    width: '8px'
                                }}
                            />
                            <span className="text-xs font-semibold text-green-600">{volume}%</span>
                        </div>
                    </div>
                )}

                {/* Music note animation */}
                {isPlaying && (
                    <div className="flex items-center gap-1 px-2">
                        <span className="text-green-500 animate-bounce text-sm">♪</span>
                        <span className="text-green-500 animate-bounce text-sm" style={{ animationDelay: '0.2s' }}>♫</span>
                    </div>
                )}
            </div>
        </div>
    );
}
