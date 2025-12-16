'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getTitle = () => {
        if (role === 'BROKER') return 'Broker Login';
        if (role === 'BORROWER') return 'Borrower Login';
        return 'Welcome Back';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                // Redirect based on callbackUrl, role, or default
                const callbackUrl = searchParams.get('callbackUrl');

                if (callbackUrl) {
                    router.push(decodeURIComponent(callbackUrl));
                } else if (role === 'BROKER') {
                    router.push('/broker/dashboard');
                } else {
                    router.push('/borrower/dashboard');
                }
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const signUpLink = role ? `/register?role=${role}` : '/register';

    return (
        <Card variant="glass" className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-2xl">{getTitle()}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-500"
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>

                    <div className="text-center text-sm text-slate-400 mt-4">
                        Don't have an account?{' '}
                        <Link href={signUpLink} className="text-primary-400 hover:text-primary-300">
                            Sign up
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen pt-20 px-4">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}

