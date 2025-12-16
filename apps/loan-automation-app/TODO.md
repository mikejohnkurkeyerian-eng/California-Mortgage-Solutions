# Future Considerations & TODO

## Completed ✅
- React Native upgraded from 0.73.0 to 0.74.7
- Fixed BaseReactPackage compatibility issues
- Fixed react-native-gesture-handler ViewManagerWithGeneratedInterface compatibility
- Fixed Kotlin metadata version compatibility for gradle-plugin
- Created auto-patching system for persistent fixes
- Created bundle script for Android release builds

## Future Tasks

### 1. Monitor for Library Updates
- **react-native-gesture-handler**: When a version compatible with React Native 0.74.7 is released, remove the patch at `patches/react-native-gesture-handler+2.29.1.patch`
- **@react-native/gradle-plugin**: When updated to a version compatible with Gradle 8.7/Kotlin 1.9.22, remove the Kotlin metadata version check patch

### 2. Update React Native Dev Dependencies
Some dev dependencies still reference React Native 0.73.x:
- `@react-native/babel-preset`: 0.73.21 → Update to 0.74.x
- `@react-native/eslint-config`: 0.73.1 → Update to 0.74.x
- `@react-native/gradle-plugin`: 0.73.0 → Update to 0.74.x (when available)
- `@react-native/metro-config`: 0.73.2 → Update to 0.74.x
- `@react-native/typescript-config`: 0.73.1 → Update to 0.74.x

### 3. Running the App

#### For Debug Builds:
1. Start Metro bundler in one terminal:
   ```bash
   pnpm start
   # or
   npx react-native start
   ```
2. Run the app in another terminal:
   ```bash
   pnpm android
   # or
   npx react-native run-android
   ```

#### For Release Builds:
1. Bundle the JavaScript:
   ```bash
   pnpm bundle:android
   ```
2. Build the APK:
   ```bash
   pnpm build:android
   ```

**Note**: The bundle script automatically runs before release builds, so you can just run `pnpm build:android` directly.

### 4. iOS Build Testing
- Test iOS build separately (may need similar compatibility fixes)
- Verify gesture handling works on iOS

### 5. Clean Up Temporary Files
- The `package-lock.json` at root is only for Nixpacks compatibility - can be removed if not using Nixpacks

## Notes
- All patches are automatically applied via `postinstall` script
- Patches are stored in `patches/` directory
- The gradle-plugin patch is applied via `scripts/apply-patches.js`

