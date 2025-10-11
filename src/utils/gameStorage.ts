import type { GameState, PlayerStats } from '@/types/game';
import { SLAYER_REWARDS, SLAYER_MASTER_REPLACEMENTS } from '@/config/rewards';

const GAME_STATE_KEY = 'runeTiles_gameState';
const VERSION_KEY = 'runeTiles_version';
const DAILY_TASKS_KEY = 'runeTiles_dailyTasks';
const STATS_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

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
    localStorage.setItem('runeTiles_slayerMasters', JSON.stringify(slayerMasters));
  } catch (error) {
    console.error('Error saving slayer master state:', error);
  }
}

export function loadSlayerMasters(): any[] | null {
  try {
    const data = localStorage.getItem('runeTiles_slayerMasters');
    if (!data) return null;
    
    const savedMasters = JSON.parse(data);
    
    // Migrate requiredTasks to match current config
    const migratedMasters = savedMasters.map((master: any) => {
      const masterKey = master.name.toLowerCase() as keyof typeof SLAYER_REWARDS.tasksRequired;
      const configuredRequired = SLAYER_REWARDS.tasksRequired[masterKey];
      
      // If config has changed, update requiredTasks but keep tasksCompleted
      if (configuredRequired !== undefined && master.requiredTasks !== configuredRequired) {
        // If player had more completed than new requirement, reset to avoid issues
        const tasksCompleted = master.tasksCompleted >= configuredRequired 
          ? 0 
          : master.tasksCompleted;
        
        return {
          ...master,
          requiredTasks: configuredRequired,
          tasksCompleted
        };
      }
      
      return master;
    });
    
    // Save migrated data back to localStorage
    if (JSON.stringify(savedMasters) !== JSON.stringify(migratedMasters)) {
      saveSlayerMasters(migratedMasters);
    }
    
    return migratedMasters;
  } catch (error) {
    console.error('Error loading slayer master state:', error);
    return null;
  }
}

export function shouldRefreshStats(gameState: GameState | null): boolean {
  if (!gameState || !gameState.statsLastFetched) {
    return true;
  }
  
  const timeSinceLastFetch = Date.now() - gameState.statsLastFetched;
  return timeSinceLastFetch >= STATS_REFRESH_INTERVAL;
}

/**
 * Update slayer masters based on completed quests
 * Returns updated slayer masters array
 */
export function updateSlayerMastersForQuests(
  currentMasters: any[],
  questsCompleted: { whileGuthixSleeps?: boolean; monkeyMadness2?: boolean }
): any[] {
  let updated = [...currentMasters];
  
  // Apply While Guthix Sleeps replacements
  if (questsCompleted.whileGuthixSleeps) {
    SLAYER_MASTER_REPLACEMENTS.whileGuthixSleeps.forEach(replacement => {
      const masterIndex = updated.findIndex(m => m.name === replacement.old);
      if (masterIndex !== -1) {
        updated[masterIndex] = {
          ...updated[masterIndex],
          name: replacement.new,
          image: replacement.newImage
        };
      }
    });
  }
  
  // Apply Monkey Madness II replacements
  if (questsCompleted.monkeyMadness2) {
    SLAYER_MASTER_REPLACEMENTS.monkeyMadness2.forEach(replacement => {
      const masterIndex = updated.findIndex(m => m.name === replacement.old);
      if (masterIndex !== -1) {
        updated[masterIndex] = {
          ...updated[masterIndex],
          name: replacement.new,
          image: replacement.newImage
        };
      }
    });
  }
  
  return updated;
}

// ============================================
// VERSION MANAGEMENT
// ============================================

export function getLastSeenVersion(): string | null {
  try {
    return localStorage.getItem(VERSION_KEY);
  } catch (error) {
    console.error('Error loading version:', error);
    return null;
  }
}

export function saveLastSeenVersion(version: string): void {
  try {
    localStorage.setItem(VERSION_KEY, version);
  } catch (error) {
    console.error('Error saving version:', error);
  }
}

// ============================================
// DAILY TASKS MANAGEMENT
// ============================================

export interface DailyTasksState {
  date: string; // YYYY-MM-DD format
  completedTasks: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
    elite: boolean;
  };
}

export function loadDailyTasks(): DailyTasksState | null {
  try {
    const data = localStorage.getItem(DAILY_TASKS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading daily tasks:', error);
    return null;
  }
}

export function saveDailyTasks(dailyTasks: DailyTasksState): void {
  try {
    localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(dailyTasks));
  } catch (error) {
    console.error('Error saving daily tasks:', error);
  }
}

export function resetDailyTasksIfNewDay(currentDate: string): DailyTasksState {
  const saved = loadDailyTasks();
  
  // If no saved data or it's a new day, reset
  if (!saved || saved.date !== currentDate) {
    const newState: DailyTasksState = {
      date: currentDate,
      completedTasks: {
        easy: false,
        medium: false,
        hard: false,
        elite: false
      }
    };
    saveDailyTasks(newState);
    return newState;
  }
  
  return saved;
}
