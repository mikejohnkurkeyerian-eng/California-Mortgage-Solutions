# Simple Start Script Fix

## The Problem

Railway can't find `dist/register-paths.js` and the service crashes after starting.

## The Solution

I've created `start-simple.js` which:
1. Is in the service root (`services/loan-service/`)
2. Handles path resolution directly
3. Doesn't rely on copying files to dist/

## Steps

### Step 1: Push Files

```powershell
git add services/loan-service/start-simple.js services/loan-service/nixpacks.toml
git commit -m "Fix: Use start-simple.js for Railway"
git push
```

### Step 2: Update Railway Start Command

1. **Go to Railway** → loan-service → **Settings**
2. **Set Start Command** to:
   ```
   node start-simple.js
   ```
   **OR if Root Directory is repo root:**
   ```
   cd services/loan-service && node start-simple.js
   ```
3. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"**
2. **Wait for build**
3. **Check logs**

---

## Why This Should Work

- `start-simple.js` is in the service root
- It doesn't need files copied to dist/
- It handles path resolution directly
- Railway can find it easily

---

**Push the files, update Railway start command to `node start-simple.js`, and redeploy!**

