import { useNavigate } from "react-router-dom"

export default function Home({ username, onLogout }) {
  const navigate = useNavigate()

  const chapters = [
    {
      id: 1,
      title: "Childhood in Calamba",
      description: "Discover young Jose's early years",
      color: "from-blue-400 to-blue-600",
      icon: "🏠",
      path: "/chapter/1",
    },
    {
      id: 2,
      title: "Education in Manila",
      description: "Follow his school adventures",
      color: "from-amber-400 to-orange-500",
      icon: "📚",
      path: "/chapter/2",
    },
    {
      id: 3,
      title: "Studies Abroad",
      description: "Journey across the world",
      color: "from-emerald-400 to-green-600",
      icon: "✈️",
      path: "/chapter/3",
    },
    {
      id: 4,
      title: "Noli Me Tangere",
      description: "The story behind his famous book",
      color: "from-pink-400 to-rose-500",
      icon: "📖",
      path: "/chapter/4",
    },
    {
      id: 5,
      title: "Return to the Philippines",
      description: "Coming back to help his country",
      color: "from-purple-400 to-indigo-500",
      icon: "🇵🇭",
      path: "/chapter/5",
    },
    {
      id: 6,
      title: "Exile and Legacy",
      description: "His final years and lasting impact",
      color: "from-red-400 to-pink-500",
      icon: "⭐",
      path: "/chapter/6",
    },
  ]

  const handleChapterClick = (chapter) => {
    if (chapter.id === 1 || chapter.id === 2 || chapter.id === 3 || chapter.id === 4) {
      navigate(chapter.path)
    } else {
      alert("This chapter will be available soon!")
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {username}!</h1>
              <p className="text-sm text-gray-600">Ready to learn about our national hero?</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-4xl">👨‍🎓</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Jose Rizal's Life Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the amazing life of the Philippines' greatest hero through interactive chapters
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Your Learning Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-0 transition-all duration-500"></div>
          </div>
        </div>

        {/* Chapters Grid - Fixed to 3x2 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleChapterClick(chapter)}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              {/* Chapter Number Badge */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-gray-700">{chapter.id}</span>
              </div>

              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${chapter.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{chapter.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {chapter.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{chapter.description}</p>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Chapter {chapter.id}
                  </span>
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${chapter.color} rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Fun Facts Section */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Did You Know?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">22</span>
              </div>
              <p className="text-sm text-gray-600">Languages Jose Rizal could speak</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">Famous novels he wrote</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">35</span>
              </div>
              <p className="text-sm text-gray-600">Years old when he died</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
