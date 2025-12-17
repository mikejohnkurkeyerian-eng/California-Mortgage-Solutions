'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ResourcesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8">Borrower Resources</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Loan Guide</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Understand the step-by-step process of getting a mortgage, from application to closing.
                                </p>
                                <button className="text-primary-500 hover:text-primary-400 font-medium">Read Guide →</button>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Document Checklist</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    A comprehensive list of documents you'll need to gather for a smooth underwriting experience.
                                </p>
                                <button className="text-primary-500 hover:text-primary-400 font-medium">View Checklist →</button>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Glossary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    Confused by industry jargon? Our glossary explains common mortgage terms in simple English.
                                </p>
                                <button className="text-primary-500 hover:text-primary-400 font-medium">View Glossary →</button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
