# Broker Console Setup Guide

## Step 1: Install Dependencies ✅

Dependencies are already installed. If you need to reinstall:

```bash
# From repository root
pnpm install
```

## Step 2: API Integration ✅

The broker console is now configured to connect to the loan-service API. 

**API Endpoints Configured:**
- `GET /api/applications` - List all loans (with pagination and filters)
- `GET /api/applications/:id` - Get loan details
- `PUT /api/applications/:id` - Update loan
- `POST /api/applications/:id/submit` - Submit loan to underwriting
- `POST /api/applications/:id/signoff` - Sign off and close loan
- `GET /api/applications/ready-for-signoff` - Get loans ready for signoff

**API Configuration:**
- Default API URL: `http://localhost:4002` (loan-service port)
- Configure via environment variable: `NEXT_PUBLIC_API_BASE_URL`

## Step 3: Start Development Server

### Prerequisites

Make sure the loan-service is running:

```bash
# From repository root
cd services/loan-service
pnpm start
```

The loan-service should be running on port 4002 (or your configured port).

### Start Broker Console

Open a new terminal and run:

```bash
# From repository root
cd web/broker-console
pnpm dev
```

The broker console will start on **http://localhost:3000**

### Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You'll be automatically redirected to `/dashboard`
3. The dashboard will fetch loans from the loan-service API

## Step 4: Configure Environment Variables (Optional)

Create a `.env.local` file in `web/broker-console/` if you need to override the API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4002
```

## Step 5: Testing the Integration

1. **Check if loan-service is running:**
   - Visit: http://localhost:4002/health
   - Should return: `{"status":"ok","service":"loan-service"}`

2. **Check if broker console is running:**
   - Visit: http://localhost:3000
   - Should show the dashboard

3. **Test API Connection:**
   - If you have loans in the loan-service, they should appear on the dashboard
   - If no loans exist, you'll see "No loans found"

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

### API Connection Errors

1. Verify loan-service is running: `curl http://localhost:4002/health`
2. Check CORS settings in loan-service (should be enabled by default)
3. Verify `NEXT_PUBLIC_API_BASE_URL` matches your loan-service port

### No Loans Showing

This is expected if no loans have been created yet. Loans can be created through:
- The borrower portal/app
- Direct API calls to loan-service
- Database seeding (if implemented)

## Next Steps

- **Step 4: Authentication** - Add user authentication and protected routes
- **Step 5: Additional Features** - Add task management, approvals, reporting, etc.

