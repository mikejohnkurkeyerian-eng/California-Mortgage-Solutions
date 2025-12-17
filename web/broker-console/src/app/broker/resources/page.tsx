'use client';

import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function BrokerResourcesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Broker Resources</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Sales enablement tools, compliance guides, and marketing assets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Section 1: Downloads */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Marketing Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Q4 Rate Sheet Template.pdf', size: '1.2 MB' },
                                { name: 'Borrower Welcome Kit.zip', size: '15 MB' },
                                { name: 'Social Media Graphics Pack.zip', size: '45 MB' },
                                { name: 'Email Drip Campaign Scripts.docx', size: '245 KB' }
                            ].map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded flex items-center justify-center text-xl">
                                            📄
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">{file.name}</div>
                                            <div className="text-xs text-slate-500">{file.size}</div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8">Download</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Section 2: Quick Links */}
                    <div className="space-y-6">
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Compliance & Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                            <span className="mr-2">↗</span> Fannie Mae Selling Guide
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                            <span className="mr-2">↗</span> Freddie Mac Seller/Servicer Guide
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                            <span className="mr-2">↗</span> NMLS Resource Center
                                        </a>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card variant="glass" className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none">
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-2">Need Custom Branded Materials?</h3>
                                <p className="text-indigo-200 text-sm mb-4">
                                    Submit a request to our design team for personalized flyers and business cards.
                                </p>
                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-0">
                                    Request Design
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
