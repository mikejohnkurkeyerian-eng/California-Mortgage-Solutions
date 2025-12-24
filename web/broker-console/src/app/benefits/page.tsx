import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function BenefitsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        Why Join <span className="text-secondary-600 dark:text-secondary-400">LoanAuto</span>?
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        We're not just a platform; we're your growth partner. See how we help brokers scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/10">
                        <CardContent className="pt-8 text-center">
                            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">3x</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Faster Closings</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Average clear-to-close time reduced from 30 days to 10 days using our automated workflows.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/10">
                        <CardContent className="pt-8 text-center">
                            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Always On</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Simulate underwriting decisions at 2 AM. Never wait for an underwriter to pick up the phone.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-purple-50 dark:bg-purple-900/10">
                        <CardContent className="pt-8 text-center">
                            <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Transparency</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Real-time status updates for you and your borrowers. No more black box underwriting.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white dark:bg-surface rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">Ready to Grow Your Pipeline?</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Join thousands of high-performing brokers who trust LoanAuto.</p>
                    </div>
                    <Link href="/register">
                        <Button size="lg" className="text-lg px-8 py-4">Get Started Now</Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
