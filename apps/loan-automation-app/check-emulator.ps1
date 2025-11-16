# Quick script to check emulator status
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
Write-Host "Checking emulator status..." -ForegroundColor Cyan
& "$env:ANDROID_HOME\platform-tools\adb.exe" devices
Write-Host "`nIf you see 'device' (not 'offline'), you're ready!" -ForegroundColor Green
Write-Host "If you see 'offline', restart the emulator from Android Studio Device Manager." -ForegroundColor Yellow

