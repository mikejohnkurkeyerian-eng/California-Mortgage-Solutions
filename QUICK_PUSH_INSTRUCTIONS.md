# Quick Push Instructions - Just Run This!

## Easiest Way: Run the Script

I've created a script that does everything for you:

1. **Open PowerShell** in your project folder:
   - Right-click in `C:\Users\Mike\Desktop\AI PROCCESS TEST`
   - Select "Open in Terminal" or "Open PowerShell window here"

2. **Run the script:**
   ```powershell
   .\push-nixpacks.ps1
   ```

3. **Done!** The files will be pushed to GitHub

---

## Manual Way (If Script Doesn't Work)

If the script doesn't work, run these commands one by one:

```powershell
# Make sure you're in the project folder
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"

# Add the files
git add services/loan-service/nixpacks.toml
git add services/document-service/nixpacks.toml
git add services/workflow-service/nixpacks.toml
git add services/rules-service/nixpacks.toml

# Commit
git commit -m "Fix: Add nixpacks.toml for Railway deployment"

# Push
git push
```

---

## If Git Push Asks for Credentials

GitHub might ask for your username and password. Use:

- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)
  - Get one at: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Check "repo" permission
  - Copy the token and use it as password

---

## After Pushing

1. **Go to Railway** → Your service → Settings
2. **Clear build command** (delete everything, leave empty)
3. **Click "Save"**
4. **Redeploy** the service
5. **Railway will use nixpacks.toml automatically**

---

**Just run `.\push-nixpacks.ps1` in PowerShell!**

