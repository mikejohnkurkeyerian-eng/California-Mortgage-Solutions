# React Native Keychain Setup

If you're getting a 500 error or keychain-related errors, follow these steps:

## Android Setup

1. **Rebuild the app** (native modules need to be linked):
   ```bash
   cd apps/loan-automation-app/android
   ./gradlew clean
   cd ..
   ```

2. **Make sure the app is rebuilt**:
   ```bash
   pnpm android
   ```

## iOS Setup (when testing on iPhone)

1. **Install CocoaPods dependencies**:
   ```bash
   cd apps/loan-automation-app/ios
   pod install
   cd ..
   ```

2. **Add Face ID permission to Info.plist**:
   - Open `ios/LoanAutomationApp/Info.plist`
   - Add:
     ```xml
     <key>NSFaceIDUsageDescription</key>
     <string>We use Face ID to secure your Loan ID.</string>
     ```

## Troubleshooting

### Error: "Native module not found"
- Make sure you've rebuilt the app after installing `react-native-keychain`
- Try: `cd android && ./gradlew clean && cd .. && pnpm android`

### Error: "500 Internal Server Error"
- This usually means the native module isn't linked
- Rebuild the app completely
- On Android: Make sure you're using a physical device or emulator with API level 23+

### Error: "Keychain access denied"
- On iOS: Make sure you've added the Face ID permission
- On Android: Make sure the app has proper permissions

## Testing

After setup, test the authentication flow:
1. Enter a loan ID
2. Choose to save with PIN or Face ID
3. Try accessing the saved loan ID - should require authentication

