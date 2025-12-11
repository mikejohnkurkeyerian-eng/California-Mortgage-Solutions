'use client';

import { Navbar } from '@/components/layout/Navbar';
import { LoanCard } from '@/components/LoanCard';
import { Button } from '@/components/ui/Button';
import { getLoans } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { LoanApplication } from '@loan-platform/shared-types';

export default function BrokerLoansPage() {
    const { data: loans, isLoading, error } = useQuery({
        queryKey: ['loans'],
        queryFn: async () => {
            console.log('Fetching loans...');
            try {
                const res = await getLoans();
                console.log('Loans fetched:', res);
                return res;
            } catch (err) {
                console.error('Error fetching loans:', err);
                throw err;
            }
        },
    });

    if (error) {
        return (
            <div className="min-h-screen bg-background pt-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-red-500 mb-4">Error loading loans: {(error as Error).message}</div>
                    <button onClick={() => window.location.reload()} className="text-primary-400 hover:underline">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Loan Applications</h1>
                            <p className="text-slate-600 dark:text-slate-400">Manage and review borrower applications</p>
                        </div>
                        <Link href="/broker/settings">
                            <Button variant="outline" className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="text-slate-600 dark:text-slate-400">Loading applications...</div>
                        </div>
                    ) : !loans || loans.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
                            <p className="text-slate-600 dark:text-slate-400">New loan applications will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loans.map((loan) => (
                                <LoanCard key={loan.id} loan={loan} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
