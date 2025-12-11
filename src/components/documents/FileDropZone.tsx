'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface FileDropZoneProps {
    onFilesSelected: (files: File[]) => void;
    isProcessing?: boolean;
    isUploading?: boolean; // Alias for isProcessing
    accept?: Record<string, string[]>; // File type filters
}

export function FileDropZone({ onFilesSelected, isProcessing = false, isUploading = false, accept }: FileDropZoneProps) {
    const processing = isProcessing || isUploading;
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
        }
    };

    return (
        <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging
                ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileInput}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`h-16 w-16 rounded-full bg-surface-highlight/30 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                    <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                        Drag & Drop files here
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                        or click to browse from your computer
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                >
                    Browse Files
                </Button>

                <p className="text-xs text-slate-500 mt-4">
                    Supports PDF, JPG, PNG (Max 10MB)
                </p>
            </div>
        </div>
    );
}
