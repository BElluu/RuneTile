import type { GeneratedTask, QuestData, TaskReward, GameState } from '@/types/game';
import { TaskCategory, TaskDifficulty } from '@/types/game';
import { QUEST_REWARDS, QUEST_DIFFICULTY_THRESHOLDS } from '@/config/rewards';
import { generateBossTask } from './bossTaskGenerator';

export async function generateQuestTask(
  tileId: string, 
  playerName: string,
  onQuestsChecked?: (quests: { whileGuthixSleeps: boolean; monkeyMadness2: boolean }) => void
): Promise<GeneratedTask> {
  try {
    const response = await fetch(`/api/quests/${encodeURIComponent(playerName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quests');
    }
    
    const data = await response.json();
    const quests: QuestData[] = Array.isArray(data) ? data : (data.quests || []);
    
    // Check for slayer masters swapping and notify callback (only if callback is provided)
    // Callback will be undefined if both quests are already completed
    if (onQuestsChecked) {
      const whileGuthixSleeps = quests.some(q => 
        q.title === 'While Guthix Sleeps' && q.status === 'COMPLETED'
      );
      
      const monkeyMadness2 = quests.some(q => 
        q.title === 'Monkey Madness II' && q.status === 'COMPLETED'
      );
      
      onQuestsChecked({ whileGuthixSleeps, monkeyMadness2 });
    }
    
    // Filter quests that player can start and are not completed
    const availableQuests = quests.filter(quest => 
      quest.userEligible && quest.status !== 'COMPLETED'
    );
    
    if (availableQuests.length === 0) {
      return generateBossTask(tileId);
    }
    
    const randomQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
    
    if (!randomQuest) {
      throw new Error('Failed to select quest');
    }
    
    const rewards: TaskReward[] = [{
      type: 'keys',
      amount: QUEST_REWARDS.keysPerTask,
      description: `${QUEST_REWARDS.keysPerTask} Key${QUEST_REWARDS.keysPerTask > 1 ? 's' : ''}`
    },
    {
      type: 'gold',
      amount: QUEST_REWARDS.goldBonus,
      description: `${QUEST_REWARDS.goldBonus} Gold`
    }];
    
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
      rewards
    };
  } catch (error) {
    console.error('Error generating quest task:', error);
    throw error;
  }
}

function getDifficultyFromQuestPoints(questPoints: number): TaskDifficulty {
  if (questPoints <= QUEST_DIFFICULTY_THRESHOLDS.easy) return TaskDifficulty.EASY;
  if (questPoints <= QUEST_DIFFICULTY_THRESHOLDS.medium) return TaskDifficulty.MEDIUM;
  if (questPoints <= QUEST_DIFFICULTY_THRESHOLDS.hard) return TaskDifficulty.HARD;
  return TaskDifficulty.ELITE;
}