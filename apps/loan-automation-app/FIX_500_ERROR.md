# Fix 500 Error - Step by Step

## Quick Fix (No Android Studio Restart Needed)

You **don't need to restart Android Studio**. Just follow these steps:

### Step 1: Stop Metro Bundler
- Press `Ctrl+C` in the terminal where Metro is running
- Or close that terminal window

### Step 2: Clean Android Build
```powershell
cd apps/loan-automation-app/android
.\gradlew.bat clean
cd ..
```

### Step 3: Rebuild the App
```powershell
cd apps/loan-automation-app
pnpm android
```

This will:
- Install the new native modules (Keychain & AsyncStorage)
- Rebuild the app with the updated code
- Install it on your device/emulator

### Step 4: Restart Metro
```powershell
cd apps/loan-automation-app
pnpm start
```

### Step 5: Reload the App
- Shake your device/emulator
- Or press `R` in Metro terminal
- Or press `Ctrl+M` (Windows) / `Cmd+M` (Mac) in emulator

---

## Why This Happens

The 500 error occurs because:
1. We added new native modules (`react-native-keychain` and `@react-native-async-storage`)
2. Native modules need to be compiled into the app
3. The app needs to be rebuilt to include them

---

## If Error Persists

If you still get a 500 error after rebuilding:

1. **Check Metro logs** - Look for red error messages
2. **Check device logs** - Run `adb logcat` to see native errors
3. **Try the fallback** - The code should automatically use AsyncStorage if Keychain fails

The app should work even if Keychain isn't linked - it will use AsyncStorage instead.

---

## Alternative: Skip Authentication for Now

If you want to test other features first:
- When prompted to save loan ID, click **"Skip"**
- The app will work without authentication
- You can add authentication later after rebuilding

