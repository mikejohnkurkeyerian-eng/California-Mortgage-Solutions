# Testing Guide - Loan Automation Platform

## Prerequisites

Before testing, ensure:
1. ✅ All backend services are running
2. ✅ Metro bundler is running
3. ✅ Android app is built and installed on device/emulator

## Step 1: Start Backend Services

Open a terminal and run:

**Windows (PowerShell):**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST"
.\scripts\start-all.ps1
```

**Or start manually:**
```powershell
# From project root
pnpm start
```

This starts all 4 services:
- Loan Service: http://localhost:4002
- Document Service: http://localhost:4003
- Workflow Service: http://localhost:4004
- Rules Service: http://localhost:4005

**Verify services are running:**
- Check terminal output for "listening on port" messages
- All services should show "listening on port XXXX"

## Step 2: Start Metro Bundler

Open a **new terminal** and run:

```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app"
pnpm start
```

You should see:
```
Metro waiting on exp://...
```

## Step 3: Run the Android App

**Option A: Android Studio**
1. Open Android Studio
2. Open the project: `apps/loan-automation-app/android`
3. Click the **Run** button (green play icon) or press `Shift+F10`
4. Select your device/emulator

**Option B: Command Line**
```powershell
cd "C:\Users\Mike\Desktop\AI PROCCESS TEST\apps\loan-automation-app\android"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat installDebug
```

Then start the app on your device/emulator.

## Step 4: Testing the App

### Test 1: Home Screen
**What to test:**
- ✅ App launches successfully
- ✅ Home screen displays with two buttons:
  - "Borrower Portal"
  - "Broker Console"
- ✅ Navigation works when tapping buttons

**Expected Result:**
- Home screen shows welcome message and two navigation buttons
- Tapping buttons navigates to respective portals

---

### Test 2: Borrower Portal - Loan Application

**Navigation:** Home → Borrower Portal → Application Tab

**What to test:**
1. **Step 1: Personal Information**
   - Fill in borrower name, email, phone
   - Fill in co-borrower information (if applicable)
   - Tap "Next"

2. **Step 2: Property Information**
   - Enter property address
   - Enter purchase price
   - Enter loan amount
   - Enter down payment
   - Tap "Next"

3. **Step 3: Financial Information**
   - Enter monthly income
   - Enter monthly debts
   - Enter assets
   - Tap "Next"

4. **Step 4: Review & Submit**
   - Review all entered information
   - Tap "Submit Application"

**Expected Result:**
- Form validation works (required fields)
- Navigation between steps works
- Application submits successfully
- Success message appears
- Application ID is displayed

**Verify in Backend:**
- Check Loan Service logs for new application
- Application should be created with status "draft" or "submitted"

---

### Test 3: Borrower Portal - Document Checklist

**Navigation:** Home → Borrower Portal → Checklist Tab

**What to test:**
- ✅ Checklist displays required documents based on loan type
- ✅ Documents show status (Missing, Pending, Complete)
- ✅ Progress indicator shows completion percentage
- ✅ Missing documents are highlighted

**Expected Documents (for standard loan):**
- W-2 Forms
- Tax Returns
- Bank Statements
- Pay Stubs
- Employment Verification
- Property Appraisal (if applicable)

**Expected Result:**
- Dynamic checklist based on loan requirements
- Visual indicators for document status
- Progress tracking

---

### Test 4: Borrower Portal - Document Upload

**Navigation:** Home → Borrower Portal → Upload Tab

**What to test:**
1. Tap "Select Document" button
2. Choose a file from device
3. Select document type from dropdown
4. Tap "Upload Document"

**Expected Result:**
- File picker opens
- Document uploads successfully
- Success message appears
- Document appears in checklist (if applicable)

**Verify in Backend:**
- Check Document Service logs
- Document should be stored
- Workflow event should be triggered

---

### Test 5: Broker Console - Dashboard

**Navigation:** Home → Broker Console → Dashboard Tab

**What to test:**
1. **Overview Cards:**
   - Total Applications count
   - Pending Reviews count
   - Approved count
   - Rejected count

2. **Loan List:**
   - List of all loan applications
   - Status badges (Draft, Submitted, Under Review, Approved, Rejected)
   - Filter buttons (All, Pending, Approved, Rejected)

3. **Filters:**
   - Tap filter buttons to filter loans
   - Verify list updates correctly

4. **Loan Details:**
   - Tap on a loan to view details
   - Should navigate to Loan Detail screen

**Expected Result:**
- Dashboard loads with loan statistics
- Loan list displays all applications
- Filters work correctly
- Navigation to detail screen works

---

### Test 6: Loan Detail Screen

**Navigation:** Broker Dashboard → Tap on a loan

**What to test:**
1. **Loan Information:**
   - Borrower information displayed
   - Property details
   - Financial information
   - Loan amount and terms

2. **Documents Section:**
   - List of uploaded documents
   - Document status
   - Download/view options (if implemented)

3. **Conditions Section:**
   - List of underwriting conditions
   - Condition status (Pending, Satisfied)

4. **Actions:**
   - Approve/Reject buttons (if applicable)
   - Sign-off functionality

**Expected Result:**
- Complete loan information displayed
- Documents list shows uploaded files
- Conditions display correctly
- Actions work as expected

---

## Step 5: End-to-End Workflow Test

### Complete Loan Application Flow

1. **Create Application:**
   - Borrower Portal → Application
   - Fill out all 4 steps
   - Submit application

2. **Upload Documents:**
   - Borrower Portal → Upload
   - Upload at least 2-3 documents
   - Verify they appear in Checklist

3. **Check Workflow:**
   - Check Workflow Service logs
   - Application should progress through workflow steps:
     - Step 1: Application Submitted
     - Step 2: Documents Collected
     - Step 3: Underwriting Review
     - Step 4: Decision Made
     - Step 5: Finalized

4. **Broker Review:**
   - Broker Console → Dashboard
   - Find the submitted application
   - View details
   - Check conditions generated by Rules Service

5. **Verify Rules:**
   - Check Rules Service logs
   - DTI (Debt-to-Income) should be calculated
   - LTV (Loan-to-Value) should be calculated
   - Underwriting decision should be made
   - Conditions should be generated

---

## Step 6: Error Testing

### Test Error Handling

1. **Network Errors:**
   - Stop backend services
   - Try to submit application
   - Should show error message

2. **Validation Errors:**
   - Try to submit form with missing required fields
   - Should show validation errors

3. **Invalid Data:**
   - Enter invalid email format
   - Enter negative loan amount
   - Should show appropriate error messages

---

## Step 7: Performance Testing

### Check Performance

1. **App Startup:**
   - Time how long app takes to launch
   - Should be < 3 seconds

2. **Navigation:**
   - Navigate between screens
   - Should be smooth, no lag

3. **Data Loading:**
   - Load dashboard with many loans
   - Should load quickly
   - Scroll should be smooth

---

## Troubleshooting

### App Won't Start
- Check Metro bundler is running
- Check backend services are running
- Check device/emulator is connected
- Check Android Studio logs

### Services Not Responding
- Check service logs for errors
- Verify ports are not in use
- Restart services

### Build Errors
- Clean build: `.\gradlew.bat clean`
- Rebuild: `.\gradlew.bat assembleDebug`
- Check Android Studio for errors

### Navigation Issues
- Check React Navigation is properly installed
- Verify screen components are exported correctly

---

## Success Criteria

✅ All screens load without errors
✅ Navigation works smoothly
✅ Forms validate correctly
✅ Documents upload successfully
✅ Backend services receive requests
✅ Workflow progresses correctly
✅ Rules service calculates correctly
✅ Dashboard displays loan data
✅ No crashes or errors

---

## Next Steps After Testing

Once basic testing is complete:

1. **Database Integration:**
   - Set up PostgreSQL database
   - Run Prisma migrations
   - Test data persistence

2. **Advanced Features:**
   - Test workflow automation
   - Test rules engine calculations
   - Test document verification

3. **UI/UX Improvements:**
   - Test on different screen sizes
   - Test dark mode (if implemented)
   - Test accessibility features

4. **Integration Testing:**
   - Test full loan lifecycle
   - Test multiple concurrent users
   - Test error recovery
