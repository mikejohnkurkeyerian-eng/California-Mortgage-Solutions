'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { registerUser } from '@/lib/actions/auth';

interface RegisterFormProps {
    forcedRole?: 'BORROWER' | 'BROKER';
    hideRoleSelection?: boolean;
}

export function RegisterForm({ forcedRole, hideRoleSelection = false }: RegisterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRoleParam = searchParams.get('role') as 'BORROWER' | 'BROKER' | null;

    // Priority: forcedRole prop > URL param > default 'BORROWER'
    const initialRole = forcedRole || initialRoleParam || 'BORROWER';

    const [role, setRole] = useState<'BORROWER' | 'BROKER'>(initialRole);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        brokerName: '', // Only for brokers
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Effect to enforce role if provided in URL or props
    useEffect(() => {
        if (forcedRole) {
            setRole(forcedRole);
        } else if (initialRoleParam && (initialRoleParam === 'BORROWER' || initialRoleParam === 'BROKER')) {
            setRole(initialRoleParam);
        }
    }, [forcedRole, initialRoleParam]);

    const getTitle = () => {
        if (role === 'BROKER') return 'Join Broker Network';
        if (role === 'BORROWER') return 'Create Borrower Account';
        return 'Create Account';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await registerUser({
                ...formData,
                role,
            });

            if (result.error) {
                setError(result.error);
            } else {
                // Redirect to login on success
                const callbackUrl = searchParams.get('callbackUrl');
                let redirectUrl = callbackUrl
                    ? `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : '/login?registered=true';

                // Append role to ensure correct redirection after login
                if (role) {
                    redirectUrl += `&role=${role}`;
                }

                router.push(redirectUrl);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

                    {/* Role Selection - Only show if permission given and no fixed role */}
                    {!hideRoleSelection && !forcedRole && !initialRoleParam && (
                        <div className="flex p-1 bg-slate-100 dark:bg-surface-highlight/30 rounded-lg mb-4">
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'BORROWER'
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setRole('BORROWER')}
                            >
                                Borrower
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'BROKER'
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                onClick={() => setRole('BROKER')}
                            >
                                Broker
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                            minLength={6}
                        />
                    </div>

                    {role === 'BROKER' && (
                        <div className="space-y-2 animate-fade-in">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Brokerage Name</label>
                            <input
                                type="text"
                                value={formData.brokerName}
                                onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required={role === 'BROKER'}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-500 mt-4"
                        isLoading={isLoading}
                    >
                        Create Account
                    </Button>

                    <div className="text-center text-sm text-slate-400 mt-4">
                        Already have an account?{' '}
                        <a href="/login" className="text-primary-400 hover:text-primary-300">
                            Sign in
                        </a>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
