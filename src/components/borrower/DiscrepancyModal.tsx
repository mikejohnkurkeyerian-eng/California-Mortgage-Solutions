import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Discrepancy } from '@/lib/verification-service';

interface DiscrepancyModalProps {
    isOpen: boolean;
    onClose: () => void;
    discrepancies: Discrepancy[];
    onFix: (discrepancy: Discrepancy) => void;
    onIgnore: (discrepancy: Discrepancy) => void;
}

export function DiscrepancyModal({ isOpen, onClose, discrepancies, onFix, onIgnore }: DiscrepancyModalProps) {
    if (!isOpen || discrepancies.length === 0) return null;

    // Show one discrepancy at a time or list them? 
    // Let's show the first one for focused decision making.
    const currentDiscrepancy = discrepancies[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-lg shadow-2xl animate-scale-in border-amber-500/50">
                <CardHeader className="bg-amber-500/10 border-b border-amber-500/20">
                    <CardTitle className="flex items-center text-amber-600 dark:text-amber-400">
                        <span className="text-2xl mr-2">⚠️</span>
                        Data Discrepancy Detected
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <p className="text-slate-600 dark:text-slate-300">
                        Our AI found a mismatch between your application and the uploaded document.
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                            {currentDiscrepancy.fieldLabel}
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-xs text-slate-500 uppercase font-semibold">In Application</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white break-words">
                                    {typeof currentDiscrepancy.applicationValue === 'number'
                                        ? currentDiscrepancy.applicationValue.toLocaleString()
                                        : currentDiscrepancy.applicationValue || '(Empty)'}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-xs text-primary-500 uppercase font-semibold">In Document</div>
                                <div className="text-lg font-bold text-primary-600 dark:text-primary-400 break-words">
                                    {typeof currentDiscrepancy.documentValue === 'number'
                                        ? currentDiscrepancy.documentValue.toLocaleString()
                                        : currentDiscrepancy.documentValue}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-sm text-amber-800 dark:text-amber-200">
                        {currentDiscrepancy.message}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onIgnore(currentDiscrepancy)}
                        >
                            Keep My Value
                        </Button>
                        <Button
                            className="flex-1 bg-primary-600 hover:bg-primary-500"
                            onClick={() => onFix(currentDiscrepancy)}
                        >
                            Review & Fix
                        </Button>
                    </div>

                    {discrepancies.length > 1 && (
                        <div className="text-center text-xs text-slate-400">
                            {discrepancies.length - 1} more discrepancy found
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
