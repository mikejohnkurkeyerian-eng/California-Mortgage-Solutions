# Get your computer's local IP address for React Native development
# This IP will be used to connect your phone to your backend services

Write-Host "Finding your local IP address..." -ForegroundColor Cyan
Write-Host ""

# Get all network adapters with IPv4 addresses
$adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.PrefixOrigin -eq "Dhcp"
} | Select-Object IPAddress, InterfaceAlias

if ($adapters.Count -eq 0) {
    Write-Host "No active network adapters found." -ForegroundColor Red
    Write-Host "Make sure you're connected to WiFi." -ForegroundColor Yellow
    exit
}

Write-Host "Your local IP addresses:" -ForegroundColor Green
Write-Host ""

foreach ($adapter in $adapters) {
    Write-Host "  $($adapter.IPAddress) - $($adapter.InterfaceAlias)" -ForegroundColor White
}

Write-Host ""
Write-Host "Most likely IP (WiFi):" -ForegroundColor Yellow
$wifiAdapter = $adapters | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*" } | Select-Object -First 1
if ($wifiAdapter) {
    Write-Host "  $($wifiAdapter.IPAddress)" -ForegroundColor Green -BackgroundColor Black
    Write-Host ""
    Write-Host "To use this IP, edit apps/loan-automation-app/src/config/api.ts" -ForegroundColor Cyan
    Write-Host "Change '10.0.2.2' to '$($wifiAdapter.IPAddress)'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or set environment variable:" -ForegroundColor Cyan
    Write-Host "  `$env:REACT_NATIVE_API_HOST='$($wifiAdapter.IPAddress)'" -ForegroundColor White
} else {
    Write-Host "  Use the first IP address listed above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Make sure:" -ForegroundColor Yellow
Write-Host "  ✓ Your phone is on the same WiFi network" -ForegroundColor White
Write-Host "  ✓ Windows Firewall allows connections on ports 4002-4006" -ForegroundColor White
Write-Host ""

