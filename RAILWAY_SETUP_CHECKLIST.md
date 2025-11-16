# Railway Setup Checklist

## ✅ Pre-Deployment Checklist

- [x] Updated `package.json` scripts with `start:prod` and build commands
- [x] Created `railway.json` config files for each service
- [x] Services use `process.env.PORT` (already done ✅)
- [x] Services use environment variables for inter-service communication (already done ✅)

---

## 🚀 Deployment Steps

### 1. Sign Up for Railway
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub (recommended)
- [ ] Verify email if needed

### 2. Deploy loan-service
- [ ] Create new project in Railway
- [ ] Add service from GitHub repo
- [ ] Set **Root Directory**: `services/loan-service`
- [ ] Set **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build`
- [ ] Set **Start Command**: `node dist/main.js`
- [ ] Wait for deployment
- [ ] **Copy the URL** (e.g., `https://loan-service-production.up.railway.app`)
- [ ] Test: `curl https://loan-service-production.up.railway.app/health`

### 3. Deploy document-service
- [ ] Add new service to same project
- [ ] Set **Root Directory**: `services/document-service`
- [ ] Set **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build`
- [ ] Set **Start Command**: `node dist/main.js`
- [ ] **Set Environment Variable**:
  - `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`
  - `WORKFLOW_SERVICE_URL` = `https://workflow-service-production.up.railway.app` (set after deploying workflow-service)
- [ ] Wait for deployment
- [ ] **Copy the URL**
- [ ] Test: `curl https://document-service-production.up.railway.app/health`

### 4. Deploy workflow-service
- [ ] Add new service to same project
- [ ] Set **Root Directory**: `services/workflow-service`
- [ ] Set **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build`
- [ ] Set **Start Command**: `node dist/main.js`
- [ ] **Set Environment Variable**:
  - `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`
- [ ] Wait for deployment
- [ ] **Copy the URL**
- [ ] Test: `curl https://workflow-service-production.up.railway.app/health`
- [ ] **Update document-service** environment variable `WORKFLOW_SERVICE_URL` with this URL

### 5. Deploy rules-service
- [ ] Add new service to same project
- [ ] Set **Root Directory**: `services/rules-service`
- [ ] Set **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build`
- [ ] Set **Start Command**: `node dist/main.js`
- [ ] **Set Environment Variable**:
  - `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`
- [ ] Wait for deployment
- [ ] **Copy the URL**
- [ ] Test: `curl https://rules-service-production.up.railway.app/health`

---

## 🔧 Environment Variables Summary

### loan-service
- No environment variables needed (it's the main service)

### document-service
- `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`
- `WORKFLOW_SERVICE_URL` = `https://workflow-service-production.up.railway.app`

### workflow-service
- `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`

### rules-service
- `LOAN_SERVICE_URL` = `https://loan-service-production.up.railway.app`

---

## 📱 Update App Configuration

After all services are deployed, update `apps/loan-automation-app/src/config/api.ts`:

```typescript
} else {
  // Production mode - Railway URLs
  const serviceUrls: Record<number, string> = {
    4002: 'https://loan-service-production.up.railway.app',
    4003: 'https://document-service-production.up.railway.app',
    4004: 'https://workflow-service-production.up.railway.app',
    4005: 'https://rules-service-production.up.railway.app',
  };
  
  // Railway URLs use HTTPS and don't need port numbers
  // But we still need to map to the right service
  return serviceUrls[port] || serviceUrls[4002];
}
```

**Important**: Railway URLs are HTTPS and don't include port numbers. Your services expose `/api` routes, so the full URL would be:
- `https://loan-service-production.up.railway.app/api/applications`

---

## 🧪 Testing After Deployment

1. **Test each service health endpoint:**
   ```powershell
   curl https://loan-service-production.up.railway.app/health
   curl https://document-service-production.up.railway.app/health
   curl https://workflow-service-production.up.railway.app/health
   curl https://rules-service-production.up.railway.app/health
   ```

2. **Test API endpoints:**
   ```powershell
   # Test loan service
   curl https://loan-service-production.up.railway.app/api/applications
   ```

3. **Update app and test:**
   - Update `api.ts` with Railway URLs
   - Build production APK
   - Test on device

---

## ⚠️ Common Issues

### Build Fails: "Cannot find module @loan-platform/shared-types"
**Solution**: Make sure build command includes:
```bash
cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/[service-name] && pnpm build
```

### Service Can't Connect to Other Services
**Solution**: Set environment variables in Railway dashboard:
- Go to service → "Variables" tab
- Add the required environment variables

### Port Already in Use
**Solution**: Railway automatically sets `PORT` - your code already handles this ✅

---

## 📝 Notes

- Railway provides HTTPS automatically
- URLs don't include port numbers
- Services restart automatically on failure
- Check Railway dashboard for logs if something fails
- Free tier gives $5 credit/month (good for testing)

---

## ✅ Final Checklist

- [ ] All 4 services deployed
- [ ] All environment variables set
- [ ] All health endpoints return `{"status":"ok"}`
- [ ] App config updated with Railway URLs
- [ ] Production APK built and tested
- [ ] App works with production backend

**You're ready to go live!** 🎉

