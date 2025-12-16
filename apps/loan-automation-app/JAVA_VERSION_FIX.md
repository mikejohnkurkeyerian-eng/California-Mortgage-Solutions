# Java Version Fix - Required: Java 17

## Problem
You're using **Java 21**, but React Native 0.73 requires **Java 17**. The error "Unsupported class file major version 65" indicates Java 21 is being used.

**Note:** Android Studio's bundled JDK is also Java 21, so you need to install Java 17 separately.

## Quick Solution: Run the Install Script

1. **Open PowerShell as Administrator**:
   - Right-click Start menu → "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Run the install script**:
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
   .\install-java17.ps1
   ```

3. **After installation**:
   - Restart your terminal
   - Restart Android Studio
   - Verify: `java -version` (should show 17.x.x)

## Manual Solution: Install Java 17

### Option 1: Install Java 17 via Chocolatey (Recommended)

1. **Install Chocolatey** (if not already installed):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install Java 17**:
   ```powershell
   choco install openjdk17 -y
   ```

3. **Set JAVA_HOME** (replace path if different):
   ```powershell
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot', 'User')
   ```

4. **Update PATH**:
   ```powershell
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
   $newPath = "$env:JAVA_HOME\bin;$currentPath"
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
   ```

5. **Restart your terminal** and verify:
   ```powershell
   java -version
   ```
   Should show: `openjdk version "17.x.x"`

### Option 2: Manual Installation

1. **Download Java 17**:
   - Visit: https://adoptium.net/temurin/releases/?version=17
   - Download Windows x64 JDK (`.msi` installer)

2. **Install** the downloaded `.msi` file

3. **Set JAVA_HOME**:
   - Open "Environment Variables" (search in Start menu)
   - Under "User variables", click "New"
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot` (adjust version number)

4. **Update PATH**:
   - Edit the `Path` variable in "User variables"
   - Add: `%JAVA_HOME%\bin`

5. **Restart your terminal** and verify:
   ```powershell
   java -version
   ```

### Option 3: Use Android Studio's JDK

Android Studio comes with JDK 17. You can use it:

1. **Find Android Studio's JDK**:
   - Usually at: `C:\Program Files\Android\Android Studio\jbr`
   - Or: `C:\Users\Mike\AppData\Local\Android\Sdk\jbr`

2. **Set JAVA_HOME** to that path:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
   ```

3. **Update PATH**:
   ```powershell
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
   $newPath = "$env:JAVA_HOME\bin;$currentPath"
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
   ```

4. **Restart terminal** and verify

## After Installing Java 17

1. **Close Android Studio** (if open)

2. **Restart your terminal/PowerShell**

3. **Verify Java version**:
   ```powershell
   java -version
   ```
   Should show version 17.x.x

4. **Clear Gradle cache**:
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app\android"
   .\gradlew.bat clean --no-daemon
   ```

5. **Open Android Studio** and try building again

## Configure Android Studio to Use Java 17

1. **File → Settings** (or **Android Studio → Preferences** on Mac)
2. **Build, Execution, Deployment → Build Tools → Gradle**
3. Set **Gradle JDK** to: **17** (or browse to your Java 17 installation)
4. Click **OK**
5. **File → Invalidate Caches / Restart**

## Verify It's Working

After setting up Java 17, try building:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app\android"
.\gradlew.bat assembleDebug
```

If you still get Java version errors, make sure:
- You restarted your terminal after setting JAVA_HOME
- Android Studio is using Java 17 (check Settings → Gradle → Gradle JDK)
- No other Java version is in your PATH before Java 17

