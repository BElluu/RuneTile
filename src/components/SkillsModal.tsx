import React from 'react';
import type { PlayerStats } from '@/types/game';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerStats: PlayerStats;
  statsLastFetched?: number;
}

export function SkillsModal({ isOpen, onClose, playerName, playerStats, statsLastFetched }: SkillsModalProps) {
  if (!isOpen) return null;

  const skills = [
    { name: 'Attack', level: playerStats.attack, icon: '/src/assets/skills/Attack_icon.png' },
    { name: 'Defence', level: playerStats.defence, icon: '/src/assets/skills/Defence_icon.png' },
    { name: 'Strength', level: playerStats.strength, icon: '/src/assets/skills/Strength_icon.png' },
    { name: 'Hitpoints', level: playerStats.hitpoints, icon: '/src/assets/skills/Hitpoints_icon.png' },
    { name: 'Ranged', level: playerStats.ranged, icon: '/src/assets/skills/Ranged_icon.png' },
    { name: 'Prayer', level: playerStats.prayer, icon: '/src/assets/skills/Prayer_icon.png' },
    { name: 'Magic', level: playerStats.magic, icon: '/src/assets/skills/Magic_icon.png' },
    { name: 'Cooking', level: playerStats.cooking, icon: '/src/assets/skills/Cooking_icon.png' },
    { name: 'Woodcutting', level: playerStats.woodcutting, icon: '/src/assets/skills/Woodcutting_icon.png' },
    { name: 'Fletching', level: playerStats.fletching, icon: '/src/assets/skills/Fletching_icon.png' },
    { name: 'Fishing', level: playerStats.fishing, icon: '/src/assets/skills/Fishing_icon.png' },
    { name: 'Firemaking', level: playerStats.firemaking, icon: '/src/assets/skills/Firemaking_icon.png' },
    { name: 'Crafting', level: playerStats.crafting, icon: '/src/assets/skills/Crafting_icon.png' },
    { name: 'Smithing', level: playerStats.smithing, icon: '/src/assets/skills/Smithing_icon.png' },
    { name: 'Mining', level: playerStats.mining, icon: '/src/assets/skills/Mining_icon.png' },
    { name: 'Herblore', level: playerStats.herblore, icon: '/src/assets/skills/Herblore_icon.png' },
    { name: 'Agility', level: playerStats.agility, icon: '/src/assets/skills/Agility_icon.png' },
    { name: 'Thieving', level: playerStats.thieving, icon: '/src/assets/skills/Thieving_icon.png' },
    { name: 'Slayer', level: playerStats.slayer, icon: '/src/assets/skills/Slayer_icon.png' },
    { name: 'Farming', level: playerStats.farming, icon: '/src/assets/skills/Farming_icon.png' },
    { name: 'Runecraft', level: playerStats.runecraft, icon: '/src/assets/skills/Runecraft_icon.png' },
    { name: 'Hunter', level: playerStats.hunter, icon: '/src/assets/skills/Hunter_icon.png' },
    { name: 'Construction', level: playerStats.construction, icon: '/src/assets/skills/Construction_icon.png' },
  ];

  const getTimeAgo = (timestamp?: number): string => {
    if (!timestamp) return 'unknown';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const totalLevel = Object.values(playerStats).reduce((sum, level) => sum + level, 0) - playerStats.overall;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: '#2d2925',
          borderColor: '#4a443f',
          border: '2px solid'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <img 
                src="/src/assets/menu/Stats_icon.png" 
                alt="Stats" 
                className="w-8 h-8"
              />
              {playerName}'s Stats
            </h2>
            <p className="text-sm text-gray-400 mt-1">Total Level: {totalLevel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-2 rounded transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: '#1a1714',
                border: '1px solid #4a443f'
              }}
            >
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-8 h-8 mb-1"
              />
              <div className="text-sm font-semibold text-white">{skill.level}</div>
              <div className="text-xs text-gray-400">{skill.name}</div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center space-y-1 mb-4">
          <p className="text-xs text-gray-400">
            Last updated: {getTimeAgo(statsLastFetched)}
          </p>
          <p className="text-xs text-gray-500">
            Stats refresh automatically every 15 minutes
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-white rounded font-semibold border"
          style={{
            background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
            borderColor: '#3D2F24',
            transition: 'transform 0.2s, background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

