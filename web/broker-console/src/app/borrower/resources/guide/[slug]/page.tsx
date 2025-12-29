'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { ARTICLES } from '@/data/borrower-resources';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function GuidePage({ params }: { params: { slug: string } }) {
    const article = ARTICLES.find(a => a.slug === params.slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/borrower/resources" className="text-slate-400 hover:text-white mb-6 inline-flex items-center text-sm font-medium transition-colors">
                        ← Back to Resources
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{article.title}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
                <Card>
                    <CardContent className="p-8 md:p-12">
                        <div
                            className="prose prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </CardContent>
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Ready to take the next step?</p>
                    <Link href="/borrower/signup" className="inline-block bg-secondary-600 hover:bg-secondary-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                        Start Your Application
                    </Link>
                </div>
            </div>
        </main>
    );
}
