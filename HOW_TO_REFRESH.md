# How to See the New Features

## Quick Steps:

### 1. Make Sure Services Are Running

**Check if servers are running:**

**Terminal 1 - Backend (Loan Service):**
- Should show: `loan-service listening on port 4002`
- If not running, start it:
  ```powershell
  cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\services\loan-service"
  pnpm start
  ```

**Terminal 2 - Frontend (Broker Console):**
- Should show: `▲ Next.js 14.x.x` and `- Local: http://localhost:3000`
- If not running, start it:
  ```powershell
  cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
  pnpm dev
  ```

### 2. Refresh Your Browser

**In your browser:**
- Press `F5` or `Ctrl+R` (Windows) / `Cmd+R` (Mac)
- OR click the refresh button in your browser
- OR do a hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### 3. Navigate to New Features

#### Option A: See Lender Settings Page
1. Go to: **http://localhost:3000/settings**
2. You should see the lender configuration form!

#### Option B: See Review & Approve Tab
1. Go to: **http://localhost:3000/dashboard**
2. Click on any loan card (if you have loans)
3. The "Review & Approve" tab should be visible (it's the first tab now!)
4. You'll see all the automated data with checkmarks ✓

#### Option C: If No Loans Exist Yet
If you don't see any loans, you can create a test loan via API or just refresh the dashboard.

## What You Should See:

### On Settings Page (`/settings`):
- ✅ Lender name, ID, API base URL fields
- ✅ API key and secret fields (with show/hide toggle)
- ✅ AUS provider dropdown (DU, LP, Other)
- ✅ Credit bureau provider dropdown
- ✅ Automation toggles (auto-submit, auto-approve)
- ✅ Edit/Save buttons

### On Loan Detail Page (click any loan):
- ✅ **"Review & Approve" tab** (first tab, selected by default)
- ✅ Clean template showing:
  - Borrower info (marked "Auto-collected")
  - Property info (marked "Auto-collected")
  - Loan details (marked "Auto-calculated")
  - Employment info (marked "Auto-verified")
  - Documents list (marked "Auto-verified")
- ✅ Edit button
- ✅ Submit/Approve buttons (depending on loan stage)

## Troubleshooting:

### If page doesn't load:
1. Check if Next.js server is running (Terminal 2)
2. Check if port 3000 is being used
3. Try accessing: http://localhost:3000

### If you see old version:
1. Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart the Next.js dev server:
   - Stop it (Ctrl+C)
   - Start again: `pnpm dev`

### If settings page shows error:
- The backend lender-config endpoints need the loan-service to be running
- Make sure Terminal 1 (loan-service) is running

## Quick Test:

1. **Open**: http://localhost:3000/settings
   - Should see the lender configuration form ✅

2. **Open**: http://localhost:3000/dashboard
   - Should see the dashboard ✅

3. **Click any loan** (if you have loans)
   - Should see "Review & Approve" tab first ✅
   - Should see all sections with checkmarks ✅

That's it! Just refresh your browser and navigate to the new pages! 🚀

