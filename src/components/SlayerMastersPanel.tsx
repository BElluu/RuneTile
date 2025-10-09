import React from 'react';

interface SlayerMaster {
  name: string;
  image: string;
  tasksCompleted: number;
  requiredTasks: number;
}

interface SlayerMastersPanelProps {
  slayerMasters: SlayerMaster[];
  onTaskComplete: (masterName: string) => void;
}

export function SlayerMastersPanel({ slayerMasters, onTaskComplete }: SlayerMastersPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slayerMasters.map((master) => (
        <div 
          key={master.name} 
          className="flex flex-col items-center p-2 rounded border"
          style={{
            backgroundColor: '#2d2925',
            borderColor: '#4a443f'
          }}
        >
          <img 
            src={master.image} 
            alt={master.name} 
            className="w-12 h-12 mb-2 rounded"
          />
          <div className="text-sm font-bold text-white mb-1">{master.name}</div>
          <div className="text-xs text-gray-300 mb-2">
            {master.tasksCompleted}/{master.requiredTasks}
          </div>
          <button
            onClick={() => onTaskComplete(master.name)}
            className="px-2 py-1 text-white rounded text-xs transition-colors border"
            style={{
              background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
              borderColor: '#3D2F24'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a5344'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)'}
          >
            +1
          </button>
        </div>
      ))}
    </div>
  );
}
