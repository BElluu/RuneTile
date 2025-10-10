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

const STORAGE_KEY = 'runeTiles_playerStats';

export function savePlayerStats(playerName: string, stats: PlayerStats): void {
  try {
    const existingData = getSavedPlayers();
    const playerData: SavedPlayerData = {
      playerName: playerName.toLowerCase(),
      stats,
      timestamp: Date.now()
    };
    
    const filteredData = existingData.filter(p => p.playerName !== playerName.toLowerCase());
    
    const updatedData = [...filteredData, playerData];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving player stats:', error);
  }
}

export function getSavedPlayers(): SavedPlayerData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved players:', error);
    return [];
  }
}

export function getPlayerStats(playerName: string): PlayerStats | null {
  try {
    const savedPlayers = getSavedPlayers();
    const player = savedPlayers.find(p => p.playerName === playerName.toLowerCase());
    return player ? player.stats : null;
  } catch (error) {
    console.error('Error loading player stats:', error);
    return null;
  }
}

export function deletePlayerStats(playerName: string): void {
  try {
    const existingData = getSavedPlayers();
    const filteredData = existingData.filter(p => p.playerName !== playerName.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error deleting player stats:', error);
  }
}

export function clearAllPlayerStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all player stats:', error);
  }
}
