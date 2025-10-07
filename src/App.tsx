import { GameBoard } from "./components/GameBoard";
import "./index.css";
import { useState, useEffect } from "react";
import { loadGameState } from "./utils/gameStorage";

export function App() {
  const [playerName, setPlayerName] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [isCheckingSavedGame, setIsCheckingSavedGame] = useState(true);

  // Sprawdź czy istnieje zapisany gracz przy starcie
  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame && savedGame.playerName) {
      setPlayerName(savedGame.playerName);
      setShowGame(true);
    }
    setIsCheckingSavedGame(false);
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setShowGame(true);
    }
  };


  if (isCheckingSavedGame) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Sprawdzanie zapisanej gry...</div>
      </div>
    );
  }

  if (showGame) {
    return (
      <GameBoard 
        playerName={playerName} 
        onPlayerNameChange={setPlayerName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg border-2 border-gray-700 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-6">RuneTile</h1>
        <p className="text-gray-300 text-center mb-6">
          Companion aplikacja dla RuneScape Old School
        </p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Wprowadź nazwę gracza"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
          />
          <button
            onClick={handleStartGame}
            disabled={!playerName.trim()}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Rozpocznij grę
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
