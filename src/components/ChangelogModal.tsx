import React from 'react';
import type { ChangelogEntry } from '@/config/version';
import { APP_VERSION } from '@/config/version';

interface ChangelogModalProps {
  changelog: ChangelogEntry[];
  onClose: () => void;
}

const CATEGORY_ICONS = {
  feature: '✨',
  improvement: '⚡',
  bugfix: '🐛',
  balance: '⚖️'
};

const CATEGORY_LABELS = {
  feature: 'New Feature',
  improvement: 'Improvement',
  bugfix: 'Bug Fix',
  balance: 'Balance Change'
};

const CATEGORY_COLORS = {
  feature: '#4ade80',      // green
  improvement: '#60a5fa',  // blue
  bugfix: '#f87171',       // red
  balance: '#fbbf24'       // yellow
};

export function ChangelogModal({ changelog, onClose }: ChangelogModalProps) {
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
        <div className="flex items-center gap-3 pb-3 mb-6 border-b" style={{ borderColor: '#4a443f' }}>
          <h2 className="text-2xl font-bold text-white">
            🎉 What's New in v{APP_VERSION}
          </h2>
        </div>

        {/* Changes List */}
        <ul className="space-y-3">
          {changelog.map((change, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-xl mt-0.5">
                {CATEGORY_ICONS[change.category]}
              </span>
              <div className="flex-1">
                <span 
                  className="font-semibold"
                  style={{ color: CATEGORY_COLORS[change.category] }}
                >
                  {CATEGORY_LABELS[change.category]}:
                </span>
                <span className="text-gray-300 ml-2">
                  {change.description}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: '#4a443f' }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-white rounded transition-all duration-200 border font-semibold"
            style={{
              background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)',
              borderColor: '#3D2F24'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #9d8161 0%, #6a5344 50%, #4a3829 100%)';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 50%, #3D2F24 100%)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

