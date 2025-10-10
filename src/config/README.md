# ⚙️ Game Configuration

## 📋 Quick Start

### 🎁 How to Set Rewards? (`rewards.ts`)

**Basic rule:** Each task type has its own rewards section.

```typescript
// Boss Tasks - rewards depend on boss category
BOSS_REWARDS = {
  low: { goldPerKill: 30, keysPerTask: 0 },
  elite: { goldPerKill: 350, keysPerTask: 1 }
}

// Quest Tasks - reward per quest
QUEST_REWARDS = {
  keysPerTask: 1,    // Keys per quest
  goldBonus: 20      // Bonus gold
}

// Skill Tasks - reward for leveling up
SKILL_REWARDS = {
  keysPerTask: 1,
  goldBonus: 0       // 0 = no gold
}

// Grand Exchange Tasks - rewards based on item value
GE_REWARDS = {
  cheap: {
    itemAmount: [50, 100],  // Bulk items
    goldReward: 50,         // Small reward
    keysReward: 0
  },
  medium: {
    itemAmount: [20, 50],
    goldReward: 150,
    keysReward: 0
  },
  expensive: {
    itemAmount: [5, 20],
    goldReward: 350,
    keysReward: 0
  },
  luxury: {
    itemAmount: [1, 5],     // Few expensive items
    goldReward: 600,        // Best reward
    keysReward: 1           // Bonus key!
  }
}

// Slayer Tasks - rewards for slayer masters
SLAYER_REWARDS = {
  tasksRequired: {
    turael: 5,       // Tasks per master
    // ... (other masters)
  },
  keysPerMilestone: 1,  // Keys per milestone
  goldBonus: 0          // Gold per milestone
}

// Start Task - reward for first task
START_TASK_REWARDS = {
  keysPerTask: 1,
  goldBonus: 10
}

// Starting Resources - initial resources
STARTING_RESOURCES = {
  keys: 1,
  gold: 0
}
```

### 🏪 How to Set Shop Prices? (`shop.ts`)

```typescript
// Shop item prices
SHOP_PRICES = {
  key: 1000,  // 1 key = 1000 gold
}

// What's available in shop
SHOP_ITEMS = {
  keys: true,  // Keys can be purchased
}
```

---

## 📚 Detailed Examples

### Example 1: Change Boss Rewards

```typescript
// rewards.ts
export const BOSS_REWARDS = {
  low: {
    goldPerKill: 50,      // ← Was 30, now 50
    keysPerTask: 1,       // ← Adding 1 key!
  },
}
```

### Example 2: Change Key Price in Shop

```typescript
// shop.ts
export const SHOP_PRICES = {
  key: 500,  // ← Was 1000, now 500 (cheaper!)
}
```

### Example 3: Add Gold Reward for Skills

```typescript
// rewards.ts
export const SKILL_REWARDS = {
  keysPerTask: 1,
  goldBonus: 50,  // ← Was 0, now giving 50 gold!
}
```

### Example 4: Change Slayer Master Requirements

```typescript
// rewards.ts
export const SLAYER_REWARDS = {
  tasksRequired: {
    turael: 3,    // ← Was 5, now only 3 tasks!
    duradel: 10,  // ← Was 5, now 10 tasks
    // ...
  },
  keysPerMilestone: 2,  // ← Was 1, now 2 keys!
  goldBonus: 50,        // ← Was 0, now 50 gold
}
```

### Example 5: More Starting Resources

```typescript
// rewards.ts
export const STARTING_RESOURCES = {
  keys: 3,     // ← Was 1, now 3 keys
  gold: 500,   // ← Was 0, now 500 gold
}
```

---

## 🔧 All Parameters

### 🐉 Boss Tasks
- `goldPerKill` - gold per kill
- `keysPerTask` - keys per completed task
- `killCount` - kill count range [min, max]

### ⚔️ Quest Tasks
- `keysPerTask` - keys per quest
- `goldBonus` - bonus gold

### 📊 Skill Tasks
- `keysPerTask` - keys per skill level-up
- `goldBonus` - bonus gold

### 🛒 Grand Exchange Tasks
- `cheap.itemAmount` - bulk amount [50-100] for cheap items (feathers, logs, etc.)
- `cheap.goldReward` - 50 gold reward
- `medium.itemAmount` - moderate amount [20-50] for mid-tier items (coal, runes, etc.)
- `medium.goldReward` - 150 gold reward
- `expensive.itemAmount` - small amount [5-20] for expensive items (dragon items, etc.)
- `expensive.goldReward` - 350 gold reward
- `luxury.itemAmount` - very few [1-5] for luxury items (twisted bow, scythe, etc.)
- `luxury.goldReward` - 600 gold reward + 1 key!
- Items are automatically categorized by tier in `src/data/ge_items.json`

### 🎯 Slayer Tasks
- `tasksRequired.turael` - tasks for Turael (default 5)
- `tasksRequired.spria` - tasks for Spria (default 5)
- `tasksRequired.mazchna` - tasks for Mazchna (default 5)
- `tasksRequired.vannaka` - tasks for Vannaka (default 5)
- `tasksRequired.chaeldar` - tasks for Chaeldar (default 5)
- `tasksRequired.duradel` - tasks for Duradel (default 5)
- `tasksRequired.nieve` - tasks for Nieve (default 5)
- `tasksRequired.konar` - tasks for Konar (default 5)
- `tasksRequired.krystilia` - tasks for Krystilia (default 5)
- `keysPerMilestone` - keys per milestone completion (default 1)
- `goldBonus` - bonus gold per milestone (default 0)

### 📅 Daily Tasks (TODO)
- Per difficulty: `keysPerTask`, `goldBonus`

### 🏪 Shop
- `SHOP_PRICES.key` - price of 1 key in gold
- `SHOP_ITEMS.keys` - whether keys are available

---

## ⚠️ Important Notes

- **One file = all rewards**: Everything in `rewards.ts`
- **Balance**: Remember game economy (key cost vs rewards)
- **0 = none**: Set `0` if you don't want a specific reward
- **Shop separate**: Prices in `shop.ts`, rewards in `rewards.ts`
- **Automatic migration**: Changes to `SLAYER_REWARDS.tasksRequired` are automatically synchronized with saved player data
  - If player had more tasks completed than new requirement, counter is reset
  - If player had fewer, progress is preserved

