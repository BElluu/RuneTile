import React from 'react';
import type { GeneratedTask } from '@/types/game';

interface DailyTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: {
    easy: GeneratedTask;
    medium: GeneratedTask;
    hard: GeneratedTask;
    elite: GeneratedTask;
  };
  completedTasks: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
    elite: boolean;
  };
  onCompleteTask: (difficulty: 'easy' | 'medium' | 'hard' | 'elite') => void;
}

const DIFFICULTY_COLORS = {
  easy: '#4ade80',      // green
  medium: '#60a5fa',    // blue
  hard: '#f59e0b',      // orange
  elite: '#ef4444'      // red
};

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  elite: 'Elite'
};

export function DailyTasksModal({ 
  isOpen, 
  onClose, 
  tasks, 
  completedTasks,
  onCompleteTask 
}: DailyTasksModalProps) {
  if (!isOpen) return null;

  const difficulties: Array<'easy' | 'medium' | 'hard' | 'elite'> = ['easy', 'medium', 'hard', 'elite'];

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
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <img 
              src="/src/assets/menu/Daily_icon.png" 
              alt="Daily" 
              className="w-8 h-8"
            />
            Daily Tasks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 p-3 rounded text-center" style={{ backgroundColor: '#1a1714' }}>
          <p className="text-gray-300 text-sm">
            Complete daily tasks to earn bonus rewards! Tasks reset every day at midnight.
          </p>
        </div>

        {/* Daily Tasks List */}
        <div className="space-y-4">
          {difficulties.map((difficulty) => {
            const task = tasks[difficulty];
            const isCompleted = completedTasks[difficulty];

            return (
              <div 
                key={difficulty}
                className="p-4 rounded border"
                style={{
                  borderColor: '#4a443f',
                  backgroundColor: isCompleted ? '#1f2d1f' : '#1a1714',
                  opacity: isCompleted ? 0.7 : 1
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Task Icon */}
                  <div className="flex-shrink-0">
                    <img 
                      src={task.icon} 
                      alt={task.category}
                      className="w-12 h-12"
                      style={{
                        filter: isCompleted ? 'grayscale(100%)' : 'none'
                      }}
                    />
                  </div>

                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="font-semibold text-sm px-2 py-1 rounded"
                        style={{
                          color: DIFFICULTY_COLORS[difficulty],
                          backgroundColor: `${DIFFICULTY_COLORS[difficulty]}20`
                        }}
                      >
                        {DIFFICULTY_LABELS[difficulty]}
                      </span>
                      {isCompleted && (
                        <span className="text-green-500 text-sm font-semibold">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <p className="text-white font-semibold mb-2">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-sm">
                      {task.rewards.map((reward, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded"
                          style={{
                            backgroundColor: '#2d2925',
                            color: reward.type === 'keys' ? '#60a5fa' : '#fbbf24'
                          }}
                        >
                          {reward.type === 'keys' ? '🔑' : '💰'} {reward.description}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Complete Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => onCompleteTask(difficulty)}
                      disabled={isCompleted}
                      className="px-4 py-2 text-white text-sm rounded font-semibold border disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: isCompleted 
                          ? 'linear-gradient(180deg, #4a4440 0%, #3a3530 50%, #2a2520 100%)'
                          : 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                        borderColor: isCompleted ? '#4a443f' : '#3D2F24',
                        transition: 'transform 0.2s, background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {isCompleted ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-6">
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
    </div>
  );
}

