/**
 * Application version configuration
 * Update this file when releasing a new version
 */

export const APP_VERSION = '0.0.1';

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
    description: 'Initial release of RuneTiles game'
  },
  {
    category: 'feature',
    description: 'Skill-based task generation with real OSRS stats integration'
  },
  {
    category: 'feature',
    description: 'Quest tasks using RuneMetrics API'
  },
  {
    category: 'feature',
    description: 'Boss tasks with 4 difficulty tiers (Low/Mid/High/Elite)'
  },
  {
    category: 'feature',
    description: 'Grand Exchange tasks with tier-based rewards (300+ items)'
  },
  {
    category: 'feature',
    description: 'Slayer Masters progression system (9 masters)'
  },
  {
    category: 'feature',
    description: 'Settings menu with font toggle and progress reset'
  },
  {
    category: 'balance',
    description: 'Balanced economy: Keys as primary progression, Gold as secondary resource'
  }
];

