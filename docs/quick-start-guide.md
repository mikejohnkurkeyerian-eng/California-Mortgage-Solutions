# Quick Start Guide - Testing the App

## Step 1: Install Dependencies

First time only - from the root directory:

```powershell
pnpm install
```

This installs dependencies for all services and the app.

## Step 2: Start Backend Services

You need to start 4 services. Open **4 separate terminal windows** (or PowerShell tabs):

### Terminal 1: Loan Service
```powershell
cd services/loan-service
pnpm start
```
Wait for: `loan-service listening on port 4002`

### Terminal 2: Document Service
```powershell
cd services/document-service
pnpm start
```
Wait for: `document-service listening on port 4003`

### Terminal 3: Workflow Service
```powershell
cd services/workflow-service
pnpm start
```
Wait for: `workflow-service listening on port 4004`

### Terminal 4: Rules Service
```powershell
cd services/rules-service
pnpm start
```
Wait for: `rules-service listening on port 4005`

## Step 3: Verify Services Are Running

In a new terminal, test each service:

```powershell
# Test Loan Service
curl http://localhost:4002/health

# Test Document Service
curl http://localhost:4003/health

# Test Workflow Service
curl http://localhost:4004/health

# Test Rules Service
curl http://localhost:4005/health
```

Each should return: `{"status":"ok","service":"..."}`

## Step 4: Start React Native App

**Important:** Use **Developer Command Prompt for VS 2022** (not regular PowerShell) for this step!

### Option A: Windows Desktop App
```powershell
cd apps/loan-automation-app
pnpm install  # First time only
pnpm windows
```

### Option B: If Windows doesn't work, use Metro (for testing)
```powershell
cd apps/loan-automation-app
pnpm start
```

This starts the Metro bundler. Then in another terminal:
```powershell
# For Windows
pnpm windows

# Or for web (if React Native Web is set up)
# This would require additional setup
```

## Troubleshooting

### "pnpm not found"
```powershell
npm install -g pnpm
```

### "Module not found" errors
```powershell
# From root directory
pnpm install
```

### "Port already in use"
- Check if services are already running
- Kill the process using the port
- Or change the port in the service's code

### "cl.exe not found" (for React Native Windows)
- Make sure you're using **Developer Command Prompt for VS 2022**
- Or set up environment variables manually

### Services won't start
- Check Node.js version: `node --version` (should be 18+)
- Make sure dependencies are installed: `pnpm install`
- Check for TypeScript errors: `pnpm --filter @loan-platform/loan-service build`

## Quick Test Flow

Once everything is running:

1. **Open the app** - Should see home screen
2. **Click "Borrower Portal"**
3. **Fill out loan application** (Application tab)
4. **Upload documents** (Upload tab)
5. **Check document checklist** (Checklist tab)
6. **Switch to "Broker Console"**
7. **View loans in dashboard**
8. **Click on a loan to see details**
9. **Sign off if loan is ClearToClose**

## All Services Running?

You should have:
- ✅ Loan Service on port 4002
- ✅ Document Service on port 4003
- ✅ Workflow Service on port 4004
- ✅ Rules Service on port 4005
- ✅ React Native app running

## Need Help?

If something doesn't work:
1. Check service logs for errors
2. Verify all services are running
3. Check network connectivity (services talk to each other)
4. Make sure ports aren't blocked by firewall

