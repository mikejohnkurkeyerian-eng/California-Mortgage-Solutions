# Debug: Cannot find /app/dist/main.js

## The Problem

Railway is looking for `/app/dist/main.js` but can't find it. This means either:
1. **Build didn't create dist/main.js** (build failed)
2. **Root Directory is wrong** (Railway is looking in `/app` = repo root, not `services/loan-service`)

## Check These Things

### 1. Check Railway Build Logs

1. **Go to Railway** → loan-service → **Deployments** tab
2. **Click on the latest deployment**
3. **Check the build logs** - look for:
   - Did `pnpm build` complete?
   - Any TypeScript errors?
   - Does it say "Build completed"?
   - Is there a `dist/` folder created?

### 2. Check Root Directory

1. **Go to Railway** → loan-service → **Settings**
2. **Check "Root Directory"** - it should be: `services/loan-service`
3. **If it's empty or wrong**, set it to: `services/loan-service`

### 3. Check Start Command

1. **In Settings**, check "Start Command"
2. **It should be**: `node dist/main.js`
3. **If Root Directory is `services/loan-service`**, this should work

---

## If Build Failed

If the build logs show errors, we need to fix the build. Common issues:
- TypeScript compilation errors
- Missing dependencies
- Path resolution errors

---

## If Root Directory is Wrong

If Root Directory is empty or set to repo root:
1. **Set it to**: `services/loan-service`
2. **Start Command should be**: `node dist/main.js`
3. **Redeploy**

---

**First, check the Railway build logs to see if the build actually completed and created dist/main.js!**

