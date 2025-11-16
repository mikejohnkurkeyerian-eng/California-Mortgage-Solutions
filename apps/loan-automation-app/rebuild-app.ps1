# Quick rebuild script to fix 500 error
# Run this from the project root

Write-Host "=== Rebuilding App to Fix 500 Error ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean Android build
Write-Host "Step 1: Cleaning Android build..." -ForegroundColor Yellow
Set-Location "apps/loan-automation-app/android"
& ".\gradlew.bat" clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Clean had some warnings, continuing..." -ForegroundColor Yellow
}
Set-Location "../.."

Write-Host "[OK] Clean complete" -ForegroundColor Green
Write-Host ""

# Step 2: Rebuild and install
Write-Host "Step 2: Rebuilding and installing app..." -ForegroundColor Yellow
Set-Location "apps/loan-automation-app"
& pnpm android

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start Metro: pnpm start" -ForegroundColor White
Write-Host "2. Reload app on device/emulator" -ForegroundColor White
Write-Host ""

