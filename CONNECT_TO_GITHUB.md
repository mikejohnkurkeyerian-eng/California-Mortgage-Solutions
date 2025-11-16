# Connect This Folder to Your Existing GitHub Repo

## Quick Steps

### Step 1: Initialize Git

Run this in PowerShell:

```powershell
git init
```

### Step 2: Add Your GitHub Remote

You need your GitHub repository URL. It looks like:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`

**To find it:**
1. Go to your GitHub repository in a browser
2. Click the green **"Code"** button
3. Copy the HTTPS URL

**Then run:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
(Replace with YOUR actual repo URL)

### Step 3: Add and Commit Files

```powershell
git add .
git commit -m "Add nixpacks.toml files for Railway"
```

### Step 4: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**Note**: If it asks for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  - Get one at: https://github.com/settings/tokens
  - Generate new token (classic)
  - Check "repo" permission
  - Use the token as password

---

## Option 2: Clone Fresh from GitHub (If Option 1 Doesn't Work)

If connecting doesn't work, clone your repo fresh:

```powershell
# Go to parent directory
cd "C:\Users\Mike\Desktop"

# Clone your repo (replace with YOUR repo URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git "AI PROCCESS TEST NEW"

# Copy your nixpacks.toml files to the cloned repo
# Then push from there
```

---

**Try Option 1 first - it's faster!**

