'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useDocuments } from '@/context/DocumentContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDropZone } from '@/components/documents/FileDropZone';

export default function UnderwritingPendingPage() {
    const {
        applicationStatus,
        documents,
        conditions,
        satisfyCondition,
        reSubmitApplication
    } = useDocuments();

    const router = useRouter();
    const [uploadingConditionId, setUploadingConditionId] = useState<string | null>(null);

    // Derived state
    const pendingConditions = conditions.filter(c => c.status === 'pending');
    const clearedConditions = conditions.filter(c => c.status === 'cleared');

    // Split conditions by source
    const ausConditions = conditions.filter(c => c.source === 'aus' || !c.source);
    const underwriterConditions = conditions.filter(c => c.source === 'underwriter');

    const canResubmit = pendingConditions.length === 0;

    useEffect(() => {
        // If not in underwriting, conditions_pending, or processing_aus state, redirect back to dashboard
        if (applicationStatus !== 'underwriting' &&
            applicationStatus !== 'submitted' &&
            applicationStatus !== 'conditions_pending' &&
            applicationStatus !== 'processing_aus' &&
            applicationStatus !== 'waiting_for_underwriter' &&
            applicationStatus !== 'additional_conditions_pending' &&
            applicationStatus !== 'senior_underwriting' &&
            applicationStatus !== 'clear_to_close') {
            router.push('/borrower/dashboard');
        }
    }, [applicationStatus, router]);

    const handleConditionUpload = async (conditionId: string, files: File[]) => {
        if (files.length === 0) return;

        setUploadingConditionId(conditionId);
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, we would upload to storage here
            // For now, we just pass the file object to the context
            satisfyCondition(conditionId, files[0]);
        } catch (error) {
            console.error("Error uploading condition file:", error);
        } finally {
            setUploadingConditionId(null);
        }
    };

    if (applicationStatus === 'processing_aus') {
        return (
            <main className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center h-[60vh] space-y-8">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analyzing Application</h2>
                        <p className="text-slate-600 dark:text-slate-400">Our AI underwriter is reviewing your documents...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (applicationStatus === 'underwriting' || applicationStatus === 'senior_underwriting' || applicationStatus === 'waiting_for_underwriter') {
        return (
            <main className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center h-[60vh] space-y-8">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {applicationStatus === 'senior_underwriting' ? 'Senior Underwriter Review' :
                                applicationStatus === 'waiting_for_underwriter' ? 'Underwriter Reviewing Updates' :
                                    'Underwriter Review'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {applicationStatus === 'senior_underwriting'
                                ? 'Final review of your cleared conditions...'
                                : applicationStatus === 'waiting_for_underwriter'
                                    ? 'An underwriter is reviewing your submitted documents...'
                                    : 'An underwriter is reviewing your file...'}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (applicationStatus === 'clear_to_close') {
        return (
            <main className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center h-[60vh] space-y-8">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Clear to Close!</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Congratulations! Your loan has been fully approved.</p>
                        <button
                            onClick={() => router.push('/borrower/dashboard')}
                            className="mt-8 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Navbar />

                <div className="mt-8 space-y-8">
                    {/* Header Section */}
                    <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">
                        {applicationStatus === 'conditions_pending' || applicationStatus === 'additional_conditions_pending' ? 'Action Required' : 'Application Under Review'}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {applicationStatus === 'conditions_pending' || applicationStatus === 'additional_conditions_pending'
                            ? 'We need a few more things to complete your review. Please address the conditions below.'
                            : 'Your application is currently being reviewed by our underwriting team.'}
                    </p>
                </div>

                {/* Conditions Section */}
                {
                    conditions.length > 0 && (
                        <div className="space-y-8">
                            {/* New Requirements (Underwriter) */}
                            {underwriterConditions.length > 0 && (
                                <Card variant="glass" className="border-l-4 border-l-amber-500">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-amber-400">
                                            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            New Requirements from Underwriter
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {underwriterConditions.map(condition => (
                                            <div key={condition.id} className={`rounded-lg p-6 border ${condition.status === 'cleared' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className={`text-lg font-semibold ${condition.status === 'cleared' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>{condition.title}</h3>
                                                        <p className={`${condition.status === 'cleared' ? 'text-green-600/80 dark:text-green-300/80' : 'text-slate-600 dark:text-slate-400'} mt-1`}>{condition.description}</p>
                                                    </div>
                                                    {condition.status === 'pending' ? (
                                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                                                            Action Required
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Satisfied
                                                        </span>
                                                    )}
                                                </div>

                                                {condition.status === 'pending' ? (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-slate-300 mb-2">Upload Document to Satisfy Condition:</p>
                                                        <FileDropZone
                                                            onFilesSelected={(files) => handleConditionUpload(condition.id, files)}
                                                            isUploading={uploadingConditionId === condition.id}
                                                            accept={{
                                                                'application/pdf': ['.pdf'],
                                                                'image/jpeg': ['.jpg', '.jpeg'],
                                                                'image/png': ['.png']
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    condition.file && (
                                                        <div className="text-sm text-slate-400 bg-black/20 px-3 py-1 rounded inline-block">
                                                            📎 {condition.file.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Previously Satisfied (AUS) */}
                            {ausConditions.length > 0 && (
                                <Card variant="glass" className="border-white/10 opacity-90">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-slate-300">
                                            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Initial AUS Findings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {ausConditions.map(condition => (
                                            <div key={condition.id} className={`rounded-lg p-6 border ${condition.status === 'cleared' ? 'bg-green-500/5 border-green-500/10' : 'bg-white/5 border-white/10'}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className={`text-lg font-semibold ${condition.status === 'cleared' ? 'text-green-600/80 dark:text-green-400/80' : 'text-slate-900 dark:text-white'}`}>{condition.title}</h3>
                                                        <p className="text-slate-600 dark:text-slate-400 mt-1">{condition.description}</p>
                                                    </div>
                                                    {condition.status === 'pending' && (
                                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                                                            Action Required
                                                        </span>
                                                    )}
                                                    {condition.status === 'cleared' && (
                                                        <span className="px-3 py-1 bg-green-500/10 text-green-400/80 text-sm rounded-full flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Satisfied
                                                        </span>
                                                    )}
                                                </div>

                                                {condition.status === 'pending' ? (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-slate-300 mb-2">Upload Document to Satisfy Condition:</p>
                                                        <FileDropZone
                                                            onFilesSelected={(files) => handleConditionUpload(condition.id, files)}
                                                            isUploading={uploadingConditionId === condition.id}
                                                            accept={{
                                                                'application/pdf': ['.pdf'],
                                                                'image/jpeg': ['.jpg', '.jpeg'],
                                                                'image/png': ['.png']
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    condition.file && (
                                                        <div className="text-sm text-slate-400 bg-black/20 px-3 py-1 rounded inline-block">
                                                            📎 {condition.file.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )
                }

                {/* Re-Submit Action */}
                {
                    (applicationStatus === 'conditions_pending' || applicationStatus === 'additional_conditions_pending') && (
                        <div className="flex justify-end">
                            <button
                                onClick={reSubmitApplication}
                                disabled={!canResubmit}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${canResubmit
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {canResubmit ? 'Submit Updates for Review' : `Resolve ${pendingConditions.length} Conditions to Submit`}
                            </button>
                        </div>
                    )
                }

                {/* Submitted Documents (Read Only) */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="text-white">Submitted Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documents.filter(d => d.status === 'uploaded' || d.status === 'verified').map(doc => (
                                <div key={doc.id} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="bg-primary-500/20 p-2 rounded-lg mr-3">
                                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {doc.files.length} file(s) • {doc.status === 'verified' ? 'Verified' : 'Under Review'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div >
        </main >
    );
}

