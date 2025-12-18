'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { getLoanById } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { determineRequiredDocuments } from '@/lib/document-requirements';
import { LoanApplication } from '@/types/shared';
import { useToast } from '@/context/ToastContext';

interface PageProps {
    params: {
        id: string;
    }
}

export default function BrokerDocumentParamsPage({ params }: PageProps) {
    const { setToast } = useToast();
    const loanId = params.id;

    const { data: loan, isLoading } = useQuery({
        queryKey: ['loan', loanId],
        queryFn: () => getLoanById(loanId),
    });

    const [customConditions, setCustomConditions] = useState<{ id: string, name: string, status: 'pending' | 'satisfied' }[]>([]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!loan) {
        return <div className="min-h-screen flex items-center justify-center">Loan not found</div>;
    }

    // 1. Determine Requirements based on Loan Data
    const requirements = determineRequiredDocuments(loan);

    // 2. Map Uploaded Docs to Requirements
    const docStatusMap = new Map<string, any[]>();
    const documents = loan.documents || [];

    documents.forEach(doc => {
        const existing = docStatusMap.get(doc.type) || [];
        existing.push(doc);
        docStatusMap.set(doc.type, existing);
    });

    const categories = [
        { id: 'income', title: 'Income Verification', types: ['PAY_STUB', 'W2', 'TAX_RETURN'] },
        { id: 'assets', title: 'Asset Verification', types: ['BANK_STATEMENT'] },
        { id: 'id', title: 'Identification', types: ['ID'] },
        { id: 'property', title: 'Property Documents', types: ['APPRAISAL', 'PURCHASE_AGREEMENT'] },
        { id: 'other', title: 'Other', types: ['OTHER'] },
    ];

    const getStatusColor = (reqType: string) => {
        const files = docStatusMap.get(reqType);
        if (files && files.length > 0) return 'text-green-500 bg-green-500/10 border-green-500/20';
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    };

    const handleAddCondition = () => {
        const name = prompt("Enter new condition/document name:");
        if (name) {
            setCustomConditions([...customConditions, { id: Math.random().toString(), name, status: 'pending' }]);
            setToast({ message: "Condition added", type: 'success' });
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />
            <div className="pt-20 px-8 pb-12">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <Button
                            variant="ghost"
                            className="mb-2 pl-0 hover:bg-transparent text-slate-500"
                            onClick={() => window.history.back()}
                        >
                            ← Back to Loan
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Document Manager</h1>
                        <p className="text-slate-500">
                            Application for {loan.borrower.firstName} {loan.borrower.lastName} • {loan.id}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleAddCondition}>
                            + Add Condition
                        </Button>
                        <Button>
                            Request Missing Docs
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Requirements List */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Dynamic Requirements */}
                        {requirements.map((req) => {
                            const uploadedFiles = docStatusMap.get(req.type) || [];
                            const isSatisfied = uploadedFiles.length > 0;

                            return (
                                <Card key={req.id} className={`overflow-hidden transition-all ${isSatisfied ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-yellow-500'}`}>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-4">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isSatisfied ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {isSatisfied ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{req.name}</h3>
                                                    <p className="text-sm text-slate-500">Type: {req.type}</p>

                                                    {isSatisfied ? (
                                                        <div className="mt-3 space-y-2">
                                                            {uploadedFiles.map(file => (
                                                                <div key={file.id} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                    <a href="#" className="font-medium text-blue-600 hover:underline truncate max-w-[200px]">{file.fileName}</a>
                                                                    <span className="text-slate-400">({(file.fileSize / 1024).toFixed(0)} KB)</span>
                                                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                                        Verified
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded inline-block">
                                                            Pending Borrower Upload
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}

                        {/* Additional Conditions */}
                        {customConditions.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-4">Additional Conditions</h2>
                                {customConditions.map((cond) => (
                                    <Card key={cond.id} className="mb-4 bg-purple-50 dark:bg-slate-800/50 border-purple-100">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{cond.name}</h3>
                                                    <p className="text-xs text-purple-600">Manual Condition</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-white rounded border border-purple-100 text-purple-600">
                                                Requested
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Stats */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Document Health</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Completeness</span>
                                            <span className="font-medium">
                                                {Math.round((Array.from(docStatusMap.keys()).length / Math.max(requirements.length, 1)) * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(Array.from(docStatusMap.keys()).length / Math.max(requirements.length, 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm text-slate-500">Documents Verified</div>
                                        <div className="text-2xl font-bold">{documents.filter(d => d.verificationStatus === 'Verified').length}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-sm text-slate-500">Pending Review</div>
                                        <div className="text-2xl font-bold">{documents.filter(d => d.verificationStatus === 'Pending').length}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
