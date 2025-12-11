# Starting Development - PowerShell Commands

## Step 1: Navigate to Project Root

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
```

## Step 2: Start Loan Service (Backend)

Open **Terminal 1** (PowerShell) and run:

```powershell
cd services\loan-service
pnpm start
```

**Expected Output:**
```
loan-service listening on port 4002
```

**Verify it's working:**
- Open browser: http://localhost:4002/health
- Should see: `{"status":"ok","service":"loan-service"}`

## Step 3: Start Broker Console (Frontend)

Open **Terminal 2** (NEW PowerShell window) and run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
cd web\broker-console
pnpm dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

**Open in browser:**
- Visit: http://localhost:3000
- You should see the Broker Console dashboard!

## Quick Start Script (All in One)

Or use this single command from project root:

```powershell
# Terminal 1 - Start backend
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\services\loan-service"; pnpm start

# Terminal 2 - Start frontend (in a NEW terminal)
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"; pnpm dev
```

## Troubleshooting

### If port 4002 is already in use:
1. Find what's using it: `Get-NetTCPConnection -LocalPort 4002`
2. Stop that process or change the port in `services/loan-service/src/main.ts`

### If port 3000 is already in use:
Next.js will automatically use the next available port (3001, 3002, etc.)

### If you get "Missing script" error:
Make sure you're in the correct directory:
- Backend: `services\loan-service`
- Frontend: `web\broker-console`

