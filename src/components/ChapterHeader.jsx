import { useNavigate } from 'react-router-dom';

export default function ChapterHeader({
    chapterNumber,
    chapterTitle,
    totalLessons,
    onLogout,
    themeColor = 'blue', // blue, orange, green, pink, purple, red
    icon = null // emoji icon for the chapter
}) {
    const navigate = useNavigate();

    const colorClasses = {
        blue: {
            gradient: 'from-blue-500 to-indigo-600',
            border: 'border-blue-400',
            bg: 'bg-blue-500',
            hover: 'hover:bg-blue-600'
        },
        orange: {
            gradient: 'from-orange-500 to-amber-600',
            border: 'border-orange-400',
            bg: 'bg-orange-500',
            hover: 'hover:bg-orange-600'
        },
        green: {
            gradient: 'from-green-500 to-emerald-600',
            border: 'border-green-400',
            bg: 'bg-green-500',
            hover: 'hover:bg-green-600'
        },
        pink: {
            gradient: 'from-pink-500 to-rose-600',
            border: 'border-pink-400',
            bg: 'bg-pink-500',
            hover: 'hover:bg-pink-600'
        },
        purple: {
            gradient: 'from-purple-500 to-indigo-600',
            border: 'border-purple-400',
            bg: 'bg-purple-500',
            hover: 'hover:bg-purple-600'
        },
        red: {
            gradient: 'from-red-500 to-pink-600',
            border: 'border-red-400',
            bg: 'bg-red-500',
            hover: 'hover:bg-red-600'
        }
    };

    const colors = colorClasses[themeColor] || colorClasses.blue;

    return (
        <header className={`bg-white shadow-lg sticky top-0 z-50 border-b-4 ${colors.border}`}>
            <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section - Back Button */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="group relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
                            title="Back to Home"
                        >
                            <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 group-hover:text-gray-900 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Back to Home
                            </div>
                        </button>

                        {/* Chapter Info */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center shadow-lg border-3 border-white`}>
                                {icon ? (
                                    <span className="text-2xl sm:text-3xl">{icon}</span>
                                ) : (
                                    <span className="text-white font-bold text-xl sm:text-2xl">{chapterNumber}</span>
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                                    {chapterTitle}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-700 font-semibold">
                                    {totalLessons} lessons • Chapter {chapterNumber}
                                </p>
                            </div>
                            {/* Mobile Title */}
                            <div className="block sm:hidden">
                                <h1 className="text-base font-black text-gray-900 leading-tight">
                                    {chapterTitle}
                                </h1>
                                <p className="text-xs text-gray-700 font-semibold">
                                    {totalLessons} lessons
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Home Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="group relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
                            title="Home"
                        >
                            <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 group-hover:text-gray-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Home
                            </div>
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={onLogout}
                            className="group relative flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl border-b-2 border-red-700 active:border-b-0 active:translate-y-0.5"
                            title="Logout"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span className="hidden sm:inline">Exit</span>
                            <span className="sm:hidden text-xs">Exit</span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Logout
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Chapter Title - Full Width */}
                <div className="block sm:hidden mt-3 text-center">
                    <h2 className="text-base font-bold text-gray-800">{chapterTitle}</h2>
                </div>
            </div>
        </header>
    );
}
