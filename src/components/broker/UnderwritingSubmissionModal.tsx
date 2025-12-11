import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useUpdateLoan } from '@/hooks/useBroker';
import { MOCK_LENDERS, Lender } from '@/lib/lenders';
import { useBrokerSettings } from '@/context/BrokerContext';
import { useIntegration } from '@/context/IntegrationContext';

interface UnderwritingSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: any;
}

type SubmissionType = 'EMAIL' | 'IN_HOUSE' | 'LENDER';

export function UnderwritingSubmissionModal({ isOpen, onClose, loan }: UnderwritingSubmissionModalProps) {
    const { settings } = useBrokerSettings();
    const { getCredential } = useIntegration();
    const [submissionType, setSubmissionType] = useState<SubmissionType | 'MANUAL'>(settings.defaultUnderwritingMode as any || 'EMAIL');
    const updateLoanMutation = useUpdateLoan();
    const [isLoading, setIsLoading] = useState(false);

    // Success State
    const [successMessage, setSuccessMessage] = useState('');
    const [submittedPortalUrl, setSubmittedPortalUrl] = useState<string | null>(null);

    // Email State
    const [emailRecipient, setEmailRecipient] = useState('');
    const [emailSubject, setEmailSubject] = useState(`Loan Application: ${loan.borrower?.lastName} - ${loan.id.slice(0, 8)}`);
    const [emailBody, setEmailBody] = useState(`Please find attached the loan application package for ${loan.borrower?.firstName} ${loan.borrower?.lastName}.\n\nLoan Amount: $${loan.property?.loanAmount?.toLocaleString()}\nProperty: ${loan.property?.address?.street}, ${loan.property?.address?.city}`);

    // Lender State
    const [selectedLenderId, setSelectedLenderId] = useState<string>('');

    // Manual/Portal State
    const [portalUrl, setPortalUrl] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (submissionType === 'EMAIL') {
                const { sendLoanPackageEmail } = await import('@/lib/actions/email');
                const result = await sendLoanPackageEmail(loan.id, {
                    recipient: emailRecipient,
                    subject: emailSubject,
                    body: emailBody
                });

                if (!result.success) throw new Error(result.error);

                setSuccessMessage('Package emailed successfully!');
            } else if (submissionType === 'IN_HOUSE') {
                // ... (existing in-house logic)
                const newSubmission = {
                    id: Date.now().toString(),
                    type: 'IN_HOUSE',
                    recipient: 'Internal Underwriting Team',
                    submittedAt: new Date().toISOString(),
                    status: 'Received'
                };
                const currentSubmissions = loan.submissions || [];
                updateLoanMutation.mutate({
                    id: loan.id,
                    data: {
                        submissions: [...currentSubmissions, newSubmission],
                        stage: 'Underwriting',
                        status: 'Underwriting'
                    }
                });
                setSuccessMessage('Case assigned to Internal Team!');
            } else if (submissionType === 'LENDER') {
                const lender = MOCK_LENDERS.find(l => l.id === selectedLenderId);
                if (!lender) throw new Error("No lender selected");

                // Get stored credentials to pass to server action (BYO Key)
                const cred = getCredential(lender.id);
                const apiCredentials = (cred && cred.isEnabled)
                    ? { clientId: cred.clientId, clientSecret: cred.clientSecret }
                    : undefined;

                // Call Server Action
                const { submitToLenderAction } = await import('@/lib/actions/lender');
                const response = await submitToLenderAction(loan.id, lender.id, lender.name, apiCredentials);

                if (!response.success) throw new Error(response.error);

                setSuccessMessage(`Successfully submitted to ${lender.name}!`);
                if (response.result?.portalUrl) {
                    setSubmittedPortalUrl(response.result.portalUrl);
                }
            } else if (submissionType === 'MANUAL') {
                // Universal Manual Submission
                const { downloadPackageAction } = await import('@/lib/actions/lender');
                const res = await downloadPackageAction(loan.id);

                if (!res.success) throw new Error(res.error);

                // Trigger Download
                const link = document.createElement('a');
                link.href = `data:application/zip;base64,${res.data}`;
                link.download = res.filename || 'submission_package.zip';
                document.body.appendChild(link); // Required for Firefox
                link.click();
                document.body.removeChild(link);

                if (portalUrl) {
                    // Update submission record
                    const newSubmission = {
                        id: Date.now().toString(),
                        type: 'MANUAL',
                        recipient: 'Manual Portal',
                        submittedAt: new Date().toISOString(),
                        status: 'Submitted',
                        externalReferenceId: portalUrl
                    };
                    const currentSubmissions = loan.submissions || [];
                    updateLoanMutation.mutate({
                        id: loan.id,
                        data: {
                            submissions: [...currentSubmissions, newSubmission],
                            stage: 'Underwriting',
                            status: 'Submitted to Lender'
                        }
                    });
                    setSubmittedPortalUrl(portalUrl);
                }

                setSuccessMessage('Package Downloaded & Recorded!');
            }

            setTimeout(() => {
                if (!portalUrl) { // Don't close immediately if we want to show the open portal button
                    setSuccessMessage('');
                    onClose();
                }
            }, 2000);

        } catch (error: any) {
            console.error("Submission failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit to Underwriting</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
                    <button
                        onClick={() => setSubmissionType('EMAIL')}
                        className={`flex-1 min-w-[100px] py-4 text-sm font-medium border-b-2 transition-colors ${submissionType === 'EMAIL'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        📧 Email
                    </button>
                    <button
                        onClick={() => setSubmissionType('IN_HOUSE')}
                        className={`flex-1 min-w-[100px] py-4 text-sm font-medium border-b-2 transition-colors ${submissionType === 'IN_HOUSE'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        🏢 In-House
                    </button>
                    <button
                        onClick={() => setSubmissionType('LENDER')}
                        className={`flex-1 min-w-[100px] py-4 text-sm font-medium border-b-2 transition-colors ${submissionType === 'LENDER'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        🏦 API
                    </button>
                    <button
                        onClick={() => setSubmissionType('MANUAL')}
                        className={`flex-1 min-w-[100px] py-4 text-sm font-medium border-b-2 transition-colors ${submissionType === 'MANUAL'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        🌐 Manual
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[300px]">
                    {successMessage ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{successMessage}</h3>
                            <p className="text-slate-500 mb-6">The application status has been updated.</p>

                            {submittedPortalUrl && (
                                <a
                                    href={submittedPortalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-900/20 inline-flex items-center gap-2"
                                >
                                    Open Lender Portal
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    ) : (
                        <>
                            {submissionType === 'EMAIL' && (
                                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                                        <p>This will bundle all approved documents into a secure PDF package and email a download link to the recipient.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Email</label>
                                        <Input
                                            value={emailRecipient}
                                            onChange={(e) => setEmailRecipient(e.target.value)}
                                            placeholder="underwriter@lender.com"
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
                                        <Input
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            {submissionType === 'IN_HOUSE' && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex gap-3 text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30">
                                        <p>This will assign the file to the internal underwriting queue. The team will be notified immediately.</p>
                                    </div>
                                </div>
                            )}

                            {submissionType === 'LENDER' && (
                                <div className="animate-in slide-in-from-right-4 duration-300">
                                    <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                                        Select a participating lender to submit this package directly to their portal.
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                                        {MOCK_LENDERS.map((lender) => (
                                            <div
                                                key={lender.id}
                                                onClick={() => setSelectedLenderId(lender.id)}
                                                className={`p-4 rounded-lg flex items-center justify-between border cursor-pointer transition-all ${selectedLenderId === lender.id
                                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                                                    }`}
                                            >
                                                <div className="font-bold text-slate-900 dark:text-white">{lender.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {submissionType === 'MANUAL' && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex gap-3 text-sm text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/30">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <p>Download the standardized Submission Package (MISMO 3.4 XML + PDFs) and manually upload it to any lender's portal.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lender Portal URL (Optional)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={portalUrl}
                                                onChange={(e) => setPortalUrl(e.target.value)}
                                                placeholder="https://broker.lender.com/upload"
                                                className="flex-1"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">If provided, we'll help you open this link after generating the package.</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!successMessage && (
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || (submissionType === 'EMAIL' && !emailRecipient)}
                            isLoading={isLoading}
                            className="bg-primary-600 hover:bg-primary-500 text-white min-w-[120px]"
                        >
                            {submissionType === 'EMAIL' ? 'Send Email' :
                                submissionType === 'MANUAL' ? 'Download Package' : 'Submit'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
