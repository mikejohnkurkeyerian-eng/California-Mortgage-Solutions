import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function ApiDocsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/resources" className="text-primary-600 hover:text-primary-500 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Resources
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                        API Documentation
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Integrate LoanAuto's underwriting engine directly into your CRM.
                    </p>
                </div>

                <div className="bg-slate-900 rounded-xl p-8 shadow-2xl overflow-hidden font-mono text-sm max-w-4xl mx-auto">
                    <div className="flex space-x-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>

                    <div className="text-slate-300">
                        <div className="mb-4">
                            <span className="text-purple-400">POST</span> <span className="text-green-400">https://api.loanauto.com/v1/applications</span>
                        </div>
                        <div className="mb-4 pl-4 border-l-2 border-slate-700">
                            <span className="text-slate-500">// Request Body</span><br />
                            <span className="text-blue-400">{`{`}</span><br />
                            &nbsp;&nbsp;<span className="text-orange-400">"broker_id"</span>: <span className="text-green-300">"brk_12345"</span>,<br />
                            &nbsp;&nbsp;<span className="text-orange-400">"borrower"</span>: <span className="text-blue-400">{`{`}</span><br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"first_name"</span>: <span className="text-green-300">"John"</span>,<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"last_name"</span>: <span className="text-green-300">"Doe"</span>,<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"income"</span>: <span className="text-yellow-300">120000</span><br />
                            &nbsp;&nbsp;<span className="text-blue-400">{`}`}</span><br />
                            <span className="text-blue-400">{`}`}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">// Response</span><br />
                            <span className="text-blue-400">{`{`}</span><br />
                            &nbsp;&nbsp;<span className="text-orange-400">"id"</span>: <span className="text-green-300">"app_98765"</span>,<br />
                            &nbsp;&nbsp;<span className="text-orange-400">"status"</span>: <span className="text-green-300">"pending_analysis"</span><br />
                            <span className="text-blue-400">{`}`}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        This is a preview. To access the full API reference, please contact our engineering team.
                    </p>
                    <a href="mailto:api@loanauto.com" className="text-primary-600 font-bold hover:underline">Request API Access</a>
                </div>
            </section>
        </main>
    );
}
