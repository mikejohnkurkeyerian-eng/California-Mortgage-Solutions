'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { classifyDocument, DocumentType } from '@/lib/document-ai';

export default function VerifyUniversalPage() {
    const [results, setResults] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTests = async () => {
        setIsRunning(true);
        setResults([]);

        const testCases = [
            {
                name: "1040 Tax Return",
                expected: "TAX_RETURN",
                content: "Form 1040 U.S. Individual Income Tax Return 2024. Department of the Treasury - Internal Revenue Service. Filing Status: Single. Exemptions."
            },
            {
                name: "1120-S Corp Return",
                expected: "TAX_RETURN",
                content: "Form 1120-S U.S. Income Tax Return for an S Corporation. Deductions. Tax and Payments. Schedule K-1 Shareholder's Share of Income."
            },
            {
                name: "W-2 Wage Statement",
                expected: "W2",
                content: "Form W-2 Wage and Tax Statement 2024. Employer Identification Number 12-3456789. Box 1 Wages, tips, other compensation. Federal income tax withheld."
            },
            {
                name: "ADP Pay Stub",
                expected: "PAY_STUB",
                content: "ADP Earnings Statement. Period Ending: 12/31/2024. Gross Pay: $5,000.00. Net Pay: $3,500.00. Year to Date. Deductions: Federal Tax, Medicare."
            },
            {
                name: "Generic Pay Stub (No Brand)",
                expected: "PAY_STUB",
                content: "Check Date: 01/15/2025. Advice of Deposit. Regular Hours: 40. Overtime: 5. Rate: $25.00. Social Security Tax. Medicare Tax. Direct Deposit Distribution."
            },
            {
                name: "Wells Fargo Bank Stmt",
                expected: "BANK_STATEMENT",
                content: "Wells Fargo Bank Statement. Account Summary. Beginning Balance: $10,000.00. Ending Balance: $12,000.00. Deposits and Credits. Withdrawals. Account Number."
            },
            {
                name: "CA Driver License",
                expected: "ID",
                content: "Driver License. State of California. Class C. EXP 01/01/2028. LN D1234567. DOB 05/15/1985. SEX M. HGT 5-10. WGT 180. ISS 01/01/2023."
            },
            {
                name: "1099-NEC Contractor",
                expected: "FORM_1099",
                content: "Form 1099-NEC Nonemployee Compensation. Payer's TIN. Recipient's TIN. Federal income tax withheld. 2024."
            },
            {
                name: "Vanguard 401k",
                expected: "ASSET_STATEMENT",
                content: "Vanguard Retirement Savings Trust. 401(k) Plan. Portfolio Summary. Vested Balance. Asset Allocation. Investment Account."
            },
            {
                name: "Divorce Decree",
                expected: "DIVORCE_DECREE",
                content: "Superior Court of California. Decree of Dissolution of Marriage. Final Judgment. Petitioner: John Doe. Respondent: Jane Doe. Spousal Support. Child Custody."
            },
            {
                name: "Closing Disclosure",
                expected: "CLOSING_DISCLOSURE",
                content: "Closing Disclosure. This form is a statement of final loan terms and closing costs. Loan Amount. Interest Rate. Cash to Close."
            },
            {
                name: "Generic Invoice (Negative)",
                expected: "OTHER",
                content: "Invoice #1001. Bill To: John Smith. Services Rendered: Consulting. Total Due: $500.00. Please pay within 30 days."
            }
        ];

        const newResults = [];

        for (const test of testCases) {
            const file = new File([test.content], "test_file.txt", { type: "text/plain" });
            const result = await classifyDocument(file);

            newResults.push({
                name: test.name,
                expected: test.expected,
                actual: result.type,
                confidence: result.confidence.toFixed(2),
                passed: result.type === test.expected,
                details: result.extractedText?.substring(0, 50) + "..."
            });
        }

        setResults(newResults);
        setIsRunning(false);
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8">Universal Training Verification</h1>

                    <Card variant="glass" className="mb-8">
                        <CardHeader>
                            <CardTitle>Test Suite</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Running comprehensive tests against the new "Universal Document Training" logic.
                                This simulates 11 different document types including Tax Returns, W-2s, IDs, and more.
                            </p>
                            <Button
                                onClick={runTests}
                                disabled={isRunning}
                                className="bg-primary-500 hover:bg-primary-600 text-white"
                            >
                                {isRunning ? 'Running Tests...' : 'Run Comprehensive Tests'}
                            </Button>
                        </CardContent>
                    </Card>

                    {results.length > 0 && (
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {results.map((res, idx) => (
                                        <div key={idx} className={`p-3 rounded border flex justify-between items-center ${res.passed
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-red-500/10 border-red-500/30'
                                            }`}>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{res.name}</div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                                    Expected: <span className="text-slate-800 dark:text-slate-300">{res.expected}</span> |
                                                    Actual: <span className={res.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{res.actual}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold ${res.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                                    {res.passed ? "PASS" : "FAIL"}
                                                </div>
                                                <div className="text-xs text-slate-500">Conf: {res.confidence}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    );
}
