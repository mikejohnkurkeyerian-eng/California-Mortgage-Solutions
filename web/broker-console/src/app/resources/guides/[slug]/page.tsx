import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guidesData } from '../data';
import { Button } from '@/components/ui/Button';

export default function GuideArticlePage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const article = guidesData[slug];

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/resources/guides" className="text-primary-600 hover:text-primary-500 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Knowledge Base
                    </Link>
                </div>

                <div className="bg-white dark:bg-surface rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-white/10">
                    <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white">
                            {article.title}
                        </h1>
                    </div>

                    <div
                        className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                        prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-900 dark:prose-strong:text-white
                        prose-li:text-slate-600 dark:prose-li:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    >
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Was this article helpful?</h3>
                        <div className="flex space-x-4">
                            <Button variant="outline" size="sm" className="space-x-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span>Yes</span>
                            </Button>
                            <Button variant="outline" size="sm" className="space-x-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                                <span>No</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
