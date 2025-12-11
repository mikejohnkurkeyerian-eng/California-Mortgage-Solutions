'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBrokerSettings } from '@/context/BrokerContext';
import { EmailService } from '@/lib/email-service';
import { useToast } from '@/context/ToastContext';

export function InvitationLink() {
    const { settings } = useBrokerSettings();
    const { setToast } = useToast();
    const [recipientEmail, setRecipientEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Get Broker ID from settings or session (mocking session access here or passed prop)
    // For now, we'll use the first underwriter ID or a default if not found
    const brokerId = settings.underwriters[0]?.id || 'default-broker';
    const brokerName = settings.emailSettings?.fromName || 'Mortgage Broker';

    // Construct Link (Assuming running on localhost:3000 or production domain)
    // We use window.location.origin if available, else placeholder
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const inviteLink = `${origin}/borrower/apply?ref=${brokerId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setToast({ message: 'Invitation link copied to clipboard!', type: 'success' });
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientEmail || !recipientEmail.includes('@')) {
            setToast({ message: 'Please enter a valid email address.', type: 'error' });
            return;
        }

        setIsSending(true);
        try {
            const success = await EmailService.sendInvitation(
                brokerName,
                brokerId,
                recipientEmail,
                inviteLink,
                settings.emailSettings
            );

            if (success) {
                setToast({ message: `Invitation sent to ${recipientEmail}`, type: 'success' });
                setRecipientEmail('');
            } else {
                setToast({ message: 'Failed to send invitation. Check your email settings.', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'An error occurred while sending.', type: 'error' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card variant="glass" className="mb-8 border-primary-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Invite Borrowers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Share this unique link with borrowers. Applications submitted through this link will be automatically assigned to you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Copy Link Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Personal Invitation Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={inviteLink}
                                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-600 dark:text-slate-400 font-mono"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Email Invite Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Send via Email</label>
                        <form onSubmit={handleSendInvite} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="borrower@example.com"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                disabled={isSending}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Invite
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
