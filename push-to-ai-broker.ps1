# Push Current Project to AI-Broker GitHub Repository

Write-Host "=== Push to AI-Broker Repository ===" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/rdp9fbqj5c-art/AI-Broker.git"

Write-Host "Target repository: $repoUrl" -ForegroundColor Green
Write-Host ""

# Initialize Git if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
} else {
    Write-Host "Git repository already exists" -ForegroundColor Yellow
}

# Set remote
Write-Host "Setting remote to AI-Broker..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $repoUrl
Write-Host "✓ Remote set" -ForegroundColor Green

# Add files
Write-Host "Adding source files (excluding node_modules, dist, etc.)..." -ForegroundColor Green
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Commit
Write-Host "Creating commit..." -ForegroundColor Green
git commit -m "Add loan automation project source code for Railway deployment"
Write-Host "✓ Committed" -ForegroundColor Green

# Set branch
Write-Host "Setting branch to 'main'..." -ForegroundColor Green
git branch -M main
Write-Host "✓ Branch set" -ForegroundColor Green

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Green
Write-Host "You may need to enter GitHub credentials" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your code is now on GitHub at: $repoUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps in Railway:" -ForegroundColor Cyan
    Write-Host "1. Go to Railway → loan-service → Settings" -ForegroundColor White
    Write-Host "2. Make sure Repository is: $repoUrl" -ForegroundColor White
    Write-Host "3. Set Branch to: main" -ForegroundColor White
    Write-Host "4. Set Root Directory to: services/loan-service" -ForegroundColor White
    Write-Host "5. Click 'Redeploy'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== PUSH FAILED ===" -ForegroundColor Red
    Write-Host "Check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Need GitHub authentication (use personal access token)" -ForegroundColor White
    Write-Host "- Repository already has different content (may need to pull first)" -ForegroundColor White
}

