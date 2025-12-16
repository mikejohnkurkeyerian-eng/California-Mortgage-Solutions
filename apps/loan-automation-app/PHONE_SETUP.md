# Running React Native App on Your Phone

## ⚠️ iOS Users
**If you have an iPhone, see [IOS_SETUP.md](./IOS_SETUP.md) for iOS-specific instructions.**

iOS apps require a Mac with Xcode to build. If you're on Windows, you'll need:
- A Mac (physical or cloud service), OR
- Use Expo (easier iOS development), OR
- Test on Android first

## Android Setup (Windows/Mac/Linux)

## Quick Setup Guide

### Step 1: Start Metro Bundler (Development Server)

**Option A: Using the helper script (recommended)**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start:dev
```

**Option B: Using standard command**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start
```

This will start Metro bundler on `http://localhost:8081` (or your computer's IP address).

### Step 2: Connect Your Phone

#### Method 1: USB Connection (Easiest)

1. **Enable USB Debugging on your phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect phone via USB** to your computer

3. **Set up port forwarding:**
   ```powershell
   adb reverse tcp:8081 tcp:8081
   ```

4. **Install and run the app:**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
   pnpm android
   ```

#### Method 2: Wi-Fi Connection (No USB needed)

1. **Make sure your phone and computer are on the same Wi-Fi network**

2. **Find your computer's IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.50.76`)

3. **Start Metro bundler:**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
   pnpm start:dev
   ```
   This will show your IP address automatically.

4. **Configure the app on your phone:**
   - Install the APK on your phone (via USB or download)
   - Open the app
   - Shake your phone (or press Menu button)
   - Select "Settings" → "Debug server host & port for device"
   - Enter: `YOUR_COMPUTER_IP:8081` (e.g., `192.168.50.76:8081`)
   - Press "Reload"

### Step 3: Install the APK on Your Phone

#### Option A: Via USB (ADB)
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm android
```

#### Option B: Manual Install
1. Build the APK:
   ```powershell
   pnpm build:android
   ```

2. Transfer the APK to your phone:
   - Location: `apps/loan-automation-app/android/app/build/outputs/apk/debug/app-debug.apk`
   - Transfer via USB, email, or cloud storage

3. Install on phone:
   - Enable "Install from Unknown Sources" in phone settings
   - Open the APK file on your phone
   - Follow installation prompts

## Troubleshooting

### Phone can't connect to Metro server

1. **Check firewall:** Make sure Windows Firewall allows connections on port 8081
2. **Check network:** Ensure phone and computer are on the same Wi-Fi network
3. **Check IP address:** Verify your computer's IP hasn't changed
4. **Try USB method:** Use `adb reverse tcp:8081 tcp:8081` for USB connection

### App shows "Unable to load script"

1. **Make sure Metro is running:** Check that `pnpm start` is running
2. **Check connection:** Verify phone can reach your computer's IP
3. **Reload app:** Shake phone → "Reload"
4. **Clear cache:** Shake phone → "Dev Settings" → "Reload"

### ADB not found

Install Android SDK Platform Tools:
- Download from: https://developer.android.com/studio/releases/platform-tools
- Add to PATH, or use full path to `adb.exe`

## Useful Commands

```powershell
# Start Metro bundler
pnpm start:dev

# Run app on connected device
pnpm android

# Build APK for manual installation
pnpm build:android

# Check connected devices
adb devices

# Set up port forwarding (USB)
adb reverse tcp:8081 tcp:8081

# View logs from phone
adb logcat
```

## Your Current Setup

- **Computer IP:** Check with `ipconfig` or use `pnpm start:dev` to see it
- **Metro Port:** 8081 (default)
- **APK Location:** `android/app/build/outputs/apk/debug/app-debug.apk`

