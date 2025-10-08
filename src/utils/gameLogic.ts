import type { Tile, TileState, GameState, TilePosition, PlayerStats, Task, SkillRequirement } from '@/types/game';
import { TaskCategory, TaskDifficulty, RewardType } from '@/types/game';
import { generateTaskForTile } from './taskGenerator';

// Generowanie nieskończonej siatki kafelków - tylko widoczne kafelki
export function generateVisibleTiles(gameState: GameState): TilePosition[] {
  const visiblePositions: TilePosition[] = [];
  const processed = new Set<string>();
  
  // Jeśli nie ma odblokowanych kafelków, pokaż centralny kafelek
  if (gameState.unlockedTiles.length === 0) {
    visiblePositions.push({ x: 0, y: 0 });
    return visiblePositions;
  }
  
  // Dodaj wszystkie odblokowane kafelki
  for (const tileId of gameState.unlockedTiles) {
    const parts = tileId.split(',');
    const x = parseInt(parts[0] || '0', 10);
    const y = parseInt(parts[1] || '0', 10);
    if (isNaN(x) || isNaN(y)) continue;
    visiblePositions.push({ x, y });
    processed.add(tileId);
  }
  
  // Dodaj sąsiadów odblokowanych kafelków
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

// Sprawdzanie czy kafelek powinien być widoczny
export function isTileVisible(tileId: string, gameState: GameState): boolean {
  // Kafelek jest widoczny jeśli:
  // 1. Jest już odblokowany
  // 2. Jest sąsiadem odblokowanego kafelka
  // 3. Jest w promieniu widoczności od centrum
  
  const tile = getTileById(tileId);
  if (!tile) return false;
  
  if (gameState.unlockedTiles.includes(tileId)) return true;
  
  // Sprawdź czy jest sąsiadem odblokowanego kafelka
  const unlockedTiles = gameState.unlockedTiles.map(id => getTileById(id)).filter(Boolean);
  
  for (const unlockedTile of unlockedTiles) {
    if (isNeighbor(tile, unlockedTile!)) {
      return true;
    }
  }
  
  return false;
}

// Sprawdzanie czy dwa kafelki są sąsiadami
function isNeighbor(tile1: Tile, tile2: Tile): boolean {
  const dx = Math.abs(tile1.x - tile2.x);
  const dy = Math.abs(tile1.y - tile2.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

// Sprawdzanie wymagań zadania
export function checkTaskRequirements(task: Task, playerStats: PlayerStats): boolean {
  return task.requirements.every(req => 
    playerStats[req.skill] >= req.level
  );
}

// Generowanie zadań na podstawie skilli gracza
export function generateTasksForPlayer(playerStats: PlayerStats): Task[] {
  const tasks: Task[] = [];
  
  // Przykładowe zadania dostosowane do skilli
  if (playerStats.mining >= 1) {
    tasks.push({
      id: 'mining_1_10',
      title: 'Mining Levels 1-10',
      description: 'Osiągnij poziom 10 w Mining',
      requirements: [{ skill: 'mining', level: 1 }],
      rewards: [{ type: RewardType.KEYS, amount: 1, description: '1 klucz' }],
      difficulty: TaskDifficulty.EASY,
      category: TaskCategory.SKILL
    });
  }
  
  if (playerStats.mining >= 10) {
    tasks.push({
      id: 'mining_10_30',
      title: 'Mining Levels 10-30',
      description: 'Osiągnij poziom 30 w Mining',
      requirements: [{ skill: 'mining', level: 10 }],
      rewards: [{ type: RewardType.KEYS, amount: 2, description: '2 klucze' }],
      difficulty: TaskDifficulty.MEDIUM,
      category: TaskCategory.SKILL
    });
  }
  
  if (playerStats.slayer >= 50) {
    tasks.push({
      id: 'slayer_task_50',
      title: 'Slayer Master Task',
      description: 'Wykonaj zadanie od Slayer Mastera (poziom 50+)',
      requirements: [{ skill: 'slayer', level: 50 }],
      rewards: [{ type: RewardType.KEYS, amount: 3, description: '3 klucze' }],
      difficulty: TaskDifficulty.HARD,
      category: TaskCategory.BOSS
    });
  }
  
  return tasks;
}

// Sprawdzanie czy gracz może odblokować kafelek
export function canUnlockTile(tileId: string, gameState: GameState): boolean {
  // Sprawdź czy kafelek nie jest już odblokowany
  if (gameState.unlockedTiles.includes(tileId)) return false;
  
  // Sprawdź czy gracz ma wystarczająco kluczy (1 klucz na kafelek)
  if (gameState.keys < 1) return false;
  
  return true;
}

// Pobieranie wymaganej liczby kluczy dla kafelka
function getRequiredKeysForTile(tile: Tile): number {
  // Prosta logika - więcej kluczy dla trudniejszych zadań
  switch (tile.task.difficulty) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
    case 'elite': return 5;
    case 'master': return 8;
    default: return 1;
  }
}

// Odblokowywanie kafelka
export function unlockTile(tileId: string, gameState: GameState): GameState {
  if (!canUnlockTile(tileId, gameState)) {
    throw new Error('Nie można odblokować tego kafelka');
  }
  
  // Po odblokowaniu kafelka, dodaj jego sąsiadów do widocznych
  const parts = tileId.split(',');
  const x = parseInt(parts[0] || '0', 10);
  const y = parseInt(parts[1] || '0', 10);
  if (isNaN(x) || isNaN(y)) {
    throw new Error('Nieprawidłowy format ID kafelka');
  }
  
  const newVisibleTiles = new Set(gameState.visibleTiles);
  
  // Dodaj sąsiadów odblokowanego kafelka (góra, dół, lewo, prawo)
  const neighbors = [
    { x: x + 1, y },     // prawo
    { x: x - 1, y },     // lewo
    { x, y: y + 1 },     // dół
    { x, y: y - 1 }      // góra
  ];
  
  neighbors.forEach(pos => {
    const neighborId = `${pos.x},${pos.y}`;
    newVisibleTiles.add(neighborId);
  });
  
  return {
    ...gameState,
    keys: gameState.keys - 1, // 1 klucz na kafelek
    unlockedTiles: [...gameState.unlockedTiles, tileId],
    visibleTiles: Array.from(newVisibleTiles)
  };
}

// Aktualizacja widocznych kafelków
function updateVisibleTiles(gameState: GameState, newTileId: string): string[] {
  const newVisibleTiles = new Set(gameState.visibleTiles);
  newVisibleTiles.add(newTileId);
  
  // Dodaj sąsiadów nowego kafelka
  const newTile = getTileById(newTileId);
  if (newTile) {
    const neighbors = getNeighborPositions(newTile.x, newTile.y);
    neighbors.forEach(pos => {
      const neighborId = `${pos.x},${pos.y}`;
      newVisibleTiles.add(neighborId);
    });
  }
  
  return Array.from(newVisibleTiles);
}

// Pobieranie pozycji sąsiadów
function getNeighborPositions(x: number, y: number): TilePosition[] {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ];
}

// Pobieranie kafelka po ID
function getTileById(tileId: string): Tile | null {
  // W prawdziwej implementacji to byłoby pobierane z bazy danych
  // Na razie zwracamy null - to będzie implementowane później
  return null;
}

// Generowanie początkowego stanu gry
export async function generateInitialGameState(playerName: string, playerStats: PlayerStats): Promise<GameState> {
  // Generuj zadanie startowe dla kafelka (0,0)
  const startTask = {
    id: `start_0,0`,
    title: 'Start Your Adventure',
    description: 'Use your first key to start adventure',
    category: TaskCategory.OTHER,
    difficulty: TaskDifficulty.EASY,
    requirements: [{
      type: 'item' as const,
      target: 'key',
      amount: 1
    }],
    rewards: [{
      type: RewardType.KEYS,
      amount: 0,
      description: 'Begin your journey'
    }]
  };

  return {
    playerName,
    playerStats,
    keys: 1, // Jeden klucz na start
    gold: 0, // Brak golda na start
    unlockedTiles: [], // Brak odblokowanych kafelków na start
    completedTiles: [],
    visibleTiles: ['0,0'], // Tylko centralny kafelek widoczny
    keySources: generateKeySources(),
    tileTasks: { '0,0': startTask }, // Zadanie startowe dla kafelka (0,0)
    lastUpdated: Date.now()
  };
}

// Generowanie źródeł kluczy
function generateKeySources() {
  return [
    {
      id: 'slayer_master',
      name: 'Slayer Tasks',
      description: 'Wykonaj zadania od Slayer Mastera',
      category: TaskCategory.BOSS,
      keysRewarded: 1,
      completed: false,
      currentCount: 0,
      requiredCount: 5,
      icon: '💀'
    },
    {
      id: 'dungeon_clear',
      name: 'Dungeons',
      description: 'Wykonaj dungeons',
      category: TaskCategory.OTHER,
      keysRewarded: 2,
      completed: false,
      currentCount: 0,
      requiredCount: 3,
      icon: '🏰'
    },
    {
      id: 'boss_kill',
      name: 'Barrows',
      description: 'Zabij bossów Barrows',
      category: TaskCategory.BOSS,
      keysRewarded: 3,
      completed: false,
      currentCount: 0,
      requiredCount: 5,
      icon: '⚔️'
    },
    {
      id: 'collection_log',
      name: 'Collection Log',
      description: 'Wypełnij wpisy w Collection Log',
      category: TaskCategory.OTHER,
      keysRewarded: 1,
      completed: false,
      currentCount: 0,
      requiredCount: 10,
      icon: '📋'
    }
  ];
}

// Generowanie zadań dla widocznych kafelków I ich sąsiadów (z wyprzedzeniem)
export async function generateTasksForVisibleTiles(gameState: GameState, playerName: string): Promise<GameState> {
  const visibleTiles = generateVisibleTiles(gameState);
  const newTileTasks = { ...gameState.tileTasks };
  
  // Zbierz wszystkie kafelki do wygenerowania: widoczne + ich sąsiedzi
  const tilesToGenerate = new Set<string>();
  
  // Dodaj widoczne kafelki
  visibleTiles.forEach(({ x, y }) => {
    tilesToGenerate.add(`${x},${y}`);
  });
  
  // Dodaj sąsiadów widocznych kafelków (z wyprzedzeniem)
  visibleTiles.forEach(({ x, y }) => {
    const neighbors = getNeighborPositions(x, y);
    neighbors.forEach(neighbor => {
      tilesToGenerate.add(`${neighbor.x},${neighbor.y}`);
    });
  });
  
  // Generuj zadania dla wszystkich kafelków
  for (const tileId of tilesToGenerate) {
    // Jeśli kafelek nie ma jeszcze zadania, wygeneruj je
    if (!newTileTasks[tileId]) {
      const parts = tileId.split(',');
      const x = parseInt(parts[0] || '0', 10);
      const y = parseInt(parts[1] || '0', 10);
      if (isNaN(x) || isNaN(y)) continue;
      
      const task = await generateTaskForTile(tileId, gameState.playerStats, playerName);
      newTileTasks[tileId] = task;
    }
  }
  
  return {
    ...gameState,
    tileTasks: newTileTasks
  };
}
