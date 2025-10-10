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

export interface Tile {
  id: string;
  x: number;
  y: number;
  task: Task;
  state: TileState;
  unlocked: boolean;
  completed: boolean;
  visible: boolean;
}

export enum TileState {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: SkillRequirement[];
  rewards: Reward[];
  difficulty: TaskDifficulty;
  category: TaskCategory;
}

export interface SkillRequirement {
  skill: keyof PlayerStats;
  level: number;
}

export interface Reward {
  type: RewardType;
  amount: number;
  description: string;
}

export enum RewardType {
  KEYS = 'keys',
  EXPERIENCE = 'experience',
  GOLD = 'gold'
}

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  ELITE = 'elite',
  MASTER = 'master'
}

export enum TaskCategory {
  START = 'start',
  SKILL = 'skill',
  QUEST = 'quest', 
  BOSS = 'boss',
  DROP = 'drop',
  GRANDEXCHANGE = 'grandexchange',
  SLAYER = 'slayer',
  DAILY = 'daily'
}

export interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  requirements: TaskRequirement[];
  rewards: TaskReward[];
  skillName?: string;
}

export interface TaskRequirement {
  type: 'skill' | 'quest' | 'boss' | 'drop' | 'item';
  target: string;
  amount?: number;
  currentLevel?: number;
  requiredLevel?: number;
}

export interface TaskReward {
  type: 'keys' | 'experience' | 'gold';
  amount: number;
  description: string;
}

export interface QuestData {
  title: string;
  status: string;
  difficulty: number;
  members: boolean;
  questPoints: number;
  userEligible: boolean;
}

export interface KeySource {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  keysRewarded: number;
  completed: boolean;
  currentCount: number;
  requiredCount: number;
  icon: string;
}

export interface GameState {
  playerName: string;
  playerStats: PlayerStats;
  keys: number;
  gold: number;
  unlockedTiles: string[];
  completedTiles: string[];
  visibleTiles: string[];
  keySources: KeySource[];
  tileTasks: Record<string, GeneratedTask>; // tileId -> task
  lastUpdated: number;
  statsLastFetched?: number;
}

export interface TilePosition {
  x: number;
  y: number;
}
