'use client';


import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useDocuments } from '@/context/DocumentContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PreApprovalPage() {
    const { selectedLoan, underwritingResult, documents } = useDocuments();
    const router = useRouter();

    useEffect(() => {
        if (!selectedLoan) {
            router.push('/borrower/loan-options');
        }
    }, [selectedLoan, router]);

    if (!selectedLoan || !underwritingResult) {
        return null;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-background pb-20">

            <div className="pt-32 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Pre-Approval Letter</h1>
                        <div className="space-x-4">
                            <Button variant="outline" onClick={() => window.print()}>
                                Print / Save PDF
                            </Button>
                            <Button className="bg-primary-600 hover:bg-primary-500" onClick={() => router.push('/borrower/dashboard')}>
                                Return to Dashboard
                            </Button>
                        </div>
                    </div>

                    <Card variant="glass" className="bg-white text-slate-900 p-8 md:p-12">
                        <CardContent className="space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-slate-200 pb-8">
                                <div>
                                    <div className="text-2xl font-bold text-primary-700">LenderCo Inc.</div>
                                    <div className="text-sm text-slate-500">123 Financial District, NY 10005</div>
                                    <div className="text-sm text-slate-500">NMLS #123456</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">Date: {currentDate}</div>
                                    <div className="text-sm text-slate-500">Expiration: 90 Days</div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">Pre-Approval Notification</h2>
                                </div>

                                <p>Dear Borrower,</p>

                                <p>
                                    Congratulations! Based on a preliminary review of your credit, income, and assets,
                                    we are pleased to inform you that you are pre-approved for a mortgage loan with LenderCo Inc.
                                </p>

                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">Loan Program</div>
                                            <div className="font-bold text-lg">{selectedLoan.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">Purchase Price (Est)</div>
                                            <div className="font-bold text-lg">$500,000.00</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">Loan Amount</div>
                                            <div className="font-bold text-lg">$450,000.00</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">Interest Rate</div>
                                            <div className="font-bold text-lg">{selectedLoan.interestRate}%</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">LTV</div>
                                            <div className="font-bold text-lg">{underwritingResult.metrics.ltv.toFixed(1)}%</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase">DTI</div>
                                            <div className="font-bold text-lg">{underwritingResult.metrics.dti.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600">
                                    This pre-approval is subject to the following conditions:
                                    <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                        <li>Satisfactory appraisal of the subject property.</li>
                                        <li>Verification of sufficient funds to close.</li>
                                        <li>No material change in financial status or creditworthiness.</li>
                                        <li>Final underwriting approval.</li>
                                    </ul>
                                </p>

                                <p className="text-sm text-slate-600 mt-4">
                                    This letter is not a commitment to lend. A commitment to lend is subject to satisfactory verification
                                    of the information you provided and other conditions.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="pt-8 border-t border-slate-200 mt-12">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="h-12 w-32 border-b border-slate-900 mb-2"></div>
                                        <div className="text-sm font-bold">Authorized Signature</div>
                                        <div className="text-xs text-slate-500">Senior Underwriter</div>
                                    </div>
                                    <div className="text-xs text-slate-400 max-w-xs text-right">
                                        LenderCo Inc. is an Equal Housing Lender. NMLS #123456.
                                        Licensed in all 50 states.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Closing Requirements Section */}
                    <div className="mt-12 animate-fade-in-up">
                        <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">Next Steps: Closing Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card variant="glass" className="border-l-4 border-l-amber-500">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Required Documents</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                        To finalize your loan, we need the following documents based on your selected program ({selectedLoan.name}).
                                    </p>
                                    <div className="space-y-3">
                                        {documents.filter(d => d.status === 'pending').length > 0 ? (
                                            documents.filter(d => d.status === 'pending').map((doc) => (
                                                <div key={doc.id} className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mr-3 text-sm mt-0.5">
                                                        !
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-900 dark:text-white font-medium text-sm">{doc.name}</div>
                                                        {doc.insights && doc.insights.length > 0 && (
                                                            <div className="text-xs text-slate-400 mt-1">{doc.insights[0]}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-green-400 flex items-center">
                                                <span className="mr-2">✓</span> All documents submitted!
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full mt-6 bg-primary-600 hover:bg-primary-500"
                                        onClick={() => router.push('/borrower/dashboard')}
                                    >
                                        Upload Documents Now
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card variant="glass">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">What Happens Next?</h3>
                                    <div className="space-y-6 relative">
                                        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-white/10"></div>

                                        <div className="relative flex items-start pl-10">
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/50">1</div>
                                            <div>
                                                <div className="text-slate-900 dark:text-white font-medium">Pre-Approval</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">You are here! Download your letter.</div>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start pl-10">
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/50">2</div>
                                            <div>
                                                <div className="text-slate-900 dark:text-white font-medium">Upload Conditions</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">Provide the specific documents listed on the left.</div>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start pl-10">
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center border border-white/10">3</div>
                                            <div>
                                                <div className="text-slate-900 dark:text-white font-medium">Final Underwriting</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">Our team verifies your new documents.</div>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start pl-10">
                                            <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center border border-white/10">4</div>
                                            <div>
                                                <div className="text-slate-900 dark:text-white font-medium">Closing</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">Sign your final loan documents.</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

