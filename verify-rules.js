import { determineRequiredDocuments } from './src/lib/document-requirements.js';
const mockW2Loan = {
    id: '1', borrowerId: 'b1', status: 'Draft',
    borrower: { id: 'b1', firstName: 'John', lastName: 'Doe', email: 'j@d.com', phone: '123' },
    employment: { incomeType: 'W2', monthlyIncome: 5000 },
    assets: [{ type: 'Checking', value: 10000 }],
    property: { address: { street: '123 Main', city: 'Anytown', state: 'CA', zipCode: '90210' }, propertyType: 'SingleFamily', purchasePrice: 500000, loanAmount: 400000 },
    full1003: {
        employment: [{ isSelfEmployed: false, isCurrent: true, employerName: 'Acme', monthlyIncome: 5000 }],
        assets: [{ type: 'Checking', value: 10000 }],
        loanAndProperty: { loanPurpose: 'Purchase' }
    }
};
const mockSelfEmployedLoan = Object.assign(Object.assign({}, mockW2Loan), {
    employment: { incomeType: 'SelfEmployed', monthlyIncome: 8000 }, full1003: {
        employment: [{ isSelfEmployed: true, isCurrent: true, employerName: 'MyBiz', monthlyIncome: 8000 }],
        assets: [{ type: 'Checking', value: 20000 }],
        loanAndProperty: { loanPurpose: 'Refinance' },
        realEstate: [{ status: 'Retained', address: { street: '123 Main' } }]
    }
});
console.log("--- W2 SCENARIO ---");
const w2Docs = determineRequiredDocuments(mockW2Loan);
console.log(w2Docs.map(d => d.name));
console.log("\n--- SELF-EMPLOYED SCENARIO ---");
const seDocs = determineRequiredDocuments(mockSelfEmployedLoan);
console.log(seDocs.map(d => d.name));
