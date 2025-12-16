# Force Railway to Use Nixpacks

## The Problem

Railway is using Railpack instead of Nixpacks, even though `nixpacks.toml` exists.

## Solution: Create railway.json

I've created a `railway.json` file that explicitly tells Railway to use NIXPACKS.

## Steps

1. **Push the railway.json file:**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI-Broker"
   git add railway.json
   git commit -m "Force Railway to use Nixpacks"
   git push
   ```

2. **In Railway Settings:**
   - Go to Railway → loan-service → **Settings**
   - Check **"Build Command"** - should be empty (let railway.json handle it)
   - Check **"Build System"** - if there's an option, select "Nixpacks"
   - **Root Directory** should be EMPTY

3. **Redeploy**

## Alternative: Check Railway UI

If railway.json doesn't work, check Railway's UI:
- Go to **Settings** → **Build**
- Look for **"Build System"** or **"Builder"** option
- Select **"Nixpacks"** (not "Railpack" or "Auto")

---

The `railway.json` file explicitly sets the builder to NIXPACKS, which should override Railway's auto-detection.

