# Production Build Script for Android
# This builds a release APK that can be installed without Metro

Write-Host "=== Building Production APK ===" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Users\Mike\Java\java-21-openjdk-21.0.4.0.7-1.win.jdk.x86_64"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Set Android SDK paths
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$platformToolsPath = Join-Path $env:ANDROID_HOME "platform-tools"
$emulatorPath = Join-Path $env:ANDROID_HOME "emulator"
$env:PATH += ";$platformToolsPath;$emulatorPath"

Write-Host "Step 1: Cleaning previous builds..." -ForegroundColor Yellow
cd android
& ".\gradlew.bat" clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Clean had warnings, continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Building release APK..." -ForegroundColor Yellow
& ".\gradlew.bat" assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Production APK built successfully!" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK Location: $((Get-Location).Path)\$apkPath" -ForegroundColor Cyan
        Write-Host "APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now:" -ForegroundColor Yellow
        Write-Host "  1. Install on device: adb install $apkPath" -ForegroundColor White
        Write-Host "  2. Share the APK file with others" -ForegroundColor White
        Write-Host "  3. Upload to Google Play Store (after signing)" -ForegroundColor White
    } else {
        Write-Host "[ERROR] APK not found at expected location" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] Build failed. Check errors above." -ForegroundColor Red
}

cd ..

