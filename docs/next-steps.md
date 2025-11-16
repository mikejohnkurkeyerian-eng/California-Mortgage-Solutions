# Next Steps - Loan Automation Platform

## 🎯 Immediate Priorities (Sprint 2)

### 1. **Workflow Service** ⚡ HIGH PRIORITY
**Why:** This is the core automation engine that moves loans through stages automatically.

**Tasks:**
- Create workflow service with Express API
- Implement state machine for loan stages (Draft → Submitted → PreUnderwriting → Underwriting → Conditional → ClearToClose)
- Auto-submit to underwriting when application is complete
- Handle underwriting conditions loop
- Auto-promote to ClearToClose when all conditions satisfied
- Integration with loan-service to update loan status

**Estimated Time:** 2-3 hours

### 2. **Broker Console Dashboard** ⚡ HIGH PRIORITY
**Why:** Brokers need to see and manage loans, especially those ready for sign-off.

**Tasks:**
- Create dashboard page with loan list
- Add filters (status, stage, borrower, date range)
- Show loan pipeline visualization
- Display loans ready for sign-off (ClearToClose stage)
- Add loan detail view
- Implement sign-off action

**Estimated Time:** 2-3 hours

### 3. **Loan Application Form** 📝 HIGH PRIORITY
**Why:** Borrowers need to fill out Form 1003 (loan application) before uploading documents.

**Tasks:**
- Create multi-step form wizard
- Personal information section
- Employment/income section
- Assets section
- Debts section
- Property information section
- Form validation
- Save draft functionality
- Submit to create loan application

**Estimated Time:** 3-4 hours

### 4. **Dynamic Document Checklist** 📋 MEDIUM PRIORITY
**Why:** Borrowers need to know exactly which documents to upload based on their profile.

**Tasks:**
- Create checklist component in borrower portal
- Use document-rules engine to determine required docs
- Show progress (X of Y documents uploaded)
- Mark documents as uploaded
- Highlight missing required documents
- Show applicable conditions (e.g., "Only if self-employed")

**Estimated Time:** 1-2 hours

## 🔄 Secondary Priorities (Sprint 3)

### 5. **Rules Service** 🧮 MEDIUM PRIORITY
**Why:** Need automated underwriting decision logic (DTI, LTV, credit score checks).

**Tasks:**
- Create rules service
- Implement DTI (Debt-to-Income) calculator
- Implement LTV (Loan-to-Value) calculator
- Credit score evaluation rules
- Underwriting decision engine
- Integration with workflow service

**Estimated Time:** 2-3 hours

### 6. **AI Document Processing** 🤖 MEDIUM PRIORITY
**Why:** Automatically classify documents and extract data to reduce manual work.

**Tasks:**
- Integrate document classification (AWS Textract or similar)
- Extract data from pay stubs, W-2s, bank statements
- Auto-populate loan application fields
- Document validation (expiration dates, amounts, etc.)
- Confidence scoring for extracted data

**Estimated Time:** 3-4 hours

### 7. **Database Integration** 💾 MEDIUM PRIORITY
**Why:** Replace in-memory stores with persistent storage for production readiness.

**Tasks:**
- Set up PostgreSQL database
- Create Prisma schema for loan applications, documents, borrowers
- Migrate loan-service to use database
- Migrate document-service to use database
- Add database migrations

**Estimated Time:** 2-3 hours

## 🔮 Future Enhancements (Sprint 4+)

### 8. **Integration Service**
- Credit bureau integration (Experian, Equifax, TransUnion)
- AUS (Automated Underwriting System) integration (DU/LP)
- VOE/VOA (Verification of Employment/Assets) providers
- Pricing engine integration

### 9. **Notification Service**
- Email notifications (application submitted, conditions added, approved)
- SMS notifications for urgent updates
- In-app notifications

### 10. **Auth Service**
- User authentication (JWT)
- Role-based access control (Borrower, Broker, Admin)
- Session management

### 11. **File Storage**
- Replace multer memory storage with S3
- Secure file access with signed URLs
- Document versioning

### 12. **Testing & Quality**
- Unit tests for services
- Integration tests for APIs
- E2E tests for frontend
- CI/CD pipeline

## 📊 Recommended Order

**Week 1:**
1. Workflow Service (automation core)
2. Loan Application Form (borrower intake)
3. Dynamic Document Checklist (user guidance)

**Week 2:**
4. Broker Console Dashboard (operations tool)
5. Rules Service (underwriting logic)
6. Database Integration (persistence)

**Week 3:**
7. AI Document Processing (intelligence)
8. Integration Service (external APIs)
9. Notification Service (communication)

## 🚀 Quick Start Commands

Once you're ready to continue:

```bash
# Install dependencies (if not done)
pnpm install

# Start services
pnpm --filter @loan-platform/loan-service start
pnpm --filter @loan-platform/document-service start

# Start frontend
pnpm --filter @loan-platform/borrower-portal dev
```

## 💡 Decision Point

**Which should we tackle first?**

**Option A:** Workflow Service (automation engine) - Enables automatic loan progression
**Option B:** Loan Application Form (borrower experience) - Complete the intake flow
**Option C:** Broker Console (operations) - Give brokers tools to manage loans

I recommend **Option A (Workflow Service)** because it's the core automation that makes the platform "automatic" - it will automatically move loans through stages, check conditions, and promote to ClearToClose when ready.

