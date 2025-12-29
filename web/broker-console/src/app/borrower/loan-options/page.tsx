'use client';


import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useDocuments } from '@/context/DocumentContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoanOptionsPage() {
    const { underwritingResult, applicationStatus, generatePreApproval } = useDocuments();
    const router = useRouter();

    useEffect(() => {
        if (applicationStatus === 'draft') {
            router.push('/borrower/dashboard');
        }
    }, [applicationStatus, router]);

    if (!underwritingResult) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analyzing your application...</h2>
                    <p className="text-slate-600 dark:text-slate-400">Our AI underwriter is reviewing your documents.</p>
                </div>
            </main>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <main className="min-h-screen bg-background">

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">Your Approved Loan Options</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Based on your verified income and assets, you qualify for the following programs.</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <Card variant="glass">
                            <CardContent className="pt-6 text-center">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Income</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(underwritingResult.metrics.monthlyIncome)}</div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="pt-6 text-center">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Debts</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(underwritingResult.metrics.monthlyDebts)}</div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="pt-6 text-center">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Debt-to-Income (DTI)</div>
                                <div className={`text-2xl font-bold ${underwritingResult.metrics.dti > 43 ? 'text-amber-400' : 'text-green-400'}`}>
                                    {underwritingResult.metrics.dti.toFixed(1)}%
                                </div>
                            </CardContent>
                        </Card>
                        <Card variant="glass">
                            <CardContent className="pt-6 text-center">
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Loan-to-Value (LTV)</div>
                                <div className="text-2xl font-bold text-blue-400">{underwritingResult.metrics.ltv.toFixed(1)}%</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Eligible Programs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {underwritingResult.eligiblePrograms.map((program) => (
                            <Card key={program.id} variant="glass" className="border-t-4 border-t-green-500 relative overflow-hidden group hover:border-t-green-400 transition-colors">
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    APPROVED
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{program.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{program.interestRate}%</div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Interest Rate (APR {program.interestRate + 0.125}%)</div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-white/10">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Term</span>
                                                <span className="text-slate-900 dark:text-white">30 Years</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Down Payment</span>
                                                <span className="text-slate-900 dark:text-white">{100 - program.maxLTV}%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Min Credit Score</span>
                                                <span className="text-slate-900 dark:text-white">{program.minCreditScore}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-500"
                                            onClick={async () => {
                                                await generatePreApproval(program.id);
                                                router.push('/borrower/pre-approval');
                                            }}
                                        >
                                            Select This Loan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Ineligible Programs */}
                    {/* Ineligible Programs - Removed for now as not supported by AUS result yet */}
                    {/* {underwritingResult.ineligiblePrograms.length > 0 && (
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">Other Programs Considered</h3>
                            <div className="space-y-4">
                                {underwritingResult.ineligiblePrograms.map((program, idx) => (
                                    <div key={program.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between opacity-75">
                                        <div>
                                            <div className="text-white font-medium">{program.name}</div>
                                            <div className="text-sm text-slate-400">Rate: {program.interestRate}%</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs border border-red-500/20">
                                                Not Eligible
                                            </span>
                                            <div className="text-xs text-red-400 mt-1">
                                                {underwritingResult.notes[idx].split(': ')[1]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">Not sure which option is best for you?</p>
                        <Button variant="outline" size="lg">
                            Talk to your Loan Officer
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

