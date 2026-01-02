'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { MultiSelect } from '@/components/ui/MultiSelect';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateEmail } from '@/lib/validators';

const US_STATES = [
    { label: 'Alabama', value: 'AL' }, { label: 'Alaska', value: 'AK' }, { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' }, { label: 'California', value: 'CA' }, { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' }, { label: 'Delaware', value: 'DE' }, { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' }, { label: 'Hawaii', value: 'HI' }, { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' }, { label: 'Indiana', value: 'IN' }, { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' }, { label: 'Kentucky', value: 'KY' }, { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' }, { label: 'Maryland', value: 'MD' }, { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' }, { label: 'Minnesota', value: 'MN' }, { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' }, { label: 'Montana', value: 'MT' }, { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' }, { label: 'New Hampshire', value: 'NH' }, { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' }, { label: 'New York', value: 'NY' }, { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' }, { label: 'Ohio', value: 'OH' }, { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' }, { label: 'Pennsylvania', value: 'PA' }, { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' }, { label: 'South Dakota', value: 'SD' }, { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' }, { label: 'Utah', value: 'UT' }, { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' }, { label: 'Washington', value: 'WA' }, { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' }, { label: 'Wyoming', value: 'WY' }
];

export default function BrokerRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<'verify' | 'create'>('verify');
    const [isLoading, setIsLoading] = useState(false);

    // Verification State
    const [nmlsId, setNmlsId] = useState('');
    const [licenseState, setLicenseState] = useState<string[]>([]);

    // Account Creation State
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        brokerageName: ''
    });

    const [emailError, setEmailError] = useState('');

    const handleEmailBlur = () => {
        const result = validateEmail(formData.email);
        if (!result.isValid) {
            setEmailError(result.error || 'Invalid email');
        } else {
            setEmailError('');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate NMLS Verification API call
        setTimeout(() => {
            setIsLoading(false);
            // Mock success - in real app would validate against NMLS database
            if (nmlsId.length >= 4) {
                setStep('create');
                setError('');
            } else {
                setError('Invalid NMLS ID. Please try again.');
            }
        }, 1500);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate Email
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error || 'Invalid email');
            setEmailError(emailValidation.error || 'Invalid email');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/broker/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    nmlsId,
                    licenseStates: licenseState
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Registration failed:", data);
                setError(data.details || data.error || 'Registration failed');
                setIsLoading(false);
                return;
            }

            // Success
            // Optional: Auto-login here using signIn, or redirect to login
            // For cleanliness, let's redirect to login for now, or dashboard if we had auto-login (requires credentials auth flow locally)
            // Ideally we auto-login, but `signIn` needs clean creds. 
            // Let's redirect to login with a query param? or just push to dashboard?
            // Actually, we can just signIn immediately with the password we have.

            const { signIn } = await import('next-auth/react');
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            if (result?.error) {
                // If auto-login fails, send to login page
                console.error("Auto-login failed:", result.error);
                router.push('/broker/login');
            } else {
                router.push('/broker/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
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
                                    {error && (
                                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            {error}
                                        </div>
                                    )}
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
                                    <MultiSelect
                                        label="States Licensed"
                                        placeholder="Select states..."
                                        options={US_STATES}
                                        selected={licenseState}
                                        onChange={setLicenseState}
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
                                    {error && (
                                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            {error}
                                        </div>
                                    )}
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
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value.toLowerCase() });
                                            if (emailError) setEmailError('');
                                        }}
                                        onBlur={handleEmailBlur}
                                        error={emailError}
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

