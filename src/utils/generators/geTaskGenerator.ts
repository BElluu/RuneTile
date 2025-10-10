import type { GeneratedTask, TaskReward } from '@/types/game';
import { TaskCategory } from '@/types/game';
import { GE_REWARDS } from '@/config/rewards';
import geItemsData from '@/data/ge_items.json';

type ItemTier = 'cheap' | 'medium' | 'expensive' | 'luxury';

interface GEItemsData {
  cheap: string[];
  medium: string[];
  expensive: string[];
  luxury: string[];
}

const GE_ITEMS = geItemsData as GEItemsData;

export function generateGrandExchangeTask(tileId: string): GeneratedTask {
  const tierRoll = Math.random();
  let tier: ItemTier;
  
  if (tierRoll < 0.40) {
    tier = 'cheap';      // 40% chance
  } else if (tierRoll < 0.70) {
    tier = 'medium';     // 30% chance
  } else if (tierRoll < 0.90) {
    tier = 'expensive';  // 20% chance
  } else {
    tier = 'luxury';     // 10% chance
  }
  
  const tierItems = GE_ITEMS[tier];
  const item = tierItems[Math.floor(Math.random() * tierItems.length)];
  
  if (!item) {
    return generateGrandExchangeTask(tileId);
  }
  
  const config = GE_REWARDS[tier];
  
  const amount = Math.floor(
    Math.random() * (config.itemAmount[1] - config.itemAmount[0] + 1)
  ) + config.itemAmount[0];
  
  const rewards: TaskReward[] = [{
    type: 'keys',
    amount: config.keysPerTask,
    description: `${config.keysPerTask} Key${config.keysPerTask > 1 ? 's' : ''}`
  },
  {
    type: 'gold',
    amount: config.goldBonus,
    description: `${config.goldBonus} Gold`
  }];
  
  return {
    id: `grandexchange_${tileId}`,
    title: `Grand Exchange: ${item}`,
    description: `Buy ${amount}× ${item} from the Grand Exchange`,
    category: TaskCategory.GRANDEXCHANGE,
    difficulty: config.difficulty,
    requirements: [{
      type: 'item',
      target: item,
      amount
    }],
    rewards
  };
}
