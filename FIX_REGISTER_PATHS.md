# Fix: Cannot find module './register-paths.js'

## The Problem

The service uses `@shared-types` imports which need path resolution at runtime. The `register-paths.js` file needs to be:
1. Copied to the `dist/` folder during build
2. Used in the start command

## The Fix

I've updated `nixpacks.toml` to:
1. Copy `register-paths.js` to `dist/` during build
2. Use it in the start command

## What You Need to Do

### Step 1: Push the Updated nixpacks.toml

```powershell
git add services/loan-service/nixpacks.toml
git commit -m "Fix: Copy register-paths.js to dist folder"
git push
```

### Step 2: Update Railway Start Command

1. **Go to Railway** → loan-service → **Settings**
2. **Find "Start Command"**
3. **Set it to**:
   ```
   node -r ./dist/register-paths.js dist/main.js
   ```
4. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"** in Railway
2. **Wait for build** (3-5 minutes)
3. **Check logs** - should work now!

---

## Alternative: If That Doesn't Work

If the path still doesn't work, try:

**Start Command:**
```
cd services/loan-service && node -r ./dist/register-paths.js dist/main.js
```

Or if register-paths.js is in the root of the service:

**Start Command:**
```
node -r ./register-paths.js dist/main.js
```

---

**Push the updated nixpacks.toml and update the Railway start command!**

