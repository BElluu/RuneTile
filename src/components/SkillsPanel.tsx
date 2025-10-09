import React from 'react';
import type { PlayerStats } from '@/types/game';

interface SkillsPanelProps {
  playerStats: PlayerStats;
}

export function SkillsPanel({ playerStats }: SkillsPanelProps) {
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

  return (
    <div className="grid grid-cols-3 gap-1">
      {skills.map((skill, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center p-1 rounded"
          style={{
            backgroundColor: '#2d2925',
            border: '1px solid #4a443f'
          }}
        >
          <img 
            src={skill.icon} 
            alt={skill.name} 
            className="w-5 h-5 mb-1"
          />
          <div className="text-xs text-white">{skill.level}</div>
        </div>
      ))}
    </div>
  );
}
