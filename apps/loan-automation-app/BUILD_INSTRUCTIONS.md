# Building Production APK

## Important: Correct Directory

The Gradle build files are in the `android` folder, not the root app folder.

## Option 1: Build with Android Studio (Recommended)

1. **Open Android Studio**
2. **File → Open**
3. Navigate to: `C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app\android`
4. Click "OK" to open the project
5. Wait for Gradle sync to complete
6. **Build → Generate Signed Bundle / APK**
7. Select **"APK"** (not AAB)
8. Follow the wizard to create your APK

## Option 2: Build from Command Line

If you want to try command line again, navigate to the `android` folder:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app\android"
.\gradlew.bat assembleRelease
```

The APK will be at:
`apps\loan-automation-app\android\app\build\outputs\apk\release\app-release.apk`

## Note About Kotlin Issue

There's a known Kotlin version compatibility issue with React Native 0.73. Android Studio handles this better than command-line builds, which is why Option 1 is recommended.

## Your Production Backend

Your app is already configured to use:
- **Production URL:** `https://ai-broker-production-62e4.up.railway.app/api`

The app will automatically use this URL when built in production mode.

