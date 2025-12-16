# Debug Railway Service Crash

## Step 1: Check Railway Logs

1. **Go to Railway** → Your `loan-service`
2. **Click "Deployments"** tab
3. **Click on the latest deployment**
4. **Click "View Logs"** or check the logs section
5. **Look for error messages** - they'll tell you what's wrong

---

## Common Issues and Fixes

### Issue 1: "Cannot find module" or "Module not found"

**Fix**: Dependencies might not be installed correctly.

**Solution**: Check that `nixpacks.toml` is installing dependencies properly. The build should show `pnpm install` running.

### Issue 2: "Port already in use" or "EADDRINUSE"

**Fix**: Railway sets PORT automatically, but your code might not be using it.

**Check**: Your `main.ts` should use:
```typescript
const port = process.env.PORT ?? 4002;
```

### Issue 3: "Cannot find dist/main.js"

**Fix**: Build might have failed or TypeScript didn't compile.

**Solution**: 
- Check build logs - did TypeScript compile?
- Make sure `pnpm build` completed successfully
- Check that `dist/` folder was created

### Issue 4: "Error: listen EADDRINUSE :::PORT"

**Fix**: Service is trying to use a hardcoded port.

**Solution**: Make sure you're using `process.env.PORT` in your code.

### Issue 5: Missing environment variables

**Fix**: Service might need environment variables.

**Solution**: Check if your service needs any env vars set in Railway.

---

## Quick Debug Steps

1. **Check Build Logs**:
   - Did the build complete?
   - Did `pnpm install` run?
   - Did `pnpm build` complete?
   - Any TypeScript errors?

2. **Check Runtime Logs**:
   - What error message appears?
   - Does it start and then crash?
   - Or does it fail to start?

3. **Check Start Command**:
   - Is it set to: `node dist/main.js`?
   - Does `dist/main.js` exist after build?

---

## Share the Error

**Copy the error message from Railway logs** and I'll help you fix it!

Common things to check:
- What does the build log say?
- What does the runtime log say?
- What's the exact error message?

---

**Check the Railway logs and share the error message with me!**

