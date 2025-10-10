import type { GeneratedTask, TaskReward, TaskDifficulty } from '@/types/game';
import { TaskCategory } from '@/types/game';
import { DAILY_REWARDS } from '@/config/rewards';
import bossesData from '@/data/bosses.json';


export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Seeded random number generator for consistent daily tasks
 */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}


function getSeededRandomElement<T>(array: readonly T[], seed: string): T {
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index] as T;
}


export function generateDailyTask(difficulty: 'easy' | 'medium' | 'hard' | 'elite', date: string): GeneratedTask {
  const config = DAILY_REWARDS[difficulty];
  const seed = `${date}-${difficulty}`;
  

  const taskTypes = ['boss', 'skill', 'grandexchange'] as const;
  const taskType = getSeededRandomElement(taskTypes, seed + '-type');
  
  if (taskType === 'boss') {
    return generateDailyBossTask(difficulty, config, seed);
  } else if (taskType === 'skill') {
    return generateDailySkillTask(difficulty, config, seed);
  } else {
    return generateDailyGrandExchangeTask(difficulty, config, seed);
  }
}

function generateDailyBossTask(
  difficulty: 'easy' | 'medium' | 'hard' | 'elite',
  config: { keysPerTask: number; goldBonus: number },
  seed: string
): GeneratedTask {
  const difficultyMap = {
    easy: 'low',
    medium: 'mid',
    hard: 'high',
    elite: 'elite'
  } as const;
  
  const bossDifficulty = difficultyMap[difficulty];
  const bosses = bossesData.bosses.filter(b => b.category === bossDifficulty);
  const boss = getSeededRandomElement(bosses, seed);
  
  const killCounts = {
    easy: [1, 3],
    medium: [3, 5],
    hard: [5, 10],
    elite: [10, 15]
  } as const;
  
  const [min, max] = killCounts[difficulty];
  const killCount = min + Math.floor(seededRandom(seed + '-count') * (max - min + 1));
  
  const rewards: TaskReward[] = [
    {
      type: 'keys',
      amount: config.keysPerTask,
      description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
    }
  ];
  
  if (config.goldBonus > 0) {
    rewards.push({
      type: 'gold',
      amount: config.goldBonus,
      description: `${config.goldBonus} Gold`
    });
  }
  
  return {
    id: `daily-${difficulty}-${getTodayDateString()}`,
    category: TaskCategory.BOSS,
    difficulty: difficulty.toUpperCase() as TaskDifficulty,
    description: `Kill ${killCount}x ${boss.name}`,
    icon: '/src/assets/tasks/Bosses_icon.png',
    rewards,
    metadata: {
      bossName: boss.name,
      killCount,
      isDaily: true
    }
  };
}

function generateDailySkillTask(
  difficulty: 'easy' | 'medium' | 'hard' | 'elite',
  config: { keysPerTask: number; goldBonus: number },
  seed: string
): GeneratedTask {
  const skills = [
    { name: 'Attack', icon: '/src/assets/skills/Attack_icon.png' },
    { name: 'Strength', icon: '/src/assets/skills/Strength_icon.png' },
    { name: 'Defence', icon: '/src/assets/skills/Defence_icon.png' },
    { name: 'Ranged', icon: '/src/assets/skills/Ranged_icon.png' },
    { name: 'Magic', icon: '/src/assets/skills/Magic_icon.png' },
    { name: 'Hitpoints', icon: '/src/assets/skills/Hitpoints_icon.png' },
    { name: 'Prayer', icon: '/src/assets/skills/Prayer_icon.png' },
    { name: 'Slayer', icon: '/src/assets/skills/Slayer_icon.png' },
    { name: 'Mining', icon: '/src/assets/skills/Mining_icon.png' },
    { name: 'Fishing', icon: '/src/assets/skills/Fishing_icon.png' },
    { name: 'Woodcutting', icon: '/src/assets/skills/Woodcutting_icon.png' },
    { name: 'Cooking', icon: '/src/assets/skills/Cooking_icon.png' },
    { name: 'Firemaking', icon: '/src/assets/skills/Firemaking_icon.png' },
    { name: 'Crafting', icon: '/src/assets/skills/Crafting_icon.png' },
    { name: 'Smithing', icon: '/src/assets/skills/Smithing_icon.png' },
    { name: 'Fletching', icon: '/src/assets/skills/Fletching_icon.png' },
    { name: 'Herblore', icon: '/src/assets/skills/Herblore_icon.png' },
    { name: 'Thieving', icon: '/src/assets/skills/Thieving_icon.png' },
    { name: 'Agility', icon: '/src/assets/skills/Agility_icon.png' },
    { name: 'Runecraft', icon: '/src/assets/skills/Runecraft_icon.png' },
    { name: 'Construction', icon: '/src/assets/skills/Construction_icon.png' },
    { name: 'Hunter', icon: '/src/assets/skills/Hunter_icon.png' },
    { name: 'Farming', icon: '/src/assets/skills/Farming_icon.png' }
  ];
  
  const skill = getSeededRandomElement(skills, seed);
  
  const levelGains = {
    easy: [1, 2],
    medium: [2, 3],
    hard: [3, 5],
    elite: [5, 7]
  } as const;
  
  const [min, max] = levelGains[difficulty];
  const levels = min + Math.floor(seededRandom(seed + '-levels') * (max - min + 1));
  
  const rewards: TaskReward[] = [
    {
      type: 'keys',
      amount: config.keysPerTask,
      description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
    }
  ];
  
  if (config.goldBonus > 0) {
    rewards.push({
      type: 'gold',
      amount: config.goldBonus,
      description: `${config.goldBonus} Gold`
    });
  }
  
  return {
    id: `daily-${difficulty}-${getTodayDateString()}`,
    category: TaskCategory.SKILL,
    difficulty: difficulty.toUpperCase() as TaskDifficulty,
    description: `Gain ${levels} ${skill.name} level${levels > 1 ? 's' : ''}`,
    icon: skill.icon,
    rewards,
    metadata: {
      skillName: skill.name,
      levelsRequired: levels,
      isDaily: true
    }
  };
}

function generateDailyQuestTask(
  difficulty: 'easy' | 'medium' | 'hard' | 'elite',
  config: { keysPerTask: number; goldBonus: number },
  seed: string
): GeneratedTask {
  const questDifficulties = {
    easy: 'Easy Quest',
    medium: 'Medium Quest',
    hard: 'Hard/Long Quest',
    elite: 'Master/Grandmaster Quest'
  } as const;
  
  const questDiff = questDifficulties[difficulty];
  
  const rewards: TaskReward[] = [
    {
      type: 'keys',
      amount: config.keysPerTask,
      description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
    }
  ];
  
  if (config.goldBonus > 0) {
    rewards.push({
      type: 'gold',
      amount: config.goldBonus,
      description: `${config.goldBonus} Gold`
    });
  }
  
  return {
    id: `daily-${difficulty}-${getTodayDateString()}`,
    category: TaskCategory.QUEST,
    difficulty: difficulty.toUpperCase() as TaskDifficulty,
    description: `Complete any ${questDiff}`,
    icon: '/src/assets/tasks/Quests_icon.png',
    rewards,
    metadata: {
      questDifficulty: questDiff,
      isDaily: true
    }
  };
}

function generateDailyGrandExchangeTask(
  difficulty: 'easy' | 'medium' | 'hard' | 'elite',
  config: { keysPerTask: number; goldBonus: number },
  seed: string
): GeneratedTask {
  const itemCategories = {
    easy: ['Logs', 'Fish', 'Ores'],
    medium: ['Bars', 'Herbs', 'Seeds'],
    hard: ['Potions', 'Runes', 'Equipment'],
    elite: ['Dragon items', 'Barrows items', 'God Wars items']
  } as const;
  
  const category = getSeededRandomElement(itemCategories[difficulty], seed + '-cat');
  
  const amounts = {
    easy: [50, 100],
    medium: [20, 50],
    hard: [10, 30],
    elite: [5, 15]
  } as const;
  
  const [min, max] = amounts[difficulty];
  const amount = min + Math.floor(seededRandom(seed + '-amount') * (max - min + 1));
  
  const rewards: TaskReward[] = [
    {
      type: 'keys',
      amount: config.keysPerTask,
      description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
    }
  ];
  
  if (config.goldBonus > 0) {
    rewards.push({
      type: 'gold',
      amount: config.goldBonus,
      description: `${config.goldBonus} Gold`
    });
  }
  
  return {
    id: `daily-${difficulty}-${getTodayDateString()}`,
    category: TaskCategory.GRANDEXCHANGE,
    difficulty: difficulty.toUpperCase() as TaskDifficulty,
    description: `Buy ${amount}x ${category} from Grand Exchange`,
    icon: '/src/assets/tasks/GrandExchange_icon.png',
    rewards,
    metadata: {
      itemCategory: category,
      amount,
      isDaily: true
    }
  };
}

export function generateAllDailyTasks(): {
  easy: GeneratedTask;
  medium: GeneratedTask;
  hard: GeneratedTask;
  elite: GeneratedTask;
} {
  const today = getTodayDateString();
  
  return {
    easy: generateDailyTask('easy', today),
    medium: generateDailyTask('medium', today),
    hard: generateDailyTask('hard', today),
    elite: generateDailyTask('elite', today)
  };
}

