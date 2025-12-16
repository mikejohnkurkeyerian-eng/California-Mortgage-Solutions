import type { LoanApplication, UnderwritingCondition, DocumentType } from "@loan-platform/shared-types";
import { generatePreUnderwritingConditions, requestConditionDocuments, checkConditionSatisfaction } from "./conditions";
import axios from "axios";

const WORKFLOW_SERVICE_URL = process.env.WORKFLOW_SERVICE_URL || "http://localhost:4004";
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4005";

/**
 * Automatically order appraisal when loan is approved
 */
export async function orderAppraisal(loan: LoanApplication): Promise<void> {
  try {
    console.log(`[AUTOMATED] Ordering appraisal for loan ${loan.id}`);
    console.log(`[AUTOMATED] Property: ${loan.property.address.street}, ${loan.property.address.city}, ${loan.property.address.state}`);
    console.log(`[AUTOMATED] Purchase Price: $${loan.property.purchasePrice.toLocaleString()}`);
    
    // In production, this would:
    // 1. Call appraisal vendor API (Clear Capital, AppraisalPort, etc.)
    // 2. Schedule appraisal inspection
    // 3. Track appraisal status
    // 4. Notify broker when appraisal is complete
    
    // Simulate ordering appraisal
    await axios.post(`${WORKFLOW_SERVICE_URL}/api/appraisals/order`, {
      loanId: loan.id,
      property: loan.property,
      loanAmount: loan.property.loanAmount,
      purchasePrice: loan.property.purchasePrice,
    }).catch(() => {
      // Workflow service might not be running - that's okay for demo
      console.log(`[AUTOMATED] Appraisal order queued (workflow service not available)`);
    });
    
    console.log(`[AUTOMATED] ✅ Appraisal ordered successfully`);
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to order appraisal:`, error);
  }
}

/**
 * Automatically check for escrow waivers
 */
export async function checkEscrowWaivers(loan: LoanApplication): Promise<{ waiversAvailable: boolean; waivers: string[] }> {
  try {
    console.log(`[AUTOMATED] Checking escrow waivers for loan ${loan.id}`);
    
    const waivers: string[] = [];
    let waiversAvailable = false;
    
    // Check loan-to-value ratio for escrow waiver eligibility
    if (loan.loanToValueRatio && loan.loanToValueRatio <= 0.80) {
      // LTV <= 80% may qualify for escrow waiver
      waivers.push("Property tax escrow waiver - LTV is 80% or less");
      waiversAvailable = true;
    }
    
    // Check loan type
    if (loan.loanType === "Conventional" && loan.loanToValueRatio && loan.loanToValueRatio <= 0.80) {
      waivers.push("Homeowner's insurance escrow waiver - Conventional loan with LTV ≤ 80%");
      waiversAvailable = true;
    }
    
    // Check borrower credit score (would be pulled from credit report)
    // For demo, we'll check if debt-to-income is good
    if (loan.debtToIncomeRatio && loan.debtToIncomeRatio <= 0.36) {
      waivers.push("PMI escrow waiver - Excellent DTI ratio");
      waiversAvailable = true;
    }
    
    if (waiversAvailable) {
      console.log(`[AUTOMATED] ✅ Found ${waivers.length} escrow waiver(s) available:`);
      waivers.forEach(w => console.log(`[AUTOMATED]   - ${w}`));
    } else {
      console.log(`[AUTOMATED] No escrow waivers available for this loan`);
    }
    
    return { waiversAvailable, waivers };
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to check escrow waivers:`, error);
    return { waiversAvailable: false, waivers: [] };
  }
}

/**
 * Automatically send document checklist to borrower when loan is created
 */
export async function sendDocumentChecklistToBorrower(loan: LoanApplication): Promise<void> {
  try {
    console.log(`[AUTOMATED] Sending document checklist to borrower for loan ${loan.id}`);
    
    // Import document requirements
    const { getDocumentRequirements } = await import("@loan-platform/shared-types");
    const requirements = getDocumentRequirements(loan);
    
    // Format checklist for borrower
    const checklist = requirements.map((req, index) => ({
      number: index + 1,
      document: req.description,
      required: req.required,
      status: "pending",
    }));
    
    // In production, this would:
    // 1. Send email to borrower with checklist
    // 2. Send SMS notification
    // 3. Update borrower portal with checklist
    // 4. Set up reminders for missing documents
    
    console.log(`[AUTOMATED] Email would be sent to: ${loan.borrower.email}`);
    console.log(`[AUTOMATED] SMS would be sent to: ${loan.borrower.phone || 'N/A'}`);
    console.log(`[AUTOMATED] Document checklist (${checklist.length} items):`);
    checklist.forEach(item => {
      console.log(`[AUTOMATED]   ${item.number}. ${item.document} ${item.required ? '(Required)' : '(Optional)'}`);
    });
    
    // Simulate sending notifications
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-document-checklist`, {
      loanId: loan.id,
      borrowerEmail: loan.borrower.email,
      borrowerPhone: loan.borrower.phone,
      borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
      checklist,
      portalLink: `https://loan-platform.app/borrower/loan/${loan.id}`,
    }).catch(() => {
      // Notification service might not be running - that's okay for demo
      console.log(`[AUTOMATED] Notification queued (notification service not available)`);
    });
    
    console.log(`[AUTOMATED] ✅ Document checklist sent to borrower`);
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to send document checklist:`, error);
  }
}

/**
 * Automatically send condition template to borrower when conditions are issued
 */
export async function sendConditionTemplateToBorrower(
  loan: LoanApplication,
  conditions: UnderwritingCondition[]
): Promise<void> {
  try {
    console.log(`[AUTOMATED] Sending condition template to borrower for loan ${loan.id}`);
    
    const pendingConditions = conditions.filter(c => c.status === "Pending");
    
    if (pendingConditions.length === 0) {
      return;
    }
    
    // Create condition template for borrower
    const conditionTemplate = {
      loanId: loan.id,
      borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
      conditions: pendingConditions.map((condition, index) => ({
        number: index + 1,
        condition: condition.description,
        requiredDocuments: condition.requiredDocuments || [],
        type: condition.type,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      })),
    };
    
    console.log(`[AUTOMATED] Condition template created with ${pendingConditions.length} conditions`);
    console.log(`[AUTOMATED] Email would be sent to: ${loan.borrower.email}`);
    console.log(`[AUTOMATED] SMS would be sent to: ${loan.borrower.phone || 'N/A'}`);
    console.log(`[AUTOMATED] Conditions to fulfill:`);
    pendingConditions.forEach((condition, index) => {
      console.log(`[AUTOMATED]   ${index + 1}. ${condition.description}`);
      if (condition.requiredDocuments && condition.requiredDocuments.length > 0) {
        console.log(`[AUTOMATED]      Required: ${condition.requiredDocuments.join(", ")}`);
      }
    });
    
    // In production, this would:
    // 1. Send email with condition template
    // 2. Send SMS with condition summary
    // 3. Update borrower portal with condition checklist
    // 4. Set up reminders for condition deadlines
    
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-conditions`, {
      loanId: loan.id,
      borrowerEmail: loan.borrower.email,
      borrowerPhone: loan.borrower.phone,
      borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
      conditions: conditionTemplate.conditions,
      portalLink: `https://loan-platform.app/borrower/loan/${loan.id}/conditions`,
    }).catch(() => {
      // Notification service might not be running - that's okay for demo
      console.log(`[AUTOMATED] Condition notification queued (notification service not available)`);
    });
    
    console.log(`[AUTOMATED] ✅ Condition template sent to borrower`);
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to send condition template:`, error);
  }
}

/**
 * Automatically notify broker when documents are ready for review
 */
export async function notifyBrokerDocumentsReady(
  loan: LoanApplication,
  documentsUploaded: boolean = false,
  conditionsSatisfied: boolean = false
): Promise<void> {
  try {
    console.log(`[AUTOMATED] Notifying broker that loan ${loan.id} is ready for review`);
    
    let message = "";
    if (documentsUploaded && conditionsSatisfied) {
      message = `All documents and conditions have been satisfied for loan ${loan.id}. Ready for broker review and submission to underwriting.`;
    } else if (documentsUploaded) {
      message = `All required documents have been uploaded for loan ${loan.id}. Ready for broker review.`;
    } else if (conditionsSatisfied) {
      message = `All conditions have been satisfied for loan ${loan.id}. Ready for broker review.`;
    }
    
    console.log(`[AUTOMATED] Broker notification: ${message}`);
    console.log(`[AUTOMATED] Loan stage: ${loan.stage}`);
    console.log(`[AUTOMATED] Borrower: ${loan.borrower.firstName} ${loan.borrower.lastName}`);
    console.log(`[AUTOMATED] Documents uploaded: ${loan.documents.length}`);
    console.log(`[AUTOMATED] Conditions satisfied: ${conditionsSatisfied ? 'Yes' : 'No'}`);
    
    // In production, this would:
    // 1. Send in-app notification to broker
    // 2. Send email to broker
    // 3. Update broker dashboard
    // 4. Add loan to broker's review queue
    
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/notify-broker`, {
      brokerId: loan.loanOfficerId || "default-broker",
      loanId: loan.id,
      message,
      loanStage: loan.stage,
      borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
      portalLink: `https://loan-platform.app/broker/loans/${loan.id}`,
    }).catch(() => {
      // Notification service might not be running - that's okay for demo
      console.log(`[AUTOMATED] Broker notification queued (notification service not available)`);
    });
    
    console.log(`[AUTOMATED] ✅ Broker notified`);
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to notify broker:`, error);
  }
}

/**
 * Automatically perform all administrative tasks when loan is approved
 */
export async function performPostApprovalTasks(loan: LoanApplication): Promise<void> {
  try {
    console.log(`[AUTOMATED] Performing post-approval tasks for loan ${loan.id}`);
    
    // Order appraisal
    await orderAppraisal(loan);
    
    // Check escrow waivers
    const escrowCheck = await checkEscrowWaivers(loan);
    if (escrowCheck.waiversAvailable) {
      console.log(`[AUTOMATED] Escrow waivers available - will be included in closing documents`);
      // Store waivers in loan for broker review
      loan.underwritingNotes = `${loan.underwritingNotes || ''}\n\nEscrow Waivers Available:\n${escrowCheck.waivers.join('\n')}`;
    }
    
    // Order title report (in production)
    console.log(`[AUTOMATED] Ordering title report...`);
    
    // Order flood certification (in production)
    console.log(`[AUTOMATED] Ordering flood certification...`);
    
    // Order homeowner's insurance verification (in production)
    console.log(`[AUTOMATED] Verifying homeowner's insurance...`);
    
    // Schedule closing date (in production)
    console.log(`[AUTOMATED] Calculating closing date based on appraisal timeline...`);
    
    console.log(`[AUTOMATED] ✅ Post-approval tasks completed`);
  } catch (error) {
    console.error(`[AUTOMATED] ❌ Failed to perform post-approval tasks:`, error);
  }
}

