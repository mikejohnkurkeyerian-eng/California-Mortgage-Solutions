export interface Source {
    id: string;
    name: string; // e.g., "Fannie Mae Selling Guide"
    url?: string;
    version?: string;
}

export interface Guideline {
    id: string;
    sourceId: string;
    section: string; // e.g., "B3-3.1-01"
    title: string; // e.g., "General Income Information"
    text: string; // The actual text of the guideline
}

export type RuleCondition =
    | { field: string; operator: '>' | '<' | '>=' | '<=' | '==' | '!='; value: any }
    | { field: string; operator: 'includes'; value: any };

export interface Rule {
    id: string;
    guidelineId: string;
    name: string;
    description: string;
    conditions: RuleCondition[];
    action: {
        type: 'REQUIRE_DOCUMENT' | 'ADJUST_RATE' | 'FLAG_RISK' | 'DENY';
        payload: any;
    };
    priority: number; // Higher number = higher priority
}

export class KnowledgeBase {
    private sources: Source[] = [];
    private guidelines: Guideline[] = [];
    private rules: Rule[] = [];

    constructor() {
        this.initializeDefaults();
    }

    private initializeDefaults() {
        // 1. Sources
        this.sources.push({
            id: 'FNMA',
            name: 'Fannie Mae Selling Guide',
            url: 'https://selling-guide.fanniemae.com/',
            version: '2024-01'
        });

        // 2. Guidelines (Simulated)
        this.guidelines.push({
            id: 'FNMA-B3-3',
            sourceId: 'FNMA',
            section: 'B3-3',
            title: 'Income Assessment',
            text: 'Stable and predictable income is required for all borrowers.'
        });

        // 3. Rules - The "Brain" of the Underwriter

        // --- CREDIT SCORE TIERS & RATES ---
        this.rules.push({
            id: 'RULE-CREDIT-TIER-1',
            guidelineId: 'FNMA-B3-3',
            name: 'Excellent Credit Adjustment',
            description: 'Borrowers with credit score >= 740 get a rate discount.',
            conditions: [
                { field: 'borrower.creditScore', operator: '>=', value: 740 }
            ],
            action: { type: 'ADJUST_RATE', payload: { value: -0.125, reason: 'Excellent Credit Score (>= 740)' } },
            priority: 50
        });

        this.rules.push({
            id: 'RULE-CREDIT-TIER-2',
            guidelineId: 'FNMA-B3-3',
            name: 'Good Credit Adjustment',
            description: 'Borrowers with credit score 700-739 get standard rate.',
            conditions: [
                { field: 'borrower.creditScore', operator: '>=', value: 700 },
                { field: 'borrower.creditScore', operator: '<', value: 740 }
            ],
            action: { type: 'ADJUST_RATE', payload: { value: 0, reason: 'Good Credit Score (700-739)' } },
            priority: 50
        });

        this.rules.push({
            id: 'RULE-CREDIT-TIER-3',
            guidelineId: 'FNMA-B3-3',
            name: 'Fair Credit Adjustment',
            description: 'Borrowers with credit score 660-699 get a slight rate increase.',
            conditions: [
                { field: 'borrower.creditScore', operator: '>=', value: 660 },
                { field: 'borrower.creditScore', operator: '<', value: 700 }
            ],
            action: { type: 'ADJUST_RATE', payload: { value: 0.125, reason: 'Fair Credit Score (660-699)' } },
            priority: 50
        });

        this.rules.push({
            id: 'RULE-CREDIT-TIER-4',
            guidelineId: 'FNMA-B3-3',
            name: 'Low Credit Adjustment',
            description: 'Borrowers with credit score < 660 get a rate increase.',
            conditions: [
                { field: 'borrower.creditScore', operator: '<', value: 660 }
            ],
            action: { type: 'ADJUST_RATE', payload: { value: 0.375, reason: 'Low Credit Score (< 660)' } },
            priority: 50
        });

        // --- DTI LIMITS ---
        this.rules.push({
            id: 'RULE-DTI-HARD-LIMIT',
            guidelineId: 'FNMA-B3-6',
            name: 'Max DTI Hard Limit',
            description: 'DTI cannot exceed 50% for Conventional loans.',
            conditions: [
                { field: 'loan.program.type', operator: '==', value: 'CONVENTIONAL' },
                { field: 'loan.dti', operator: '>', value: 50 }
            ],
            action: { type: 'DENY', payload: { reason: 'DTI exceeds 50% hard limit for Conventional loans.' } },
            priority: 100
        });

        this.rules.push({
            id: 'RULE-DTI-TIERED',
            guidelineId: 'FNMA-B3-6',
            name: 'High DTI Reserves',
            description: 'If DTI > 45%, require 6 months reserves.',
            conditions: [
                { field: 'loan.dti', operator: '>', value: 45 },
                { field: 'loan.dti', operator: '<=', value: 50 }
            ],
            action: {
                type: 'REQUIRE_DOCUMENT',
                payload: {
                    documentType: 'ASSET_STATEMENT',
                    title: 'Proof of 6 Months Reserves',
                    description: 'Due to high DTI (>45%), please provide proof of 6 months liquid reserves.'
                }
            },
            priority: 80
        });

        // --- PROPERTY TYPE ADJUSTMENTS ---
        this.rules.push({
            id: 'RULE-CONDO-LTV',
            guidelineId: 'FNMA-B4-2',
            name: 'Condo Max LTV',
            description: 'Condos are limited to 95% LTV.',
            conditions: [
                { field: 'property.type', operator: '==', value: 'Condo' },
                { field: 'loan.ltv', operator: '>', value: 95 }
            ],
            action: { type: 'DENY', payload: { reason: 'Condo LTV cannot exceed 95%.' } },
            priority: 90
        });

        this.rules.push({
            id: 'RULE-INVESTMENT-LTV',
            guidelineId: 'FNMA-B4-2',
            name: 'Investment Max LTV',
            description: 'Investment properties are limited to 80% LTV.',
            conditions: [
                { field: 'property.type', operator: '==', value: 'Investment' },
                { field: 'loan.ltv', operator: '>', value: 80 }
            ],
            action: { type: 'DENY', payload: { reason: 'Investment property LTV cannot exceed 80%.' } },
            priority: 90
        });

        // --- DOCUMENTATION RULES ---
        this.rules.push({
            id: 'RULE-SE-DOCS',
            guidelineId: 'FNMA-B3-3',
            name: 'Self-Employed Documentation',
            description: 'Self-employed borrowers must provide 2 years of tax returns.',
            conditions: [
                { field: 'borrower.employmentType', operator: '==', value: 'SelfEmployed' }
            ],
            action: {
                type: 'REQUIRE_DOCUMENT',
                payload: {
                    documentType: 'TAX_RETURN',
                    title: '2 Years Personal & Business Tax Returns',
                    description: 'Complete 1040s and business returns (1120S/1065) for the last two years.'
                }
            },
            priority: 10
        });

        this.rules.push({
            id: 'RULE-SE-PNL',
            guidelineId: 'FNMA-B3-3',
            name: 'Self-Employed P&L',
            description: 'Self-employed borrowers must provide YTD P&L.',
            conditions: [
                { field: 'borrower.employmentType', operator: '==', value: 'SelfEmployed' }
            ],
            action: {
                type: 'REQUIRE_DOCUMENT',
                payload: {
                    documentType: 'PROFIT_LOSS_STATEMENT',
                    title: 'Year-to-Date Profit & Loss Statement',
                    description: 'A P&L statement for the current year, signed by you.'
                }
            },
            priority: 10
        });

        this.rules.push({
            id: 'RULE-GIFT-FUNDS',
            guidelineId: 'FNMA-B3-4',
            name: 'Gift Funds Documentation',
            description: 'If using gift funds, require gift letter.',
            conditions: [
                { field: 'borrower.usingGiftFunds', operator: '==', value: true }
            ],
            action: {
                type: 'REQUIRE_DOCUMENT',
                payload: {
                    documentType: 'GIFT_LETTER',
                    title: 'Gift Letter',
                    description: 'Signed gift letter from the donor stating no repayment is expected.'
                }
            },
            priority: 10
        });

        this.rules.push({
            id: 'RULE-CONV-SCORE-MIN',
            guidelineId: 'FNMA-B3-3',
            name: 'Min Credit Score - Conventional',
            description: 'Minimum credit score for conventional loans is 620.',
            conditions: [
                { field: 'loan.program.type', operator: '==', value: 'CONVENTIONAL' },
                { field: 'borrower.creditScore', operator: '<', value: 620 }
            ],
            action: {
                type: 'DENY',
                payload: { reason: 'Credit score below 620 minimum for Conventional loans.' }
            },
            priority: 100
        });
    }

    public getRules(): Rule[] {
        return this.rules;
    }

    public getGuidelines(): Guideline[] {
        return this.guidelines;
    }

    public addRule(rule: Rule) {
        this.rules.push(rule);
    }
}

export const knowledgeBase = new KnowledgeBase();

