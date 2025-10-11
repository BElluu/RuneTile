# Environment Setup for Feedback System

The in-app feedback system allows players to report bugs and suggest features directly from the game. These reports automatically create GitHub issues.

## Required Configuration

Create a `.env` file in the root directory with the following variables:

```env
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=BElluu
GITHUB_REPO=RuneTiles
```

## GitHub Token Setup

### Step 1: Create a Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new)
2. Click "Generate new token" → "Generate new token (classic)"
3. Set a descriptive note: `RuneTiles Feedback System`
4. Select expiration:
   - For personal projects: `No expiration`
   - For production: `90 days` (and set a reminder to regenerate)

### Step 2: Set Permissions

**For public repositories:**
- ✅ Check `public_repo` (Access public repositories)

**For private repositories:**
- ✅ Check `repo` (Full control of private repositories)

### Step 3: Generate and Copy

1. Click "Generate token" at the bottom
2. **⚠️ Important:** Copy the token immediately - you won't be able to see it again!
3. Paste it in your `.env` file as `GITHUB_TOKEN`

## Testing

To test if the feedback system is working:

1. Start the development server: `bun dev`
2. Open the game in your browser
3. Click Settings → "Report Issue / Suggest Feature"
4. Submit a test bug report or feature request
5. Check your GitHub repository issues - a new issue should appear

## Security Notes

- ⚠️ **Never commit your `.env` file to version control**
- ⚠️ `.env` is already in `.gitignore`
- 🔒 Keep your GitHub token private
- 🔄 Regenerate the token if it's ever exposed
- ✅ For production deployment, use environment variables in your hosting platform

## Troubleshooting

### Error: "Server configuration error"
- Check if `GITHUB_TOKEN` is set in `.env`
- Verify the token is valid (not expired)

### Error: "Failed to create GitHub issue"
- Check if token has correct permissions (`public_repo` or `repo`)
- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Check GitHub API rate limits

### Issue not appearing on GitHub
- Check server console for error messages
- Verify you're looking at the correct repository
- Check if labels `bug`/`enhancement` and `user-reported` exist (they'll be created automatically)

## Optional: Disable Feedback System

If you don't want to use the feedback system:

1. Don't create a `.env` file
2. The feedback button will still appear in settings
3. If submission fails, users will see a link to report directly on GitHub

