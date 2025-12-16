# Fix Railway Root Directory Issue

## The Problem

When you set Root Directory to `services/loan-service`, Railway:
1. Clones the repo
2. Changes directory to `services/loan-service`
3. Runs build/start commands from there

But the `nixpacks.toml` start command is:
```
cmd = "node services/loan-service/dist/main.js"
```

This path is wrong if Railway is already in `services/loan-service`!

## Solution: Leave Root Directory EMPTY

**Don't set Root Directory at all!** Let Railway use the repo root.

Then the `nixpacks.toml` will work correctly because:
- Build commands start from repo root
- Start command uses full path `services/loan-service/dist/main.js`

---

## Steps to Fix

1. **Go to Railway** → loan-service → **Settings**
2. **Find "Root Directory"** field
3. **Clear it** (make it empty/blank)
4. **Click "Save"**
5. **Click "Redeploy"**

---

## Alternative: Fix nixpacks.toml for Root Directory

If you MUST use Root Directory, update `nixpacks.toml`:

```toml
[start]
cmd = "node dist/main.js"  # Changed from "node services/loan-service/dist/main.js"
```

But the build commands also need fixing because they assume repo root.

**Recommendation: Leave Root Directory empty!**

