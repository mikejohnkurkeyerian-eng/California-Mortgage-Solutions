import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>

                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6 text-slate-600 dark:text-slate-300">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
                            <p>
                                Welcome to LoanAuto ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Information We Collect</h2>
                            <p className="mb-2">We collect information that you voluntarily provide to us when you:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Register on the website</li>
                                <li>Submit loan applications or documents</li>
                                <li>Contact us for support</li>
                                <li>Participate in surveys or promotions</li>
                            </ul>
                            <p className="mt-2">This may include names, email addresses, phone numbers, financial information, and employment details necessary for loan processing.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. How We Use Your Information</h2>
                            <p>We use the information we collect or receive to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Facilitate account creation and logon process</li>
                                <li>Process loan applications and underwriting</li>
                                <li>Send you administrative information</li>
                                <li>Protect our services and legal rights</li>
                                <li>Respond to legal requests and prevent harm</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Sharing Your Information</h2>
                            <p>
                                We may share information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.
                                We do not sell your personal information to third parties for their own marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Data Security</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information.
                                While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us at support@loanauto.com.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
