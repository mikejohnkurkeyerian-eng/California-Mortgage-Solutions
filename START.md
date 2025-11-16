# 🚀 SUPER SIMPLE START GUIDE

## One Command to Start Everything!

### Step 1: Install dependencies (first time only)
```powershell
pnpm install
```

### Step 2: Start all services (ONE command!)
```powershell
pnpm start
```

That's it! All 4 services will start in one terminal with color-coded output.

---

## What You'll See

You'll see output like this:
```
[loan] Loan Service listening on port 4002
[document] Document Service listening on port 4003
[workflow] Workflow Service listening on port 4004
[rules] Rules Service listening on port 4005
```

Each service is color-coded so you can see which is which.

---

## Start the App

Once services are running, open a **NEW terminal** and run:

```powershell
cd apps/loan-automation-app
pnpm windows
```

---

## Alternative: Separate Windows (if you prefer)

If you want each service in its own window:

```powershell
pnpm start:windows
```

This opens 4 separate PowerShell windows.

---

## Troubleshooting

### "concurrently not found"
Run: `pnpm install`

### "Port already in use"
- Close any other instances
- Or restart your computer

### Services won't start
- Make sure you ran `pnpm install` first
- Check Node.js version: `node --version` (should be 18+)

---

## That's It!

Just run `pnpm start` and you're good to go! 🎉

