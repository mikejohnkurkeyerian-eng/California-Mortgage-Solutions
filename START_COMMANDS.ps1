# Broker Console - Start Commands for PowerShell
# Copy and paste these commands one by one into PowerShell

# Step 1: Navigate to project root
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"

# Step 2: Verify you're in the right place
Get-Location

# Step 3: Start Loan Service (Backend)
# Run this command:
cd services\loan-service
pnpm start

# NOTE: Keep this terminal window open and running!
# Open a NEW PowerShell window for the next step

# ==========================================
# NEW TERMINAL WINDOW - Frontend
# ==========================================

# Step 4: In a NEW PowerShell window, run:
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev

# Then open browser to: http://localhost:3000

