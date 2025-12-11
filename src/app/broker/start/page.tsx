'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function BrokerStartPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />

            <div className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Elements - Distinct from Borrower Page */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-800">
                            For Mortgage Professionals
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            Accelerate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Lending Pipeline
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Manage applications, track status in real-time, and close loans faster with our advanced broker portal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full animate-fade-in-up delay-200">
                        <Card variant="glass" className="group hover:border-blue-500/50 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Join Our Network</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        New to the platform? Register as a broker to start submitting loans.
                                    </p>
                                </div>
                                <Link href="/register?role=BROKER" className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25">
                                        Register as Broker
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="group hover:border-indigo-500/50 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Broker Portal</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Already a partner? Access your dashboard and pipeline.
                                    </p>
                                </div>
                                <Link href="/login?role=BROKER" className="w-full">
                                    <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        Broker Login
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-300">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Pipeline Management</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Track every loan from application to closing in one view.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Instant Decisions</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Automated underwriting gives you answers in minutes.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Secure Documents</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Collect and verify borrower documents securely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

