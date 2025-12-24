import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-slide-up">
                        Empowering Brokers with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                            Intelligent Automation
                        </span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        At LoanAuto, we believe the future of lending belongs to those who move fast. We're building the infrastructure to make sure that's you.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white dark:bg-surface/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                The mortgage industry has been stuck in the past—buried in paperwork, manual reviews, and opaque underwriting decisions. We saw a better way.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Our mission is to strip away the friction of lending. By using AI to handle the heavy lifting of document analysis and condition generation, we free brokers to do what they do best: build relationships and close deals.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-20 blur-xl"></div>
                            <div className="relative bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Transparency First</h4>
                                            <p className="text-sm text-slate-500">No black-box denials. You see exactly what the underwriter sees.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Speed as a Standard</h4>
                                            <p className="text-sm text-slate-500">Decisions in minutes, not days. Funding in days, not weeks.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Broker Success</h4>
                                            <p className="text-sm text-slate-500">We only win when you close loans. Everything we build is for you.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Assessment (Placeholder style) */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">Built by Experts</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            A team of engineers, data scientists, and mortgage veterans working together.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <Card className="text-center p-6 border-0 shadow-lg bg-slate-50 dark:bg-surface/50">
                            <CardContent>
                                <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Engineering</h3>
                                <p className="text-sm text-slate-500">Ex-Google & Fintech background building secure, scalable systems.</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center p-6 border-0 shadow-lg bg-slate-50 dark:bg-surface/50">
                            <CardContent>
                                <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Underwriting</h3>
                                <p className="text-sm text-slate-500">20+ years of combined experience in manual and automated underwriting.</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center p-6 border-0 shadow-lg bg-slate-50 dark:bg-surface/50">
                            <CardContent>
                                <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Product</h3>
                                <p className="text-sm text-slate-500">Obsessed with creating the smoothest user experience in the industry.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-8">Join the Revolution</h2>
                    <p className="text-xl text-slate-300 mb-10">
                        Stop processing loans the hard way. Experience the LoanAuto difference today.
                    </p>
                    <Link href="/register">
                        <Button className="bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-500/20 border-hidden" size="lg">
                            Become a Partner
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
