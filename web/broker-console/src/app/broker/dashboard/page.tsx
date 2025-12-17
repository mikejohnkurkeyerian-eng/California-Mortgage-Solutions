'use client';

import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { Button } from '@/components/ui/Button';
import { LoanCard } from '@/components/LoanCard';
import { getLoans } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoanApplication } from '@/types/shared';
import { InvitationLink } from '@/components/broker/InvitationLink';

export default function BrokerDashboardPage() {
    const { data: loans, isLoading, error } = useQuery({
        queryKey: ['loans'],
        queryFn: async () => getLoans(),
    });

    // Calculate stats
    const totalLoans = loans?.length || 0;
    const activeLoans = loans?.filter(l => !['Draft', 'Closed', 'Withdrawn'].includes(l.status)).length || 0;
    const approvedLoans = loans?.filter(l => ['Approved', 'ClearToClose'].includes(l.status)).length || 0;
    const totalVolume = loans?.reduce((sum, l) => sum + (l.property?.loanAmount || 0), 0) || 0;

    const recentLoans = loans?.slice(0, 6) || [];

    if (error) {
        return (
            <div className="min-h-screen bg-background pt-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-red-500 mb-4">Error loading dashboard: {(error as Error).message}</div>
                    <button onClick={() => window.location.reload()} className="text-primary-400 hover:underline">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <BrokerNavbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Broker Dashboard</h1>
                            <p className="text-slate-600 dark:text-slate-400">Overview of your pipeline and performance</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Link href="/broker/settings">
                                <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-700">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div id="invite-section" className="mb-8">
                        <InvitationLink />
                    </div>

                    {/* DEBUG PANEL */}
                    <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg text-xs font-mono text-yellow-800 dark:text-yellow-200">
                        {/* We need to get the session here to see what the client sees */}
                        <DebugSessionInfo />
                        <div className="mt-2 text-[10px] opacity-75 border-t border-yellow-200 dark:border-yellow-900/30 pt-2">
                            <div>Server Fetched Loans: {loans?.length ?? 'Loading...'}</div>
                            <div>Check server logs for: [GET_LOANS] Query Details</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatCard
                            title="Total Pipeline"
                            value={totalLoans.toString()}
                            icon={<DocumentIcon />}
                            color="blue"
                        />
                        <StatCard
                            title="Active Loans"
                            value={activeLoans.toString()}
                            icon={<ActivityIcon />}
                            color="indigo"
                        />
                        <StatCard
                            title="Approved"
                            value={approvedLoans.toString()}
                            icon={<CheckIcon />}
                            color="emerald"
                        />
                        <StatCard
                            title="Total Volume"
                            value={`$${(totalVolume / 1000000).toFixed(1)}M`}
                            icon={<ChartIcon />}
                            color="purple"
                        />
                    </div>

                    {/* Recent Applications */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h2>
                        <Link href="/broker/loans" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                            View All Loans
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
                            <div className="text-slate-600 dark:text-slate-400">Loading dashboard...</div>
                        </div>
                    ) : recentLoans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentLoans.map(loan => (
                                <LoanCard key={loan.id} loan={loan} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">Invite a borrower to start a new application.</p>
                            <Link href="#invite-section">
                                <button className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors">
                                    Invite Borrower
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    const colorStyles = {
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    }[color] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

    return (
        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${colorStyles}`}>
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
        </div>
    );
}

function DocumentIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
    );
}

function DebugSessionInfo() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <div>Loading Session...</div>;

    return (
        <div>
            <h4 className="font-bold mb-2 uppercase">Client Session Info</h4>
            <div>Status: {status}</div>
            <div>User ID: {session?.user?.id?.slice(0, 8)}...</div>
            <div>Role: {(session?.user as any)?.role}</div>
            <div className={(session?.user as any)?.brokerId ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                Broker ID: {(session?.user as any)?.brokerId || "MISSING"}
            </div>
        </div>
    );
}

