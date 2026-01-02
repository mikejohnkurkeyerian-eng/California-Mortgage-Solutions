'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { registerUser } from '@/lib/actions/auth';
import { validateEmail } from '@/lib/validators';

function BorrowerSignupContent() {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // New validation state
    const [emailError, setEmailError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const brokerId = searchParams.get('ref');

    useEffect(() => {
        if (brokerId) {
            localStorage.setItem('broker_ref_v2', brokerId);
        }
    }, [brokerId]);

    const handleEmailBlur = () => {
        const result = validateEmail(formData.email);
        if (!result.isValid) {
            setEmailError(result.error || 'Invalid email');
        } else {
            setEmailError('');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate Email again before submit
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error || "Invalid email usage.");
            setEmailError(emailValidation.error || "Invalid email");
            setIsLoading(false);
            return;
        }

        try {
            const result = await registerUser({
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: 'BORROWER',
                brokerId: brokerId || undefined
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


            <div className="pt-32 px-4 flex justify-center items-center min-h-[80vh]">
                <Card variant="glass" className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Create Borrower Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GoogleSignInButton />

                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or with email</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Middle Name <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.middleName}
                                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="Doe"
                                    required
                                />
                            </div>



                            // ... inside JSX ...
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value.toLowerCase() });
                                        if (emailError) setEmailError(''); // Clear error on edit
                                    }}
                                    onBlur={handleEmailBlur}
                                    className={`w-full px-4 py-2 bg-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors ${emailError ? 'border-red-500' : 'border-white/10'
                                        }`}
                                    placeholder="john@example.com"
                                    required
                                />
                                {emailError && (
                                    <p className="mt-1 text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                                        {emailError}
                                    </p>
                                )}
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

export default function BorrowerSignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>}>
            <BorrowerSignupContent />
        </Suspense>
    );
}

