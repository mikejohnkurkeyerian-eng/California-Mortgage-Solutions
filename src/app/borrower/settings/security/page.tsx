'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Navbar } from '@/components/layout/Navbar';
import { generateTwoFactorSecret, enableTwoFactor, disableTwoFactor } from '@/lib/actions/security';
import { useBorrowerAuth } from '@/hooks/useBorrower';
import { toDataURL } from 'qrcode';

export default function SecuritySettingsPage() {
    const { user, mutate } = useBorrowerAuth(); // Assuming 'user' has twoFactorEnabled (need to update hook/API if not)
    const router = useRouter();

    // Setup State
    const [secret, setSecret] = useState('');
    const [otpauth, setOtpauth] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [step, setStep] = useState<'initial' | 'scan' | 'verify'>('initial');

    // Inputs
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Start Setup Flow
    const handleStartSetup = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await generateTwoFactorSecret();
            if (res.error) {
                setError(res.error);
                return;
            }

            if (res.secret && res.otpauth) {
                setSecret(res.secret);
                setOtpauth(res.otpauth);

                // Generate QR Image
                const url = await toDataURL(res.otpauth);
                setQrCodeUrl(url);

                setStep('scan');
            }
        } catch (err) {
            setError("Failed to generate secret");
        } finally {
            setIsLoading(false);
        }
    };

    // Verify and Enable
    const handleEnable = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await enableTwoFactor(verificationCode, secret);
            if (res.error) {
                setError(res.error);
                return;
            }
            setSuccess("Two-Factor Authentication Enabled!");
            setStep('initial');
            mutate(); // Refresh user state
        } catch (err) {
            setError("Failed to enable 2FA");
        } finally {
            setIsLoading(false);
        }
    };

    // Disable
    const handleDisable = async () => {
        if (!confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) return;

        setIsLoading(true);
        try {
            const res = await disableTwoFactor();
            if (res.error) {
                setError(res.error);
                return;
            }
            setSuccess("Two-Factor Authentication Disabled");
            mutate();
        } catch (err) {
            setError("Failed to disable");
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback if useBorrowerAuth doesn't expose 2FA status yet (it usually exposes full user object)
    // We might need to fetch it separately or ensure the session has it.
    // For now assuming session user object has `twoFactorEnabled`.
    // We'll update useBorrower if needed.
    const isEnabled = (user as any)?.twoFactorEnabled;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Security Settings</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                            <CardDescription>
                                Add an extra layer of security to your account by requiring a code from your authenticator app.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
                            )}
                            {success && (
                                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>
                            )}

                            {isEnabled ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-green-600 font-medium p-4 bg-green-50 rounded-lg border border-green-200">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        2FA is currently ENABLED
                                    </div>
                                    <Button variant="danger" onClick={handleDisable} disabled={isLoading}>
                                        Disable 2FA
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    {step === 'initial' && (
                                        <Button onClick={handleStartSetup} isLoading={isLoading}>
                                            Setup 2FA
                                        </Button>
                                    )}

                                    {step === 'scan' && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="p-6 bg-white border border-slate-200 rounded-xl flex flex-col items-center">
                                                <p className="mb-4 text-center text-slate-600">
                                                    1. Open Google Authenticator or Authy.<br />
                                                    2. Scan this QR Code.
                                                </p>
                                                {qrCodeUrl && (
                                                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 mb-4 border p-2 rounded" />
                                                )}
                                                <p className="text-xs text-slate-400">Can't scan? Manual Key: <span className="font-mono text-slate-900 select-all">{secret}</span></p>
                                            </div>

                                            <div className="max-w-sm mx-auto space-y-4">
                                                <p className="text-center text-slate-600">
                                                    3. Enter the 6-digit code from your app to verify.
                                                </p>
                                                <Input
                                                    placeholder="000 000"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    className="text-center text-2xl tracking-widest"
                                                    maxLength={6}
                                                />
                                                <div className="flex gap-3">
                                                    <Button variant="outline" className="w-full" onClick={() => setStep('initial')}>Cancel</Button>
                                                    <Button className="w-full" onClick={handleEnable} isLoading={isLoading} disabled={verificationCode.length < 6}>
                                                        Verify & Enable
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
