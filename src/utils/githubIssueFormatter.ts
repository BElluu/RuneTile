/**
 * Formats feedback data into a GitHub issue structure
 */

interface DebugData {
  gameState: string | null;
  slayerMasters: string | null;
  dailyTasks: string | null;
  appVersion: string;
  lastSeenVersion: string | null;
  useRunescapeFont: string | null;
  userAgent: string;
  screenResolution: string;
  language: string;
}

interface FeedbackData {
  type: 'bug' | 'feature';
  description: string;
  playerName: string;
  debugData?: DebugData | null;
  timestamp: string;
}

interface GitHubIssue {
  title: string;
  body: string;
  labels: string[];
}

/**
 * Creates a GitHub issue object from feedback data
 */
export function formatFeedbackAsGitHubIssue(feedback: FeedbackData): GitHubIssue {
  const { type, description, playerName, debugData, timestamp } = feedback;

  const title = type === 'bug' 
    ? `[Bug Report] ${description.substring(0, 60)}${description.length > 60 ? '...' : ''}`
    : `[Feature Request] ${description.substring(0, 60)}${description.length > 60 ? '...' : ''}`;

  const labels = type === 'bug' ? ['bug', 'user-reported'] : ['enhancement', 'user-reported'];

  let body = `## ${type === 'bug' ? 'Bug Report' : 'Feature Request'}\n\n`;
  body += `**Submitted by:** ${playerName}\n`;
  body += `**Timestamp:** ${timestamp}\n\n`;
  body += `### Description\n\n${description}\n\n`;

  if (type === 'bug' && debugData) {
    body += formatDebugInformation(debugData);
  }

  body += `\n---\n`;
  body += `*This issue was automatically created via the in-app feedback system.*`;

  return { title, body, labels };
}

/**
 * Formats debug data into a readable markdown section
 */
function formatDebugInformation(debugData: DebugData): string {
  let section = `### Debug Information\n\n`;
  
  section += `**User Agent:** ${debugData.userAgent || 'N/A'}\n`;
  section += `**Screen Resolution:** ${debugData.screenResolution || 'N/A'}\n`;
  section += `**Language:** ${debugData.language || 'N/A'}\n`;
  section += `**App Version:** ${debugData.appVersion || 'N/A'}\n\n`;

  section += `<details>\n`;
  section += `<summary>Game State (localStorage)</summary>\n\n`;
  section += `\`\`\`json\n`;
  
  try {
    const gameStateData = {
      gameState: debugData.gameState ? JSON.parse(debugData.gameState) : null,
      slayerMasters: debugData.slayerMasters ? JSON.parse(debugData.slayerMasters) : null,
      dailyTasks: debugData.dailyTasks ? JSON.parse(debugData.dailyTasks) : null,
      useRunescapeFont: debugData.useRunescapeFont,
      lastSeenVersion: debugData.lastSeenVersion,
    };
    
    section += JSON.stringify(gameStateData, null, 2);
  } catch (error) {
    section += 'Error parsing debug data';
  }
  
  section += `\n\`\`\`\n`;
  section += `</details>\n`;

  return section;
}

