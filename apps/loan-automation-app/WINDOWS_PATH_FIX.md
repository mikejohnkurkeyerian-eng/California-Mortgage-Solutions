# Windows Path Length Issue - Final Fix

## The Problem

Windows has a **260 character path length limit** that React Native builds exceed, causing the Gradle transforms cache to become corrupted. This affects both command-line builds and Android Studio.

## Solution: Enable Windows Long Path Support

You **MUST** enable Windows long path support and **restart your computer** for this to work.

### Steps:

1. **Open PowerShell as Administrator** (Right-click PowerShell → Run as Administrator)

2. **Run this command:**
   ```powershell
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

3. **Restart your computer** (this is required for the change to take effect)

4. **After restart, try building again:**
   - In Android Studio: **Build → Clean Project** then **Build → Rebuild Project**
   - Or from command line: `.\gradlew.bat assembleDebug`

## Alternative: Use GitHub Actions

If you can't enable long path support, use the GitHub Actions workflow:
- Push your code to GitHub
- Go to Actions tab
- Run the "Build Android APK" workflow
- Download the APK from the artifacts

## Why This Happens

React Native creates very long file paths like:
```
C:\Users\Mike\.gradle\caches\transforms-4\...\__node_modules_pnpm_reactnavigationelements1331_reactnavigationnative6118_reactnative0730_babel_axfywv264evodxydoylbivz5ve_node_modules_reactnavigation_elements_src_assets_backicon.png
```

These paths exceed Windows' default 260 character limit, causing file operations to fail.

## Verification

After enabling long paths and restarting, you can verify it worked:
```powershell
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled"
```

This should return `LongPathsEnabled : 1`

