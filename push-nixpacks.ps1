# Quick script to push nixpacks.toml files to GitHub
# Just run this script in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing nixpacks.toml files to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "services\loan-service\nixpacks.toml")) {
    Write-Host "ERROR: nixpacks.toml files not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "Adding nixpacks.toml files..." -ForegroundColor Yellow
git add services/loan-service/nixpacks.toml
git add services/document-service/nixpacks.toml
git add services/workflow-service/nixpacks.toml
git add services/rules-service/nixpacks.toml

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git add failed. Make sure git is installed and you're in the right directory." -ForegroundColor Red
    exit 1
}

Write-Host "Files added! ✓" -ForegroundColor Green
Write-Host ""

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Fix: Add nixpacks.toml for Railway deployment"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git commit failed." -ForegroundColor Red
    exit 1
}

Write-Host "Committed! ✓" -ForegroundColor Green
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git push failed. You may need to:" -ForegroundColor Red
    Write-Host "  1. Set up git remote (if first time)" -ForegroundColor Yellow
    Write-Host "  2. Enter your GitHub credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS! Files pushed to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Railway dashboard" -ForegroundColor White
Write-Host "2. Clear the build command (leave empty)" -ForegroundColor White
Write-Host "3. Redeploy the service" -ForegroundColor White
Write-Host ""

