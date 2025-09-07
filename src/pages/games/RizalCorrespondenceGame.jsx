import { useState, useEffect } from "react";
import GameHeader from "../../components/GameHeader";
import { filipinoTheme } from "../../theme/theme";

export default function RizalCorrespondenceGame({
  username,
  onLogout,
  onComplete,
}) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [letterComplete, setLetterComplete] = useState(false);

  const letters = [
    {
      id: 1,
      recipient: "Blumentritt",
      context: "Writing to your Austrian friend about your life in Dapitan",
      date: "1893",
      questions: [
        {
          id: 1,
          prompt: "How should you describe your daily routine in Dapitan?",
          options: [
            {
              text: "I am miserable and lonely in this exile",
              points: 0,
              feedback:
                "Rizal maintained a positive outlook despite his exile.",
            },
            {
              text: "I keep myself busy with teaching, medicine, and research",
              points: 10,
              feedback: "Correct! Rizal was very productive during his exile.",
            },
            {
              text: "I spend my days planning revenge against the Spanish",
              points: 0,
              feedback: "Rizal advocated for peaceful reform, not revenge.",
            },
          ],
        },
        {
          id: 2,
          prompt: "What should you mention about your scientific work?",
          options: [
            {
              text: "I have discovered several new species of animals",
              points: 10,
              feedback:
                "Yes! Rizal discovered new species and sent specimens to European museums.",
            },
            {
              text: "I have given up on scientific pursuits",
              points: 0,
              feedback:
                "Rizal continued his scientific work throughout his exile.",
            },
            {
              text: "Science is not important compared to politics",
              points: 0,
              feedback: "Rizal valued both science and reform equally.",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      recipient: "Family",
      context: "Writing to your family about your well-being and activities",
      date: "1894",
      questions: [
        {
          id: 1,
          prompt: "How should you reassure your family about your health?",
          options: [
            {
              text: "I am in excellent health and spirits",
              points: 10,
              feedback:
                "Correct! Rizal often reassured his family about his well-being.",
            },
            {
              text: "I am suffering greatly from various illnesses",
              points: 0,
              feedback:
                "While Rizal had some health issues, he didn't want to worry his family unnecessarily.",
            },
            {
              text: "My health is none of your concern",
              points: 0,
              feedback:
                "Rizal was always caring and considerate toward his family.",
            },
          ],
        },
        {
          id: 2,
          prompt: "What should you tell them about your students?",
          options: [
            {
              text: "The local children are eager to learn and making good progress",
              points: 10,
              feedback: "Perfect! Rizal was proud of his students' progress.",
            },
            {
              text: "The children here are too lazy to learn anything",
              points: 0,
              feedback:
                "Rizal believed in the potential of all children to learn.",
            },
            {
              text: "I don't have time to teach anyone",
              points: 0,
              feedback:
                "Teaching was one of Rizal's main activities in Dapitan.",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      recipient: "Josephine Bracken",
      context: "Writing to your beloved about your feelings and future plans",
      date: "1895",
      questions: [
        {
          id: 1,
          prompt: "How should you express your feelings?",
          options: [
            {
              text: "My love for you grows stronger each day despite our separation",
              points: 10,
              feedback:
                "Beautiful! This reflects Rizal's romantic and sincere nature.",
            },
            {
              text: "I have forgotten about you completely",
              points: 0,
              feedback: "Rizal deeply loved Josephine Bracken.",
            },
            {
              text: "Love is a distraction from my mission",
              points: 0,
              feedback: "Rizal believed love and duty could coexist.",
            },
          ],
        },
        {
          id: 2,
          prompt: "What should you say about your future together?",
          options: [
            {
              text: "I dream of the day we can be together in a free Philippines",
              points: 10,
              feedback:
                "Excellent! This combines his personal and patriotic aspirations.",
            },
            {
              text: "We should flee the Philippines together",
              points: 0,
              feedback: "Rizal was committed to serving his country.",
            },
            {
              text: "I cannot promise you anything",
              points: 0,
              feedback:
                "Despite uncertainties, Rizal was hopeful about the future.",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      recipient: "Governor General",
      context: "Requesting permission to serve as a military doctor in Cuba",
      date: "1896",
      questions: [
        {
          id: 1,
          prompt: "How should you present your request?",
          options: [
            {
              text: "I humbly request to serve Spain as a military doctor in Cuba",
              points: 10,
              feedback:
                "Correct! Rizal was respectful and formal in official correspondence.",
            },
            {
              text: "I demand to be released from this exile immediately",
              points: 0,
              feedback: "Rizal was always diplomatic, never demanding.",
            },
            {
              text: "I refuse to serve Spain in any capacity",
              points: 0,
              feedback:
                "Rizal actually volunteered to serve as a doctor in Cuba.",
            },
          ],
        },
        {
          id: 2,
          prompt: "What should you emphasize about your qualifications?",
          options: [
            {
              text: "My medical training and experience treating patients in Dapitan",
              points: 10,
              feedback:
                "Perfect! Rizal highlighted his relevant medical experience.",
            },
            {
              text: "My political connections in Europe",
              points: 0,
              feedback:
                "This would not be appropriate for a medical position request.",
            },
            {
              text: "My desire to escape the Philippines",
              points: 0,
              feedback:
                "Rizal framed his request as service to Spain, not escape.",
            },
          ],
        },
      ],
    },
  ];

  const handleOptionSelect = (questionId, optionIndex) => {
    const key = `${currentLetter}-${questionId}`;
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: optionIndex,
    }));
  };

  const submitLetter = () => {
    const letter = letters[currentLetter];
    let letterScore = 0;

    letter.questions.forEach((question) => {
      const key = `${currentLetter}-${question.id}`;
      const selectedIndex = selectedOptions[key];
      if (selectedIndex !== undefined) {
        letterScore += question.options[selectedIndex].points;
      }
    });

    setScore((prev) => prev + letterScore);
    setShowFeedback(true);
    setLetterComplete(true);
  };

  const nextLetter = () => {
    if (currentLetter < letters.length - 1) {
      setCurrentLetter((prev) => prev + 1);
      setShowFeedback(false);
      setLetterComplete(false);
    } else {
      setGameComplete(true);
      onComplete(score);
    }
  };

  const getCurrentLetter = () => letters[currentLetter];
  const isLetterComplete = () => {
    const letter = getCurrentLetter();
    return letter.questions.every((question) => {
      const key = `${currentLetter}-${question.id}`;
      return selectedOptions[key] !== undefined;
    });
  };

  const getScoreMessage = () => {
    const maxScore = letters.length * 20; // 2 questions per letter, 10 points each
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90)
      return "Outstanding! You've mastered the art of correspondence like Rizal! 🌟";
    if (percentage >= 75)
      return "Excellent! Your letters show great wisdom and diplomacy! 📝";
    if (percentage >= 60)
      return "Good work! You understand Rizal's communication style well! 👍";
    return "Keep practicing! Letter writing is an art that improves with time! 💪";
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <GameHeader
          title="Rizal's Correspondence"
          level={3}
          chapter={5}
          score={score}
          onBack={() => window.history.back()}
          onLogout={onLogout}
          username={username}
          theme="amber"
        />

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Correspondence Complete!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You've successfully written {letters.length} letters as José
              Rizal!
            </p>

            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <div className="text-2xl font-bold text-amber-800 mb-2">
                Final Score: {score} / {letters.length * 20}
              </div>
              <div className="text-amber-700">
                {Math.round((score / (letters.length * 20)) * 100)}% Accuracy
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-800">{getScoreMessage()}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors mr-4"
              >
                Write Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Chapter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const letter = getCurrentLetter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <GameHeader
        title="Rizal's Correspondence"
        level={3}
        chapter={5}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="amber"
      />

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Letter Progress
            </span>
            <span className="text-sm font-medium text-amber-700">
              {currentLetter + 1} / {letters.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-amber-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentLetter + 1) / letters.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Letter Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="border-l-4 border-amber-500 pl-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Letter to {letter.recipient}
            </h2>
            <p className="text-gray-600 mb-2">{letter.context}</p>
            <p className="text-sm text-gray-500">Date: {letter.date}</p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {letter.questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="border rounded-xl p-6 bg-amber-50/50"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {question.prompt}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const key = `${currentLetter}-${question.id}`;
                    const isSelected = selectedOptions[key] === oIndex;
                    const showResult = showFeedback && isSelected;

                    return (
                      <div
                        key={oIndex}
                        onClick={() =>
                          !letterComplete &&
                          handleOptionSelect(question.id, oIndex)
                        }
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? showResult
                              ? option.points > 0
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                              : "border-amber-500 bg-amber-50"
                            : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                        } ${letterComplete ? "cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 ${
                              isSelected
                                ? "border-amber-500 bg-amber-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800">{option.text}</p>
                            {showResult && (
                              <div
                                className={`mt-2 text-sm ${
                                  option.points > 0
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {option.feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">Score: {score} points</div>

            <div className="space-x-4">
              {!letterComplete ? (
                <button
                  onClick={submitLetter}
                  disabled={!isLetterComplete()}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isLetterComplete()
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send Letter
                </button>
              ) : (
                <button
                  onClick={nextLetter}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentLetter < letters.length - 1
                    ? "Next Letter"
                    : "Complete Game"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
