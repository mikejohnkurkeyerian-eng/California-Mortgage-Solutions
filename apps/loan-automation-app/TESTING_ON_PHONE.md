# Testing on Your Real Phone

## Quick Setup Guide

### Step 1: Enable Developer Options on Your Android Phone

1. Go to **Settings** → **About Phone**
2. Find **Build Number** (might be under Software Information)
3. Tap **Build Number** 7 times
4. You'll see "You are now a developer!"

### Step 2: Enable USB Debugging

1. Go to **Settings** → **Developer Options** (now visible)
2. Enable **USB Debugging**
3. Enable **Install via USB** (if available)

### Step 3: Connect Your Phone

1. Connect your phone to your computer via USB cable
2. On your phone, you'll see a prompt: **"Allow USB debugging?"**
3. Check **"Always allow from this computer"** and tap **Allow**

### Step 4: Find Your Computer's IP Address

**On Windows (PowerShell):**
```powershell
ipconfig
```
Look for your WiFi adapter and find the **IPv4 Address** (e.g., `192.168.1.100`)

**On Mac/Linux:**
```bash
ifconfig | grep "inet "
# or
ip addr show
```

### Step 5: Update API Configuration

You need to tell the app to use your computer's IP address instead of `10.0.2.2`.

**Option A: Set Environment Variable (Recommended)**

Create a `.env` file in `apps/loan-automation-app/`:
```
REACT_NATIVE_API_HOST=192.168.1.100
```
(Replace `192.168.1.100` with YOUR computer's IP address)

**Option B: Edit the Code Directly**

Edit `apps/loan-automation-app/src/config/api.ts` and change:
```typescript
const apiHost = process.env.REACT_NATIVE_API_HOST || '10.0.2.2';
```
to:
```typescript
const apiHost = process.env.REACT_NATIVE_API_HOST || '192.168.1.100'; // Your IP
```

### Step 6: Make Sure Phone and Computer Are on Same WiFi

⚠️ **Important**: Your phone and computer must be on the **same WiFi network**!

### Step 7: Start Backend Services

```bash
# Terminal 1: Start backend services
pnpm start
```

Make sure all services are running:
- ✅ loan-service on port 4002
- ✅ document-service on port 4003
- ✅ workflow-service on port 4004
- ✅ rules-service on port 4005

### Step 8: Start Metro Bundler

```bash
# Terminal 2: Start Metro
cd apps/loan-automation-app
pnpm start
```

### Step 9: Run App on Your Phone

**Option A: Using React Native CLI**
```bash
# Terminal 3: Build and install on phone
cd apps/loan-automation-app
pnpm android
```

**Option B: Using ADB directly**
```bash
# Check if phone is detected
adb devices

# Build and install
cd apps/loan-automation-app/android
./gradlew installDebug

# Launch app
adb shell am start -n com.loanautomationapp/.MainActivity
```

---

## Troubleshooting

### Phone Not Detected

```bash
# Check if phone is connected
adb devices

# If you see "unauthorized", check your phone for USB debugging prompt
# If nothing shows, try:
adb kill-server
adb start-server
adb devices
```

### Can't Connect to Backend Services

1. **Check Firewall**: Windows Firewall might be blocking connections
   - Go to Windows Defender Firewall → Allow an app
   - Allow Node.js or add ports 4002-4006

2. **Check IP Address**: Make sure you're using the correct IP
   ```powershell
   ipconfig
   # Use the IPv4 address under your active WiFi adapter
   ```

3. **Test Connection**: On your phone's browser, try:
   ```
   http://YOUR_IP:4002/api/applications
   ```
   Should return JSON (might be an error, but means connection works)

4. **Check WiFi**: Phone and computer must be on same network

### Metro Bundler Not Loading

1. **Shake your phone** (or press `Ctrl+M` / `Cmd+M` on emulator)
2. Select **"Configure Bundler"**
3. Enter your computer's IP address and port 8081:
   ```
   192.168.1.100:8081
   ```

Or set it automatically:
```bash
# Start Metro with your IP
cd apps/loan-automation-app
pnpm start --host 192.168.1.100
```

---

## Quick Commands

```bash
# Check connected devices
adb devices

# Restart ADB
adb kill-server && adb start-server

# View device logs
adb logcat

# Install app
cd apps/loan-automation-app
pnpm android

# Get your IP (Windows)
ipconfig | findstr IPv4
```

---

## Notes

- ✅ **You can still edit code** - Metro will reload on your phone
- ✅ **Backend services** - Still auto-reload when you edit
- ✅ **Same development experience** - Just on a real device!
- ⚠️ **Keep Metro running** - App needs it to load JavaScript bundle
- ⚠️ **Same WiFi required** - Phone and computer must be on same network

---

## Production Build (No Metro)

If you want to test without Metro:

```bash
# Build release APK
cd apps/loan-automation-app/android
./gradlew assembleRelease

# APK will be in:
# android/app/build/outputs/apk/release/app-release.apk

# Install on phone
adb install android/app/build/outputs/apk/release/app-release.apk
```

But remember: **without Metro, you need to rebuild the APK every time you edit code** (takes 1-2 minutes).

