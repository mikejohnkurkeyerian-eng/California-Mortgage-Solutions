# Android Build Troubleshooting

## Error: gradlew.bat not found (exit code 9009)

This usually means:
1. Java/JDK is not installed or not in PATH
2. Android SDK is not configured
3. Gradle wrapper is missing

## Solutions

### 1. Check Java Installation

```powershell
java -version
```

Should show Java 17 or 21. If not installed:
- Download JDK 17 or 21 from Oracle or Adoptium
- Add to PATH: `C:\Program Files\Java\jdk-17\bin`

### 2. Set Android Environment Variables

Add these to your system environment variables:

```
ANDROID_HOME=C:\Users\Mike\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 3. Check Android SDK

In Android Studio:
- Go to: `Tools` → `SDK Manager`
- Make sure these are installed:
  - Android SDK Platform (API 33 or 34)
  - Android SDK Build-Tools
  - Android SDK Platform-Tools

### 4. Run Gradle Wrapper Manually

Try running gradle directly:

```powershell
cd android
.\gradlew.bat app:installDebug
```

### 5. Alternative: Build in Android Studio

1. Open Android Studio
2. File → Open → Select `apps/loan-automation-app/android` folder
3. Wait for Gradle sync
4. Click Run button (green play icon)

## Quick Test

Check if everything is set up:

```powershell
# Check Java
java -version

# Check Android SDK
adb version

# Check Gradle
cd android
.\gradlew.bat --version
```

If any of these fail, fix that issue first.

