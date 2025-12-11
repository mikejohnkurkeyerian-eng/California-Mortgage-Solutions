# Broker Console - Step by Step Setup Guide

Follow these steps one by one to get your broker console up and running.

---

## ✅ Step 1: Install Dependencies (COMPLETED)

**Status:** ✅ Already done!

Dependencies are already installed. The broker console uses:
- Next.js 14
- React Query for data fetching
- Tailwind CSS for styling
- Shared types from the monorepo

**If you need to reinstall:**
```bash
pnpm install
```

---

## ✅ Step 2: API Integration (COMPLETED)

**Status:** ✅ Done!

The broker console is now configured to connect to your loan-service API.

**What was done:**
- Created API client library (`src/lib/api.ts`)
- Updated components to use real API endpoints
- Configured API base URL (defaults to `http://localhost:4002`)

**API Endpoints Now Connected:**
- ✅ Get all loans: `GET /api/applications`
- ✅ Get loan by ID: `GET /api/applications/:id`
- ✅ Update loan: `PUT /api/applications/:id`
- ✅ Submit loan: `POST /api/applications/:id/submit`
- ✅ Sign off loan: `POST /api/applications/:id/signoff`

---

## 📋 Step 3: Start Development Server

### 3.1 Start the Loan Service (Backend)

**In Terminal 1:**

```bash
cd services/loan-service
pnpm start
```

**Expected Output:**
```
loan-service listening on port 4002
```

**Verify it's running:**
- Open browser: http://localhost:4002/health
- Should see: `{"status":"ok","service":"loan-service"}`

### 3.2 Start the Broker Console (Frontend)

**In Terminal 2 (new terminal):**

```bash
cd web/broker-console
pnpm dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - ready in X seconds
```

**Open in browser:**
- Visit: http://localhost:3000
- You should see the Broker Console dashboard!

---

## 📋 Step 4: Configure Environment Variables (Optional)

If your loan-service runs on a different port, create a `.env.local` file:

**Create file:** `web/broker-console/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4002
```

Replace `4002` with your actual loan-service port if different.

---

## 📋 Step 5: Test the Integration

### 5.1 Verify Backend is Running

```bash
curl http://localhost:4002/health
```

Should return: `{"status":"ok","service":"loan-service"}`

### 5.2 Verify Frontend is Running

1. Open browser: http://localhost:3000
2. You should see the dashboard page
3. If no loans exist, you'll see "No loans found" (this is expected)

### 5.3 Test with Sample Data (Optional)

You can test by creating a loan via API:

```bash
curl -X POST http://localhost:4002/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "borrowerId": "test-borrower-1",
    "borrower": {
      "id": "test-borrower-1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "property": {
      "address": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94102"
      },
      "propertyType": "SingleFamily",
      "purchasePrice": 500000,
      "downPayment": 100000,
      "loanAmount": 400000
    },
    "employment": {
      "status": "Employed",
      "incomeType": "W2",
      "monthlyIncome": 8000
    },
    "loanType": "Conventional",
    "loanPurpose": "Purchase",
    "loanTerm": 360,
    "assets": [],
    "debts": [],
    "documents": []
  }'
```

Then refresh http://localhost:3000 and you should see the loan appear!

---

## 🚀 Next Steps: Additional Features

Once Steps 1-5 are complete, you can add:

### Step 6: Authentication (Coming Next)
- Add user authentication
- Protected routes
- Login/logout functionality

### Step 7: Task Management
- Broker task assignments
- Approval workflows
- Notification system

### Step 8: Reporting & Analytics
- Loan pipeline reports
- Performance metrics
- Export functionality

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"

**Solution:**
1. Make sure loan-service is running: `pnpm --filter @loan-platform/loan-service start`
2. Check port is correct (default: 4002)
3. Verify CORS is enabled in loan-service (should be by default)

### Issue: "Port 3000 already in use"

**Solution:**
Next.js will automatically use the next available port (3001, 3002, etc.). Check the terminal output for the actual port.

### Issue: "No loans showing"

**Solution:**
This is expected if no loans exist yet. You can:
1. Create loans via the borrower app
2. Create loans via API (see Step 5.3)
3. Seed the database if you have seed scripts

### Issue: TypeScript errors

**Solution:**
1. Make sure shared-types is built: `pnpm --filter @loan-platform/shared-types build`
2. Rebuild: `cd web/broker-console && pnpm build`

---

## ✅ Checklist

- [ ] Step 1: Dependencies installed ✅
- [ ] Step 2: API integration complete ✅
- [ ] Step 3: Loan-service running
- [ ] Step 3: Broker console running
- [ ] Step 4: Environment variables configured (if needed)
- [ ] Step 5: Integration tested
- [ ] Ready for Step 6: Authentication

---

**Ready to continue?** Complete Steps 3-5, then we can move on to adding authentication and other features!

