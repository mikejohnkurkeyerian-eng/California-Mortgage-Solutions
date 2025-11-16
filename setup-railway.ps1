# Railway Setup Script - Deploy Without GitHub
# This script helps you deploy to Railway using Railway CLI

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Deployment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Railway CLI. Please install manually:" -ForegroundColor Red
        Write-Host "  npm install -g @railway/cli" -ForegroundColor White
        exit 1
    }
    Write-Host "Railway CLI installed!" -ForegroundColor Green
} else {
    Write-Host "Railway CLI is already installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: railway login" -ForegroundColor White
Write-Host "2. This will open your browser to authenticate" -ForegroundColor White
Write-Host "3. Then run: railway init" -ForegroundColor White
Write-Host "4. Follow the prompts to create a new project" -ForegroundColor White
Write-Host ""
Write-Host "Note: Railway CLI deployment for monorepos is complex." -ForegroundColor Yellow
Write-Host "Consider using GitHub instead (see SETUP_GITHUB_REPO.md)" -ForegroundColor Yellow
Write-Host ""

