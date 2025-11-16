# Next Steps - Getting Your App Running

## ✅ Current Status
- ✅ Android build is **successful** (no errors)
- ⚠️ Emulator needs to be restarted (currently offline)

---

## Step 1: Fix the Emulator (Do This First!)

**The emulator is running but showing as "offline". Here's how to fix it:**

1. **Open Android Studio**
2. **Click Device Manager** (phone icon in toolbar) or go to **Tools → Device Manager**
3. **Find "Medium_Phone_API_36.1"**
4. **Click the Stop button** (square icon) to stop it
5. **Wait 5 seconds**
6. **Click the Play button** to start it again
7. **Wait 1-2 minutes** until you see the Android home screen

**Verify it's online:**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
.\check-emulator.ps1
```

You should see:
```
List of devices attached
emulator-5554   device    ← Should say "device", not "offline"
```

---

## Step 2: Start Metro Bundler

**Open a NEW terminal window** and run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start
```

**Keep this terminal open!** You should see:
```
Metro waiting on exp://...
```

---

## Step 3: Install and Run the App

**In the SAME terminal as Step 2** (or a new one), run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
.\run-android.ps1
```

**OR manually:**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
pnpm android
```

**What happens:**
- The app will build (if needed)
- Install on your emulator
- Launch automatically
- Connect to Metro bundler

---

## Step 4: Test the App

Once the app launches, test these features:

### Basic Navigation
- ✅ App opens without crashing
- ✅ Home screen shows "Borrower Portal" and "Broker Console" buttons
- ✅ Tapping buttons navigates correctly

### Borrower Portal
- ✅ Navigate to Borrower Portal
- ✅ Check all 3 tabs: Application, Checklist, Upload
- ✅ Try filling out the loan application form
- ✅ Try uploading a document

### Broker Console
- ✅ Navigate to Broker Console
- ✅ Check Dashboard tab
- ✅ View loan list (if any loans exist)

---

## Step 5: Start Backend Services (Optional)

If you want to test full integration with backend:

**Open a NEW terminal** and run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
.\scripts\start-all.ps1
```

This starts:
- Loan Service (port 4002)
- Document Service (port 4003)
- Workflow Service (port 4004)
- Rules Service (port 4005)

**Then test:**
- Submit a loan application → Check Loan Service logs
- Upload a document → Check Document Service logs
- View dashboard → Should show your applications

---

## Troubleshooting

### Emulator Still Offline?
1. Close Android Studio completely
2. Kill all emulator processes: `Get-Process | Where-Object {$_.ProcessName -like "*emulator*"} | Stop-Process -Force`
3. Restart Android Studio
4. Start emulator from Device Manager
5. Wait 2 minutes for full boot

### App Won't Install?
- Make sure emulator shows as "device" (not "offline")
- Check Metro bundler is running
- Try: `.\gradlew.bat clean` then `pnpm android`

### Build Errors?
- The build is already working! If you see new errors, check:
  - JAVA_HOME is set correctly
  - Android SDK path is correct
  - Gradle cache: `.\gradlew.bat clean`

### Metro Bundler Issues?
- Stop Metro (Ctrl+C)
- Clear cache: `pnpm start --reset-cache`
- Restart Metro

---

## Quick Reference Commands

```powershell
# Check emulator status
.\check-emulator.ps1

# Run app (sets up environment + installs)
.\run-android.ps1

# Or manually:
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
pnpm android

# Start Metro bundler
pnpm start

# Start backend services
cd ..\..
.\scripts\start-all.ps1
```

---

## Success Checklist

- [ ] Emulator is online (shows "device" in `adb devices`)
- [ ] Metro bundler is running
- [ ] App installs successfully
- [ ] App launches on emulator
- [ ] Home screen displays correctly
- [ ] Navigation works (Borrower Portal, Broker Console)
- [ ] Forms are interactive
- [ ] No crashes or errors

---

## Need More Help?

See the full testing guide: `docs/testing-guide.md`

