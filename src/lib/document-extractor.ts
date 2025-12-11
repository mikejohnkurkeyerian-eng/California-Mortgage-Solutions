import { DocumentType } from './document-ai';

export interface ExtractedDocumentData {
    borrower?: {
        firstName?: string;
        lastName?: string;
        ssn?: string;
        dateOfBirth?: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
    };
    employment?: {
        employerName?: string;
        monthlyIncome?: number;
        status?: string;
        startDate?: string;
    };
    assets?: {
        type: 'Checking' | 'Savings' | 'Investment';
        institution: string;
        balance: number;
        accountNumber?: string;
    }[];
    income?: number; // Generic income field
    documentDate?: string; // Extracted date of the document
}

export class DocumentExtractor {

    static extract(text: string, type: DocumentType): ExtractedDocumentData {
        const lowerText = text.toLowerCase();
        const result: ExtractedDocumentData = {};

        switch (type) {
            case 'W2':
                this.extractW2(lowerText, result);
                break;
            case 'PAY_STUB':
                this.extractPayStub(lowerText, result);
                break;
            case 'ID':
                this.extractID(lowerText, result);
                break;
            case 'BANK_STATEMENT':
                this.extractBankStatement(lowerText, result);
                break;
            case 'TAX_RETURN':
                this.extractTaxReturn(lowerText, result);
                break;
        }

        return result;
    }

    private static extractW2(text: string, result: ExtractedDocumentData) {
        // Employer Name (Box c)
        const employerMatch = text.match(/employer.*?name.*?address\s*([\w\s.,]+?)\s*control number/i) ||
            text.match(/employer's name\s*([\w\s.,]+)/i);
        if (employerMatch) {
            result.employment = result.employment || {};
            result.employment.employerName = employerMatch[1].trim();
        }

        // Wages (Box 1)
        const wagesMatch = text.match(/wages, tips, other compensation\s*([\d,]+\.?\d*)/i) ||
            text.match(/box 1\s*([\d,]+\.?\d*)/i);
        if (wagesMatch) {
            const annualIncome = parseFloat(wagesMatch[1].replace(/,/g, ''));
            result.employment = result.employment || {};
            result.employment.monthlyIncome = Math.round(annualIncome / 12);
            result.income = result.employment.monthlyIncome;
            result.employment.status = 'Employed';
        }

        // SSN (Box a)
        const ssnMatch = text.match(/social security number\s*(\d{3}-\d{2}-\d{4})/i);
        if (ssnMatch) {
            result.borrower = result.borrower || {};
            result.borrower.ssn = ssnMatch[1];
        }

        // Year (often at top)
        const yearMatch = text.match(/\b20\d{2}\b/);
        if (yearMatch) {
            result.documentDate = `${yearMatch[0]}-12-31`; // Assume end of year for W2
        }
    }

    private static extractPayStub(text: string, result: ExtractedDocumentData) {
        // Gross Pay
        const grossPayMatch = text.match(/gross pay\s*[\$]?\s*([\d,]+\.?\d*)/i) ||
            text.match(/total gross\s*[\$]?\s*([\d,]+\.?\d*)/i);

        // Pay Frequency (Simple heuristic)
        let frequency = 24; // Default to semi-monthly
        if (text.includes('weekly')) frequency = 52;
        else if (text.includes('bi-weekly') || text.includes('biweekly')) frequency = 26;
        else if (text.includes('monthly')) frequency = 12;

        if (grossPayMatch) {
            const periodPay = parseFloat(grossPayMatch[1].replace(/,/g, ''));
            result.employment = result.employment || {};
            result.employment.monthlyIncome = Math.round((periodPay * frequency) / 12);
            result.income = result.employment.monthlyIncome;
            result.employment.status = 'Employed';
        }

        // Employer
        const employerMatch = text.match(/employer\s*:\s*([\w\s.,]+)/i);
        if (employerMatch) {
            result.employment = result.employment || {};
            result.employment.employerName = employerMatch[1].trim();
        }

        // Pay Date / Period End
        const dateMatch = text.match(/(?:pay|check|advice|period)\s*(?:date|ending)\s*[:]?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
        if (dateMatch) {
            result.documentDate = dateMatch[1];
        }
    }

    private static extractID(text: string, result: ExtractedDocumentData) {
        // Name (First Last)
        // Heuristic: Look for "FN" or "LN" or just assume top lines if DL format known
        // This is hard with just text, so we'll look for common patterns
        const nameMatch = text.match(/ln\s*([a-z]+)\s*fn\s*([a-z]+)/i); // Common DL format
        if (nameMatch) {
            result.borrower = result.borrower || {};
            result.borrower.lastName = nameMatch[1];
            result.borrower.firstName = nameMatch[2];
        }

        // DOB
        const dobMatch = text.match(/dob\s*(\d{2}\/\d{2}\/\d{4})/i) ||
            text.match(/birth\s*date\s*(\d{2}\/\d{2}\/\d{4})/i);
        if (dobMatch) {
            result.borrower = result.borrower || {};
            result.borrower.dateOfBirth = dobMatch[1];
        }

        // Address
        const addressMatch = text.match(/address\s*([\w\s]+?)\s*city\s*([\w\s]+?)\s*state\s*(\w{2})\s*zip\s*(\d{5})/i);
        // Note: DL addresses are often unstructured in OCR. We'll skip complex address parsing for now unless clear labels exist.
    }

    private static extractBankStatement(text: string, result: ExtractedDocumentData) {
        // Ending Balance
        const balanceMatch = text.match(/ending balance\s*[\$]?\s*([\d,]+\.?\d*)/i) ||
            text.match(/new balance\s*[\$]?\s*([\d,]+\.?\d*)/i);

        // Institution
        let institution = 'Unknown Bank';
        if (text.includes('chase')) institution = 'Chase';
        else if (text.includes('wells fargo')) institution = 'Wells Fargo';
        else if (text.includes('bank of america')) institution = 'Bank of America';

        if (balanceMatch) {
            result.assets = result.assets || [];
            result.assets.push({
                type: 'Checking', // Default
                institution,
                balance: parseFloat(balanceMatch[1].replace(/,/g, '')),
                accountNumber: 'XXXX' // Masked
            });
        }

        // Statement Date
        const dateMatch = text.match(/(?:statement|period)\s*(?:date|ending)\s*[:]?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
        if (dateMatch) {
            result.documentDate = dateMatch[1];
        }
    }

    private static extractTaxReturn(text: string, result: ExtractedDocumentData) {
        // Adjusted Gross Income (Line 11 on 2023 1040)
        const agiMatch = text.match(/adjusted gross income\s*[\$]?\s*([\d,]+\.?\d*)/i);
        if (agiMatch) {
            const annualIncome = parseFloat(agiMatch[1].replace(/,/g, ''));
            result.employment = result.employment || {};
            result.employment.monthlyIncome = Math.round(annualIncome / 12);
            result.income = result.employment.monthlyIncome;
            result.employment.status = 'Self-Employed'; // Assumption for tax returns often
        }
    }
}
