'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CHECKLIST_ITEMS } from '@/data/borrower-resources';
import { motion } from 'framer-motion';

export default function ChecklistPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">Document Checklist</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        Gathering the right documents upfront can speed up your loan process by weeks. Here is what you will typically need.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 space-y-8">
                {CHECKLIST_ITEMS.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </span>
                                    {section.category}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ul className="space-y-4">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="flex items-start gap-3 group">
                                            <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center mt-0.5 group-hover:border-secondary-500 transition-colors">
                                                {/* Checkbox visual only */}
                                            </div>
                                            <span className="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
                    <h3 className="text-blue-800 dark:text-blue-300 font-bold mb-2">Pro Tip</h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                        You can upload these documents directly in your dashboard once you start your application. Our secure portal makes it easy to submit everything from your phone or computer.
                    </p>
                </div>
            </div>
        </main>
    );
}
