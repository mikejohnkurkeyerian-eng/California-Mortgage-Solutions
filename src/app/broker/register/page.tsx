'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BrokerRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<'verify' | 'create'>('verify');
    const [isLoading, setIsLoading] = useState(false);

    // Verification State
    const [nmlsId, setNmlsId] = useState('');
    const [licenseState, setLicenseState] = useState('');

    // Account Creation State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        brokerageName: ''
    });

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate NMLS Verification API call
        setTimeout(() => {
            setIsLoading(false);
            // Mock success - in real app would validate against NMLS database
            if (nmlsId.length >= 4) {
                setStep('create');
            } else {
                alert('Invalid NMLS ID. Please try again.');
            }
        }, 1500);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsLoading(true);

        // Simulate Registration API call
        setTimeout(() => {
            setIsLoading(false);
            // Save "Remember Me" preference implicitly for new accounts if desired, 
            // or just redirect to dashboard
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-white mb-2">Broker Registration</h1>
                        <p className="text-slate-400">
                            {step === 'verify' ? 'Verify your credentials' : 'Create your account'}
                        </p>
                    </div>

                    <Card variant="glass" className="border-primary-500/20">
                        <CardHeader>
                            <CardTitle>
                                {step === 'verify' ? 'License Verification' : 'Account Details'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {step === 'verify' ? (
                                <form onSubmit={handleVerify} className="space-y-6 animate-fade-in">
                                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-primary-200">
                                            To maintain platform security, we verify all broker licenses against the NMLS database before account creation.
                                        </p>
                                    </div>

                                    <Input
                                        label="NMLS ID"
                                        placeholder="e.g. 123456"
                                        value={nmlsId}
                                        onChange={(e) => setNmlsId(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="State Licensed"
                                        placeholder="e.g. CA, NY, TX"
                                        value={licenseState}
                                        onChange={(e) => setLicenseState(e.target.value)}
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary-600 hover:bg-primary-500"
                                        isLoading={isLoading}
                                    >
                                        Verify License
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Last Name"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label="Brokerage Name"
                                        value={formData.brokerageName}
                                        onChange={(e) => setFormData({ ...formData, brokerageName: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-secondary-600 hover:bg-secondary-500 mt-4"
                                        isLoading={isLoading}
                                    >
                                        Create Account
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center mt-6">
                        <Link href="/broker/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
