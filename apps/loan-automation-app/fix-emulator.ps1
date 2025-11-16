# Script to fix offline emulator
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"

Write-Host "Checking emulator status..." -ForegroundColor Cyan
& "$env:ANDROID_HOME\platform-tools\adb.exe" devices

Write-Host "`nRestarting ADB server..." -ForegroundColor Yellow
& "$env:ANDROID_HOME\platform-tools\adb.exe" kill-server
Start-Sleep -Seconds 2
& "$env:ANDROID_HOME\platform-tools\adb.exe" start-server
Start-Sleep -Seconds 2

Write-Host "`nChecking devices again..." -ForegroundColor Cyan
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices

if ($devices -match "device\s+device$") {
    Write-Host "`n✓ Emulator is ONLINE!" -ForegroundColor Green
    Write-Host "You can now run: .\install-app.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠ Emulator is still offline" -ForegroundColor Yellow
    Write-Host "`nPlease do the following:" -ForegroundColor Yellow
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Go to Device Manager (Tools → Device Manager)" -ForegroundColor White
    Write-Host "3. Stop 'Medium_Phone_API_36.1' (click the square stop button)" -ForegroundColor White
    Write-Host "4. Wait 5 seconds" -ForegroundColor White
    Write-Host "5. Start it again (click the play button)" -ForegroundColor White
    Write-Host "6. Wait 1-2 minutes for the Android home screen to appear" -ForegroundColor White
    Write-Host "7. Then run this script again: .\fix-emulator.ps1" -ForegroundColor Cyan
}

