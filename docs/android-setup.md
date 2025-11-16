# Android Studio Setup Guide

## Step 1: Install Android Studio Components

1. **Open Android Studio**
2. **Go to:** `Tools` → `SDK Manager` (or click the SDK Manager icon)
3. **Install these:**
   - Android SDK Platform (latest version, e.g., Android 13 or 14)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (HAXM installer) - for faster emulation

## Step 2: Create an Android Virtual Device (AVD)

1. **Go to:** `Tools` → `Device Manager` (or click the Device Manager icon)
2. **Click:** `Create Device`
3. **Choose a device:**
   - Select `Phone` category
   - Pick a device (e.g., "Pixel 5" or "Pixel 6")
   - Click `Next`
4. **Select System Image:**
   - Choose a recent Android version (API 33 or 34 recommended)
   - If not downloaded, click `Download` next to it
   - Click `Next`
5. **Configure AVD:**
   - Name it (e.g., "Pixel_5_API_33")
   - Click `Finish`

## Step 3: Start the Emulator

1. In Device Manager, find your AVD
2. Click the **Play button** (▶) next to it
3. Wait for the emulator to boot (takes 1-2 minutes first time)

## Step 4: Run the React Native App

Once the emulator is running:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm android
```

Or if you prefer npm:
```powershell
npm run android
```

## Troubleshooting

### "adb not found"
- Make sure Android SDK Platform-Tools is installed
- Add to PATH: `C:\Users\Mike\AppData\Local\Android\Sdk\platform-tools`

### "Java not found"
- Android Studio should install Java automatically
- If not, install JDK 17 or 21

### Emulator is slow
- Enable HAXM (Intel) or Hyper-V (Windows)
- Allocate more RAM to the emulator in AVD settings

### Metro bundler connection issues
- Make sure Metro is running (`pnpm start` in app directory)
- Check that emulator and Metro are on the same network

## Quick Test

Once emulator is running, you can test if it's connected:

```powershell
adb devices
```

Should show your emulator listed.

