'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useBrokerSettings } from '@/context/BrokerContext';
import { useBorrowerAuth } from '@/hooks/useBorrower';

export function Navbar() {
    const { settings, toggleTheme } = useBrokerSettings();
    const isDark = settings.theme === 'dark';
    const [isCooldown, setIsCooldown] = useState(false);
    const { borrowerId, logout } = useBorrowerAuth();

    const handleThemeToggle = () => {
        if (isCooldown) return;

        toggleTheme();
        setIsCooldown(true);
        setTimeout(() => {
            setIsCooldown(false);
        }, 500);
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-xl font-heading font-bold text-slate-900 dark:text-white">LoanAuto</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/borrower/apply" className="text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors font-semibold">
                            Apply Now
                        </Link>
                        <Link href="/about" className="text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors font-semibold">
                            How it Works
                        </Link>
                        {borrowerId ? (
                            <button
                                onClick={() => logout()}
                                className="text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors font-semibold"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/borrower/login" className="text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors font-semibold">
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleThemeToggle}
                            disabled={isCooldown}
                            className={`p-2 rounded-full transition-colors ${isCooldown
                                ? 'opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500'
                                : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
                                }`}
                            title={isCooldown ? "Please wait..." : (isDark ? "Switch to Light Mode" : "Switch to Dark Mode")}
                        >
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <Link href="/broker/login">
                            <span className="text-sm text-slate-900 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors mr-2 font-semibold">Broker Portal</span>
                        </Link>
                        <Link href="/borrower/apply">
                            <Button variant="primary" size="sm" className="bg-secondary-600 hover:bg-secondary-500">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

