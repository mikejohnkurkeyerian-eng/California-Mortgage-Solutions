# How to Run setup-and-push.ps1

## Easiest Way: Right-Click in Folder

### Step 1: Open PowerShell in Your Project Folder

1. **Open File Explorer**
2. **Navigate to**: `C:\Users\Mike\Desktop\AI PROCCESS TEST`
3. **Right-click** in an empty area of the folder
4. **Select**: "Open in Terminal" or "Open PowerShell window here"
5. **PowerShell will open** in that folder

### Step 2: Run the Script

In the PowerShell window that opens, type:

```powershell
.\setup-and-push.ps1
```

Press Enter.

---

## Alternative: Open PowerShell Manually

### Step 1: Open PowerShell

1. **Press** `Windows Key + X`
2. **Select** "Windows PowerShell" or "Terminal"
3. **Or** search for "PowerShell" in Start menu

### Step 2: Navigate to Your Project

In PowerShell, type:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
```

Press Enter.

### Step 3: Run the Script

```powershell
.\setup-and-push.ps1
```

Press Enter.

---

## If You Get "Execution Policy" Error

If PowerShell says "execution of scripts is disabled", run this first:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try running the script again.

---

## What the Script Will Do

1. Initialize git repository (if needed)
2. Add all your files
3. Check if remote is configured
4. Commit everything
5. Push to GitHub (you'll need to enter credentials)

---

**Right-click in your project folder → "Open in Terminal" → Run `.\setup-and-push.ps1`**

