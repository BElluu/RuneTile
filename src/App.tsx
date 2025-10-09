import { GameBoard } from "./components/GameBoard";
import "./index.css";
import { useState, useEffect } from "react";
import { loadGameState } from "./utils/gameStorage";

export function App() {
  const [playerName, setPlayerName] = useState("");
  const [isCheckingSavedGame, setIsCheckingSavedGame] = useState(true);

  // Sprawdź czy istnieje zapisany gracz przy starcie
  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame && savedGame.playerName) {
      setPlayerName(savedGame.playerName);
    }
    setIsCheckingSavedGame(false);
  }, []);

  if (isCheckingSavedGame) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Sprawdzanie zapisanej gry...</div>
      </div>
    );
  }

  return (
    <GameBoard 
      playerName={playerName} 
      onPlayerNameChange={setPlayerName}
    />
  );
}

export default App;
