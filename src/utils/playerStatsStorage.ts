export interface PlayerStats {
  overall: number;
  attack: number;
  defence: number;
  strength: number;
  hitpoints: number;
  ranged: number;
  prayer: number;
  magic: number;
  cooking: number;
  woodcutting: number;
  fletching: number;
  fishing: number;
  firemaking: number;
  crafting: number;
  smithing: number;
  mining: number;
  herblore: number;
  agility: number;
  thieving: number;
  slayer: number;
  farming: number;
  runecraft: number;
  hunter: number;
  construction: number;
}

export interface SavedPlayerData {
  playerName: string;
  stats: PlayerStats;
  timestamp: number;
}

const STORAGE_KEY = 'runeTile_playerStats';

export function savePlayerStats(playerName: string, stats: PlayerStats): void {
  try {
    const existingData = getSavedPlayers();
    const playerData: SavedPlayerData = {
      playerName: playerName.toLowerCase(),
      stats,
      timestamp: Date.now()
    };
    
    // Usuń poprzednie dane tego gracza jeśli istnieją
    const filteredData = existingData.filter(p => p.playerName !== playerName.toLowerCase());
    
    // Dodaj nowe dane
    const updatedData = [...filteredData, playerData];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    console.log(`Zapisano statystyki gracza: ${playerName}`);
  } catch (error) {
    console.error('Błąd podczas zapisywania statystyk:', error);
  }
}

export function getSavedPlayers(): SavedPlayerData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Błąd podczas odczytywania zapisanych graczy:', error);
    return [];
  }
}

export function getPlayerStats(playerName: string): PlayerStats | null {
  try {
    const savedPlayers = getSavedPlayers();
    const player = savedPlayers.find(p => p.playerName === playerName.toLowerCase());
    return player ? player.stats : null;
  } catch (error) {
    console.error('Błąd podczas odczytywania statystyk gracza:', error);
    return null;
  }
}

export function deletePlayerStats(playerName: string): void {
  try {
    const existingData = getSavedPlayers();
    const filteredData = existingData.filter(p => p.playerName !== playerName.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    console.log(`Usunięto statystyki gracza: ${playerName}`);
  } catch (error) {
    console.error('Błąd podczas usuwania statystyk:', error);
  }
}

export function clearAllPlayerStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Wyczyszczono wszystkie zapisane statystyki');
  } catch (error) {
    console.error('Błąd podczas czyszczenia statystyk:', error);
  }
}
