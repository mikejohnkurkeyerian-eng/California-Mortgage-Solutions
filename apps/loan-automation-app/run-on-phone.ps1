# Script to run React Native app on your physical Android phone
# Make sure your phone is connected via USB and USB debugging is enabled

Write-Host "=== Running App on Physical Phone ===" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Users\Mike\Java\java-21-openjdk-21.0.4.0.7-1.win.jdk.x86_64"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Set Android SDK paths
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$platformToolsPath = Join-Path $env:ANDROID_HOME "platform-tools"
$emulatorPath = Join-Path $env:ANDROID_HOME "emulator"
$env:PATH += ";$platformToolsPath;$emulatorPath"

# Check for connected devices
Write-Host "Checking for connected devices..." -ForegroundColor Yellow
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices 2>&1

if ($devices -notmatch "device$") {
    Write-Host ""
    Write-Host "[ERROR] No Android device found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Your phone is connected via USB" -ForegroundColor White
    Write-Host "  2. USB Debugging is enabled (Settings → Developer Options)" -ForegroundColor White
    Write-Host "  3. You've accepted the USB debugging prompt on your phone" -ForegroundColor White
    Write-Host ""
    Write-Host "Run 'adb devices' to check connection" -ForegroundColor Cyan
    exit 1
}

Write-Host "[OK] Device found!" -ForegroundColor Green
Write-Host ""

# Get IP address
Write-Host "Getting your computer's IP address..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    ($_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*")
} | Select-Object -First 1).IPAddress

if (-not $ipAddress) {
    Write-Host "[WARN] Could not find WiFi IP. Using first available IP..." -ForegroundColor Yellow
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and 
        $_.IPAddress -notlike "169.254.*"
    } | Select-Object -First 1).IPAddress
}

if ($ipAddress) {
    Write-Host "[OK] Your IP address: $ipAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Make sure your phone is on the same WiFi network!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use this IP, you need to:" -ForegroundColor Cyan
    Write-Host "  1. Edit apps/loan-automation-app/src/config/api.ts" -ForegroundColor White
    Write-Host "  2. Change '10.0.2.2' to '$ipAddress'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set environment variable:" -ForegroundColor Cyan
    Write-Host "  `$env:REACT_NATIVE_API_HOST='$ipAddress'" -ForegroundColor White
    Write-Host ""
    
    # Set environment variable for this session
    $env:REACT_NATIVE_API_HOST = $ipAddress
    Write-Host "[OK] Set REACT_NATIVE_API_HOST=$ipAddress for this session" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Could not determine IP address" -ForegroundColor Red
    Write-Host "Run .\get-ip.ps1 to find your IP manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Building and installing app..." -ForegroundColor Cyan
Write-Host ""

# Build and install
cd android
& ".\gradlew.bat" installDebug
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] App installed successfully!" -ForegroundColor Green
    Write-Host "Launching app..." -ForegroundColor Cyan
    & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n com.loanautomationapp/.MainActivity
    Write-Host ""
    Write-Host "[OK] App should be launching on your phone!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  ✓ Metro bundler is running: pnpm start" -ForegroundColor White
    Write-Host "  ✓ Backend services are running: pnpm start (from root)" -ForegroundColor White
    Write-Host "  ✓ Phone and computer are on same WiFi" -ForegroundColor White
    Write-Host ""
    Write-Host "If Metro doesn't connect automatically:" -ForegroundColor Yellow
    Write-Host "  1. Shake your phone (or press Ctrl+M)" -ForegroundColor White
    Write-Host "  2. Select 'Configure Bundler'" -ForegroundColor White
    Write-Host "  3. Enter: $ipAddress`:8081" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "[ERROR] Installation failed. Check errors above." -ForegroundColor Red
}
cd ..

