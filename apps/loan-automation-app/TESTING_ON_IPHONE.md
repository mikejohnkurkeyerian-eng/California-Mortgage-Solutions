# Testing on Your iPhone

## ⚠️ Important Requirements

**iOS development requires macOS and Xcode** - You cannot build iOS apps directly on Windows.

### Options:

1. **✅ Use a Mac** (Recommended)
   - macOS with Xcode installed
   - Can build and run directly

2. **☁️ Cloud Mac Services**
   - MacStadium, MacInCloud, AWS EC2 Mac instances
   - Remote access to macOS for building

3. **🔄 Alternative: Use Expo**
   - Can build iOS apps from Windows
   - Requires converting your app to Expo
   - More limited native features

---

## If You Have a Mac

### Step 1: Install Prerequisites

```bash
# Install Xcode from App Store (free, but large ~10GB)
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods (iOS dependency manager)
sudo gem install cocoapods
```

### Step 2: Initialize iOS Project

If you don't have an `ios` folder yet:

```bash
cd apps/loan-automation-app
npx react-native init LoanAutomationApp --skip-install
# Then copy the ios folder to your project
```

Or if the project already has iOS support:

```bash
cd apps/loan-automation-app/ios
pod install
cd ..
```

### Step 3: Update API Configuration

Edit `apps/loan-automation-app/src/config/api.ts`:

For **iOS Simulator** (already works):
- Uses `localhost` automatically ✅

For **Physical iPhone**:
- Change the iOS section to use your computer's IP address
- Similar to Android physical device setup

### Step 4: Connect Your iPhone

1. **Enable Developer Mode** (iOS 16+):
   - Settings → Privacy & Security → Developer Mode → Enable
   - Restart your iPhone

2. **Trust Your Computer**:
   - Connect iPhone via USB
   - On iPhone: Tap "Trust This Computer"

3. **Register Your Device**:
   - Open Xcode
   - Window → Devices and Simulators
   - Select your iPhone
   - Click "Use for Development"

### Step 5: Configure Code Signing

1. Open `apps/loan-automation-app/ios/LoanAutomationApp.xcworkspace` in Xcode
2. Select your project in the left sidebar
3. Go to "Signing & Capabilities"
4. Select your Apple ID team
5. Xcode will automatically create a provisioning profile

### Step 6: Run on iPhone

**Option A: Using React Native CLI**
```bash
# Terminal 1: Backend services
pnpm start

# Terminal 2: Metro bundler
cd apps/loan-automation-app
pnpm start

# Terminal 3: Run on iPhone
cd apps/loan-automation-app
pnpm ios --device
```

**Option B: Using Xcode**
1. Open `ios/LoanAutomationApp.xcworkspace` in Xcode
2. Select your iPhone from the device dropdown (top toolbar)
3. Click the Play button (▶️) or press `Cmd+R`

### Step 7: Configure Metro for Physical Device

If Metro doesn't connect automatically:

1. **Shake your iPhone** (or press `Cmd+D` in simulator)
2. Select **"Configure Bundler"**
3. Enter your Mac's IP address: `192.168.1.100:8081`
   - Find your Mac's IP: System Preferences → Network

---

## API Configuration for iPhone

The current API config uses `localhost` for iOS, which works for the simulator but **not for physical devices**.

### Update `apps/loan-automation-app/src/config/api.ts`:

```typescript
const getBaseURL = (port: number): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      const apiHost = '10.0.2.2'; // or your IP for physical device
      return `http://${apiHost}:${port}`;
    } else if (Platform.OS === 'ios') {
      // iOS Simulator uses localhost
      // Physical iPhone needs your Mac's IP address
      const apiHost = __DEV__ ? 'localhost' : 'YOUR_MAC_IP'; // Change for physical device
      return `http://${apiHost}:${port}`;
    }
    return `http://localhost:${port}`;
  }
  // Production...
};
```

**For physical iPhone testing**, change `'localhost'` to your Mac's IP address (e.g., `'192.168.1.100'`).

---

## Troubleshooting

### "No devices found"
- Make sure iPhone is connected via USB
- Check Xcode → Window → Devices and Simulators
- Trust the computer on your iPhone

### "Code signing error"
- Open project in Xcode
- Go to Signing & Capabilities
- Select your Apple ID team
- Xcode will handle provisioning automatically

### "Cannot connect to Metro"
- Make sure Metro is running: `pnpm start`
- Check Mac's firewall settings
- Configure bundler manually on iPhone (shake device)

### "Network request failed"
- Make sure iPhone and Mac are on same WiFi
- Update API config to use Mac's IP (not localhost)
- Check Mac's firewall allows connections

---

## Alternative: Using Expo (From Windows)

If you don't have a Mac, you can use **Expo** to build iOS apps:

1. **Convert to Expo** (requires significant refactoring)
2. **Use Expo Go** for development (limited native features)
3. **Use EAS Build** for production builds (cloud-based, free tier available)

However, this would require:
- Converting your React Native CLI app to Expo
- Some native modules might not work
- More limited than native development

---

## Summary

| Method | Requirements | Difficulty |
|--------|-------------|------------|
| **Mac + Xcode** | macOS, Xcode | ⭐ Easy |
| **Cloud Mac** | Subscription service | ⭐⭐ Medium |
| **Expo** | Expo account | ⭐⭐⭐ Hard (requires conversion) |

**Recommendation**: If you have access to a Mac (even borrowed), that's the easiest path. Otherwise, consider using Android for now or exploring cloud Mac services.

---

## Quick Commands (Mac)

```bash
# Check connected devices
xcrun simctl list devices

# Run on specific device
pnpm ios --device "iPhone Name"

# Run on simulator
pnpm ios --simulator "iPhone 15"

# Install CocoaPods dependencies
cd ios && pod install && cd ..

# Clean build
cd ios && xcodebuild clean && cd ..
```

