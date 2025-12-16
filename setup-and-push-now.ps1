# Quick Setup: Initialize Git and Push to GitHub

Write-Host "=== Setup Git and Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Green
if (Test-Path .git) {
    Write-Host "Git already initialized" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
}

# Step 2: Get GitHub URL
Write-Host ""
Write-Host "Step 2: Enter your GitHub repository URL" -ForegroundColor Yellow
Write-Host "Example: https://github.com/yourusername/your-repo-name.git" -ForegroundColor Gray
$repoUrl = Read-Host "GitHub URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: URL required!" -ForegroundColor Red
    exit 1
}

# Step 3: Add remote
Write-Host ""
Write-Host "Step 3: Adding remote..." -ForegroundColor Green
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote exists, updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}
Write-Host "✓ Remote added: $repoUrl" -ForegroundColor Green

# Step 4: Add files
Write-Host ""
Write-Host "Step 4: Adding source files (excluding node_modules, dist, etc.)..." -ForegroundColor Green
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Step 5: Commit
Write-Host ""
Write-Host "Step 5: Creating commit..." -ForegroundColor Green
git commit -m "Initial commit: Add source code for Railway"
Write-Host "✓ Committed" -ForegroundColor Green

# Step 6: Set branch
Write-Host ""
Write-Host "Step 6: Setting branch to 'main'..." -ForegroundColor Green
git branch -M main
Write-Host "✓ Branch set" -ForegroundColor Green

# Step 7: Push
Write-Host ""
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Green
Write-Host "You may need to enter GitHub credentials" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Go to Railway and:" -ForegroundColor Cyan
    Write-Host "1. Settings → Branch: main" -ForegroundColor White
    Write-Host "2. Settings → Root Directory: services/loan-service" -ForegroundColor White
    Write-Host "3. Click 'Redeploy'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== PUSH FAILED ===" -ForegroundColor Red
    Write-Host "Check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Wrong repository URL" -ForegroundColor White
    Write-Host "- Need GitHub authentication (use token)" -ForegroundColor White
    Write-Host "- Repository already has content (may need to pull first)" -ForegroundColor White
}

