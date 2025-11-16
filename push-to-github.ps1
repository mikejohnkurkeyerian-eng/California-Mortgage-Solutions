# Script to push code to GitHub
# Run this after you've created a GitHub repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Push Code to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Install with default settings" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Git is installed! ✓" -ForegroundColor Green
Write-Host ""

# Check if already a git repo
if (Test-Path .git) {
    Write-Host "Git repository already initialized" -ForegroundColor Yellow
} else {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git repository initialized! ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files" -ForegroundColor Red
    exit 1
}
Write-Host "Files added! ✓" -ForegroundColor Green

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Loan automation platform"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create commit" -ForegroundColor Red
    Write-Host "Note: If this fails, you may need to configure git user:" -ForegroundColor Yellow
    Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor White
    Write-Host "  git config --global user.email 'your.email@example.com'" -ForegroundColor White
    exit 1
}
Write-Host "Commit created! ✓" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to your GitHub repository page" -ForegroundColor White
Write-Host "2. Copy the repository URL (it looks like:" -ForegroundColor White
Write-Host "   https://github.com/YOUR_USERNAME/REPO_NAME.git)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Run these commands (replace with YOUR repository URL):" -ForegroundColor White
Write-Host ""
Write-Host "   git branch -M main" -ForegroundColor Green
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "4. When asked for password, use a Personal Access Token:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   - Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   - Check 'repo' permission" -ForegroundColor White
Write-Host "   - Copy the token and use it as password" -ForegroundColor White
Write-Host ""
Write-Host "After pushing, go back to Railway and try deploying again!" -ForegroundColor Cyan
Write-Host ""
