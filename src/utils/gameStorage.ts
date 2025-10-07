import { GameState, PlayerStats } from '@/types/game';

const GAME_STATE_KEY = 'runeTile_gameState';

// Zapisywanie stanu gry
export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    console.log('Stan gry zapisany:', gameState.playerName);
  } catch (error) {
    console.error('Błąd podczas zapisywania stanu gry:', error);
  }
}

// Odczytywanie stanu gry
export function loadGameState(): GameState | null {
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Błąd podczas odczytywania stanu gry:', error);
    return null;
  }
}

// Sprawdzanie czy gracz istnieje
export function hasExistingGame(playerName: string): boolean {
  const gameState = loadGameState();
  return gameState?.playerName === playerName.toLowerCase();
}

// Aktualizacja statystyk gracza
export function updatePlayerStats(newStats: PlayerStats): void {
  const gameState = loadGameState();
  if (gameState) {
    gameState.playerStats = newStats;
    gameState.lastUpdated = Date.now();
    saveGameState(gameState);
  }
}

// Dodawanie kluczy
export function addKeys(amount: number): void {
  const gameState = loadGameState();
  if (gameState) {
    gameState.keys += amount;
    saveGameState(gameState);
  }
}

// Oznaczanie źródła kluczy jako ukończone
export function markKeySourceCompleted(sourceId: string): void {
  const gameState = loadGameState();
  if (gameState) {
    const source = gameState.keySources.find(s => s.id === sourceId);
    if (source && !source.completed) {
      source.completed = true;
      gameState.keys += source.keysRewarded;
      saveGameState(gameState);
    }
  }
}

// Resetowanie gry
export function resetGame(): void {
  localStorage.removeItem(GAME_STATE_KEY);
  console.log('Gra zresetowana');
}

// Eksport stanu gry
export function exportGameState(): string {
  const gameState = loadGameState();
  return gameState ? JSON.stringify(gameState, null, 2) : '';
}

// Import stanu gry
export function importGameState(jsonData: string): boolean {
  try {
    const gameState = JSON.parse(jsonData);
    saveGameState(gameState);
    return true;
  } catch (error) {
    console.error('Błąd podczas importu stanu gry:', error);
    return false;
  }
}
