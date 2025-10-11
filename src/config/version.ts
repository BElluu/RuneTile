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
    description: 'Initial release of RuneTiles - an interactive companion app for OSRS!'
  },
  {
    category: 'feature',
    description: 'Tile-based progression system with zoom, pan, and unlock mechanics'
  },
  {
    category: 'feature',
    description: 'Real-time OSRS stats integration with 15-minute cache for performance'
  },
  {
    category: 'feature',
    description: 'Skill-based tasks: Train any skill from your current level with dynamic difficulty'
  },
  {
    category: 'feature',
    description: 'Quest tasks: Complete available OSRS quests with RuneMetrics API integration'
  },
  {
    category: 'feature',
    description: 'Boss tasks: Kill bosses with 4 difficulty tiers (Low/Mid/High/Elite) - 50+ bosses available'
  },
  {
    category: 'feature',
    description: 'Grand Exchange tasks: Buy items across 4 price tiers (300+ items) and earn rewards'
  },
  {
    category: 'feature',
    description: 'Slayer Masters system: Complete tasks for 9 different masters, with quest-based replacements'
  },
  {
    category: 'feature',
    description: 'Daily Tasks system: 4 rotating daily challenges (Easy/Medium/Hard/Elite) with increased rewards'
  },
  {
    category: 'feature',
    description: 'In-game Shop: Purchase keys using gold with adjustable quantity'
  },
  {
    category: 'feature',
    description: 'Skills Modal: View your complete OSRS stats, total level, and last update time'
  },
  {
    category: 'feature',
    description: 'Settings: Font toggle (RuneScape/Standard), progress reset, changelog viewer'
  },
  {
    category: 'feature',
    description: 'Welcome Modal for first-time players with game guide and tips'
  },
  {
    category: 'improvement',
    description: 'Beautiful redesigned menu with gradient backgrounds, blur effects, and smooth animations'
  },
  {
    category: 'improvement',
    description: 'Tile rewards displayed on hover (keys and gold) with smart sorting'
  },
  {
    category: 'improvement',
    description: 'Slayer Masters automatically sorted by difficulty (easiest to hardest)'
  },
  {
    category: 'improvement',
    description: 'Hover animations on tile buttons (Unlock/Complete) with scale and gradient effects'
  },
  {
    category: 'improvement',
    description: 'Fade-in animation for newly unlocked adjacent tiles'
  },
  {
    category: 'improvement',
    description: 'Modular task generation system with centralized reward configuration'
  },
  {
    category: 'balance',
    description: 'Balanced dual economy: Keys for tile unlocking, Gold for shop purchases'
  },
  {
    category: 'balance',
    description: 'Progressive difficulty: Harder tasks give more gold, Elite bosses award keys'
  }
];

