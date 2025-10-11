import React, { useState } from 'react';
import { APP_VERSION } from '@/config/version';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useRunescapeFont: boolean;
  onFontChange: (useRunescapeFont: boolean) => void;
  onResetProgress: () => void;
  onViewChangelog: () => void;
  onOpenFeedback: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  useRunescapeFont, 
  onFontChange,
  onResetProgress,
  onViewChangelog,
  onOpenFeedback
}: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(false);

  // Enable animations after component mounts/changes to prevent resize glitch
  React.useEffect(() => {
    setEnableAnimations(false);
    const timer = setTimeout(() => {
      setEnableAnimations(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [showResetConfirm]);

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
          <div className="space-y-5">
            {/* Preferences Section */}
            <div>
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                ⚙️ Preferences
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
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

            {/* Information Section */}
            <div className="pt-3 border-t" style={{ borderColor: '#4a443f' }}>
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                ℹ️ Information
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onViewChangelog();
                    onClose();
                  }}
                  className="px-4 py-2.5 text-white rounded text-sm border text-left flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                    borderColor: '#3D2F24',
                    transition: 'transform 0.2s, background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (enableAnimations) {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (enableAnimations) {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span className="text-lg">📋</span>
                  <div className="flex-1">
                    <div className="font-semibold">View Changelog</div>
                    <div className="text-xs text-gray-400">What's new in v{APP_VERSION}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Help & Feedback Section */}
            <div className="pt-3 border-t" style={{ borderColor: '#4a443f' }}>
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                💬 Help & Feedback
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onOpenFeedback();
                    onClose();
                  }}
                  className="px-4 py-2.5 text-white rounded text-sm border text-left flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
                    borderColor: '#2F5522',
                    transition: 'transform 0.2s, background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (enableAnimations) {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #7DB95C 0%, #5A8F42 50%, #3A6528 100%)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (enableAnimations) {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span className="text-lg">🐛</span>
                  <div className="flex-1">
                    <div className="font-semibold">Report Issue / Suggest Feature</div>
                    <div className="text-xs text-gray-400">Help us improve RuneTiles</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-3 border-t" style={{ borderColor: '#4a443f' }}>
              <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                ⚠️ Danger Zone
              </h3>
              <button
                onClick={handleResetClick}
                className="w-full px-4 py-2.5 text-white rounded text-sm border text-left flex items-center gap-2"
                style={{
                  background: 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)',
                  borderColor: '#3D2424',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #9d5151 0%, #6a4444 50%, #4a2929 100%)';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <span className="text-lg">🗑️</span>
                <div className="flex-1">
                  <div className="font-semibold">Reset Progress</div>
                  <div className="text-xs text-gray-400">Delete all saved data</div>
                </div>
              </button>
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
                className="flex-1 px-4 py-2 text-white rounded text-sm border"
                style={{
                  background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
                  borderColor: '#3D2F24',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 text-white rounded text-sm border"
                style={{
                  background: 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)',
                  borderColor: '#3D2424',
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #9d5151 0%, #6a4444 50%, #4a2929 100%)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (enableAnimations) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #8B4545 0%, #5C3A3A 50%, #3D2424 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
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

