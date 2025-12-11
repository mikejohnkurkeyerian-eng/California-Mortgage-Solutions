import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-background selection:bg-primary-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2 animate-pulse"></span>
            AI-Powered Personal Loans
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-slide-up">
            Your Dream Loan, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
              Approved in Minutes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience the fastest loan approval process powered by advanced AI.
            No paperwork, no waiting, just results.
          </p>

          <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link href="/borrower/apply">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg shadow-lg shadow-primary-500/20">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  How it Works
                </Button>
              </Link>
            </div>
            <Link href="/borrower/login" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">
              Returning user? <span className="text-primary-600 dark:text-primary-400 hover:underline">Login here</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass" className="p-2 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent>
                <div className="h-12 w-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Instant Pre-Approval</h3>
                <p className="text-slate-600 dark:text-slate-400">Get pre-approved in minutes with our AI-driven underwriting engine.</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="p-2 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent>
                <div className="h-12 w-12 rounded-lg bg-secondary-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Smart Document Verification</h3>
                <p className="text-slate-600 dark:text-slate-400">Upload documents securely and get instant feedback on their validity.</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="p-2 hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent>
                <div className="h-12 w-12 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Best Rate Guarantee</h3>
                <p className="text-slate-600 dark:text-slate-400">Our AI compares hundreds of lenders to find the absolute best rate for you.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main >
  );
}
