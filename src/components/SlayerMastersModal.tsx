import React from 'react';

interface SlayerMaster {
  name: string;
  image: string;
  tasksCompleted: number;
  requiredTasks: number;
}

interface SlayerMastersModalProps {
  isOpen: boolean;
  onClose: () => void;
  slayerMasters: SlayerMaster[];
  onTaskComplete: (masterName: string) => void;
}

export function SlayerMastersModal({ isOpen, onClose, slayerMasters, onTaskComplete }: SlayerMastersModalProps) {
  if (!isOpen) return null;

  const getProgressPercentage = (completed: number, required: number) => {
    return Math.min((completed / required) * 100, 100);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
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
                src="/src/assets/menu/SlayerMasters_icon.png" 
                alt="Slayer Masters" 
                className="w-8 h-8"
              />
              Slayer Masters
            </h2>
            <p className="text-sm text-gray-400 mt-1">Complete tasks to earn rewards</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Slayer Masters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {slayerMasters.map((master) => {
            const progress = getProgressPercentage(master.tasksCompleted, master.requiredTasks);
            const isCompleted = master.tasksCompleted >= master.requiredTasks;

            return (
              <div 
                key={master.name} 
                className="flex flex-col p-4 rounded border transition-all"
                style={{
                  backgroundColor: isCompleted ? '#1f2d1f' : '#1a1714',
                  borderColor: isCompleted ? '#4ade80' : '#4a443f',
                  borderWidth: isCompleted ? '2px' : '1px'
                }}
              >
                {/* Master Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={master.image} 
                    alt={master.name} 
                    className="w-16 h-16 rounded"
                    style={{
                      filter: isCompleted ? 'brightness(1.2)' : 'none'
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-lg font-bold text-white">{master.name}</div>
                    <div className="text-sm text-gray-400">
                      {master.tasksCompleted}/{master.requiredTasks} tasks
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: '#1a1714' }}
                  >
                    <div 
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: isCompleted ? '#4ade80' : '#8B7355'
                      }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                {isCompleted ? (
                  <div className="text-center py-2 rounded text-green-400 font-semibold text-sm">
                    ✓ Milestone Complete!
                  </div>
                ) : (
                  <button
                    onClick={() => onTaskComplete(master.name)}
                    className="w-full px-4 py-2 text-white rounded font-semibold border transition-all"
                    style={{
                      background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                      borderColor: '#3D2F24'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Complete Task (+1)
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mb-4 p-3 rounded text-center" style={{ backgroundColor: '#1a1714' }}>
          <p className="text-gray-300 text-sm">
            Complete the required number of tasks for each master to earn keys and gold!
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

