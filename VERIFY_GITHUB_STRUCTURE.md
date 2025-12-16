# Verify Your GitHub Repository Structure

## The Problem

Railway says: "Root Directory `services/loan-service` does not exist"

This means Railway can't see that folder in your GitHub repository.

## Step 1: Check Your GitHub Repository

**Go to your GitHub repository in a browser and verify:**

1. **Open your repo**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. **Do you see a `services/` folder?** (Click on it)
3. **Inside `services/`, do you see `loan-service/`?** (Click on it)
4. **Inside `loan-service/`, do you see:**
   - `package.json`
   - `nixpacks.toml`
   - `src/` folder
   - `tsconfig.json`

**If you DON'T see these files, they haven't been pushed to GitHub yet!**

---

## Step 2: If Files Are NOT on GitHub

Run this script to push them:

```powershell
.\push-only-source-code.ps1
```

Or manually:

```powershell
git add .
git commit -m "Add source code"
git push
```

---

## Step 3: If Files ARE on GitHub

Check Railway settings:

1. **Go to Railway** → loan-service → **Settings**
2. **Check "Branch"** - should be `main` (or `master`)
3. **Check "Root Directory"** - try these values:
   - `services/loan-service` (with the slash)
   - Or leave it **EMPTY** and let Railway auto-detect

---

## Step 4: Verify What Railway Sees

Railway clones your repo and looks for the folder structure.

**Make sure:**
- Your GitHub repo has `services/loan-service/` folder
- The branch Railway is using (`main` or `master`) has the latest commit
- The Root Directory path matches exactly what's on GitHub

---

**First, check your GitHub repo - do you see `services/loan-service/` with files inside it?**

