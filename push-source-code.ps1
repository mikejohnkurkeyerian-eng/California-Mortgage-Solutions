# Push Source Code to GitHub (Not ZIP File)
# This script initializes Git and pushes your actual source code

Write-Host "=== Push Source Code to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Check if already a git repo
if (Test-Path .git) {
    Write-Host "Git repository already exists" -ForegroundColor Yellow
    Write-Host "Checking status..." -ForegroundColor Yellow
    git status
    Write-Host ""
    Write-Host "Do you want to continue? (Y/N)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "Cancelled" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
}

Write-Host ""
Write-Host "=== IMPORTANT: Enter Your GitHub Repository URL ===" -ForegroundColor Yellow
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
Write-Host "Adding all files (ZIP files are ignored)..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Green
git commit -m "Initial commit: Add all source code for Railway deployment"

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
    Write-Host "1. Go to Railway" -ForegroundColor White
    Write-Host "2. Go to loan-service → Settings" -ForegroundColor White
    Write-Host "3. Make sure Branch is set to 'main'" -ForegroundColor White
    Write-Host "4. Set Root Directory to: services/loan-service" -ForegroundColor White
    Write-Host "5. Click 'Redeploy'" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== ERROR ===" -ForegroundColor Red
    Write-Host "Push failed. Check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Wrong repository URL" -ForegroundColor White
    Write-Host "- Authentication required (use GitHub token)" -ForegroundColor White
    Write-Host "- Repository already has content (may need to pull first)" -ForegroundColor White
}

