import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12">

          {/* Left Column: Marketing Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2 animate-pulse"></span>
              Join the Broker Network
            </div>

            <h1 className="text-5xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight animate-slide-up">
              Empower Your Clients, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                Accelerate Your Success
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Partner with the most advanced AI-driven lending platform. Instant approvals, seamless document verification, and competitive rates for your borrowers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>Instant Pre-Approvals</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>Real-time Status Updates</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>Automated Underwriting</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>Competitive Commission</span>
              </div>
            </div>
          </div>

          {/* Right Column: Broker Sign Up Form */}
          <div className="w-full md:w-[480px] animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Suspense fallback={<div className="h-[600px] w-full bg-white/5 rounded-xl animate-pulse"></div>}>
              <RegisterForm forcedRole="BROKER" hideRoleSelection={true} />
            </Suspense>
          </div>

        </div>
      </section>
    </main >
  );
}

