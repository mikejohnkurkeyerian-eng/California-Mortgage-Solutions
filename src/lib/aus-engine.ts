import { Full1003Data } from '@/types/form-1003';

export type AUSStatus = 'Approve/Eligible' | 'Approve/Ineligible' | 'Refer/Eligible' | 'Refer/Caution' | 'Accept' | 'Caution' | 'Ineligible';

export interface AUSFinding {
    code: string;
    message: string;
    level: 'Success' | 'Info' | 'Warning' | 'Fatal';
}

export interface AUSResult {
    agency: 'Fannie Mae (DU)' | 'Freddie Mac (LPA)';
    status: AUSStatus;
    findings: AUSFinding[];
    dti: number;
    ltv: number;
    reservesMonths: number;
}

export interface DualAUSResponse {
    du: AUSResult;
    lpa: AUSResult;
    recommendation: string; // "Fannie Mae Recommended" etc.
}

export class AUSService {

    /**
     * Run both DU and LPA checks
     */
    static runDualAUS(data: Full1003Data, creditScore: number = 720): DualAUSResponse {
        const duResult = this.runFannieDU(data, creditScore);
        const lpaResult = this.runFreddieLPA(data, creditScore);

        // Determine simple recommendation
        let recommendation = "Review Required";
        const duPass = duResult.status === 'Approve/Eligible';
        const lpaPass = lpaResult.status === 'Accept';

        if (duPass && lpaPass) {
            recommendation = "Both Approved - Broker Choice";
        } else if (duPass) {
            recommendation = "Fannie Mae DU Recommended";
        } else if (lpaPass) {
            recommendation = "Freddie Mac LPA Recommended";
        } else {
            recommendation = "Manual Underwrite Required";
        }

        return {
            du: duResult,
            lpa: lpaResult,
            recommendation
        };
    }

    /**
     * Fannie Mae Desktop Underwriter (DU) Simulation
     */
    static runFannieDU(data: Full1003Data, creditScore: number): AUSResult {
        const findings: AUSFinding[] = [];
        let status: AUSStatus = 'Approve/Eligible';

        // 1. Calculate Ratios
        const { dti, ltv, reserves } = this.calculateRatios(data);

        // 2. Credit Rules
        if (creditScore < 620) {
            status = 'Refer/Caution';
            findings.push({ code: 'CRD-001', message: 'Credit score below 620 minimum.', level: 'Fatal' });
        }

        // 3. DTI Rules (Fannie Strict on 50%)
        if (dti > 50) {
            status = 'Refer/Caution';
            findings.push({ code: 'CAP-001', message: 'DTI exceeds 50% max.', level: 'Fatal' });
        } else if (dti > 45 && creditScore < 660) {
            status = 'Refer/Eligible';
            findings.push({ code: 'CAP-002', message: 'High DTI (>45%) requires higher credit score.', level: 'Warning' });
        }

        // 4. LTV Rules
        if (ltv > 97) {
            status = 'Refer/Caution';
            findings.push({ code: 'COL-001', message: 'LTV exceeds 97% max.', level: 'Fatal' });
        }

        // 5. Reserves Rules
        if (dti > 45 && reserves < 2) {
            status = 'Refer/Eligible';
            findings.push({ code: 'RES-001', message: '2 months reserves required for high DTI.', level: 'Warning' });
        }

        // Success finding
        if (status === 'Approve/Eligible') {
            findings.push({ code: 'SUCCESS', message: 'Loan meets Agency guidelines.', level: 'Success' });
        }

        return {
            agency: 'Fannie Mae (DU)',
            status,
            findings,
            dti,
            ltv,
            reservesMonths: reserves
        };
    }

    /**
     * Freddie Mac Loan Product Advisor (LPA) Simulation
     */
    static runFreddieLPA(data: Full1003Data, creditScore: number): AUSResult {
        const findings: AUSFinding[] = [];
        let status: AUSStatus = 'Accept';

        // 1. Calculate Ratios
        const { dti, ltv, reserves } = this.calculateRatios(data);

        // 2. Credit Rules
        if (creditScore < 620) {
            status = 'Caution';
            findings.push({ code: 'F-CRD-001', message: 'Credit score ineligible.', level: 'Fatal' });
        }

        // 3. DTI Rules (Slightly looser if reserves are high)
        if (dti > 50) {
            // Freddie sometimes allows >50 if reserves are high and credit is excellent
            if (reserves >= 12 && creditScore >= 740) {
                findings.push({ code: 'F-CAP-INFO', message: 'DTI > 50% accepted due to compensating factors (Reserves/Credit).', level: 'Info' });
            } else {
                status = 'Caution';
                findings.push({ code: 'F-CAP-001', message: 'DTI exceeds limits without compensating factors.', level: 'Fatal' });
            }
        }

        // 4. LTV Rules
        if (ltv > 97) {
            status = 'Caution';
            findings.push({ code: 'F-COL-001', message: 'LTV exceeds max.', level: 'Fatal' });
        }

        // 5. Reserves Rules (LPA likes reserves for salaried)
        if (dti > 43 && reserves < 1) {
            // Not fatal, but warning
            findings.push({ code: 'F-RES-001', message: 'Recommend 1 month reserves for >43% DTI.', level: 'Warning' });
        }

        if (status === 'Accept') {
            findings.push({ code: 'SUCCESS', message: 'Loan acceptable to Freddie Mac.', level: 'Success' });
        }

        return {
            agency: 'Freddie Mac (LPA)',
            status,
            findings,
            dti,
            ltv,
            reservesMonths: reserves
        };
    }

    private static calculateRatios(data: Full1003Data) {
        // Income
        const monthlyIncome = data.employment.reduce((sum, emp) => sum + (emp.monthlyIncome?.total || 0), 0) +
            (data.otherIncome?.reduce((sum, inc) => sum + inc.monthlyAmount, 0) || 0);

        // Liabilities
        const monthlyLiabilities = data.liabilities.reduce((sum, l) => sum + (l.monthlyPayment || 0), 0) +
            data.realEstate.reduce((sum, re) => sum + (re.mortgageLoans?.reduce((mSum, m) => mSum + m.monthlyPayment, 0) || 0), 0);

        // Assets
        const totalAssets = data.assets.reduce((sum, a) => sum + (a.cashOrMarketValue || 0), 0);

        // Loan
        const loanAmount = data.loanAndProperty?.loanAmount || 0;
        const purchasePrice = data.loanAndProperty?.propertyValue || loanAmount; // Fallback
        const estimatedPITI = (loanAmount * 0.006); // fallback 0.6% rule

        const totalObligations = monthlyLiabilities + estimatedPITI;

        // Calculations
        const dti = monthlyIncome > 0 ? (totalObligations / monthlyIncome) * 100 : 0;
        const ltv = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;
        const reserves = estimatedPITI > 0 ? (totalAssets / estimatedPITI) : 0;

        return { dti, ltv, reserves };
    }
}
