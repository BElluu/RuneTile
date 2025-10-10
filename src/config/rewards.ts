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
    killCount: [5, 20] as [number, number],
    goldPerKill: 30,
    keysPerTask: 0,
  },
  mid: {
    difficulty: TaskDifficulty.MEDIUM,
    killCount: [3, 15] as [number, number],
    goldPerKill: 65,
    keysPerTask: 0,
  },
  high: {
    difficulty: TaskDifficulty.HARD,
    killCount: [2, 10] as [number, number],
    goldPerKill: 200,
    keysPerTask: 0,
  },
  elite: {
    difficulty: TaskDifficulty.ELITE,
    killCount: [1, 5] as [number, number],
    goldPerKill: 350,
    keysPerTask: 0,
  },
} as const;

// ============================================
// QUEST TASKS
// ============================================
export const QUEST_REWARDS = {
  keysPerTask: 1,
  goldBonus: 20,
} as const;

// Mapping QP to difficulty
export const QUEST_DIFFICULTY_THRESHOLDS = {
  easy: 2,    // 0-2 QP
  medium: 5,  // 3-5 QP
  hard: 10,   // 6-10 QP
  elite: 11,  // 11+ QP
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
  keysPerTask: 1,
  goldBonus: 0,
  itemAmount: [10, 60] as [number, number],
} as const;

// ============================================
// SLAYER TASKS (TODO)
// ============================================
export const SLAYER_REWARDS = {
  // Number of tasks required for each master's reward
  tasksRequired: {
    turael: 5,
    spria: 5,
    mazchna: 5,
    vannaka: 5,
    chaeldar: 5,
    duradel: 5,
    nieve: 5,
    konar: 5,
    krystilia: 5,
  },
  // Rewards for completing the required number of tasks
  keysPerMilestone: 1,
  goldBonus: 22,
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
  keysPerTask: 1,
  goldBonus: 10,
} as const;

// ============================================
// STARTING RESOURCES
// ============================================
export const STARTING_RESOURCES = {
  keys: 1,
  gold: 0,
} as const;

