import type { GeneratedTask, TaskReward } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';
import { GE_REWARDS } from '@/config/rewards';

const GE_ITEMS = [
  'Wand of Storm', 'Staff of Fire', 'Staff of Water', 'Staff of Earth',
  'Rune Essence', 'Pure Essence', 'Coal', 'Iron Ore', 'Gold Ore',
  'Mithril Ore', 'Adamantite Ore', 'Runite Ore', 'Logs', 'Oak Logs',
  'Willow Logs', 'Maple Logs', 'Yew Logs', 'Magic Logs', 'Raw Lobster',
  'Raw Swordfish', 'Raw Shark', 'Raw Monkfish', 'Raw Anglerfish'
];

export function generateGrandExchangeTask(tileId: string): GeneratedTask {
  const item = GE_ITEMS[Math.floor(Math.random() * GE_ITEMS.length)];
  if (!item) {
    return generateGrandExchangeTask(tileId);
  }
  
  const amount = Math.floor(
    Math.random() * (GE_REWARDS.itemAmount[1] - GE_REWARDS.itemAmount[0] + 1)
  ) + GE_REWARDS.itemAmount[0];
  
  const rewards: TaskReward[] = [{
    type: 'keys',
    amount: GE_REWARDS.keysPerTask,
    description: `${GE_REWARDS.keysPerTask} Key${GE_REWARDS.keysPerTask > 1 ? 's' : ''}`
  },
  {
    type: 'gold',
    amount: GE_REWARDS.goldBonus,
    description: `${GE_REWARDS.goldBonus} Gold`
  }];
  
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
    rewards
  };
}
