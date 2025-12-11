import { DocumentRequirement } from '@/context/DocumentContext';
import { AUS_RULES, AUSContext, RuleResult } from './aus-rules';
import { Full1003Data } from '@/types/form-1003';

export interface UnderwritingResult {
    decision: 'APPROVE/ELIGIBLE' | 'REFER/ELIGIBLE' | 'REFER/CAUTION' | 'INELIGIBLE';
    findings: {
        ruleId: string;
        category: string;
        status: 'PASS' | 'FAIL' | 'REFER';
        message?: string;
    }[];
    metrics: {
        monthlyIncome: number;
        monthlyDebts: number;
        dti: number;
        frontendDti: number;
        ltv: number;
        reserves: number;
        creditScore: number;
    };
    eligiblePrograms: LoanProgram[];
    notes: string[];
}

export interface LoanProgram {
    id: string;
    name: string;
    type: 'CONVENTIONAL' | 'FHA' | 'VA' | 'USDA';
    interestRate: number;
    maxDTI: number;
    maxLTV: number;
    minCreditScore: number;
}

export interface ClosingCondition {
    id: string;
    type: 'DOCUMENT' | 'VERIFICATION' | 'EXPLANATION';
    title: string;
    description: string;
    documentType?: string;
    required: boolean;
}

export class AutomatedUnderwritingService {

    private static PROGRAMS: LoanProgram[] = [
        {
            id: 'conv-30-fixed',
            name: '30-Year Fixed Conventional',
            type: 'CONVENTIONAL',
            interestRate: 6.875,
            maxDTI: 50,
            maxLTV: 97,
            minCreditScore: 620
        },
        {
            id: 'fha-30-fixed',
            name: '30-Year Fixed FHA',
            type: 'FHA',
            interestRate: 6.25,
            maxDTI: 55,
            maxLTV: 96.5,
            minCreditScore: 580
        },
        {
            id: 'va-30-fixed',
            name: '30-Year Fixed VA',
            type: 'VA',
            interestRate: 6.125,
            maxDTI: 60,
            maxLTV: 100,
            minCreditScore: 580
        }
    ];

    static async analyzeApplication(
        documents: DocumentRequirement[],
        loanAmount: number,
        propertyValue: number,
        creditScore: number,
        propertyType: 'SingleFamily' | 'Condo' | 'Investment' = 'SingleFamily',
        full1003: Full1003Data | null = null
    ): Promise<UnderwritingResult> {

        // 1. Extract Data (Prioritize Real 1003 Data)
        let monthlyIncome = 0;
        let monthlyDebts = 0;
        let liquidAssets = 0;

        if (full1003) {
            monthlyIncome = this.calculateRealIncome(full1003);
            monthlyDebts = this.calculateRealDebts(full1003);
            liquidAssets = this.calculateRealAssets(full1003);

            // Override passed params if they differ from 1003 (Consistency)
            if (full1003.loanAndProperty) {
                if (full1003.loanAndProperty.loanAmount > 0) loanAmount = full1003.loanAndProperty.loanAmount;
                if (full1003.loanAndProperty.propertyValue > 0) propertyValue = full1003.loanAndProperty.propertyValue;
            }
        } else {
            // Fallback to Simulated Logic if no 1003 data is passed
            monthlyIncome = this.calculateIncome(documents);
            monthlyDebts = this.calculateDebts(documents);
            liquidAssets = this.calculateAssets(documents);
        }

        // 2. Calculate Metrics
        const housingPayment = this.calculateHousingPayment(loanAmount, 6.875); // Est. rate
        const totalDebts = monthlyDebts + housingPayment;

        const frontendDti = monthlyIncome > 0 ? (housingPayment / monthlyIncome) * 100 : 0;
        const dti = monthlyIncome > 0 ? (totalDebts / monthlyIncome) * 100 : 0;
        const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;
        const reserves = housingPayment > 0 ? liquidAssets / housingPayment : 0;

        // 3. Build AUS Context
        const context: AUSContext = {
            loan: {
                amount: loanAmount,
                program: 'CONVENTIONAL', // Default to Conv for initial run
                type: 'PURCHASE',
                ltv,
                cltv: ltv, // Assuming no 2nd mortgage for now
                dti,
                frontendDti,
                reserves
            },
            borrower: {
                creditScore, // Still passed from caller (simulated or real credit report)
                derogatoryEvents: {
                    latePaymentsLast12Months: 0, // Would come from credit report
                },
                isFirstTimeHomeBuyer: true,
                selfEmployed: full1003 ? full1003.employment.some(e => e.isSelfEmployed) : false
            },
            property: {
                type: propertyType as any,
                units: 1,
                occupancy: 'Primary'
            }
        };

        // 4. Run Rules Engine
        const findings = [];
        let overallDecision: UnderwritingResult['decision'] = 'APPROVE/ELIGIBLE';
        const notes: string[] = [];

        // Check against all rules
        for (const rule of AUS_RULES) {
            const result = rule.evaluate(context);
            if (result.status !== 'PASS') {
                findings.push({
                    ruleId: rule.id,
                    category: rule.category,
                    status: result.status,
                    message: result.message
                });

                if (result.status === 'FAIL') {
                    overallDecision = 'INELIGIBLE';
                } else if (result.status === 'REFER' && overallDecision !== 'INELIGIBLE') {
                    overallDecision = 'REFER/ELIGIBLE';
                }
            }
        }

        // 5. Determine Eligible Programs
        const eligiblePrograms = this.PROGRAMS.filter(prog => {
            // Simple filter based on hard limits
            if (dti > prog.maxDTI) return false;
            if (ltv > prog.maxLTV) return false;
            if (creditScore < prog.minCreditScore) return false;
            return true;
        });

        if (eligiblePrograms.length === 0) {
            overallDecision = 'INELIGIBLE';
            notes.push(`Excessive DTI (${dti.toFixed(2)}%) or LTV (${ltv.toFixed(2)}%).`);
        }

        return {
            decision: overallDecision,
            findings,
            metrics: {
                monthlyIncome,
                monthlyDebts,
                dti,
                frontendDti,
                ltv,
                reserves,
                creditScore
            },
            eligiblePrograms,
            notes
        };
    }

    private static calculateRealIncome(data: Full1003Data): number {
        if (!data.employment) return 0;
        return data.employment.reduce((sum, job) => {
            const income = job.monthlyIncome;
            // Sum all components: Base + Overtime + Bonus + Commission + Other
            const jobTotal = (income.base || 0) +
                (income.overtime || 0) +
                (income.bonus || 0) +
                (income.commission || 0) +
                (income.other || 0);
            return sum + jobTotal;
        }, 0);
    }

    private static calculateRealDebts(data: Full1003Data): number {
        if (!data.liabilities) return 0;
        return data.liabilities.reduce((sum, liability) => {
            // Only count if it's not being paid off or omitted
            if (!liability.toBePaidOff && !liability.omitted) {
                return sum + (liability.monthlyPayment || 0);
            }
            return sum;
        }, 0);
    }

    private static calculateRealAssets(data: Full1003Data): number {
        if (!data.assets) return 0;
        return data.assets.reduce((sum, asset) => {
            return sum + (asset.cashOrMarketValue || 0);
        }, 0);
    }

    // --- LEGACY / FALLBACK METHODS ---

    private static calculateIncome(documents: DocumentRequirement[]): number {
        let totalMonthlyIncome = 0;
        // 1. Analyze Pay Stubs
        const payStubs = documents.find(d => d.type === 'PAY_STUB')?.files || [];
        if (payStubs.length > 0) totalMonthlyIncome += 5000; // Base salary simulation

        // 2. Analyze W2s
        const w2s = documents.find(d => d.type === 'W2')?.files || [];
        if (w2s.length > 0 && totalMonthlyIncome === 0) totalMonthlyIncome = 5000; // Fallback

        // 3. Self Employment
        const taxReturns = documents.find(d => d.type === 'TAX_RETURN')?.files || [];
        if (taxReturns.length > 0) totalMonthlyIncome = 8000; // Higher income for self-employed simulation

        return totalMonthlyIncome > 0 ? totalMonthlyIncome : 5000; // Default for demo
    }

    private static calculateDebts(documents: DocumentRequirement[]): number {
        let monthlyDebts = 500; // Base debt (car, credit cards)
        documents.forEach(doc => {
            doc.insights.forEach(insight => {
                const lowerInsight = insight.toLowerCase();
                if (lowerInsight.includes('child support')) monthlyDebts += 500;
                if (lowerInsight.includes('alimony')) monthlyDebts += 1000;
                if (lowerInsight.includes('loan repayment')) monthlyDebts += 300;
            });
        });
        return monthlyDebts;
    }

    private static calculateAssets(documents: DocumentRequirement[]): number {
        let assets = 10000; // Base assets
        const bankStmts = documents.find(d => d.type === 'BANK_STATEMENT')?.files || [];
        if (bankStmts.length > 0) assets += 15000; // Add verified assets
        return assets;
    }

    private static calculateHousingPayment(loanAmount: number, rate: number): number {
        const r = rate / 100 / 12;
        const n = 360; // 30 years
        const principalAndInterest = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const taxesAndInsurance = (loanAmount * 0.0125) / 12; // Est. 1.25% per year
        return principalAndInterest + taxesAndInsurance;
    }

    static generateClosingConditions(
        loanProgram: LoanProgram,
        borrowerProfile: any,
        propertyType: string
    ): ClosingCondition[] {
        // ... (Keep existing logic or expand later)
        return [
            {
                id: '1',
                type: 'DOCUMENT',
                title: 'Clear Title',
                description: 'Preliminary Title Report showing clear title.',
                required: true
            },
            {
                id: '2',
                type: 'VERIFICATION',
                title: 'Employment Verification',
                description: 'Verbal VOE within 10 days of closing.',
                required: true
            }
        ];
    }
}
