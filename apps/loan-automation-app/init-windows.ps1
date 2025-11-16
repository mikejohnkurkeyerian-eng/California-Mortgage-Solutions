# Script to initialize React Native Windows with pnpm workspace support
# This works around the issue where react-native-windows-init uses npm instead of pnpm

Write-Host "Initializing React Native Windows..." -ForegroundColor Green

# Step 1: Create a temporary package.json without workspace dependencies
$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Save original
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json.backup"

# Remove workspace dependencies temporarily
$packageJson.dependencies = $packageJson.dependencies.PSObject.Properties | Where-Object { $_.Value -notlike "workspace:*" } | ForEach-Object { @{$_.Name = $_.Value} } | ForEach-Object { $_.GetEnumerator() } | ForEach-Object { @{$_.Key = $_.Value} } | ForEach-Object { $_.GetEnumerator() } | ForEach-Object { @{$_.Name = $_.Value} }

# Actually, simpler approach - just comment out the workspace dependency
$packageJsonContent = Get-Content "package.json" -Raw
$packageJsonContent = $packageJsonContent -replace '"@loan-platform/shared-types": "workspace:\^"', '"@loan-platform/shared-types": "file:../../libs/shared-types"'

# Write temporary package.json
$packageJsonContent | Set-Content "package.json.temp"

Write-Host "Temporary package.json created. Now run:" -ForegroundColor Yellow
Write-Host "  npx react-native-windows-init --overwrite" -ForegroundColor Cyan
Write-Host ""
Write-Host "After it completes, restore with:" -ForegroundColor Yellow
Write-Host "  pnpm install" -ForegroundColor Cyan

