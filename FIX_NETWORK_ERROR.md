# Fix Network Error

## Issue Found:
The `next.config.js` file had the wrong API base URL (port 3001 instead of 4002).

## ✅ Fixed:
Updated `next.config.js` to use the correct port: `http://localhost:4002`

## Steps to Fix:

### 1. Restart Next.js Dev Server
**The config change requires a restart!**

In the terminal running the broker console:
1. Press `Ctrl+C` to stop the server
2. Start it again:
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
   pnpm dev
   ```

### 2. Verify Backend is Running
Check if loan-service is running on port 4002:
```powershell
Invoke-WebRequest -Uri "http://localhost:4002/health" -UseBasicParsing
```

Should return: `{"status":"ok","service":"loan-service"}`

### 3. Refresh Browser
1. Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
2. Or just refresh: `F5`

### 4. Test Again
Go to: http://localhost:3000/dashboard
- You should now see the test loan!

## If Still Having Issues:

### Check Backend is Running
```powershell
# Start loan-service if not running
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\services\loan-service"
pnpm start
```

### Check Port Conflicts
```powershell
Get-NetTCPConnection -LocalPort 4002
```

### Check CORS
The loan-service has CORS enabled by default, but if you're still getting CORS errors:
- Make sure the request is going to `http://localhost:4002`
- Check browser console for specific error messages

### Check Environment Variables
Create a `.env.local` file in `web/broker-console/` if needed:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4002
```

## Quick Fix Command:

If you just need to restart the broker console:
```powershell
# Stop current server (Ctrl+C in the terminal running pnpm dev)
# Then run:
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

Then refresh your browser! 🚀

