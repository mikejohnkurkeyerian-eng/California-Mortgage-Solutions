'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useBrokerSettings } from '@/context/BrokerContext';
import { useBorrowerAuth } from '@/hooks/useBorrower';
import { usePathname } from 'next/navigation';

export function BorrowerNavbar() {
    const { settings, toggleTheme } = useBrokerSettings();
    const isDark = settings.theme === 'dark';
    const [isCooldown, setIsCooldown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { borrowerId, logout, isLoading } = useBorrowerAuth();
    const pathname = usePathname();

    const handleThemeToggle = () => {
        if (isCooldown) return;

        toggleTheme();
        setIsCooldown(true);
        setTimeout(() => {
            setIsCooldown(false);
        }, 500);
    };

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/borrower/start" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-xl font-heading font-bold text-slate-900 dark:text-white">LoanAuto <span className="text-secondary-500 text-sm font-normal">Borrower</span></span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {/* Common Attraction Links (Visible to All) */}
                        <Link
                            href="/borrower/rates"
                            className={`text-sm font-semibold transition-colors ${isActive('/borrower/rates') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                        >
                            Rates
                        </Link>
                        <Link
                            href="/borrower/calculators"
                            className={`text-sm font-semibold transition-colors ${isActive('/borrower/calculators') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                        >
                            Calculators
                        </Link>

                        {/* Borrower Links */}
                        {borrowerId ? (
                            <>
                                <Link
                                    href="/borrower/dashboard"
                                    className={`text-sm font-semibold transition-colors ${isActive('/borrower/dashboard') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/borrower/documents"
                                    className={`text-sm font-semibold transition-colors ${isActive('/borrower/documents') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                                >
                                    Documents
                                </Link>
                                <Link
                                    href="/borrower/loan-options"
                                    className={`text-sm font-semibold transition-colors ${isActive('/borrower/loan-options') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                                >
                                    Loan Options
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/borrower/start" className="text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors font-semibold">
                                    Home
                                </Link>
                            </>
                        )}
                        <Link
                            href="/borrower/resources"
                            className={`text-sm font-semibold transition-colors ${isActive('/borrower/resources') ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-900 dark:text-white hover:text-secondary-600 dark:hover:text-secondary-300'}`}
                        >
                            Resources
                        </Link>
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

                        {borrowerId ? (
                            <Button
                                variant="ghost"
                                className="text-slate-900 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 mr-2"
                                onClick={logout}
                            >
                                Log Out
                            </Button>
                        ) : (
                            <>
                                <Link href="/borrower/login">
                                    <Button variant="ghost" className="text-slate-900 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400 mr-2">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/borrower/start">
                                    <Button variant="primary" size="sm" className="bg-secondary-600 hover:bg-secondary-500">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>

            {/* Mobile Menu */ }
    {
        isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        href="/borrower/rates"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/rates') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                    >
                        Rates
                    </Link>
                    <Link
                        href="/borrower/calculators"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/calculators') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                    >
                        Calculators
                    </Link>

                    {borrowerId ? (
                        <>
                            <Link
                                href="/borrower/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/dashboard') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/borrower/documents"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/documents') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                            >
                                Documents
                            </Link>
                            <Link
                                href="/borrower/loan-options"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/loan-options') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                            >
                                Loan Options
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/borrower/start"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400"
                        >
                            Home
                        </Link>
                    )}
                    <Link
                        href="/borrower/resources"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/borrower/resources') ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400' : 'text-slate-700 dark:text-slate-300 hover:text-secondary-600 dark:hover:text-secondary-400'}`}
                    >
                        Resources
                    </Link>
                </div>
            </div>
        )
    }
        </nav >
    );
}
