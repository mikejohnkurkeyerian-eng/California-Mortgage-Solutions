# Fix: pnpm Not Found in Railway

## The Problem
Railway's build environment doesn't have `pnpm` installed by default, causing the build to fail.

## The Solution
I've updated all `railway.json` files to install `pnpm` first using `corepack` (comes with Node.js).

## Updated Build Command

The build command now starts with:
```bash
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && ...
```

This:
1. Enables corepack (package manager manager)
2. Installs and activates pnpm 9.0.0
3. Then runs your normal build commands

## What You Need to Do

### Option 1: Update Build Command in Railway (Recommended)

In Railway dashboard, for each service:

1. Go to your service
2. Click **"Settings"** tab
3. Find **"Build Command"**
4. Update it to:
   ```
   corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
   ```
   (Replace `loan-service` with the service name for each service)

5. Click **"Save"** or **"Redeploy"**

### Option 2: Push Updated railway.json Files

I've already updated the `railway.json` files in your code. You need to:

1. **Commit and push the changes:**
   ```powershell
   git add services/*/railway.json
   git commit -m "Fix: Add pnpm installation to Railway build"
   git push
   ```

2. **Redeploy in Railway:**
   - Go to Railway dashboard
   - Click on your service
   - Click **"Redeploy"** or Railway will auto-deploy

## Updated Build Commands for Each Service

### loan-service:
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

### document-service:
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build
```

### workflow-service:
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build
```

### rules-service:
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build
```

## Alternative: Use npm Instead (If corepack doesn't work)

If `corepack` doesn't work, you can install pnpm via npm:

```
npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

## After Fixing

1. **Redeploy** the service in Railway
2. **Check the build logs** - it should now find pnpm
3. **Wait for build to complete** (may take 3-5 minutes)
4. **Verify** the service is running

---

**Try Option 2 first** (push the updated files) - it's cleaner and will work for all future deployments!

