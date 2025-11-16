# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Update API Configuration

**IMPORTANT**: Before building for production, update your API URLs!

Edit `apps/loan-automation-app/src/config/api.ts`:

```typescript
// Change line 51 from:
return `https://api.yourdomain.com`;

// To your actual production API URL:
return `https://your-production-api.com`;
```

Or set environment variables:
- `LOAN_SERVICE_URL`
- `DOCUMENT_SERVICE_URL`
- `AUTH_SERVICE_URL`

### 2. Update App Version

Edit `apps/loan-automation-app/android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 1  // Increment for each release
    versionName "1.0"  // Update version number
}
```

### 3. Generate Release Keystore (Required for Production)

**For Google Play Store or production distribution, you MUST create a release keystore:**

```powershell
cd apps/loan-automation-app/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias loan-app-key -keyalg RSA -keysize 2048 -validity 10000
```

**Save these credentials securely!** You'll need them for future updates.

Then update `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('release.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'loan-app-key'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release  // Use release keystore
        minifyEnabled true  // Enable code minification
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### 4. Enable Authentication (Optional)

If you want to re-enable PIN/Face ID authentication:

Edit `apps/loan-automation-app/src/utils/secureStorage.ts`:
```typescript
const AUTH_ENABLED = true;  // Change from false to true
```

Then rebuild the app.

---

## Building Production APK

### Quick Build (Debug Keystore - For Testing Only)

```powershell
cd apps/loan-automation-app
.\build-production.ps1
```

This creates: `android/app/build/outputs/apk/release/app-release.apk`

### Manual Build

```powershell
cd apps/loan-automation-app/android
.\gradlew.bat clean
.\gradlew.bat assembleRelease
```

---

## Installing the Production APK

### On Your Device

1. **Enable "Install from Unknown Sources"**:
   - Settings → Security → Enable "Unknown Sources" or "Install Unknown Apps"

2. **Transfer APK to device**:
   - Copy `app-release.apk` to your phone
   - Or use: `adb install app-release.apk`

3. **Install**:
   - Open the APK file on your phone
   - Tap "Install"

### Via ADB

```powershell
adb install apps/loan-automation-app/android/app/build/outputs/apk/release/app-release.apk
```

---

## Backend Services for Production

### Option 1: Deploy Backend Services

Deploy your backend services to a cloud provider:
- AWS, Google Cloud, Azure, Heroku, etc.
- Update API URLs in the app config
- Ensure services are accessible via HTTPS

### Option 2: Use Local Backend (Development Only)

For testing, you can still run backend locally:
```powershell
# Terminal 1: Backend services
pnpm start
```

But users will need to be on the same network and know your IP address.

---

## Production Checklist

- [ ] Update API URLs to production endpoints
- [ ] Generate release keystore (for Play Store)
- [ ] Update app version number
- [ ] Test production build thoroughly
- [ ] Enable authentication if needed
- [ ] Deploy backend services to cloud
- [ ] Test with production backend
- [ ] Configure error tracking/monitoring
- [ ] Set up analytics (optional)

---

## Distribution Options

### 1. Direct APK Distribution
- Share APK file directly
- Users install manually
- No app store required

### 2. Google Play Store
- Create developer account ($25 one-time fee)
- Build signed APK with release keystore
- Upload to Play Console
- Submit for review

### 3. Internal Distribution
- Use Firebase App Distribution
- Or enterprise MDM solution
- Or private app store

---

## Important Notes

⚠️ **Debug vs Release Builds**:
- **Debug**: Requires Metro bundler, larger size, includes debugging tools
- **Release**: Standalone, optimized, smaller size, no Metro needed

⚠️ **API Configuration**:
- Production builds use the `__DEV__ = false` path in `api.ts`
- Make sure production URLs are correct!

⚠️ **Backend Services**:
- Production app won't work without backend services running
- Deploy services to a server or cloud provider
- Use HTTPS in production (required for Android 9+)

---

## Testing Production Build

1. **Build the APK**: `.\build-production.ps1`
2. **Install on device**: `adb install android/app/build/outputs/apk/release/app-release.apk`
3. **Test without Metro**: App should work standalone
4. **Test all features**: Application, documents, uploads, etc.
5. **Test with production backend**: Ensure API calls work

---

## Troubleshooting

### "App won't connect to backend"
- Check API URLs in `api.ts`
- Ensure backend services are running and accessible
- Check firewall/network settings

### "App crashes on startup"
- Check Metro logs for errors
- Verify all native modules are properly linked
- Test debug build first

### "APK too large"
- Enable ProGuard minification
- Remove unused dependencies
- Use app bundles instead of APK (for Play Store)

---

## Next Steps After Building

1. **Test thoroughly** on multiple devices
2. **Deploy backend services** to production
3. **Update API URLs** in the app
4. **Rebuild** with production config
5. **Distribute** via your chosen method

Good luck with your production deployment! 🚀

