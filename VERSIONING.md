# 📦 Versioning & Changelog System

## 🎯 How It Works

RuneTiles uses semantic versioning (`MAJOR.MINOR.PATCH`) to track releases:
- **MAJOR**: Breaking changes or major features
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes and small improvements

### Automatic Changelog Detection

When a player launches the game:
1. The app checks their `localStorage` for the last seen version
2. If the version is different, it shows a changelog modal with current changes
3. The new version is saved, so the changelog only shows once

---

## 🚀 How to Release a New Version

### Step 1: Update Version Number

Edit `src/config/version.ts`:

```typescript
export const APP_VERSION = '1.1.0'; // ← Update this
```

### Step 2: Replace Current Changelog

Replace `CURRENT_CHANGELOG` with the new version's changes:

```typescript
export const CURRENT_CHANGELOG: ChangelogEntry[] = [
  {
    category: 'feature',  // or 'improvement', 'bugfix', 'balance'
    description: 'Added new boss tasks system'
  },
  {
    category: 'bugfix',
    description: 'Fixed hover not working on mobile'
  },
  {
    category: 'improvement',
    description: 'Improved performance on large maps'
  }
];
```

**Important**: Only keep the **current version's** changes. No need to maintain history!

### Change Categories

- **`feature`** ✨ - New features (green)
- **`improvement`** ⚡ - Improvements to existing features (blue)
- **`bugfix`** 🐛 - Bug fixes (red)
- **`balance`** ⚖️ - Game balance changes (yellow)

---

## 📋 Version Display

Players can view the current version in:
- Settings menu (bottom of modal)
- Changelog modal header (shown automatically on version change)

---

## 🔧 Technical Details

### Files Structure

```
src/
├── config/
│   └── version.ts          ← Version & current changelog
├── components/
│   ├── ChangelogModal.tsx  ← Changelog UI component
│   └── SettingsModal.tsx   ← Shows version number
└── utils/
    └── gameStorage.ts      ← Version storage functions
```

### localStorage Keys

- `runeTiles_version` - Last seen version by player

### Simple Version Check

```typescript
// Compare saved version with current
if (lastSeenVersion !== APP_VERSION) {
  // Show changelog
}
```

---

## 📝 Example Release

### Releasing v1.2.0

**1. Update `version.ts`:**

```typescript
export const APP_VERSION = '1.2.0';

export const CURRENT_CHANGELOG: ChangelogEntry[] = [
  {
    category: 'feature',
    description: 'Added tier-based Grand Exchange tasks with 300+ items'
  },
  {
    category: 'improvement',
    description: 'Improved skill refresh system'
  },
  {
    category: 'balance',
    description: 'Adjusted boss gold rewards for better economy'
  },
  {
    category: 'bugfix',
    description: 'Fixed tile hover issues on mobile devices'
  }
];
```

**2. Test:**
- Change `runeTiles_version` in localStorage to a different value (e.g., '1.1.0')
- Reload the app
- Changelog modal should appear with your changes

**3. Deploy:**
- Commit changes
- Deploy to production
- All players will see changelog on their next visit!

---

## 🎨 Changelog Modal Preview

```
┌─────────────────────────────────────────┐
│  🎉 What's New in v1.2.0               │
├─────────────────────────────────────────┤
│  ✨ New Feature: GE tasks with 300+    │
│     items                               │
│                                         │
│  ⚡ Improvement: Better skill refresh   │
│                                         │
│  ⚖️ Balance Change: Boss gold adjusted │
│                                         │
│  🐛 Bug Fix: Tile hover on mobile      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │        Got it!                    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **Always update both `APP_VERSION` and `CURRENT_CHANGELOG`**
   - They should always match the same version

2. **Keep changelog concise**
   - 1 sentence per change
   - Focus on user-facing changes only

3. **No historical data needed**
   - Only keep current version's changelog
   - Old changelogs can be discarded

4. **Test before deploying**
   - Verify modal appears with correct changes
   - Check version displays correctly in settings

5. **Breaking changes**
   - If you have breaking changes, bump MAJOR version
   - Add a clear note in changelog about migration

---

## 🎯 Workflow Example

```bash
# You're releasing v1.3.0

# 1. Edit version.ts
export const APP_VERSION = '1.3.0';

# 2. Replace entire CURRENT_CHANGELOG array
export const CURRENT_CHANGELOG: ChangelogEntry[] = [
  { category: 'feature', description: 'New feature X' },
  { category: 'improvement', description: 'Improved Y' }
];

# 3. Test locally
# 4. Commit & deploy
# 5. Done! ✅
```

