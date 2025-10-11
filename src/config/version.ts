/**
 * Application version configuration
 * Update this file when releasing a new version
 */

export const APP_VERSION = '1.0.0';

export interface ChangelogEntry {
  category: 'feature' | 'improvement' | 'bugfix' | 'balance';
  description: string;
}

/**
 * Current changelog - only keep the latest version's changes here
 * When releasing a new version:
 * 1. Update APP_VERSION above
 * 2. Replace CURRENT_CHANGELOG with new changes
 */
export const CURRENT_CHANGELOG: ChangelogEntry[] = [
  {
    category: 'feature',
    description: '🎮 Initial release of RuneTiles - an interactive companion app for OSRS!'
  },
  {
    category: 'feature',
    description: '🗺️ Tile-based progression system with infinite zoom, pan, and unlock mechanics'
  },
  {
    category: 'feature',
    description: '📊 Multiple task types: Skills, Quests, Bosses (50+), Grand Exchange (300+ items), Daily Challenges'
  },
  {
    category: 'feature',
    description: '💀 Slayer Masters progression system with 9 masters and quest-based replacements'
  },
  {
    category: 'feature',
    description: '🏪 In-game Shop: Trade your gold for keys to unlock more tiles'
  },
  {
    category: 'feature',
    description: '📈 Real-time OSRS stats integration with automatic 15-minute refresh'
  },
  {
    category: 'feature',
    description: '🐛 Feedback System: Report bugs or suggest features directly from the app'
  },
  {
    category: 'improvement',
    description: '✨ Beautiful UI with gradient backgrounds, blur effects, and smooth animations'
  },
  {
    category: 'improvement',
    description: '🎯 Hover effects on tiles show rewards and provide visual feedback'
  },
  {
    category: 'improvement',
    description: '👋 Welcome modal for first-time players with detailed game guide'
  },
  {
    category: 'balance',
    description: '⚖️ Dual economy: Keys unlock tiles, Gold purchases items from shop'
  },
  {
    category: 'balance',
    description: '📈 Progressive difficulty: Harder tasks = better rewards'
  }
];

