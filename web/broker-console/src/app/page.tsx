import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2 animate-pulse"></span>
            For Top-Performing Brokers
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-slide-up">
            The Future of Lending <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
              Is AI-Driven
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            LoanAuto empowers brokers with instant AI underwriting, automated document verification, and real-time status updates. Close loans faster and scale your business.
          </p>

          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg shadow-lg shadow-primary-500/20">
                  Join the Network
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              Already a partner? <Link href="/broker/login" className="text-primary-600 dark:text-primary-400 hover:underline">Log in to Portal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="py-20 bg-white dark:bg-surface/30">
        <div id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">Why Top Brokers Choose LoanAuto</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We've built the platform you've always wanted. No more chasing underwriters, no more lost emails.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass" className="p-6 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">Instant Decisions</h3>
                <p className="text-slate-600 dark:text-slate-400">Our AI analyzes borrower data in seconds, providing instant pre-approvals and clear conditions.</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="p-6 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-secondary-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">Automated Verification</h3>
                <p className="text-slate-600 dark:text-slate-400">Upload paystubs and bank statements. Our system parses and validates them instantly.</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="p-6 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">Client Management</h3>
                <p className="text-slate-600 dark:text-slate-400">A centralized dashboard to track all your applications, conditions, and commissions in one place.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="resources" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6">Ready to Streamline Your Workflow?</h2>
          <Link href="/register">
            <Button size="lg" className="px-12 py-6 text-xl shadow-xl shadow-primary-500/20">
              Create Broker Account
            </Button>
          </Link>
        </div>
      </section>
    </main >
  );
}
