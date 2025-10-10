import type { GeneratedTask, TaskReward } from '@/types/game';
import { TaskCategory } from '@/types/game';
import { BOSS_REWARDS } from '@/config/rewards';
import bossesData from '@/data/bosses.json';

interface BossData {
  id: string;
  name: string;
  combatLevel: number;
  category: 'low' | 'mid' | 'high' | 'elite';
  isWilderness: boolean;
}

export function generateBossTask(tileId: string): GeneratedTask {
  const bosses = bossesData.bosses as BossData[];
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  
  if (!boss) {
    return generateBossTask(tileId);
  }

  const config = BOSS_REWARDS[boss.category];
  const killCount = Math.floor(
    Math.random() * (config.killCount[1] - config.killCount[0] + 1)
  ) + config.killCount[0];

  const goldReward = killCount * config.goldPerKill;
  
  const rewards: TaskReward[] = [
    {
    type: 'gold',
    amount: goldReward,
    description: `${goldReward.toLocaleString()} Gold`
  },
  {
    type: 'keys',
    amount: config.keysPerTask,
    description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
  }];

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
    rewards
  };
}
