# Visual Studio Setup for React Native Windows

## Required Downloads

### 1. Visual Studio 2022 Community (Free)
**Download Link:** https://visualstudio.microsoft.com/downloads/

- Choose **Visual Studio 2022 Community** (free version)
- This is the full IDE with all necessary tools

### 2. Visual Studio 2022 Build Tools (Alternative - Lighter)
**Download Link:** https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

- If you only want the build tools without the full IDE
- Smaller download, but less user-friendly

## Installation Steps

### During Visual Studio Installation:

1. **Select Workload:**
   - ✅ **Desktop development with C++**
   - This includes:
     - MSVC v143 compiler toolset
     - Windows 10/11 SDK
     - CMake tools
     - C++ core features

2. **Individual Components (if needed):**
   - ✅ Windows 10 SDK (10.0.19041.0 or later)
   - ✅ Windows 11 SDK (if available)
   - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
   - ✅ C++ CMake tools for Windows

### Minimum Requirements:
- **Windows 10 SDK version 10.0.19041.0** or later
- **MSVC v143 compiler toolset** (comes with VS 2022)

## Verification

After installation, verify by:

1. Open **Developer Command Prompt for VS 2022**
2. Run: `cl` (should show compiler version)
3. Run: `where cl` (should show path to compiler)

## React Native Windows Specific Requirements

For React Native Windows development, you also need:

1. **Node.js 18+**
   - Download: https://nodejs.org/

2. **Python 3.x**
   - Download: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

3. **Chocolatey (Optional but recommended)**
   - Download: https://chocolatey.org/install
   - Makes installing other tools easier

## Quick Setup Checklist

- [ ] Install Visual Studio 2022 Community
- [ ] Select "Desktop development with C++" workload
- [ ] Install Windows 10/11 SDK
- [ ] Install Node.js 18+
- [ ] Install Python 3.x
- [ ] Restart computer (recommended)
- [ ] Verify installation

## Troubleshooting

### "cl.exe not found"
- Make sure "Desktop development with C++" workload is installed
- Restart terminal/computer
- Run from "Developer Command Prompt for VS 2022"

### "Windows SDK not found"
- Install Windows 10 SDK (10.0.19041.0 or later)
- Can be installed separately if needed

### Build Errors
- Make sure you're running from Developer Command Prompt
- Or set environment variables manually

## Alternative: Use React Native CLI

If Visual Studio setup is too complex, you can also use:
- **Expo** (easier, but limited desktop support)
- **Electron** (web-based, easier setup)

But React Native Windows gives you the best native desktop experience.

## Next Steps

After installing Visual Studio:

1. Install app dependencies:
   ```bash
   cd apps/loan-automation-app
   pnpm install
   ```

2. Run on Windows:
   ```bash
   pnpm windows
   ```

## Links Summary

- **Visual Studio 2022 Community:** https://visualstudio.microsoft.com/downloads/
- **Visual Studio Build Tools:** https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
- **Node.js:** https://nodejs.org/
- **Python:** https://www.python.org/downloads/
- **React Native Windows Docs:** https://microsoft.github.io/react-native-windows/docs/getting-started

