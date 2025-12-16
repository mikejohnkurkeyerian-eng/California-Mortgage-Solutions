# Push ONLY Source Code to GitHub (No node_modules, No Build Artifacts)
# Railway will install dependencies and build itself

Write-Host "=== Push Source Code to GitHub ===" -ForegroundColor Cyan
Write-Host "This will push ONLY source files (no node_modules, no build artifacts)" -ForegroundColor Yellow
Write-Host ""

# Check if already a git repo
if (Test-Path .git) {
    Write-Host "Git repository already exists" -ForegroundColor Green
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
}

Write-Host ""
Write-Host "=== Enter Your GitHub Repository URL ===" -ForegroundColor Yellow
Write-Host "Example: https://github.com/yourusername/your-repo-name.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "GitHub Repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: Repository URL is required!" -ForegroundColor Red
    exit 1
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    Write-Host "Do you want to update it? (Y/N)" -ForegroundColor Yellow
    $update = Read-Host
    if ($update -eq "Y" -or $update -eq "y") {
        git remote set-url origin $repoUrl
        Write-Host "Remote updated!" -ForegroundColor Green
    }
} else {
    git remote add origin $repoUrl
    Write-Host "Remote added!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking what will be committed..." -ForegroundColor Green
Write-Host "(node_modules, dist, and build folders are excluded by .gitignore)" -ForegroundColor Gray
Write-Host ""

# Show what will be added
git add --dry-run . 2>&1 | Select-Object -First 20
Write-Host ""
Write-Host "... (showing first 20 files)" -ForegroundColor Gray
Write-Host ""

Write-Host "Do you want to continue? (Y/N)" -ForegroundColor Yellow
$continue = Read-Host
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Host "Cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Adding source files (excluding node_modules, dist, build artifacts)..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Green
git commit -m "Add source code for Railway deployment (excludes node_modules and build artifacts)"

Write-Host ""
Write-Host "Setting branch to 'main'..." -ForegroundColor Green
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Green
Write-Host "You may be prompted for GitHub credentials" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== SUCCESS! ===" -ForegroundColor Green
    Write-Host "Your source code is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Railway → loan-service → Settings" -ForegroundColor White
    Write-Host "2. Make sure Branch is set to 'main'" -ForegroundColor White
    Write-Host "3. Set Root Directory to: services/loan-service" -ForegroundColor White
    Write-Host "4. Click 'Redeploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "Railway will:" -ForegroundColor Cyan
    Write-Host "- Clone your repo" -ForegroundColor White
    Write-Host "- Install dependencies (pnpm install)" -ForegroundColor White
    Write-Host "- Build your code" -ForegroundColor White
    Write-Host "- Start your service" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== ERROR ===" -ForegroundColor Red
    Write-Host "Push failed. Check the error above." -ForegroundColor Red
}

