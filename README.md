# 🎮 RuneTile

> A roguelike tile-based progression game inspired by Old School RuneScape

![RuneScape Theme](https://img.shields.io/badge/Theme-RuneScape-orange)
![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🗺️ About

RuneTile is a unique browser-based game that combines the progression mechanics of Old School RuneScape with roguelike tile exploration. Start at tile (0,0) and unlock adjacent tiles using keys earned from completing tasks. Each tile presents a randomly generated challenge based on your OSRS character's stats!

**💡 The Idea**: Born from the desire to break free from the monotony of repetitive OSRS gameplay, RuneTile provides fresh, varied gameplay ideas and goals. Instead of grinding the same content endlessly, let the game surprise you with diverse challenges that encourage you to explore different aspects of Old School RuneScape!

### ✨ Features

- **🔗 OSRS Integration**: Connect with your real Old School RuneScape character
- **🗺️ Tile-Based Exploration**: Unlock tiles in any direction - north, south, east, or west
- **🎯 Dynamic Tasks**: Randomized skill, quest, boss, and slayer challenges
- **🔑 Key Economy**: Earn keys by completing tasks to unlock new tiles
- **💰 Gold System**: Collect gold as rewards for completing challenges
- **📊 Real Stats**: Tasks are generated based on your actual OSRS levels and achievements
- **🎨 Authentic Theme**: Pixel-perfect RuneScape-inspired UI with custom fonts
- **⚙️ Customizable**: Toggle between RuneScape and system fonts in settings
- **💾 Auto-Save**: Your progress is automatically saved to local storage

### 🎲 Task Types

- **Skills**: Train your skills to specific levels
- **Quests**: Complete OSRS quests you haven't finished yet
- **Bosses**: Defeat challenging bosses
- **Grand Exchange**: Special trading challenges
- **Daily Tasks**: Time-limited objectives

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.com) runtime installed
- An Old School RuneScape account

### Installation

```bash
# Clone the repository
git clone git@github.com:BElluu/RuneTile.git
cd RuneTile

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
2. **Start at (0,0)**: You begin at the center tile with a "Start Your Adventure" task
3. **Complete Tasks**: Each tile has a unique task to complete
4. **Unlock Tiles**: Use keys to unlock adjacent tiles (costs 1 key per tile)
5. **Earn Rewards**: Complete tasks to earn gold and keys
6. **Explore**: Discover new challenges as you expand your tile map!

### 🎯 Task Completion

Tasks are randomly generated and unique to each tile. They include:
- Skill training requirements
- Quest completions
- Boss kills
- Slayer assignments
- And more!

### 🗝️ Key System

- Complete any task to potentially earn keys
- Keys are required to unlock new tiles
- Manage your keys wisely to explore efficiently

### 💰 Gold System

- Gold is earned by completing tasks
- Higher difficulty tasks reward more gold
- Track your wealth in the top-left corner

## 🛠️ Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Custom pixel-art inspired design
- **State Management**: React Hooks + Local Storage
- **API Integration**: OSRS Hiscores & RuneMetrics APIs

## 🎨 Features in Detail

### Visual Design
- Dark dungeon-themed color palette
- Pixel-art style icons and UI elements
- Authentic RuneScape font support
- Smooth animations and hover effects
- Responsive tile grid with zoom and pan controls

### Game Mechanics
- **Deterministic Randomness**: Tasks are seeded based on tile position and player name
- **No Duplicates**: Each visible tile has a unique task
- **Smart Generation**: Tasks adapt to your character's progress
- **Visibility System**: Only adjacent tiles can be unlocked

### Settings
- Toggle RuneScape font on/off
- Reset progress with confirmation
- Font preferences persist across sessions

## 📝 API Integration

RuneTile integrates with official Old School RuneScape APIs:
- **Hiscores API**: Fetches player skill levels
- **RuneMetrics API**: Retrieves quest completion data

All data is fetched in real-time when you start a new game.

## 🔒 Privacy & Data

- All game progress is stored locally in your browser
- No personal data is collected or transmitted to external servers
- OSRS API calls are proxied through the local server for CORS handling

## 📜 Legal

RuneScape® and all related content are the property of Jagex Ltd. This project is a fan-made creation and is not affiliated with or endorsed by Jagex. All RuneScape content is used under fair use for educational and entertainment purposes.

This project is open source under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- Jagex Ltd. for creating Old School RuneScape
- The OSRS community for inspiration
- All contributors and players

---

**Made with ❤️ for the OSRS community**

*Happy grinding! 🎮*
