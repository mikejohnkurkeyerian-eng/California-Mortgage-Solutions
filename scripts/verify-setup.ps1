# Verification Script for React Native Windows Setup
# Run this script to check if all required components are installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "React Native Windows Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -lt 18) {
        Write-Host "  ⚠ Warning: Node.js 18+ recommended (you have $nodeVersion)" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "  ✗ Node.js NOT found" -ForegroundColor Red
    Write-Host "    Download from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python installed: $pythonVersion" -ForegroundColor Green
    
    $pythonMajor = [int]($pythonVersion -replace 'Python (\d+)\..*', '$1')
    if ($pythonMajor -lt 3) {
        Write-Host "  ✗ Python 3.x required" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ✗ Python NOT found" -ForegroundColor Red
    Write-Host "    Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "    Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Visual Studio C++ Compiler
Write-Host "Checking Visual Studio C++ Compiler..." -ForegroundColor Yellow
try {
    # Try to find cl.exe (C++ compiler)
    $clPath = Get-Command cl -ErrorAction SilentlyContinue
    
    if ($clPath) {
        Write-Host "  ✓ C++ Compiler (cl.exe) found" -ForegroundColor Green
        Write-Host "    Location: $($clPath.Source)" -ForegroundColor Gray
    } else {
        # Check common Visual Studio installation paths
        $vsPaths = @(
            "${env:ProgramFiles}\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC",
            "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC",
            "${env:ProgramFiles}\Microsoft Visual Studio\2022\Professional\VC\Tools\MSVC",
            "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\Professional\VC\Tools\MSVC"
        )
        
        $found = $false
        foreach ($path in $vsPaths) {
            if (Test-Path $path) {
                Write-Host "  ✓ Visual Studio C++ tools found" -ForegroundColor Green
                Write-Host "    Location: $path" -ForegroundColor Gray
                $found = $true
                break
            }
        }
        
        if (-not $found) {
            Write-Host "  ⚠ C++ Compiler not in PATH" -ForegroundColor Yellow
            Write-Host "    Try running from 'Developer Command Prompt for VS 2022'" -ForegroundColor Yellow
            Write-Host "    Or install 'Desktop development with C++' workload in Visual Studio" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  ✗ C++ Compiler check failed" -ForegroundColor Red
}
Write-Host ""

# Check Windows SDK
Write-Host "Checking Windows SDK..." -ForegroundColor Yellow
$sdkPaths = @(
    "${env:ProgramFiles(x86)}\Windows Kits\10\Include",
    "${env:ProgramFiles}\Windows Kits\10\Include"
)

$sdkFound = $false
foreach ($path in $sdkPaths) {
    if (Test-Path $path) {
        $sdkVersions = Get-ChildItem $path -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d+\.\d+' }
        if ($sdkVersions) {
            $latestSdk = ($sdkVersions | Sort-Object { [version]$_.Name } -Descending | Select-Object -First 1).Name
            Write-Host "  ✓ Windows SDK found: $latestSdk" -ForegroundColor Green
            $sdkFound = $true
            break
        }
    }
}

if (-not $sdkFound) {
    Write-Host "  ⚠ Windows SDK not found" -ForegroundColor Yellow
    Write-Host "    Install Windows 10/11 SDK through Visual Studio Installer" -ForegroundColor Yellow
    Write-Host "    Or install 'Desktop development with C++' workload" -ForegroundColor Yellow
}
Write-Host ""

# Check pnpm
Write-Host "Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "  ✓ pnpm installed: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ pnpm NOT found (optional but recommended)" -ForegroundColor Yellow
    Write-Host "    Install with: npm install -g pnpm" -ForegroundColor Yellow
}
Write-Host ""

# Check if in project directory
Write-Host "Checking project setup..." -ForegroundColor Yellow
if (Test-Path "apps\loan-automation-app\package.json") {
    Write-Host "  ✓ React Native app found" -ForegroundColor Green
} else {
    Write-Host "  ⚠ React Native app not found in expected location" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ Setup looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. cd apps/loan-automation-app" -ForegroundColor White
    Write-Host "2. pnpm install" -ForegroundColor White
    Write-Host "3. pnpm windows" -ForegroundColor White
} else {
    Write-Host "⚠ Some components are missing" -ForegroundColor Yellow
    Write-Host "Please install the missing components above" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

