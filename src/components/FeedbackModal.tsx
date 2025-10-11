import React, { useState, useEffect } from 'react';
import { APP_VERSION } from '../config/version';
import { canSubmitFeedback, recordFeedbackSubmission, getTimeUntilNextSubmission } from '../utils/feedbackLimiter';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName?: string;
}

type FeedbackType = 'bug' | 'feature';

export function FeedbackModal({ isOpen, onClose, playerName }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  const [issueUrl, setIssueUrl] = useState<string>('');
  const [rateLimitMessage, setRateLimitMessage] = useState<string>('');
  const [waitMinutes, setWaitMinutes] = useState<number>(0);

  // Check rate limit when modal opens
  useEffect(() => {
    if (isOpen && playerName) {
      const check = canSubmitFeedback(playerName);
      if (!check.allowed) {
        setSubmitStatus('rate-limited');
        setRateLimitMessage(check.reason || 'Please wait before submitting again.');
        setWaitMinutes(check.waitMinutes || 0);
      } else {
        setSubmitStatus('idle');
      }
    }
  }, [isOpen, playerName]);

  if (!isOpen) return null;

  const handleClose = () => {
    setDescription('');
    setFeedbackType('bug');
    setSubmitStatus('idle');
    setIssueUrl('');
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (feedbackType === 'bug' && !description.trim()) {
      alert('Please provide a description of the bug.');
      return;
    }

    // Check rate limit before submission
    const rateLimitCheck = canSubmitFeedback(playerName || 'Unknown');
    if (!rateLimitCheck.allowed) {
      setSubmitStatus('rate-limited');
      setRateLimitMessage(rateLimitCheck.reason || 'Please wait before submitting again.');
      setWaitMinutes(rateLimitCheck.waitMinutes || 0);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const debugData = feedbackType === 'bug' ? gatherDebugData() : null;

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          description: description.trim() || '(No description provided)',
          playerName: playerName || 'Unknown',
          debugData: debugData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIssueUrl(data.issueUrl || '');
        setSubmitStatus('success');
        
        // Record successful submission for rate limiting
        recordFeedbackSubmission(playerName || 'Unknown', feedbackType);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const gatherDebugData = () => {
    try {
      return {
        gameState: localStorage.getItem('runeTiles_gameState'),
        slayerMasters: localStorage.getItem('runeTiles_slayerMasters'),
        dailyTasks: localStorage.getItem('runeTiles_dailyTasks'),
        appVersion: APP_VERSION,
        lastSeenVersion: localStorage.getItem('runeTiles_lastSeenVersion'),
        useRunescapeFont: localStorage.getItem('runeTiles_useRunescapeFont'),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
      };
    } catch (error) {
      return { error: 'Failed to gather debug data' };
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleClose}
    >
      <div 
        className="rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#2d2925',
          borderColor: '#4a443f',
          border: '3px solid',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              🐛 Report Issue / Suggest Feature
            </h2>
            <p className="text-gray-400 text-sm">
              Help improve RuneTiles by reporting bugs or suggesting new features
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {submitStatus === 'idle' && (
          <>
            {/* Feedback Type Selection */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-3">What would you like to do?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFeedbackType('bug')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'bug'
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-gray-600 bg-gray-700/20 hover:border-gray-500'
                  }`}
                >
                  <div className="text-3xl mb-2">🐛</div>
                  <div className="font-bold text-white mb-1">Report Bug</div>
                  <div className="text-xs text-gray-400">
                    Something isn't working correctly
                  </div>
                </button>

                <button
                  onClick={() => setFeedbackType('feature')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'feature'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 bg-gray-700/20 hover:border-gray-500'
                  }`}
                >
                  <div className="text-3xl mb-2">💡</div>
                  <div className="font-bold text-white mb-1">Suggest Feature</div>
                  <div className="text-xs text-gray-400">
                    Idea for improvement
                  </div>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                Description {feedbackType === 'bug' ? (
                  <span className="text-red-400">*</span>
                ) : (
                  <span className="text-gray-400 font-normal">(Optional)</span>
                )}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  feedbackType === 'bug'
                    ? "Please describe the bug:\n\n• What happened?\n• What did you expect to happen?\n• When did it occur?\n\nExample: When I clicked the Complete button on tile with quest task, the game froze and I lost my progress."
                    : "What feature would you like to see?\n\nExample: It would be great if we could highlight task tiles by difficulty level."
                }
                className="w-full p-3 rounded text-white resize-none"
                style={{
                  backgroundColor: '#1a1714',
                  border: feedbackType === 'bug' && !description.trim() 
                    ? '2px solid #ef4444' 
                    : '2px solid #4a443f',
                  minHeight: '150px',
                  fontFamily: 'inherit'
                }}
                maxLength={2000}
              />
              <div className="flex justify-between items-center mt-1">
                {feedbackType === 'bug' && !description.trim() && (
                  <span className="text-xs text-red-400">Required for bug reports</span>
                )}
                <div className={`text-xs text-gray-400 ${feedbackType === 'bug' && !description.trim() ? 'ml-auto' : 'w-full text-right'}`}>
                  {description.length}/2000 characters
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#1a1714' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">
                    {feedbackType === 'bug' ? (
                      <>
                        <strong className="text-white">For bug reports:</strong> We'll automatically include your game state 
                        (localStorage data) to help us reproduce and fix the issue.
                      </>
                    ) : (
                      <>
                        <strong className="text-white">For feature suggestions:</strong> Your idea will be reviewed and 
                        considered for future updates. We appreciate all feedback!
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    This will create a public issue on GitHub. No personal information is shared.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-4 text-white font-bold rounded transition-all duration-200"
              style={{
                background: isSubmitting 
                  ? 'linear-gradient(180deg, #555 0%, #333 100%)'
                  : 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
                border: '3px solid',
                borderColor: isSubmitting ? '#666' : '#2F5522',
                borderTopColor: isSubmitting ? '#888' : '#8FBF6F',
                borderLeftColor: isSubmitting ? '#888' : '#8FBF6F',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #7DB95C 0%, #5A8F42 50%, #3A6528 100%)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : `Submit ${feedbackType === 'bug' ? 'Bug Report' : 'Feature Request'}`}
            </button>
          </>
        )}

        {submitStatus === 'success' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Thank You!</h3>
            <p className="text-gray-300 mb-4">
              Your {feedbackType === 'bug' ? 'bug report' : 'feature suggestion'} has been submitted successfully.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              {issueUrl && (
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 text-white font-bold rounded transition-all duration-200"
                  style={{
                    background: 'linear-gradient(180deg, #4A9EFF 0%, #2B7FD9 50%, #1A5FAA 100%)',
                    border: '3px solid',
                    borderColor: '#1A5FAA',
                    borderTopColor: '#6BB4FF',
                    borderLeftColor: '#6BB4FF',
                    boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #5AAFFF 0%, #3B8FE9 50%, #2A6FBA 100%)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #4A9EFF 0%, #2B7FD9 50%, #1A5FAA 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  🔗 View Issue on GitHub
                </a>
              )}
              
              <button
                onClick={handleClose}
                className="px-6 py-3 text-white font-bold rounded transition-all duration-200"
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
                Close
              </button>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Submission Failed</h3>
            <p className="text-gray-300 mb-4">
              We couldn't submit your feedback. Please try again or report directly on GitHub.
            </p>
            <a
              href="https://github.com/BElluu/RuneTiles/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 text-white font-bold rounded"
              style={{
                background: 'linear-gradient(180deg, #6B9E4E 0%, #4A7A34 50%, #2F5522 100%)',
                textDecoration: 'none'
              }}
            >
              Report on GitHub
            </a>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="block w-full mt-3 px-6 py-2 text-gray-400 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {submitStatus === 'rate-limited' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">Please Wait</h3>
            <p className="text-gray-300 mb-4">
              {rateLimitMessage}
            </p>
            <div className="p-4 rounded mb-6" style={{ backgroundColor: '#1a1714' }}>
              <p className="text-sm text-gray-400">
                <strong className="text-white">Why the limit?</strong><br/>
                To prevent spam and ensure quality feedback, there's a 30-minute cooldown between submissions.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-3 text-white font-bold rounded transition-all duration-200"
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
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

