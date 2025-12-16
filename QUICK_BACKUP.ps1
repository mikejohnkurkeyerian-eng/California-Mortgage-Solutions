# Quick Backup Script for Loan Automation Platform
# Run this BEFORE hard wipe to backup your project

$projectPath = "C:\Users\Mike\Desktop\AI PROCCESS TEST"
$backupPath = "D:\BACKUP\loan-automation-platform"  # CHANGE THIS to your backup location
$zipPath = "D:\BACKUP\loan-automation-platform.zip"  # CHANGE THIS to your backup location

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Loan Automation Platform - Backup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if project exists
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Project path not found: $projectPath" -ForegroundColor Red
    Write-Host "Please update the projectPath variable in this script" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Project Path: $projectPath" -ForegroundColor Green
Write-Host "💾 Backup Path: $backupPath" -ForegroundColor Green
Write-Host "📦 Zip Path: $zipPath" -ForegroundColor Green
Write-Host ""

# Create backup directory
if (-not (Test-Path "D:\BACKUP")) {
    Write-Host "Creating backup directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "D:\BACKUP" -Force | Out-Null
}

Write-Host "🔍 Calculating project size..." -ForegroundColor Yellow
$totalSize = (Get-ChildItem -Path $projectPath -Recurse -File -Exclude node_modules,.next,dist,build,android\app\build,android\build -ErrorAction SilentlyContinue | 
    Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "📊 Project size (excluding build files): $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""

# Ask user which backup method
Write-Host "Choose backup method:" -ForegroundColor Yellow
Write-Host "1. Copy entire folder (fast, larger size)" -ForegroundColor White
Write-Host "2. Create ZIP file (slower, smaller size)" -ForegroundColor White
Write-Host "3. Both (recommended)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1, 2, or 3)"

if ($choice -eq "1" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "📂 Copying project folder..." -ForegroundColor Yellow
    
    # Copy excluding build folders
    robocopy "$projectPath" "$backupPath" /E /XD node_modules .next dist build android\app\build android\build /XF .env.local /NFL /NDL /NJH /NJS
    
    if ($LASTEXITCODE -le 1) {
        Write-Host "✅ Project folder copied successfully!" -ForegroundColor Green
        Write-Host "   Location: $backupPath" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Copy completed with warnings (exit code: $LASTEXITCODE)" -ForegroundColor Yellow
    }
}

if ($choice -eq "2" -or $choice -eq "3") {
    Write-Host ""
    Write-Host "📦 Creating ZIP archive..." -ForegroundColor Yellow
    
    # Remove old zip if exists
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
        Write-Host "   Removed old backup ZIP" -ForegroundColor Gray
    }
    
    # Create zip (excluding build files)
    $tempBackup = "$env:TEMP\loan-automation-temp"
    if (Test-Path $tempBackup) {
        Remove-Item $tempBackup -Recurse -Force
    }
    
    # Copy to temp (excluding build files)
    robocopy "$projectPath" "$tempBackup" /E /XD node_modules .next dist build android\app\build android\build /XF .env.local /NFL /NDL /NJH /NJS | Out-Null
    
    # Compress
    Compress-Archive -Path "$tempBackup\*" -DestinationPath $zipPath -CompressionLevel Optimal
    
    # Clean up temp
    Remove-Item $tempBackup -Recurse -Force
    
    if (Test-Path $zipPath) {
        $zipSize = (Get-Item $zipPath).Length / 1MB
        Write-Host "✅ ZIP archive created successfully!" -ForegroundColor Green
        Write-Host "   Location: $zipPath" -ForegroundColor Cyan
        Write-Host "   Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to create ZIP archive" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Backup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What was backed up:" -ForegroundColor Yellow
Write-Host "   ✅ All source code (src/ folders)" -ForegroundColor White
Write-Host "   ✅ All configuration files (package.json, tsconfig.json, etc.)" -ForegroundColor White
Write-Host "   ✅ All documentation (*.md files)" -ForegroundColor White
Write-Host "   ✅ Database schema (prisma/)" -ForegroundColor White
Write-Host ""
Write-Host "❌ What was excluded (can rebuild):" -ForegroundColor Yellow
Write-Host "   ❌ node_modules/ (can reinstall with 'pnpm install')" -ForegroundColor White
Write-Host "   ❌ .next/ (can rebuild with 'pnpm dev')" -ForegroundColor White
Write-Host "   ❌ dist/ and build/ (can rebuild with 'pnpm build')" -ForegroundColor White
Write-Host ""
Write-Host "🔄 After hard wipe, restore and run:" -ForegroundColor Yellow
Write-Host "   1. Restore backup folder" -ForegroundColor White
Write-Host "   2. Run: pnpm install" -ForegroundColor White
Write-Host "   3. Run: pnpm --filter @loan-platform/shared-types build" -ForegroundColor White
Write-Host "   4. Test: cd services\loan-service && pnpm start" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Also backup your API keys and credentials in a secure location!" -ForegroundColor Yellow
Write-Host ""

