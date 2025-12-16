'use client'

import { LoanReview } from '@/components/LoanReview'
import { LoanApplication } from '@/types/shared'

const mockLoan: LoanApplication = {
    id: 'demo-loan-123',
    borrowerId: 'borrower-1',
    stage: 'Underwriting',
    status: 'Submitted',
    borrower: {
        id: 'borrower-1',
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@example.com',
        phone: '(555) 123-4567',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    property: {
        address: {
            street: '123 Premium Blvd',
            city: 'Beverly Hills',
            state: 'CA',
            zipCode: '90210',
        },
        propertyType: 'SingleFamily',
        purchasePrice: 1250000,
        loanAmount: 1000000,
        downPayment: 250000,
        propertyTaxes: 15000,
        homeownersInsurance: 1800,
        hoaDues: 350,
        floodInsurance: 1200,
        groundRent: 0,
        leaseholdPayments: 0,
        otherHousingExpenses: 0,
    },
    loanType: 'Conventional',
    loanPurpose: 'Purchase',
    loanTerm: 360,
    interestRate: 6.5,
    debtToIncomeRatio: 0.35,
    loanToValueRatio: 0.8,
    monthlyMortgageInsurance: 0,
    transactionDetails: {
        alterationsImprovements: 0,
        land: 0,
        refinanceDebts: 0,
        prepaidItems: 5000,
        closingCosts: 12000,
        pmiMipFundingFee: 0,
        borrowerClosingCosts: 12000,
        sellerCredits: 5000,
        otherCredits: 0,
    },
    employment: {
        employerName: 'Tech Corp Inc.',
        status: 'Employed',
        monthlyIncome: 15000,
        incomeType: 'W2',
    },
    assets: [
        { id: 'a1', type: 'Checking', institution: 'Chase', accountNumber: '****1234', currentBalance: 45000 },
        { id: 'a2', type: 'Savings', institution: 'Chase', accountNumber: '****5678', currentBalance: 120000 },
        { id: 'a3', type: 'Retirement', institution: 'Fidelity', accountNumber: '****9012', currentBalance: 350000 },
    ],
    debts: [
        { id: 'd1', type: 'AutoLoan', creditor: 'BMW Financial', accountNumber: '****3456', monthlyPayment: 850, currentBalance: 45000 },
        { id: 'd2', type: 'CreditCard', creditor: 'Amex Platinum', accountNumber: '****7890', monthlyPayment: 250, currentBalance: 3500 },
    ],
    documents: [
        { id: '1', fileName: 'paystub_jan.pdf', type: 'PayStub', mimeType: 'application/pdf', fileSize: 1024, uploadedBy: 'user-1', storagePath: '/docs/1', loanId: 'demo-loan-123', verificationStatus: 'Verified', uploadedAt: new Date().toISOString() },
        { id: '2', fileName: 'w2_2023.pdf', type: 'W2', mimeType: 'application/pdf', fileSize: 1024, uploadedBy: 'user-1', storagePath: '/docs/2', loanId: 'demo-loan-123', verificationStatus: 'Verified', uploadedAt: new Date().toISOString() },
        { id: '3', fileName: 'bank_statement.pdf', type: 'BankStatement', mimeType: 'application/pdf', fileSize: 1024, uploadedBy: 'user-1', storagePath: '/docs/3', loanId: 'demo-loan-123', verificationStatus: 'NeedsReview', uploadedAt: new Date().toISOString() },
    ],
    underwritingConditions: [
        { id: 'c1', description: 'Verify large deposit of $50,000', status: 'Pending', createdAt: new Date().toISOString(), loanId: 'demo-loan-123', type: 'PriorToDoc' },
        { id: 'c2', description: 'Provide explanation for credit inquiry', status: 'Satisfied', createdAt: new Date().toISOString(), loanId: 'demo-loan-123', type: 'PriorToDoc' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">UI Component Demo</h1>
                    <p className="text-slate-400">Previewing the LoanReview component in isolation</p>
                </div>
                <LoanReview loan={mockLoan} />
            </div>
        </div>
    )
}

