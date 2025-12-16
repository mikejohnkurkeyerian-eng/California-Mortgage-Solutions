# Running React Native App on iOS Phone

## Important Note
**iOS apps can only be built on macOS with Xcode.** Since you're on Windows, you have a few options:

## Option 1: Use a Mac (Recommended)

If you have access to a Mac (physical or cloud service like MacStadium, MacinCloud):

### Step 1: Install Prerequisites on Mac
```bash
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# Install Node.js and pnpm (if not already installed)
```

### Step 2: Clone/Transfer Project to Mac
Transfer your project to the Mac and install dependencies:
```bash
cd apps/loan-automation-app
pnpm install
```

### Step 3: Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### Step 4: Start Metro Bundler
```bash
pnpm start:dev
# Or
pnpm start
```

### Step 5: Run on iOS Device
```bash
# Connect iPhone via USB
# Trust the computer on your iPhone when prompted

# Run the app
pnpm ios

# Or specify your device
pnpm ios --device "Your iPhone Name"
```

### Step 6: Configure for Wi-Fi Connection
1. **First run via USB** to install the app
2. **Shake your iPhone** (or press Cmd+D in simulator)
3. Select **"Settings"**
4. Enter **"Debug server host & port for device"**
5. Enter your Mac's IP address: `YOUR_MAC_IP:8081`
6. Press **"Reload"**

## Option 2: Use Expo (Easier for iOS on Windows)

Expo allows you to run React Native apps on iOS without a Mac:

### Step 1: Install Expo CLI
```powershell
pnpm add -g expo-cli
# Or
npm install -g expo-cli
```

### Step 2: Install Expo Go on Your iPhone
- Download "Expo Go" from the App Store

### Step 3: Start Expo
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
npx expo start
```

### Step 4: Connect Your Phone
- Scan the QR code with Expo Go app
- Or enter the URL manually in Expo Go

**Note:** This requires converting your app to use Expo, which may need code changes.

## Option 3: Use React Native Web (Browser Testing)

Test your app in a web browser (limited native features):

```powershell
# Install react-native-web
pnpm add react-native-web

# Run in browser
pnpm web
```

## Option 4: Cloud Mac Services

Use a cloud Mac service to build iOS apps:
- **MacStadium** - https://www.macstadium.com/
- **MacinCloud** - https://www.macincloud.com/
- **AWS EC2 Mac instances**

## Current Setup (Windows)

Since you're on Windows, here's what you can do right now:

### 1. Start Metro Bundler (Development Server)
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start:dev
```

This will show your computer's IP address (e.g., `192.168.50.76`).

### 2. Build for iOS (Requires Mac)
You'll need to:
- Transfer project to a Mac
- Install Xcode and CocoaPods
- Run `pnpm ios` on the Mac

### 3. Connect iPhone to Metro (After App is Installed)
Once the app is installed on your iPhone (via Mac):
1. Make sure iPhone and computer are on same Wi-Fi
2. Open the app on iPhone
3. Shake iPhone → "Settings" → "Debug server host"
4. Enter: `192.168.50.76:8081` (your Windows computer's IP)
5. Press "Reload"

## Troubleshooting

### "No devices found"
- Make sure iPhone is connected via USB
- Trust the computer on your iPhone
- Check Xcode → Window → Devices and Simulators

### "Could not connect to development server"
- Ensure Metro is running
- Check firewall settings
- Verify iPhone and computer are on same Wi-Fi
- Try USB connection first, then switch to Wi-Fi

### "Code signing error"
- Open project in Xcode
- Select your development team in Signing & Capabilities
- Xcode will automatically manage certificates

## Recommended Workflow

1. **Development on Windows:**
   - Use Android emulator or device
   - Test most features on Android

2. **iOS Testing:**
   - Use a Mac (physical or cloud) for iOS builds
   - Or use Expo for easier iOS development

3. **Production:**
   - Build iOS app on Mac
   - Submit to App Store from Mac

## Quick Commands Reference

```bash
# On Mac - Install iOS dependencies
cd ios && pod install && cd ..

# On Mac - Run on iOS device
pnpm ios

# On Mac - Run on iOS simulator
pnpm ios --simulator "iPhone 15"

# On Windows/Mac - Start Metro
pnpm start:dev

# On Windows/Mac - Stop Metro
pnpm stop:metro
```

