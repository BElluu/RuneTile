import type { GeneratedTask, PlayerStats, QuestData } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';
import bossesData from '@/data/bosses.json';

interface BossData {
  id: string;
  name: string;
  combatLevel: number;
  category: 'low' | 'mid' | 'high' | 'elite';
  isWilderness: boolean;
}

// Lista skilli do generowania zadań
const SKILLS = [
  'attack', 'defence', 'strength', 'hitpoints', 'ranged', 'prayer', 'magic',
  'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting',
  'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming',
  'runecraft', 'hunter', 'construction'
] as const;

// Lista przedmiotów do kupienia na GE
const GE_ITEMS = [
  'Wand of Storm', 'Staff of Fire', 'Staff of Water', 'Staff of Earth',
  'Rune Essence', 'Pure Essence', 'Coal', 'Iron Ore', 'Gold Ore',
  'Mithril Ore', 'Adamantite Ore', 'Runite Ore', 'Logs', 'Oak Logs',
  'Willow Logs', 'Maple Logs', 'Yew Logs', 'Magic Logs', 'Raw Lobster',
  'Raw Swordfish', 'Raw Shark', 'Raw Monkfish', 'Raw Anglerfish'
];

// Funkcja do pobierania ikony dla typu zadania
export function getTaskIcon(category: TaskCategory, skillName?: string): string {
  
  switch (category) {
    case TaskCategory.SKILL:
      return getSkillIcon(skillName);
    case TaskCategory.QUEST:
      return '/src/assets/tasks/Quest_icon.png';
    case TaskCategory.BOSS:
      return '/src/assets/tasks/Bosses_icon.png';
    case TaskCategory.DROP:
      return '/src/assets/tasks/Drop_icon.png';
    case TaskCategory.GRANDEXCHANGE:
      return '/src/assets/tasks/GrandExchange_icon.png';
    default:
      return '/src/assets/skills/Attack_icon.png';
  }
}

function getSkillIcon(skillName: string | undefined): string {
  if (!skillName) {
    return '/src/assets/skills/Attack_icon.png';
  }

  const capitalizedSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1);
  return `/src/assets/skills/${capitalizedSkill}_icon.png`;
}

export async function generateTaskForTile(
  tileId: string, 
  playerStats: PlayerStats, 
  playerName: string,
  excludedCategories: string[] = []
): Promise<GeneratedTask> {
  // Specjalne zadanie startowe dla kafelka (0,0)
  if (tileId === '0,0') {
    return generateStartTask(tileId);
  }
  
  // Użyj losowego generatora - zadania mają być losowe za każdym razem
  // Ale wykluczamy kategorie które generują duplikaty
  let availableCategories = Object.values(TaskCategory).filter(
    cat => !excludedCategories.includes(cat)
  );
  
  // Jeśli wszystkie kategorie są wykluczone, użyj wszystkich
  if (availableCategories.length === 0) {
    availableCategories = Object.values(TaskCategory);
  }
  
  const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  
  switch (randomCategory) {
    case TaskCategory.SKILL:
      return generateSkillTask(tileId, playerStats);
    case TaskCategory.QUEST:
      return await generateQuestTask(tileId, playerName);
    case TaskCategory.BOSS:
      return generateBossTask(tileId);
    case TaskCategory.DROP:
      // DROP category deprecated - use BOSS instead
      return generateBossTask(tileId);
    case TaskCategory.GRANDEXCHANGE:
      return generateGrandExchangeTask(tileId);
    default:
      return generateSkillTask(tileId, playerStats);
  }
}


function generateSkillTask(tileId: string, playerStats: PlayerStats): GeneratedTask {
  const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
  if (!skill) {
    // Fallback - spróbuj inny skill
    return generateSkillTask(tileId, playerStats);
  }
  
  const currentLevel = playerStats[skill];
  
  // Nie generuj zadań dla skilli na poziomie 99 - spróbuj inny skill
  if (currentLevel >= 99) {
    return generateSkillTask(tileId, playerStats);
  }
  
  let levelIncrease: number;
  
  // Zasady na podstawie poziomu skilla
  if (currentLevel >= 1 && currentLevel <= 40) {
    // Poziom 1-40: może dostać zadanie na 1-10 poziomów
    levelIncrease = Math.floor(Math.random() * 10) + 1;
  } else if (currentLevel >= 41 && currentLevel <= 75) {
    // Poziom 41-75: może dostać zadanie na 1-5 poziomów
    levelIncrease = Math.floor(Math.random() * 5) + 1;
  } else if (currentLevel >= 76 && currentLevel <= 98) {
    // Poziom 76-98: może dostać zadanie na 1 poziom
    levelIncrease = 1;
  } else {
    // Fallback
    levelIncrease = 1;
  }
  
  const targetLevel = Math.min(currentLevel + levelIncrease, 99);
  
  const difficulty = getDifficultyFromLevelIncrease(levelIncrease);
  
  return {
    id: `skill_${tileId}`,
    title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Training`,
    description: `Train ${skill} from level ${currentLevel} to level ${targetLevel}`,
    category: TaskCategory.SKILL,
    difficulty,
    skillName: skill, // Dodaj nazwę skilla
    requirements: [{
      type: 'skill',
      target: skill,
      currentLevel,
      requiredLevel: targetLevel
    }],
    rewards: [{
      type: 'keys',
      amount: 1,
      description: '1 Key'
    }]
  };
}

async function generateQuestTask(tileId: string, playerName: string): Promise<GeneratedTask> {
  try {
    // Pobierz dane questów z API
    const response = await fetch(`/api/quests/${encodeURIComponent(playerName)}`);
    if (!response.ok) {
      // Fallback - generuj boss task zamiast start task
      return generateBossTask(tileId);
    }
    
    const data = await response.json();
    
    // API zwraca obiekt z właściwością quests, a nie bezpośrednio tablicę
    const quests: QuestData[] = Array.isArray(data) ? data : (data.quests || []);
    
    // Filtruj questy które gracz może zacząć (userEligible: true) i nie są ukończone
    const availableQuests = quests.filter(quest => 
      quest.userEligible && quest.status !== 'COMPLETED'
    );
    
    if (availableQuests.length === 0) {
      // Fallback - generuj boss task zamiast start task
      return generateBossTask(tileId);
    }
    
    // Wybierz losowy quest z dostępnych
    const randomQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
    
    if (!randomQuest) {
      // Fallback - generuj boss task zamiast start task
      return generateBossTask(tileId);
    }
    
    return {
      id: `quest_${tileId}`,
      title: `Quest: ${randomQuest.title}`,
      description: `Complete the quest: ${randomQuest.title}`,
      category: TaskCategory.QUEST,
      difficulty: getDifficultyFromQuestPoints(randomQuest.questPoints),
      requirements: [{
        type: 'quest',
        target: randomQuest.title
      }],
      rewards: [{
        type: 'keys',
        amount: Math.floor(randomQuest.questPoints / 5) + 1,
        description: `${Math.floor(randomQuest.questPoints / 5) + 1} Key${Math.floor(randomQuest.questPoints / 5) + 1 > 1 ? 's' : ''}`
      }]
    };
  } catch (error) {
    console.error('Error fetching quest data:', error);
    // Fallback - generuj boss task zamiast start task
    return generateBossTask(tileId);
  }
}

function generateBossTask(tileId: string): GeneratedTask {
  const bosses: BossData[] = bossesData.bosses as BossData[];
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  
  if (!boss) {
    // Fallback - spróbuj ponownie
    return generateBossTask(tileId);
  }

  const difficultyConfig: Record<string, { difficulty: TaskDifficulty, killCount: [number, number], goldMultiplier: number }> = {
    'low': { difficulty: TaskDifficulty.EASY, killCount: [5, 20], goldMultiplier: 30 },
    'mid': { difficulty: TaskDifficulty.MEDIUM, killCount: [3, 15], goldMultiplier: 65 },
    'high': { difficulty: TaskDifficulty.HARD, killCount: [2, 10], goldMultiplier: 200 },
    'elite': { difficulty: TaskDifficulty.ELITE, killCount: [1, 5], goldMultiplier: 350 }
  };

  const config = difficultyConfig[boss.category] ?? difficultyConfig['mid']!;
  const killCount = Math.floor(Math.random() * (config.killCount[1] - config.killCount[0] + 1)) + config.killCount[0];

  const goldReward = killCount * config.goldMultiplier;

  return {
    id: `boss_${tileId}`,
    title: `Boss: ${boss.name}`,
    description: `Kill ${boss.name}${boss.isWilderness ? ' (Wilderness)' : ''} ${killCount} time${killCount > 1 ? 's' : ''}`,
    category: TaskCategory.BOSS,
    difficulty: config.difficulty,
    requirements: [{
      type: 'boss',
      target: boss.name,
      amount: killCount
    }],
    rewards: [{
      type: 'gold',
      amount: goldReward,
      description: `${goldReward.toLocaleString()} Gold`
    }]
  };
}

function generateGrandExchangeTask(tileId: string): GeneratedTask {
  const item = GE_ITEMS[Math.floor(Math.random() * GE_ITEMS.length)];
  if (!item) {
    return generateGrandExchangeTask(tileId);
  }
  
  const amount = Math.floor(Math.random() * 50) + 10;
  
  return {
    id: `grandexchange_${tileId}`,
    title: `Grand Exchange: ${item}`,
    description: `Buy ${amount} ${item} from the Grand Exchange`,
    category: TaskCategory.GRANDEXCHANGE,
    difficulty: TaskDifficulty.EASY,
    requirements: [{
      type: 'item',
      target: item,
      amount
    }],
    rewards: [{
      type: 'keys',
      amount: 1,
      description: '1 Key'
    }]
  };
}

function generateStartTask(tileId: string): GeneratedTask {
  return {
    id: `start_${tileId}`,
    title: 'Start Your Adventure',
    description: 'Use your first key to start adventure',
    category: TaskCategory.GRANDEXCHANGE,
    difficulty: TaskDifficulty.EASY,
    requirements: [{
      type: 'item',
      target: 'key',
      amount: 1
    }],
    rewards: [{
      type: 'keys',
      amount: 0,
      description: 'Begin your journey'
    }]
  };
}

function getDifficultyFromLevelIncrease(levelIncrease: number): TaskDifficulty {
  if (levelIncrease <= 2) return TaskDifficulty.EASY;
  if (levelIncrease <= 5) return TaskDifficulty.MEDIUM;
  if (levelIncrease <= 8) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}

function getDifficultyFromQuestPoints(questPoints: number): TaskDifficulty {
  if (questPoints <= 2) return TaskDifficulty.EASY;
  if (questPoints <= 5) return TaskDifficulty.MEDIUM;
  if (questPoints <= 10) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}

