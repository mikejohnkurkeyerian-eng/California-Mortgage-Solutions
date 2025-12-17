'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrokerSettings } from '@/context/BrokerContext';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function BrokerNavbar() {
    const { settings, toggleTheme } = useBrokerSettings();
    const isDark = settings.theme === 'dark';
    const [isCooldown, setIsCooldown] = useState(false);

    const handleThemeToggle = () => {
        if (isCooldown) return;

        toggleTheme();
        setIsCooldown(true);
        setTimeout(() => {
            setIsCooldown(false);
        }, 500);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/broker/login' });
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link href="/broker/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="text-xl font-heading font-bold text-slate-900 dark:text-white">Broker<span className="text-primary-500">Portal</span></span>
                        </Link>

                        {/* Broker Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/broker/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                Pipeline
                            </Link>
                            <Link href="/broker/clara" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                CLARA AI
                            </Link>
                            <span className="text-slate-400 cursor-not-allowed" title="Coming Soon">Commission</span>
                            <span className="text-slate-400 cursor-not-allowed" title="Coming Soon">Resources</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
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

                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>

                        {/* Settings Button */}
                        <Link href="/broker/settings">
                            <button className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </Link>

                        <Button
                            variant="primary"
                            size="sm"
                            className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
