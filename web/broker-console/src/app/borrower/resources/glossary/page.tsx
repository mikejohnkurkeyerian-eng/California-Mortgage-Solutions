'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { GLOSSARY_TERMS } from '@/data/borrower-resources';
import { useState, useMemo } from 'react';

export default function GlossaryPage() {
    const [search, setSearch] = useState('');

    const filteredTerms = useMemo(() => {
        return GLOSSARY_TERMS.filter(item =>
            item.term.toLowerCase().includes(search.toLowerCase()) ||
            item.definition.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) => a.term.localeCompare(b.term));
    }, [search]);

    // Group by first letter
    const groupedTerms = useMemo(() => {
        const groups: Record<string, typeof GLOSSARY_TERMS> = {};
        filteredTerms.forEach(item => {
            const letter = item.term[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(item);
        });
        return groups;
    }, [filteredTerms]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">Mortgage Glossary</h1>
                    <p className="text-xl text-slate-300 max-w-xl mx-auto mb-8">
                        Deciphering the language of lending.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <div className="absolute left-3 top-3 text-slate-500">🔍</div>
                        <Input
                            placeholder="Search terms..."
                            className="pl-10 h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-8">
                {Object.keys(groupedTerms).length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-slate-500">
                            No terms found matching "{search}"
                        </CardContent>
                    </Card>
                ) : (
                    Object.keys(groupedTerms).sort().map(letter => (
                        <div key={letter} id={`section-${letter}`}>
                            <h2 className="text-4xl font-bold text-slate-200 dark:text-slate-800 mb-4 pl-4">{letter}</h2>
                            <Card className="overflow-hidden">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {groupedTerms[letter].map((item, idx) => (
                                        <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <h3 className="text-lg font-bold text-secondary-600 dark:text-secondary-400 mb-2">
                                                {item.term}
                                            </h3>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {item.definition}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
