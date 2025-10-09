import { serve } from "bun";
import index from "./index.html";
import { readFile } from "fs/promises";
import { join } from "path";

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
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
