# Use nixpacks.toml - Railway is Truncating Build Command

## The Problem
Railway is truncating the build command, only running the first part. This is a known issue with long build commands.

## The Solution: Use nixpacks.toml

I've updated the `nixpacks.toml` files to properly install pnpm and build your services. This is more reliable than using build commands.

## Steps to Fix

### Step 1: Push nixpacks.toml Files to GitHub

```powershell
git add services/*/nixpacks.toml
git commit -m "Add nixpacks.toml for Railway deployment"
git push
```

### Step 2: Clear Build Command in Railway

1. **Go to Railway** → loan-service → Settings
2. **Find "Build Command"** field
3. **Delete/clear everything** (leave it completely empty)
4. **Click "Save"**

Railway will automatically detect and use `nixpacks.toml` when the build command is empty.

### Step 3: Redeploy

1. **Click "Redeploy"** in Railway
2. **Wait 3-5 minutes** for build
3. **Check logs** - should see:
   - Node.js being installed
   - pnpm being installed
   - Dependencies installing
   - Build completing

---

## What nixpacks.toml Does

The file tells Railway to:
1. **Install Node.js 18** (via nixpacks)
2. **Set SHELL environment variable**
3. **Install pnpm** using curl
4. **Add pnpm to PATH**
5. **Install dependencies** from monorepo root
6. **Build shared-types**
7. **Build the service**
8. **Start with** `node dist/main.js`

---

## For All Services

Do the same for:
- `document-service`
- `workflow-service`
- `rules-service`

1. **Clear build command** (leave empty)
2. **Redeploy**
3. Railway will use the `nixpacks.toml` file automatically

---

## Alternative: If nixpacks.toml Doesn't Work

If Railway still doesn't use nixpacks.toml, try setting the build command to just:

```
echo "Using nixpacks.toml"
```

This minimal command might trigger Railway to use the nixpacks.toml file.

---

## Verify It's Working

After redeploying, check the build logs. You should see:
- `Installing Node.js 18`
- `Installing pnpm`
- `pnpm install` running
- Build completing successfully

---

**Push the nixpacks.toml files, clear the build command in Railway, and redeploy!**

