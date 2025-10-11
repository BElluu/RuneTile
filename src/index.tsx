import { serve } from "bun";
import index from "./index.html";
import { readFile } from "fs/promises";
import { join } from "path";
import { formatFeedbackAsGitHubIssue } from "./utils/githubIssueFormatter";

const server = serve({
  routes: {
    // Serve static assets
    "/src/assets/*": async (req) => {
      const url = new URL(req.url);
      const filePath = join(process.cwd(), url.pathname);
      try {
        const file = await readFile(filePath);
        const ext = filePath.split('.').pop()?.toLowerCase();
        const contentType = ext === 'png' ? 'image/png' :
          ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
            ext === 'gif' ? 'image/gif' :
              ext === 'svg' ? 'image/svg+xml' :
                'application/octet-stream';

        return new Response(new Uint8Array(file), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      } catch (error) {
        return new Response('File not found', { status: 404 });
      }
    },

    "/*": index,

    "/api/hiscores/:player": async req => {
      const player = req.params.player;
      try {
        const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(player)}`;
        const res = await fetch(url);

        if (!res.ok) {
          return Response.json({ error: "Player not found" }, { status: 404 });
        }

        const text = await res.text();
        const lines = text.split('\n');
        const skills = [
          'overall',
          'attack',
          'defence',
          'strength',
          'hitpoints',
          'ranged',
          'prayer',
          'magic',
          'cooking',
          'woodcutting',
          'fletching',
          'fishing',
          'firemaking',
          'crafting',
          'smithing',
          'mining',
          'herblore',
          'agility',
          'thieving',
          'slayer',
          'farming',
          'runecraft',
          'hunter',
          'construction',
        ];

        const result: Record<string, number> = {};
        lines.forEach((line: string, i: number) => {
          const [rank, level] = line.split(',');
          if (skills[i]) result[skills[i]] = parseInt(level ?? '1');
        });

        return Response.json(result);
      } catch (error) {
        return Response.json({ error: "Failed to fetch player data" }, { status: 500 });
      }
    },

    "/api/quests/:player": async req => {
      const player = req.params.player;
      try {
        const url = `https://apps.runescape.com/runemetrics/quests?user=${encodeURIComponent(player)}`;
        const res = await fetch(url);

        if (!res.ok) {
          return Response.json({ error: "Player not found" }, { status: 404 });
        }

        const quests = await res.json();
        return Response.json(quests);
      } catch (error) {
        return Response.json({ error: "Failed to fetch quest data" }, { status: 500 });
      }
    },

    "/api/feedback": async req => {
      if (req.method !== 'POST') {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
      }

      try {
        const body = await req.json();
        const { type, description, playerName, debugData, timestamp } = body;

        // Validate input
        if (!type || !['bug', 'feature'].includes(type)) {
          return Response.json({ error: 'Invalid feedback type' }, { status: 400 });
        }

        // GitHub API configuration
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER || 'BElluu';
        const GITHUB_REPO = process.env.GITHUB_REPO || 'RuneTiles';

        if (!GITHUB_TOKEN) {
          console.error('GITHUB_TOKEN not configured');
          return Response.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Format feedback as GitHub issue
        const issueData = formatFeedbackAsGitHubIssue({
          type,
          description,
          playerName,
          debugData,
          timestamp,
        });

        // Create GitHub issue
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github+json',
              'Content-Type': 'application/json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify(issueData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('GitHub API error:', response.status, errorText);
          return Response.json({ error: 'Failed to create GitHub issue' }, { status: 500 });
        }

        const createdIssue = await response.json();

        return Response.json({ 
          success: true, 
          issueUrl: createdIssue.html_url,
          issueNumber: createdIssue.number 
        });

      } catch (error) {
        console.error('Error handling feedback:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
