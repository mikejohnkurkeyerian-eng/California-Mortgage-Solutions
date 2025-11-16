// Document requirement rules based on borrower profile
import type { DocumentType, EmploymentStatus, IncomeType, LoanApplication } from "./index";

export interface DocumentRequirement {
  documentType: DocumentType;
  required: boolean;
  applicableConditions: (app: LoanApplication) => boolean;
  description: string;
}

// Personal Identification - Always required
const personalIdRequirement: DocumentRequirement = {
  documentType: "DriverLicense",
  required: true,
  applicableConditions: () => true,
  description: "Driver's license or state-issued ID",
};

// Employment & Income Documents
const getEmploymentDocuments = (
  employmentStatus: EmploymentStatus,
  incomeType: IncomeType
): DocumentRequirement[] => {
  const requirements: DocumentRequirement[] = [];

  if (employmentStatus === "Employed" && incomeType === "W2") {
    requirements.push(
      {
        documentType: "PayStub",
        required: true,
        applicableConditions: () => true,
        description: "Most recent 30 days of pay stubs (lender will verify employment)",
      },
      {
        documentType: "W2",
        required: true,
        applicableConditions: () => true,
        description: "W-2 forms for the last 2 years (lender will pull tax transcripts with your authorization)",
      }
      // Tax returns optional - lender can pull transcripts via 4506-C
      // Employment verification optional - lender can do VOE (Verification of Employment)
    );
  }

  if (employmentStatus === "SelfEmployed" || employmentStatus === "BusinessOwner") {
    requirements.push(
      {
        documentType: "TaxReturn",
        required: true,
        applicableConditions: () => true,
        description: "Personal tax returns (1040s) for the last 2 years with all schedules",
      },
      {
        documentType: "BusinessTaxReturn",
        required: true,
        applicableConditions: () => true,
        description: "Business tax returns for the last 2 years (Form 1120, 1120S, 1065, or Schedule C)",
      },
      {
        documentType: "ProfitLossStatement",
        required: true,
        applicableConditions: () => true,
        description: "Year-to-date profit & loss statement (current year income)",
      }
      // Business license optional - only if required by loan type
      // Business bank statements optional - personal bank statements usually sufficient
    );
  }

  if (employmentStatus === "Retired") {
    requirements.push(
      {
        documentType: "TaxReturn",
        required: true,
        applicableConditions: () => true,
        description: "Tax returns (1040s) for the last 2 years showing retirement income",
      },
      {
        documentType: "Other",
        required: true,
        applicableConditions: () => true,
        description: "Social Security Award Letter showing monthly benefit amount",
      },
      {
        documentType: "Other",
        required: false,
        applicableConditions: () => true,
        description: "Pension statements showing monthly pension payments",
      },
      {
        documentType: "RetirementStatement",
        required: false,
        applicableConditions: () => true,
        description: "Retirement account statements (401(k), IRA, 403(b)) if using retirement funds",
      }
    );
  }

  return requirements;
};

// Assets & Funds Verification
const assetDocuments: DocumentRequirement[] = [
  {
    documentType: "BankStatement",
    required: true,
    applicableConditions: () => true,
    description: "Bank statements for the last 2 months (checking, savings) - showing account balances",
  }
  // Investment and retirement statements optional - only if using those funds for down payment or reserves
  // Gift letter only if using gift funds (handled separately)
];

// Debt & Credit Information
// Note: Credit reports are pulled by lender, debt statements only needed if credit report doesn't show them
const debtDocuments: DocumentRequirement[] = [
  // Debt statements optional - lender pulls credit report which shows most debts
  // Only request if credit report is incomplete or shows discrepancies
];

// Property Documents
const propertyDocuments: DocumentRequirement[] = [
  {
    documentType: "PurchaseAgreement",
    required: true,
    applicableConditions: (app) => app.loanPurpose === "Purchase",
    description: "Purchase agreement (signed contract)",
  },
  {
    documentType: "HomeownersInsurance",
    required: true,
    applicableConditions: () => true,
    description: "Homeowner's insurance quote (get from your insurance agent)",
  },
  {
    documentType: "HOADocuments",
    required: false,
    applicableConditions: (app) => app.property.propertyType === "Condo" || app.property.propertyType === "Townhouse",
    description: "HOA documents (if condo/townhouse - lender can also obtain)",
  }
  // Appraisal - lender orders
  // Title report - lender orders
  // Flood certification - lender obtains
  // Property disclosure - optional, usually provided by seller
];

// Loan-Specific Forms (Always required)
// Note: All loan forms are generated and signed electronically by lender
// No physical documents required from borrower for loan forms
const loanForms: DocumentRequirement[] = [
  // Loan application - completed online (Form 1003)
  // Credit authorization - signed electronically
  // Loan Estimate - lender generates and provides
  // Intent to Proceed - signed electronically
  // Borrower certification - signed electronically
  // IRS Form 4506-C - signed electronically as part of loan package
];

// Loan type specific requirements
const getLoanTypeDocuments = (loanType: string): DocumentRequirement[] => {
  const requirements: DocumentRequirement[] = [];

  if (loanType === "VA") {
    // VA loans require borrower to provide COE and military service proof
    requirements.push({
      documentType: "Other",
      required: true,
      applicableConditions: () => true,
      description: "Certificate of Eligibility (COE) and DD-214 or Statement of Service",
    });
  }

  // FHA Case Number - lender assigns
  // FHA Appraisal - lender orders
  // USDA Eligibility - lender verifies property location
  // These are handled by lender, not borrower

  return requirements;
};

// Get all applicable document requirements for a loan application
export function getDocumentRequirements(app: LoanApplication): DocumentRequirement[] {
  const requirements: DocumentRequirement[] = [];

  // Always required
  requirements.push(personalIdRequirement);

  // Employment documents based on status
  const employmentDocs = getEmploymentDocuments(app.employment.status, app.employment.incomeType);
  requirements.push(...employmentDocs);

  // Loan type specific documents
  const loanTypeDocs = getLoanTypeDocuments(app.loanType);
  requirements.push(...loanTypeDocs);

  // Assets
  requirements.push(...assetDocuments);

  // Debts
  requirements.push(...debtDocuments);

  // Property documents
  requirements.push(...propertyDocuments);

  // Loan forms
  requirements.push(...loanForms);

  // Filter to only applicable ones
  return requirements.filter((req) => {
    if (!req.required && !req.applicableConditions(app)) {
      return false;
    }
    return true;
  });
}

// Check if all required documents are uploaded
export function checkDocumentCompleteness(
  app: LoanApplication,
  requirements: DocumentRequirement[]
): { complete: boolean; missing: DocumentRequirement[] } {
  const uploadedTypes = new Set(app.documents.map((d) => d.type));
  const missing = requirements.filter(
    (req) => req.required && !uploadedTypes.has(req.documentType)
  );

  return {
    complete: missing.length === 0,
    missing,
  };
}

