# Broker Console - Quick Start Guide

## ✅ Setup Complete!

Dependencies have been installed and services are starting.

## What's Running:

1. **Loan Service (Backend)** - Port 4002
   - Health Check: http://localhost:4002/health

2. **Broker Console (Frontend)** - Port 3000
   - Dashboard: http://localhost:3000

## Access the Application:

Open your browser and navigate to:
**http://localhost:3000**

You should see the Broker Console dashboard!

## If Services Didn't Start:

### Start Loan Service (Backend):
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\services\loan-service"
pnpm start
```

### Start Broker Console (Frontend):
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

## Verify Everything Works:

1. **Check Backend:**
   - Open: http://localhost:4002/health
   - Should see: `{"status":"ok","service":"loan-service"}`

2. **Check Frontend:**
   - Open: http://localhost:3000
   - Should see: Broker Console Dashboard
   - If no loans exist, you'll see "No loans found" (this is normal!)

## Next Steps:

Once you can access the dashboard:
1. Create test data (via API or borrower app)
2. Test the pipeline dashboard
3. View loan details
4. Add authentication (next feature)

## Troubleshooting:

### "Port already in use"
- Backend (4002): Check what's using it with `Get-NetTCPConnection -LocalPort 4002`
- Frontend (3000): Next.js will auto-use the next available port (3001, 3002, etc.)

### "Cannot connect to API"
- Make sure loan-service is running on port 4002
- Check CORS settings (should be enabled by default)

### "No loans showing"
- This is expected if no loans exist yet!
- Create loans via the borrower app or API calls

