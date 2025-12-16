// Loan Workflow Stages
export type LoanStage =
  | "Draft"
  | "Submitted"
  | "PreUnderwriting"
  | "Underwriting"
  | "SeniorUnderwriting"
  | "Conditional"
  | "ClearToClose"
  | "Closed";

// Document Types
export type DocumentType =
  | "PersonalIdentification"
  | "DriverLicense"
  | "SocialSecurityCard"
  | "Passport"
  | "PermanentResidentCard"
  | "PayStub"
  | "W2"
  | "TaxReturn"
  | "EmploymentVerification"
  | "BusinessTaxReturn"
  | "ProfitLossStatement"
  | "BusinessLicense"
  | "BankStatement"
  | "InvestmentStatement"
  | "RetirementStatement"
  | "GiftLetter"
  | "LoanStatement"
  | "CreditCardStatement"
  | "MortgageStatement"
  | "PurchaseAgreement"
  | "PropertyDisclosure"
  | "AppraisalReport"
  | "TitleReport"
  | "HomeownersInsurance"
  | "HOADocuments"
  | "FloodCertification"
  | "LoanApplication"
  | "CreditAuthorization"
  | "LoanEstimate"
  | "IntentToProceed"
  | "ClosingDisclosure"
  | "BorrowerCertification"
  | "IRSForm4506C"
  | "PromissoryNote"
  | "DeedOfTrust"
  | "EscrowDisclosure"
  | "SettlementStatement"
  | "Form1003"
  | "Other";

// Income Types
export type IncomeType = "W2" | "SelfEmployed" | "BusinessOwner" | "SocialSecurity" | "Pension" | "Rental" | "Other";

// Employment Status
export type EmploymentStatus = "Employed" | "SelfEmployed" | "BusinessOwner" | "Retired" | "Unemployed" | "Other";

// Loan Application Status
export type ApplicationStatus = "Draft" | "InProgress" | "Submitted" | "UnderReview" | "Approved" | "Rejected" | "Withdrawn" | "Processing" | "Underwriting" | "Submitted to Lender" | "Conditions Pending";

// Underwriting Decision
export type UnderwritingDecision = "Approved" | "Conditional" | "Suspended" | "Rejected" | "Pending";

// Borrower Profile
export interface BorrowerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  ssn?: string; // Encrypted in production
  createdAt: string;
  updatedAt: string;
}

// Address
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Employment Information
export interface EmploymentInfo {
  status: EmploymentStatus;
  employerName?: string;
  jobTitle?: string;
  startDate?: string;
  monthlyIncome?: number;
  incomeType: IncomeType;
  employerAddress?: Address;
  phone?: string;
}

// Asset Information
export interface Asset {
  id: string;
  type: "Checking" | "Savings" | "Investment" | "Retirement" | "Other";
  institution: string;
  accountNumber?: string; // Last 4 digits only in production
  currentBalance: number;
  statements?: string[]; // Document IDs
}

// Debt Information
export interface Debt {
  id: string;
  type: "AutoLoan" | "StudentLoan" | "PersonalLoan" | "CreditCard" | "Mortgage" | "Other";
  creditor: string;
  accountNumber?: string; // Last 4 digits only
  monthlyPayment: number;
  currentBalance: number;
  statements?: string[]; // Document IDs
}

// Property Information
export interface PropertyInfo {
  address: Address;
  propertyType: "SingleFamily" | "Condo" | "Townhouse" | "MultiFamily" | "Other";
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  propertyTaxes?: number; // Annual
  homeownersInsurance?: number; // Annual
  hoaDues?: number; // Monthly
  floodInsurance?: number; // Annual
  groundRent?: number; // Monthly
  leaseholdPayments?: number; // Monthly
  otherHousingExpenses?: number; // Monthly
  purchaseAgreementId?: string;
  appraisalReportId?: string;
  titleReportId?: string;
  homeownersInsuranceId?: string;
  hoaDocumentsId?: string;
  floodCertificationId?: string;
}

// Document Metadata
export interface DocumentMetadata {
  id: string;
  loanId: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string; // User ID
  storagePath: string; // S3 path or similar
  extractedData?: Record<string, unknown>; // AI-extracted data
  verificationStatus: "Pending" | "Verified" | "Rejected" | "NeedsReview";
  verifiedBy?: string;
  verifiedAt?: string;
}

// Loan Submission
export interface LoanSubmission {
  id: string;
  loanId: string;
  lenderId: string;
  lenderName: string;
  status: 'Submitted' | 'Received' | 'Underwriting' | 'Approved' | 'Rejected' | 'Counteroffer';
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  externalReferenceId?: string;
}

// Loan Application
export interface LoanApplication {
  id: string;
  borrowerId: string;
  loanOfficerId?: string;
  status: ApplicationStatus;
  stage: LoanStage;

  // Personal Information
  borrower: BorrowerProfile;
  coBorrower?: BorrowerProfile;

  // Property
  property: PropertyInfo;

  // Financial Information
  employment: EmploymentInfo;
  coBorrowerEmployment?: EmploymentInfo;
  assets: Asset[];
  debts: Debt[];

  // Documents
  documents: DocumentMetadata[];

  // Loan Details
  loanType: "Conventional" | "FHA" | "VA" | "USDA" | "Other";
  loanPurpose: "Purchase" | "Refinance" | "CashOut";
  interestRate?: number;
  loanTerm: number; // Months

  // Calculated Fields
  debtToIncomeRatio?: number;
  loanToValueRatio?: number;
  monthlyMortgageInsurance?: number;

  // Underwriting
  underwritingDecision?: UnderwritingDecision;
  underwritingConditions?: UnderwritingCondition[];
  underwritingNotes?: string;

  // Submissions
  submissions?: LoanSubmission[];

  // Transaction Details
  transactionDetails?: TransactionDetails;

  // Metadata
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  closedAt?: string;
  full1003?: Record<string, any>;
}

// Transaction Details
export interface TransactionDetails {
  alterationsImprovements?: number;
  land?: number;
  refinanceDebts?: number;
  prepaidItems?: number;
  closingCosts?: number;
  pmiMipFundingFee?: number;
  borrowerClosingCosts?: number;
  sellerCredits?: number;
  otherCredits?: number;
}

// Underwriting Condition
export interface UnderwritingCondition {
  id: string;
  loanId: string;
  type: "PriorToDoc" | "PriorToFunding" | "PriorToClosing";
  description: string;
  status: "Pending" | "Satisfied" | "Waived";
  requiredDocuments?: DocumentType[];
  satisfiedAt?: string;
  satisfiedBy?: string;
  waivedAt?: string;
  waivedBy?: string;
  createdAt: string;
}

// Document Checklist Item
export interface DocumentChecklistItem {
  documentType: DocumentType;
  required: boolean;
  applicable: boolean; // Based on borrower profile
  uploaded: boolean;
  documentId?: string;
  notes?: string;
}

// Workflow Event
export interface WorkflowEvent {
  id: string;
  loanId: string;
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Note: All interfaces are already exported when defined above
// This export block is for any additional type-only exports if needed

// Export document rules
export * from "./document-rules";

// --- Secure AUS Integration Types ---

// AUS Submission Record
export interface AUSSubmission {
  id: string;
  loanId: string;
  provider: 'FannieMae' | 'FreddieMac' | 'Other';
  mode: 'Real' | 'Simulated';
  status: 'Pending' | 'Processing' | 'Completed' | 'Error';
  submittedAt: string;
  completedAt?: string;
  recommendation?: string; // Approve/Eligible, Refer, etc.
  casefileId?: string;
  findings?: AUSFinding[];
  logs?: SecurityLog[];
}

// AUS Finding
export interface AUSFinding {
  code: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Fatal';
  message: string;
  category?: string;
}

// Security Audit Log
export interface SecurityLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURE';
  action: string;
  details: string;
  metadata?: Record<string, any>;
}

// Fannie Mae Configuration (Encrypted Storage)
export interface FannieMaeConfig {
  clientId: string; // Plaintext (Public)
  encryptedClientSecret: string; // Ciphertext
  iv: string; // Initialization Vector
  isEnabled: boolean;
  updatedAt: string;
}
