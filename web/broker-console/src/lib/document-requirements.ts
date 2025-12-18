import { DocumentType } from './document-ai';
import { Full1003Data } from '@/types/form-1003';

// Local definition to avoid circular dependency or missing shared types
// We extend the basic LoanApplication to include the full 1003 data structure
export interface LoanApplication {
    id: string;
    borrowerId: string;
    status: string;
    borrower: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        citizenship?: string;
        maritalStatus?: string;
    };
    employment: {
        incomeType: 'W2' | 'SelfEmployed' | 'Retired' | 'Unemployed' | 'Other' | 'Military';
        employerName?: string;
        jobTitle?: string;
        monthlyIncome: number;
    };
    assets: {
        type: string;
        value: number;
        institution?: string;
    }[];
    property: {
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
        propertyType: string;
        purchasePrice: number;
        loanAmount: number;
    };
    // The critical piece: The full 1003 data structure
    full1003?: Full1003Data;
    // Additional fields that might be on the loan object directly
    loanProgram?: string;
}

export interface DocumentRequirement {
    id: string;
    type: DocumentType;
    name: string;
    status: 'pending' | 'uploaded' | 'verified';
    required: boolean;
    files: any[];
    insights: string[];
}

export function determineRequiredDocuments(loan: LoanApplication): DocumentRequirement[] {
    console.log('🔥 DETERMINE DOCS CALLED with:', JSON.stringify(loan.full1003));
    const requirements: DocumentRequirement[] = [];
    const full1003 = loan.full1003;

    console.log('🔍 REQ LOGIC TRACE:', {
        maritalStatus: full1003?.borrower?.maritalStatus,
        realEstateCount: full1003?.realEstate?.length,
        firstPropertyRental: full1003?.realEstate?.[0]?.monthlyRentalIncome,
        incomeType: loan.employment?.incomeType
    });

    // Helper to add requirement if not already present
    const addRequirement = (type: DocumentType, name: string, description?: string) => {
        if (!requirements.some(req => req.type === type)) {
            requirements.push({
                id: Math.random().toString(36).substr(2, 9),
                type,
                name,
                status: 'pending',
                required: true,
                files: [],
                insights: description ? [description] : []
            });
        }
    };

    // --- 1. IDENTITY & LEGAL STATUS ---
    addRequirement('ID', 'Photo ID', 'Valid Driver\'s License, State ID, or Passport');
    addRequirement('OTHER', 'Social Security Card', 'Copy of Social Security Card'); // Using OTHER as placeholder if SS_CARD not in enum, or map to specific if added

    if (full1003?.borrower?.citizenship === 'PermanentResident') {
        addRequirement('GREEN_CARD', 'Green Card', 'Permanent Resident Card (Front and Back)');
    } else if (full1003?.borrower?.citizenship === 'NonPermanentResident') {
        addRequirement('VISA', 'Visa / EAD', 'Valid Visa or Employment Authorization Document');
        addRequirement('I94', 'I-94 Record', 'Most recent I-94 arrival/departure record');
    } else if (!full1003?.borrower?.ssn) {
        addRequirement('ITIN_LETTER', 'ITIN Letter', 'IRS ITIN Assignment Letter');
    }

    // --- 2. EMPLOYMENT & INCOME ---
    const incomeType = loan.employment?.incomeType;

    // W2 Employment
    // Check if any employment is NOT self-employed and is current (no end date)
    const hasW2Income = full1003?.employment?.some(emp => !emp.isSelfEmployed && !emp.endDate) || incomeType === 'W2';
    if (hasW2Income) {
        addRequirement('PAY_STUB', 'Pay Stubs', 'Most recent 30 days of pay stubs');
        addRequirement('W2', 'W-2 Forms', 'Last 2 years of W-2 statements');
        addRequirement('VOE', 'Verification of Employment', 'Written or Verbal VOE will be ordered');

        // New Job Check (Logic: Start Date < 6 months ago)
        const recentJob = full1003?.employment?.some(emp => {
            if (emp.startDate && !emp.endDate) {
                const start = new Date(emp.startDate);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                return start > sixMonthsAgo;
            }
            return false;
        });
        if (recentJob) {
            addRequirement('OFFER_LETTER', 'Offer Letter / Contract', 'Signed offer letter or employment contract for new job');
        }
    }

    // Self-Employed
    const isSelfEmployed = full1003?.employment?.some(emp => emp.isSelfEmployed) || incomeType === 'SelfEmployed';
    if (isSelfEmployed) {
        addRequirement('TAX_RETURN', 'Personal Tax Returns (1040)', 'Last 2 years of personal tax returns with all schedules');
        addRequirement('BUSINESS_LICENSE', 'Business License', 'Current business license or registration');
        addRequirement('PROFIT_AND_LOSS', 'YTD Profit & Loss', 'Year-to-date P&L statement signed by borrower');
        addRequirement('BALANCE_SHEET', 'Balance Sheet', 'Current balance sheet');

        // Check for >25% ownership to trigger business returns
        const significantOwnership = full1003?.employment?.some(emp => (emp.ownershipShare || 0) >= 25);
        if (significantOwnership) {
            addRequirement('BUSINESS_TAX_RETURN', 'Business Tax Returns', 'Last 2 years of business returns (1120S, 1065) and K-1s');
            addRequirement('K1', 'Schedule K-1s', 'K-1s for all business entities');
            addRequirement('OTHER', 'Corporate/LLC Documents', 'Articles of Incorporation/Organization, Operating Agreement');
        }
    }

    // Retired / Pension / Social Security
    if (incomeType === 'Retired' || full1003?.otherIncome?.some(i => i.source.includes('Pension') || i.source.includes('Retirement'))) {
        addRequirement('PENSION_STATEMENT', 'Pension Award Letter', 'Current pension award letter or statement');
        addRequirement('FORM_1099', '1099-R Forms', 'Last 2 years of 1099-R forms');
    }

    if (full1003?.otherIncome?.some(i => i.source.includes('Social Security'))) {
        addRequirement('SOCIAL_SECURITY_AWARD', 'SSA Award Letter', 'Current Social Security Award Letter');
    }

    // Alimony / Child Support Income
    if (full1003?.otherIncome?.some(i => i.source.includes('Alimony') || i.source.includes('Child Support'))) {
        addRequirement('DIVORCE_DECREE', 'Divorce Decree / Court Order', 'Complete divorce decree or court order specifying payments');
        addRequirement('OTHER', 'Proof of Receipt', 'Proof of receipt for the last 6 months (bank statements or canceled checks)');
    }

    // Military Income
    if (incomeType === 'Military' || full1003?.employment?.some(e => e.employerName?.toLowerCase().includes('military') || e.employerName?.toLowerCase().includes('army') || e.employerName?.toLowerCase().includes('navy') || e.employerName?.toLowerCase().includes('air force'))) {
        addRequirement('OTHER', 'LES (Leave and Earnings Statement)', 'Most recent Leave and Earnings Statement');
    }

    // Rental Income
    if (full1003?.realEstate?.some(re => (re.monthlyRentalIncome || 0) > 0)) {
        addRequirement('TAX_RETURN', 'Schedule E (Tax Returns)', 'Ensure Schedule E is included in tax returns');
        addRequirement('LEASE_AGREEMENT', 'Current Lease Agreements', 'Current lease agreements for all rental properties');
    }

    // --- 3. ASSETS ---
    if (full1003?.assets) {
        const assetTypes = full1003.assets.map(a => a.type);

        if (assetTypes.some(t => ['Checking', 'Savings', 'MoneyMarket', 'CertificateOfDeposit'].includes(t))) {
            addRequirement('BANK_STATEMENT', 'Bank Statements', 'Last 2 months of complete statements for all accounts (all pages)');
            addRequirement('VOD', 'Verification of Deposit', 'Lender may request VOD');
        }

        if (assetTypes.some(t => ['MutualFund', 'Stocks', 'Bond', 'Retirement'].includes(t))) {
            addRequirement('ASSET_STATEMENT', 'Investment/Retirement Statements', 'Most recent quarterly statement');
            // Check if using for down payment (heuristic: high value)
            const retirementAssets = full1003.assets.filter(a => a.type === 'Retirement');
            if (retirementAssets.some(a => a.cashOrMarketValue > 10000)) { // Arbitrary threshold for potential withdrawal
                addRequirement('OTHER', 'Retirement Withdrawal Terms', 'Terms of withdrawal or loan from retirement account');
            }
        }

        // Gifts are usually in giftsOrGrants section, but check both just in case
        const hasGifts = full1003.giftsOrGrants && full1003.giftsOrGrants.length > 0;
        if (hasGifts) {
            addRequirement('GIFT_LETTER', 'Gift Letter', 'Signed gift letter and proof of transfer');
        }

        if (assetTypes.some(t => t === 'ProceedsFromSale')) {
            addRequirement('CLOSING_DISCLOSURE', 'Closing Disclosure (Sale)', 'Closing Disclosure or Bill of Sale from sold asset');
        }

        if (assetTypes.some(t => t === 'Crypto')) {
            addRequirement('CRYPTO_STATEMENT', 'Crypto Account Statements', 'Statements showing ownership and liquidation if needed');
        }

        if (assetTypes.some(t => t === 'TrustAccount')) {
            addRequirement('TRUST_AGREEMENT', 'Trust Agreement', 'Full Trust Agreement and Certification of Trust');
        }

        if (assetTypes.some(t => t === 'StockOptions')) {
            addRequirement('STOCK_OPTION_AGREEMENT', 'Stock Option Agreement', 'Vesting schedule and option agreement');
        }
    }

    // --- 4. REAL ESTATE (REO) ---
    if (full1003?.realEstate && full1003.realEstate.length > 0) {
        const retainedProperties = full1003.realEstate.filter(re => re.status === 'Retained');
        if (retainedProperties.length > 0) {
            addRequirement('MORTGAGE_STATEMENT', 'Mortgage Statements', 'Current statement for all retained properties');
            addRequirement('INSURANCE_DECLARATION', 'Insurance Declarations', 'Homeowners insurance policy for all retained properties');
            addRequirement('PROPERTY_TAX_BILL', 'Property Tax Bills', 'Most recent property tax bill for all retained properties');
            // Heuristic for HOA: Condo or PUD usually implies HOA, but we might not know property type of REO. 
            // We can add a generic requirement or leave it to manual condition.
            // addRequirement('HOA_STATEMENT', 'HOA Statement', 'Current HOA statement if applicable');
        }

        const pendingProperties = full1003.realEstate.filter(re => re.status === 'Pending');
        if (pendingProperties.length > 0) {
            addRequirement('SALES_CONTRACT', 'Sales Contract (Pending Sale)', 'Contract for property currently pending sale');
        }

        const investmentProperties = full1003.realEstate.filter(re => re.intendedOccupancy === 'Investment');
        if (investmentProperties.length > 0) {
            // Already covered by Rental Income check, but good to reinforce
            addRequirement('RENT_ROLL', 'Rent Roll', 'Rent roll for multi-unit investment properties');
        }
    }

    // --- 5. LOAN & PROPERTY ---
    const loanPurpose = full1003?.loanAndProperty?.loanPurpose;

    if (loanPurpose === 'Purchase') {
        addRequirement('PURCHASE_CONTRACT', 'Purchase Contract', 'Fully executed purchase agreement with all addenda');
        addRequirement('EARNEST_MONEY_RECEIPT', 'Earnest Money Receipt', 'Proof of earnest money deposit clearing account');
        addRequirement('HOME_INSURANCE_QUOTE', 'Homeowners Insurance Binder', 'Insurance binder for the new property');

        // If purchasing from family or partner (heuristic needed, maybe same last name or manual flag)
        // addRequirement('BUYOUT_AGREEMENT', 'Buyout Agreement', 'If purchasing from partner/spouse');
    } else if (loanPurpose === 'Refinance') {
        addRequirement('PAYOFF_STATEMENT', 'Payoff Statement', 'Current payoff statement for the loan being refinanced');
        addRequirement('NOTE', 'Current Mortgage Note', 'Copy of the current mortgage note');
        addRequirement('INSURANCE_DECLARATION', 'Current Insurance Policy', 'Policy for the property being refinanced');
        addRequirement('LOAN_ESTIMATE', 'Loan Estimate', 'Loan Estimate for the new loan');
    } else if (loanPurpose === 'Other' || loanPurpose === 'Construction') {
        addRequirement('BUILDER_CONTRACT', 'Builder Contract / Plans', 'Construction contract and plans');
    }

    // Property Type Specifics (if known)
    // Assuming we might have this data in loan.property.propertyType or full1003
    const propertyType = loan.property?.propertyType;
    if (propertyType === 'Condo' || propertyType === 'Condominium') {
        addRequirement('CONDO_QUESTIONNAIRE', 'Condo Questionnaire', 'Completed condo questionnaire');
        addRequirement('HO6_INSURANCE', 'HO-6 Insurance Policy', 'Walls-in coverage policy');
    }

    // Flood Zone (Manual Trigger usually, but if known...)
    // addRequirement('FLOOD_INSURANCE', 'Flood Insurance', 'If property is in a flood zone');

    // --- 6. DECLARATIONS & LEGAL ---
    if (full1003?.declarations) {
        if (full1003.declarations.l_bankruptcy) {
            addRequirement('BANKRUPTCY_DISCHARGE', 'Bankruptcy Discharge Papers', 'Complete bankruptcy discharge papers and schedule');
            addRequirement('LETTER_OF_EXPLANATION', 'LOE - Bankruptcy', 'Letter explaining circumstances of bankruptcy');
        }

        if (full1003.declarations.j_lawsuit || full1003.declarations.h_outstandingJudgments) {
            addRequirement('JUDGMENT_EXPLANATION', 'Proof of Settlement / Explanation', 'Proof of satisfaction or explanation for lawsuit/judgment');
        }

        if (full1003.declarations.i_delinquentFederalDebt) {
            addRequirement('LETTER_OF_EXPLANATION', 'LOE - Federal Debt', 'Explanation regarding delinquent federal debt');
        }
    }

    // Divorce / Separation
    if (full1003?.borrower?.maritalStatus === 'Separated') {
        addRequirement('SEPARATION_AGREEMENT', 'Separation Agreement', 'Legal separation agreement');
    }

    // Child Support / Alimony Obligation (Check Liabilities)
    if (full1003?.liabilities?.some(l => l.type === 'Other' && (l.companyName.toLowerCase().includes('child') || l.companyName.toLowerCase().includes('support') || l.companyName.toLowerCase().includes('alimony')))) {
        addRequirement('CHILD_SUPPORT_ORDER', 'Child Support / Alimony Order', 'Court order detailing obligation');
        addRequirement('DIVORCE_DECREE', 'Divorce Decree', 'Divorce decree referencing obligation');
    }

    // --- 7. MILITARY SERVICE ---
    if (full1003?.military?.isVeteran) {
        addRequirement('DD214', 'DD-214', 'Certificate of Release or Discharge from Active Duty');
        addRequirement('VA_COE', 'VA Certificate of Eligibility', 'Certificate of Eligibility for VA Loan');
    }
    if (full1003?.military?.isActiveDuty) {
        addRequirement('OTHER', 'Statement of Service', 'Statement of Service from Commanding Officer');
    }

    // --- 8. COMPLIANCE & DISCLOSURES (Standard) ---
    addRequirement('BORROWER_AUTH', 'Borrower Authorization', 'Signed Borrower Authorization Form');
    addRequirement('INTENT_TO_PROCEED', 'Intent to Proceed', 'Signed Intent to Proceed');
    addRequirement('ESIGN_CONSENT', 'E-Sign Consent', 'Signed E-Sign Consent Form');
    addRequirement('ANTI_STEERING', 'Anti-Steering Disclosure', 'Signed Anti-Steering Disclosure');

    // --- 9. SPECIAL PROGRAMS ---
    if (loan.loanProgram) {
        const program = loan.loanProgram.toLowerCase();
        if (program.includes('fha')) {
            addRequirement('FHA_AMENDATORY', 'FHA Amendatory Clause', 'Signed FHA Amendatory Clause');
            addRequirement('OTHER', 'Real Estate Certification', 'Signed Real Estate Certification');
        } else if (program.includes('va')) {
            addRequirement('VA_ANALYSIS', 'VA Loan Analysis', 'VA Loan Analysis Worksheet');
            addRequirement('OTHER', 'Residual Income Worksheet', 'VA Residual Income Worksheet');
        } else if (program.includes('usda')) {
            addRequirement('USDA_INCOME_WORKSHEET', 'USDA Income Worksheet', 'USDA Eligibility Income Worksheet');
        }
    }

    return requirements;
}

