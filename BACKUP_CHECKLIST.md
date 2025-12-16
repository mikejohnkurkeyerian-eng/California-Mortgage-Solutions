# 🗂️ Backup Checklist - Before Hard Wipe

## ⚠️ IMPORTANT: What to Back Up Before Hard Wipe

### 🔴 **CRITICAL - Must Save (Project Files)**

These are your actual project files that contain all the code and configuration:

#### **1. Entire Project Directory**
```
C:\Users\Mike\Desktop\AI PROCCESS TEST\
```
**Why:** This contains ALL your code, configuration, and project files.

#### **2. Specific Critical Files:**

**Configuration Files:**
- `pnpm-workspace.yaml` - Workspace configuration
- `package.json` - Root package.json
- `pnpm-lock.yaml` - Dependency lock file
- `tsconfig.base.json` - TypeScript configuration

**Services (Backend):**
- `services/loan-service/src/` - All source code
- `services/loan-service/package.json` - Service dependencies
- `services/loan-service/nixpacks.toml` - Deployment configuration
- `services/*/src/` - All other service source code

**Web App (Broker Console):**
- `web/broker-console/src/` - All source code
- `web/broker-console/package.json` - Dependencies
- `web/broker-console/next.config.js` - Next.js config
- `web/broker-console/tailwind.config.ts` - Tailwind config
- `web/broker-console/.env.local` - Environment variables (if exists)

**Borrower App (React Native):**
- `apps/loan-automation-app/src/` - All source code
- `apps/loan-automation-app/package.json` - Dependencies
- `apps/loan-automation-app/App.tsx` - Main app file

**Shared Libraries:**
- `libs/shared-types/src/` - TypeScript types
- `libs/shared-types/package.json` - Library dependencies
- `libs/ui-components/src/` - UI components
- `libs/workflow-clients/src/` - Workflow clients

**Documentation:**
- `docs/` - All documentation
- `*.md` files in root - Important markdown files

**Infrastructure:**
- `infra/terraform/` - Terraform configurations
- `railway.json` - Railway deployment config
- `nixpacks.toml` - Root nixpacks config

---

### 🟡 **IMPORTANT - Should Save (But Can Rebuild)**

**Database:**
- `services/loan-service/prisma/` - Database schema and migrations
- `services/loan-service/prisma/schema.prisma` - Prisma schema

**Build Files (Optional - Can Rebuild):**
- `node_modules/` - ❌ **DON'T backup** (can reinstall)
- `.next/` - ❌ **DON'T backup** (can rebuild)
- `dist/` folders - ❌ **DON'T backup** (can rebuild)
- `build/` folders - ❌ **DON'T backup** (can rebuild)

---

### 🟢 **NICE TO HAVE - Optional**

**Git Repository:**
- `.git/` folder - If you have a git repository
- `.gitignore` - Git ignore file

**Environment Files:**
- `.env` files - If you have environment variables
- `.env.local` files - Local environment variables

**IDE Settings:**
- `.vscode/` - VS Code settings (if you use VS Code)
- `.idea/` - IntelliJ settings (if you use IntelliJ)

---

## 📦 **Best Backup Strategy**

### **Option 1: Full Project Backup (Easiest)**
**Just backup the entire project folder:**
```
C:\Users\Mike\Desktop\AI PROCCESS TEST\
```

**Then exclude these folders when copying:**
- `node_modules/` ❌
- `.next/` ❌
- `dist/` ❌
- `build/` ❌
- `android/app/build/` ❌
- `android/build/` ❌

### **Option 2: Git Repository (Recommended)**
**Best approach:**
1. Initialize git repository in project
2. Create `.gitignore` to exclude build files
3. Commit all code
4. Push to GitHub/GitLab
5. Clone after hard wipe

### **Option 3: Cloud Storage**
**Copy entire project to:**
- OneDrive
- Google Drive
- Dropbox
- External USB drive

---

## ✅ **Quick Backup Command (PowerShell)**

### **Copy entire project (excluding node_modules and build files):**

```powershell
# From project root
$source = "C:\Users\Mike\Desktop\AI PROCCESS TEST"
$backup = "D:\BACKUP\AI PROCCESS TEST"  # Change to your backup location

# Copy entire project, excluding node_modules, .next, dist, build folders
robocopy "$source" "$backup" /E /XD node_modules .next dist build android\app\build android\build /XF .env.local
```

### **Or use compression:**

```powershell
# Compress entire project (excluding build files)
Compress-Archive -Path "$source" -DestinationPath "D:\BACKUP\loan-automation-platform.zip" -CompressionLevel Optimal
```

---

## 🔄 **After Hard Wipe - What to Restore**

1. **Restore project folder**
2. **Reinstall dependencies:**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
   pnpm install
   ```
3. **Rebuild shared libraries:**
   ```powershell
   pnpm --filter @loan-platform/shared-types build
   ```
4. **Restore environment variables** (if you had `.env.local` files)
5. **Test everything works:**
   ```powershell
   # Start services
   cd services\loan-service
   pnpm start
   ```

---

## 📋 **Pre-Wipe Checklist**

Before hard wipe, make sure you have:

- [ ] Entire project folder backed up
- [ ] All `.env` files backed up (if any)
- [ ] Database schema backed up (Prisma schema)
- [ ] Documentation files backed up
- [ ] Any custom configurations saved
- [ ] API keys/credentials saved (in secure location)
- [ ] Git repository pushed (if using git)

---

## ⚠️ **DON'T Backup (Can Rebuild)**

- ❌ `node_modules/` - Can reinstall with `pnpm install`
- ❌ `.next/` - Can rebuild with `pnpm dev`
- ❌ `dist/` - Can rebuild with `pnpm build`
- ❌ `build/` - Can rebuild
- ❌ `android/app/build/` - Can rebuild
- ❌ `android/build/` - Can rebuild

---

## 🎯 **Minimum Backup (Just Essentials)**

If you want to save space, just backup these:

```
✅ Entire src/ folders (all source code)
✅ All .json files (package.json, tsconfig.json, etc.)
✅ All .ts, .tsx, .js, .jsx files (all code)
✅ All .md files (documentation)
✅ All .toml files (configuration)
✅ prisma/schema.prisma (database schema)
✅ .gitignore (if using git)
```

**Everything else can be rebuilt!**

---

## 📝 **Summary**

**Most Important:**
1. ✅ **Entire project folder** (`C:\Users\Mike\Desktop\AI PROCCESS TEST\`)
2. ✅ **All source code** (`src/` folders everywhere)
3. ✅ **All configuration files** (`package.json`, `tsconfig.json`, etc.)
4. ✅ **Database schema** (`prisma/schema.prisma` if exists)
5. ✅ **Documentation** (`docs/` folder and `*.md` files)

**Don't Backup:**
- ❌ `node_modules/` (can reinstall)
- ❌ Build folders (can rebuild)

**After Restore:**
1. Restore project folder
2. Run `pnpm install`
3. Rebuild: `pnpm --filter @loan-platform/shared-types build`
4. Start services and test

---

**Yes, you can hard wipe now as long as you backup the project folder!** ✅

