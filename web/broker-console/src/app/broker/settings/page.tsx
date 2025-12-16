'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useBrokerSettings, EmailSettings } from '@/context/BrokerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LenderSettings } from '@/components/LenderSettings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'; // We need to check if this exists or build simple tabs
// Assuming we don't have a Tabs component yet, I will build a simple one inline or use basic state.

/* -------------------------------------------------------------------------- */
/*                                SUB-COMPONENTS                              */
/* -------------------------------------------------------------------------- */

// --- General Appearance ---
function AppearanceSettings() {
    const { settings, updateSettings } = useBrokerSettings();
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Theme Preferences</h3>
                <div className="grid grid-cols-2 gap-4 max-w-xl">
                    <button
                        onClick={() => updateSettings({ theme: 'light' })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${settings.theme === 'light' ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-full h-24 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-4 bg-white border-b border-slate-200"></div>
                                <div className="absolute top-8 left-4 w-16 h-2 bg-slate-200 rounded group-hover:w-20 transition-all"></div>
                                <div className="absolute top-12 left-4 w-24 h-2 bg-slate-200 rounded group-hover:w-28 transition-all delay-75"></div>
                            </div>
                            <span className={`font-semibold ${settings.theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>Light Mode</span>
                        </div>
                    </button>
                    <button
                        onClick={() => updateSettings({ theme: 'dark' })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${settings.theme === 'dark' ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-4 bg-slate-800 border-b border-slate-700"></div>
                                <div className="absolute top-8 left-4 w-16 h-2 bg-slate-700 rounded group-hover:w-20 transition-all"></div>
                                <div className="absolute top-12 left-4 w-24 h-2 bg-slate-700 rounded group-hover:w-28 transition-all delay-75"></div>
                            </div>
                            <span className={`font-semibold ${settings.theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}>Dark Mode</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Integrations (Credit & Email) ---
function IntegrationSettings() {
    const { settings, updateSettings, updateEmailSettings } = useBrokerSettings();
    const config = settings.creditIntegration || { provider: 'none', enabled: false };
    const emailConfig = settings.emailSettings || { provider: 'gmail', fromEmail: '', fromName: '', smtpUser: '', smtpPass: '', apiKey: '' };

    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');

    const handleUpdateCredit = (field: string, value: any) => {
        updateSettings({
            creditIntegration: {
                ...config,
                [field]: value,
                enabled: field === 'provider' ? value !== 'none' : config.enabled
            }
        });
    };

    const handleUpdateEmail = (field: keyof EmailSettings, value: any) => {
        updateEmailSettings({ ...emailConfig, [field]: value });
    };

    const handleTestEmail = async () => {
        setTestStatus('testing');
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: emailConfig.fromEmail,
                    subject: 'Test Email from Broker Console',
                    html: '<p>This is a test email to verify your configuration. If you are reading this, it works!</p>',
                    settings: emailConfig
                })
            });
            const result = await response.json();
            if (response.ok) {
                setTestStatus('success');
                setTestMessage('Sent successfully!');
            } else {
                setTestStatus('error');
                setTestMessage(result.error || 'Failed');
            }
        } catch (error: any) {
            setTestStatus('error');
            setTestMessage(error.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Credit Section */}
            <Card variant="glass">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <CardTitle>Credit Reporting</CardTitle>
                    </div>
                    <CardDescription>Connect a Credit Reporting Agency (CRA) to pull reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Provider</label>
                        <select
                            className="w-full bg-slate-800/50 border border-white/10 rounded-md text-white p-2.5 focus:ring-2 focus:ring-primary-500 transition-all"
                            value={config.provider}
                            onChange={(e) => handleUpdateCredit('provider', e.target.value)}
                        >
                            <option value="none">None (Disabled)</option>
                            <option value="mock">✨ Mock Provider (Testing)</option>
                            <option value="cic">Universal Credit (CIC)</option>
                            <option value="advantage">Advantage Credit</option>
                            <option value="credco">CoreLogic Credco</option>
                        </select>
                    </div>
                    {config.provider !== 'none' && config.provider !== 'mock' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            <Input label="Account ID" value={config.accountId || ''} onChange={(e) => handleUpdateCredit('accountId', e.target.value)} placeholder="12345" />
                            <Input label="Username" value={config.username || ''} onChange={(e) => handleUpdateCredit('username', e.target.value)} placeholder="user" />
                            <div className="md:col-span-2">
                                <Input label="Password" type="password" value={config.password || ''} onChange={(e) => handleUpdateCredit('password', e.target.value)} placeholder="••••" />
                            </div>
                        </div>
                    )}
                    {config.provider === 'mock' && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                            <strong>Sandbox Mode Active:</strong> Credit pulls will be simulated. Use SSN ending in 9000 for 750+ scores.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Email Section */}
            <Card variant="glass">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <CardTitle>Email Service</CardTitle>
                    </div>
                    <CardDescription>Configure outbound email for notifications and packages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Sender Name" value={emailConfig.fromName} onChange={(e) => handleUpdateEmail('fromName', e.target.value)} placeholder="e.g. Loans Bot" />
                        <Input label="Sender Email" value={emailConfig.fromEmail} onChange={(e) => handleUpdateEmail('fromEmail', e.target.value)} placeholder="e.g. bot@company.com" />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Service Provider</label>
                        <select
                            className="w-full bg-slate-800/50 border border-white/10 rounded-md text-white p-2.5 focus:ring-2 focus:ring-primary-500"
                            value={emailConfig.provider}
                            onChange={(e) => handleUpdateEmail('provider', e.target.value)}
                        >
                            <option value="gmail">Gmail (Easiest)</option>
                            <option value="sendgrid">SendGrid API</option>
                            <option value="resend">Resend API</option>
                            <option value="custom_smtp">Custom SMTP</option>
                        </select>
                    </div>

                    {emailConfig.provider === 'gmail' && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4 animate-fade-in">
                            <div className="bg-amber-500/10 text-amber-300 text-sm p-3 rounded border border-amber-500/20">
                                <strong>Setup required:</strong> Enable 2FA on your Google Account, then generate an App Password.
                                <div className="mt-2">
                                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-medium">Click here to create App Password →</a>
                                </div>
                            </div>
                            <Input label="Gmail Address" value={emailConfig.smtpUser} onChange={(e) => handleUpdateEmail('smtpUser', e.target.value)} placeholder="you@gmail.com" />
                            <Input label="App Password (16 chars)" type="password" value={emailConfig.smtpPass} onChange={(e) => handleUpdateEmail('smtpPass', e.target.value)} placeholder="xxxx xxxx xxxx xxxx" />
                        </div>
                    )}

                    {(emailConfig.provider === 'sendgrid' || emailConfig.provider === 'resend') && (
                        <Input label="API Key" type="password" value={emailConfig.apiKey} onChange={(e) => handleUpdateEmail('apiKey', e.target.value)} placeholder="sk_..." />
                    )}

                    <div className="pt-2 flex items-center justify-between">
                        <span className={`text-sm ${testStatus === 'success' ? 'text-emerald-400' : testStatus === 'error' ? 'text-red-400' : 'text-slate-500'}`}>
                            {testStatus === 'testing' && 'Testing...'}
                            {testStatus === 'success' && `✓ ${testMessage}`}
                            {testStatus === 'error' && `✗ ${testMessage}`}
                        </span>
                        <Button size="sm" variant="outline" onClick={handleTestEmail} isLoading={testStatus === 'testing'}>
                            Send Test Email
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Team Management ---
function TeamSettings() {
    const { settings, addUnderwriter, removeUnderwriter } = useBrokerSettings();
    const [newUw, setNewUw] = useState({ name: '', email: '' });

    const handleAdd = () => {
        if (!newUw.name || !newUw.email) return;
        addUnderwriter({ name: newUw.name, email: newUw.email, type: 'external' });
        setNewUw({ name: '', email: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Underwriting Team</CardTitle>
                    <CardDescription>Colleagues or external underwriters who can review loans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <Input value={newUw.name} onChange={e => setNewUw({ ...newUw, name: e.target.value })} placeholder="Name" className="flex-1" />
                        <Input value={newUw.email} onChange={e => setNewUw({ ...newUw, email: e.target.value })} placeholder="Email" className="flex-1" />
                        <Button onClick={handleAdd}>Add</Button>
                    </div>

                    <div className="space-y-2">
                        {settings.underwriters.length === 0 && <p className="text-slate-500 text-center py-4">No underwriters added.</p>}
                        {settings.underwriters.map(u => (
                            <div key={u.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                                        {u.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-200">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => removeUnderwriter(u.id)}>Remove</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

const TABS = [
    { id: 'general', label: 'General', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { id: 'integrations', label: 'Integrations', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { id: 'lenders', label: 'Lenders', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'team', label: 'Team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
];

export default function BrokerSettingsPage() {
    const { resetSettings } = useBrokerSettings();
    const [activeTab, setActiveTab] = useState('general');

    return (
        <main className="min-h-screen bg-background text-slate-100">
            <Navbar />
            <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold gradient-text">Broker Configuration</h1>
                        <p className="text-slate-400">Manage your originations pipeline, integrations, and preferences.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Auto-Save Active
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR NAVIGATION */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                </svg>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}

                        <div className="pt-8 mt-8 border-t border-white/10">
                            <button
                                onClick={() => {
                                    if (confirm('Reset all settings to default?')) {
                                        resetSettings();
                                        window.location.reload();
                                    }
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="font-medium">Reset Defaults</span>
                            </button>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1">
                        {activeTab === 'general' && <AppearanceSettings />}
                        {activeTab === 'integrations' && <IntegrationSettings />}
                        {activeTab === 'lenders' && (
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg text-primary-200">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Lender Management
                                    </h4>
                                    <p className="text-sm mt-1 opacity-90">Manage institutional lender connections and API credentials here.</p>
                                </div>
                                <LenderSettings />
                            </div>
                        )}
                        {activeTab === 'team' && <TeamSettings />}
                    </div>
                </div>
            </div>
        </main>
    );
}
