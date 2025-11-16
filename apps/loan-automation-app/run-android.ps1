# React Native Android Setup Script
# This script sets up the environment and runs the Android app

# Set JAVA_HOME (must be set before any Gradle/Java commands)
# Using Red Hat OpenJDK 21
$env:JAVA_HOME = "C:\Users\Mike\Java\java-21-openjdk-21.0.4.0.7-1.win.jdk.x86_64"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
Write-Host "[OK] JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green

# Set Android SDK paths
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$platformToolsPath = Join-Path $env:ANDROID_HOME "platform-tools"
$emulatorPath = Join-Path $env:ANDROID_HOME "emulator"
$env:PATH += ";$platformToolsPath;$emulatorPath"
Write-Host "[OK] Android SDK paths added" -ForegroundColor Green

# Verify Java is accessible
$javaVersion = & "$env:JAVA_HOME\bin\java.exe" -version 2>&1 | Select-Object -First 1
Write-Host "[OK] Java version: $javaVersion" -ForegroundColor Green

# Check if emulator is running
Write-Host "`nChecking for running emulator..." -ForegroundColor Yellow
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>&1
if ($devices -match "device$") {
    Write-Host "[OK] Device/Emulator found" -ForegroundColor Green
} else {
    Write-Host "[WARN] No device found. Starting emulator..." -ForegroundColor Yellow
    Start-Process -FilePath "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", "Medium_Phone_API_36.1" -WindowStyle Minimized
    Write-Host "Waiting 30 seconds for emulator to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

# Run the app
Write-Host ""
Write-Host "Starting React Native app..." -ForegroundColor Cyan
Write-Host "JAVA_HOME is set for this session" -ForegroundColor Gray

# Ensure JAVA_HOME is in the environment for child processes
# Use Start-Process to ensure environment is inherited, or call directly
# Since we're already in the same process, pnpm should inherit $env:JAVA_HOME
# But React Native CLI might spawn new processes, so we'll use gradlew directly instead

# Check if we should use gradlew directly or pnpm
Write-Host "Installing and launching app..." -ForegroundColor Yellow

# Use gradlew directly to ensure JAVA_HOME is used
cd android
& ".\gradlew.bat" installDebug
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] App installed successfully!" -ForegroundColor Green
    Write-Host "Launching app..." -ForegroundColor Cyan
    & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n com.loanautomationapp/.MainActivity
    Write-Host "[OK] App should be launching on your emulator!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Make sure Metro bundler is running in another terminal:" -ForegroundColor Yellow
    Write-Host "  cd `"C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app`"" -ForegroundColor Cyan
    Write-Host "  pnpm start" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERROR] Installation failed. Check errors above." -ForegroundColor Red
}
cd ..

