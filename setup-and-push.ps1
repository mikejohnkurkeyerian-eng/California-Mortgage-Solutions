# Complete Setup and Push to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting Up Git and Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git first: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Initialize git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to initialize git" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files" -ForegroundColor Red
    exit 1
}
Write-Host "Files added!" -ForegroundColor Green

Write-Host ""
Write-Host "Checking remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "No remote configured. You need to add your GitHub repository URL." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To add remote, run:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again, or continue manually:" -ForegroundColor Yellow
    Write-Host "  git commit -m 'Add all project files'" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    exit 0
} else {
    Write-Host "Remote configured: $remote" -ForegroundColor Green
}

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Add all project files including nixpacks.toml for Railway deployment"
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Commit failed. Files may already be committed." -ForegroundColor Yellow
    Write-Host "Continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Branch rename failed. May already be on main." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Note: You may be asked for GitHub credentials." -ForegroundColor Cyan
Write-Host "Use a Personal Access Token as password (not your GitHub password)" -ForegroundColor Cyan
Write-Host ""
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Files pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to GitHub and verify files are there" -ForegroundColor White
    Write-Host "2. Go to Railway -> Settings" -ForegroundColor White
    Write-Host "3. Set Root Directory to: services/loan-service" -ForegroundColor White
    Write-Host "4. Set Branch to: main" -ForegroundColor White
    Write-Host "5. Redeploy" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Wrong credentials (use Personal Access Token)" -ForegroundColor White
    Write-Host "  - Wrong remote URL" -ForegroundColor White
    Write-Host "  - Network issues" -ForegroundColor White
    Write-Host ""
    Write-Host 'Try running: git push -u origin main' -ForegroundColor Cyan
}
