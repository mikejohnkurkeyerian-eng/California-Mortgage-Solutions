'use client';

import { useState } from 'react';
import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock Data for "Recent Insights" to demonstrate capability
const RECENT_INSIGHTS = [
    {
        id: 1,
        severity: 'CRITICAL',
        title: 'NSF Fee Detected',
        message: 'Bank Statement for Smith Loan #1024 shows 3 NSF fees ($35.00) in the last 30 days.',
        time: '2 hours ago',
        loanId: 'LN-2024-88A'
    },
    {
        id: 2,
        severity: 'WARNING',
        title: 'Large Deposit',
        message: 'Unusually large deposit of $15,000 detected on 10/12/2024. Exceeds 50% of monthly income.',
        time: '4 hours ago',
        loanId: 'LN-2024-88A'
    },
    {
        id: 3,
        severity: 'INFO',
        title: 'Rental Income Found',
        message: 'Schedule E detected on Tax Returns. Please request current Lease Agreements.',
        time: 'Yesterday',
        loanId: 'LN-2024-99B'
    },
    {
        id: 4,
        severity: 'SUCCESS',
        title: 'Income Verified',
        message: 'W2 and Paystubs match stated income within 2% variance.',
        time: 'Yesterday',
        loanId: 'LN-2024-77C'
    }
];

export default function ClaraPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
                                ✨
                            </span>
                            CLARA AI
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Comprehensive Loan Analysis & Risk Assessment
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            System Active
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card variant="glass" className="border-l-4 border-l-indigo-500">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Documents Scanned</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,248</div>
                            <div className="text-xs text-green-500 mt-2 font-medium">↑ 12% this week</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Critical Risks</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">3</div>
                            <div className="text-xs text-slate-500 mt-2">Requires immediate attention</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Warnings</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">15</div>
                            <div className="text-xs text-slate-500 mt-2">Potential issues flagged</div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Time Saved</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">~42h</div>
                            <div className="text-xs text-blue-500 mt-2 font-medium">Auto-processing active</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Intelligence Activity</h2>
                        <div className="space-y-4">
                            {RECENT_INSIGHTS.map((insight) => (
                                <div key={insight.id} className="relative overflow-hidden group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${insight.severity === 'CRITICAL' ? 'bg-red-500' :
                                            insight.severity === 'WARNING' ? 'bg-yellow-500' :
                                                insight.severity === 'SUCCESS' ? 'bg-green-500' : 'bg-blue-500'
                                        }`} />

                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${insight.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                                    insight.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                                                        insight.severity === 'SUCCESS' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                                            'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                                }`}>
                                                {insight.severity}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">{insight.loanId}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{insight.time}</span>
                                    </div>

                                    <h3 className="text-md font-bold text-slate-900 dark:text-white mb-1 pl-2">{insight.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 pl-2">{insight.message}</p>

                                    <div className="mt-4 pl-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="sm" className="h-8 text-xs">View Document</Button>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs">Dismiss</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar / Configuration */}
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Live Module Status</h2>
                            <Card variant="glass" className="p-0 overflow-hidden">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { name: 'Income Analyzer', status: 'Online', icon: '💰' },
                                        { name: 'Asset Verification', status: 'Online', icon: '🏦' },
                                        { name: 'Liability Scan', status: 'Online', icon: '⚖️' },
                                        { name: 'Fraud Detection', status: 'Learning', icon: '🛡️' },
                                        { name: 'Property Valuator', status: 'Beta', icon: '🏠' },
                                    ].map((module) => (
                                        <div key={module.name} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{module.icon}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{module.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${module.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                <span className="text-xs text-slate-500">{module.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </section>

                        <section>
                            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold text-lg mb-2">Try the Demo</h3>
                                    <p className="text-indigo-100 text-sm mb-4">
                                        Upload a sample document to see CLARA analyze it in real-time.
                                    </p>
                                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0">
                                        Open Analyzer Sandbox
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
