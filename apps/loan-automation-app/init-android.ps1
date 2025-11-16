# Script to initialize Android project for React Native
# Run this from the apps/loan-automation-app directory

Write-Host "Initializing Android project..." -ForegroundColor Green

# Create a temporary React Native project to get the Android folder
Write-Host "Creating temporary project to extract Android structure..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Use react-native init instead
$tempDir = ".\TempRNProject"
npx react-native init TempRNProject --version 0.73.0 --skip-install

if (Test-Path "$tempDir\android") {
    Write-Host "Copying Android folder..." -ForegroundColor Yellow
    Copy-Item -Path "$tempDir\android" -Destination ".\android" -Recurse -Force
    
    Write-Host "Cleaning up temporary project..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
    
    Write-Host "Android project initialized successfully!" -ForegroundColor Green
    Write-Host "Now you can run: pnpm android" -ForegroundColor Cyan
} else {
    Write-Host "Error: Could not create Android project structure" -ForegroundColor Red
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    exit 1
}

