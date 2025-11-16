# Railway Quick Start - 5 Minute Setup

## Fastest Way to Deploy

### Step 1: Sign Up (1 minute)

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (easiest)

### Step 2: Deploy First Service (2 minutes)

1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Select your repository**
4. **Click "Add Service"** → **"GitHub Repo"** again
5. **Configure:**
   - **Name**: `loan-service`
   - **Root Directory**: `services/loan-service`
   - Railway will auto-detect the rest!

6. **Wait for deployment** (2-3 minutes)
7. **Copy the URL** Railway gives you (e.g., `https://loan-service-production.up.railway.app`)

### Step 3: Deploy Other Services (2 minutes)

Repeat Step 2 for:
- `document-service` (Root: `services/document-service`)
- `workflow-service` (Root: `services/workflow-service`)
- `rules-service` (Root: `services/rules-service`)

### Step 4: Update App Config

Edit `apps/loan-automation-app/src/config/api.ts`:

```typescript
} else {
  // Production - Railway URLs
  const services = {
    4002: 'https://loan-service-production.up.railway.app',
    4003: 'https://document-service-production.up.railway.app',
    4004: 'https://workflow-service-production.up.railway.app',
    4005: 'https://rules-service-production.up.railway.app',
  };
  return services[port] || services[4002];
}
```

**Done!** 🎉

---

## Important Notes

⚠️ **Railway URLs use HTTPS** - no port numbers needed!

⚠️ **Your services use `/api` prefix** - Railway URLs already include this if you set root correctly

⚠️ **Services communicate** - You may need to set environment variables so services can find each other

---

## If Build Fails

Railway might need help with the monorepo. Update build command in Railway:

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

**Start Command:**
```bash
node dist/main.js
```

---

## Test Your Deployment

```powershell
# Test health endpoint
curl https://loan-service-production.up.railway.app/health

# Should return: {"status":"ok","service":"loan-service"}
```

If this works, your service is live! 🚀

