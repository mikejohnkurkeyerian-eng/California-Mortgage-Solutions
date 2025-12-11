'use client';

import { useState } from 'react';
import { saveFannieMaeCredentials } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LenderSettings() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFannieMaeCredentials(clientId, clientSecret);
      setStatus('success');
      setClientId('');
      setClientSecret('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Fannie Mae Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">Secure Configuration</h4>
          <p className="text-sm text-slate-400">
            Enter your Fannie Mae Developer credentials to enable <strong>Real Mode</strong>.
            Credentials are encrypted using AES-256 before storage.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Client ID</label>
            <Input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter Client ID"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Client Secret</label>
            <Input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Enter Client Secret"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm">
            {status === 'success' && (
              <span className="text-emerald-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Credentials Encrypted & Saved
              </span>
            )}
            {status === 'error' && (
              <span className="text-red-400">Failed to save credentials</span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !clientId || !clientSecret}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isSaving ? 'Encrypting...' : 'Save Securely'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

