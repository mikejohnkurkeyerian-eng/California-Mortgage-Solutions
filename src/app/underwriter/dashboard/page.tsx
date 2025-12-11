'use client';

import { Navbar } from '@/components/layout/Navbar';
import { getLoans } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function UnderwriterDashboard() {
    const { data: loans, isLoading } = useQuery({
        queryKey: ['loans'],
        queryFn: async () => getLoans(),
    });

    // Filter for loans submitted to In-House Underwriting
    // In a real app, API would filter. Here we filter locally.
    const queue = loans?.filter(loan =>
        loan.stage === 'Underwriting' ||
        // Also show loans that have been "Submitted to In-House" even if stage varies slightly
        (loan.submissions?.some(s => s.type === 'IN_HOUSE') && loan.status !== 'Closed')
    ) || [];

    return (
        <main className="min-h-screen bg-slate-900">
            <Navbar />

            <div className="pt-32 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Underwriter Queue</h1>
                        <p className="text-slate-400">Manage incoming loan reviews and conditions</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                            <span className="text-slate-400 text-sm mr-2">Pending Review</span>
                            <span className="text-white font-bold">{queue.length}</span>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-slate-400 py-12">Loading queue...</div>
                ) : queue.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                        <div className="text-slate-400 mb-2">No loans in queue</div>
                        <p className="text-sm text-slate-500">Wait for brokers to submit applications.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {queue.map(loan => (
                            <Link key={loan.id} href={`/underwriter/loans/${loan.id}`}>
                                <Card className="bg-slate-800 border-slate-700 hover:border-primary-500 transition-colors cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                                    ${loan.status === 'Conditions Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {loan.borrower?.firstName[0]}{loan.borrower?.lastName[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                                        {loan.borrower?.lastName}, {loan.borrower?.firstName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <span>${loan.property?.loanAmount?.toLocaleString()}</span>
                                                        <span>•</span>
                                                        <span>{loan.property?.address?.city}, {loan.property?.address?.state}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 mb-1">Status</div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium border
                                                         ${loan.status === 'Conditions Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            loan.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                'bg-slate-700 text-slate-300 border-slate-600'}`}>
                                                        {loan.status}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 mb-1">Submitted</div>
                                                    <div className="text-sm text-slate-300">
                                                        {new Date(loan.updatedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Button variant="ghost" className="text-slate-400 group-hover:text-white">
                                                    Review →
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
