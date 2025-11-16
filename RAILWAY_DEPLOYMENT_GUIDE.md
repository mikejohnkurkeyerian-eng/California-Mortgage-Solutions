# Railway Deployment Guide - Step by Step

## Overview

This guide will help you deploy your backend services to Railway. You'll deploy 4 services:
1. **loan-service** (port 4002)
2. **document-service** (port 4003)
3. **workflow-service** (port 4004)
4. **rules-service** (port 4005)

---

## Step 1: Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (recommended) or email
4. Verify your email if needed

---

## Step 2: Prepare Your Repository

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if not already):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### Option B: Deploy from Local Directory

Railway CLI can deploy from local directory (we'll cover this too).

---

## Step 3: Deploy Each Service

You'll need to deploy each service separately. Let's start with **loan-service**:

### Deploy loan-service

1. **In Railway Dashboard:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"** (or "Empty Project" for local)
   - Select your repository

2. **Add Service:**
   - Click **"+ New"** → **"GitHub Repo"**
   - Select your repository
   - Railway will detect it's a monorepo

3. **Configure Service:**
   - **Root Directory**: Set to `services/loan-service`
   - **Build Command**: `cd ../.. && pnpm install && cd services/loan-service && pnpm build`
   - **Start Command**: `node dist/main.js`
   - Railway will automatically set `PORT` environment variable

4. **Set Environment Variables** (if needed):
   - Click on the service → **"Variables"** tab
   - Add any required environment variables
   - For now, you might not need any (services use defaults)

5. **Deploy:**
   - Railway will automatically start building
   - Wait for build to complete (2-5 minutes)
   - Check logs for any errors

6. **Get Your URL:**
   - Once deployed, Railway gives you a URL like:
     ```
     https://loan-service-production.up.railway.app
     ```
   - **Save this URL!** You'll need it for the app config

### Repeat for Other Services

Deploy the other 3 services the same way:
- **document-service** (Root: `services/document-service`)
- **workflow-service** (Root: `services/workflow-service`)
- **rules-service** (Root: `services/rules-service`)

---

## Step 4: Update App Configuration

Once all services are deployed, you'll have 4 URLs:

```
https://loan-service-production.up.railway.app
https://document-service-production.up.railway.app
https://workflow-service-production.up.railway.app
https://rules-service-production.up.railway.app
```

### Update `apps/loan-automation-app/src/config/api.ts`:

```typescript
} else {
  // Production mode - Railway URLs
  const serviceUrls = {
    loan: 'https://loan-service-production.up.railway.app',
    document: 'https://document-service-production.up.railway.app',
    workflow: 'https://workflow-service-production.up.railway.app',
    rules: 'https://rules-service-production.up.railway.app',
  };
  
  // Map ports to services
  if (port === 4002) return serviceUrls.loan;
  if (port === 4003) return serviceUrls.document;
  if (port === 4001) return serviceUrls.workflow; // or your auth service
  return serviceUrls.loan; // default
}
```

**Or simpler approach** - use a single backend URL with routing:

```typescript
} else {
  // Production mode - use your Railway backend URL
  // Replace with your actual loan-service URL (main backend)
  return `https://loan-service-production.up.railway.app/api`;
}
```

---

## Step 5: Handle Service Communication

Your services call each other. Update the service URLs:

### In document-service (when calling loan-service):

Railway provides environment variables. You can:
1. Set **Railway Service Variables** to share URLs between services
2. Or hardcode the URLs in the service code

**Example**: In `document-service/src/routes.ts`, update:
```typescript
const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || "http://localhost:4002";
```

Then in Railway, set `LOAN_SERVICE_URL=https://loan-service-production.up.railway.app`

---

## Step 6: Test Your Deployment

1. **Check Health Endpoints:**
   ```
   https://loan-service-production.up.railway.app/health
   https://document-service-production.up.railway.app/health
   ```

2. **Test API Calls:**
   ```powershell
   # Test loan service
   curl https://loan-service-production.up.railway.app/api/applications
   ```

3. **Update App and Test:**
   - Update `api.ts` with Railway URLs
   - Build production APK
   - Test on device

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module @loan-platform/shared-types"**
- Make sure build command includes `pnpm install` at root
- Railway needs to install all workspace dependencies

**Solution**: Update build command to:
```bash
cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

### Service Won't Start

**Error: "Port already in use"**
- Railway sets `PORT` automatically
- Your code should use `process.env.PORT` ✅ (you already do this)

**Error: "Cannot find dist/main.js"**
- Build might have failed
- Check Railway build logs
- Ensure TypeScript compiles successfully

### Services Can't Communicate

**Error: "Connection refused"**
- Services need to know each other's URLs
- Set environment variables in Railway:
  - `LOAN_SERVICE_URL=https://loan-service-production.up.railway.app`
  - `DOCUMENT_SERVICE_URL=https://document-service-production.up.railway.app`
  - etc.

---

## Railway CLI (Alternative Method)

If you prefer command line:

1. **Install Railway CLI:**
   ```powershell
   npm i -g @railway/cli
   ```

2. **Login:**
   ```powershell
   railway login
   ```

3. **Initialize:**
   ```powershell
   cd services/loan-service
   railway init
   ```

4. **Deploy:**
   ```powershell
   railway up
   ```

---

## Cost Estimate

**Railway Pricing:**
- **Free Tier**: $5 credit/month (good for testing)
- **Hobby Plan**: $5/month per service
- **Pro Plan**: $20/month (better for production)

**For 4 services:**
- Free tier: ~$5/month total (if within limits)
- Hobby: ~$20/month total
- Pro: ~$20/month (all services included)

---

## Next Steps After Deployment

1. ✅ **Get all 4 service URLs**
2. ✅ **Update `api.ts` with production URLs**
3. ✅ **Test services are accessible**
4. ✅ **Build production APK**
5. ✅ **Test app with production backend**

---

## Quick Reference

**Railway Dashboard**: https://railway.app/dashboard

**Service URLs Format**: `https://[service-name]-[random].up.railway.app`

**Health Check**: `https://[service-url]/health`

**Build Logs**: Click on service → "Deployments" → View logs

**Environment Variables**: Click on service → "Variables" tab

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check build logs in Railway dashboard for errors

Let me know when you've deployed and I'll help you update the app config! 🚀

