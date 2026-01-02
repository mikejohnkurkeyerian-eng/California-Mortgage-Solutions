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
import { useBrokerSettings } from '@/context/BrokerContext';
import { useUpdateLoan } from '@/hooks/useBroker';
import { classifyDocument } from '@/lib/document-ai';
import { DocumentViewerModal } from '@/components/documents/DocumentViewerModal';

interface PageProps {
    params: {
        id: string;
    }
}

export default function BrokerDocumentParamsPage({ params }: PageProps) {
    const { setToast } = useToast();
    const { settings } = useBrokerSettings();
    const updateLoan = useUpdateLoan();
    const loanId = params.id;

    const { data: loan, isLoading } = useQuery({
        queryKey: ['loan', loanId],
        queryFn: () => getLoanById(loanId),
    });

    // The local state `customConditions` is no longer directly used for rendering or updates
    // as we now rely on `loan.customConditions` from the query data, which is persisted.
    // Keeping it here for now as it was in the original code, but it's effectively shadowed.
    const [customConditions, setCustomConditions] = useState<{ id: string, name: string, status: 'pending' | 'satisfied' }[]>([]);

    // Validation State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [validationModal, setValidationModal] = useState<{
        isOpen: boolean;
        file?: File;
        forcedType?: string;
        detectedType?: string;
        warning?: string;
        confidence?: number;
    }>({ isOpen: false });

    // Viewer State
    const [viewingDoc, setViewingDoc] = useState<{ doc: any, blob?: Blob } | null>(null);
    const [localFileBlobs, setLocalFileBlobs] = useState<Record<string, Blob>>({});

    // Helper to render view button
    const renderViewButton = (doc: any) => (
        <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-slate-600 border-slate-200 hover:border-primary-500 hover:text-primary-600 hover:bg-white dark:border-slate-700 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800"
            onClick={() => setViewingDoc({ doc, blob: localFileBlobs[doc.id] })}
            title="View Document"
        >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span className="text-xs font-medium">View</span>
        </Button>
    );

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

    // 3. Group Requirements by Category
    const CATEGORIES = [
        { id: 'INCOME', title: 'Income & Employment', types: ['PAY_STUB', 'W2', 'TAX_RETURN', 'VOE', 'OFFER_LETTER', 'BUSINESS_LICENSE', 'PROFIT_AND_LOSS', 'BALANCE_SHEET', 'BUSINESS_TAX_RETURN', 'K1', 'PENSION_STATEMENT', 'FORM_1099', 'SOCIAL_SECURITY_AWARD', 'DIVORCE_DECREE', 'LES', 'RENT_ROLL'] },
        { id: 'ASSET', title: 'Assets & Funds', types: ['BANK_STATEMENT', 'ASSET_STATEMENT', 'VOD', 'GIFT_LETTER', 'CLOSING_DISCLOSURE', 'CRYPTO_STATEMENT', 'TRUST_AGREEMENT', 'STOCK_OPTION_AGREEMENT', 'EARNEST_MONEY_RECEIPT'] },
        { id: 'PROPERTY', title: 'Collateral & Property', types: ['PURCHASE_CONTRACT', 'HOME_INSURANCE_QUOTE', 'PAYOFF_STATEMENT', 'NOTE', 'INSURANCE_DECLARATION', 'LOAN_ESTIMATE', 'BUILDER_CONTRACT', 'CONDO_QUESTIONNAIRE', 'HO6_INSURANCE', 'MORTGAGE_STATEMENT', 'PROPERTY_TAX_BILL', 'SALES_CONTRACT', 'LEASE_AGREEMENT'] },
        { id: 'LEGAL', title: 'Legal & Declarations', types: ['ID', 'GREEN_CARD', 'VISA', 'I94', 'ITIN_LETTER', 'BANKRUPTCY_DISCHARGE', 'LETTER_OF_EXPLANATION', 'JUDGMENT_EXPLANATION', 'SEPARATION_AGREEMENT', 'CHILD_SUPPORT_ORDER', 'DD214', 'VA_COE'] },
        { id: 'DISCLOSURE', title: 'Disclosures', types: ['BORROWER_AUTH', 'INTENT_TO_PROCEED', 'ESIGN_CONSENT', 'ANTI_STEERING', 'FHA_AMENDATORY', 'VA_ANALYSIS', 'USDA_INCOME_WORKSHEET'] }
    ];

    // Helper to find category for a requirement type
    const getCategoryForType = (type: string) => {
        for (const cat of CATEGORIES) {
            if (cat.types.includes(type)) return cat;
        }
        return { id: 'OTHER', title: 'Other Requirements', types: [] };
    };

    // Grouping
    const groupedReqs: Record<string, typeof requirements> = {};
    const otherReqs: typeof requirements = [];
    // Prefer loan.customConditions if available (from DB persistence update), fallback to local state for now if needed,
    // but ideally we rely on DB prop. Actually, let's sync local state or just use loan prop?
    // loan.customConditions is what we want. The local state was a temporary scaffold I replaced but it seems I left it in line 28.
    const effectiveCustomConditions = loan.customConditions || customConditions;

    requirements.forEach(req => {
        const cat = getCategoryForType(req.type);
        if (cat.id === 'OTHER') {
            otherReqs.push(req);
        } else {
            if (!groupedReqs[cat.id]) groupedReqs[cat.id] = [];
            groupedReqs[cat.id].push(req);
        }
    });

    const handleAddCondition = async () => {
        const name = prompt("Enter new condition/document name:");
        if (name) {
            const newCondition = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                status: 'pending' as const,
                requestedAt: new Date().toISOString()
            };

            // Optimistic update locally
            const updatedConditions = [...(loan.customConditions || []), newCondition];

            // Persist to DB
            updateLoan.mutate({
                id: loan.id,
                data: { ...loan, customConditions: updatedConditions }
            }, {
                onSuccess: () => {
                    setToast({ message: "Condition added", type: 'success' });
                },
                onError: () => {
                    setToast({ message: "Failed to save condition", type: "error" });
                }
            });
        }
    };

    const handleRemoveCondition = async (id: string) => {
        if (!confirm("Remove this condition?")) return;

        const updatedConditions = (loan.customConditions || []).filter(c => c.id !== id);
        updateLoan.mutate({
            id: loan.id,
            data: { ...loan, customConditions: updatedConditions }
        });
    };



    // ... update processUpload



    const handleRequestMissing = async () => {
        if (!settings.emailSettings) {
            setToast({ message: "Please configure email settings first", type: 'error' });
            return;
        }

        const missing = requirements.filter(req => {
            const uploaded = docStatusMap.get(req.type) || [];
            return uploaded.length === 0;
        });

        if (missing.length === 0 && effectiveCustomConditions.every(c => c.status === 'satisfied')) {
            setToast({ message: "No missing documents!", type: 'success' });
            return;
        }

        const emailBody = `
            <h2>Missing Document Request</h2>
            <p>Dear ${loan.borrower?.firstName || 'Borrower'},</p>
            <p>We are processing your loan application and need the following documents to proceed:</p>
            <ul>
                ${missing.map(r => `<li><b>${r.name}</b>: ${r.insights?.[0] || ''}</li>`).join('')}
                ${effectiveCustomConditions.filter(c => c.status !== 'satisfied').map(c => `<li><b>${c.name}</b> (Additional Request)</li>`).join('')}
            </ul>
            <p>Please upload these to your portal as soon as possible.</p>
            <p>Thank you,<br/>Broker Team</p>
        `;

        try {
            setToast({ message: "Sending request...", type: "info" });
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: loan.borrower?.email || '',
                    subject: `Action Required: Missing Documents for Loan ${loan.id?.split('-')[0]}`,
                    html: emailBody,
                    settings: settings.emailSettings
                })
            });

            if (res.ok) {
                setToast({ message: "Request sent successfully!", type: 'success' });
            } else {
                setToast({ message: "Failed to send email", type: 'error' });
            }
        } catch (e) {
            setToast({ message: "Error sending email", type: 'error' });
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />
            <div className="pt-24 px-4 sm:px-8 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                                onClick={() => window.history.back()}
                            >
                                ← Back to Application
                            </Button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-500 text-sm">Documents</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Document Manager</h1>
                        <p className="text-slate-500 mt-1">
                            {loan.borrower?.firstName || 'Unknown'} {loan.borrower?.lastName || 'Borrower'} • <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{loan.id?.split('-')[0] || '...'}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleAddCondition} className="border-dashed border-slate-300 dark:border-slate-700">
                            + Add Condition
                        </Button>
                        <Button onClick={handleRequestMissing} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                            Request Missing
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content: Requirements List */}
                    <div className="xl:col-span-3 space-y-10">

                        {/* Drop Zone */}
                        <section className="mb-8">
                            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Upload Documents</h3>
                                    <p className="text-slate-500 max-w-md mb-6">Drag and drop files here to automatically categorize them, or browse to upload specific documents.</p>
                                    <input
                                        type="file"
                                        id="general-upload"
                                        className="hidden"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) handleFileUpload(Array.from(e.target.files));
                                        }}
                                    />
                                    <Button onClick={() => document.getElementById('general-upload')?.click()}>
                                        Browse Files
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>

                        {CATEGORIES.map(cat => {
                            const reqs = groupedReqs[cat.id];
                            if (!reqs || reqs.length === 0) return null;

                            return (
                                <section key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-8 w-1 bg-primary-500 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{cat.title}</h2>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                                            {reqs.length}
                                        </span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                            {reqs.map(req => {
                                                const uploadedFiles = docStatusMap.get(req.type) || [];
                                                const isSatisfied = uploadedFiles.length > 0;

                                                return (
                                                    <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-colors">
                                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSatisfied ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></div>
                                                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{req.name}</h3>
                                                                    {req.required && <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Required</span>}
                                                                </div>
                                                                {req.insights && req.insights.length > 0 && (
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 ml-5">{req.insights[0]}</p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center sm:justify-end min-w-[200px]">
                                                                {isSatisfied ? (
                                                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                                        {uploadedFiles.map(file => (
                                                                            <div key={file.id} className="group flex items-center justify-between gap-3 text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-800 transition-colors">
                                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                                    <span className="truncate max-w-[140px] text-slate-700 dark:text-slate-300 font-medium" title={file.fileName}>{file.fileName}</span>
                                                                                    {renderViewButton(file)}
                                                                                </div>
                                                                                <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded font-medium">Verified</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-amber-600 dark:text-amber-500 text-sm italic mr-2">Missing</span>
                                                                        <input
                                                                            type="file"
                                                                            id={`upload-${req.id}`}
                                                                            className="hidden"
                                                                            onChange={(e) => {
                                                                                if (e.target.files?.[0]) handleFileUpload([e.target.files[0]], req.type);
                                                                            }}
                                                                        />
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => document.getElementById(`upload-${req.id}`)?.click()}
                                                                        >
                                                                            Upload
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            );
                        })}

                        {/* Other Requirements Section */}
                        {otherReqs.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-8 w-1 bg-slate-300 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Other Requirements</h2>
                                </div>
                                <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {otherReqs.map(req => {
                                            const uploadedFiles = docStatusMap.get(req.type) || [];
                                            const isSatisfied = uploadedFiles.length > 0;
                                            return (
                                                <div key={req.id} className="p-4 sm:p-5">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-medium">{req.name}</h3>
                                                        {isSatisfied ? <span className="text-green-500 text-sm">Satisfied</span> : (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="file"
                                                                    id={`upload-${req.id}`}
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        if (e.target.files?.[0]) handleFileUpload([e.target.files[0]], req.type);
                                                                    }}
                                                                />
                                                                <Button size="sm" variant="outline" onClick={() => document.getElementById(`upload-${req.id}`)?.click()}>
                                                                    Upload
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}


                        {/* Additional Conditions Section */}
                        {effectiveCustomConditions.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Underwriting Conditions</h2>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                                        {effectiveCustomConditions.length}
                                    </span>
                                </div>
                                <div className="bg-purple-50/50 dark:bg-purple-900/5 rounded-xl border border-purple-100 dark:border-purple-500/20 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-purple-100/50 dark:divide-purple-500/10">
                                        {effectiveCustomConditions.map((cond) => {
                                            const uploadedFiles = docStatusMap.get('Other') || [];
                                            // TODO: Match condition ID if we stored it in metadata. For now check if satisfied.
                                            const isSatisfied = cond.status === 'satisfied';

                                            return (
                                                <div key={cond.id} className="p-4 sm:p-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white dark:bg-purple-900/30 p-2 rounded-lg shadow-sm border border-purple-100 dark:border-purple-500/20">
                                                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 dark:text-white">{cond.name}</h3>
                                                            <p className="text-xs text-purple-600 dark:text-purple-400">Manual Condition Added by Broker</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!isSatisfied && (
                                                            <Button variant="outline" size="sm" onClick={() => {
                                                                const updatedConditions = (loan.customConditions || []).map(c =>
                                                                    c.id === cond.id ? { ...c, status: 'satisfied' as const } : c
                                                                );
                                                                updateLoan.mutate({
                                                                    id: loan.id,
                                                                    data: { ...loan, customConditions: updatedConditions }
                                                                });
                                                            }}>
                                                                Mark Satisfied
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" onClick={() => handleRemoveCondition(cond.id)}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Additional/Unsolicited Documents Section */}
                        {(() => {
                            // Calculate displayed IDs to find hidden ones
                            const displayedDocIds = new Set<string>();
                            requirements.forEach(req => {
                                const docs = docStatusMap.get(req.type) || [];
                                docs.forEach(d => displayedDocIds.add(d.id));
                            });
                            // Include 'Other' docs as they might be used in custom conditions (or just general other)
                            // Note: Effectively we just want to show anything that wasn't shown in the Requirements lists.
                            // The Requirements lists loops over CATEGORIES (standard types) and otherReqs (OTHER type).
                            // So actually, if we iterate CATEGORIES and otherReqs, we cover all 'req.type's.
                            // Let's just track what we rendered.

                            // 1. Standard Categories
                            CATEGORIES.forEach(cat => {
                                const reqs = groupedReqs[cat.id] || [];
                                reqs.forEach(req => {
                                    const docs = docStatusMap.get(req.type) || [];
                                    docs.forEach(d => displayedDocIds.add(d.id));
                                });
                            });

                            // 2. Other Requirements
                            otherReqs.forEach(req => {
                                const docs = docStatusMap.get(req.type) || [];
                                docs.forEach(d => displayedDocIds.add(d.id));
                            });

                            // 3. Custom Conditions (which often use 'Other' or specific types)
                            // Logic in UI above:
                            /*
                               effectiveCustomConditions.map((cond) => {
                                   const uploadedFiles = docStatusMap.get('Other') || [];
                            */
                            // The current UI hardcodes getting 'Other' for custom conditions. 
                            // So we should mark 'Other' docs as displayed if there are custom conditions.
                            if (effectiveCustomConditions.length > 0) {
                                const otherDocs = docStatusMap.get('Other') || [];
                                otherDocs.forEach(d => displayedDocIds.add(d.id));
                            }

                            const hiddenDocuments = documents.filter(d => !displayedDocIds.has(d.id));

                            if (hiddenDocuments.length === 0) return null;

                            return (
                                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-8 w-1 bg-slate-400 rounded-full"></div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Additional Documents</h2>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                                            {hiddenDocuments.length}
                                        </span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                            {hiddenDocuments.map((doc) => (
                                                <div key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                                                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 00-2-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-semibold text-slate-900 dark:text-white truncate" title={doc.fileName}>{doc.fileName}</h3>
                                                                <p className="text-xs text-slate-500">
                                                                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.type.replace(/_/g, ' ')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded font-medium">
                                                                Received
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );
                        })()}
                    </div>

                    {/* Right Column: Sticky Stats */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                                <CardContent className="p-6 relative z-10">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Document Health
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2 text-slate-300">
                                                <span>Completion</span>
                                                <span className="font-bold text-white">
                                                    {Math.round((Array.from(docStatusMap.keys()).length / Math.max(requirements.length, 1)) * 100)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(Array.from(docStatusMap.keys()).length / Math.max(requirements.length, 1)) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5">
                                                <div className="text-2xl font-bold text-white mb-1">{documents.filter(d => d.verificationStatus === 'Verified').length}</div>
                                                <div className="text-xs text-slate-300 font-medium">Verified</div>
                                            </div>
                                            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5">
                                                <div className="text-2xl font-bold text-white mb-1">{documents.filter(d => d.verificationStatus === 'Pending').length}</div>
                                                <div className="text-xs text-slate-300 font-medium">Pending</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                <h4 className="font-semibold mb-3 text-sm text-slate-500 uppercase tracking-wider">Quick Actions</h4>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="font-medium text-slate-900 dark:text-white">Regenerate Requirements</span>
                                            <span className="text-xs text-slate-500 leading-none">Refresh based on recent 1003 updates</span>
                                        </div>
                                    </Button>
                                    <Button onClick={handleRequestMissing} variant="outline" className="w-full justify-start text-left h-auto py-3">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="font-medium text-slate-900 dark:text-white">Email Reminder</span>
                                            <span className="text-xs text-slate-500 leading-none">Send nudges for missing docs</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Modal */}
            {
                validationModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>

                                <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                                    Potential Issue Detected
                                </h3>

                                <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                                    {validationModal.warning}
                                </p>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">File:</span>
                                        <span className="font-medium truncate max-w-[200px]">{validationModal.file?.name}</span>
                                    </div>
                                    {validationModal.detectedType && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Detected:</span>
                                            <span className="font-medium text-primary-600">{validationModal.detectedType}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={cancelValidation}
                                        className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmValidation}
                                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-none"
                                    >
                                        Proceed Anyway
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <DocumentViewerModal
                isOpen={!!viewingDoc}
                onClose={() => setViewingDoc(null)}
                document={viewingDoc?.doc || null}
                fileBlob={viewingDoc?.blob}
            />
        </main>
    );
}
