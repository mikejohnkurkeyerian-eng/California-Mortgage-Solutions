# Script to start Android emulator with diagnostics
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$emulatorPath = "$env:ANDROID_HOME\emulator\emulator.exe"
$adbPath = "$env:ANDROID_HOME\platform-tools\adb.exe"

Write-Host "=== Android Emulator Startup Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean up any stuck processes
Write-Host "Step 1: Cleaning up stuck processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*emulator*" -or $_.ProcessName -like "*qemu*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Restart ADB
Write-Host "Step 2: Restarting ADB..." -ForegroundColor Yellow
& $adbPath kill-server 2>&1 | Out-Null
Start-Sleep -Seconds 2
& $adbPath start-server
Start-Sleep -Seconds 2

# Step 3: Check available emulators
Write-Host ""
Write-Host "Step 3: Checking available emulators..." -ForegroundColor Yellow
$avds = & $emulatorPath -list-avds
if ($avds) {
    Write-Host "Found emulators:" -ForegroundColor Green
    $avds | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    $emulatorName = $avds[0]
    Write-Host ""
    Write-Host "Using: $emulatorName" -ForegroundColor Cyan
} else {
    Write-Host "No emulators found! Please create one in Android Studio Device Manager." -ForegroundColor Red
    exit 1
}

# Step 4: Check current device status
Write-Host ""
Write-Host "Step 4: Checking device status..." -ForegroundColor Yellow
$devices = & $adbPath devices
Write-Host $devices

# Step 5: Start emulator
Write-Host ""
Write-Host "Step 5: Starting emulator..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes. Please wait..." -ForegroundColor Gray
Write-Host ""

# Start emulator in a new window with verbose logging
$emulatorProcess = Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $emulatorName, "-no-snapshot-load" -PassThru -WindowStyle Normal

Write-Host "Emulator process started (PID: $($emulatorProcess.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Waiting for emulator to boot..." -ForegroundColor Yellow

# Wait and check for device
$maxWait = 120 # 2 minutes
$waited = 0
$checkInterval = 5

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds $checkInterval
    $waited += $checkInterval
    
    $devices = & $adbPath devices 2>&1
    if ($devices -match "device\s+device") {
        Write-Host ""
        Write-Host "Emulator is ONLINE!" -ForegroundColor Green
        Write-Host "You can now run: .\install-app.ps1" -ForegroundColor Cyan
        exit 0
    } elseif ($devices -match "offline") {
        Write-Host "." -NoNewline -ForegroundColor Yellow
    } else {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host ""
Write-Host "Emulator did not come online within 2 minutes." -ForegroundColor Yellow
Write-Host ""
Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
Write-Host "1. Check the emulator window - is it showing the Android boot screen?" -ForegroundColor White
Write-Host "2. Try closing the emulator and running this script again" -ForegroundColor White
Write-Host "3. In Android Studio: Tools → Device Manager → Cold Boot Now" -ForegroundColor White
Write-Host "4. Check if Hyper-V is enabled (can conflict with emulator)" -ForegroundColor White
Write-Host ""
Write-Host "Current device status:" -ForegroundColor Cyan
& $adbPath devices

