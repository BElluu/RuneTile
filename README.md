<div align="center">
  <a href="https://runetiles.app">
  <img src="https://github.com/BElluu/RuneTiles/blob/master/src/assets/rune_tiles_logo_nobc.png" alt="RuneTiles Logo" width="400"/>
  </a>
</div>

> A roguelike tile-based progression game inspired by Old School RuneScape

![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![RuneScape Theme](https://img.shields.io/badge/Theme-RuneScape-orange)
![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🗺️ About

RuneTiles is a unique browser-based game that combines the progression mechanics of Old School RuneScape with roguelike tile exploration. Start at tile (0,0) and unlock adjacent tiles using keys earned from completing tasks. Each tile presents a randomly generated challenge based on your OSRS character's stats!

**💡 The Idea**: After returning to Old School RuneScape after a 20-year break, the initial excitement quickly turned into monotony. RuneTiles was born to solve this problem - providing fresh, varied gameplay ideas and goals every day. Instead of grinding the same content endlessly, let the game surprise you with diverse challenges that encourage you to explore different aspects of Old School RuneScape!

### ✨ Features

- **🔗 OSRS Integration**: Connect with your real Old School RuneScape character with live stats
- **🗺️ Tile-Based Exploration**: Unlock tiles in any direction - north, south, east, or west
- **🎯 Dynamic Tasks**: Randomized skill, quest, boss, and Grand Exchange challenges
- **🔑 Key Economy**: Earn keys by completing tasks to unlock new tiles
- **💰 Gold System**: Collect gold and spend it in the in-game shop
- **🏪 In-Game Shop**: Purchase keys using gold to accelerate your progress
- **📅 Daily Tasks**: 4 rotating daily challenges (Easy/Medium/Hard/Elite) with bigger rewards
- **💀 Slayer Masters**: Progress through 9 different Slayer Masters with quest-based replacements
- **📊 Real Stats**: Tasks generated based on your actual OSRS levels (auto-refresh every 15 minutes)
- **🎨 Beautiful UI**: Modern design with gradients, animations, and smooth hover effects
- **⚙️ Customizable**: Toggle between RuneScape and system fonts in settings
- **💾 Auto-Save**: Your progress is automatically saved locally in your browser
- **🔒 Privacy First**: All data stored locally - no external servers, no tracking

### 🎲 Task Types

- **Skills**: Train your skills from current level by several levels (dynamic difficulty)
- **Quests**: Complete available OSRS quests based on your Quest Points
- **Bosses**: Defeat bosses (50+ bosses across 4 difficulty tiers: Low/Mid/High/Elite)
- **Grand Exchange**: Buy specific items (300+ items across 4 price tiers)
- **Slayer Tasks**: Complete assignments for 9 different Slayer Masters
- **Daily Tasks**: 4 rotating daily challenges that refresh every 24 hours

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.com) runtime installed
- An Old School RuneScape account

### Installation

```bash
# Clone the repository
git clone git@github.com:BElluu/RuneTiles.git
cd RuneTiles

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun dev
```

The game will be available at `http://localhost:3000`

### Production

```bash
# Build and run for production
bun start
```

## 🎮 How to Play

1. **Enter Your OSRS Name**: Start by entering your Old School RuneScape character name
2. **Start at (0,0)**: You begin at the center tile with 1 key and 50 gold
3. **Complete Tasks**: 
   - Complete the "Start Your Adventure" task to earn your first rewards
   - Each tile has a unique task based on your character's stats
   - Tasks appear in hover panels when you mouse over a tile
4. **Unlock Tiles**: 
   - Click on adjacent tiles to unlock them (costs 1 key per tile)
   - Only tiles next to completed tiles can be unlocked
5. **Earn Rewards**: 
   - Complete tasks to earn keys and gold
   - Rewards are shown in the hover panel for unlocked tiles
6. **Daily Challenges**: Complete 4 daily tasks for bonus rewards
7. **Slayer Progression**: Track your progress with 9 different Slayer Masters
8. **Shop**: Spend gold to buy additional keys when needed
9. **Explore**: Discover new challenges as you expand your tile map!

### 🎯 Economy & Progression

**Keys** 🔑
- Used to unlock new tiles (1 key per tile)
- Earned by completing tile tasks, daily tasks, and Slayer milestones
- Elite difficulty tasks award bonus keys
- Can be purchased in the shop with gold

**Gold** 💰
- Earned from completing tasks (more gold for harder tasks)
- Spent in the shop to buy keys
- Boss tasks are the primary gold source
- Grand Exchange tasks provide tier-based gold rewards

**Daily Tasks** 📅
- 4 new challenges every day (Easy/Medium/Hard/Elite)
- Bigger rewards than regular tile tasks
- Seeded daily rotation ensures consistency

**Slayer Masters** 💀
- 9 masters from Turael to Krystilia
- Each requires a set number of tasks to complete
- Earn keys and gold for completing milestones
- Quest-based replacements (e.g., Nieve → Steve after Monkey Madness II)

## 🛠️ Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS + Custom CSS with gradients and animations
- **UI Components**: Custom pixel-art inspired design with smooth transitions
- **State Management**: React Hooks + Local Storage (browser-based persistence)
- **API Integration**: 
  - OSRS Hiscores API (player stats with 15-minute cache)
  - RuneMetrics API (quest completion data)

## 🎨 Features in Detail

### Visual Design
- Modern gradient-based UI with backdrop blur effects
- Pixel-art style icons and UI elements (28×28px)
- Authentic RuneScape font support (toggle in settings)
- Smooth animations:
  - Hover effects on menu buttons (scale + glow)
  - Fade-in animations for newly unlocked tiles
  - Animated tile buttons (Unlock/Complete)
- Responsive tile grid with zoom and pan controls
- Color-coded elements (blue for keys, gold for currency, purple for daily tasks)

### Game Mechanics
- **Deterministic Randomness**: Tasks are seeded based on tile position and player name
- **No Duplicates**: Each visible tile has a unique task
- **Smart Generation**: Tasks adapt to your character's progress and quest completion
- **Visibility System**: Only adjacent tiles to completed tiles can be unlocked
- **Auto-Save**: Progress saved to localStorage after every action
- **Auto-Refresh**: Stats refresh automatically every 15 minutes (checked every minute)
- **Modular Architecture**: Task generation separated by type (skills/quests/bosses/GE)

### User Interface
- **Welcome Modal**: First-time player guide with game instructions
- **Changelog Modal**: Automatic version update notifications
- **Skills Modal**: View all your OSRS stats and total level
- **Slayer Masters Modal**: Track progress with all masters (sorted by difficulty)
- **Daily Tasks Modal**: 4 daily challenges with difficulty indicators
- **Shop Modal**: Purchase keys with adjustable quantity
- **Settings Modal**: Font toggle, progress reset, changelog viewer
- **Hover Panels**: Task details and rewards shown on tile hover

## 📝 API Integration

RuneTiles integrates with official Old School RuneScape APIs:
- **Hiscores API**: Fetches player skill levels (with 15-minute client-side cache)
- **RuneMetrics API**: Retrieves quest completion data (cached with quest completion status)

All data is fetched in real-time when you start a new game and auto-refreshes every 15 minutes while playing.

## 🔒 Privacy & Data

- **100% Local Storage**: All game progress is stored in your browser's localStorage
- **No Database**: We don't have any external database or servers storing your data
- **No Tracking**: Zero analytics, no cookies, no user tracking
- **No Account Required**: Just your OSRS character name - no registration, no login
- **CORS Proxy**: OSRS API calls are proxied through the local dev server for CORS handling
- **Your Data, Your Control**: Clear browser data to reset everything

**What we store locally:**
- Your OSRS character name
- Game progress (unlocked/completed tiles)
- Keys and gold balance
- Daily tasks completion status
- Slayer Masters progress
- Last stats fetch timestamp
- Font preference
- Last seen app version

## 📜 License & Legal

### Code License

This project is licensed under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

**This means:**
- ✅ You can use, share, and modify the code for **non-commercial purposes**
- ✅ You must give **appropriate credit** and indicate changes made
- ✅ Modified versions must be shared under the **same license**
- ❌ **Commercial use is not permitted** without explicit permission

See [LICENSE.md](LICENSE.md) for complete details.

### Graphics License

All graphics and visual assets are licensed under **CC BY-NC-SA 3.0**.

### RuneScape® Content

RuneScape® and all related content are the property of **Jagex Ltd**. This project is a fan-made creation and is **not affiliated with or endorsed by Jagex**. All RuneScape content is used under fair use principles for educational and entertainment purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest new features or improvements
- 🔧 Submit pull requests (please read contribution guidelines)
- 📖 Improve documentation
- 🎨 Add new boss data, items, or quest information
- ⚖️ Help balance the game economy

**For developers:**
- Code is modular - task generators are in `src/utils/generators/`
- Balance configuration is centralized in `src/config/rewards.ts` and `src/config/shop.ts`
- Check out `src/config/README.md` for configuration guidelines

## 🙏 Acknowledgments

- Jagex Ltd. for creating Old School RuneScape
- The OSRS community for inspiration and feedback
- All contributors and players who help improve RuneTiles

## ☕ Support

RuneTiles is **completely free** and will always remain free. If you enjoy the app and want to support development, voluntary donations are appreciated but never required!

<a href="https://buymeacoffee.com/belluu" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50" />
</a>

Your support helps keep the project alive and motivates continued development - but enjoying the game is support enough! 🎮

---

**Made with ❤️ for the OSRS community by a player who returned after 20 years**

*No more monotonous grinding - just pure adventure! 🎮*
