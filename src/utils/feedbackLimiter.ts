/**
 * Rate limiting and cooldown for feedback system
 * Prevents spam by limiting feedback submissions per player
 */

const FEEDBACK_STORAGE_KEY = 'runeTiles_feedbackHistory';
const COOLDOWN_MINUTES = 30; // 30 minutes between submissions

interface FeedbackSubmission {
  playerName: string;
  timestamp: number;
  type: 'bug' | 'feature';
}

function getSubmissionHistory(): FeedbackSubmission[] {
  try {
    const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSubmissionHistory(history: FeedbackSubmission[]): void {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save feedback history:', error);
  }
}

function cleanupOldSubmissions(history: FeedbackSubmission[]): FeedbackSubmission[] {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  return history.filter(submission => submission.timestamp > oneHourAgo);
}

export function canSubmitFeedback(playerName: string): {
  allowed: boolean;
  reason?: string;
  waitMinutes?: number;
} {
  const history = cleanupOldSubmissions(getSubmissionHistory());
  const playerSubmissions = history.filter(s => s.playerName === playerName);

  if (playerSubmissions.length > 0) {
    const lastSubmission = playerSubmissions[playerSubmissions.length - 1]!;
    const timeSinceLastSubmission = Date.now() - lastSubmission.timestamp;
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

    if (timeSinceLastSubmission < cooldownMs) {
      const remainingMs = cooldownMs - timeSinceLastSubmission;
      const waitMinutes = Math.ceil(remainingMs / (60 * 1000));
      
      return {
        allowed: false,
        reason: `Please wait ${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''} before submitting another report.`,
        waitMinutes
      };
    }
  }

  return { allowed: true };
}

export function recordFeedbackSubmission(playerName: string, type: 'bug' | 'feature'): void {
  const history = cleanupOldSubmissions(getSubmissionHistory());
  
  history.push({
    playerName,
    timestamp: Date.now(),
    type
  });

  saveSubmissionHistory(history);
}

export function getTimeUntilNextSubmission(playerName: string): number | null {
  const history = cleanupOldSubmissions(getSubmissionHistory());
  const playerSubmissions = history.filter(s => s.playerName === playerName);

  if (playerSubmissions.length === 0) return null;

  const lastSubmission = playerSubmissions[playerSubmissions.length - 1]!;
  const timeSinceLastSubmission = Date.now() - lastSubmission.timestamp;
  const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

  if (timeSinceLastSubmission >= cooldownMs) return null;

  const remainingMs = cooldownMs - timeSinceLastSubmission;
  return Math.ceil(remainingMs / (60 * 1000));
}

