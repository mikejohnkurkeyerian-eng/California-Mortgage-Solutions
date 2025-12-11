// Local type definitions to avoid missing module issues
export interface LoanApplication {
    borrower: BorrowerProfile;
    property: PropertyInfo;
    employment: EmploymentInfo;
    assets: Asset[];
    debts: Debt[];
    transactionDetails: TransactionDetails;
    loanPurpose?: string;
}

export interface BorrowerProfile {
    firstName?: string;
    lastName?: string;
    ssn?: string;
    dateOfBirth?: string;
    email?: string;
    phone?: string;
}

export interface PropertyInfo {
    address: Address;
    loanAmount?: number;
    purchasePrice?: number;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface EmploymentInfo {
    employerName?: string;
    monthlyIncome?: number;
    incomeType?: string;
    status?: string;
}

export interface Asset {
    id?: string;
    type: string;
    institution?: string;
    currentBalance?: number;
    accountNumber?: string;
}

export interface Debt {
    // Placeholder
}

export interface TransactionDetails {
    // Placeholder
}

export class Form1003Parser {

    static parse(text: string): Partial<LoanApplication> {
        const lowerText = text.toLowerCase();
        const app: Partial<LoanApplication> = {
            borrower: {} as BorrowerProfile,
            property: { address: {} } as PropertyInfo,
            employment: {} as EmploymentInfo,
            assets: [],
            debts: [],
            transactionDetails: {} as TransactionDetails
        };

        // --- Section 1: Borrower Information ---
        this.parseBorrowerInfo(lowerText, app);

        // --- Section 2: Financial Information (Assets & Liabilities) ---
        this.parseAssetsAndLiabilities(lowerText, app);

        // --- Section 3: Financial Information (Real Estate) ---
        // (Complex table parsing omitted for brevity, placeholder)

        // --- Section 4: Loan and Property Information ---
        this.parseLoanAndPropertyInfo(lowerText, app);

        // --- Section 5: Declarations ---
        // (Yes/No parsing logic would go here)

        // --- Section 9: Loan Originator Information ---
        this.parseLoanOriginatorInfo(lowerText, app);

        return app;
    }

    private static parseBorrowerInfo(text: string, app: Partial<LoanApplication>) {
        // Name
        const nameMatch = text.match(/name\s*\(first,\s*middle,\s*last,?\s*suffix\)\s*([a-z\s]+?)(?=\s*social security)/i) ||
            text.match(/borrower name\s*:\s*([a-z\s]+)/i);
        if (nameMatch) {
            const fullName = nameMatch[1].trim().split(/\s+/);
            if (fullName.length > 0) {
                app.borrower!.firstName = fullName[0];
                app.borrower!.lastName = fullName.length > 1 ? fullName[fullName.length - 1] : '';
            }
        }

        // SSN
        const ssnMatch = text.match(/social security number\s*(\d{3}-\d{2}-\d{4})/i);
        if (ssnMatch) app.borrower!.ssn = ssnMatch[1];

        // DOB
        const dobMatch = text.match(/date of birth\s*\(mm\/dd\/yyyy\)\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
        if (dobMatch) app.borrower!.dateOfBirth = dobMatch[1];

        // Phone
        const phoneMatch = text.match(/(?:home|cell|work)\s*phone\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/i);
        if (phoneMatch) app.borrower!.phone = `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;

        // Email
        const emailMatch = text.match(/email\s*([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
        if (emailMatch) app.borrower!.email = emailMatch[1];

        // Current Address
        const addressMatch = text.match(/current address\s*street\s*([\w\s]+?)\s*unit #\s*([\w\s]*)city\s*([\w\s]+?)\s*state\s*(\w{2})\s*zip\s*(\d{5})/i);
        if (addressMatch) {
            app.borrower!.firstName = app.borrower!.firstName || "Unknown"; // Ensure defined
            // Note: Address structure in LoanApplication is usually under 'property' or separate 'borrower.address' if extended.
            // Assuming we map it to a temporary location or just log it for now as BorrowerProfile doesn't have address in shared-types explicitly shown in view.
            // Wait, shared-types showed BorrowerProfile WITHOUT address. Let's assume we might need to add it or it's just not there.
            // However, PropertyInfo has address.
        }

        // Employment
        const employerMatch = text.match(/employer or business name\s*([\w\s.,]+?)\s*phone/i);
        if (employerMatch) app.employment!.employerName = employerMatch[1].trim();

        const incomeMatch = text.match(/gross monthly income\s*base\s*\$\s*([\d,]+\.?\d*)/i);
        if (incomeMatch) {
            app.employment!.monthlyIncome = parseFloat(incomeMatch[1].replace(/,/g, ''));
            app.employment!.incomeType = 'W2'; // Default assumption
            app.employment!.status = 'Employed';
        }
    }

    private static parseAssetsAndLiabilities(text: string, app: Partial<LoanApplication>) {
        // Assets - Bank Accounts
        // Look for "Checking" or "Savings" followed by amounts
        const assetMatches = text.matchAll(/(checking|savings|money market)\s*.*?([\d,]+\.\d{2})/gi);
        for (const match of assetMatches) {
            app.assets!.push({
                id: Math.random().toString(36).substr(2, 9),
                type: match[1].toLowerCase().includes('check') ? 'Checking' : 'Savings',
                institution: 'Unknown Bank', // Hard to extract without strict table structure
                currentBalance: parseFloat(match[2].replace(/,/g, '')),
                accountNumber: 'XXXX'
            });
        }

        // Liabilities
        // Look for "Revolving" or "Installment"
        // This is very fuzzy on OCR text without coordinates.
        // We'll try to find "Monthly Payment" patterns near "Credit Cards"
    }

    private static parseLoanAndPropertyInfo(text: string, app: Partial<LoanApplication>) {
        // Loan Amount
        const loanAmountMatch = text.match(/loan amount\s*\$\s*([\d,]+\.?\d*)/i);
        if (loanAmountMatch) {
            app.property!.loanAmount = parseFloat(loanAmountMatch[1].replace(/,/g, ''));
        }

        // Purchase Price (often same as Property Value in Purchase)
        const priceMatch = text.match(/purchase price\s*\$\s*([\d,]+\.?\d*)/i);
        if (priceMatch) {
            app.property!.purchasePrice = parseFloat(priceMatch[1].replace(/,/g, ''));
        }

        // Property Address
        const propAddressMatch = text.match(/property address\s*street\s*([\w\s]+?)\s*city\s*([\w\s]+?)\s*state\s*(\w{2})\s*zip\s*(\d{5})/i);
        if (propAddressMatch) {
            app.property!.address = {
                street: propAddressMatch[1].trim(),
                city: propAddressMatch[2].trim(),
                state: propAddressMatch[3].toUpperCase(),
                zipCode: propAddressMatch[4],
                country: 'USA'
            };
        }

        // Loan Purpose
        if (text.includes('loan purpose') && text.includes('purchase')) app.loanPurpose = 'Purchase';
        else if (text.includes('refinance')) app.loanPurpose = 'Refinance';
    }

    private static parseLoanOriginatorInfo(text: string, app: Partial<LoanApplication>) {
        // Loan Officer Info
        const loNameMatch = text.match(/loan originator name\s*([a-z\s]+)/i);
        // We don't have a direct field for LO Name in LoanApplication (just ID), but we could store it in metadata if needed.
    }
}
