'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DocumentMetadata } from '@/types/shared';

interface DocumentViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: DocumentMetadata | null;
    fileBlob?: Blob | null; // For local/session preview immediately after upload
}

export function DocumentViewerModal({ isOpen, onClose, document, fileBlob }: DocumentViewerModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Reset preview URL when modal opens/closes or document changes
    useEffect(() => {
        if (!isOpen) {
            setPreviewUrl(null);
            return;
        }

        if (fileBlob) {
            // Priority 1: Use local blob if available (for immediate uploads)
            const url = URL.createObjectURL(fileBlob);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (document?.storagePath && !document.storagePath.startsWith('mock/')) {
            // Priority 2: Use real storage URL if it's not a mock path
            // In a real app, this might be a signed S3 URL
            setPreviewUrl(document.storagePath);
        } else {
            // Priority 3: Mock/Placeholder
            setPreviewUrl(null);
        }
    }, [isOpen, document, fileBlob]);

    if (!isOpen || !document) return null;

    const isImage = document.mimeType.startsWith('image/') || document.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isPdf = document.mimeType === 'application/pdf' || document.fileName.endsWith('.pdf');

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 m-4">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-md" title={document.fileName}>
                                {document.fileName}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {isImage ? 'Image' : isPdf ? 'PDF' : 'Document'} • {(document.fileSize / 1024).toFixed(0)} KB • {new Date(document.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {previewUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(previewUrl, '_blank')}
                                title="Open in new tab"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full w-8 h-8 p-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
                    {previewUrl ? (
                        <>
                            {isImage && (
                                <img
                                    src={previewUrl}
                                    alt={document.fileName}
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-md"
                                />
                            )}

                            {isPdf && (
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-full rounded-md shadow-lg bg-white"
                                    title="PDF Viewer"
                                />
                            )}

                            {!isImage && !isPdf && (
                                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md">
                                    <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Preview Not Available</h3>
                                    <p className="text-slate-500 mb-4">This file type cannot be previewed directly in the browser.</p>
                                    <Button onClick={() => {
                                        const link = window.document.createElement('a');
                                        link.href = previewUrl;
                                        link.download = document.fileName; // Force download
                                        window.document.body.appendChild(link);
                                        link.click();
                                        window.document.body.removeChild(link);
                                    }}>Download File</Button>
                                </div>
                            )}
                        </>
                    ) : (
                        // Placeholder State (Storage Not Connected)
                        <div className="text-center p-12 max-w-lg">
                            <div className="mx-auto w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Storage Not Connected</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                This document was processed in <span className="font-semibold text-amber-600 dark:text-amber-500">Demo Mode</span>. The metadata (name, size, type) was saved, but the file content was not permanently stored.
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 text-left">
                                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-1">How to fix this:</p>
                                <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                    <li>Connect a cloud storage provider (AWS S3, Google Cloud Storage).</li>
                                    <li>Update the <code>storagePath</code> in the database.</li>
                                    <li>Re-upload the document to generate a valid preview.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
