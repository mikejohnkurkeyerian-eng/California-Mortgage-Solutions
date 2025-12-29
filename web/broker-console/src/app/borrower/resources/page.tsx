'use client';


import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ResourcesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Borrower Resources
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Everything you need to know about the mortgage process, explained simply.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Guide Card */}
                    <Link href="/borrower/resources/guide/mortgage-process" className="group">
                        <Card variant="glass" className="h-full hover:scale-105 transition-transform duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    📚
                                </div>
                                <CardTitle>Guides</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Step-by-step guides on buying a home, understanding rates, and improving your credit.
                                </p>
                                <span className="text-secondary-600 dark:text-secondary-400 font-medium group-hover:underline">Read Guides →</span>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Checklist Card */}
                    <Link href="/borrower/resources/checklist" className="group">
                        <Card variant="glass" className="h-full hover:scale-105 transition-transform duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    📋
                                </div>
                                <CardTitle>Document Checklist</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Don't get caught scrambling. See exactly what documents you'll need for your application.
                                </p>
                                <span className="text-secondary-600 dark:text-secondary-400 font-medium group-hover:underline">View Checklist →</span>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Glossary Card */}
                    <Link href="/borrower/resources/glossary" className="group">
                        <Card variant="glass" className="h-full hover:scale-105 transition-transform duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    💡
                                </div>
                                <CardTitle>Glossary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Decoding mortgage jargon. Simple definitions for complex terms like "Amortization" and "Escrow".
                                </p>
                                <span className="text-secondary-600 dark:text-secondary-400 font-medium group-hover:underline">Browse Glossary →</span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">How much do I need for a down payment?</h3>
                                <p className="text-slate-600 dark:text-slate-400">It depends on the loan type. FHA loans require as little as 3.5%, while conventional loans often require 3-5%. VA loans may require 0% down.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">What credit score do I need?</h3>
                                <p className="text-slate-600 dark:text-slate-400">Generally, a score of 620+ is needed for conventional loans. FHA loans can accept scores as low as 580 (or lower with a larger down payment).</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">How long does closing take?</h3>
                                <p className="text-slate-600 dark:text-slate-400">On average, it takes 30 to 45 days from application to closing, but this can vary depending on complexity and how quickly you provide documentation.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Should I lock my rate?</h3>
                                <p className="text-slate-600 dark:text-slate-400">Rates fluctuate daily. Locking protects you from increases. If you're happy with the payment at the current rate, it's usually wise to lock.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
