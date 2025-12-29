'use client';

import { Navbar } from '@/components/layout/Navbar'; // Will be replaced by Layout, but good for now if needed. wait layout handles it.
// Actually, layout handles navbar, so I don't need to import it here.
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { useState } from 'react';

const rates = [
    {
        program: '30-Year Fixed',
        rate: '6.125%',
        apr: '6.285%',
        trend: 'down',
        points: '0.500',
        payment: '$2,430'
    },
    {
        program: '15-Year Fixed',
        rate: '5.250%',
        apr: '5.450%',
        trend: 'down',
        points: '0.375',
        payment: '$3,215'
    },
    {
        program: 'FHA 30-Year Fixed',
        rate: '5.875%',
        apr: '6.912%', // Higher APR due to MIP
        trend: 'flat',
        points: '0.000',
        payment: '$2,366'
    },
    {
        program: 'VA 30-Year Fixed',
        rate: '5.625%',
        apr: '5.850%',
        trend: 'down',
        points: '0.000',
        payment: '$2,305'
    },
    {
        program: '5/1 ARM',
        rate: '5.990%',
        apr: '7.150%',
        trend: 'up',
        points: '0.125',
        payment: '$2,395'
    },
];

export default function RatesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Live Mortgage Rates
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        See how much you could save with our competitive market rates. Updated daily to give you the best edge in the market.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button className="bg-secondary-600 hover:bg-secondary-500 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-secondary-500/25 transition-all">
                            Get Your Custom Rate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Rates Table Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-20">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Today's Rates</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                As of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Market Status: <span className="font-semibold text-green-600 dark:text-green-400">Stable</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                    <th className="p-6">Loan Program</th>
                                    <th className="p-6">Interest Rate</th>
                                    <th className="p-6">APR</th>
                                    <th className="p-6">Trend</th>
                                    <th className="p-6">Points</th>
                                    <th className="p-6">Est. Payment*</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {rates.map((rate, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="p-6 font-medium text-slate-900 dark:text-white">
                                            {rate.program}
                                        </td>
                                        <td className="p-6">
                                            <div className="text-xl font-bold text-secondary-600 dark:text-secondary-400">
                                                {rate.rate}
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600 dark:text-slate-300 font-medium">
                                            {rate.apr}
                                        </td>
                                        <td className="p-6">
                                            {rate.trend === 'down' && (
                                                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/20 w-fit px-2.5 py-1 rounded-full">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                    Lower
                                                </div>
                                            )}
                                            {rate.trend === 'up' && (
                                                <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 w-fit px-2.5 py-1 rounded-full">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                    Higher
                                                </div>
                                            )}
                                            {rate.trend === 'flat' && (
                                                <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm font-medium bg-slate-100 dark:bg-slate-800 w-fit px-2.5 py-1 rounded-full">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                                                    Steady
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-slate-600 dark:text-slate-400">
                                            {rate.points}
                                        </td>
                                        <td className="p-6 font-mono text-slate-700 dark:text-slate-300">
                                            {rate.payment}
                                        </td>
                                        <td className="p-6 text-right">
                                            <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Apply
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500">
                        * Estimated monthly principal and interest payment based on a $400,000 loan amount. Does not include taxes, insurance, or potential mortgage insurance. Rates are subject to change without notice and are based on a borrower with excellent credit.
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <Card variant="glass" className="hover:scale-105 transition-transform duration-300">
                        <CardContent className="pt-8 text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                📊
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rate Alerts</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Never miss a drop. Set up custom alerts for your target rate.
                            </p>
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">Set Alert →</Button>
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="hover:scale-105 transition-transform duration-300">
                        <CardContent className="pt-8 text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                🔒
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lock It In</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Like what you see? Lock your rate today for up to 60 days.
                            </p>
                            <Button variant="ghost" className="text-purple-600 hover:text-purple-700">Lock Rate →</Button>
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="hover:scale-105 transition-transform duration-300">
                        <CardContent className="pt-8 text-center">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                💡
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Expert Advice</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Unsure which program is best? Chat with a loan officer.
                            </p>
                            <Button variant="ghost" className="text-teal-600 hover:text-teal-700">Get Advice →</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
