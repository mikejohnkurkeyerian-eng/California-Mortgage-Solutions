# Fix Railway Start Command - register-paths.js Error

## The Problem

Railway can't find `register-paths.js` because the start command path is wrong.

## The Fix

I've updated `nixpacks.toml` to use the correct path. Now you need to:

### Step 1: Push Updated nixpacks.toml

```powershell
git add services/loan-service/nixpacks.toml
git commit -m "Fix: Update start command to use register-paths.js"
git push
```

### Step 2: Update Railway Start Command

1. **Go to Railway** → loan-service → **Settings**
2. **Find "Start Command"** field
3. **Set it to**:
   ```
   node -r ./register-paths.js dist/main.js
   ```
4. **Click "Save"**

### Step 3: Redeploy

1. **Click "Redeploy"** in Railway
2. **Wait 3-5 minutes** for build
3. **Check logs** - should work now!

---

## Why This Works

- `register-paths.js` is in the service root (`services/loan-service/`)
- The start command runs from the service root
- So we reference it as `./register-paths.js`
- Then run `dist/main.js` which is the compiled code

---

**Update the Railway start command and redeploy!**

