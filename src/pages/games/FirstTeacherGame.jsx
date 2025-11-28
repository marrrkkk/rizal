"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScenePlaceholder } from "../../components/PlaceholderImage";

export default function FirstTeacherGame({ username, onLogout, onComplete }) {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);


  // Quiz Game State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Lesson Simulation State
  const [lessonProgress, setLessonProgress] = useState(0);
  const [currentLessonStep, setCurrentLessonStep] = useState(0);

  // Letter Tracing State
  const [tracedLetters, setTracedLetters] = useState([]);
  const [currentLetter, setCurrentLetter] = useState(0);

  // Reading Practice State
  const [readingAnswers, setReadingAnswers] = useState({});

  const games = [
    {
      id: 0,
      type: "quiz",
      title: "Jose's First Teacher",
      question: "Who was Jose Rizal's first teacher?",
      options: [
        "A school teacher",
        "His father Francisco",
        "His mother Teodora",
        "His brother Paciano",
      ],
      correct: 2,
    },
    {
      id: 1,
      type: "lesson",
      title: "A Day with Mother Teodora",
      steps: [
        {
          id: 1,
          instruction: "Good morning, Jose! Let's start with our prayers.",
          action: "Click to pray with Jose",
          emoji: "🙏",
          scene: "prayer",
        },
        {
          id: 2,
          instruction: "Now, let's practice reading this story together.",
          action: "Click to read with Jose",
          emoji: "📖",
          scene: "reading",
        },
        {
          id: 3,
          instruction: "Very good! Now let's practice writing letters.",
          action: "Click to write with Jose",
          emoji: "✍️",
          scene: "writing",
        },
        {
          id: 4,
          instruction:
            "Excellent work! Let's end with a story about good values.",
          action: "Click to listen to the story",
          emoji: "📚",
          scene: "storytelling",
        },
      ],
    },
    {
      id: 2,
      type: "tracing",
      title: "Learn to Write Like Jose",
      letters: [
        { letter: "J", instruction: "Trace the letter J for Jose" },
        { letter: "O", instruction: "Trace the letter O" },
        { letter: "S", instruction: "Trace the letter S" },
        { letter: "E", instruction: "Trace the letter E" },
      ],
    },
    {
      id: 3,
      type: "reading",
      title: "Reading Comprehension",
      story:
        "Jose's mother, Teodora, was a very smart woman. She taught Jose to read when he was only three years old. Every morning, they would sit together under the mango tree. Teodora would point to letters and words, and Jose would repeat them. She was patient and kind, always encouraging Jose to learn more.",
      questions: [
        {
          question: "How old was Jose when he learned to read?",
          options: ["Two years old", "Three years old", "Four years old"],
          correct: 1,
        },
        {
          question: "Where did they have their lessons?",
          options: ["In the house", "Under the mango tree", "At school"],
          correct: 1,
        },
        {
          question: "What kind of teacher was Teodora?",
          options: ["Strict and harsh", "Patient and kind", "Busy and rushed"],
          correct: 1,
        },
      ],
    },
  ];

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowQuizResult(true);

    setTimeout(() => {
      if (answerIndex === games[currentGame].correct) {
        setScore(score + 25);
        nextGame();
      } else {
        setSelectedAnswer(null);
        setShowQuizResult(false);
      }
    }, 2000);
  };

  const handleLessonStep = () => {
    if (currentLessonStep < games[1].steps.length - 1) {
      setCurrentLessonStep(currentLessonStep + 1);
      setScore(score + 15);
    } else {
      setScore(score + 15);
      setTimeout(() => nextGame(), 1000);
    }
  };

  const handleLetterTrace = (letterIndex) => {
    if (!tracedLetters.includes(letterIndex)) {
      setTracedLetters([...tracedLetters, letterIndex]);
      setScore(score + 10);

      if (tracedLetters.length + 1 === games[2].letters.length) {
        setTimeout(() => nextGame(), 1000);
      }
    }
  };

  const handleReadingAnswer = (questionIndex, answerIndex) => {
    // Don't allow re-answering
    if (readingAnswers[questionIndex] !== undefined) {
      return;
    }

    console.log('Reading answer clicked:', questionIndex, answerIndex);
    
    const newAnswers = { ...readingAnswers, [questionIndex]: answerIndex };
    setReadingAnswers(newAnswers);

    const question = games[3].questions[questionIndex];
    console.log('Question correct answer:', question.correct, 'Selected:', answerIndex);
    
    if (answerIndex === question.correct) {
      const newScore = score + 20;
      console.log('Correct! New score:', newScore);
      setScore(newScore);
    } else {
      console.log('Wrong answer!');
    }

    // Check if all questions are answered
    if (Object.keys(newAnswers).length === games[3].questions.length) {
      console.log('All questions answered! Checking if all correct...');
      const allCorrect = games[3].questions.every(
        (q, index) => newAnswers[index] === q.correct
      );
      console.log('All correct?', allCorrect);
      
      // Move to next game regardless of correctness after a delay
      setTimeout(() => {
        console.log('Moving to next game...');
        nextGame();
      }, 1500);
    }
  };

  const nextGame = () => {
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setCurrentLessonStep(0);
      setReadingAnswers({});
    } else {
      setGameCompleted(true);
      // Call onComplete when all games are finished
      if (onComplete) {
        onComplete(score, 0, { attempts: 1, hintsUsed: 0 });
      }
    }
  };

  const handleBackToChapter = () => {
    navigate("/chapter/1");
  };

  const renderQuizGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {game.question}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {game.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleQuizAnswer(index)}
            disabled={showQuizResult}
            className={`p-6 rounded-2xl border-4 transition-all duration-200 text-left font-semibold cursor-pointer ${
              showQuizResult
                ? index === game.correct
                  ? "bg-green-100 border-green-400 text-green-800"
                  : index === selectedAnswer
                  ? "bg-red-100 border-red-400 text-red-800"
                  : "bg-gray-100 border-gray-300 text-gray-800"
                : selectedAnswer === index
                ? "bg-rose-100 border-rose-400 text-rose-800"
                : "bg-white border-gray-300 text-gray-800 hover:bg-rose-50 hover:border-rose-400 hover:scale-105 shadow-md active:scale-95"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                  showQuizResult
                    ? index === game.correct
                      ? "bg-green-500 text-white"
                      : index === selectedAnswer
                      ? "bg-red-500 text-white"
                      : "bg-gray-400 text-white"
                    : selectedAnswer === index
                    ? "bg-rose-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg text-gray-800">{option}</span>
            </div>
          </button>
        ))}
      </div>
      {showQuizResult && (
        <div className="mt-6 text-center">
          {selectedAnswer === game.correct ? (
            <div className="text-green-600 font-semibold">
              Correct! Teodora was Jose's first teacher! 👩‍🏫
            </div>
          ) : (
            <div className="text-red-600 font-semibold">
              Try again! Think about Jose's family! 💭
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderLessonGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Experience a lesson with Mother Teodora
      </h3>

      <div className="text-center mb-8">
        <div className="inline-block bg-rose-100 rounded-full px-4 py-2 mb-4">
          <span className="text-rose-800 font-medium">
            Step {currentLessonStep + 1} of {game.steps.length}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-md mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👩</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Mother Teodora
                  </h4>
                  <p className="text-sm text-gray-600">Jose's First Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "{game.steps[currentLessonStep].instruction}"
              </p>
            </div>

            <button
              onClick={handleLessonStep}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-500 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              {game.steps[currentLessonStep].action}
            </button>
          </div>

          <div className="flex-shrink-0">
            <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl shadow-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {game.steps[currentLessonStep].emoji}
                </div>
                <div className="text-sm text-gray-600 px-4">
                  {game.steps[currentLessonStep].scene
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                    "Learning Scene"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2">
        {game.steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index <= currentLessonStep ? "bg-rose-400" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );

  const renderTracingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Practice writing letters like Jose did
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {game.letters.map((letterData, index) => (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-3">
              <div
                className={`w-24 h-24 mx-auto rounded-xl flex items-center justify-center text-6xl font-bold cursor-pointer transition-all duration-300 ${
                  tracedLetters.includes(index)
                    ? "bg-green-200 text-green-800 scale-110"
                    : "bg-white hover:bg-yellow-100 text-gray-600 hover:scale-105"
                }`}
                onClick={() => handleLetterTrace(index)}
              >
                {letterData.letter}
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {letterData.instruction}
            </p>
            {tracedLetters.includes(index) && (
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Great job! ✓
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block bg-yellow-100 rounded-full px-4 py-2">
          <span className="text-yellow-800 font-medium">
            Letters traced: {tracedLetters.length} / {game.letters.length}
          </span>
        </div>
      </div>
    </div>
  );

  const renderReadingGame = (game) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Read and answer questions
      </h3>

      {/* Story */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">📖</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">Story Time</h4>
        </div>
        <p className="text-gray-700 leading-relaxed">{game.story}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {game.questions.map((question, qIndex) => (
          <div key={`q-${qIndex}-${readingAnswers[qIndex] || 'unanswered'}`} className="bg-white rounded-xl p-6 shadow-md">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">
              {qIndex + 1}. {question.question}
            </h5>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, oIndex) => {
                const isSelected = readingAnswers[qIndex] === oIndex;
                const isCorrect = oIndex === question.correct;
                const isAnswered = readingAnswers[qIndex] !== undefined;
                
                return (
                  <button
                    key={oIndex}
                    onClick={() => handleReadingAnswer(qIndex, oIndex)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-left transition-all duration-200 font-medium ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-100 border-2 border-green-400 text-green-800 cursor-default"
                          : "bg-red-100 border-2 border-red-400 text-red-800 cursor-default"
                        : isAnswered
                        ? "bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    const game = games[currentGame];
    switch (game.type) {
      case "quiz":
        return renderQuizGame(game);
      case "lesson":
        return renderLessonGame(game);
      case "tracing":
        return renderTracingGame(game);
      case "reading":
        return renderReadingGame(game);
      default:
        return null;
    }
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-2xl mx-auto">

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Learning Champion!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              You've learned about Jose's first teacher, his mother Teodora! You
              discovered how she taught him to read, write, and become the
              brilliant person he was destined to be.
            </p>
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-2xl p-6 mb-8">
              <div className="text-3xl font-bold">Final Score: {score}/100</div>
              <div className="text-rose-100 mt-2">
                Wonderful learning, {username}!
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleBackToChapter}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                Back to Chapter 1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 relative overflow-hidden">
      {/* Duolingo-style floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-10"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-rose-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-pink-300 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-red-300 rounded-full opacity-10"></div>
      </div>

      {/* Duolingo-style Header */}
      <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-rose-400">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToChapter}
              className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-b-2 border-gray-700 active:border-b-0"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-bold text-xl">👩‍🏫</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800">
                  First Teacher
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Level 4 • Chapter 1
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/90 rounded-full px-4 py-2 shadow-md border-2 border-rose-200">
              <span className="text-rose-600 font-bold">Score: {score}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-200 shadow-lg border-b-2 border-red-700 active:border-b-0"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-rose-600">
                {currentGame + 1}/{games.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentGame + 1) / games.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-rose-200">
            <div className="text-6xl mb-4">👩‍🏫</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              {games[currentGame].title}
            </h2>
            <p className="text-gray-600 font-medium">
              Learning with Mother Teodora
            </p>
          </div>
        </div>

        {/* Current Game */}
        {renderCurrentGame()}

        {/* Educational Fact */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  About Teodora
                </h3>
                <p className="text-gray-600">Jose's amazing first teacher</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">👩‍🎓</span>
                  <span className="font-bold text-gray-800">
                    Educated Woman
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  She could read and write in Spanish and Tagalog
                </p>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">❤️</span>
                  <span className="font-bold text-gray-800">
                    Patient & Kind
                  </span>
                </div>
                <p className="text-gray-700 text-sm">
                  Known for her gentle teaching methods
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
