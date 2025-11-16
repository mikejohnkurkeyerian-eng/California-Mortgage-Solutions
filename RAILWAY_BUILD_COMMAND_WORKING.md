# Working Railway Build Command - Fixed Shell Issue

## The Problem
pnpm installer needs the SHELL environment variable set.

## The Solution: Set SHELL First

### For loan-service:

In Railway Settings → Build Command, use:

```
export SHELL=/bin/bash && curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/loan-service && pnpm build
```

### For document-service:

```
export SHELL=/bin/bash && curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/document-service && pnpm build
```

### For workflow-service:

```
export SHELL=/bin/bash && curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/workflow-service && pnpm build
```

### For rules-service:

```
export SHELL=/bin/bash && curl -fsSL https://get.pnpm.io/install.sh | sh - && export PATH="$HOME/.local/share/pnpm:$PATH" && cd ../.. && pnpm install && pnpm --filter @loan-platform/shared-types build && cd services/rules-service && pnpm build
```

---

## Steps to Fix

1. **Go to Railway** → loan-service → Settings
2. **Find "Build Command"** field
3. **Replace** with the command above (for loan-service)
4. **Click "Save"**
5. **Redeploy** the service
6. **Wait 3-5 minutes** for build

---

## What Changed

Added `export SHELL=/bin/bash &&` at the beginning to tell pnpm installer what shell to use.

---

**Copy the build command above and paste it in Railway Settings → Build Command, then redeploy!**

