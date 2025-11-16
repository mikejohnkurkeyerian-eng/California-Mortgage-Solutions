# Script to find and configure Java installations
# This helps you locate where Red Hat OpenJDK (or any JDK) is installed

Write-Host "Searching for Java installations..." -ForegroundColor Cyan
Write-Host ""

# Common installation paths
$searchPaths = @(
    "C:\Program Files\Java",
    "C:\Program Files\RedHat",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Eclipse Foundation",
    "C:\Program Files (x86)\Java",
    "C:\Program Files (x86)\RedHat",
    "C:\Program Files\Android\Android Studio\jbr"
)

$foundJavas = @()

foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        Write-Host "Checking: $path" -ForegroundColor Yellow
        $jdkDirs = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue | Where-Object {
            $binPath = Join-Path $_.FullName "bin\java.exe"
            Test-Path $binPath
        }
        
        foreach ($jdkDir in $jdkDirs) {
            $javaExe = Join-Path $jdkDir.FullName "bin\java.exe"
            if (Test-Path $javaExe) {
                $version = & $javaExe -version 2>&1 | Select-Object -First 1
                $foundJavas += [PSCustomObject]@{
                    Path = $jdkDir.FullName
                    Version = $version
                    JavaExe = $javaExe
                }
                Write-Host "  ✓ Found: $($jdkDir.FullName)" -ForegroundColor Green
                Write-Host "    Version: $version" -ForegroundColor Gray
            }
        }
    }
}

# Also search in Downloads/Desktop for extracted ZIPs
$userDownloads = "$env:USERPROFILE\Downloads"
$userDesktop = "$env:USERPROFILE\Desktop"

foreach ($searchPath in @($userDownloads, $userDesktop)) {
    if (Test-Path $searchPath) {
        $javaDirs = Get-ChildItem -Path $searchPath -Directory -ErrorAction SilentlyContinue | Where-Object {
            $binPath = Join-Path $_.FullName "bin\java.exe"
            Test-Path $binPath
        }
        
        foreach ($javaDir in $javaDirs) {
            $javaExe = Join-Path $javaDir.FullName "bin\java.exe"
            if (Test-Path $javaExe) {
                $version = & $javaExe -version 2>&1 | Select-Object -First 1
                $foundJavas += [PSCustomObject]@{
                    Path = $javaDir.FullName
                    Version = $version
                    JavaExe = $javaExe
                }
                Write-Host "  ✓ Found (extracted): $($javaDir.FullName)" -ForegroundColor Green
                Write-Host "    Version: $version" -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
if ($foundJavas.Count -eq 0) {
    Write-Host "No Java installations found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "If you downloaded an installer file (.msi or .exe):" -ForegroundColor Yellow
    Write-Host "  1. Double-click it to install" -ForegroundColor White
    Write-Host "  2. Note the installation path shown during install" -ForegroundColor White
    Write-Host "  3. Run this script again to find it" -ForegroundColor White
    Write-Host ""
    Write-Host "If you downloaded a ZIP file:" -ForegroundColor Yellow
    Write-Host "  1. Extract it to a location like C:\Program Files\Java\" -ForegroundColor White
    Write-Host "  2. Make sure it contains a 'bin' folder with 'java.exe'" -ForegroundColor White
    Write-Host "  3. Run this script again to find it" -ForegroundColor White
} else {
    Write-Host "Found $($foundJavas.Count) Java installation(s):" -ForegroundColor Green
    Write-Host ""
    for ($i = 0; $i -lt $foundJavas.Count; $i++) {
        $java = $foundJavas[$i]
        Write-Host "[$($i+1)] $($java.Path)" -ForegroundColor Cyan
        Write-Host "    Version: $($java.Version)" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "To use one of these, update run-android.ps1 with:" -ForegroundColor Yellow
    Write-Host '  $env:JAVA_HOME = "PATH_TO_JDK"' -ForegroundColor White
    Write-Host ""
    Write-Host "For example, to use the first one:" -ForegroundColor Yellow
    Write-Host "  `$env:JAVA_HOME = `"$($foundJavas[0].Path)`"" -ForegroundColor Cyan
}

