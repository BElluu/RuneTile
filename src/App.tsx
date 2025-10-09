import { GameBoard } from "./components/GameBoard";
import "./index.css";
import { useState, useEffect } from "react";
import { loadGameState } from "./utils/gameStorage";

export function App() {
  const [playerName, setPlayerName] = useState("");
  const [isCheckingSavedGame, setIsCheckingSavedGame] = useState(true);

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
        <div className="text-white text-lg">Checking saved game...</div>
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
