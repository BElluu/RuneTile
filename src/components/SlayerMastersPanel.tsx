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
        <div key={master.name} className="flex flex-col items-center p-2 bg-gray-700 rounded border border-gray-600">
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
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 border border-blue-500"
          >
            +1
          </button>
        </div>
      ))}
    </div>
  );
}
