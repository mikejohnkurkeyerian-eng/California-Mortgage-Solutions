import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

import { Navbar } from '@/components/layout/Navbar';

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>

                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6 text-slate-600 dark:text-slate-300">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and LoanAuto ("we," "us," or "our"), concerning your access to and use of our website and services.
                                By accessing the site, you acknowledge that you have read, understood, and agree to be bound by all of these Terms of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. User Representations</h2>
                            <p className="mb-2">By using the Site, you represent and warrant that:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Lending Services</h2>
                            <p>
                                LoanAuto provides a platform for mortgage brokers to submit and manage loan applications. We are not a bank or direct lender.
                                All loan approvals are subject to final underwriting and verification conditions as determined by the funding lender.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Termination</h2>
                            <p>
                                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Modifications and Interruptions</h2>
                            <p>
                                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice.
                                We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
