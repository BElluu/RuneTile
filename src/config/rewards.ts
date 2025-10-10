import { TaskDifficulty } from '@/types/game';

/**
 * Configuration for the game economy
 * Here you can easily adjust the game economy
 */

// ============================================
// BOSS TASKS
// ============================================
export const BOSS_REWARDS = {
  low: {
    difficulty: TaskDifficulty.EASY,
    killCount: [10, 25] as [number, number],
    goldPerKill: 15,
    keysPerTask: 0,
  },
  mid: {
    difficulty: TaskDifficulty.MEDIUM,
    killCount: [5, 15] as [number, number],
    goldPerKill: 40,
    keysPerTask: 0,
  },
  high: {
    difficulty: TaskDifficulty.HARD,
    killCount: [3, 8] as [number, number],
    goldPerKill: 100,
    keysPerTask: 0,
  },
  elite: {
    difficulty: TaskDifficulty.ELITE,
    killCount: [1, 3] as [number, number],
    goldPerKill: 400,
    keysPerTask: 1,
  },
} as const;

// ============================================
// QUEST TASKS
// ============================================
export const QUEST_REWARDS = {
  keysPerTask: 1,
  goldBonus: 100,
} as const;

// Mapping QP to difficulty
export const QUEST_DIFFICULTY_THRESHOLDS = {
  easy: 0,    // 0-1 QP (miniquests, tutorial, most quests)
  medium: 2,  // 2 QP (intermediate)
  hard: 3,    // 3 QP (hard quests)
  elite: 4,   // 4-5 QP (grandmaster quests)
} as const;

// ============================================
// SKILL TASKS
// ============================================
export const SKILL_REWARDS = {
  keysPerTask: 1,
  goldBonus: 0,
} as const;

// Mapping level increase to difficulty
export const SKILL_DIFFICULTY_THRESHOLDS = {
  easy: 2,
  medium: 5,
  hard: 8,
  elite: 9,
} as const;

// ============================================
// GRAND EXCHANGE TASKS
// ============================================
export const GE_REWARDS = {
  keysPerTask: 0,
  goldBonus: 150,
  itemAmount: [10, 60] as [number, number],
} as const;

// ============================================
// SLAYER TASKS
// ============================================
export const SLAYER_REWARDS = {
  // Number of tasks required for each master's reward
  tasksRequired: {
    turael: 10,      // Easy master = more tasks
    spria: 10,
    mazchna: 8,
    vannaka: 7,
    chaeldar: 6,
    duradel: 5,      // Hard master = fewer tasks
    nieve: 5,
    konar: 4,        // Special master = even fewer
    krystilia: 3,    // Wilderness = dangerous but rewarding
  },
  // Rewards for completing the required number of tasks
  keysPerMilestone: 1,
  goldBonus: 200,
} as const;

// ============================================
// DAILY TASKS (TODO)
// ============================================
export const DAILY_REWARDS = {
  [TaskDifficulty.EASY]: {
    keysPerTask: 0,
    goldBonus: 20,
  },
  [TaskDifficulty.MEDIUM]: {
    keysPerTask: 0,
    goldBonus: 40,
  },
  [TaskDifficulty.HARD]: {
    keysPerTask: 1,
    goldBonus: 80,
  },
  [TaskDifficulty.ELITE]: {
    keysPerTask: 2,
    goldBonus: 160,
  },
  [TaskDifficulty.MASTER]: {
    keysPerTask: 3,
    goldBonus: 320,
  },
} as const;

// ============================================
// START TASK REWARDS
// ============================================
export const START_TASK_REWARDS = {
  keysPerTask: 2,
  goldBonus: 50,
} as const;

// ============================================
// STARTING RESOURCES
// ============================================
export const STARTING_RESOURCES = {
  keys: 1,
  gold: 100,
} as const;

