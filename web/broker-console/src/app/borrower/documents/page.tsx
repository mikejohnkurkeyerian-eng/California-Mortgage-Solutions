'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { classifyDocument } from '@/lib/document-ai';
import { Toast } from '@/components/ui/Toast';
import { useDocuments } from '@/context/DocumentContext';
import { FileDropZone } from '@/components/documents/FileDropZone';

export default function DocumentsPage() {
    const { documents, addDocumentFile, addRequirement, submitApplication } = useDocuments();
    const router = useRouter();

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const activeUploadId = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter documents
    const submittedDocs = documents.filter(doc => doc.status === 'uploaded' || doc.status === 'verified');
    const pendingDocs = documents.filter(doc => doc.status !== 'uploaded' && doc.status !== 'verified');

    const handleFilesSelected = async (files: File[]) => {
        setIsProcessing(true);
        setToast({ message: `Scanning ${files.length} documents...`, type: 'info' });

        let processedCount = 0;
        const unclassifiedFiles: string[] = [];

        for (const file of files) {
            try {
                const result = await classifyDocument(file);

                if (result.insights && result.insights.length > 0) {
                    // Process triggered requirements from insights
                    result.insights.forEach(insight => {
                        if (insight.triggeredRequirements) {
                            insight.triggeredRequirements.forEach(req => {
                                addRequirement(req.type, req.name);
                            });
                        }
                    });
                }

                // Find matching requirement
                const match = documents.find(req => req.type === result.type);

                if (match) {
                    const insightMessages = result.insights ? result.insights.map(i => i.message) : [];
                    addDocumentFile(match.id, file, insightMessages, result.extractedData, result.extractedText);
                    processedCount++;
                } else {
                    unclassifiedFiles.push(file.name);
                    if (result.failureReason) {
                        setToast({
                            message: `Could not identify ${file.name}: ${result.failureReason}`,
                            type: 'error'
                        });
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }
            } catch (error) {
                console.error("Error classifying file:", error);
                unclassifiedFiles.push(file.name);
            }
        }

        setIsProcessing(false);

        if (processedCount > 0) {
            setToast({
                message: `Successfully processed ${processedCount} documents!`,
                type: 'success'
            });
        } else if (unclassifiedFiles.length > 0) {
            setToast({
                message: `Could not identify uploaded files. Please try uploading manually to a specific category.`,
                type: 'warning'
            });
        }
    };

    const handleManualUploadClick = (docId: string) => {
        activeUploadId.current = docId;
        fileInputRef.current?.click();
    };

    const handleManualFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeUploadId.current) return;

        const targetDocId = activeUploadId.current;
        const targetDoc = documents.find(d => d.id === targetDocId);

        if (!targetDoc) return;

        setIsProcessing(true);
        setToast({ message: "Uploading...", type: 'info' });

        try {
            // Direct upload to the target ID, skipping classification check for manual override
            addDocumentFile(targetDocId, file, [], undefined);
            setToast({ message: "Document uploaded successfully!", type: 'success' });
        } catch (error) {
            console.error(error);
            setToast({ message: "Error processing document.", type: 'error' });
        } finally {
            setIsProcessing(false);
            activeUploadId.current = null;
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        try {
            await submitApplication();
            router.push('/borrower/underwriting');
        } catch (error) {
            console.error("Submission failed:", error);
            setToast({ message: "Failed to submit application. Please try again.", type: 'error' });
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Hidden input for manual uploads */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleManualFileChange}
            />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div>
                        <Button
                            variant="ghost"
                            className="mb-4 pl-0 hover:bg-transparent hover:text-white text-slate-400"
                            onClick={() => router.push('/borrower/dashboard')}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">Document Center</h1>
                        <p className="text-slate-600 dark:text-slate-400">Manage your loan documents. Drag and drop files to automatically sort them, or upload individually.</p>
                    </div>

                    {/* Drag & Drop Zone */}
                    <Card variant="glass" className="border-dashed border-2 border-primary-500/30 bg-primary-500/5">
                        <CardContent className="p-8">
                            <FileDropZone onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
                        </CardContent>
                    </Card>

                    {/* Pending Documents Section */}
                    {pendingDocs.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <span className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                Pending Requirements ({pendingDocs.length})
                            </h2>
                            <div className="grid gap-4">
                                {pendingDocs.map((doc) => (
                                    <Card key={doc.id} variant="glass" className="transition-all hover:bg-surface/60 border-l-4 border-l-yellow-500/50">
                                        <CardContent className="flex items-center justify-between p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 rounded-lg bg-surface-highlight/30 flex items-center justify-center text-slate-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-900 dark:text-white font-medium">{doc.name}</h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {doc.required && (
                                                            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                                                                Required
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">Waiting for upload</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleManualUploadClick(doc.id)}
                                                disabled={isProcessing}
                                            >
                                                Upload
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submitted Documents Section */}
                    {submittedDocs.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <span className="bg-green-500/10 text-green-500 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                Submitted Documents ({submittedDocs.length})
                            </h2>
                            <div className="grid gap-4">
                                {submittedDocs.map((doc) => (
                                    <Card key={doc.id} variant="glass" className="transition-all hover:bg-surface/60 border-l-4 border-l-green-500/50 opacity-90">
                                        <CardContent className="flex items-center justify-between p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-900 dark:text-white font-medium">{doc.name}</h3>
                                                    <div className="flex flex-col space-y-1 mt-1">
                                                        {doc.files && doc.files.length > 0 ? (
                                                            doc.files.map((file, index) => (
                                                                <div key={index} className="flex items-center space-x-2">
                                                                    <span className="text-xs text-green-400">
                                                                        {doc.status === 'verified' ? 'Verified' : 'Uploaded'}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400">• {file.name}</span>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-500">({file.date})</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">Waiting for upload</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                                    onClick={() => handleManualUploadClick(doc.id)}
                                                >
                                                    Replace
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Section */}
                    <div className="flex justify-end pt-8 border-t border-white/10">
                        <div className="flex items-center space-x-4">
                            {pendingDocs.length > 0 && (
                                <p className="text-amber-400 text-sm">
                                    Please upload all required documents before submitting.
                                </p>
                            )}
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={isProcessing || pendingDocs.some(d => d.required)}
                                className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-primary-500/25"
                            >
                                {isProcessing ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </div>

                    {documents.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-slate-400">No documents required at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

