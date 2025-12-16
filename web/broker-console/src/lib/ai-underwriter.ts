import { LoanApplication, DocumentType } from '@/types/shared';
import { ClassificationResult } from './document-ai';
import { Full1003Data } from '@/types/form-1003';

export interface UnderwritingIssue {
    id: string;
    severity: 'High' | 'Medium' | 'Low';
    category: 'Employment' | 'Income' | 'Assets' | 'Credit' | 'Property';
    message: string;
    recommendation: string; // The "Ask" to the borrower
    relatedDocumentId?: string;
}

export interface AIAnalysisResult {
    issues: UnderwritingIssue[];
    summary: string;
    score: number; // 0-100 readiness score
}

import { BrokerIntelligenceService, InsightSeverity, InsightCategory } from './broker-intelligence';
import { AUSService, DualAUSResponse } from './aus-engine';

export class AIUnderwriter {

    static runDualAUS(loan: LoanApplication): DualAUSResponse | null {
        const full1003 = (loan as any).full1003 as Full1003Data;
        if (!full1003) return null;

        // Mock Credit Score logic - normally would fetch from credit report
        // Simulate based on data quality or randomness for demo
        const creditScore = 740;

        return AUSService.runDualAUS(full1003, creditScore);
    }

    static analyze(loan: LoanApplication, documents: ClassificationResult[]): AIAnalysisResult {
        const issues: UnderwritingIssue[] = [];
        let score = 100;

        // 0. 1003 Data Analysis (New)
        const full1003 = (loan as any).full1003;
        if (full1003) {
            this.analyzeDeclarations(full1003 as Full1003Data, issues);
            this.analyzeLiabilities(full1003 as Full1003Data, issues);
        }

        // 1. Broker Intelligence Analysis (Document Level)
        documents.forEach(doc => {
            if (doc.extractedText) {
                const insights = BrokerIntelligenceService.analyzeDocument(doc.extractedText, doc.type, doc.extractedData);

                insights.forEach(insight => {
                    // Map BrokerInsight to UnderwritingIssue
                    let severity: 'High' | 'Medium' | 'Low' = 'Low';
                    if (insight.severity === 'CRITICAL') severity = 'High';
                    else if (insight.severity === 'WARNING') severity = 'Medium';
                    else if (insight.severity === 'INFO') severity = 'Low';

                    // Map Category
                    let category: any = 'Documentation';
                    if (insight.category === 'INCOME') category = 'Income';
                    else if (insight.category === 'ASSET') category = 'Assets';
                    else if (insight.category === 'LIABILITY') category = 'Credit';
                    else if (insight.category === 'PROPERTY') category = 'Property';

                    issues.push({
                        id: Math.random().toString(36).substr(2, 9),
                        severity,
                        category,
                        message: insight.message,
                        recommendation: insight.actionItem || 'Review document.',
                        relatedDocumentId: doc.file.name
                    });
                });
            }
        });

        // 2. Cross-Document & Application Logic
        this.analyzeEmployment(loan, documents, issues);
        this.analyzeIncome(loan, documents, issues);
        this.analyzeDocumentation(loan, documents, issues);

        // Calculate Score
        score -= (issues.filter(i => i.severity === 'High').length * 20);
        score -= (issues.filter(i => i.severity === 'Medium').length * 10);
        score -= (issues.filter(i => i.severity === 'Low').length * 5);
        score = Math.max(0, score);

        return {
            issues,
            summary: `AI Analysis detected ${issues.length} potential issues. Readiness Score: ${score}/100.`,
            score
        };
    }

    private static analyzeDeclarations(data: Full1003Data, issues: UnderwritingIssue[]) {
        if (data.declarations.l_bankruptcy) {
            issues.push({
                id: 'DEC-001',
                severity: 'High',
                category: 'Credit',
                message: 'Borrower declared bankruptcy in the past 7 years.',
                recommendation: 'Verify discharge date and re-establish credit history.'
            });
        }
        if (data.declarations.k_foreclosure) {
            issues.push({
                id: 'DEC-002',
                severity: 'High',
                category: 'Credit',
                message: 'Borrower declared foreclosure in the past 7 years.',
                recommendation: 'Verify waiting period requirements.'
            });
        }
        if (data.declarations.h_outstandingJudgments) {
            issues.push({
                id: 'DEC-003',
                severity: 'High',
                category: 'Credit',
                message: 'Borrower declared outstanding judgments.',
                recommendation: 'Judgments must be paid in full prior to closing.'
            });
        }
    }

    private static analyzeLiabilities(data: Full1003Data, issues: UnderwritingIssue[]) {
        // Simple DTI Check based on declared income and liabilities
        const liabilities = data.liabilities || [];
        const realEstate = data.realEstate || [];
        const employment = data.employment || [];
        const otherIncome = data.otherIncome || [];

        const totalMonthlyLiabilities = liabilities.reduce((sum, l) => sum + (l.monthlyPayment || 0), 0) +
            realEstate.reduce((sum, re) => sum + (re.mortgageLoans?.reduce((mSum, m) => mSum + m.monthlyPayment, 0) || 0), 0);

        const totalMonthlyIncome = employment.reduce((sum, emp) => sum + (emp.monthlyIncome?.total || 0), 0) +
            otherIncome.reduce((sum, inc) => sum + inc.monthlyAmount, 0);

        if (totalMonthlyIncome > 0) {
            const dti = (totalMonthlyLiabilities / totalMonthlyIncome) * 100;
            if (dti > 50) {
                issues.push({
                    id: 'DTI-001',
                    severity: 'High',
                    category: 'Income',
                    message: `Calculated DTI is high (${dti.toFixed(1)}%).`,
                    recommendation: 'Review liabilities and consider paying down debts or adding co-borrower.'
                });
            }
        }
    }

    private static analyzeEmployment(loan: LoanApplication, docs: ClassificationResult[], issues: UnderwritingIssue[]) {
        // Rule: 2 Years History
        // We need to parse start dates from text or use structured data if available.
        // For this demo, we'll look for keywords in the extracted text of VOEs or 1003s.

        const employmentDocs = docs.filter(d => d.type === 'VOE' || d.type === 'PAY_STUB' || d.type === 'W2');

        if (employmentDocs.length === 0) {
            // No employment docs found yet - handled by document completeness, but worth noting context
        }

        // Heuristic: Check for "Start Date" in extracted text
        let foundStartDate = false;
        let yearsEmployed = 0;

        // Mocking the extraction logic for the demo - in reality this would use the extractedData from the parser
        // Let's assume we parse the loan application's employment start date
        if (loan.employment.startDate) {
            const start = new Date(loan.employment.startDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            yearsEmployed = diffDays / 365;
        } else {
            // Fallback to checking text for "Years on job" patterns
            // This is a simplification
        }

        if (yearsEmployed < 2 && loan.employment.status === 'Employed') {
            issues.push({
                id: 'EMP-001',
                severity: 'High',
                category: 'Employment',
                message: `Employment history is less than 2 years (${yearsEmployed.toFixed(1)} years detected).`,
                recommendation: 'Request previous employment history to cover a full 2-year period.'
            });
        }
    }

    private static analyzeIncome(loan: LoanApplication, docs: ClassificationResult[], issues: UnderwritingIssue[]) {
        // Rule: Income on Paystub vs Application
        const paystubs = docs.filter(d => d.type === 'PAY_STUB');

        for (const stub of paystubs) {
            if (stub.extractedText) {
                // Try to find "Gross Pay" or "Current" amount
                const matches = stub.extractedText.matchAll(/(?:gross|current|total)\s*(?:pay|earnings)?\s*[:$]?\s*([\d,]+\.\d{2})/gi);
                let maxAmount = 0;
                for (const m of matches) {
                    const val = parseFloat(m[1].replace(/,/g, ''));
                    if (val > maxAmount && val < 20000) maxAmount = val; // Filter out year-to-date likely
                }

                if (maxAmount > 0) {
                    // Annualize (assuming semi-monthly for this heuristic, extremely simplified)
                    const estimatedMonthly = maxAmount * 2;
                    const statedMonthly = loan.employment.monthlyIncome || 0;

                    const variance = Math.abs(estimatedMonthly - statedMonthly) / statedMonthly;

                    if (variance > 0.10) { // >10% variance
                        issues.push({
                            id: 'INC-001',
                            severity: 'Medium',
                            category: 'Income',
                            message: `Potential income discrepancy. Paystub indicates ~$${estimatedMonthly.toFixed(0)}/mo, Application states $${statedMonthly.toFixed(0)}/mo.`,
                            recommendation: 'Request clarification on income calculation or updated paystubs.',
                            relatedDocumentId: stub.file.name
                        });
                    }
                }
            }
        }
    }

    private static analyzeDocumentation(loan: LoanApplication, docs: ClassificationResult[], issues: UnderwritingIssue[]) {
        // Rule: Self-Employed missing Tax Returns
        if (loan.employment.status === 'SelfEmployed') {
            const hasTaxReturns = docs.some(d => d.type === 'TAX_RETURN');
            if (!hasTaxReturns) {
                issues.push({
                    id: 'DOC-001',
                    severity: 'High',
                    category: 'Employment',
                    message: 'Self-employed borrower missing Tax Returns.',
                    recommendation: 'Request 2 years of Personal (1040) and Business (1120/1065) Tax Returns.'
                });
            }
        }
    }
}

