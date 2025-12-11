export function determineRequiredDocuments(loan) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const requirements = [];
    const full1003 = loan.full1003;
    // Helper to add requirement if not already present
    const addRequirement = (type, name, description) => {
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
    // --- BASE REQUIREMENTS ---
    addRequirement('ID', 'Photo ID', 'Valid Driver\'s License or Passport');
    // --- SECTION 1: BORROWER INFORMATION ---
    // Citizenship
    if (((_a = full1003 === null || full1003 === void 0 ? void 0 : full1003.borrower) === null || _a === void 0 ? void 0 : _a.citizenship) === 'PermanentResident') {
        addRequirement('OTHER', 'Green Card / Permanent Resident Card', 'Proof of permanent residency');
    }
    else if (((_b = full1003 === null || full1003 === void 0 ? void 0 : full1003.borrower) === null || _b === void 0 ? void 0 : _b.citizenship) === 'NonPermanentResident') {
        addRequirement('OTHER', 'Visa / Work Authorization', 'Proof of valid visa or work authorization');
    }
    // --- SECTION 2: EMPLOYMENT & INCOME ---
    // Check employment type from full1003 or fallback to loan.employment
    const isSelfEmployed = ((_c = full1003 === null || full1003 === void 0 ? void 0 : full1003.employment) === null || _c === void 0 ? void 0 : _c.some(emp => emp.isSelfEmployed)) ||
        ((_d = loan.employment) === null || _d === void 0 ? void 0 : _d.incomeType) === 'SelfEmployed';
    const hasW2Income = ((_e = full1003 === null || full1003 === void 0 ? void 0 : full1003.employment) === null || _e === void 0 ? void 0 : _e.some(emp => !emp.isSelfEmployed && emp.isCurrent)) ||
        ((_f = loan.employment) === null || _f === void 0 ? void 0 : _f.incomeType) === 'W2';
    if (isSelfEmployed) {
        addRequirement('TAX_RETURN', 'Tax Returns (1040)', 'Last 2 years of personal tax returns with all schedules');
        // Often self-employed also need business returns if they own >25%
        addRequirement('BUSINESS_TAX_RETURN', 'Business Tax Returns (if applicable)', 'Last 2 years of business returns (1120S, 1065) if you own >25%');
    }
    if (hasW2Income) {
        addRequirement('W2', 'W-2 Forms', 'Last 2 years of W-2 statements');
        addRequirement('PAY_STUB', 'Pay Stubs', 'Most recent 30 days of pay stubs');
    }
    // --- SECTION 3: ASSETS ---
    if (full1003 === null || full1003 === void 0 ? void 0 : full1003.assets) {
        const hasBankAccounts = full1003.assets.some(a => ['Checking', 'Savings', 'MoneyMarket', 'CertificateOfDeposit'].includes(a.type));
        const hasInvestments = full1003.assets.some(a => ['MutualFund', 'Stocks', 'Bond', 'Retirement'].includes(a.type));
        // Check for gifts (mapped from asset types or separate field)
        const hasGifts = full1003.assets.some(a => ['GiftOfCash', 'GiftOfProperty'].includes(a.type));
        if (hasBankAccounts) {
            addRequirement('BANK_STATEMENT', 'Bank Statements', 'Last 2 months of complete statements for all accounts');
        }
        if (hasInvestments) {
            addRequirement('ASSET_STATEMENT', 'Investment/Retirement Statements', 'Most recent quarterly statement');
        }
        if (hasGifts) {
            addRequirement('GIFT_LETTER', 'Gift Letter', 'Signed gift letter and proof of transfer');
        }
    }
    // --- SECTION 5: REAL ESTATE ---
    if ((full1003 === null || full1003 === void 0 ? void 0 : full1003.realEstate) && full1003.realEstate.length > 0) {
        const retainedProperties = full1003.realEstate.filter(re => re.status === 'Retained');
        if (retainedProperties.length > 0) {
            addRequirement('MORTGAGE_STATEMENT', 'Mortgage Statements', 'Current statement for all retained properties');
            addRequirement('INSURANCE_DECLARATION', 'Insurance Declaration', 'Homeowners insurance policy for all retained properties');
        }
    }
    // --- SECTION 6: LOAN & PROPERTY ---
    if (((_g = full1003 === null || full1003 === void 0 ? void 0 : full1003.loanAndProperty) === null || _g === void 0 ? void 0 : _g.loanPurpose) === 'Purchase') {
        addRequirement('PURCHASE_CONTRACT', 'Purchase Contract', 'Fully executed purchase agreement with all addenda');
    }
    else if (((_h = full1003 === null || full1003 === void 0 ? void 0 : full1003.loanAndProperty) === null || _h === void 0 ? void 0 : _h.loanPurpose) === 'Refinance') {
        addRequirement('MORTGAGE_STATEMENT', 'Current Mortgage Statement', 'Statement for the property being refinanced');
        addRequirement('INSURANCE_DECLARATION', 'Current Insurance Policy', 'Policy for the property being refinanced');
    }
    // --- SECTION 7: DECLARATIONS ---
    if (full1003 === null || full1003 === void 0 ? void 0 : full1003.declarations) {
        if (full1003.declarations.l_bankruptcy || full1003.declarations.m_bankruptcy) {
            addRequirement('BANKRUPTCY_PAPERS', 'Bankruptcy Discharge Papers', 'Complete bankruptcy discharge papers and schedule');
        }
    }
    // --- SECTION 9: MILITARY ---
    if ((_j = full1003 === null || full1003 === void 0 ? void 0 : full1003.military) === null || _j === void 0 ? void 0 : _j.isVeteran) {
        addRequirement('DD214', 'DD-214', 'Certificate of Release or Discharge from Active Duty');
    }
    return requirements;
}
