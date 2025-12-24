import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function GuidesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/resources" className="text-primary-600 hover:text-primary-500 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Resources
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        Knowledge Base
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Everything you need to know about using LoanAuto.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Category 1 */}
                    <Card className="bg-white dark:bg-surface border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/resources/guides/setting-up-profile" className="text-primary-600 hover:text-primary-500 block">Setting up your Broker Profile</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/inviting-client" className="text-primary-600 hover:text-primary-500 block">Inviting your first client</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/dashboard-overview" className="text-primary-600 hover:text-primary-500 block">Understanding the Dashboard</Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Category 2 */}
                    <Card className="bg-white dark:bg-surface border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle>Document Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/resources/guides/scanning-best-practices" className="text-primary-600 hover:text-primary-500 block">Best practices for scanning</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/resolving-ocr-errors" className="text-primary-600 hover:text-primary-500 block">Resolving OCR errors</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/secure-sharing" className="text-primary-600 hover:text-primary-500 block">Secure document sharing</Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Category 3 */}
                    <Card className="bg-white dark:bg-surface border-slate-200 dark:border-white/10">
                        <CardHeader>
                            <CardTitle>Underwriting & Conditions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/resources/guides/interpreting-ai" className="text-primary-600 hover:text-primary-500 block">Interpreting AI decisions</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/clearing-conditions" className="text-primary-600 hover:text-primary-500 block">Clearing conditions automatically</Link>
                                </li>
                                <li>
                                    <Link href="/resources/guides/manual-review" className="text-primary-600 hover:text-primary-500 block">Requesting manual review</Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}
