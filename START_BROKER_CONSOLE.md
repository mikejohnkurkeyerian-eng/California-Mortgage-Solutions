# Start Broker Console - Step by Step

## You are currently in: `C:\Users\Mike`

## Step 1: Navigate to Project Root

**Copy and paste this command into PowerShell:**

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
```

**Verify you're in the right place:**
```powershell
Get-Location
```

You should see: `C:\Users\Mike\Desktop\AI PROCCESS TEST`

## Step 2: Start Loan Service (Backend)

**From the project root, run:**

```powershell
cd services\loan-service
pnpm start
```

**Keep this terminal window open!** It will show:
```
loan-service listening on port 4002
```

## Step 3: Start Broker Console (Frontend)

**Open a NEW PowerShell window** and run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

**You should see:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the Broker Console dashboard!

## Verify Backend is Running

In browser, visit: **http://localhost:4002/health**

Should see: `{"status":"ok","service":"loan-service"}`

## All Commands in Order:

### Terminal 1 (Backend):
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
cd services\loan-service
pnpm start
```

### Terminal 2 (Frontend - NEW WINDOW):
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

## Troubleshooting

### "Cannot find path"
- Make sure you copy the FULL path: `"C:\Users\Mike\Desktop\AI PROCCESS TEST"`
- The quotes are important!

### "Missing script"
- You're not in the right directory
- Run `Get-Location` to check where you are
- Navigate to the correct directory first

