export interface AUSRule {
    id: string;
    category: 'CREDIT' | 'CAPACITY' | 'COLLATERAL' | 'CAPITAL' | 'ELIGIBILITY';
    name: string;
    description: string;
    evaluate: (context: AUSContext) => RuleResult;
}

export interface RuleResult {
    status: 'PASS' | 'FAIL' | 'REFER';
    message?: string;
    condition?: string; // e.g. "DTI > 50%"
}

export interface AUSContext {
    loan: {
        amount: number;
        program: string; // 'CONVENTIONAL', 'FHA', 'VA'
        type: 'PURCHASE' | 'REFINANCE';
        ltv: number;
        cltv: number;
        dti: number; // Back-end DTI
        frontendDti: number;
        reserves: number; // In months
    };
    borrower: {
        creditScore: number;
        derogatoryEvents: {
            bankruptcy?: { date: string; type: 'Chapter 7' | 'Chapter 13'; dischargedDate?: string };
            foreclosure?: { date: string };
            latePaymentsLast12Months: number;
        };
        isFirstTimeHomeBuyer: boolean;
        selfEmployed: boolean;
    };
    property: {
        type: 'SingleFamily' | 'Condo' | 'MultiUnit' | 'Manufactured';
        units: number;
        occupancy: 'Primary' | 'SecondHome' | 'Investment';
    };
}

export const AUS_RULES: AUSRule[] = [
    // ==========================================
    // 1. CREDIT RULES
    // ==========================================
    {
        id: 'CREDIT-001',
        category: 'CREDIT',
        name: 'Minimum Credit Score',
        description: 'Verifies borrower meets minimum credit score requirements for the program.',
        evaluate: (ctx) => {
            const minScore = ctx.loan.program === 'FHA' ? 580 : 620;
            if (ctx.borrower.creditScore < minScore) {
                return { status: 'FAIL', message: `Credit score ${ctx.borrower.creditScore} is below minimum of ${minScore}.` };
            }
            return { status: 'PASS' };
        }
    },
    {
        id: 'CREDIT-002',
        category: 'CREDIT',
        name: 'Recent Late Payments',
        description: 'Checks for late payments in the last 12 months.',
        evaluate: (ctx) => {
            if (ctx.borrower.derogatoryEvents.latePaymentsLast12Months > 0) {
                return { status: 'REFER', message: `${ctx.borrower.derogatoryEvents.latePaymentsLast12Months} late payment(s) in last 12 months detected.` };
            }
            return { status: 'PASS' };
        }
    },
    {
        id: 'CREDIT-003',
        category: 'CREDIT',
        name: 'Bankruptcy Seasoning',
        description: 'Ensures sufficient time has passed since bankruptcy discharge.',
        evaluate: (ctx) => {
            if (ctx.borrower.derogatoryEvents.bankruptcy?.dischargedDate) {
                const dischargeDate = new Date(ctx.borrower.derogatoryEvents.bankruptcy.dischargedDate);
                const yearsSince = (Date.now() - dischargeDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                const requiredYears = ctx.loan.program === 'FHA' ? 2 : 4;

                if (yearsSince < requiredYears) {
                    return { status: 'FAIL', message: `Bankruptcy discharged ${yearsSince.toFixed(1)} years ago. Minimum ${requiredYears} years required.` };
                }
            }
            return { status: 'PASS' };
        }
    },

    // ==========================================
    // 2. CAPACITY RULES (DTI)
    // ==========================================
    {
        id: 'CAPACITY-001',
        category: 'CAPACITY',
        name: 'Max DTI Ratio',
        description: 'Verifies Debt-to-Income ratio does not exceed program limits.',
        evaluate: (ctx) => {
            let maxDti = 45; // Standard Conventional

            if (ctx.loan.program === 'FHA') maxDti = 55;
            else if (ctx.loan.program === 'VA') maxDti = 60;
            else if (ctx.loan.program === 'CONVENTIONAL' && ctx.borrower.creditScore >= 700 && ctx.loan.reserves >= 6) maxDti = 50;

            if (ctx.loan.dti > maxDti) {
                return { status: 'FAIL', message: `DTI ${ctx.loan.dti.toFixed(2)}% exceeds maximum of ${maxDti}%.` };
            }
            if (ctx.loan.dti > 45 && ctx.loan.reserves < 2) {
                return { status: 'REFER', message: `High DTI (${ctx.loan.dti.toFixed(2)}%) requires at least 2 months reserves.` };
            }
            return { status: 'PASS' };
        }
    },

    // ==========================================
    // 3. COLLATERAL RULES (LTV)
    // ==========================================
    {
        id: 'COLLATERAL-001',
        category: 'COLLATERAL',
        name: 'Max LTV Ratio',
        description: 'Verifies Loan-to-Value ratio meets program guidelines.',
        evaluate: (ctx) => {
            let maxLtv = 97; // Conventional First Time Buyer

            if (ctx.loan.program === 'FHA') maxLtv = 96.5;
            else if (ctx.loan.program === 'VA') maxLtv = 100;
            else if (ctx.loan.program === 'CONVENTIONAL' && !ctx.borrower.isFirstTimeHomeBuyer) maxLtv = 95;
            else if (ctx.property.occupancy === 'Investment') maxLtv = 85;

            if (ctx.loan.ltv > maxLtv) {
                return { status: 'FAIL', message: `LTV ${ctx.loan.ltv.toFixed(2)}% exceeds maximum of ${maxLtv}%.` };
            }
            return { status: 'PASS' };
        }
    },
    {
        id: 'COLLATERAL-002',
        category: 'COLLATERAL',
        name: 'Property Eligibility',
        description: 'Checks for ineligible property types.',
        evaluate: (ctx) => {
            if (ctx.property.type === 'Manufactured' && ctx.loan.program === 'CONVENTIONAL' && ctx.loan.ltv > 95) {
                return { status: 'FAIL', message: 'Manufactured homes limited to 95% LTV on Conventional loans.' };
            }
            return { status: 'PASS' };
        }
    },

    // ==========================================
    // 4. CAPITAL RULES (Reserves)
    // ==========================================
    {
        id: 'CAPITAL-001',
        category: 'CAPITAL',
        name: 'Minimum Reserves',
        description: 'Verifies borrower has sufficient post-closing liquid assets.',
        evaluate: (ctx) => {
            let requiredReserves = 0;

            if (ctx.property.occupancy === 'Investment') requiredReserves += 6;
            if (ctx.property.units > 1) requiredReserves += 2; // Multi-unit penalty
            if (ctx.borrower.selfEmployed) requiredReserves += 2; // Self-employed buffer

            if (ctx.loan.reserves < requiredReserves) {
                return { status: 'REFER', message: `Insufficient reserves. Has ${ctx.loan.reserves} months, requires ${requiredReserves} months.` };
            }
            return { status: 'PASS' };
        }
    }
];

