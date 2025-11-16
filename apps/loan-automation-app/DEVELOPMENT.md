# Development Guide

## Development vs Production Builds

### 🔄 **With Metro (Development Mode) - Current Setup**
- ✅ **Hot Reloading**: Changes appear instantly (2-3 seconds)
- ✅ **Fast Refresh**: React components update without losing state
- ✅ **Easy Editing**: Edit code → Save → See changes immediately
- ✅ **Error Overlay**: See errors directly in the app
- ⚠️ **Requires Metro**: Must keep Metro bundler running

**How it works:**
1. Metro bundler watches your files
2. When you save, Metro rebuilds changed files
3. App automatically reloads with new code
4. Very fast development cycle

---

### 📦 **Without Metro (Production Build)**
- ❌ **No Hot Reloading**: Changes require full rebuild
- ❌ **No Fast Refresh**: Must restart app to see changes
- ✅ **You CAN still edit code**: Just need to rebuild after changes
- ✅ **Faster app performance**: Optimized production build
- ✅ **No Metro dependency**: App runs standalone

**How it works:**
1. You edit code in your editor
2. Build the app: `npx react-native run-android` (or build APK)
3. Install the new build on device/emulator
4. App runs with your changes

---

## Recommended Development Workflow

### Option 1: Keep Metro for Development (Recommended)
**Best for active development and testing**

```bash
# Terminal 1: Backend Services
pnpm start

# Terminal 2: Metro Bundler
cd apps/loan-automation-app
pnpm start

# Terminal 3: Run App (connects to Metro)
pnpm android
```

**Benefits:**
- Edit code → Save → See changes in 2-3 seconds
- Perfect for rapid iteration
- Easy debugging with error overlays

---

### Option 2: Production Build for Testing
**Best for testing final performance and production behavior**

```bash
# Build production APK
cd apps/loan-automation-app/android
./gradlew assembleRelease

# Or build and install directly
cd apps/loan-automation-app
npx react-native run-android --mode=release
```

**When to use:**
- Testing final app performance
- Preparing for distribution
- Testing without Metro dependency
- Showing to stakeholders

**Editing workflow:**
1. Edit code in your editor
2. Rebuild: `npx react-native run-android`
3. App restarts with changes
4. Takes 1-2 minutes per rebuild

---

## Backend Services (Always Editable)

✅ **Backend services ALWAYS support hot reloading** (even without Metro)

Your backend services use `ts-node-dev` which automatically reloads when you edit:
- `services/loan-service/src/**` - Auto-reloads on save
- `services/document-service/src/**` - Auto-reloads on save
- `services/workflow-service/src/**` - Auto-reloads on save
- `services/rules-service/src/**` - Auto-reloads on save

**You can edit backend code anytime** - changes take effect immediately (1-2 seconds)

---

## Hybrid Approach (Best of Both Worlds)

### For Active Development:
```bash
# Keep Metro running for React Native app
# Edit frontend code → See changes instantly
```

### For Production Testing:
```bash
# Build production APK
# Test without Metro
# Edit code → Rebuild → Test again
```

---

## Summary

| Feature | With Metro | Without Metro |
|---------|-----------|---------------|
| **Edit Code** | ✅ Yes | ✅ Yes |
| **See Changes** | ✅ Instantly (2-3 sec) | ⏱️ After rebuild (1-2 min) |
| **Hot Reloading** | ✅ Yes | ❌ No |
| **App Performance** | 🐌 Slower (dev mode) | ⚡ Faster (optimized) |
| **Metro Required** | ✅ Yes | ❌ No |
| **Backend Editing** | ✅ Always works | ✅ Always works |

---

## Recommendation

**Keep Metro running during active development** - it makes editing much faster!

Only build without Metro when:
- Testing production performance
- Preparing for distribution
- Demonstrating to others
- You want to test without Metro dependency

You can always switch between modes - they're not mutually exclusive!

