# Install Java 17 for React Native Android Build
# This script downloads and installs Eclipse Temurin JDK 17

Write-Host "Installing Java 17 for React Native..." -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "`nThis script needs Administrator privileges to install Java 17." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host "`nAlternatively, you can:" -ForegroundColor Yellow
    Write-Host "1. Download Java 17 manually from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Cyan
    Write-Host "2. Install the .msi file" -ForegroundColor Cyan
    Write-Host "3. Set JAVA_HOME to the installation directory" -ForegroundColor Cyan
    exit 1
}

# Download URL for Java 17 (Windows x64 MSI)
$downloadUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
$tempFile = "$env:TEMP\jdk17.msi"

Write-Host "`nDownloading Java 17..." -ForegroundColor Cyan
try {
    # Get the actual download URL
    $response = Invoke-WebRequest -Uri "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse?direct=true" -UseBasicParsing
    $actualUrl = $response.BaseResponse.ResponseUri.AbsoluteUri
    
    Invoke-WebRequest -Uri $actualUrl -OutFile $tempFile -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "`nFailed to download Java 17 automatically." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nPlease download manually from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
    Write-Host "Look for 'Windows x64' JDK installer (.msi)" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nInstalling Java 17..." -ForegroundColor Cyan
Write-Host "This may take a few minutes. Please wait..." -ForegroundColor Yellow

try {
    # Install silently
    $installArgs = "/i `"$tempFile`" /quiet /norestart ADDLOCAL=FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome INSTALLDIR=`"C:\Program Files\Eclipse Adoptium\jdk-17.0.0-hotspot`""
    Start-Process msiexec.exe -ArgumentList $installArgs -Wait -NoNewWindow
    
    Write-Host "Installation complete!" -ForegroundColor Green
    
    # Find the actual installation directory
    $javaHome = Get-ChildItem "C:\Program Files\Eclipse Adoptium\" -Directory -Filter "jdk-17*" | Select-Object -First 1 -ExpandProperty FullName
    
    if ($javaHome) {
        Write-Host "`nJava 17 installed at: $javaHome" -ForegroundColor Green
        
        # Set JAVA_HOME
        Write-Host "`nSetting JAVA_HOME environment variable..." -ForegroundColor Cyan
        [System.Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'Machine')
        
        # Update PATH
        Write-Host "Updating PATH..." -ForegroundColor Cyan
        $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
        $javaBin = "$javaHome\bin"
        if ($currentPath -notlike "*$javaBin*") {
            $newPath = "$javaBin;$currentPath"
            [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
        }
        
        Write-Host "`n✅ Java 17 installation complete!" -ForegroundColor Green
        Write-Host "`nIMPORTANT: You need to:" -ForegroundColor Yellow
        Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor Yellow
        Write-Host "2. Restart Android Studio" -ForegroundColor Yellow
        Write-Host "3. Verify with: java -version" -ForegroundColor Yellow
        Write-Host "`nThen update gradle.properties with:" -ForegroundColor Cyan
        Write-Host "org.gradle.java.home=$javaHome" -ForegroundColor White
    } else {
        Write-Host "`n⚠️  Installation may have completed, but couldn't find Java directory." -ForegroundColor Yellow
        Write-Host "Please check: C:\Program Files\Eclipse Adoptium\" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "`nInstallation failed: $_" -ForegroundColor Red
    Write-Host "You may need to install manually from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
}

# Clean up
if (Test-Path $tempFile) {
    Remove-Item $tempFile -Force
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

