'use client';

import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function CommissionsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Commission Tracking</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your earnings, pending payouts, and historical performance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">MTD Earnings</div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">$12,450.00</div>
                            <div className="text-xs text-slate-500 mt-2">Paid out this month</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Pending Revenue</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">$4,200.00</div>
                            <div className="text-xs text-slate-500 mt-2">Expected date: 12/20/2024</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">YTD Total</div>
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">$148,920.00</div>
                            <div className="text-xs text-slate-500 mt-2">↑ 8% vs last year</div>
                        </CardContent>
                    </Card>
                </div>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Recent Payouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-white/10">
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Loan Ref</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Type</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Amount</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {[
                                        { date: '12/15/2024', ref: 'LN-8821', type: 'Origination Fee', amount: '$2,450.00', status: 'Processing' },
                                        { date: '12/01/2024', ref: 'LN-7743', type: 'Origination Fee', amount: '$3,100.00', status: 'Paid' },
                                        { date: '11/15/2024', ref: 'LN-6629', type: 'Referral Bonus', amount: '$500.00', status: 'Paid' },
                                        { date: '11/02/2024', ref: 'LN-5510', type: 'Origination Fee', amount: '$2,800.00', status: 'Paid' },
                                    ].map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.date}</td>
                                            <td className="py-3 px-4 font-mono text-sm text-slate-500">{item.ref}</td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.type}</td>
                                            <td className="py-3 px-4 text-slate-900 dark:text-white font-medium text-right">{item.amount}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Paid'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
