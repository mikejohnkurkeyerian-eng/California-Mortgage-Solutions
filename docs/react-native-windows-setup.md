# React Native Windows Setup

## Current Issue

The React Native Windows platform hasn't been initialized yet. You need to set it up before you can run `pnpm windows`.

## Option 1: Initialize React Native Windows (Recommended for Desktop)

From the `apps/loan-automation-app` directory, run:

```powershell
cd apps/loan-automation-app
npx react-native-windows-init --overwrite
```

This will:
- Create the `windows` folder
- Set up the Visual Studio project
- Configure Windows-specific dependencies

**Note:** This requires Visual Studio 2022 with C++ desktop development workload (which you should already have installed).

After initialization, you can run:
```powershell
pnpm windows
```

## Option 2: Start Metro Bundler First

You can start the Metro bundler (JavaScript bundler) first:

```powershell
cd apps/loan-automation-app
pnpm start
```

This starts the development server. Then in another terminal, you can try initializing Windows support.

## Option 3: Use React Native Web (Alternative)

If Windows setup is too complex, you could also set up React Native Web for browser testing:

```powershell
cd apps/loan-automation-app
pnpm add react-native-web react-dom
```

Then modify the setup to support web.

## Troubleshooting

If `react-native-windows-init` fails:
1. Make sure Visual Studio 2022 is installed with C++ desktop development
2. Make sure you're in the correct directory
3. Try running as Administrator
4. Check Node.js version (should be 18+)

