import { DocumentType } from './document-ai';

export type InsightSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
export type InsightCategory = 'INCOME' | 'ASSET' | 'LIABILITY' | 'PROPERTY' | 'COMPLIANCE';

export interface BrokerInsight {
    category: InsightCategory;
    severity: InsightSeverity;
    title: string;
    message: string;
    actionItem?: string;
    triggeredRequirements?: { type: DocumentType, name: string }[];
}

export class BrokerIntelligenceService {

    /**
     * Main entry point for analyzing document content with "Broker Brain" logic.
     */
    static analyzeDocument(text: string, type: string, extractedData?: any): BrokerInsight[] {
        const insights: BrokerInsight[] = [];
        const lowerText = text.toLowerCase();

        // Module 1: Income Analysis
        if (type === 'TAX_RETURN') {
            insights.push(...this.analyzeTaxReturn(lowerText));
        } else if (type === 'W2') {
            insights.push(...this.analyzeW2(lowerText));
        } else if (type === 'PAY_STUB') {
            insights.push(...this.analyzePayStub(lowerText, extractedData));
        } else if (type === 'FORM_1099') {
            insights.push(...this.analyze1099(lowerText));
        } else if (type === 'BANK_STATEMENT') {
            insights.push(...this.analyzeBankStatement(lowerText, extractedData));
        } else if (type === 'ASSET_STATEMENT') {
            insights.push(...this.analyzeAssetStatement(lowerText));
        } else if (type === 'DIVORCE_DECREE') {
            insights.push(...this.analyzeDivorceDecree(lowerText));
        } else if (type === 'BANKRUPTCY_DISCHARGE') {
            insights.push(...this.analyzeBankruptcyDischarge(lowerText));
        } else if (type === 'APPRAISAL') {
            insights.push(...this.analyzeAppraisal(lowerText));
        } else if (type === 'TITLE_COMMITMENT') {
            insights.push(...this.analyzeTitleCommitment(lowerText));
        } else if (type === 'LOAN_ESTIMATE') {
            insights.push(...this.analyzeLoanEstimate(lowerText));
        } else if (type === 'CLOSING_DISCLOSURE') {
            insights.push(...this.analyzeClosingDisclosure(lowerText));
        }

        return insights;
    }

    // ==========================================
    // MODULE 1: INCOME ANALYSIS
    // ==========================================

    private static analyzeTaxReturn(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Self-Employment (Schedule C)
        if (text.includes('schedule c') || text.includes('profit or loss from business')) {
            insights.push({
                category: 'INCOME',
                severity: 'INFO',
                title: 'Self-Employment Income (Schedule C)',
                message: 'Borrower has self-employment income. Qualifying income will be based on Net Profit + Depreciation + Depletion.',
                actionItem: 'Request last 2 years of 1040s to average income.',
                triggeredRequirements: [
                    { type: 'BUSINESS_LICENSE', name: 'Business License' },
                    { type: 'BUSINESS_TAX_RETURN', name: 'Business Tax Returns (Last 2 Years)' }
                ]
            });

            if (text.includes('net loss') || text.includes('business loss')) {
                insights.push({
                    category: 'INCOME',
                    severity: 'WARNING',
                    title: 'Business Loss Detected',
                    message: 'Schedule C shows a net loss. This must be deducted from other qualifying income.',
                    actionItem: 'Verify business solvency and check for recurring losses.'
                });
            }
        }

        // 2. K-1 Income (Partnerships/S-Corps)
        if (text.includes('schedule k-1') || text.includes('1065') || text.includes('1120s')) {
            insights.push({
                category: 'INCOME',
                severity: 'INFO',
                title: 'Business Ownership (K-1)',
                message: 'Borrower is a partner or shareholder. Income verification requires K-1s and potentially full business returns.',
                actionItem: 'Check K-1 for "Guaranteed Payments" and "Distributions".',
                triggeredRequirements: [
                    { type: 'BUSINESS_TAX_RETURN', name: 'Business Tax Returns (1065/1120S)' }
                ]
            });
        }

        // 3. Rental Income (Schedule E)
        if (text.includes('schedule e') || text.includes('supplemental income and loss')) {
            insights.push({
                category: 'INCOME',
                severity: 'INFO',
                title: 'Rental Income (Schedule E)',
                message: 'Rental properties detected. Ensure lease agreements are current.',
                actionItem: 'Calculate net rental income using (Gross Rents - Expenses) + Depreciation.',
                triggeredRequirements: [
                    { type: 'LEASE_AGREEMENT', name: 'Lease Agreements (Current)' },
                    { type: 'INSURANCE_POLICY', name: 'Hazard Insurance (Rental Properties)' },
                    { type: 'MORTGAGE_STATEMENT', name: 'Mortgage Statements (Rentals)' },
                    { type: 'HOA_STATEMENT', name: 'HOA Statements (Rentals)' }
                ]
            });
        }

        return insights;
    }

    private static analyzeW2(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Statutory Employee
        if (text.includes('statutory employee') || text.includes('box 13 checked')) {
            insights.push({
                category: 'INCOME',
                severity: 'WARNING',
                title: 'Statutory Employee Status',
                message: 'Borrower is a Statutory Employee. Commission income must be treated as self-employment.',
                actionItem: 'Request Schedule C to deduct unreimbursed business expenses (Form 2106).',
                triggeredRequirements: [
                    { type: 'TAX_RETURN', name: 'Tax Returns (Schedule C)' }
                ]
            });
        }

        return insights;
    }

    private static analyzePayStub(text: string, extractedData?: any): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 0. Date Validation (30 Days)
        if (extractedData?.documentDate) {
            const docDate = new Date(extractedData.documentDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - docDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 30) {
                insights.push({
                    category: 'COMPLIANCE',
                    severity: 'CRITICAL',
                    title: 'Pay Stub Expired',
                    message: `Pay stub is ${diffDays} days old. Fannie/Freddie guidelines require pay stubs to be dated within 30 days of the application date.`,
                    actionItem: 'Obtain a current pay stub.'
                });
            }
        }

        // 1. Overtime Income
        if (text.includes('overtime') || text.includes('ot hours')) {
            insights.push({
                category: 'INCOME',
                severity: 'WARNING',
                title: 'Overtime Income Detected',
                message: 'Overtime income is variable. It can only be used if received for 2+ years and is likely to continue.',
                actionItem: 'Calculate 24-month average of overtime pay.'
            });
        }

        // 2. Commission/Bonus
        if (text.includes('commission') || text.includes('bonus')) {
            insights.push({
                category: 'INCOME',
                severity: 'WARNING',
                title: 'Commission/Bonus Income',
                message: 'Variable income detected. Requires 2-year history to average.',
                actionItem: 'Obtain Year-End Pay Stubs for last 2 years to calculate average.'
            });
        }

        // 3. Garnishments/Deductions
        if (text.includes('garnishment') || text.includes('child support') || text.includes('alimony') || text.includes('levy')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'CRITICAL',
                title: 'Income Garnishment/Deduction',
                message: 'Pay stub shows an involuntary deduction (Garnishment/Child Support). This MUST be included in DTI ratios.',
                actionItem: 'Obtain court order or documentation for the deduction terms.',
                triggeredRequirements: [
                    { type: 'LETTER_OF_EXPLANATION', name: 'Letter of Explanation (Garnishment)' },
                    { type: 'DIVORCE_DECREE', name: 'Court Order / Child Support Docs' }
                ]
            });
        }

        // 4. 401k Loan Repayment
        if (text.includes('401k loan') || text.includes('loan repayment')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'INFO',
                title: '401k Loan Repayment',
                message: 'Deduction for 401k loan detected. This is generally NOT included in DTI, but reduces net cash flow.',
            });
        }

        return insights;
    }

    private static analyze1099(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Non-Employee Compensation
        if (text.includes('nonemployee compensation') || text.includes('1099-nec')) {
            insights.push({
                category: 'INCOME',
                severity: 'INFO',
                title: 'Contractor Income (1099)',
                message: 'Borrower is an Independent Contractor. Income is considered Self-Employment.',
                actionItem: 'Analyze Schedule C for expenses to determine net qualifying income.',
                triggeredRequirements: [
                    { type: 'TAX_RETURN', name: 'Tax Returns (Schedule C)' }
                ]
            });
        }

        return insights;
    }

    // ==========================================
    // MODULE 2: ASSET ANALYSIS
    // ==========================================

    private static analyzeBankStatement(text: string, extractedData?: any): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 0. Date Validation (60 Days)
        if (extractedData?.documentDate) {
            const docDate = new Date(extractedData.documentDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - docDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 60) {
                insights.push({
                    category: 'COMPLIANCE',
                    severity: 'CRITICAL',
                    title: 'Bank Statement Expired',
                    message: `Bank statement is ${diffDays} days old. Guidelines require asset documents to be within 60 days.`,
                    actionItem: 'Obtain the most recent bank statement.'
                });
            }
        }

        // 1. NSF/Overdrafts
        if (text.includes('nsf') || text.includes('insufficient funds') || text.includes('overdraft fee')) {
            insights.push({
                category: 'ASSET',
                severity: 'CRITICAL',
                title: 'NSF/Overdraft Detected',
                message: 'Bank statement shows Non-Sufficient Funds (NSF) or Overdraft fees. This is a major underwriting red flag.',
                actionItem: 'Obtain Letter of Explanation (LOE) for each occurrence.',
                triggeredRequirements: [
                    { type: 'LETTER_OF_EXPLANATION', name: 'Letter of Explanation (NSF)' }
                ]
            });
        }

        // 2. Large Deposits
        if (text.includes('wire transfer') || text.includes('large deposit') || text.includes('deposit') && text.includes('000.00')) {
            // Heuristic: Flagging "Deposit" with "000.00" as a potential large round number deposit for demo purposes
            // In a real system, we'd parse the actual amounts.
            insights.push({
                category: 'ASSET',
                severity: 'WARNING',
                title: 'Large Deposit / Wire',
                message: 'Potential large deposit or wire transfer detected. Deposits > 50% of income must be sourced.',
                actionItem: 'Source funds: Provide copy of check, wire receipt, or gift letter.',
                triggeredRequirements: [
                    { type: 'LETTER_OF_EXPLANATION', name: 'Letter of Explanation (Large Deposit)' }
                ]
            });
        }

        // 3. Undisclosed Debt Indicators
        if (text.includes('american express') || text.includes('discover') || text.includes('affirm') || text.includes('klarna')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'WARNING',
                title: 'Potential Undisclosed Debt',
                message: 'Recurring payments to creditors (Amex, Discover, BNPL) detected. Ensure these are on the application.',
                actionItem: 'Verify debt is included in DTI calculation.'
            });
        }

        return insights;
    }

    private static analyzeAssetStatement(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Retirement Account Liquidation
        if (text.includes('401k') || text.includes('ira') || text.includes('retirement')) {
            insights.push({
                category: 'ASSET',
                severity: 'INFO',
                title: 'Retirement Assets (60% Rule)',
                message: 'Retirement accounts are being used for reserves. Only 60% of the vested balance can typically be used.',
                actionItem: 'Calculate usable reserves: Vested Balance * 0.60'
            });
        }

        // 2. Loans against Assets
        if (text.includes('loan balance') || text.includes('outstanding loan')) {
            insights.push({
                category: 'ASSET',
                severity: 'WARNING',
                title: 'Loan Against Asset',
                message: 'There is an outstanding loan against this asset. The loan amount must be deducted from the asset value.',
                actionItem: 'Deduct loan balance from usable assets.'
            });
        }

        return insights;
    }

    // ==========================================
    // MODULE 3: LIABILITY & CREDIT ANALYSIS
    // ==========================================

    private static analyzeDivorceDecree(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Alimony/Spousal Support
        if (text.includes('alimony') || text.includes('spousal support')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'WARNING',
                title: 'Alimony Obligation',
                message: 'Divorce decree mentions Alimony/Spousal Support. Verify if this is an ongoing obligation that affects DTI.',
                actionItem: 'Confirm payment amount and duration.'
            });
        }

        // 2. Child Support
        if (text.includes('child support')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'WARNING',
                title: 'Child Support Obligation',
                message: 'Child Support detected. This must be included in the DTI calculation as a monthly liability.',
                actionItem: 'Verify monthly amount and children ages.'
            });
        }

        // 3. Property Settlement
        if (text.includes('awarded to') || text.includes('sole and separate')) {
            insights.push({
                category: 'PROPERTY',
                severity: 'INFO',
                title: 'Property Settlement',
                message: 'Decree outlines property division. Ensure subject property title matches the award.',
                actionItem: 'Cross-reference with Title Commitment.'
            });
        }

        return insights;
    }

    private static analyzeBankruptcyDischarge(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Discharge Verification
        if (text.includes('discharged') || text.includes('order of discharge')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'INFO',
                title: 'Bankruptcy Discharged',
                message: 'Bankruptcy discharge confirmed. Verify seasoning period (time since discharge) meets loan program guidelines.',
                actionItem: 'Check Discharge Date against application date (e.g. 2 years for FHA, 4 for Conv).'
            });
        }

        // 2. Dismissal Check
        if (text.includes('dismissed') && !text.includes('discharged')) {
            insights.push({
                category: 'LIABILITY',
                severity: 'CRITICAL',
                title: 'Bankruptcy Dismissed',
                message: 'Bankruptcy appears to be DISMISSED, not Discharged. This means debts may still be owed.',
                actionItem: 'Verify status of all debts included in the petition.'
            });
        }

        return insights;
    }

    // ==========================================
    // MODULE 4: PROPERTY & TITLE ANALYSIS
    // ==========================================

    private static analyzeAppraisal(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Condition Ratings
        if (text.includes('c5') || text.includes('c6')) {
            insights.push({
                category: 'PROPERTY',
                severity: 'CRITICAL',
                title: 'Poor Property Condition (C5/C6)',
                message: 'Appraisal indicates property is in C5 or C6 condition. Most loan programs require C4 or better.',
                actionItem: 'Property repairs required prior to closing.'
            });
        }

        // 2. Value Check
        if (text.includes('appraised value') && text.includes('purchase price')) {
            // Heuristic: In a real system we would compare the numbers.
            // For now, we just flag that we found both.
            insights.push({
                category: 'PROPERTY',
                severity: 'INFO',
                title: 'Appraisal Value Check',
                message: 'Appraised Value and Purchase Price detected. Ensure LTV is calculated on the LOWER of the two.',
            });
        }

        return insights;
    }

    private static analyzeTitleCommitment(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Tax Liens / Judgments
        if (text.includes('tax lien') || text.includes('judgment') || text.includes('lis pendens')) {
            insights.push({
                category: 'PROPERTY',
                severity: 'CRITICAL',
                title: 'Title Cloud Detected',
                message: 'Title commitment shows a Lien or Judgment. This must be paid off or cleared before closing.',
                actionItem: 'Obtain payoff statement or release of lien.'
            });
        }

        // 2. Gap Coverage
        if (text.includes('gap coverage') || text.includes('gap endorsement')) {
            insights.push({
                category: 'PROPERTY',
                severity: 'INFO',
                title: 'Gap Coverage',
                message: 'Gap coverage requirement detected. Ensure final policy includes this endorsement.',
            });
        }

        return insights;
    }

    // ==========================================
    // MODULE 5: COMPLIANCE & DISCLOSURES
    // ==========================================

    private static analyzeLoanEstimate(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Intent to Proceed
        // Note: This is often a separate document, but sometimes stamped on the LE.
        // We'll check if the user signed it.
        if (!text.includes('intent to proceed') && !text.includes('signed')) {
            insights.push({
                category: 'COMPLIANCE',
                severity: 'WARNING',
                title: 'Intent to Proceed Missing',
                message: 'Loan Estimate does not appear to have an "Intent to Proceed" signature. This is required before charging fees.',
                actionItem: 'Obtain signed Intent to Proceed.'
            });
        }

        // 2. Changed Circumstance
        if (text.includes('revised loan estimate') || text.includes('changed circumstance')) {
            insights.push({
                category: 'COMPLIANCE',
                severity: 'INFO',
                title: 'Revised Loan Estimate',
                message: 'This is a revised LE. Ensure a valid "Changed Circumstance" reason is documented in the file.',
                actionItem: 'Verify Change of Circumstance form.'
            });
        }

        return insights;
    }

    private static analyzeClosingDisclosure(text: string): BrokerInsight[] {
        const insights: BrokerInsight[] = [];

        // 1. Cash to Close Check
        if (text.includes('cash to close')) {
            insights.push({
                category: 'COMPLIANCE',
                severity: 'INFO',
                title: 'Cash to Close Verified',
                message: 'Cash to Close figure detected. Verify this matches the final wire amount and asset verification.',
                actionItem: 'Compare with verified assets.'
            });
        }

        // 2. CD Date (TRID 3-Day Rule)
        if (text.includes('date issued') || text.includes('closing date')) {
            insights.push({
                category: 'COMPLIANCE',
                severity: 'WARNING',
                title: 'TRID 3-Day Rule',
                message: 'Closing Disclosure detected. Ensure the borrower received this at least 3 business days before consummation.',
                actionItem: 'Verify CD Receipt Date.'
            });
        }

        return insights;
    }
}

