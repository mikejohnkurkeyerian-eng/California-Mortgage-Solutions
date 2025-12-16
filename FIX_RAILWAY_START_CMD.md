# Fix: Railway Start Command Error

## The Problem

Railway is interpreting the start command incorrectly. The error "Could not find root directory" means Railway is confused by the `cd` command.

## The Solution

Since Railway's **Root Directory** is set to `services/loan-service`, the start command should be simple - no `cd` needed.

## Steps

### Step 1: Push Updated nixpacks.toml

```powershell
git add services/loan-service/nixpacks.toml
git commit -m "Fix: Simplify start command for Railway"
git push
```

### Step 2: Update Railway Settings

1. **Go to Railway** → loan-service → **Settings**
2. **Verify Root Directory** is: `services/loan-service`
3. **Set Start Command** to (just this, nothing else):
   ```
   node start-simple.js
   ```
4. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"**
2. **Wait for build**
3. **Check logs**

---

## Important

- **Root Directory** = `services/loan-service` ✅
- **Start Command** = `node start-simple.js` ✅
- **No `cd` command needed** - Railway already runs from Root Directory

---

**Update Railway start command to just `node start-simple.js` and redeploy!**

