import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
}

export function WelcomeModal({ isOpen, onClose, playerName }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-8 max-w-2xl w-full mx-4"
        style={{
          backgroundColor: '#2d2925',
          borderColor: '#4a443f',
          border: '3px solid',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/src/assets/rune_tiles_logo_nobc.png" 
            alt="RuneTiles" 
            className="w-32 h-32"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Welcome to RuneTiles!
        </h2>

        {/* Greeting */}
        <p className="text-xl text-center mb-6" style={{ color: '#fbbf24' }}>
          Hello, <span className="font-bold">{playerName}</span>!
        </p>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>🎮</span> What is RuneTiles?
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              RuneTiles is an interactive companion app for Old School RuneScape that helps you escape the monotony of grinding. 
              Unlock tiles, complete tasks, and discover new ways to enjoy OSRS!
            </p>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>🗝️</span> How to Play
            </h3>
            <ul className="text-gray-300 text-base space-y-2">
              <li><strong>Use keys</strong> to unlock new tiles on the board</li>
              <li><strong>Complete tasks</strong> to earn keys and gold</li>
              <li><strong>Explore daily challenges</strong> and Slayer tasks</li>
              <li><strong>Buy keys</strong> with gold in the shop</li>
              <li><strong>Track your progress</strong> and watch your adventure grow!</li>
            </ul>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>✨</span> Getting Started
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              You start with <strong className="text-blue-400">1 key</strong> and <strong className="text-yellow-400">50 gold</strong>. 
              Click on the center tile to begin your adventure. Complete the task in OSRS, then return here to claim your rewards!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">
            RuneScape® and all related content are the property of Jagex Ltd. This site is not affiliated with or endorsed by Jagex.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-4 text-white text-lg font-bold rounded transition-all duration-200"
          style={{
            background: 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
            border: '3px solid',
            borderColor: '#2F5522',
            borderTopColor: '#8FBF6F',
            borderLeftColor: '#8FBF6F',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #7DB95C 0%, #5A8F42 50%, #3A6528 100%)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Start My Adventure! 🚀
        </button>
      </div>
    </div>
  );
}

