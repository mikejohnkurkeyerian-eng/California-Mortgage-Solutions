# Fix Push - Make Sure All Files Are Pushed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Git Status and Pushing Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git repo exists
if (-not (Test-Path .git)) {
    Write-Host "ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Initializing git..." -ForegroundColor Yellow
    git init
}

Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Adding ALL files..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Checking what will be committed..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Committing all files..." -ForegroundColor Yellow
git commit -m "Add all project files for Railway deployment"

Write-Host ""
Write-Host "Checking remote..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No remote configured!" -ForegroundColor Red
    Write-Host "You need to add your GitHub repository URL:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Remote: $remote" -ForegroundColor Green

Write-Host ""
Write-Host "Setting branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may ask for your GitHub credentials again." -ForegroundColor Cyan
Write-Host ""
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Files pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now check your GitHub repository - you should see:" -ForegroundColor Cyan
    Write-Host "  - services/ folder" -ForegroundColor White
    Write-Host "  - services/loan-service/ folder" -ForegroundColor White
    Write-Host "  - All your project files" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Check the error message above." -ForegroundColor Yellow
}

