# Fix: npm/pnpm Not Found - Use Nixpacks Configuration

## The Problem
Railway's build environment doesn't have Node.js/npm installed by default. We need to tell Railway to install Node.js first.

## The Solution
I've created `nixpacks.toml` files that tell Railway to:
1. Install Node.js 18
2. Enable corepack
3. Install pnpm
4. Build your project

## What You Need to Do

### Step 1: Push the New Files to GitHub

The `nixpacks.toml` files need to be in your repository:

```powershell
# Add the new files
git add services/*/nixpacks.toml
git commit -m "Add nixpacks.toml for Railway deployment"
git push
```

### Step 2: Update Railway Build Settings

**Option A: Remove Build Command (Let Nixpacks Handle It)**

1. Go to Railway → Your Service → Settings
2. Find **"Build Command"** field
3. **Delete/clear** the build command (leave it empty)
4. Railway will automatically use `nixpacks.toml`
5. Click **"Save"**

**Option B: Keep Build Command Empty**

If Railway requires a build command, use:
```
echo "Using nixpacks.toml for build"
```

### Step 3: Redeploy

1. Click **"Redeploy"** in Railway
2. Wait for build (3-5 minutes)
3. Check logs - should see Node.js being installed

---

## Alternative: Use Railway's Node.js Detection

If nixpacks.toml doesn't work, try this:

### In Railway Settings:

1. **Set Node.js Version**:
   - Go to Settings → Variables
   - Add: `NODE_VERSION=18`
   
2. **Update Build Command**:
   ```
   curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
   ```

---

## What nixpacks.toml Does

The `nixpacks.toml` file tells Railway:
- Install Node.js 18
- Enable corepack (comes with Node.js)
- Install pnpm via corepack
- Run your build commands
- Start with `node dist/main.js`

---

## After Pushing Files

1. **Push to GitHub** (the nixpacks.toml files)
2. **Clear build command** in Railway Settings (or set to empty)
3. **Redeploy** the service
4. **Check logs** - should see Node.js installation

---

## If Still Not Working

Try this build command in Railway:

```
curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

This installs pnpm directly without needing npm.

---

**Push the nixpacks.toml files and clear the build command in Railway!**

