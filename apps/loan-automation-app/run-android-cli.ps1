# Wrapper script to run 'pnpm android' with proper JAVA_HOME
# This ensures React Native CLI can find Java

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Set Android SDK paths
$env:ANDROID_HOME = "C:\Users\Mike\AppData\Local\Android\Sdk"
$env:PATH += ";$($env:ANDROID_HOME)\platform-tools;$($env:ANDROID_HOME)\emulator"

Write-Host "Environment configured:" -ForegroundColor Cyan
Write-Host "  JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Gray
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Gray
Write-Host ""

# Verify Java is accessible
$javaCheck = & "$env:JAVA_HOME\bin\java.exe" -version 2>&1 | Select-Object -First 1
Write-Host "Java: $javaCheck" -ForegroundColor Gray
Write-Host ""

# Now run pnpm android
Write-Host "Running: pnpm android" -ForegroundColor Yellow
Write-Host ""
pnpm android

