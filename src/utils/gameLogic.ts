import type { Tile, GameState, TilePosition, PlayerStats, Task } from '@/types/game';
import { TaskCategory, TaskDifficulty, RewardType } from '@/types/game';
import { generateTaskForTile } from './taskGenerator';

// Generate infinite grid of tiles - only visible tiles
export function generateVisibleTiles(gameState: GameState): TilePosition[] {
  const visiblePositions: TilePosition[] = [];
  const processed = new Set<string>();
  
  // If there are no unlocked tiles, show the central tile
  if (gameState.unlockedTiles.length === 0) {
    visiblePositions.push({ x: 0, y: 0 });
    return visiblePositions;
  }
  
  for (const tileId of gameState.unlockedTiles) {
    const parts = tileId.split(',');
    const x = parseInt(parts[0] || '0', 10);
    const y = parseInt(parts[1] || '0', 10);
    if (isNaN(x) || isNaN(y)) continue;
    visiblePositions.push({ x, y });
    processed.add(tileId);
  }
  
  // Add neighbors of unlocked tiles
  for (const tileId of gameState.unlockedTiles) {
    const parts = tileId.split(',');
    const x = parseInt(parts[0] || '0', 10);
    const y = parseInt(parts[1] || '0', 10);
    if (isNaN(x) || isNaN(y)) continue;
    const neighbors = getNeighborPositions(x, y);
    
    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.x},${neighbor.y}`;
      if (!processed.has(neighborId)) {
        visiblePositions.push(neighbor);
        processed.add(neighborId);
      }
    }
  }
  
  return visiblePositions;
}

export function checkTaskRequirements(task: Task, playerStats: PlayerStats): boolean {
  return task.requirements.every(req => 
    playerStats[req.skill] >= req.level
  );
}

export function canUnlockTile(tileId: string, gameState: GameState): boolean {
  if (gameState.unlockedTiles.includes(tileId) || gameState.keys < 1) return false;
  
  return true;
}

export function unlockTile(tileId: string, gameState: GameState): GameState {
  if (!canUnlockTile(tileId, gameState)) {
    throw new Error('Nie można odblokować tego kafelka');
  }
  
  // After unlocking the tile, add its neighbors to visible tiles
  const parts = tileId.split(',');
  const x = parseInt(parts[0] || '0', 10);
  const y = parseInt(parts[1] || '0', 10);
  if (isNaN(x) || isNaN(y)) {
    throw new Error('Nieprawidłowy format ID kafelka');
  }
  
  const newVisibleTiles = new Set(gameState.visibleTiles);
  
  // Add neighbors of unlocked tile (top, bottom, left, right)
  const neighbors = [
    { x: x + 1, y },     // right
    { x: x - 1, y },     // left
    { x, y: y + 1 },     // bottom
    { x, y: y - 1 }      // top
  ];
  
  neighbors.forEach(pos => {
    const neighborId = `${pos.x},${pos.y}`;
    newVisibleTiles.add(neighborId);
  });
  
  return {
    ...gameState,
    keys: gameState.keys - 1,
    unlockedTiles: [...gameState.unlockedTiles, tileId],
    visibleTiles: Array.from(newVisibleTiles)
  };
}

function getNeighborPositions(x: number, y: number): TilePosition[] {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ];
}

export async function generateInitialGameState(playerName: string, playerStats: PlayerStats): Promise<GameState> {
  // Generate start task for tile (0,0)
  const startTask = {
    id: `start_0,0`,
    title: 'Start Your Adventure',
    description: 'Use your first key to start adventure',
    category: TaskCategory.START,
    difficulty: TaskDifficulty.EASY,
    requirements: [{
      type: 'item' as const,
      target: 'key',
      amount: 1
    }],
    rewards: [{
      type: RewardType.GOLD,
      amount: 0,
      description: 'Begin your journey'
    }]
  };

  return {
    playerName,
    playerStats,
    keys: 1,
    gold: 0,
    unlockedTiles: [],
    completedTiles: [],
    visibleTiles: ['0,0'],
    keySources: generateKeySources(),
    tileTasks: { '0,0': startTask },
    lastUpdated: Date.now(),
    statsLastFetched: Date.now()
  };
}

export async function generateTasksForVisibleTiles(gameState: GameState, playerName: string): Promise<GameState> {
  const visibleTiles = generateVisibleTiles(gameState);
  const newTileTasks = { ...gameState.tileTasks };
  
  // Collect all tiles to generate: visible + their neighbors (ahead of time)
  const tilesToGenerate = new Set<string>();
  
  // Add visible tiles
  visibleTiles.forEach(({ x, y }) => {
    tilesToGenerate.add(`${x},${y}`);
  });
  
  // Add neighbors of visible tiles (ahead of time)
  visibleTiles.forEach(({ x, y }) => {
    const neighbors = getNeighborPositions(x, y);
    neighbors.forEach(neighbor => {
      tilesToGenerate.add(`${neighbor.x},${neighbor.y}`);
    });
  });
  
  for (const tileId of tilesToGenerate) {
    if (!newTileTasks[tileId]) {
      const parts = tileId.split(',');
      const x = parseInt(parts[0] || '0', 10);
      const y = parseInt(parts[1] || '0', 10);
      if (isNaN(x) || isNaN(y)) continue;
      
      let task = await generateTaskForTile(tileId, gameState.playerStats, playerName);
      let attempts = 0;
      const maxAttempts = 10;
      let excludedCategories: string[] = [];
      
      while (isDuplicateTask(task, newTileTasks) && attempts < maxAttempts) {
        attempts++;
        
        // If 5 attempts, exclude the category that generates duplicates
        if (attempts >= 5 && task.category && !excludedCategories.includes(task.category)) {
          excludedCategories.push(task.category);
        }
        
        task = await generateTaskForTile(tileId, gameState.playerStats, playerName, excludedCategories);
      }
      
      newTileTasks[tileId] = task;
    }
  }
  
  return {
    ...gameState,
    tileTasks: newTileTasks
  };
}

function isDuplicateTask(newTask: import('@/types/game').GeneratedTask, existingTasks: Record<string, import('@/types/game').GeneratedTask>): boolean {
  const existingTasksArray = Object.values(existingTasks);
  
  for (const existingTask of existingTasksArray) {
    if (newTask.category === TaskCategory.SKILL && 
        existingTask.category === TaskCategory.SKILL &&
        newTask.skillName && existingTask.skillName && 
        newTask.skillName === existingTask.skillName) {
      return true;
    }

    if (newTask.category === existingTask.category && newTask.title === existingTask.title) {
      return true;
    }
  }
  
  return false;
}

function generateKeySources() {
  return [
    {
      id: 'slayer_master',
      name: 'Slayer Tasks',
      description: 'Complete Slayer Tasks',
      category: TaskCategory.SLAYER,
      keysRewarded: 1,
      completed: false,
      currentCount: 0,
      requiredCount: 5,
      icon: '💀'
    },
    {
      id: 'boss_kill',
      name: 'Boss Tasks',
      description: 'Kill bosses',
      category: TaskCategory.BOSS,
      keysRewarded: 3,
      completed: false,
      currentCount: 0,
      requiredCount: 5,
      icon: '⚔️'
    },
    {
      id: 'daily',
      name: 'Daily',
      description: 'Complete daily tasks',
      category: TaskCategory.DAILY,
      keysRewarded: 1,
      completed: false,
      currentCount: 0,
      requiredCount: 1,
      icon: '📋'
    }
  ];
}

//TODO: Add logic for required keys for tile
function getRequiredKeysForTile(tile: Tile): number {
  switch (tile.task.difficulty) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
    case 'elite': return 5;
    case 'master': return 8;
    default: return 1;
  }
}
