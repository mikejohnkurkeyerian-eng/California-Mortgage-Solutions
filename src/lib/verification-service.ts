import { Full1003Data } from '@/types/form-1003';
import { ExtractedDocumentData } from './document-extractor';

export interface Discrepancy {
    id: string;
    fieldPath: string; // e.g. 'employment[0].monthlyIncome.base'
    fieldLabel: string; // e.g. 'Monthly Income'
    applicationValue: any;
    documentValue: any;
    severity: 'WARNING' | 'CRITICAL';
    message: string;
    step?: number; // The step in the application wizard
}

export class VerificationService {
    static compare(appData: Full1003Data, docData: ExtractedDocumentData): Discrepancy[] {
        const discrepancies: Discrepancy[] = [];

        // 1. Compare Income
        if (docData.employment?.monthlyIncome) {
            // Find matching employment entry or use the first one
            // Simple logic: Compare against the first employment entry's base income
            const appIncome = appData.employment[0]?.monthlyIncome?.base || 0;
            const docIncome = docData.employment.monthlyIncome;

            // Allow 5% variance
            const variance = Math.abs((appIncome - docIncome) / docIncome);

            if (variance > 0.05) {
                discrepancies.push({
                    id: 'income-mismatch',
                    fieldPath: 'employment[0].monthlyIncome.base',
                    fieldLabel: 'Monthly Base Income',
                    applicationValue: appIncome,
                    documentValue: docIncome,
                    severity: 'CRITICAL',
                    message: `Application states $${appIncome}/mo, but document shows $${docIncome}/mo.`,
                    step: 2 // Employment Step
                });
            }
        }

        // 2. Compare Employer Name
        if (docData.employment?.employerName) {
            const appEmployer = appData.employment[0]?.employerName || '';
            const docEmployer = docData.employment.employerName;

            if (!this.fuzzyMatch(appEmployer, docEmployer)) {
                discrepancies.push({
                    id: 'employer-mismatch',
                    fieldPath: 'employment[0].employerName',
                    fieldLabel: 'Employer Name',
                    applicationValue: appEmployer,
                    documentValue: docEmployer,
                    severity: 'WARNING',
                    message: `Employer name mismatch: '${appEmployer}' vs '${docEmployer}'`,
                    step: 2
                });
            }
        }

        // 3. Compare Assets (Checking/Savings)
        if (docData.assets && docData.assets.length > 0) {
            // Check if total assets match roughly
            const docTotal = docData.assets.reduce((sum, a) => sum + a.balance, 0);
            const appTotal = appData.assets.reduce((sum, a) => sum + (a.cashOrMarketValue || 0), 0);

            // If app has 0 assets but doc has assets, that's a discrepancy
            if (appTotal === 0 && docTotal > 0) {
                discrepancies.push({
                    id: 'asset-missing',
                    fieldPath: 'assets[0].cashOrMarketValue', // Point to first asset slot
                    fieldLabel: 'Total Assets',
                    applicationValue: 0,
                    documentValue: docTotal,
                    severity: 'WARNING',
                    message: `Document shows $${docTotal} in assets, but application lists $0.`,
                    step: 3 // Assets Step
                });
            }
        }

        return discrepancies;
    }

    private static fuzzyMatch(str1: string, str2: string): boolean {
        const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
        const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
        return s1.includes(s2) || s2.includes(s1);
    }
}
