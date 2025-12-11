'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { registerUser } from '@/lib/actions/auth';

export default function BorrowerSignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const result = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'BORROWER'
            });

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                // Success! Redirect to login
                router.push('/borrower/login?registered=true');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 px-4 flex justify-center items-center min-h-[80vh]">
                <Card variant="glass" className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Create Borrower Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-500"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>

                            <p className="text-xs text-center text-slate-500 mt-4">
                                Already have an account? <a href="/borrower/login" className="text-primary-400 hover:underline">Log in</a>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

