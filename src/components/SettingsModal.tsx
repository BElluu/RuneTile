import React, { useState } from 'react';
import { APP_VERSION } from '@/config/version';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useRunescapeFont: boolean;
  onFontChange: (useRunescapeFont: boolean) => void;
  onResetProgress: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  useRunescapeFont, 
  onFontChange,
  onResetProgress 
}: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setShowResetConfirm(false);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg shadow-2xl p-6 max-w-md w-full"
        style={{
          backgroundColor: '#2d2925',
          border: '2px solid #4a443f'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {!showResetConfirm ? (
          <div className="space-y-6">
            {/* Font Setting */}
            <div className="space-y-2">
              <label className="text-white text-sm font-semibold">Font</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRunescapeFont}
                    onChange={(e) => onFontChange(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{
                      accentColor: '#8B7355'
                    }}
                  />
                  <span className="text-gray-300 text-sm">Use RuneScape Font</span>
                </label>
              </div>
            </div>

            {/* Reset Progress Button */}
            <div className="space-y-2 pt-4 border-t" style={{ borderColor: '#4a443f' }}>
              <label className="text-white text-sm font-semibold">Reset Progress</label>
              <button
                onClick={handleResetClick}
                className="w-full px-4 py-2 text-white rounded text-sm transition-colors border"
                style={{
                  background: 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)',
                  borderColor: '#3D2424'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a4444'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)'}
              >
                Reset Progress
              </button>
            </div>

            {/* Version Display */}
            <div className="pt-4 border-t text-center" style={{ borderColor: '#4a443f' }}>
              <span className="text-gray-400 text-xs">
                Version {APP_VERSION}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reset Confirmation */}
            <div className="space-y-3">
              <p className="text-white text-sm font-semibold">Are you sure you want to reset your progress?</p>
              <p className="text-gray-300 text-xs">
                ⚠️ This operation cannot be undone. All data will be permanently deleted.
              </p>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCancelReset}
                className="flex-1 px-4 py-2 text-white rounded text-sm transition-colors border"
                style={{
                  background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                  borderColor: '#3D2F24'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a5344'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 text-white rounded text-sm transition-colors border"
                style={{
                  background: 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)',
                  borderColor: '#3D2424'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a4444'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)'}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

