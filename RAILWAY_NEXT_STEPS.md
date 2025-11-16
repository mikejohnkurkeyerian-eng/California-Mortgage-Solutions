# Railway Next Steps - After Selecting Repo

## ✅ You've Selected Your Repo - Now Deploy Services!

You need to deploy **4 services** separately. Let's start with the first one.

---

## Step 1: Deploy loan-service (First Service)

### In Railway Dashboard:

1. **You should see your project** - click on it
2. **Click "+ New"** button (top right)
3. **Select "GitHub Repo"** (or "Service" if that's an option)
4. **Select your repository** again if prompted

### Configure the Service:

1. **Name the service**: `loan-service` (or leave default)
2. **Set Root Directory**: 
   - Click on the service
   - Go to **"Settings"** tab
   - Find **"Root Directory"** or **"Source"**
   - Set it to: `services/loan-service`
3. **Set Build Command**:
   - In **"Settings"** → **"Build"** section
   - Set to: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build`
4. **Set Start Command**:
   - In **"Settings"** → **"Deploy"** section
   - Set to: `node dist/main.js`

### Deploy:

1. Railway should **automatically start building**
2. **Wait 2-5 minutes** for build to complete
3. Check the **"Deployments"** tab to see progress
4. Once deployed, you'll see a **URL** like: `https://loan-service-production.up.railway.app`
5. **COPY THIS URL** - you'll need it!

### Test:

Click the URL or run:
```powershell
curl https://loan-service-production.up.railway.app/health
```
Should return: `{"status":"ok","service":"loan-service"}`

---

## Step 2: Deploy document-service

### Repeat the process:

1. **Click "+ New"** → **"GitHub Repo"** → Select your repo
2. **Name**: `document-service`
3. **Root Directory**: `services/document-service`
4. **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build`
5. **Start Command**: `node dist/main.js`
6. **Wait for deployment**
7. **Copy the URL**

### Set Environment Variables:

1. Click on `document-service`
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   - **Name**: `LOAN_SERVICE_URL`
   - **Value**: `https://loan-service-production.up.railway.app` (use your actual loan-service URL)
5. Click **"Add"**

**Note**: You'll add `WORKFLOW_SERVICE_URL` after deploying workflow-service.

---

## Step 3: Deploy workflow-service

1. **"+ New"** → **"GitHub Repo"** → Select your repo
2. **Name**: `workflow-service`
3. **Root Directory**: `services/workflow-service`
4. **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build`
5. **Start Command**: `node dist/main.js`
6. **Wait for deployment**
7. **Copy the URL**

### Set Environment Variables:

1. Go to **"Variables"** tab
2. Add:
   - **Name**: `LOAN_SERVICE_URL`
   - **Value**: `https://loan-service-production.up.railway.app` (your loan-service URL)

### Update document-service:

1. Go back to `document-service`
2. **"Variables"** tab
3. Add:
   - **Name**: `WORKFLOW_SERVICE_URL`
   - **Value**: `https://workflow-service-production.up.railway.app` (your workflow-service URL)

---

## Step 4: Deploy rules-service

1. **"+ New"** → **"GitHub Repo"** → Select your repo
2. **Name**: `rules-service`
3. **Root Directory**: `services/rules-service`
4. **Build Command**: `cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build`
5. **Start Command**: `node dist/main.js`
6. **Wait for deployment**
7. **Copy the URL**

### Set Environment Variables:

1. Go to **"Variables"** tab
2. Add:
   - **Name**: `LOAN_SERVICE_URL`
   - **Value**: `https://loan-service-production.up.railway.app` (your loan-service URL)

---

## Step 5: Collect All URLs

You should now have **4 URLs**:

1. `https://loan-service-production.up.railway.app`
2. `https://document-service-production.up.railway.app`
3. `https://workflow-service-production.up.railway.app`
4. `https://rules-service-production.up.railway.app`

**Save these URLs!** You'll need them to update your app.

---

## Step 6: Test All Services

Test each service:

```powershell
# Test loan-service
curl https://loan-service-production.up.railway.app/health

# Test document-service
curl https://document-service-production.up.railway.app/health

# Test workflow-service
curl https://workflow-service-production.up.railway.app/health

# Test rules-service
curl https://rules-service-production.up.railway.app/health
```

All should return: `{"status":"ok","service":"..."}`

---

## Step 7: Update Your App

Once all services are deployed, I'll help you update `apps/loan-automation-app/src/config/api.ts` with these URLs!

---

## ⚠️ Troubleshooting

### Build Fails: "Cannot find module"
- Make sure build command includes `pnpm install` at root
- Check that Root Directory is set correctly

### Service Won't Start
- Check the **"Deployments"** tab → **"View Logs"**
- Make sure Start Command is: `node dist/main.js`
- Verify the build completed successfully

### Services Can't Communicate
- Make sure environment variables are set correctly
- Check that URLs don't have trailing slashes
- Verify services are deployed and running

---

## Quick Reference

**Root Directory Format**: `services/[service-name]`

**Build Command Format**: 
```
cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/[service-name] && pnpm build
```

**Start Command**: `node dist/main.js`

**Environment Variables Needed**:
- `document-service`: `LOAN_SERVICE_URL`, `WORKFLOW_SERVICE_URL`
- `workflow-service`: `LOAN_SERVICE_URL`
- `rules-service`: `LOAN_SERVICE_URL`

---

**Let me know when you've deployed all 4 services and I'll help you update the app config!** 🚀

