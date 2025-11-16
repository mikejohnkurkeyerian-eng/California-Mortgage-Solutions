# Verify Git Push - Check What's Actually on GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verifying Git Repository Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git repo exists
if (-not (Test-Path .git)) {
    Write-Host "ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Run: git init" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Checking remote..." -ForegroundColor Yellow
$remote = git remote -v 2>&1
if ($remote) {
    Write-Host "Remote configured:" -ForegroundColor Green
    Write-Host $remote -ForegroundColor White
} else {
    Write-Host "WARNING: No remote configured!" -ForegroundColor Red
    Write-Host "You need to add your GitHub remote:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor White
}

Write-Host ""
Write-Host "Checking current branch..." -ForegroundColor Yellow
$branch = git branch --show-current 2>&1
Write-Host "Current branch: $branch" -ForegroundColor White

Write-Host ""
Write-Host "Checking if files are tracked..." -ForegroundColor Yellow
if (Test-Path "services/loan-service/nixpacks.toml") {
    $tracked = git ls-files "services/loan-service/nixpacks.toml" 2>&1
    if ($tracked) {
        Write-Host "✓ nixpacks.toml is tracked by git" -ForegroundColor Green
    } else {
        Write-Host "✗ nixpacks.toml is NOT tracked - need to add it!" -ForegroundColor Red
    }
} else {
    Write-Host "✗ nixpacks.toml file not found locally!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking last commit..." -ForegroundColor Yellow
$lastCommit = git log -1 --oneline 2>&1
if ($lastCommit) {
    Write-Host "Last commit: $lastCommit" -ForegroundColor White
} else {
    Write-Host "WARNING: No commits found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure all files are added: git add ." -ForegroundColor White
Write-Host "2. Commit: git commit -m 'Add files'" -ForegroundColor White
Write-Host "3. Push: git push" -ForegroundColor White
Write-Host "4. Check GitHub to verify files are there" -ForegroundColor White
Write-Host ""

