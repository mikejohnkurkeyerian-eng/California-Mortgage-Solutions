# Railway Configuration for AI-Broker Repository

## ✅ Your Code is on GitHub!

**Repository:** `https://github.com/rdp9fbqj5c-art/AI-Broker.git`

## Configure Railway

### Step 1: Go to Railway Settings

1. **Open Railway** → Your Project → **loan-service** → **Settings**

### Step 2: Configure Repository

1. **Repository:** Make sure it's set to: `https://github.com/rdp9fbqj5c-art/AI-Broker.git`
2. **Branch:** Set to: `main`
3. **Root Directory:** Set to: `services/loan-service`

### Step 3: Verify Build Settings

Railway should detect `nixpacks.toml` automatically. If not, make sure:
- **Build Command:** (should auto-detect from `nixpacks.toml`)
- **Start Command:** (should auto-detect from `nixpacks.toml`)

### Step 4: Redeploy

1. Click **"Redeploy"** or **"Deploy"**
2. Wait for the build to complete
3. Check the logs for any errors

---

## If Railway Still Says "Root Directory Does Not Exist"

1. **Verify on GitHub:**
   - Go to: `https://github.com/rdp9fbqj5c-art/AI-Broker`
   - Click on `services/` folder
   - Click on `loan-service/` folder
   - Verify you see: `nixpacks.toml`, `package.json`, `src/`

2. **If files are NOT on GitHub:**
   - The files might be in `.gitignore`
   - Check what's actually committed: `git ls-files services/loan-service/`

3. **If files ARE on GitHub but Railway can't see them:**
   - Make sure Branch is `main` (not `master`)
   - Try leaving Root Directory **EMPTY** first
   - Then try: `services/loan-service` (with the slash)

---

## Quick Check: What's Actually on GitHub?

Run this to see what files are committed:

```powershell
git ls-files services/loan-service/
```

This shows what Git is tracking and will be pushed to GitHub.

