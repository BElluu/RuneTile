/**
 * Application version configuration
 * Update this file when releasing a new version
 */

export const APP_VERSION = '1.0.0';

export interface VersionInfo {
  version: string;
  releaseDate: string;
  changes: {
    category: 'feature' | 'improvement' | 'bugfix' | 'balance';
    description: string;
  }[];
}

export const CHANGELOG: VersionInfo[] = [
  {
    version: '1.0.0',
    releaseDate: '2025-01-10',
    changes: [
      {
        category: 'feature',
        description: 'Initial release of RuneTile game'
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
        description: 'In-game shop for purchasing keys with gold'
      },
      {
        category: 'feature',
        description: 'Settings menu with font toggle and progress reset'
      },
      {
        category: 'feature',
        description: 'Tile unlock system with hover interactions'
      },
      {
        category: 'balance',
        description: 'Balanced economy: Keys as primary progression, Gold as optional acceleration'
      },
      {
        category: 'improvement',
        description: 'Stats refresh every 15 minutes from OSRS API'
      },
      {
        category: 'improvement',
        description: 'Automatic migration of Slayer Master task requirements'
      }
    ]
  }
];

/**
 * Compare version strings
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
}

/**
 * Get changelog entries between two versions
 */
export function getChangelogSince(lastVersion: string): VersionInfo[] {
  return CHANGELOG.filter(entry => 
    compareVersions(entry.version, lastVersion) > 0
  ).sort((a, b) => 
    compareVersions(b.version, a.version) // Newest first
  );
}

