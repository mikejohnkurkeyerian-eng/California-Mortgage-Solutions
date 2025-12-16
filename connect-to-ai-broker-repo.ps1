# Connect Current Project to AI-Broker GitHub Repository

Write-Host "=== Connect to AI-Broker Repository ===" -ForegroundColor Cyan
Write-Host ""

$aiBrokerPath = "C:\Users\Mike\Desktop\AI-Broker"
$currentPath = Get-Location

Write-Host "Current project: $currentPath" -ForegroundColor Yellow
Write-Host "Target repo: $aiBrokerPath" -ForegroundColor Yellow
Write-Host ""

# Check if AI-Broker is a Git repo
if (Test-Path "$aiBrokerPath\.git") {
    Write-Host "✓ AI-Broker is a Git repository" -ForegroundColor Green
    
    # Get the GitHub URL
    Push-Location $aiBrokerPath
    $remoteUrl = git remote get-url origin 2>$null
    Pop-Location
    
    if ($LASTEXITCODE -eq 0 -and $remoteUrl) {
        Write-Host "GitHub URL: $remoteUrl" -ForegroundColor Green
        Write-Host ""
        Write-Host "Options:" -ForegroundColor Cyan
        Write-Host "1. Copy files from current project to AI-Broker repo" -ForegroundColor White
        Write-Host "2. Initialize current project and push to AI-Broker repo" -ForegroundColor White
        Write-Host ""
        $choice = Read-Host "Choose option (1 or 2)"
        
        if ($choice -eq "1") {
            Write-Host ""
            Write-Host "Copying files to AI-Broker repo..." -ForegroundColor Green
            Write-Host "This will copy all source files (excluding node_modules, dist, etc.)" -ForegroundColor Yellow
            
            # Copy files (excluding node_modules, dist, .git)
            $exclude = @('node_modules', 'dist', '.git', '.expo', 'build', '.gradle')
            Get-ChildItem -Path $currentPath -Recurse | Where-Object {
                $shouldExclude = $false
                foreach ($ex in $exclude) {
                    if ($_.FullName -like "*\$ex\*" -or $_.FullName -like "*\$ex") {
                        $shouldExclude = $true
                        break
                    }
                }
                -not $shouldExclude
            } | Copy-Item -Destination {
                $_.FullName.Replace($currentPath, $aiBrokerPath)
            } -Force -ErrorAction SilentlyContinue
            
            Write-Host "✓ Files copied" -ForegroundColor Green
            Write-Host ""
            Write-Host "Now go to AI-Broker folder and push:" -ForegroundColor Cyan
            Write-Host "  cd `"$aiBrokerPath`"" -ForegroundColor White
            Write-Host "  git add ." -ForegroundColor White
            Write-Host "  git commit -m `"Add loan automation project`"" -ForegroundColor White
            Write-Host "  git push" -ForegroundColor White
        } else {
            # Initialize current project and push to AI-Broker repo
            Write-Host ""
            Write-Host "Initializing Git in current project..." -ForegroundColor Green
            
            if (-not (Test-Path ".git")) {
                git init
            }
            
            git remote remove origin 2>$null
            git remote add origin $remoteUrl
            
            Write-Host "Adding files..." -ForegroundColor Green
            git add .
            
            Write-Host "Committing..." -ForegroundColor Green
            git commit -m "Add loan automation project source code"
            
            Write-Host "Setting branch..." -ForegroundColor Green
            git branch -M main
            
            Write-Host "Pushing to GitHub..." -ForegroundColor Green
            git push -u origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "=== SUCCESS! ===" -ForegroundColor Green
                Write-Host "Your code is now on GitHub!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Next: Go to Railway and:" -ForegroundColor Cyan
                Write-Host "1. Settings → Branch: main" -ForegroundColor White
                Write-Host "2. Settings → Root Directory: services/loan-service" -ForegroundColor White
                Write-Host "3. Click 'Redeploy'" -ForegroundColor White
            }
        }
    } else {
        Write-Host "⚠ Could not find GitHub remote URL" -ForegroundColor Yellow
        Write-Host "Please provide your GitHub repository URL:" -ForegroundColor Yellow
        $repoUrl = Read-Host "GitHub URL"
        
        if ($repoUrl) {
            # Initialize and push
            if (-not (Test-Path ".git")) {
                git init
            }
            git remote remove origin 2>$null
            git remote add origin $repoUrl
            git add .
            git commit -m "Add loan automation project source code"
            git branch -M main
            git push -u origin main
        }
    }
} else {
    Write-Host "⚠ AI-Broker is NOT a Git repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please provide your GitHub repository URL:" -ForegroundColor Yellow
    $repoUrl = Read-Host "GitHub URL (e.g., https://github.com/username/AI-Broker.git)"
    
    if ($repoUrl) {
        # Initialize current project
        if (-not (Test-Path ".git")) {
            git init
        }
        git remote add origin $repoUrl
        git add .
        git commit -m "Add loan automation project source code"
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "=== SUCCESS! ===" -ForegroundColor Green
            Write-Host "Your code is now on GitHub!" -ForegroundColor Green
        }
    }
}

