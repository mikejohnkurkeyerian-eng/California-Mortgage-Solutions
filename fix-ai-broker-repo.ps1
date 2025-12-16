# Fix AI-Broker repo: Remove node_modules from staging and push source code

$repoPath = "C:\Users\Mike\Desktop\AI-Broker"

Write-Host "=== Fix AI-Broker Repository ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $repoPath

# Check if .gitignore exists and has node_modules
Write-Host "Checking .gitignore..." -ForegroundColor Green
if (-not (Test-Path .gitignore)) {
    Write-Host "Creating .gitignore..." -ForegroundColor Yellow
    @"
# Node / TypeScript
node_modules/
dist/
coverage/
.turbo/

# Logs & Build
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store

# Env & Secrets
.env
.env.*
!.env.example

# IDE
.idea/
.vscode/
*.swp

# Archives
*.zip
*.tar
*.tar.gz
*.rar
"@ | Out-File -FilePath .gitignore -Encoding utf8
    Write-Host "✓ .gitignore created" -ForegroundColor Green
} else {
    Write-Host "✓ .gitignore exists" -ForegroundColor Green
}

# Remove node_modules from staging
Write-Host ""
Write-Host "Removing node_modules from staging..." -ForegroundColor Green
git reset HEAD "**/node_modules/**" 2>&1 | Out-Null
git reset HEAD "node_modules/**" 2>&1 | Out-Null

# Add .gitignore if it's new
git add .gitignore

Write-Host "✓ node_modules removed from staging" -ForegroundColor Green

# Show what will be committed (excluding node_modules)
Write-Host ""
Write-Host "Files ready to commit (excluding node_modules):" -ForegroundColor Green
git status --short | Select-String -NotMatch "node_modules" | Select-Object -First 20
Write-Host "... (showing first 20)" -ForegroundColor Gray
Write-Host ""

Write-Host "Do you want to commit and push? (Y/N)" -ForegroundColor Yellow
$push = Read-Host

if ($push -eq "Y" -or $push -eq "y") {
    Write-Host ""
    Write-Host "Committing files..." -ForegroundColor Green
    git commit -m "Add loan-service and other services for Railway deployment"
    
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== SUCCESS! ===" -ForegroundColor Green
        Write-Host "Files pushed to: https://github.com/rdp9fbqj5c-art/AI-Broker.git" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to Railway → loan-service → Settings" -ForegroundColor White
        Write-Host "2. Set Root Directory to: services/loan-service" -ForegroundColor White
        Write-Host "3. Make sure Branch is: main" -ForegroundColor White
        Write-Host "4. Click 'Redeploy'" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "=== PUSH FAILED ===" -ForegroundColor Red
        Write-Host "Check the error above" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Skipped commit/push. Run manually:" -ForegroundColor Yellow
    Write-Host "  cd $repoPath" -ForegroundColor White
    Write-Host "  git commit -m 'Add services'" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
}

