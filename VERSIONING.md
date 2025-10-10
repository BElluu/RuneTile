# 📦 Versioning & Changelog System

## 🎯 How It Works

RuneTile uses semantic versioning (`MAJOR.MINOR.PATCH`) to track releases:
- **MAJOR**: Breaking changes or major features
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes and small improvements

### Automatic Changelog Detection

When a player launches the game:
1. The app checks their `localStorage` for the last seen version
2. If the current version is newer, it shows a changelog modal
3. The version is saved, so the changelog only shows once per update

---

## 🚀 How to Release a New Version

### Step 1: Update Version Number

Edit `src/config/version.ts`:

```typescript
export const APP_VERSION = '1.1.0'; // ← Update this
```

### Step 2: Add Changelog Entry

Add a new entry to `CHANGELOG` array in `src/config/version.ts`:

```typescript
export const CHANGELOG: VersionInfo[] = [
  {
    version: '1.1.0',  // ← New version
    releaseDate: '2025-01-15',
    changes: [
      {
        category: 'feature',  // or 'improvement', 'bugfix', 'balance'
        description: 'Added new boss tasks system'
      },
      {
        category: 'bugfix',
        description: 'Fixed hover not working on mobile'
      },
      // ... more changes
    ]
  },
  // ... previous versions below
];
```

### Change Categories

- **`feature`** ✨ - New features (green)
- **`improvement`** ⚡ - Improvements to existing features (blue)
- **`bugfix`** 🐛 - Bug fixes (red)
- **`balance`** ⚖️ - Game balance changes (yellow)

---

## 📋 Version Display

Players can view the current version in:
- Settings menu (bottom of modal)
- Changelog modal (shown automatically on update)

---

## 🔧 Technical Details

### Files Structure

```
src/
├── config/
│   └── version.ts          ← Version & changelog config
├── components/
│   ├── ChangelogModal.tsx  ← Changelog UI component
│   └── SettingsModal.tsx   ← Shows version number
└── utils/
    └── gameStorage.ts      ← Version storage functions
```

### localStorage Keys

- `runeTiles_version` - Last seen version by player

### Version Comparison

The system uses semantic version comparison:

```typescript
compareVersions('1.2.0', '1.1.5'); // Returns 1 (newer)
compareVersions('1.1.0', '1.1.0'); // Returns 0 (equal)
compareVersions('1.0.5', '1.1.0'); // Returns -1 (older)
```

### Changelog Filtering

Only shows changes since the player's last seen version:

```typescript
// Player last saw v1.0.0
// Current version is v1.2.0
// Will show changelogs for v1.1.0 and v1.2.0
getChangelogSince('1.0.0'); // [v1.2.0, v1.1.0]
```

---

## 📝 Example Release

### Releasing v1.2.0

**1. Update `version.ts`:**

```typescript
export const APP_VERSION = '1.2.0';

export const CHANGELOG: VersionInfo[] = [
  {
    version: '1.2.0',
    releaseDate: '2025-01-20',
    changes: [
      {
        category: 'feature',
        description: 'Added tier-based Grand Exchange tasks with 300+ items'
      },
      {
        category: 'improvement',
        description: 'Improved version management system'
      },
      {
        category: 'balance',
        description: 'Adjusted boss gold rewards for better economy'
      }
    ]
  },
  // v1.1.0 entry...
  // v1.0.0 entry...
];
```

**2. Test:**
- Clear your `localStorage` or change `runeTiles_version` to an older version
- Reload the app
- Changelog modal should appear automatically

**3. Deploy:**
- Commit changes
- Deploy to production
- Players will see changelog on next visit!

---

## 🎨 Changelog Modal Preview

```
┌─────────────────────────────────────────┐
│  🎉 What's New!                    ×   │
├─────────────────────────────────────────┤
│  v1.2.0          January 20, 2025      │
│  ────────────────────────────────────   │
│  ✨ New Feature: Tier-based GE tasks   │
│  ⚡ Improvement: Version management     │
│  ⚖️ Balance Change: Boss gold rewards  │
│                                         │
│  v1.1.0          January 15, 2025      │
│  ────────────────────────────────────   │
│  ✨ New Feature: Slayer Masters        │
│  🐛 Bug Fix: Hover issues fixed        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │        Got it!                    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **Always update both `APP_VERSION` and `CHANGELOG`**
   - Forgetting one causes inconsistencies

2. **Keep changelog concise**
   - 1-2 sentence descriptions
   - Focus on user-facing changes

3. **Order matters**
   - Newest versions go **first** in CHANGELOG array
   - System automatically sorts them

4. **Test before deploying**
   - Verify modal appears with correct changes
   - Check version displays in settings

5. **Breaking changes**
   - If you have breaking changes, bump MAJOR version
   - Clearly document migration steps in changelog

---

## 🔮 Future Enhancements

Potential improvements:
- [ ] "View full changelog" link in settings
- [ ] "What's new" badge on first login after update
- [ ] Export/import game version with save data
- [ ] Rollback protection (warn if downgrading)

