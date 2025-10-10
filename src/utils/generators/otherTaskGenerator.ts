import type { GeneratedTask, TaskReward } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';
import { START_TASK_REWARDS } from '@/config/rewards';

/**
 * Generator for special/other tasks like start task, daily tasks, etc.
 */

export function generateStartTask(tileId: string): GeneratedTask {
  const rewards: TaskReward[] = [{
    type: 'keys',
    amount: START_TASK_REWARDS.keysPerTask,
    description: `${START_TASK_REWARDS.keysPerTask} Key${START_TASK_REWARDS.keysPerTask > 1 ? 's' : ''}`
  },
  {
    type: 'gold',
    amount: START_TASK_REWARDS.goldBonus,
    description: `${START_TASK_REWARDS.goldBonus} Gold`
  }];
  
  return {
    id: `start_${tileId}`,
    title: 'Start Your Adventure',
    description: 'Use your first key to start adventure',
    category: TaskCategory.START,
    difficulty: TaskDifficulty.EASY,
    requirements: [{
      type: 'item',
      target: 'key',
      amount: 1
    }],
    rewards
  };
}

// TODO: Add daily task generator
// export function generateDailyTask(tileId: string): GeneratedTask { ... }

