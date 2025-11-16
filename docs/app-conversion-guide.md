# Converting to Desktop/Mobile App

## Overview

We're converting the web applications (borrower portal and broker console) into a React Native app that works on:
- **Desktop**: Windows, Mac, Linux (using React Native Windows/Mac)
- **Mobile**: iOS and Android (same codebase)

## Architecture

### App Structure
```
apps/loan-automation-app/
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── BorrowerScreen.tsx
│   │   ├── BrokerScreen.tsx
│   │   ├── DocumentUploadScreen.tsx
│   │   ├── LoanApplicationScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── LoanDetailScreen.tsx
│   └── components/       # Reusable components
├── App.tsx              # Main app with navigation
├── index.js             # Entry point
└── package.json
```

### Navigation Structure
- **Home Screen**: Choose Borrower or Broker
- **Borrower Tabs**:
  - Application tab (loan form)
  - Documents tab (upload)
- **Broker Tabs**:
  - Dashboard tab (loan list)

## Setup Instructions

### Prerequisites
1. Node.js 18+
2. pnpm installed
3. React Native CLI: `npm install -g react-native-cli`

### For Windows Desktop
1. Install Visual Studio 2022 with:
   - Desktop development with C++
   - Windows 10/11 SDK
   
2. Install dependencies:
   ```bash
   cd apps/loan-automation-app
   pnpm install
   ```

3. Run on Windows:
   ```bash
   pnpm windows
   ```

### For Mac Desktop
1. Install Xcode
2. Install dependencies:
   ```bash
   cd apps/loan-automation-app
   pnpm install
   ```

3. Run on Mac:
   ```bash
   pnpm macos
   ```

### For Mobile (iOS/Android)
1. For iOS: Install Xcode and CocoaPods
2. For Android: Install Android Studio and Android SDK

3. Run:
   ```bash
   # iOS
   pnpm ios
   
   # Android
   pnpm android
   ```

## Key Differences from Web

### Styling
- **Web**: CSS/Tailwind
- **React Native**: StyleSheet API
- No CSS classes, use StyleSheet.create()

### Components
- **Web**: `<div>`, `<button>`, `<input>`
- **React Native**: `<View>`, `<TouchableOpacity>`, `<TextInput>`

### Navigation
- **Web**: Next.js routing
- **React Native**: React Navigation

### File Upload
- **Web**: HTML file input
- **React Native**: react-native-document-picker

## Migration Status

### ✅ Completed
- [x] App structure and navigation
- [x] Home screen
- [x] Basic screen placeholders
- [x] Document upload screen (basic)

### 🚧 In Progress
- [ ] Complete document upload functionality
- [ ] Loan application form
- [ ] Broker dashboard with loan list
- [ ] Loan detail view

### 📋 TODO
- [ ] Convert all web screens to React Native
- [ ] Add proper styling
- [ ] Test on desktop platforms
- [ ] Test on mobile platforms
- [ ] Add error handling
- [ ] Add loading states

## Backend Services

The backend services (loan-service, document-service, workflow-service) remain unchanged and work the same way. The app just calls the same REST APIs.

## Next Steps

1. Complete the document upload screen
2. Build the loan application form
3. Build the broker dashboard
4. Test on Windows desktop
5. Test on mobile platforms

