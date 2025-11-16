# Script to diagnose app crashes
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"

Write-Host "=== App Crash Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

# Check Metro bundler
Write-Host "1. Checking Metro bundler..." -ForegroundColor Yellow
$metro = netstat -an | findstr "8081"
if ($metro) {
    Write-Host "   ✓ Metro bundler is running" -ForegroundColor Green
} else {
    Write-Host "   ✗ Metro bundler is NOT running!" -ForegroundColor Red
    Write-Host "   → This is likely causing the crash!" -ForegroundColor Yellow
    Write-Host "   → Start it with: pnpm start" -ForegroundColor Cyan
}
Write-Host ""

# Check emulator
Write-Host "2. Checking emulator..." -ForegroundColor Yellow
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices
$onlineDevice = $devices | Select-String "device\s+device"
if ($onlineDevice) {
    Write-Host "   ✓ Emulator is online: $onlineDevice" -ForegroundColor Green
    $deviceId = ($onlineDevice -split "\s+")[0]
} else {
    Write-Host "   ✗ No online emulator found" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Get crash logs
Write-Host "3. Getting recent crash logs..." -ForegroundColor Yellow
Write-Host "   (Try opening the app now, then check logs below)" -ForegroundColor Gray
Start-Sleep -Seconds 2

$logs = & "$env:ANDROID_HOME\platform-tools\adb.exe" -s $deviceId logcat -d -t 100 | Select-String -Pattern "AndroidRuntime|FATAL|ReactNativeJS|Exception|Error" | Select-Object -Last 30

if ($logs) {
    Write-Host "   Recent errors found:" -ForegroundColor Yellow
    $logs | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
} else {
    Write-Host "   No recent crash logs found" -ForegroundColor Gray
    Write-Host "   Try opening the app now, then run this script again" -ForegroundColor Yellow
}
Write-Host ""

# Recommendations
Write-Host "=== Recommendations ===" -ForegroundColor Cyan
Write-Host "1. Make sure Metro bundler is running: pnpm start" -ForegroundColor White
Write-Host "2. Clear app data and reinstall:" -ForegroundColor White
Write-Host "   adb -s $deviceId shell pm clear com.loanautomationapp" -ForegroundColor Cyan
Write-Host "   .\install-app.ps1" -ForegroundColor Cyan
Write-Host "3. Check Metro bundler terminal for JavaScript errors" -ForegroundColor White

