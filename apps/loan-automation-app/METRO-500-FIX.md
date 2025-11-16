# Metro 500 Error - Complete Fix Guide

This document explains all fixes applied to resolve the Metro 500 error.

## Issues Fixed

### 1. ✅ TypeScript Compilation Errors
- **Problem**: `LoanApplication` type doesn't have `loanAmount` directly - it's in `property.loanAmount`
- **Fixed**: Updated all references from `loan.loanAmount` to `loan.property.loanAmount` in:
  - `DashboardScreen.tsx` (2 places)
  - `LoanDetailScreen.tsx` (1 place)

### 2. ✅ Package Import Resolution
- **Problem**: Metro couldn't resolve `@shared-types` imports
- **Fixed**: 
  - Changed all imports from `@shared-types` to `@loan-platform/shared-types`
  - Configured Metro resolver with alias
  - Configured Babel module-resolver with alias

### 3. ✅ Metro Configuration
- **Fixed**: `metro.config.js` now:
  - Watches the shared-types folder
  - Resolves both `@shared-types` and `@loan-platform/shared-types` to source files
  - Handles TypeScript files correctly
  - Prioritizes aliases over node_modules

### 4. ✅ Babel Configuration  
- **Fixed**: `babel.config.js` now:
  - Uses `babel-plugin-module-resolver` 
  - Resolves both aliases to source files
  - Handles TypeScript extensions

### 5. ✅ Shared Types Package
- **Fixed**: Built the shared-types package (TypeScript → JavaScript)
- **Verified**: All exports are available (`getDocumentRequirements`, `checkDocumentCompleteness`, etc.)

## Verification

Run the verification script to check everything:
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
.\verify-setup.ps1
```

## How to Start Metro (Without 500 Error)

1. **Stop any running Metro processes**
   ```powershell
   # Press Ctrl+C in Metro terminal, or:
   Get-NetTCPConnection -LocalPort 8081 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

2. **Clear all caches**
   ```powershell
   cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
   Remove-Item -Recurse -Force .metro-cache -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   ```

3. **Start Metro with cleared cache**
   ```powershell
   pnpm start --reset-cache
   ```

## All Configuration Files Updated

1. ✅ `metro.config.js` - Metro resolver configured
2. ✅ `babel.config.js` - Babel module-resolver configured  
3. ✅ `src/screens/DashboardScreen.tsx` - Fixed property references
4. ✅ `src/screens/LoanDetailScreen.tsx` - Fixed property references
5. ✅ `src/screens/LoanApplicationScreen.tsx` - Using correct import
6. ✅ `src/screens/DocumentUploadScreen.tsx` - Using correct import
7. ✅ `src/screens/DocumentChecklistScreen.tsx` - Using correct import
8. ✅ `App.tsx` - Removed unused imports

## TypeScript Compilation Status

✅ **All TypeScript errors fixed** - `pnpm tsc --noEmit` passes with no errors

## Next Steps

1. Restart Metro: `pnpm start --reset-cache`
2. Run the app: `.\run-android.ps1`
3. The 500 error should be completely resolved!

## Troubleshooting

If you still get a 500 error:

1. **Check Metro logs** - Look for specific error messages
2. **Run verification**: `.\verify-setup.ps1`
3. **Check TypeScript**: `pnpm tsc --noEmit`
4. **Clear everything**: Delete `.metro-cache` and `node_modules/.cache`
5. **Restart Metro**: `pnpm start --reset-cache`

