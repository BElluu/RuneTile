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
  // Gold rewards based on item tier (player spends GP in OSRS)
  cheap: {
    difficulty: TaskDifficulty.EASY,
    itemAmount: [50, 100] as [number, number],  // Buy in bulk (cheap items)
    goldBonus: 50,                              // Small reward
    keysPerTask: 0,
  },
  medium: {
    difficulty: TaskDifficulty.MEDIUM,
    itemAmount: [20, 50] as [number, number],   // Moderate amount
    goldBonus: 150,                             // Decent reward
    keysPerTask: 0,
  },
  expensive: {
    difficulty: TaskDifficulty.HARD,
    itemAmount: [5, 20] as [number, number],    // Fewer items (expensive)
    goldBonus: 350,                             // Good reward
    keysPerTask: 0,
  },
  luxury: {
    difficulty: TaskDifficulty.ELITE,
    itemAmount: [1, 5] as [number, number],     // Very few (luxury items)
    goldBonus: 600,                             // Great reward
    keysPerTask: 1,                               // Bonus key!
  },
} as const;

// ============================================
// SLAYER TASKS
// ============================================
export const SLAYER_REWARDS = {
  // Number of tasks required for each master's reward
  tasksRequired: {
    turael: 10,      // Easy master = more tasks
    aya: 10,
    spria: 10,
    mazchna: 8,
    achtryn: 8,
    vannaka: 7,
    chaeldar: 6,
    konar: 5,        // Special master = even fewer
    nieve: 4,
    steve: 4,
    duradel: 3,      // Hard master = fewer tasks
    kuradal: 3,
    krystilia: 3,    // Wilderness = dangerous but rewarding
  },
  // Rewards for completing the required number of tasks
  keysPerMilestone: 1,
  goldBonus: 200,
} as const;

// Slayer master replacements based on quest completion
// Source: https://oldschool.runescape.wiki/w/Slayer_Master
export const SLAYER_MASTER_REPLACEMENTS = {
  whileGuthixSleeps: [
    { old: 'Turael', new: 'Aya', oldImage: '/src/assets/slayer_masters/Turael_head.png', newImage: '/src/assets/slayer_masters/Aya_head.png' },
    { old: 'Mazchna', new: 'Achtryn', oldImage: '/src/assets/slayer_masters/Mazchna_head.png', newImage: '/src/assets/slayer_masters/Achtryn_head.png' },
    { old: 'Duradel', new: 'Kuradal', oldImage: '/src/assets/slayer_masters/Duradel_head.png', newImage: '/src/assets/slayer_masters/Kuradal_head.png' },
  ],
  monkeyMadness2: [
    { old: 'Nieve', new: 'Steve', oldImage: '/src/assets/slayer_masters/Nieve_head.png', newImage: '/src/assets/slayer_masters/Steve_head.png' },
  ],
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
  gold: 50,
} as const;

// ============================================
// DAILY TASKS CONFIGURATION
// ============================================

export const DAILY_REWARDS = {
  easy: {
    keysPerTask: 1,
    goldBonus: 50,
  },
  medium: {
    keysPerTask: 2,
    goldBonus: 150,
  },
  hard: {
    keysPerTask: 3,
    goldBonus: 350,
  },
  elite: {
    keysPerTask: 5,
    goldBonus: 750,
  },
} as const;

