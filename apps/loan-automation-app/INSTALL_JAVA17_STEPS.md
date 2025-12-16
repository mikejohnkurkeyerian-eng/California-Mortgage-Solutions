# Install Java 17 - Step by Step

## Current Status
- ❌ Java 17: **NOT INSTALLED**
- ✅ Java 21: Found at `C:\Users\Mike\Java\java-21-openjdk-21.0.4.0.7-1.win.jdk.x86_64`

## Step 1: Download Java 17

1. **Open your web browser**
2. **Go to**: https://adoptium.net/temurin/releases/?version=17
3. **Select**:
   - Operating System: **Windows**
   - Architecture: **x64**
   - Package Type: **JDK**
4. **Click "Latest Release"** (or any 17.x.x version)
5. **Download** the `.msi` file (installer)

## Step 2: Install Java 17

1. **Run the downloaded `.msi` file**
2. **Click "Next"** through the installer
3. **Keep the default installation path**: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
4. **Click "Install"**
5. **Wait for installation to complete**
6. **Click "Finish"**

## Step 3: Find Your Java 17 Installation Path

After installation, the path will be something like:
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot
```

**To find the exact path**, open PowerShell and run:
```powershell
Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory | Select-Object FullName
```

## Step 4: Set JAVA_HOME

1. **Open PowerShell** (regular is fine, no admin needed for user variables)
2. **Run this command** (replace the path with your actual Java 17 path from Step 3):

```powershell
$java17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $java17Path, 'User')
Write-Host "JAVA_HOME set to: $java17Path"
```

## Step 5: Update PATH

Run this in PowerShell:

```powershell
$java17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot"
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$javaBin = "$java17Path\bin"
if ($currentPath -notlike "*$javaBin*") {
    $newPath = "$javaBin;$currentPath"
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "PATH updated with Java 17"
} else {
    Write-Host "Java 17 already in PATH"
}
```

## Step 6: Verify Installation

1. **Close and reopen PowerShell** (important!)
2. **Run**:
   ```powershell
   java -version
   ```
3. **Should show**: `openjdk version "17.x.x"`

If it still shows Java 21, you may need to:
- Remove Java 21 from PATH (or put Java 17 before it)
- Restart your computer

## Step 7: Configure Android Studio

1. **Open Android Studio**
2. **File → Settings** (or **Android Studio → Preferences** on Mac)
3. **Build, Execution, Deployment → Build Tools → Gradle**
4. **Gradle JDK**: Click dropdown → **Download JDK...**
   - Version: **17**
   - Vendor: **Eclipse Adoptium**
   - Click **Download**
5. **OR** if you already installed it, select it from the dropdown
6. **Click OK**
7. **File → Invalidate Caches / Restart**

## Step 8: Update gradle.properties

After you know your Java 17 path, I'll update `gradle.properties` for you. Just tell me the path!

---

## Quick Command Reference

After installing Java 17, run these commands (replace path with your actual path):

```powershell
# Set JAVA_HOME
$java17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $java17Path, 'User')

# Update PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$javaBin = "$java17Path\bin"
$newPath = "$javaBin;$currentPath"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')

# Verify (close and reopen PowerShell first!)
java -version
```

