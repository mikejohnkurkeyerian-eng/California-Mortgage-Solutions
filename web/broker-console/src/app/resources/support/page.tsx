import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function SupportPage() {
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

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left Col: Contact Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6">
                            Contact Support
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                            Our success team is here to help you clear conditions and close loans.
                        </p>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 flex items-start space-x-4">
                                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Email Us</h3>
                                        <p className="text-slate-500">support@loanauto.com</p>
                                        <p className="text-sm text-slate-400 mt-1">4 hour average response time</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 flex items-start space-x-4">
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Chat</h3>
                                        <p className="text-slate-500">Available in Dashboard</p>
                                        <p className="text-sm text-slate-400 mt-1">Mon-Fri 9am - 6pm EST</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Col: Form Placeholder */}
                    <div className="flex-1 bg-white dark:bg-surface rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Submit a Ticket</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                                <Input placeholder="Brief description of the issue" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                <textarea
                                    className="w-full h-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:ring-offset-slate-900 dark:placeholder:text-slate-400"
                                    placeholder="Tell us more about what happened..."
                                ></textarea>
                            </div>
                            <Button className="w-full">Submit Request</Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
