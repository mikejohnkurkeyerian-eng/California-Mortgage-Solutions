'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useIntegration } from '@/context/IntegrationContext';
import { MOCK_LENDERS } from '@/lib/lenders';
import Link from 'next/link';

export default function IntegrationsSettingsPage() {
    const { getCredential, saveCredential, deleteCredential } = useIntegration();
    const [openLenderId, setOpenLenderId] = useState<string | null>(null);

    // Form State
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (lenderId: string) => {
        const cred = getCredential(lenderId);
        setClientId(cred?.clientId || '');
        setClientSecret(cred?.clientSecret || '');
        setOpenLenderId(lenderId);
    };

    const handleSave = (lenderId: string) => {
        setIsSaving(true);
        // Simulate validation
        setTimeout(() => {
            saveCredential({
                lenderId,
                clientId,
                clientSecret,
                isEnabled: true
            });
            setOpenLenderId(null);
            setIsSaving(false);
        }, 800);
    };

    const handleDelete = (lenderId: string) => {
        if (confirm('Are you sure you want to disconnect this lender?')) {
            deleteCredential(lenderId);
            setOpenLenderId(null);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <div className="pt-32 px-4 max-w-5xl mx-auto pb-20">
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/broker/settings" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        ← Settings
                    </Link>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                        Lender Integrations
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {MOCK_LENDERS.map((lender) => {
                        const credential = getCredential(lender.id);
                        const isConnected = !!credential && credential.isEnabled;
                        const isEditing = openLenderId === lender.id;

                        return (
                            <Card key={lender.id} className={`transition-all ${isConnected ? 'border-primary-500/50 bg-primary-50/10' : ''}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg
                                                ${lender.logoColor === 'red' ? 'bg-red-500' :
                                                    lender.logoColor === 'blue' ? 'bg-blue-500' :
                                                        lender.logoColor === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'}`}>
                                                {lender.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {lender.name}
                                                    {isConnected && (
                                                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium">
                                                            Connected
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                                    Connect your {lender.name} account to enable direct API submissions and real-time status tracking.
                                                </p>
                                            </div>
                                        </div>

                                        {!isEditing ? (
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                {isConnected ? (
                                                    <Button variant="outline" onClick={() => handleEdit(lender.id)}>
                                                        Manage Connection
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => handleEdit(lender.id)}>
                                                        Connect
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs font-medium text-slate-500 uppercase">Client ID</label>
                                                        <Input
                                                            value={clientId}
                                                            onChange={(e) => setClientId(e.target.value)}
                                                            placeholder={`Enter ${lender.name} Client ID`}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-slate-500 uppercase">Client Secret</label>
                                                        <Input
                                                            type="password"
                                                            value={clientSecret}
                                                            onChange={(e) => setClientSecret(e.target.value)}
                                                            placeholder="••••••••••••••••"
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        {isConnected && (
                                                            <Button
                                                                variant="outline"
                                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200"
                                                                onClick={() => handleDelete(lender.id)}
                                                            >
                                                                Disconnect
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" onClick={() => setOpenLenderId(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleSave(lender.id)}
                                                            isLoading={isSaving}
                                                            disabled={!clientId || !clientSecret}
                                                        >
                                                            Save & Connect
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
