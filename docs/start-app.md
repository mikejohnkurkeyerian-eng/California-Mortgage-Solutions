# How to Start the React Native App

## Step 1: Navigate to the App Directory

Make sure you're in the **project root** first:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
```

Then navigate to the app:

```powershell
cd apps/loan-automation-app
```

## Step 2: Start the App

**Option A: Using pnpm with bypass (if you get execution policy errors):**
```powershell
powershell -ExecutionPolicy Bypass -Command "pnpm windows"
```

**Option B: If execution policy is fixed:**
```powershell
pnpm windows
```

**Option C: Using npx:**
```powershell
npx pnpm windows
```

## Full Command (from project root)

Or you can do it all in one command from the project root:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
powershell -ExecutionPolicy Bypass -Command "cd apps/loan-automation-app; pnpm windows"
```

## Important Notes

- Make sure all backend services are running first (from `pnpm start`)
- Use **Developer Command Prompt for VS 2022** if you get C++ compiler errors
- The app will take a minute or two to build the first time

