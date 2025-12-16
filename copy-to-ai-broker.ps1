# Copy current project files to AI-Broker repo and push to GitHub

$sourcePath = "C:\Users\Mike\Desktop\AI PROCCESS TEST"
$targetPath = "C:\Users\Mike\Desktop\AI-Broker"

Write-Host "=== Copy Files to AI-Broker Repo ===" -ForegroundColor Cyan
Write-Host ""

# Check if target exists
if (-not (Test-Path $targetPath)) {
    Write-Host "Error: AI-Broker folder not found at: $targetPath" -ForegroundColor Red
    exit 1
}

Write-Host "Source: $sourcePath" -ForegroundColor Gray
Write-Host "Target: $targetPath" -ForegroundColor Gray
Write-Host ""

# Copy services folder
Write-Host "Copying services folder..." -ForegroundColor Green
if (Test-Path "$sourcePath\services") {
    Copy-Item -Path "$sourcePath\services\*" -Destination "$targetPath\services\" -Recurse -Force
    Write-Host "✓ Services copied" -ForegroundColor Green
} else {
    Write-Host "✗ services folder not found in source" -ForegroundColor Red
}

# Copy libs folder (for shared-types)
Write-Host "Copying libs folder..." -ForegroundColor Green
if (Test-Path "$sourcePath\libs") {
    Copy-Item -Path "$sourcePath\libs\*" -Destination "$targetPath\libs\" -Recurse -Force
    Write-Host "✓ Libs copied" -ForegroundColor Green
} else {
    Write-Host "✗ libs folder not found in source" -ForegroundColor Yellow
}

# Copy root config files
Write-Host "Copying root config files..." -ForegroundColor Green
$rootFiles = @("package.json", "pnpm-workspace.yaml", "tsconfig.base.json", ".gitignore")
foreach ($file in $rootFiles) {
    if (Test-Path "$sourcePath\$file") {
        Copy-Item -Path "$sourcePath\$file" -Destination "$targetPath\$file" -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Files Copied! ===" -ForegroundColor Green
Write-Host ""

# Change to AI-Broker directory
Set-Location $targetPath

Write-Host "Checking Git status..." -ForegroundColor Green
git status

Write-Host ""
Write-Host "Do you want to commit and push these changes? (Y/N)" -ForegroundColor Yellow
$push = Read-Host

if ($push -eq "Y" -or $push -eq "y") {
    Write-Host ""
    Write-Host "Adding files..." -ForegroundColor Green
    git add .
    
    Write-Host "Committing..." -ForegroundColor Green
    git commit -m "Add loan-service and dependencies for Railway deployment"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== SUCCESS! ===" -ForegroundColor Green
        Write-Host "Files pushed to: https://github.com/rdp9fbqj5c-art/AI-Broker.git" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to Railway → loan-service → Settings" -ForegroundColor White
        Write-Host "2. Set Root Directory to: services/loan-service" -ForegroundColor White
        Write-Host "3. Make sure Branch is: main (or master)" -ForegroundColor White
        Write-Host "4. Click 'Redeploy'" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "=== PUSH FAILED ===" -ForegroundColor Red
        Write-Host "Check the error above" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Files copied but not pushed." -ForegroundColor Yellow
    Write-Host "To push manually, run:" -ForegroundColor Yellow
    Write-Host "  cd $targetPath" -ForegroundColor White
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Add loan-service'" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
}
