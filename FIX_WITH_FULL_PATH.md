# Fix: Use Full Path in Start Command

## The Problem

Railway is running from `/app` (repo root) even though Root Directory might be set. The start command needs the full path.

## The Solution

I've updated `nixpacks.toml` to use the full path: `services/loan-service/dist/main.js`

## Steps

### Step 1: Push Updated nixpacks.toml

```powershell
git add services/loan-service/nixpacks.toml
git commit -m "Fix: Use full path in start command"
git push
```

### Step 2: Update Railway Start Command

1. **Go to Railway** → loan-service → **Settings**
2. **Set Start Command** to:
   ```
   node services/loan-service/dist/main.js
   ```
3. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"**
2. **Wait for build**
3. **Should work now!**

---

## Why This Works

- Railway runs from `/app` (repo root)
- Build creates `services/loan-service/dist/main.js`
- Full path `services/loan-service/dist/main.js` will find it
- No need to rely on Root Directory setting

---

**Push the file, update Railway start command to `node services/loan-service/dist/main.js`, and redeploy!**

