# Push nixpacks.toml Files Using Git

## Option 1: Use Git in a New PowerShell Window

If Git was just installed, you need to **restart PowerShell**:

1. **Close this PowerShell window**
2. **Open a new PowerShell window**
3. **Navigate to your project:**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
   ```
4. **Run these commands:**
   ```powershell
   # Check git is working
   git --version
   
   # Add the nixpacks.toml files
   git add services/loan-service/nixpacks.toml
   git add services/document-service/nixpacks.toml
   git add services/workflow-service/nixpacks.toml
   git add services/rules-service/nixpacks.toml
   
   # Or add all at once:
   git add services/*/nixpacks.toml
   
   # Commit the changes
   git commit -m "Fix: Add nixpacks.toml for Railway deployment"
   
   # Push to GitHub
   git push
   ```

---

## Option 2: Use Git Bash (If Installed)

If you have Git Bash installed:

1. **Right-click** in your project folder
2. **Select "Git Bash Here"**
3. **Run the same commands** as above

---

## Option 3: Use GitHub Desktop (Easiest)

If Git still doesn't work in PowerShell:

1. **Open GitHub Desktop**
2. **You should see the 4 changed files**
3. **Check all 4 nixpacks.toml files**
4. **Commit message**: `Fix: Add nixpacks.toml for Railway deployment`
5. **Click "Commit to main"**
6. **Click "Push origin"**

---

## Quick Commands (Copy & Paste)

If Git works in a new PowerShell:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
git add services/*/nixpacks.toml
git commit -m "Fix: Add nixpacks.toml for Railway deployment"
git push
```

---

## After Pushing

1. **Go to Railway**
2. **Clear build command** (leave empty)
3. **Redeploy** the service
4. **Railway will use nixpacks.toml automatically**

---

**Try opening a new PowerShell window first, then run the git commands!**

