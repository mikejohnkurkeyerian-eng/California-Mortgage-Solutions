import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight animate-slide-up">
                        How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Works</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Our AI-powered platform streamlines the lending process, getting you from application to funding in record time.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white text-xl z-10 shadow-lg shadow-primary-500/50">1</div>
                            <Card variant="glass" className="h-full pt-8 hover:translate-y-[-5px] transition-transform duration-300">
                                <CardContent className="text-center">
                                    <h3 className="text-xl font-heading font-bold text-white mb-4">Apply Online</h3>
                                    <p className="text-slate-400">Fill out our simple, secure online application in just a few minutes.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center font-bold text-white text-xl z-10 shadow-lg shadow-secondary-500/50">2</div>
                            <Card variant="glass" className="h-full pt-8 hover:translate-y-[-5px] transition-transform duration-300">
                                <CardContent className="text-center">
                                    <h3 className="text-xl font-heading font-bold text-white mb-4">AI Analysis</h3>
                                    <p className="text-slate-400">Our advanced AI analyzes your profile instantly to find the best matches.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center font-bold text-white text-xl z-10 shadow-lg shadow-accent-500/50">3</div>
                            <Card variant="glass" className="h-full pt-8 hover:translate-y-[-5px] transition-transform duration-300">
                                <CardContent className="text-center">
                                    <h3 className="text-xl font-heading font-bold text-white mb-4">Get Approved</h3>
                                    <p className="text-slate-400">Receive instant pre-approval offers with transparent terms and rates.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-xl z-10 shadow-lg shadow-green-500/50">4</div>
                            <Card variant="glass" className="h-full pt-8 hover:translate-y-[-5px] transition-transform duration-300">
                                <CardContent className="text-center">
                                    <h3 className="text-xl font-heading font-bold text-white mb-4">Fast Funding</h3>
                                    <p className="text-slate-400">Sign your documents digitally and get funds deposited directly to your account.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">Ready to get started?</h2>
                    <p className="text-xl text-slate-400 mb-10">
                        Join thousands of satisfied borrowers who found their perfect loan with us.
                    </p>
                    <Link href="/borrower/apply">
                        <Button size="lg" className="px-12 py-6 text-xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-shadow">
                            Start Your Application
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

