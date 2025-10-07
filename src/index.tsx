import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

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
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
