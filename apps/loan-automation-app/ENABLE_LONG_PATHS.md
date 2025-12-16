# How to Enable Windows Long Path Support

## Step 1: Open PowerShell as Administrator

**You MUST run PowerShell as Administrator for this to work.**

### Method 1: From Start Menu
1. Click the **Windows Start button**
2. Type **"PowerShell"**
3. **Right-click** on "Windows PowerShell" or "PowerShell"
4. Select **"Run as Administrator"**
5. Click **"Yes"** when prompted by User Account Control

### Method 2: From Run Dialog
1. Press **Windows Key + R**
2. Type: `powershell`
3. Press **Ctrl + Shift + Enter** (this opens as admin)
4. Click **"Yes"** when prompted

### Method 3: From File Explorer
1. Navigate to: `C:\Windows\System32\WindowsPowerShell\v1.0\`
2. **Right-click** on `powershell.exe`
3. Select **"Run as Administrator"**
4. Click **"Yes"** when prompted

## Step 2: Verify You're Running as Admin

In the PowerShell window, you should see "Administrator" in the title bar, and the prompt should show your path.

## Step 3: Run the Command

Once you have PowerShell open as Administrator, run:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

You should see output like:
```
LongPathsEnabled : 1
```

## Step 4: Restart Your Computer

**This is REQUIRED** - the change only takes effect after a restart.

## Step 5: Verify It Worked (After Restart)

After restarting, open PowerShell (regular is fine) and run:

```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled"
```

It should show: `LongPathsEnabled : 1`

## Step 6: Try Building Again

After restart, try building in Android Studio:
- **Build → Clean Project**
- **Build → Rebuild Project**

## Alternative: Use GitHub Actions

If you can't get admin access, use GitHub Actions to build the APK:
1. Push your code to GitHub
2. Go to the **Actions** tab
3. Run the **"Build Android APK"** workflow
4. Download the APK from the artifacts

