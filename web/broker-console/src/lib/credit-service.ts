export interface CreditReport {
    score: number;
    provider: 'Equifax' | 'Experian' | 'TransUnion';
    reportId: string;
    factors: string[];
    retrievedAt: string;
}

export class CreditService {
    /**
     * @demo TEMPORARY / DEMO MODE
     * This entire method is a simulation for development purposes.
     * TODO: When ready for production, delete this method body and replace with real API calls (Experian/Equifax/TransUnion).
     */
    static async pullCredit(ssn: string): Promise<CreditReport> {
        // [DEMO MODE] Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Clean SSN
        const cleanSSN = ssn.replace(/[^0-9]/g, '');

        // Deterministic Score Generation
        // Use last 4 digits to determine base range
        const last4 = cleanSSN.slice(-4);
        const seed = parseInt(last4 || '0000', 10);

        let score = 0;
        let factors: string[] = [];

        // Logic based on seed
        if (seed < 2000) {
            // Bad Credit: 580 - 640
            score = 580 + (seed % 60);
            factors = ['Serious Delinquency', 'High Credit Usage'];
        } else if (seed < 5000) {
            // Fair Credit: 640 - 700
            score = 640 + (seed % 60);
            factors = ['Length of Credit History', 'Too Many Inquiries'];
        } else if (seed < 8000) {
            // Good Credit: 700 - 760
            score = 700 + (seed % 60);
            factors = [];
        } else {
            // Excellent Credit: 760 - 850
            score = 760 + (seed % 90);
            factors = ['Excellent Payment History'];
        }

        return {
            score,
            provider: 'Experian',
            reportId: `CP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            factors,
            retrievedAt: new Date().toISOString()
        };
    }
}

