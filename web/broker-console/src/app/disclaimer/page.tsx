import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

import { Navbar } from '@/components/layout/Navbar';

export default function Disclaimer() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-8">Disclaimer</h1>

                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6 text-slate-600 dark:text-slate-300">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Website Disclaimer</h2>
                            <p>
                                The information provided by LoanAuto ("we," "us," or "our") on this website is for general informational purposes only.
                                All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Financial Disclaimer</h2>
                            <p>
                                The Site does not contain financial advice. The financial information is provided for general informational and educational purposes only and is not a substitute for professional advice.
                                Before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of financial advice.
                                THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. External Links Disclaimer</h2>
                            <p>
                                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising.
                                Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
