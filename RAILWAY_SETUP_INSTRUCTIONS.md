# Railway Setup Instructions

## Root Directory Configuration

**IMPORTANT:** Set Root Directory to `services/loan-service` in Railway settings.

### Why?

The `nixpacks.toml` build commands are written assuming Railway starts in `services/loan-service`:
1. `cd ../..` goes to repo root
2. Installs dependencies at repo root
3. Builds shared-types
4. `cd services/loan-service` returns to service folder
5. Builds the service

### Steps

1. **Go to Railway** → loan-service → **Settings**
2. **Set "Root Directory"** to: `services/loan-service`
3. **Make sure "Branch"** is: `main`
4. **Click "Save"**
5. **Click "Redeploy"**

---

## If Root Directory Fails

If Railway says "Root Directory does not exist", it means:
- Files aren't pushed to GitHub yet
- Wrong branch selected
- Path is incorrect

**Fix:**
1. Make sure files are pushed to GitHub
2. Check GitHub repo has `services/loan-service/` folder
3. Verify branch is `main` (or `master`)

---

## After Successful Deploy

Railway will:
1. Clone your repo
2. Change to `services/loan-service`
3. Run build commands
4. Start with `node dist/main.js`

