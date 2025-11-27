import { useState, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GameHeader from "../../components/GameHeader";
import EducationalFact from "../../components/EducationalFact";
import { CharacterPlaceholder } from "../../components/PlaceholderImage";

export default function CharacterConnectionsGame({
  username,
  onLogout,
  onComplete,
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CharacterConnectionsContent
        username={username}
        onLogout={onLogout}
        onComplete={onComplete}
      />
    </DndProvider>
  );
}

function CharacterConnectionsContent({ username, onLogout, onComplete }) {
  const [connections, setConnections] = useState([
    {
      id: 1,
      character: "Crisostomo Ibarra",
      role: "Protagonist, idealistic young man",
      matched: false,
    },
    {
      id: 2,
      character: "Maria Clara",
      role: "Ibarra's love interest, daughter of Captain Tiago",
      matched: false,
    },
    {
      id: 3,
      character: "Padre Damaso",
      role: "Franciscan friar, Maria Clara's biological father",
      matched: false,
    },
    {
      id: 4,
      character: "Elias",
      role: "Mysterious man who helps Ibarra",
      matched: false,
    },
    {
      id: 5,
      character: "Sisa",
      role: "Mother of Basilio and Crispin",
      matched: false,
    },
  ]);

  const [descriptions, setDescriptions] = useState([
    {
      id: 1,
      text: "Son of Don Rafael Ibarra, returns to the Philippines after studying in Europe",
    },
    {
      id: 2,
      text: "Raised by Captain Tiago, known for her beauty and kindness",
    },
    {
      id: 3,
      text: "Former town curate, represents the corrupt Spanish friars",
    },
    {
      id: 4,
      text: "A fugitive who becomes Ibarra's ally, represents the common Filipino",
    },
    { id: 5, text: "Symbol of motherly love and suffering under Spanish rule" },
  ]);

  const [matches, setMatches] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const checkCompletion = useCallback(() => {
    const allMatched = connections.every((char) => char.matched);
    if (allMatched && !completed) {
      setCompleted(true);
      onComplete();
    }
  }, [connections, completed, onComplete]);

  const handleDrop = (item, monitor, targetId) => {
    const characterId = item.id;

    // Check if this is a correct match
    const character = connections.find((c) => c.id === characterId);
    const description = descriptions.find((d) => d.id === targetId);

    if (character && description && character.id === description.id) {
      // Correct match
      setConnections((prev) =>
        prev.map((c) => (c.id === characterId ? { ...c, matched: true } : c))
      );
      setMatches((prev) => ({
        ...prev,
        [characterId]: targetId,
      }));
      setScore((prev) => prev + 20);
      setTimeout(checkCompletion, 500);
      return { matched: true };
    } else {
      // Incorrect match
      setScore((prev) => Math.max(0, prev - 5));
      return { matched: false };
    }
  };

  const [, drop] = useDrop({
    accept: "character",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return { dropped: false };

      // Handle drop on the main container (reset position)
      setConnections((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, x: 0, y: 0 } : c))
      );
      return { dropped: true };
    },
  });

  const resetGame = () => {
    setConnections((prev) => prev.map((c) => ({ ...c, matched: false })));
    setMatches({});
    setCompleted(false);
    setScore(0);
  };

  const DraggableCharacter = ({ character }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "character",
      item: { id: character.id },
      canDrag: !character.matched,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`p-4 rounded-lg shadow-md cursor-move transition-all duration-200 ${character.matched
            ? "bg-green-100 border-2 border-green-500"
            : "bg-white hover:shadow-lg"
          } ${isDragging ? "opacity-50" : "opacity-100"}`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: character.matched ? "default" : "move",
        }}
      >
        <h3 className="font-bold text-lg">{character.character}</h3>
        <p className="text-sm text-gray-600">{character.role}</p>
      </div>
    );
  };

  const DropTarget = ({ description, id }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: "character",
      drop: (item) => handleDrop(item, null, id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    });

    const isMatched = Object.values(matches).includes(id);
    const matchedCharacter = connections.find((c) => matches[c.id] === id);

    return (
      <div
        ref={drop}
        className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${isOver
            ? "bg-blue-50 border-blue-300"
            : isMatched
              ? "bg-green-50 border-green-300"
              : "bg-gray-50 border-gray-200"
          }`}
      >
        {isMatched ? (
          <div className="text-center">
            <div className="font-bold text-green-700">✓ Matched!</div>
            <div className="text-sm text-gray-600">
              {matchedCharacter.character}
            </div>
          </div>
        ) : (
          <p className="text-gray-700">{description.text}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <GameHeader
        title="Character Connections"
        level={1}
        chapter={4}
        score={score}
        onBack={() => window.history.back()}
        onLogout={onLogout}
        username={username}
        theme="purple"
      />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-purple-800">
              Match the Characters
            </h2>
            <p className="text-purple-600">
              Drag characters to their matching descriptions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              {showHint ? "Hide Hints" : "Show Hints"}
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {showHint && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-700">
              <strong>Hint:</strong> Drag each character to its matching
              description. Match all characters to complete the game!
            </p>
          </div>
        )}

        {/* Educational Fact */}
        <div className="mb-6">
          <EducationalFact
            fact="José Rizal created complex characters in his novels to represent different aspects of Filipino society under Spanish colonial rule. Each character symbolizes real social issues and types of people he observed."
            dismissible={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Characters */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Characters
            </h2>
            <div className="space-y-4">
              {connections.map(
                (character) =>
                  !character.matched && (
                    <DraggableCharacter
                      key={character.id}
                      character={character}
                    />
                  )
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Match the Descriptions
            </h2>
            <div className="space-y-4" ref={drop}>
              {descriptions.map((desc) => (
                <DropTarget key={desc.id} description={desc} id={desc.id} />
              ))}
            </div>
          </div>
        </div>

        {completed && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-green-700 mb-4">
              You've matched all characters correctly with a score of {score}!
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
