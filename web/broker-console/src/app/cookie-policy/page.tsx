import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-8">Cookie Policy</h1>

                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6 text-slate-600 dark:text-slate-300">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Use of Cookies</h2>
                            <p>
                                LoanAuto uses cookies to improve your experience on our website. Cookies are text files placed on your computer to collect standard Internet log information and visitor behavior information.
                                When you visit our websites, we may collect information from you automatically through cookies or similar technology.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Cookies</h2>
                            <p className="mb-2">We use cookies in a range of ways to improve your experience on our website, including:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Keeping you signed in</li>
                                <li>Understanding how you use our website</li>
                                <li>Saving your preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Types of Cookies We Use</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Functionality</h3>
                                    <p>Our Company uses these cookies so that we recognize you on our website and remember your previously selected preferences. These could include what language you prefer and location you are in.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Security</h3>
                                    <p>We use security cookies to authenticate users, prevent fraudulent use of login credentials, and protect user data from unauthorized parties.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Managing Cookies</h2>
                            <p>
                                You can set your browser not to accept cookies. However, in a few cases, some of our website features may not function as a result.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
