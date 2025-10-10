import type { GeneratedTask, PlayerStats } from '@/types/game';
import { TaskCategory } from '@/types/game';
import { generateSkillTask, getSkillIcon } from './generators/skillTaskGenerator';
import { generateQuestTask } from './generators/questTaskGenerator';
import { generateBossTask } from './generators/bossTaskGenerator';
import { generateGrandExchangeTask } from './generators/geTaskGenerator';
import { generateStartTask } from './generators/otherTaskGenerator';

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
  
  // Use random generator - tasks should be random every time
  // But exclude categories that generate duplicates
  let availableCategories = Object.values(TaskCategory).filter(
    cat => !excludedCategories.includes(cat)
  );
  
  // If all categories are excluded, use all categories
  if (availableCategories.length === 0) {
    availableCategories = Object.values(TaskCategory);
  }
  
  const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  
  try {
    switch (randomCategory) {
      case TaskCategory.SKILL:
        return generateSkillTask(tileId, playerStats);
      case TaskCategory.QUEST:
        return await generateQuestTask(tileId, playerName);
      case TaskCategory.BOSS:
        return generateBossTask(tileId);
      case TaskCategory.DROP:
        // TODO: Drops category - dla przyszłości
        return generateBossTask(tileId);
      case TaskCategory.GRANDEXCHANGE:
        return generateGrandExchangeTask(tileId);
      default:
        return generateSkillTask(tileId, playerStats);
    }
  } catch (error) {
    console.error(`Error generating ${randomCategory} task:`, error);
    // Fallback to boss task if something goes wrong
    return generateBossTask(tileId);
  }
}
