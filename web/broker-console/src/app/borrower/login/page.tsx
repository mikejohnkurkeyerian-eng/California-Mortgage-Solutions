'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

import { Suspense } from 'react';

function BorrowerLoginContent() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // REMOVED: Auto-redirect caused loop.
    // Instead, we will render a "Continue" button if session exists.

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const { login } = useBorrowerAuth(); // Not needed anymore
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = {
                email,
                password,
                redirect: false,
                twoFactorCode: twoFactorRequired ? twoFactorCode : undefined
            };

            // Safety Timeout (10s)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Login timed out (Server unresponsive)")), 10000)
            );

            console.log("Attempting Borrower Login...");
            const result = await Promise.race([
                signIn('credentials', formData as any),
                timeoutPromise
            ]) as any;

            console.log("Login Result:", result);

            if (result?.error) {
                if (result.error === '2FA_REQUIRED' || result.error.includes('2FA_REQUIRED')) {
                    setTwoFactorRequired(true);
                    setIsLoading(false);
                    return;
                }

                if (twoFactorRequired && (result.error === 'INVALID_2FA_CODE' || result.error.includes('INVALID'))) {
                    setError("Invalid Code. Please try again.");
                } else {
                    setError('Invalid email or password');
                }
                setIsLoading(false);
            } else {
                // Success
                console.log("Login Success. Redirecting...");
                let dest = '/borrower/dashboard';
                if (window.location.search.includes('callbackUrl')) {
                    const params = new URLSearchParams(window.location.search);
                    dest = params.get('callbackUrl') || '/borrower/dashboard';
                }

                // Refresh and navigate
                router.refresh();
                router.replace(dest);
            }
        } catch (err) {
            console.error('Login error:', err);
            if ((err as Error).message.includes('2FA_REQUIRED')) {
                setTwoFactorRequired(true);
                setIsLoading(false);
                return;
            }
            if ((err as Error).message.includes('timed out')) {
                setError('Server timed out. Please try again.');
            } else {
                setError('Something went wrong');
            }
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">


            <div className="pt-32 px-4 flex justify-center items-center min-h-[80vh]">
                <Card variant="glass" className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Borrower Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {status === 'authenticated' && session?.user ? (
                            <div className="flex flex-col items-center py-6 animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 border border-primary-500/20">
                                    <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Welcome Back!</h3>
                                <p className="text-slate-400 mb-8 text-center text-sm">
                                    You are currently signed in as <br />
                                    <span className="text-white font-medium bg-white/5 px-2 py-1 rounded mt-1 inline-block">{session.user.email}</span>
                                </p>

                                <div className="w-full space-y-3">
                                    <Button
                                        onClick={() => window.location.href = '/borrower/dashboard'}
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20 border-0 py-6 text-lg"
                                    >
                                        Go to Dashboard
                                    </Button>

                                    <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-white/5"></div>
                                        <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-wider">OR</span>
                                        <div className="flex-grow border-t border-white/5"></div>
                                    </div>

                                    <button
                                        onClick={() => signOut({ callbackUrl: '/borrower/login' })}
                                        className="w-full py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out & Switch Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <GoogleSignInButton />

                                <div className="relative flex py-5 items-center">
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or with email</span>
                                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                            className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary-600 hover:bg-primary-500"
                                        isLoading={isLoading}
                                    >
                                        Access Dashboard
                                    </Button>

                                    <p className="text-xs text-center text-slate-500 mt-4">
                                        Don't have an account? <a href="/borrower/signup" className="text-primary-400 hover:underline">Sign up</a>
                                    </p>
                                </form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default function BorrowerLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>}>
            <BorrowerLoginContent />
        </Suspense>
    );
}

