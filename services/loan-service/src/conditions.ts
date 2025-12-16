import type { LoanApplication, UnderwritingCondition, DocumentType } from "@loan-platform/shared-types";

/**
 * Automatically generate underwriting conditions for a loan in PreUnderwriting stage
 * These conditions will be automatically requested from the borrower
 */
export function generatePreUnderwritingConditions(loan: LoanApplication): UnderwritingCondition[] {
  const conditions: UnderwritingCondition[] = [];
  const now = new Date().toISOString();

  // Common conditions based on loan type and borrower profile
  if (loan.loanType === "Conventional") {
    // Income verification conditions
    if (loan.employment.status === "Employed" && loan.employment.incomeType === "W2") {
      conditions.push({
        id: `cond-${Date.now()}-1`,
        loanId: loan.id,
        type: "PriorToDoc",
        description: "Updated paystubs covering the most recent 30-day period",
        status: "Pending",
        requiredDocuments: ["PayStub"],
        createdAt: now,
      });
      
      conditions.push({
        id: `cond-${Date.now()}-2`,
        loanId: loan.id,
        type: "PriorToDoc",
        description: "W-2 forms for the last 2 years (or tax transcripts)",
        status: "Pending",
        requiredDocuments: ["W2", "TaxReturn"],
        createdAt: now,
      });
    }

    // Asset verification conditions
    conditions.push({
      id: `cond-${Date.now()}-3`,
      loanId: loan.id,
      type: "PriorToDoc",
      description: "Updated bank statements for the last 2 months showing sufficient funds for down payment and closing costs",
      status: "Pending",
      requiredDocuments: ["BankStatement"],
      createdAt: now,
    });

    // Property-related conditions
    if (loan.property.propertyType === "Condo" || loan.property.propertyType === "Townhouse") {
      conditions.push({
        id: `cond-${Date.now()}-4`,
        loanId: loan.id,
        type: "PriorToDoc",
        description: "HOA documents including bylaws, budget, and insurance certificate",
        status: "Pending",
        requiredDocuments: ["HOADocuments"],
        createdAt: now,
      });
    }

    // Employment verification (if not self-employed)
    if (loan.employment.status === "Employed") {
      conditions.push({
        id: `cond-${Date.now()}-5`,
        loanId: loan.id,
        type: "PriorToDoc",
        description: "Verification of Employment (VOE) - lender will contact employer directly",
        status: "Pending",
        requiredDocuments: ["EmploymentVerification"],
        createdAt: now,
      });
    }

    // Credit-related conditions (if DTI is high)
    if (loan.debtToIncomeRatio && loan.debtToIncomeRatio > 0.43) {
      conditions.push({
        id: `cond-${Date.now()}-6`,
        loanId: loan.id,
        type: "PriorToDoc",
        description: "Letter of Explanation (LOE) for credit inquiries and/or high debt-to-income ratio",
        status: "Pending",
        requiredDocuments: ["Other"],
        createdAt: now,
      });
    }
  }

  // Self-employed specific conditions
  if (loan.employment.status === "SelfEmployed" || loan.employment.status === "BusinessOwner") {
    conditions.push({
      id: `cond-${Date.now()}-7`,
      loanId: loan.id,
      type: "PriorToDoc",
      description: "Personal tax returns (1040s) for the last 2 years with all schedules",
      status: "Pending",
      requiredDocuments: ["TaxReturn"],
      createdAt: now,
    });

    conditions.push({
      id: `cond-${Date.now()}-8`,
      loanId: loan.id,
      type: "PriorToDoc",
      description: "Business tax returns for the last 2 years (Form 1120, 1120S, 1065, or Schedule C)",
      status: "Pending",
      requiredDocuments: ["BusinessTaxReturn"],
      createdAt: now,
    });

    conditions.push({
      id: `cond-${Date.now()}-9`,
      loanId: loan.id,
      type: "PriorToDoc",
      description: "Year-to-date profit & loss statement (current year income)",
      status: "Pending",
      requiredDocuments: ["ProfitLossStatement"],
      createdAt: now,
    });
  }

  // Property insurance
  conditions.push({
    id: `cond-${Date.now()}-10`,
    loanId: loan.id,
    type: "PriorToFunding",
    description: "Homeowner's insurance policy binder with lender listed as loss payee",
    status: "Pending",
    requiredDocuments: ["HomeownersInsurance"],
    createdAt: now,
  });

  return conditions;
}

/**
 * Check if a condition can be satisfied by uploaded documents
 */
export function checkConditionSatisfaction(
  condition: UnderwritingCondition,
  documents: LoanApplication["documents"]
): boolean {
  if (!condition.requiredDocuments || condition.requiredDocuments.length === 0) {
    return false;
  }

  // Check if any required document type has been uploaded and verified
  const uploadedTypes = new Set(documents.map(d => d.type));
  const verifiedTypes = new Set(
    documents.filter(d => d.verificationStatus === "Verified").map(d => d.type)
  );

  // Condition is satisfied if at least one required document type is verified
  return condition.requiredDocuments.some(docType => verifiedTypes.has(docType));
}

/**
 * Automatically request condition documents from borrower
 * This will be called by the workflow service
 */
export async function requestConditionDocuments(
  loan: LoanApplication,
  conditions: UnderwritingCondition[]
): Promise<void> {
  const pendingConditions = conditions.filter(c => c.status === "Pending");
  
  if (pendingConditions.length === 0) {
    return;
  }

  // Extract unique required documents from all conditions
  const requiredDocs = new Set<DocumentType>();
  pendingConditions.forEach(condition => {
    condition.requiredDocuments?.forEach(docType => requiredDocs.add(docType));
  });

  // In production, this would:
  // 1. Send email to borrower with condition checklist
  // 2. Send SMS notification
  // 3. Update borrower portal with condition requirements
  // 4. Set up automated reminders

  console.log(`[AUTOMATED] Requesting condition documents for loan ${loan.id}`);
  console.log(`[AUTOMATED] Pending conditions: ${pendingConditions.length}`);
  console.log(`[AUTOMATED] Required documents: ${Array.from(requiredDocs).join(", ")}`);
  console.log(`[AUTOMATED] Email would be sent to: ${loan.borrower.email}`);
  console.log(`[AUTOMATED] SMS would be sent to: ${loan.borrower.phone}`);
  
  // Log each condition
  pendingConditions.forEach((condition, index) => {
    console.log(`[AUTOMATED] Condition ${index + 1}: ${condition.description}`);
    console.log(`[AUTOMATED]   Required documents: ${condition.requiredDocuments?.join(", ") || "None"}`);
  });
}

