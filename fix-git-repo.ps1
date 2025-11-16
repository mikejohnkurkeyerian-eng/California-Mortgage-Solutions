# Fix Git Repository - Initialize or Connect to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Git Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .git exists
if (Test-Path .git) {
    Write-Host "Git repository already exists! ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "Checking remote..." -ForegroundColor Yellow
    $remote = git remote -v 2>&1
    if ($LASTEXITCODE -eq 0 -and $remote) {
        Write-Host "Remote configured:" -ForegroundColor Green
        Write-Host $remote -ForegroundColor White
        Write-Host ""
        Write-Host "Repository is ready! You can now push files." -ForegroundColor Green
    } else {
        Write-Host "No remote configured. You need to add your GitHub repository." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Run this command (replace with YOUR repo URL):" -ForegroundColor Cyan
        Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git" -ForegroundColor White
    }
} else {
    Write-Host "No git repository found. Initializing..." -ForegroundColor Yellow
    Write-Host ""
    
    # Initialize git
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to initialize git. Make sure git is installed." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Git repository initialized! ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Add your GitHub remote:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Add and commit files:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Push to GitHub:" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    Write-Host ""
}

