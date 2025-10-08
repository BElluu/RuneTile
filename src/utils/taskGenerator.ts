import type { GeneratedTask, PlayerStats, QuestData } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';

// Lista skilli do generowania zadań
const SKILLS = [
  'attack', 'defence', 'strength', 'hitpoints', 'ranged', 'prayer', 'magic',
  'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting',
  'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming',
  'runecraft', 'hunter', 'construction'
] as const;

// Lista questów
const QUESTS = [
  'Cook\'s Assistant', 'Dragon Slayer', 'Lost City', 'Monkey Madness',
  'Recipe for Disaster', 'Desert Treasure', 'Fremennik Trials',
  'Heroes\' Quest', 'Legends\' Quest', 'Recipe for Disaster: Freeing the Mountain Dwarf',
  'Underground Pass', 'Temple of Ikov', 'The Grand Tree', 'Waterfall Quest'
];

// Lista bossów z OSRS Wiki
const BOSSES = [
  // Low-level bosses
  'Giant Mole', 'Obor', 'Bryophyta', 'Callisto', 'Vet\'ion', 'Venenatis', 'Chaos Elemental',
  'Chaos Fanatic', 'Crazy Archaeologist', 'Scorpia', 'King Black Dragon',
  
  // Mid-level bosses  
  'Kraken', 'Zulrah', 'Vorkath', 'Kalphite Queen', 'Dagannoth Kings', 'Barrows Brothers',
  'Abyssal Sire', 'Cerberus', 'Alchemical Hydra', 'The Nightmare', 'The Gauntlet',
  'Corrupted Gauntlet', 'Zalcano', 'TzTok-Jad', 'TzKal-Zuk',
  
  // High-level bosses
  'Nex', 'Corporeal Beast', 'God Wars Dungeon Bosses', 'Commander Zilyana',
  'General Graardor', 'Kree\'Arra', 'K\'ril Tsutsaroth', 'Saradomin', 'Zamorak',
  'Bandos', 'Armadyl', 'Seren', 'The Great Olm', 'Tekton', 'Vasa Nistirio',
  'Vespula', 'Vanguard', 'Muttadiles', 'Lizardman Shamans', 'Demonic Gorillas',
  'Lizardman Shamans', 'Demonic Gorillas', 'Lizardman Shamans', 'Demonic Gorillas',
  
  // Wilderness bosses
  'Chaos Elemental', 'Chaos Fanatic', 'Crazy Archaeologist', 'Scorpia',
  'Callisto', 'Vet\'ion', 'Venenatis', 'King Black Dragon',
  
  // Raid bosses
  'The Great Olm', 'Tekton', 'Vasa Nistirio', 'Vespula', 'Vanguard', 'Muttadiles',
  'Lizardman Shamans', 'Demonic Gorillas', 'The Nightmare', 'The Gauntlet',
  'Corrupted Gauntlet', 'Zalcano'
];

// Lista dropów
const DROPS = [
  'Dragon Med Helm', 'Dragon Chainbody', 'Dragon Platelegs', 'Dragon Plateskirt',
  'Abyssal Whip', 'Dragon Scimitar', 'Dragon Longsword', 'Dragon Dagger',
  'Rune Scimitar', 'Rune Longsword', 'Rune Platebody', 'Rune Platelegs',
  'Magic Shortbow', 'Rune Crossbow', 'Dragon Boots', 'Ranger Boots',
  'Granite Maul', 'Granite Shield', 'Granite Legs', 'Granite Body'
];

// Lista przedmiotów do kupienia na GE
const GE_ITEMS = [
  'Wand of Storm', 'Staff of Fire', 'Staff of Water', 'Staff of Earth',
  'Rune Essence', 'Pure Essence', 'Coal', 'Iron Ore', 'Gold Ore',
  'Mithril Ore', 'Adamantite Ore', 'Runite Ore', 'Logs', 'Oak Logs',
  'Willow Logs', 'Maple Logs', 'Yew Logs', 'Magic Logs', 'Raw Lobster',
  'Raw Swordfish', 'Raw Shark', 'Raw Monkfish', 'Raw Anglerfish'
];

// Funkcja do pobierania ikony dla typu zadania
export function getTaskIcon(category: TaskCategory): string {
  switch (category) {
    case TaskCategory.SKILL:
      return '/src/assets/skills/Attack_icon.png'; // Używamy ikony skilla jako przykład
    case TaskCategory.QUEST:
      return '/src/assets/skills/Prayer_icon.png'; // Używamy ikony quest jako przykład
    case TaskCategory.BOSS:
      return '/src/assets/skills/Slayer_icon.png'; // Używamy ikony slayer jako przykład
    case TaskCategory.DROP:
      return '/src/assets/skills/Thieving_icon.png'; // Używamy ikony thieving jako przykład
    case TaskCategory.OTHER:
      return '/src/assets/skills/Crafting_icon.png'; // Używamy ikony crafting jako przykład
    default:
      return '/src/assets/skills/Attack_icon.png';
  }
}

export async function generateTaskForTile(tileId: string, playerStats: PlayerStats, playerName: string): Promise<GeneratedTask> {
  // Specjalne zadanie startowe dla kafelka (0,0)
  if (tileId === '0,0') {
    return generateStartTask(tileId);
  }
  
  // Użyj losowego generatora - zadania mają być losowe za każdym razem
  const categories = Object.values(TaskCategory);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  switch (randomCategory) {
    case TaskCategory.SKILL:
      return generateSkillTask(tileId, playerStats);
    case TaskCategory.QUEST:
      return await generateQuestTask(tileId, playerName);
    case TaskCategory.BOSS:
      return generateBossTask(tileId);
    case TaskCategory.DROP:
      return generateDropTask(tileId);
    case TaskCategory.OTHER:
      return generateOtherTask(tileId);
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
    
    const quests: QuestData[] = await response.json();
    
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
  const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
  if (!boss) {
    // Fallback - spróbuj ponownie
    return generateBossTask(tileId);
  }
  
  const killCount = Math.floor(Math.random() * 10) + 1; // 1-10 kills
  
  return {
    id: `boss_${tileId}`,
    title: `Boss Kill: ${boss}`,
    description: `Kill ${boss} ${killCount} time${killCount > 1 ? 's' : ''}`,
    category: TaskCategory.BOSS,
    difficulty: getDifficultyFromKillCount(killCount),
    requirements: [{
      type: 'boss',
      target: boss,
      amount: killCount
    }],
    rewards: [{
      type: 'keys',
      amount: Math.floor(killCount / 3) + 1,
      description: `${Math.floor(killCount / 3) + 1} Key${Math.floor(killCount / 3) + 1 > 1 ? 's' : ''}`
    }]
  };
}

function generateDropTask(tileId: string): GeneratedTask {
  const drop = DROPS[Math.floor(Math.random() * DROPS.length)];
  if (!drop) {
    // Fallback - spróbuj ponownie
    return generateDropTask(tileId);
  }
  
  return {
    id: `drop_${tileId}`,
    title: `Drop: ${drop}`,
    description: `Obtain ${drop} as a drop from any monster`,
    category: TaskCategory.DROP,
    difficulty: TaskDifficulty.MEDIUM,
    requirements: [{
      type: 'drop',
      target: drop
    }],
    rewards: [{
      type: 'keys',
      amount: 1,
      description: '1 Key'
    }]
  };
}

function generateOtherTask(tileId: string): GeneratedTask {
  const item = GE_ITEMS[Math.floor(Math.random() * GE_ITEMS.length)];
  if (!item) {
    // Fallback - spróbuj ponownie
    return generateOtherTask(tileId);
  }
  
  const amount = Math.floor(Math.random() * 50) + 10; // 10-60 items
  
  return {
    id: `other_${tileId}`,
    title: `Grand Exchange: ${item}`,
    description: `Buy ${amount} ${item} from the Grand Exchange`,
    category: TaskCategory.OTHER,
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
    category: TaskCategory.OTHER,
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

function getDifficultyFromKillCount(killCount: number): TaskDifficulty {
  if (killCount <= 2) return TaskDifficulty.EASY;
  if (killCount <= 5) return TaskDifficulty.MEDIUM;
  if (killCount <= 8) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}

function getDifficultyFromQuestPoints(questPoints: number): TaskDifficulty {
  if (questPoints <= 2) return TaskDifficulty.EASY;
  if (questPoints <= 5) return TaskDifficulty.MEDIUM;
  if (questPoints <= 10) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}

