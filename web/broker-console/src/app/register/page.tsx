'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-background selection:bg-primary-500/30">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center justify-center">
                <div className="absolute inset-0 bg-hero-glow opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12">

                    {/* Left Column: Marketing Text (Reduced for Register Page) */}
                    <div className="flex-1 text-center md:text-left hidden md:block">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2"></span>
                            Join the Broker Network
                        </div>

                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            Start Closing More Loans Today
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
                            Create your account to access our AI-powered underwriting platform.
                        </p>
                    </div>

                    {/* Right Column: Broker Sign Up Form */}
                    <div className="w-full md:w-[480px]">
                        <Suspense fallback={<div className="h-[600px] w-full bg-white/5 rounded-xl animate-pulse"></div>}>
                            <RegisterForm forcedRole="BROKER" hideRoleSelection={true} />
                        </Suspense>
                    </div>

                </div>
            </section>
        </main >
    );
}
