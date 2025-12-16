# Railway Root Directory Solution

## The Problem

When Root Directory is set to `services/loan-service`, Railway only copies that folder, so we can't access the repo root for `pnpm install`.

## Solution: Leave Root Directory EMPTY

**Don't set Root Directory!** Let Railway use the repo root.

Then the `nixpacks.toml` works from the repo root.

---

## Steps

1. **Go to Railway** → loan-service → **Settings**
2. **Find "Root Directory"** field
3. **Clear it** (make it empty/blank)
4. **Click "Save"**
5. **Click "Redeploy"**

---

## Updated nixpacks.toml

The config now:
- Starts from repo root (no Root Directory)
- Runs `pnpm install` at repo root
- Builds shared-types at repo root
- Builds loan-service in `services/loan-service/`
- Starts with `node services/loan-service/dist/main.js`

---

## Why This Works

- Railway clones entire repo to `/app`
- All commands run from `/app` (repo root)
- Can access `package.json`, `pnpm-workspace.yaml`, etc.
- Can build monorepo dependencies
- Simple and reliable

