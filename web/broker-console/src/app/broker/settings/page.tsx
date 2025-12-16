'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBrokerSettings, EmailSettings } from '@/context/BrokerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LenderSettings } from '@/components/LenderSettings';

function LenderManagement() {
    return (
        <Card variant="glass" className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lender Management</CardTitle>
                <Link href="/broker/settings/integrations">
                    <Button size="sm">Manage Integrations</Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Connect to institutional lenders (Rocket, UWM, PennyMac) to access their loan products and automated underwriting systems.
                    </p>
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 text-white rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">API Integrations</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your Client IDs and Secrets for real-time submission.</p>
                            </div>
                        </div>
                        <Link href="/broker/settings/integrations">
                            <Button variant="outline">Configure</Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CreditIntegration() {
    const { settings, updateSettings } = useBrokerSettings();
    const config = settings.creditIntegration || { provider: 'none', enabled: false };

    const handleUpdate = (field: string, value: any) => {
        updateSettings({
            creditIntegration: {
                ...config,
                [field]: value,
                enabled: field === 'provider' ? value !== 'none' : config.enabled
            }
        });
    };

    return (
        <Card variant="glass" className="mt-8">
            <CardHeader>
                <CardTitle>Credit Integration</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Connect your Credit Reporting Agency (CRA) account to automatically pull Tri-Merge credit reports during underwriting.
                    </p>

                    <div className="bg-white/5 p-4 rounded-lg border border-slate-200 dark:border-white/10 space-y-4">
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Credit Provider</label>
                            <select
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white p-2 focus:ring-primary-500 focus:border-primary-500"
                                value={config.provider}
                                onChange={(e) => handleUpdate('provider', e.target.value)}
                            >
                                <option value="none">Select a Provider...</option>
                                <option value="cic">Universal Credit (CIC)</option>
                                <option value="advantage">Advantage Credit</option>
                                <option value="credco">CoreLogic Credco</option>
                                <option value="mock">Mock Provider (Testing)</option>
                            </select>
                        </div>

                        {config.provider !== 'none' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <Input
                                    label="Account ID / Subscriber Code"
                                    value={config.accountId || ''}
                                    onChange={(e) => handleUpdate('accountId', e.target.value)}
                                    placeholder="e.g. 12345678"
                                />
                                <Input
                                    label="Username"
                                    value={config.username || ''}
                                    onChange={(e) => handleUpdate('username', e.target.value)}
                                    placeholder="Username"
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={config.password || ''}
                                    onChange={(e) => handleUpdate('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {config.provider === 'mock' && (
                            <div className="mt-4 p-3 bg-blue-500/10 text-blue-300 text-sm rounded border border-blue-500/20">
                                <strong>Testing Mode:</strong> This mock provider simulates credit pulls based on the SSN entered.
                                Use SSN ending in 9000 for Excellent credit.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function UnderwriterManagement() {
    const { settings, addUnderwriter, removeUnderwriter } = useBrokerSettings();
    const [isAdding, setIsAdding] = useState(false);
    const [newUnderwriter, setNewUnderwriter] = useState({ name: '', email: '', company: '' });

    const handleAdd = () => {
        if (!newUnderwriter.name || !newUnderwriter.email) return;
        addUnderwriter({
            name: newUnderwriter.name,
            email: newUnderwriter.email,
            company: newUnderwriter.company,
            type: 'external'
        });
        setNewUnderwriter({ name: '', email: '', company: '' });
        setIsAdding(false);
    };

    return (
        <Card variant="glass" className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Underwriter Management</CardTitle>
                <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : 'Add Underwriter'}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage manual underwriter contacts. These are individuals you can route applications to for manual review.
                    </p>

                    {isAdding && (
                        <div className="bg-white/5 p-4 rounded-lg border border-slate-200 dark:border-white/10 space-y-4">
                            <h3 className="text-slate-900 dark:text-white font-medium">Add New Underwriter</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    value={newUnderwriter.name}
                                    onChange={(e) => setNewUnderwriter({ ...newUnderwriter, name: e.target.value })}
                                    placeholder="e.g. John Smith"
                                />
                                <Input
                                    label="Email"
                                    value={newUnderwriter.email}
                                    onChange={(e) => setNewUnderwriter({ ...newUnderwriter, email: e.target.value })}
                                    placeholder="underwriter@example.com"
                                />
                                <Input
                                    label="Company (Optional)"
                                    value={newUnderwriter.company}
                                    onChange={(e) => setNewUnderwriter({ ...newUnderwriter, company: e.target.value })}
                                    placeholder="e.g. The Mortgage Shop"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleAdd}>Save Underwriter</Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {settings.underwriters.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-500 bg-white/5 rounded-lg border border-dashed border-slate-300 dark:border-white/10">
                                No manual underwriters configured.
                            </div>
                        ) : (
                            settings.underwriters.map((uw) => (
                                <div key={uw.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-slate-900 dark:text-white font-medium">{uw.name}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {uw.company ? `${uw.company} • ` : ''}{uw.email}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        onClick={() => removeUnderwriter(uw.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EmailConfiguration() {
    const { settings, updateEmailSettings } = useBrokerSettings();
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');

    // Use local state for inputs to prevent cursor jumping, but sync with context
    // Actually, for real-time, we should just use the context value directly if performance allows.
    // Given the small scale, direct context update is fine, but we need to handle the object merge carefully.

    const config = settings.emailSettings || {
        provider: 'gmail',
        fromEmail: '',
        fromName: '',
        smtpUser: '',
        smtpPass: '',
        apiKey: ''
    };

    const updateField = (field: keyof EmailSettings, value: any) => {
        updateEmailSettings({
            ...config,
            [field]: value
        });
    };

    const handleTestConnection = async () => {
        setTestStatus('testing');
        setTestMessage('');
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: config.fromEmail, // Send to self
                    subject: 'Test Email from Broker Console',
                    html: '<p>This is a test email to verify your configuration. If you are reading this, it works!</p>',
                    settings: config
                })
            });

            const result = await response.json();
            if (response.ok) {
                setTestStatus('success');
                setTestMessage('Connection successful! Check your inbox.');
            } else {
                setTestStatus('error');
                setTestMessage(result.error || 'Failed to send test email');
            }
        } catch (error: any) {
            setTestStatus('error');
            setTestMessage(error.message || 'Network error');
        }
    };

    return (
        <Card variant="glass" className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Email Service Configuration</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Configure how the bot sends emails on your behalf. You can use your own Gmail account or an email API service.
                    </p>

                    <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-slate-200 dark:border-white/10">
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email Provider</label>
                            <select
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white p-2 focus:ring-primary-500 focus:border-primary-500"
                                value={config.provider}
                                onChange={(e) => updateField('provider', e.target.value)}
                            >
                                <option value="gmail">Gmail (Recommended for Individuals)</option>
                                <option value="sendgrid">SendGrid API</option>
                                <option value="resend">Resend API</option>
                                <option value="custom_smtp">Custom SMTP</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="From Name"
                                value={config.fromName}
                                onChange={(e) => updateField('fromName', e.target.value)}
                                placeholder="e.g. Mike's Mortgage Bot"
                            />
                            <Input
                                label="From Email"
                                value={config.fromEmail}
                                onChange={(e) => updateField('fromEmail', e.target.value)}
                                placeholder="e.g. mike@example.com"
                            />
                        </div>

                        {config.provider === 'gmail' && (
                            <div className="space-y-4 pt-2 border-t border-white/10">
                                <div className="bg-blue-500/10 p-3 rounded text-sm text-blue-300 border border-blue-500/20">
                                    <strong>How to use Gmail:</strong>
                                    <ol className="list-decimal ml-4 mt-1 space-y-1">
                                        <li>Go to your <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google Account Security settings</a>.</li>
                                        <li>Enable 2-Step Verification if not already on.</li>
                                        <li>Search for "App Passwords".</li>
                                        <li>Create a new App Password named "Mortgage Bot".</li>
                                        <li>Paste that 16-character password below.</li>
                                    </ol>
                                </div>
                                <Input
                                    label="Gmail Address"
                                    value={config.smtpUser}
                                    onChange={(e) => updateField('smtpUser', e.target.value)}
                                    placeholder="your.email@gmail.com"
                                />
                                <Input
                                    label="App Password"
                                    type="password"
                                    value={config.smtpPass}
                                    onChange={(e) => updateField('smtpPass', e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                />
                            </div>
                        )}

                        {(config.provider === 'sendgrid' || config.provider === 'resend') && (
                            <Input
                                label="API Key"
                                type="password"
                                value={config.apiKey}
                                onChange={(e) => updateField('apiKey', e.target.value)}
                                placeholder={`Enter your ${config.provider === 'sendgrid' ? 'SendGrid' : 'Resend'} API Key`}
                            />
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="text-sm">
                                {testStatus === 'testing' && <span className="text-blue-400">Testing connection...</span>}
                                {testStatus === 'success' && <span className="text-green-400">✅ {testMessage}</span>}
                                {testStatus === 'error' && <span className="text-red-400">❌ {testMessage}</span>}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTestConnection}
                                disabled={testStatus === 'testing'}
                            >
                                Test Connection
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BrokerSettingsPage() {
    const { settings, updateSettings, resetSettings } = useBrokerSettings();



    const handleReset = () => {
        if (confirm('Are you sure you want to reset all settings to system defaults? This will clear your custom configurations.')) {
            resetSettings();
            window.location.reload();
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Broker Settings</h1>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Changes save automatically
                        </div>
                    </div>

                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Automated Underwriting Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Select the underwriting engines you want to use for automated analysis.
                                    Enabling both will run parallel checks.
                                </p>

                                <div className="space-y-4">
                                    <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={settings.useFannieMae}
                                            onChange={(e) => updateSettings({ useFannieMae: e.target.checked })}
                                            className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-primary-500 focus:ring-primary-500"
                                        />
                                        <div>
                                            <div className="text-slate-900 dark:text-white font-medium">Fannie Mae Desktop Underwriter (DU)</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">Analyzes loans against Fannie Mae selling guide guidelines.</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={settings.useFreddieMac}
                                            onChange={(e) => updateSettings({ useFreddieMac: e.target.checked })}
                                            className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-primary-500 focus:ring-primary-500"
                                        />
                                        <div>
                                            <div className="text-slate-900 dark:text-white font-medium">Freddie Mac Loan Product Advisor (LPA)</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">Analyzes loans against Freddie Mac selling guide guidelines.</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center text-sm text-amber-400 bg-amber-500/10 p-3 rounded">
                                        <span className="mr-2">ℹ️</span>
                                        Changes are saved automatically and will apply to the next loan submission.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="mt-8">
                        <CardHeader>
                            <CardTitle>Default Underwriting Workflow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Choose the default method for submitting loan packages. This selection will be pre-filled when you click "Submit to Underwriting", but you can always change it for individual loans.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => updateSettings({ defaultUnderwritingMode: 'EMAIL' })}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${settings.defaultUnderwritingMode === 'EMAIL'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">Email Package</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Send PDF packages via email to external underwriters or investors.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => updateSettings({ defaultUnderwritingMode: 'IN_HOUSE' })}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${settings.defaultUnderwritingMode === 'IN_HOUSE'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">In-House Team</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Route to internal underwriting queue for processing.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => updateSettings({ defaultUnderwritingMode: 'LENDER' })}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${settings.defaultUnderwritingMode === 'LENDER'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">External Lender</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Submit directly to lender portal integrations (UWM, Rocket, etc).
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    <Card variant="glass" className="mt-8">
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Customize the look and feel of the application.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => updateSettings({ theme: 'light' })}
                                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${settings.theme === 'light' ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="w-full h-24 bg-slate-100 rounded border border-slate-200 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-4 bg-white border-b border-slate-200"></div>
                                                <div className="absolute top-8 left-4 w-16 h-2 bg-slate-200 rounded"></div>
                                                <div className="absolute top-12 left-4 w-24 h-2 bg-slate-200 rounded"></div>
                                            </div>
                                            <span className={`font-medium ${settings.theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>Light Mode</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ theme: 'dark' })}
                                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${settings.theme === 'dark' ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="w-full h-24 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-4 bg-slate-800 border-b border-slate-700"></div>
                                                <div className="absolute top-8 left-4 w-16 h-2 bg-slate-700 rounded"></div>
                                                <div className="absolute top-12 left-4 w-24 h-2 bg-slate-700 rounded"></div>
                                            </div>
                                            <span className={`font-medium ${settings.theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>Dark Mode</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <EmailConfiguration />
                    <CreditIntegration />
                    <LenderSettings />
                    <LenderManagement />
                    <UnderwriterManagement />

                    {/* Danger Zone */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-medium">Reset All Settings</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    This will restore default configurations and remove all custom lenders and underwriters.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                            >
                                Reset to Defaults
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

