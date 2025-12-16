# Diagnose Railway Issue - Step by Step

## The Error

Railway is looking for `/app/dist/main.js` but can't find it.

`/app` means Railway is running from the **repo root**, not from `services/loan-service/`.

## What to Check

### 1. Check Railway Build Logs

**Go to Railway → loan-service → Deployments → Latest deployment → View Logs**

Look for:
- ✅ Does it say "Build completed successfully"?
- ✅ Do you see `pnpm build` running?
- ✅ Any TypeScript errors?
- ✅ Does it show `dist/` folder being created?

**If build failed, that's the problem - fix the build errors first.**

### 2. Check Root Directory Setting

**Go to Railway → loan-service → Settings**

**Check "Root Directory" field:**
- ✅ Should be: `services/loan-service`
- ❌ If it's empty or `/` or wrong → **Set it to `services/loan-service`**

### 3. Check Start Command

**In Settings, check "Start Command":**
- Should be: `node dist/main.js`
- If Root Directory is `services/loan-service`, this will look for `services/loan-service/dist/main.js`

---

## Most Likely Issues

### Issue 1: Root Directory is Wrong
- **Fix**: Set Root Directory to `services/loan-service`

### Issue 2: Build Failed
- **Fix**: Check build logs for errors and fix them

### Issue 3: Build Succeeded But dist/ Not Created
- **Fix**: Check if TypeScript compiled - might need to fix TypeScript errors

---

## Quick Test

After checking the above, try this in Railway Start Command:
```
ls -la && node dist/main.js
```

This will show what files exist and then try to run.

---

**Please check the Railway build logs and tell me:**
1. **Did the build complete successfully?**
2. **What does Root Directory say in Railway Settings?**
3. **Any errors in the build logs?**

