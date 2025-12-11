'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

function BorrowerStartContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const registerLink = callbackUrl
        ? `/borrower/signup?role=BORROWER&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '/borrower/signup?role=BORROWER';

    const loginLink = callbackUrl
        ? `/borrower/login?role=BORROWER&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : '/borrower/login?role=BORROWER';

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />

            <div className="relative pt-32 pb-20 px-4 min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <div className="space-y-4 animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            Your Home Loan Journey <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                                Starts Here
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Experience a faster, transparent, and secure mortgage application process.
                            Create an account to save your progress and get real-time updates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full animate-fade-in-up delay-200">
                        <Card variant="glass" className="group hover:border-primary-500/50 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Applicant</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        First time here? Create an account to start your secure application.
                                    </p>
                                </div>
                                <Link href={registerLink} className="w-full">
                                    <Button className="w-full bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/25">
                                        Create Account
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="group hover:border-secondary-500/50 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-full bg-secondary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Returning User</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Already have an account? Log in to continue your application.
                                    </p>
                                </div>
                                <Link href={loginLink} className="w-full">
                                    <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        Log In
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-300">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Secure & Private</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Bank-level encryption keeps your personal data safe.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Save Your Progress</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Start now and finish later. We save your work automatically.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Fast Pre-Approval</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Get a decision in minutes, not days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function BorrowerStartPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
            <BorrowerStartContent />
        </Suspense>
    );
}

