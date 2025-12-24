import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function ResourcesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        Broker Resources
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Guides, documentation, and support to help you succeed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-surface border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <svg className="w-6 h-6 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Knowledge Base
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Step-by-step guides on how to use the dashboard, upload documents, and interpret AI decisions.
                            </p>
                            <Link href="/resources/guides">
                                <Button variant="outline">View Guides</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-surface border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <svg className="w-6 h-6 text-secondary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                API Documentation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Technical documentation for integrating LoanAuto with your existing CRM or flexible frontend.
                            </p>
                            <Link href="/resources/api-docs">
                                <Button variant="outline">Read Docs</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="max-w-3xl mx-auto bg-white dark:bg-surface rounded-xl p-8 border border-slate-200 dark:border-white/10 text-center">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Need Personalized Support?</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Our dedicated broker success team is standing by to help you close difficult files.</p>
                    <Link href="/resources/support">
                        <Button variant="primary">Contact Support</Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
