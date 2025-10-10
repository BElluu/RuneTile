import type { GeneratedTask, PlayerStats, TaskReward } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';
import { SKILL_REWARDS, SKILL_DIFFICULTY_THRESHOLDS } from '@/config/rewards';

const SKILLS = [
  'attack', 'defence', 'strength', 'hitpoints', 'ranged', 'prayer', 'magic',
  'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting',
  'smithing', 'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming',
  'runecraft', 'hunter', 'construction'
] as const;

export function generateSkillTask(tileId: string, playerStats: PlayerStats): GeneratedTask {
  const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
  if (!skill) {
    return generateSkillTask(tileId, playerStats);
  }
  
  const currentLevel = playerStats[skill];
  
  // Don't generate tasks for skills at level 99
  if (currentLevel >= 99) {
    return generateSkillTask(tileId, playerStats);
  }
  
  let levelIncrease: number;
  
  // Rules based on skill level
  if (currentLevel >= 1 && currentLevel <= 40) {
    levelIncrease = Math.floor(Math.random() * 10) + 1; // 1-10 levels
  } else if (currentLevel >= 41 && currentLevel <= 75) {
    levelIncrease = Math.floor(Math.random() * 5) + 1; // 1-5 levels
  } else if (currentLevel >= 76 && currentLevel <= 98) {
    levelIncrease = 1; // 1 level
  } else {
    levelIncrease = 1;
  }
  
  const targetLevel = Math.min(currentLevel + levelIncrease, 99);
  const difficulty = getDifficultyFromLevelIncrease(levelIncrease);
  
  const rewards: TaskReward[] = [{
    type: 'keys',
    amount: SKILL_REWARDS.keysPerTask,
    description: `${SKILL_REWARDS.keysPerTask} Key${SKILL_REWARDS.keysPerTask > 1 ? 's' : ''}`
  },
  {
    type: 'gold',
    amount: SKILL_REWARDS.goldBonus,
    description: `${SKILL_REWARDS.goldBonus} Gold`
  }];
  
  return {
    id: `skill_${tileId}`,
    title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Training`,
    description: `Train ${skill} from level ${currentLevel} to level ${targetLevel}`,
    category: TaskCategory.SKILL,
    difficulty,
    skillName: skill,
    requirements: [{
      type: 'skill',
      target: skill,
      currentLevel,
      requiredLevel: targetLevel
    }],
    rewards
  };
}

function getDifficultyFromLevelIncrease(levelIncrease: number): TaskDifficulty {
  if (levelIncrease <= SKILL_DIFFICULTY_THRESHOLDS.easy) return TaskDifficulty.EASY;
  if (levelIncrease <= SKILL_DIFFICULTY_THRESHOLDS.medium) return TaskDifficulty.MEDIUM;
  if (levelIncrease <= SKILL_DIFFICULTY_THRESHOLDS.hard) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}

export function getSkillIcon(skillName: string | undefined): string {
  if (!skillName) {
    return '/src/assets/skills/Attack_icon.png';
  }

  const capitalizedSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1);
  return `/src/assets/skills/${capitalizedSkill}_icon.png`;
}
