# 🧪 How to Test the Complete Automated Flow

## Quick Start Guide

### Step 1: Start All Services

**Terminal 1 - Loan Service (Backend):**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\services\loan-service"
pnpm start
```

**Terminal 2 - Broker Console (Frontend):**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\web\broker-console"
pnpm dev
```

**Terminal 3 - Borrower App (Mobile):**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start
# Or
npx react-native start
```

---

## 🧪 Test the Complete Flow

### Test 1: Create Loan Application

**Option A: Via Borrower App**
1. Open borrower app on phone/emulator
2. Fill out loan application
3. Click "Submit Application"
4. ✅ Check console - AI should automatically send document checklist

**Option B: Via API (Quick Test)**
```powershell
# Create test loan
$loanData = @{
    borrowerId = "test-borrower-1"
    borrower = @{
        id = "test-borrower-1"
        firstName = "John"
        lastName = "Doe"
        email = "john.doe@example.com"
        phone = "555-123-4567"
        createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        updatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    }
    property = @{
        address = @{
            street = "123 Main Street"
            city = "San Francisco"
            state = "CA"
            zipCode = "94102"
        }
        propertyType = "SingleFamily"
        purchasePrice = 500000
        downPayment = 100000
        loanAmount = 400000
    }
    employment = @{
        status = "Employed"
        employerName = "Tech Corp Inc"
        monthlyIncome = 8000
        incomeType = "W2"
    }
    loanType = "Conventional"
    loanPurpose = "Purchase"
    loanTerm = 360
    assets = @()
    debts = @()
    documents = @()
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://localhost:4002/api/applications" -Method Post -Body $loanData -ContentType "application/json"
$loanId = $response.data.id
Write-Host "Loan ID: $loanId"
```

**Check Console:** You should see:
```
[AUTOMATED] Sending document checklist to borrower for loan {LOAN_ID}
[AUTOMATED] Email would be sent to: john.doe@example.com
[AUTOMATED] Document checklist (X items):
```

---

### Test 2: Upload Documents

```powershell
# Upload documents (simulating borrower upload)
$documents = @(
    @{
        id = "doc-1"
        loanId = $loanId
        type = "DriverLicense"
        fileName = "drivers_license.pdf"
        fileSize = 245760
        mimeType = "application/pdf"
        uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        uploadedBy = "test-borrower-1"
        storagePath = "/documents/drivers_license.pdf"
        verificationStatus = "Verified"
    }
    @{
        id = "doc-2"
        loanId = $loanId
        type = "PayStub"
        fileName = "paystub_jan_2024.pdf"
        fileSize = 128000
        mimeType = "application/pdf"
        uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        uploadedBy = "test-borrower-1"
        storagePath = "/documents/paystub_jan_2024.pdf"
        verificationStatus = "Verified"
    }
    @{
        id = "doc-3"
        loanId = $loanId
        type = "BankStatement"
        fileName = "bank_statement_jan_2024.pdf"
        fileSize = 512000
        mimeType = "application/pdf"
        uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        uploadedBy = "test-borrower-1"
        storagePath = "/documents/bank_statement_jan_2024.pdf"
        verificationStatus = "Verified"
    }
) | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:4002/api/applications/$loanId/documents" -Method Post -Body $documents -ContentType "application/json"
```

**Check Console:** You should see:
```
[AUTOMATED] ✅ All required documents uploaded for loan {LOAN_ID}
[AUTOMATED] Notifying broker that loan {LOAN_ID} is ready for review
```

**Check Broker Console:**
1. Go to: http://localhost:3000/dashboard
2. Refresh page
3. ✅ Loan should appear with all documents automatically!

---

### Test 3: Broker Reviews & Submits to Underwriting

1. **Open Broker Console:**
   - Go to: http://localhost:3000/dashboard
   - Click on the loan card

2. **Review "Review & Approve" Tab:**
   - ✅ Should see all borrower information (Auto-collected)
   - ✅ Should see all property information (Auto-collected)
   - ✅ Should see all documents (Auto-verified)
   - ✅ Click "Edit" if you want to make changes
   - ✅ Click "Submit to Underwriting"

3. **Check Console:** You should see:
```
[AUTOMATED] Generating PreUnderwriting conditions for loan {LOAN_ID}
[AUTOMATED] Sending condition template to borrower for loan {LOAN_ID}
[AUTOMATED] Email would be sent to: john.doe@example.com
[AUTOMATED] Conditions to fulfill: X conditions
```

**Check Broker Console:**
- ✅ Loan stage should be "PreUnderwriting"
- ✅ Click "Conditions" tab
- ✅ Should see automatically generated conditions

---

### Test 4: Upload Condition Documents

```powershell
# Upload condition documents (simulating borrower upload)
$conditionDocs = @(
    @{
        id = "doc-4"
        loanId = $loanId
        type = "TaxReturn"
        fileName = "tax_return_2023.pdf"
        fileSize = 345600
        mimeType = "application/pdf"
        uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        uploadedBy = "test-borrower-1"
        storagePath = "/documents/tax_return_2023.pdf"
        verificationStatus = "Verified"
    }
) | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:4002/api/applications/$loanId/documents" -Method Post -Body $conditionDocs -ContentType "application/json"
```

**Check Console:** You should see:
```
[AUTOMATED] ✅ All conditions satisfied for loan {LOAN_ID}, ready for underwriting
[AUTOMATED] Notifying broker that loan {LOAN_ID} is ready for review
```

**Check Broker Console:**
- ✅ Go to loan detail → "Conditions" tab
- ✅ Conditions should show as "Satisfied" (automatically!)

---

### Test 5: Broker Approves & AI Orders Appraisal/Escrow

```powershell
# Broker approves loan (moves to ClearToClose)
Invoke-RestMethod -Uri "http://localhost:4002/api/applications/$loanId/approve" -Method Post -ContentType "application/json"
```

**Check Console:** You should see:
```
[AUTOMATED] Performing post-approval tasks for loan {LOAN_ID}
[AUTOMATED] Ordering appraisal for loan {LOAN_ID}
[AUTOMATED] ✅ Appraisal ordered successfully
[AUTOMATED] Checking escrow waivers for loan {LOAN_ID}
[AUTOMATED] ✅ Found X escrow waiver(s) available
[AUTOMATED] Ordering title report...
[AUTOMATED] Ordering flood certification...
[AUTOMATED] Verifying homeowner's insurance...
[AUTOMATED] ✅ Post-approval tasks completed
```

**Check Broker Console:**
- ✅ Loan stage should be "ClearToClose"
- ✅ Appraisal should be ordered automatically
- ✅ Escrow waivers should be checked automatically

---

## 🎯 What to Look For

### ✅ **Automatic Actions (Check Console):**

1. **When Loan Created:**
   - `[AUTOMATED] Sending document checklist to borrower`
   - `[AUTOMATED] Email would be sent to: {EMAIL}`
   - `[AUTOMATED] Document checklist (X items):`

2. **When Documents Uploaded:**
   - `[AUTOMATED] ✅ All required documents uploaded`
   - `[AUTOMATED] Notifying broker that loan is ready for review`

3. **When Submitted to Underwriting:**
   - `[AUTOMATED] Generating PreUnderwriting conditions`
   - `[AUTOMATED] Sending condition template to borrower`
   - `[AUTOMATED] Conditions to fulfill: X conditions`

4. **When Conditions Satisfied:**
   - `[AUTOMATED] ✅ All conditions satisfied`
   - `[AUTOMATED] Notifying broker`

5. **When Approved:**
   - `[AUTOMATED] Ordering appraisal`
   - `[AUTOMATED] Checking escrow waivers`
   - `[AUTOMATED] ✅ Post-approval tasks completed`

### ✅ **Broker Console Should Show:**

- ✅ All documents automatically appear
- ✅ All conditions automatically appear
- ✅ Conditions automatically marked as "Satisfied" when documents uploaded
- ✅ Appraisal automatically ordered when approved
- ✅ Escrow waivers automatically checked

---

## 🚀 Complete End-to-End Test

1. ✅ Create loan → AI sends document checklist
2. ✅ Upload documents → AI notifies broker
3. ✅ Broker submits → AI generates conditions
4. ✅ Upload condition docs → AI satisfies conditions
5. ✅ Broker approves → AI orders appraisal/checks escrow
6. ✅ Everything automated!

---

## 📝 Notes

- All automation logs to console with `[AUTOMATED]` prefix
- Email/SMS notifications are simulated (would connect to notification service)
- Appraisal/title ordering is simulated (would connect to vendor APIs)
- Everything else is fully functional!

**Enjoy the fully automated loan processing!** 🎉

