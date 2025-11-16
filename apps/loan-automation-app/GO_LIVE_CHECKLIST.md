# 🚀 Go Live Checklist

## Before Building Production APK

### ✅ 1. Update API Configuration

**CRITICAL**: Update production API URLs!

Edit `apps/loan-automation-app/src/config/api.ts` line 51:

```typescript
// Replace with your actual production backend URL
return `https://your-production-backend.com`;
```

**Or set environment variables before building:**
```powershell
$env:LOAN_SERVICE_URL="https://api.yourdomain.com"
$env:DOCUMENT_SERVICE_URL="https://api.yourdomain.com"
```

### ✅ 2. Update App Version

Edit `apps/loan-automation-app/android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 1        // Increment for each release
    versionName "1.0.0"  // Semantic versioning
}
```

### ✅ 3. Backend Services

**Option A: Deploy to Cloud** (Recommended)
- Deploy backend services to AWS/Google Cloud/Azure
- Use HTTPS endpoints
- Update API URLs in app config

**Option B: Keep Local** (Testing Only)
- Backend must be running on a server
- Users need to know the server IP
- Not recommended for production

### ✅ 4. Test Everything

- [ ] Loan application submission
- [ ] Document upload
- [ ] Document classification
- [ ] Checklist loading
- [ ] All navigation flows
- [ ] Error handling

---

## Build Production APK

### Quick Build

```powershell
cd apps/loan-automation-app
.\build-production.ps1
```

### Manual Build

```powershell
cd apps/loan-automation-app/android
.\gradlew.bat clean
.\gradlew.bat assembleRelease
```

**APK Location**: `android/app/build/outputs/apk/release/app-release.apk`

---

## Install & Test

### Install on Device

```powershell
adb install android/app/build/outputs/apk/release/app-release.apk
```

Or transfer APK to device and install manually.

### Test Without Metro

1. **Close Metro bundler** (if running)
2. **Launch app** on device
3. **Test all features** - should work standalone
4. **Verify API connections** work with your backend

---

## Production Deployment Options

### Option 1: Direct APK Distribution
- Share APK file directly
- Users enable "Install from Unknown Sources"
- Quick and easy for internal testing

### Option 2: Google Play Store
- Create developer account
- Generate release keystore (see PRODUCTION_DEPLOYMENT.md)
- Upload signed APK
- Submit for review

### Option 3: Enterprise Distribution
- Firebase App Distribution
- Internal app store
- MDM solution

---

## Important Reminders

⚠️ **API URLs**: Must be updated to production endpoints!

⚠️ **Backend Services**: Must be deployed and accessible!

⚠️ **HTTPS Required**: Android 9+ requires HTTPS for network requests

⚠️ **Keystore**: For Play Store, you need a release keystore (see PRODUCTION_DEPLOYMENT.md)

---

## Quick Commands

```powershell
# Build production APK
cd apps/loan-automation-app
.\build-production.ps1

# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Check APK info
aapt dump badging android/app/build/outputs/apk/release/app-release.apk
```

---

## Need Help?

- See `PRODUCTION_DEPLOYMENT.md` for detailed instructions
- Check `DEVELOPMENT.md` for development workflow
- Review error logs if issues occur

**Ready to go live?** Run `.\build-production.ps1` and follow the prompts! 🎉

