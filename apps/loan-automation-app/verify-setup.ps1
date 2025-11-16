# Verification Script for React Native Android App Setup
# This script verifies all components are configured correctly

Write-Host "Verifying React Native Android App Setup..." -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# 1. Check Java Installation
Write-Host "[1] Checking Java installation..." -ForegroundColor Yellow
$javaHome = "C:\Users\Mike\Java\java-21-openjdk-21.0.4.0.7-1.win.jdk.x86_64"
if (Test-Path "$javaHome\bin\java.exe") {
    $javaVersion = & "$javaHome\bin\java.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "  [OK] Java found: $javaVersion" -ForegroundColor Green
} else {
    $errors += "Java not found at $javaHome"
    Write-Host "  [ERROR] Java not found" -ForegroundColor Red
}

# 2. Check Android SDK
Write-Host "[2] Checking Android SDK..." -ForegroundColor Yellow
$androidHome = "C:\Users\Mike\AppData\Local\Android\Sdk"
if (Test-Path "$androidHome\platform-tools\adb.exe") {
    Write-Host "  [OK] Android SDK found" -ForegroundColor Green
} else {
    $errors += "Android SDK not found at $androidHome"
    Write-Host "  [ERROR] Android SDK not found" -ForegroundColor Red
}

# 3. Check Shared Types Package
Write-Host "[3] Checking shared-types package..." -ForegroundColor Yellow
$sharedTypesSrc = "..\..\libs\shared-types\src\index.ts"
$sharedTypesDist = "..\..\libs\shared-types\dist\index.js"
if (Test-Path $sharedTypesSrc) {
    Write-Host "  [OK] Shared types source found" -ForegroundColor Green
} else {
    $errors += "Shared types source not found at $sharedTypesSrc"
    Write-Host "  [ERROR] Shared types source not found" -ForegroundColor Red
}
if (Test-Path $sharedTypesDist) {
    Write-Host "  [OK] Shared types built" -ForegroundColor Green
} else {
    $warnings += "Shared types not built. Run: cd ../../libs/shared-types && pnpm build"
    Write-Host "  [WARN] Shared types not built (will use source)" -ForegroundColor Yellow
}

# 4. Check TypeScript Compilation
Write-Host "[4] Checking TypeScript compilation..." -ForegroundColor Yellow
$tscResult = & pnpm tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] TypeScript compilation successful" -ForegroundColor Green
} else {
    $errors += "TypeScript compilation failed"
    Write-Host "  [ERROR] TypeScript compilation failed:" -ForegroundColor Red
    $tscResult | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
}

# 5. Check Metro Configuration
Write-Host "[5] Checking Metro configuration..." -ForegroundColor Yellow
if (Test-Path "metro.config.js") {
    $metroConfig = Get-Content "metro.config.js" -Raw
    if ($metroConfig -match "@loan-platform/shared-types") {
        Write-Host "  [OK] Metro config has shared-types alias" -ForegroundColor Green
    } else {
        $errors += "Metro config missing shared-types alias"
        Write-Host "  [ERROR] Metro config missing shared-types alias" -ForegroundColor Red
    }
} else {
    $errors += "metro.config.js not found"
    Write-Host "  [ERROR] metro.config.js not found" -ForegroundColor Red
}

# 6. Check Babel Configuration
Write-Host "[6] Checking Babel configuration..." -ForegroundColor Yellow
if (Test-Path "babel.config.js") {
    $babelConfig = Get-Content "babel.config.js" -Raw
    if ($babelConfig -match "module-resolver" -and $babelConfig -match "@loan-platform/shared-types") {
        Write-Host "  [OK] Babel config has module-resolver with shared-types alias" -ForegroundColor Green
    } else {
        $errors += "Babel config missing module-resolver or shared-types alias"
        Write-Host "  [ERROR] Babel config incomplete" -ForegroundColor Red
    }
} else {
    $errors += "babel.config.js not found"
    Write-Host "  [ERROR] babel.config.js not found" -ForegroundColor Red
}

# 7. Check All Imports
Write-Host "[7] Checking imports..." -ForegroundColor Yellow
$importFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue | Select-String -Pattern "@shared-types" -ErrorAction SilentlyContinue
if ($importFiles) {
    $warnings += "Found @shared-types imports (should use @loan-platform/shared-types)"
    Write-Host "  [WARN] Found @shared-types imports (should use @loan-platform/shared-types)" -ForegroundColor Yellow
} else {
    Write-Host "  [OK] No @shared-types imports found" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "  [OK] All critical checks passed!" -ForegroundColor Green
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "  Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "    • $warning" -ForegroundColor Yellow
        }
    }
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Green
    Write-Host "  pnpm start --reset-cache" -ForegroundColor Cyan
    Write-Host "  .\run-android.ps1" -ForegroundColor Cyan
} else {
    Write-Host "  [ERROR] Found $($errors.Count) error(s):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "    • $error" -ForegroundColor Red
    }
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "  Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "    • $warning" -ForegroundColor Yellow
        }
    }
    exit 1
}

