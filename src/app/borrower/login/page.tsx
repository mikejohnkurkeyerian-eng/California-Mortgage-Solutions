'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { signIn } from 'next-auth/react';

export default function BorrowerLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
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
                console.log("Login Success. Hard Redirecting...");
                let dest = '/borrower/dashboard';
                if (window.location.search.includes('callbackUrl')) {
                    const params = new URLSearchParams(window.location.search);
                    dest = params.get('callbackUrl') || '/borrower/dashboard';
                }

                // Force hard reload
                window.location.href = dest;
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
            <Navbar />

            <div className="pt-32 px-4 flex justify-center items-center min-h-[80vh]">
                <Card variant="glass" className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Borrower Login</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    onChange={(e) => setEmail(e.target.value)}
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
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

