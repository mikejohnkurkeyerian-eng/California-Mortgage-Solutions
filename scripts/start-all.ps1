# PowerShell script to start all services
# Run this from the root directory

Write-Host "Starting Loan Automation Platform Services..." -ForegroundColor Green
Write-Host ""

# Check if pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: pnpm is not installed. Please install it with: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Start services in separate windows
Write-Host "Starting services in separate windows..." -ForegroundColor Yellow
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/loan-service; Write-Host 'Loan Service (port 4002)' -ForegroundColor Cyan; pnpm start"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/document-service; Write-Host 'Document Service (port 4003)' -ForegroundColor Cyan; pnpm start"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/workflow-service; Write-Host 'Workflow Service (port 4004)' -ForegroundColor Cyan; pnpm start"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/rules-service; Write-Host 'Rules Service (port 4005)' -ForegroundColor Cyan; pnpm start"
Start-Sleep -Seconds 2

Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Health checks:" -ForegroundColor Yellow
Write-Host "  Loan Service: http://localhost:4002/health"
Write-Host "  Document Service: http://localhost:4003/health"
Write-Host "  Workflow Service: http://localhost:4004/health"
Write-Host "  Rules Service: http://localhost:4005/health"
Write-Host ""
Write-Host "To start the React Native app:" -ForegroundColor Yellow
Write-Host "  cd apps/loan-automation-app" -ForegroundColor Cyan
Write-Host "  pnpm windows" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close the service windows to stop them." -ForegroundColor Yellow

