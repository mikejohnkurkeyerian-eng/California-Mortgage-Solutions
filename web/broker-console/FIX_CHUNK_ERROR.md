# Fix ChunkLoadError

## Issue:
Next.js chunk loading error - build cache is corrupted.

## ✅ Solution Applied:
Cleared the `.next` build cache folder.

## Steps to Fix:

### 1. Stop the Next.js Dev Server
If the server is running:
- Press `Ctrl+C` in the terminal running `pnpm dev`

### 2. Clear Build Cache (Already Done)
The `.next` folder has been cleared.

### 3. Restart Dev Server
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

### 4. Clear Browser Cache
**Important!** Clear your browser cache:

#### Option A: Hard Refresh
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

#### Option B: Clear Cache Completely
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Option C: Incognito/Private Window
- Open a new incognito/private window
- Go to: http://localhost:3000/dashboard

### 5. Test Again
Go to: http://localhost:3000/dashboard
- Should work now!

## If Still Having Issues:

### Manual Cache Clear:
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
Remove-Item -Recurse -Force .next
pnpm dev
```

### Or Reinstall Dependencies:
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
Remove-Item -Recurse -Force .next, node_modules
pnpm install
pnpm dev
```

## Quick Fix (Copy & Paste):
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
pnpm dev
```

Then clear browser cache with `Ctrl+Shift+R`! 🚀

