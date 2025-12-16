'use client';

import { LoanApplication } from '@/types/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Form1003ViewProps {
    loan: LoanApplication;
}

export function Form1003View({ loan }: Form1003ViewProps) {
    const { borrower, property, employment, assets, debts, loanPurpose } = loan;
    const loanAmount = property?.loanAmount || 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center border-b border-white/10 pb-6">
                <h2 className="text-2xl font-bold text-white">Uniform Residential Loan Application</h2>
                <p className="text-slate-400">Freddie Mac Form 65 • Fannie Mae Form 1003</p>
            </div>

            {/* Section 1: Borrower Information */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 1: Borrower Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">1a. Personal Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Name:</span>
                                    <span className="text-white font-medium">{borrower.firstName} {borrower.lastName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">SSN:</span>
                                    <span className="text-white font-medium">{borrower.ssn || '***-**-****'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">DOB:</span>
                                    <span className="text-white font-medium">{borrower.dateOfBirth || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Phone:</span>
                                    <span className="text-white font-medium">{borrower.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Email:</span>
                                    <span className="text-white font-medium">{borrower.email}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Current Address</h3>
                            <div className="p-4 bg-white/5 rounded-lg">
                                <p className="text-white">
                                    {/* Assuming borrower address is stored somewhere, using property address as fallback if not explicitly in borrower object for this demo */}
                                    {property.address.street}<br />
                                    {property.address.city}, {property.address.state} {property.address.zipCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-2">1b. Current Employment/Self-Employment and Income</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-xs text-slate-500 uppercase">Employer</div>
                                <div className="text-white font-medium">{employment.employerName || 'N/A'}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-xs text-slate-500 uppercase">Status</div>
                                <div className="text-white font-medium">{employment.status}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <div className="text-xs text-slate-500 uppercase">Monthly Income</div>
                                <div className="text-white font-medium text-lg text-green-400">
                                    ${employment.monthlyIncome?.toLocaleString() || '0'}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Financial Information - Assets and Liabilities */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 2: Financial Information - Assets and Liabilities</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-2">2a. Assets - Bank Accounts, Retirement, and Other Accounts</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-white/5">
                                    <tr>
                                        <th className="px-4 py-2 rounded-l-lg">Account Type</th>
                                        <th className="px-4 py-2">Institution</th>
                                        <th className="px-4 py-2">Account #</th>
                                        <th className="px-4 py-2 text-right rounded-r-lg">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {assets.map((asset) => (
                                        <tr key={asset.id}>
                                            <td className="px-4 py-2 text-white">{asset.type}</td>
                                            <td className="px-4 py-2 text-slate-300">{asset.institution}</td>
                                            <td className="px-4 py-2 text-slate-400">{asset.accountNumber}</td>
                                            <td className="px-4 py-2 text-right text-green-400 font-medium">
                                                ${asset.currentBalance.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-white/5 font-bold">
                                        <td colSpan={3} className="px-4 py-2 text-right text-white">Total Assets</td>
                                        <td className="px-4 py-2 text-right text-green-400">
                                            ${assets.reduce((sum, a) => sum + a.currentBalance, 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-2">2c. Liabilities - Credit Cards, Other Debts</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-white/5">
                                    <tr>
                                        <th className="px-4 py-2 rounded-l-lg">Account Type</th>
                                        <th className="px-4 py-2">Creditor</th>
                                        <th className="px-4 py-2">Account #</th>
                                        <th className="px-4 py-2 text-right">Monthly Payment</th>
                                        <th className="px-4 py-2 text-right rounded-r-lg">Unpaid Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {debts.map((debt) => (
                                        <tr key={debt.id}>
                                            <td className="px-4 py-2 text-white">{debt.type}</td>
                                            <td className="px-4 py-2 text-slate-300">{debt.creditor}</td>
                                            <td className="px-4 py-2 text-slate-400">{debt.accountNumber}</td>
                                            <td className="px-4 py-2 text-right text-white">
                                                ${debt.monthlyPayment.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 text-right text-white">
                                                ${debt.currentBalance.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-white/5 font-bold">
                                        <td colSpan={3} className="px-4 py-2 text-right text-white">Total Liabilities</td>
                                        <td className="px-4 py-2 text-right text-red-400">
                                            ${debts.reduce((sum, d) => sum + d.monthlyPayment, 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-right text-white">
                                            ${debts.reduce((sum, d) => sum + d.currentBalance, 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Financial Information - Real Estate */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 3: Financial Information - Real Estate</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-slate-400 italic">No additional real estate owned declared.</p>
                </CardContent>
            </Card>

            {/* Section 4: Loan and Property Information */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 4: Loan and Property Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">4a. Loan and Property Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Loan Amount:</span>
                                    <span className="text-white font-medium">${(loanAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Loan Purpose:</span>
                                    <span className="text-white font-medium">{loanPurpose}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Property Address:</span>
                                    <span className="text-white font-medium">
                                        {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Property Value:</span>
                                    <span className="text-white font-medium">${(property?.purchasePrice || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Occupancy:</span>
                                    <span className="text-white font-medium">Primary Residence</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-2">4b. Other New Mortgage Loans</h3>
                            <p className="text-slate-500 text-sm">Does not apply</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Declarations */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 5: Declarations</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-300 text-sm pr-4">5a. About this Property and Your Money for this Loan</p>
                            <span className="text-white font-bold">No</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <p className="text-slate-300 text-sm pr-4">5b. About Your Finances</p>
                            <span className="text-white font-bold">No</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 6: Acknowledgments and Agreements */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 6: Acknowledgments and Agreements</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-slate-400 text-sm">
                        I acknowledge and agree that... [Standard 1003 Legal Text Placeholder]
                    </p>
                    <div className="mt-4 flex items-center space-x-2">
                        <div className="h-4 w-4 rounded border border-primary-500 bg-primary-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-white font-medium">Electronically Signed by {borrower.firstName} {borrower.lastName}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Section 7: Military Service */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 7: Military Service</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-slate-400">Military Service: <span className="text-white font-medium">No</span></p>
                </CardContent>
            </Card>

            {/* Section 8: Demographic Information */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 8: Demographic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-slate-400">The borrower has chosen not to provide this information.</p>
                </CardContent>
            </Card>

            {/* Section 9: Loan Originator Information */}
            <Card variant="glass">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-lg">Section 9: Loan Originator Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-slate-400">Organization:</span>
                                <span className="text-white font-medium">Best Mortgage Co</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-slate-400">Address:</span>
                                <span className="text-white font-medium">123 Broker Lane, Finance City, NY</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-slate-400">Originator:</span>
                                <span className="text-white font-medium">Jane Broker</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-slate-400">NMLS ID:</span>
                                <span className="text-white font-medium">98765</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

