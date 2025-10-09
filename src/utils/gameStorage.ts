import type { GameState, PlayerStats } from '@/types/game';

const GAME_STATE_KEY = 'runeTile_gameState';

export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

export function hasExistingGame(playerName: string): boolean {
  const gameState = loadGameState();
  return gameState?.playerName === playerName.toLowerCase();
}

export function updatePlayerStats(newStats: PlayerStats): void {
  const gameState = loadGameState();
  if (gameState) {
    gameState.playerStats = newStats;
    gameState.lastUpdated = Date.now();
    saveGameState(gameState);
  }
}

export function addKeys(amount: number): void {
  const gameState = loadGameState();
  if (gameState) {
    gameState.keys += amount;
    saveGameState(gameState);
  }
}

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

export function resetGame(): void {
  localStorage.removeItem(GAME_STATE_KEY);
}

export function exportGameState(): string {
  const gameState = loadGameState();
  return gameState ? JSON.stringify(gameState, null, 2) : '';
}

export function importGameState(jsonData: string): boolean {
  try {
    const gameState = JSON.parse(jsonData);
    saveGameState(gameState);
    return true;
  } catch (error) {
    console.error('Error importing game state:', error);
    return false;
  }
}

export function saveSlayerMasters(slayerMasters: any[]): void {
  try {
    localStorage.setItem('runeTile_slayerMasters', JSON.stringify(slayerMasters));
  } catch (error) {
    console.error('Error saving slayer master state:', error);
  }
}

export function loadSlayerMasters(): any[] | null {
  try {
    const data = localStorage.getItem('runeTile_slayerMasters');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading slayer master state:', error);
    return null;
  }
}
