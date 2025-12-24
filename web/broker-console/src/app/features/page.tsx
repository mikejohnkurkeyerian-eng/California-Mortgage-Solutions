import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        Everything You Need to <span className="text-primary-600 dark:text-primary-400">Close Faster</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Our platform combines advanced AI with intuitive design to give you a competitive edge.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                            AI-Powered Underwriting
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                            Get instant decisions on loan applications. Our AI engine analyzes thousands of data points in real-time to provide accurate pre-approvals and identify potential conditions upfront.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-slate-700 dark:text-slate-300">Instant Pre-Approval Letters</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-slate-700 dark:text-slate-300">Automated Condition Generation</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-slate-700 dark:text-slate-300">Risk Assessment Engine</span>
                            </li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                        {/* Abstract UI Representation */}
                        <div className="bg-white dark:bg-surface rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">APPROVED</span>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                <div className="h-2 w-4/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-400 text-xs">AI</span>
                                    </div>
                                    <div className="text-sm text-slate-500">Analysis Complete in 2.4s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="bg-slate-100 dark:bg-surface/50 rounded-2xl p-8 border border-slate-200 dark:border-white/5">
                        {/* Document Icon Graphic */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center aspect-square">
                                <svg className="w-10 h-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-semibold">Paystubs</span>
                            </div>
                            <div className="bg-white dark:bg-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center aspect-square">
                                <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs font-semibold">Bank Stmts</span>
                            </div>
                            <div className="bg-white dark:bg-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center aspect-square">
                                <svg className="w-10 h-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-semibold">Verified</span>
                            </div>
                            <div className="bg-white dark:bg-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center aspect-square">
                                <svg className="w-10 h-10 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs font-semibold">extracted</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                            Smart Document Processing
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                            Stop manually reviewing PDFs. Our system automatically extracts key data from paystubs, tax returns, and bank statements, flagging inconsistencies instantly.
                        </p>
                        <Link href="/register">
                            <Button variant="primary" size="lg">Start Automating</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
