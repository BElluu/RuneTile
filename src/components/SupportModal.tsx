import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg p-8 max-w-lg w-full mx-4"
        style={{
          backgroundColor: '#2d2925',
          borderColor: '#4a443f',
          border: '3px solid',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Coffee Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '3px solid rgba(251, 191, 36, 0.4)'
            }}
          >
            <span className="text-5xl">☕</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Support RuneTiles
        </h2>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <p className="text-gray-300 text-base leading-relaxed text-center">
              RuneTiles is <strong className="text-white">completely free</strong> and will <strong className="text-white">always remain free</strong>. 
            </p>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <p className="text-gray-300 text-base leading-relaxed text-center">
              <strong className="text-yellow-400">Your enjoyment is support enough!</strong> 🎮
            </p>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
            <p className="text-gray-300 text-base leading-relaxed">
              If you'd like to support development with a voluntary donation, it's deeply appreciated but <strong className="text-white">never required</strong>. 
              Every contribution helps motivate continued development and keeps the project alive.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Buy Me a Coffee Button */}
          <a
            href="https://buymeacoffee.com/belluu"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 text-white text-center font-bold rounded transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #FFDD00 0%, #FBB034 100%)',
              color: '#000000',
              border: '2px solid #FBB034',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              textShadow: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(251, 191, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            ☕ Buy Me a Coffee (Optional)
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white font-bold rounded transition-all duration-200"
            style={{
              background: 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
              border: '2px solid',
              borderColor: '#2F5522',
              borderTopColor: '#8FBF6F',
              borderLeftColor: '#8FBF6F',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
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
            Continue Playing!
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            100% of donations go directly to supporting development
          </p>
        </div>
      </div>
    </div>
  );
}

