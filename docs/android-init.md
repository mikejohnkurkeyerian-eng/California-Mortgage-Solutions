# Initialize Android Project

## The Problem

The React Native app is missing the `android` folder, which contains the native Android project files needed to build and run the app.

## Solution

Run this script from the app directory:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
powershell -ExecutionPolicy Bypass -File .\init-android.ps1
```

Or manually:

### Step 1: Create temporary project
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
npx @react-native-community/cli init --skip-install --template react-native-template-typescript LoanAutomationTemp
```

### Step 2: Copy Android folder
```powershell
Copy-Item -Path .\LoanAutomationTemp\android -Destination .\android -Recurse
```

### Step 3: Clean up
```powershell
Remove-Item -Path .\LoanAutomationTemp -Recurse -Force
```

### Step 4: Update Android project name (optional)

Edit `android/settings.gradle` and change the project name if needed.

## After Initialization

Once the Android folder is created, you can:

1. Make sure Android Studio is set up with an emulator
2. Start the emulator
3. Run: `pnpm android`

## Note

This creates the native Android project structure. The app code in `src/` and `App.tsx` will work with this Android project.

