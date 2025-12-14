'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signIn } from 'next-auth/react';

export default function BrokerLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log("Attempting Broker Login...");

            // Timeout race
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Login timed out")), 10000)
            );

            const result = await Promise.race([
                signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                }),
                timeoutPromise
            ]) as any;

            console.log("Login Result:", result);

            if (result?.error) {
                console.error("Login Failed:", result.error);
                setError('Invalid email or password');
                setIsLoading(false);
            } else {
                console.log("Login Success. Redirecting...");
                router.push('/broker/dashboard');
                // Don't stop loading, page transition happening
            }
        } catch (err: any) {
            console.error('Login Exception:', err);
            setError(err.message || 'Something went wrong');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 pt-20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-white mb-2">Broker Portal</h1>
                        <p className="text-slate-400">Secure access for authorized brokers</p>
                    </div>

                    <Card variant="glass" className="border-primary-500/20">
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                        {error}
                                    </div>
                                )}
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="broker@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-primary-600 focus:ring-primary-500"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-primary-600 hover:bg-primary-500"
                                    isLoading={isLoading}
                                >
                                    Access Console
                                </Button>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-slate-800 text-slate-400">New to LoanAuto?</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link href="/broker/register">
                                        <Button variant="outline" className="w-full">
                                            Create Broker Account
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-6">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

