# Fix PowerShell Execution Policy

## Quick Fix (Recommended)

Run this command in PowerShell **as Administrator**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try running `pnpm windows` again.

## Alternative: Bypass for This Session Only

If you don't want to change the policy permanently, you can bypass it for just this command:

```powershell
powershell -ExecutionPolicy Bypass -Command "cd apps/loan-automation-app; pnpm windows"
```

## Or Use npx Instead

You can also use npx which doesn't require the execution policy:

```powershell
cd apps/loan-automation-app
npx pnpm windows
```

## What's Happening?

Windows PowerShell has a security feature that prevents scripts from running by default. The `Set-ExecutionPolicy` command allows you to run scripts while still maintaining security.

**RemoteSigned** means:
- Scripts you write locally can run
- Scripts downloaded from the internet must be signed
- This is a safe, recommended setting

