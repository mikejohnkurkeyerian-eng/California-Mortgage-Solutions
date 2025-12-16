import { Full1003Data } from '@/types/form-1003';
import { DocumentRequirement } from '@/context/DocumentContext';
import { FormIntelligenceService } from './form-intelligence';

export interface MiniAUSResult {
    passed: boolean;
    errors: string[];
    warnings: string[];
}

export class MiniAUSService {

    static runPreCheck(data: Full1003Data, documents: DocumentRequirement[]): MiniAUSResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // 1. DATA VALIDATION (Blocking)
        const missingFieldCount = FormIntelligenceService.countMissingFields(data);
        if (missingFieldCount > 0) {
            errors.push(`Application has ${missingFieldCount} incomplete required fields.`);
        }

        // 2. LOGIC VALIDATION (Blocking)
        // LTV Check
        const loanAmount = data.loanAndProperty.loanAmount || 0;
        const propertyValue = data.loanAndProperty.propertyValue || 0;
        if (propertyValue > 0) {
            const ltv = (loanAmount / propertyValue) * 100;
            if (ltv > 97) {
                errors.push(`LTV (${ltv.toFixed(1)}%) exceeds maximum of 97%.`);
            }
        }

        // DTI Check (Simplified)
        const totalMonthlyIncome = data.employment.reduce((sum, emp) => sum + (emp.monthlyIncome.total || 0), 0);
        const totalLiabilities = data.liabilities.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);
        // Estimate PITI (Principal, Interest, Taxes, Insurance)
        // Assuming 7% rate for estimation
        const annualRate = 0.07;
        const monthlyRate = annualRate / 12;
        const numPayments = 360;
        let pmi = 0;
        let principalAndInterest = 0;

        if (loanAmount > 0) {
            principalAndInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        if (propertyValue > 0 && (loanAmount / propertyValue) > 0.80) {
            pmi = (loanAmount * 0.005) / 12; // Approx 0.5% PMI
        }
        const taxesAndInsurance = (propertyValue * 0.0125) / 12; // Approx 1.25% Tax/Ins
        const proposedHousingExpense = principalAndInterest + taxesAndInsurance + pmi;

        if (totalMonthlyIncome > 0) {
            const backEndDTI = ((totalLiabilities + proposedHousingExpense) / totalMonthlyIncome) * 100;
            if (backEndDTI > 50) {
                errors.push(`Debt-to-Income Ratio (${backEndDTI.toFixed(1)}%) is too high (Max 50%).`);
            }
        } else if (loanAmount > 0) {
            errors.push('No monthly income reported.');
        }


        // 3. DOCUMENT VALIDATION (Blocking)
        // Check Required Docs
        const requiredDocs = documents.filter(d => d.required);
        const missingDocs = requiredDocs.filter(d => d.status !== 'uploaded' && d.status !== 'verified');

        if (missingDocs.length > 0) {
            errors.push(`Missing required documents: ${missingDocs.map(d => d.name).join(', ')}.`);
        }

        // 4. SMART CONTENT CHECK (Year Verification)
        // Check if Paystubs cover distinct periods (simplified to distinct dates/years in text)
        // Check if Tax Returns/W2s cover distinct years

        const yearRegex = /\b(20\d{2})\b/g;

        // Helper to extract years from doc text
        const getYearsFromDoc = (doc: DocumentRequirement): Set<string> => {
            const years = new Set<string>();
            doc.files.forEach(f => {
                if (f.extractedText) {
                    const matches = f.extractedText.match(yearRegex);
                    if (matches) {
                        matches.forEach(y => {
                            // Reasonable range check (e.g. 2018-2026) to avoid stray numbers
                            const yearNum = parseInt(y);
                            if (yearNum >= 2018 && yearNum <= 2026) {
                                years.add(y);
                            }
                        });
                    }
                }
            });
            return years;
        };

        // Validate W2s (Expect distinct years if multiple are required/provided)
        const w2Docs = documents.filter(d => d.type === 'W2');
        if (w2Docs.length > 0) {
            const allW2Years: string[] = [];
            w2Docs.forEach(doc => {
                const docYears = getYearsFromDoc(doc);
                // If we found years, add the most prominent one (or all)
                // Heuristic: If we find "2023" multiple times, it's likely a 2023 doc.
                if (docYears.size > 0) {
                    // For now, just dump found years
                    allW2Years.push(...Array.from(docYears));
                }
            });

            // If we have multiple W2 files uploaded but they all seem to be the same year...
            // This is tricky because one doc might contain 2022 and 2023 references.
            // Better logic: iterate through FILES in the W2 requirement.



            // [STRICT] W2 Year Count Check
            w2Docs.forEach(docRequirement => {
                // 1. Check if requirement asks for "2 years"
                const requiresTwoYears = docRequirement.name.toLowerCase().includes('2 years');

                if (requiresTwoYears) {
                    // Get all years found across all files in this requirement
                    const allYears = new Set<string>();
                    docRequirement.files.forEach(f => {
                        if (f.extractedText) {
                            const matches = f.extractedText.match(yearRegex);
                            if (matches) {
                                matches.forEach(y => {
                                    const val = parseInt(y);
                                    if (val >= 2018 && val <= 2026) allYears.add(y);
                                });
                            }
                        }
                    });

                    if (allYears.size < 2) {
                        errors.push(`Requirement "${docRequirement.name}" was not met. We detected ${allYears.size} year(s) (${Array.from(allYears).join(', ')}) but 2 distinct years are required.`);
                    }
                }

                // 2. Check for Duplicates (Existing Logic)
                if (docRequirement.files.length > 1) {
                    // ... (keep existing duplicate check if useful, or rely on the set check above)
                    // The Set check above covers "Same Year" error implicitly because size < 2.
                    // So we can simplify or keep detailed warning.
                }
            });
        }

        // Similar check for Paystubs (Check for different dates)
        // Paystubs usually have "Period Ending: MM/DD/YYYY"
        const paystubDocs = documents.filter(d => d.type === 'PAY_STUB');
        paystubDocs.forEach(doc => {
            if (doc.files.length > 1) {
                const dates = new Set();
                doc.files.forEach(f => {
                    // Look for date patterns MM/DD/YYYY
                    const dateMatch = f.extractedText?.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
                    if (dateMatch) dates.add(dateMatch[0]);
                });

                if (dates.size < doc.files.length && dates.size > 0) {
                    // Note: This is aggressive, might be false positive if OCR fails. Use Warning.
                    warnings.push("Some paystubs appear to have the same dates. Please ensure they are consecutive.");
                }
            }
        });


        return {
            passed: errors.length === 0,
            errors,
            warnings
        };
    }
}

// Helper
function extractedYearCount(years: string[]) {
    return years.length > 0;
}
