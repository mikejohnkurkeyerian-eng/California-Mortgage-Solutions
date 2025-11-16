# Final Railway Build Command - Install pnpm Directly

## The Problem
Railway doesn't have Node.js/npm installed in the build environment. We need to install pnpm directly using curl.

## The Solution: Use This Build Command

### For loan-service:

In Railway Settings → Build Command, use:

```
curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

### For document-service:

```
curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build
```

### For workflow-service:

```
curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build
```

### For rules-service:

```
curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build
```

---

## What This Does

1. **Installs pnpm** using the official installer (no npm needed)
2. **Adds pnpm to PATH** so it can be used
3. **Installs dependencies** from the monorepo root
4. **Builds shared-types** first
5. **Builds the service**

---

## Steps to Fix

1. **Go to Railway** → Your Service → Settings
2. **Find "Build Command"** field
3. **Paste the command above** (for the correct service)
4. **Click "Save"**
5. **Redeploy** the service
6. **Wait 3-5 minutes** for build

---

## Alternative: Use nixpacks.toml (If Above Doesn't Work)

I've also created `nixpacks.toml` files. If the curl method doesn't work:

1. **Push the nixpacks.toml files to GitHub:**
   ```powershell
   git add services/*/nixpacks.toml
   git commit -m "Add nixpacks.toml for Railway"
   git push
   ```

2. **In Railway Settings:**
   - **Clear/delete** the Build Command (leave empty)
   - Railway will use `nixpacks.toml` automatically
   - **Save and redeploy**

---

## Try This First

**Use the curl command above** - it's simpler and should work immediately!

**Copy the build command for loan-service and paste it in Railway Settings → Build Command, then redeploy!**

