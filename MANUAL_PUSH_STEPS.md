# Manual Push Steps - If Script Doesn't Work

## The Problem
Only `.gitattributes` is showing on GitHub, which means files weren't pushed.

## Manual Fix - Run These Commands One by One

Open PowerShell in your project folder and run:

### Step 1: Check Current Status
```powershell
git status
```

### Step 2: Add All Files
```powershell
git add .
```

### Step 3: Check What Will Be Committed
```powershell
git status
```

You should see a list of files including:
- `services/loan-service/nixpacks.toml`
- `services/document-service/nixpacks.toml`
- All other project files

### Step 4: Commit Everything
```powershell
git commit -m "Add all project files"
```

### Step 5: Check Remote
```powershell
git remote -v
```

Should show your GitHub URL. If not, add it:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Step 6: Push to GitHub
```powershell
git branch -M main
git push -u origin main --force
```

The `--force` flag will overwrite what's on GitHub (since only `.gitattributes` is there).

**Note**: You'll be asked for credentials again. Use your Personal Access Token.

---

## After Pushing

1. **Refresh your GitHub repository page**
2. **You should now see**:
   - `services/` folder
   - `apps/` folder
   - `libs/` folder
   - All your project files

3. **Then go to Railway** and set Root Directory to `services/loan-service`

---

**Run the commands above to push all your files!**

