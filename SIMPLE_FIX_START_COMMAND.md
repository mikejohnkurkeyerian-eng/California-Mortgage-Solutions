# Simple Fix: Copy register-paths.js to dist/

## The Solution

I've updated `nixpacks.toml` to:
1. Copy `register-paths.js` to `dist/` during build
2. Use it from `dist/` in the start command

## What You Need to Do

### Step 1: Push Updated nixpacks.toml

```powershell
git add services/loan-service/nixpacks.toml
git commit -m "Fix: Copy register-paths.js to dist and use it"
git push
```

### Step 2: Update Railway Start Command

1. **Go to Railway** → loan-service → **Settings**
2. **Find "Start Command"**
3. **Set it to**:
   ```
   node -r dist/register-paths.js dist/main.js
   ```
4. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"**
2. **Wait 3-5 minutes**
3. **Check logs** - should work now!

---

## Why This Works

- `register-paths.js` gets copied to `dist/` during build
- It's in the same directory as `main.js`
- The `-r` flag loads it before running main.js
- Path resolution works correctly

---

**Push the file, update Railway start command, and redeploy!**

