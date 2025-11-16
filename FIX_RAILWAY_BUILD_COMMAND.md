# Fix Railway Build Command - Update in Dashboard

## The Problem
Railway is still using the old build command without `pnpm` installation. You need to update it directly in Railway's settings.

## Solution: Update Build Command in Railway Dashboard

### Step-by-Step:

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard
   - Click on your project
   - Click on `loan-service`

2. **Go to Settings Tab**
   - Click **"Settings"** tab at the top
   - Scroll down to find **"Build"** section

3. **Update Build Command**
   - Find the **"Build Command"** field
   - **Delete** the current command
   - **Paste** this new command:
     ```
     corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
     ```

4. **Save**
   - Click **"Save"** or the save button
   - Railway should automatically start a new deployment

5. **Wait for Build**
   - Go to **"Deployments"** tab
   - Watch the build progress
   - Should take 3-5 minutes

---

## Alternative: If corepack doesn't work, use npm to install pnpm

If you still get errors, try this build command instead:

```
npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

---

## After Updating

1. **Check the build logs** - you should see `pnpm` being installed
2. **Wait for completion** - build takes 3-5 minutes
3. **Verify success** - green checkmark means it worked!

---

## For All Other Services

You'll need to do the same for:
- `document-service`
- `workflow-service`
- `rules-service`

Use the same pattern, just change the service name in the last part:

**document-service:**
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build
```

**workflow-service:**
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build
```

**rules-service:**
```
corepack enable && corepack prepare pnpm@9.0.0 --activate && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build
```

---

**Update the build command in Railway Settings and redeploy!**

