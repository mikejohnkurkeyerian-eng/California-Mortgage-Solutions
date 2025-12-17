'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useBorrowerAuth } from '@/hooks/useBorrower';
import { FileDropZone } from '@/components/documents/FileDropZone';
import { classifyDocument, type DocumentType } from '@/lib/document-ai';
import { Toast } from '@/components/ui/Toast';
import { useDocuments } from '@/context/DocumentContext';
import { AIAssistant } from '@/components/borrower/AIAssistant';
import { VerificationService, Discrepancy } from '@/lib/verification-service';
import { FormIntelligenceService } from '@/lib/form-intelligence';
import { DiscrepancyModal } from '@/components/borrower/DiscrepancyModal';
import { RedFlagModal } from '@/components/RedFlagModal';
import { Full1003Data } from '@/types/form-1003';
import { AUSResults } from '@/components/dashboard/AUSResults';
import { UnderwriterSimulator } from '@/components/debug/UnderwriterSimulator';
import { Badge } from '@/components/ui/Badge';
import { BorrowerDebugFooter } from '@/components/debug/BorrowerDebugFooter';

export default function BorrowerDashboard() {
    const { borrowerId, isLoading, logout } = useBorrowerAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRedFlagModalOpen, setIsRedFlagModalOpen] = useState(false);

    const {
        documents: requirements,
        addDocumentFile,
        addRequirement,
        applicationStatus,
        submitApplication,
        conditions,
        removeDocumentFile,
        underwritingResult,
        selectedLoan,
        analyzedData,
        syncWithBackend,
        currentLoan,

        aiAnalysisResult,
        runDualAUS,
        dualAusResult,
        resolveCondition,
        submitToUnderwriting
    } = useDocuments();

    const [isCheckingLoan, setIsCheckingLoan] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            if (!isLoading && !borrowerId) {
                router.push('/borrower/login');
                return;
            }

            if (borrowerId) {
                // Sync with backend to get latest loan data
                await syncWithBackend();
                setIsCheckingLoan(false);
            }
        };

        initDashboard();
    }, [isLoading, borrowerId, router, syncWithBackend]);

    // Redirect to apply if no loan found after check
    useEffect(() => {
        if (!isLoading && !isCheckingLoan && !currentLoan && borrowerId) {
            router.push('/borrower/apply');
        }
    }, [isLoading, isCheckingLoan, currentLoan, borrowerId, router]);

    // Only redirect to loan options if approved/pre-approved AND no loan selected yet
    useEffect(() => {
        if ((applicationStatus === 'approved' || applicationStatus === 'pre_approved') && !selectedLoan) {
            router.push('/borrower/loan-options');
        }
    }, [applicationStatus, selectedLoan, router]);

    // Red Flag Modal Trigger
    useEffect(() => {
        if (aiAnalysisResult && aiAnalysisResult.issues.length > 0) {
            const hasCritical = aiAnalysisResult.issues.some(i => i.severity === 'High' || i.severity === 'Medium');
            if (hasCritical) {
                setIsRedFlagModalOpen(true);
            }
        }
    }, [aiAnalysisResult]);

    const handleFilesSelected = async (files: File[]) => {
        setIsProcessing(true);
        setToast({ message: `Scanning ${files.length} documents... This may take a moment.`, type: 'info' });

        let processedCount = 0;
        const unclassifiedFiles: string[] = [];

        for (const file of files) {
            try {
                const result = await classifyDocument(file);

                if (result.insights && result.insights.length > 0) {
                    console.log("Broker Insights:", result.insights);

                    // Process triggered requirements from insights
                    result.insights.forEach(insight => {
                        if (insight.triggeredRequirements) {
                            insight.triggeredRequirements.forEach(req => {
                                addRequirement(req.type, req.name);
                                console.log(`Triggered new requirement: ${req.name}`);
                            });
                        }
                    });
                }

                // Find matching requirement
                const match = requirements.find(req => req.type === result.type);

                if (match) {
                    // Extract insight messages if any
                    const insightMessages = result.insights ? result.insights.map(i => i.message) : [];
                    addDocumentFile(match.id, file, insightMessages, result.extractedData, result.extractedText);
                    processedCount++;

                    // Run Verification against Application Data
                    if (currentLoan && (currentLoan as any).full1003 && result.extractedData) {
                        const appData = (currentLoan as any).full1003 as Full1003Data;
                        const newDiscrepancies = VerificationService.compare(appData, result.extractedData);

                        if (newDiscrepancies.length > 0) {
                            console.log("Discrepancies found:", newDiscrepancies);
                            setDiscrepancies(prev => [...prev, ...newDiscrepancies]);
                            setIsModalOpen(true);
                        }
                    }
                } else {
                    unclassifiedFiles.push(file.name);
                    // If there was a specific failure reason (e.g. blurry), show it immediately for this file
                    if (result.failureReason) {
                        setToast({
                            message: `Could not identify ${file.name}: ${result.failureReason}`,
                            type: 'error'
                        });
                        // Pause briefly so user can read it if multiple fail
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
            if (unclassifiedFiles.length > 0) {
                setToast({
                    message: `Sorted ${processedCount} files. Could not identify: ${unclassifiedFiles.length} files. Try renaming them.`,
                    type: 'warning'
                });
            } else {
                setToast({ message: `Successfully sorted ${processedCount} documents!`, type: 'success' });
            }
        } else {
            setToast({
                message: "Could not identify documents. Try renaming them (e.g. 'w2.pdf', 'paystub.jpg') or upload manually.",
                type: 'error'
            });
        }
    };

    const handleFixDiscrepancy = (discrepancy: Discrepancy) => {
        setIsModalOpen(false);
        // Navigate to application with highlight params
        const query = new URLSearchParams();
        query.set('mode', 'edit');
        if (discrepancy.step) query.set('step', discrepancy.step.toString());
        query.set('highlight', discrepancy.fieldPath);
        query.set('aiValue', JSON.stringify(discrepancy.documentValue));

        router.push(`/borrower/apply?${query.toString()}`);
    };

    const handleIgnoreDiscrepancy = (discrepancy: Discrepancy) => {
        // Remove this discrepancy from the list
        setDiscrepancies(prev => prev.filter(d => d.id !== discrepancy.id));
        // If no more, close modal
        if (discrepancies.length <= 1) {
            setIsModalOpen(false);
        }
    };

    const totalFiles = requirements.reduce((acc, req) => acc + req.files.length, 0);
    const pendingCount = requirements.filter(req => req.status === 'pending').length;

    // Calculate missing 1003 fields & Extract Data for Dashboard
    let missing1003Count = 0;
    let dashboardData = {
        monthlyIncome: 0,
        employmentStatus: 'Pending...',
        loanAmount: 0
    };

    if (currentLoan && (currentLoan as any).full1003) {
        // Debug Logging
        console.log("Dashboard - Current Loan:", currentLoan);
        console.log("Dashboard - Raw 1003:", (currentLoan as any).full1003);

        // Parse if string, otherwise use as object
        let data = (currentLoan as any).full1003;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error("Failed to parse full1003", e);
                data = null;
            }
        }

        if (data) {
            const fullData = data as Full1003Data;
            missing1003Count = FormIntelligenceService.countMissingFields(fullData);

            // Extract Dashboard Data
            // 1. Monthly Income
            const totalIncome = fullData.employment?.reduce((acc, emp) => acc + (emp.monthlyIncome?.total || 0), 0) || 0;
            dashboardData.monthlyIncome = totalIncome;

            // 2. Employment Status
            if (fullData.employment?.length > 0) {
                const primaryEmp = fullData.employment[0];
                dashboardData.employmentStatus = primaryEmp.isSelfEmployed ? 'Self-Employed' : `Employed at ${primaryEmp.employerName}`;
            } else {
                dashboardData.employmentStatus = 'Not Listed';
            }

            // 3. Loan Amount
            dashboardData.loanAmount = fullData.loanAndProperty?.loanAmount || 0;

            console.log("Dashboard - Extracted Data:", dashboardData);
        }


    }

    // Determine status text and progress bar width based on Standard Lifecycle
    // Stages: Applied -> Processing -> Underwriting -> Conditions -> Closing
    let statusText = 'Application Draft';
    let progressWidth = '10%';
    let statusColor = 'bg-slate-500';

    // 1. Applied (Draft)
    if (applicationStatus === 'draft') {
        statusText = 'Application Draft';
        progressWidth = '15%';
        statusColor = 'bg-slate-500';
    }
    // 2. Processing (Submitted)
    else if (applicationStatus === 'submitted' || applicationStatus === 'processing_aus') {
        statusText = 'Processing';
        progressWidth = '35%';
        statusColor = 'bg-blue-500';
    }
    // 3. Underwriting
    else if (applicationStatus === 'underwriting' || applicationStatus === 'waiting_for_underwriter' || applicationStatus === 'senior_underwriting') {
        statusText = 'In Underwriting';
        progressWidth = '55%';
        statusColor = 'bg-purple-500';
    }
    // 4. Conditions (Conditions Pending)
    else if (applicationStatus === 'conditions_pending' || applicationStatus === 'additional_conditions_pending') {
        statusText = 'Conditions Pending';
        progressWidth = '75%';
        statusColor = 'bg-amber-500';
    }
    // 5. Closing (Approved/Clear to Close)
    else if (applicationStatus === 'pre_approved' || applicationStatus === 'approved' || applicationStatus === 'clear_to_close') {
        statusText = 'Clear to Close';
        progressWidth = '100%';
        statusColor = 'bg-green-500';
    }

    if (isLoading || !borrowerId) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-slate-900 dark:text-white">Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">My Dashboard</h1>
                        <div className="flex gap-3">
                            <Link href="/borrower/settings">
                                <Button variant="outline">Settings</Button>
                            </Link>
                            <Button variant="outline" onClick={logout}>Logout</Button>
                            <Button variant="outline">Contact Support</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Status Card */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Conditions Section (Only visible when conditions are pending) */}
                            {(applicationStatus === 'conditions_pending' || applicationStatus === 'additional_conditions_pending') && conditions.length > 0 && (
                                <Card variant="glass" className="border-l-4 border-l-amber-500 bg-amber-500/5">
                                    <CardHeader>
                                        <CardTitle className="text-amber-400">Outstanding Conditions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {conditions.map((condition) => (
                                                <div key={condition.id} className="p-4 bg-white/50 dark:bg-surface/50 rounded-lg border border-slate-200 dark:border-white/10 flex flex-col gap-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="text-slate-900 dark:text-white font-medium">{condition.title}</h4>
                                                                <Badge variant={condition.status === 'cleared' ? 'default' : 'secondary'} className={condition.status === 'cleared' ? "bg-green-500 hover:bg-green-600" : ""}>
                                                                    {condition.status === 'cleared' ? 'Resolved' : 'Action Required'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-400 text-sm">{condition.description}</p>
                                                        </div>
                                                    </div>

                                                    {condition.status === 'pending' && (
                                                        <div className="flex gap-2 mt-2">
                                                            {condition.type === 'document' ? (
                                                                <Button size="sm" variant="outline" className="text-xs" onClick={() => resolveCondition(condition.id)}>
                                                                    Upload Document
                                                                </Button>
                                                            ) : (
                                                                <div className="flex gap-2 w-full">
                                                                    <Button size="sm" variant="outline" className="text-xs" onClick={() => resolveCondition(condition.id)}>
                                                                        Refute / Explain
                                                                    </Button>
                                                                    <Button size="sm" onClick={() => resolveCondition(condition.id)}>
                                                                        Resolve
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* AUS Results Section */}
                            {(applicationStatus === 'underwriting' || dualAusResult) && (
                                <div className="space-y-4">
                                    {!dualAusResult && (
                                        <Card variant="glass">
                                            <CardHeader><CardTitle>AI Underwriting</CardTitle></CardHeader>
                                            <CardContent>
                                                <div className="text-center py-6">
                                                    <p className="text-slate-600 dark:text-slate-400 mb-4">Run the Automated Underwriting System (AUS) to check eligibility against Fannie Mae and Freddie Mac guidelines simultaneously.</p>
                                                    <Button onClick={runDualAUS} disabled={!currentLoan}>
                                                        Run Dual AUS Check
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {dualAusResult && (
                                        <AUSResults results={dualAusResult} />
                                    )}
                                </div>
                            )}

                            {/* Smart Upload Section - Hide during underwriting unless conditions require upload */}
                            {applicationStatus === 'draft' && (
                                <div className="animate-fade-in">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Smart Document Upload</h2>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">Drag & drop files here. Tip: Include "w2", "paystub", or "bank" in filenames.</p>

                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-primary-400">{totalFiles}</span>
                                            <span className="text-slate-500"> Files Uploaded</span>
                                        </div>
                                    </div>
                                    <FileDropZone onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
                                </div>
                            )}

                            {/* Document Checklist */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Required Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {requirements.map((req) => (
                                            <div key={req.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${req.status === 'uploaded' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                                                            }`}>
                                                            {req.status === 'uploaded' ? '✓' : '○'}
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-900 dark:text-white font-medium">{req.name}</div>
                                                            {req.files.length > 0 && (
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">{req.files.length} file(s) uploaded</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm">
                                                        {req.status === 'pending' && <span className="text-yellow-600 dark:text-yellow-500">Pending</span>}
                                                        {req.status === 'uploaded' && <span className="text-green-600 dark:text-green-400">Uploaded</span>}
                                                    </div>
                                                </div>

                                                {/* Broker Insights Box */}
                                                {req.insights && req.insights.length > 0 && (
                                                    <div className="mb-3 ml-11 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-200">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-amber-400 mt-0.5">💡</span>
                                                            <div className="space-y-1">
                                                                {req.insights.map((insight, idx) => (
                                                                    <div key={idx}>{insight}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* File List */}
                                                {req.files.length > 0 && (
                                                    <div className="ml-11 space-y-1">
                                                        {req.files.map((file, idx) => (
                                                            <div key={idx} className="flex items-center text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 p-1.5 rounded group border border-slate-200 dark:border-transparent">
                                                                <span className="mr-2">📄</span>
                                                                <span className="flex-1 truncate">{file.name}</span>
                                                                <span className="text-slate-500 ml-2 mr-2">{file.date}</span>
                                                                <button
                                                                    onClick={() => removeDocumentFile(req.id, file.name)}
                                                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                                                                    title="Remove file"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card variant="glass" className="border-l-4 border-l-primary-500">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl mb-1">Application Status</CardTitle>
                                            <p className="text-slate-600 dark:text-slate-400">Loan #12345678</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${applicationStatus === 'draft' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600' :
                                            applicationStatus === 'underwriting' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/20' :
                                                applicationStatus === 'conditions_pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/20' :
                                                    'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/20 dark:text-primary-300 dark:border-primary-500/20'
                                            }`}>
                                            {statusText}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative pt-8 pb-4">
                                        <div className="h-1 bg-surface-highlight/30 rounded-full overflow-hidden mb-8">
                                            <div className={`h-full ${statusColor} transition-all duration-1000`} style={{ width: progressWidth }}></div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <div className="text-primary-400 font-medium">Application</div>
                                            <div className={`${['submitted', 'processing_aus', 'underwriting', 'waiting_for_underwriter', 'senior_underwriting', 'conditions_pending', 'additional_conditions_pending', 'pre_approved', 'approved', 'clear_to_close'].includes(applicationStatus) ? 'text-primary-400 font-medium' : 'text-slate-500'}`}>Processing</div>
                                            <div className={`${['underwriting', 'waiting_for_underwriter', 'senior_underwriting', 'conditions_pending', 'additional_conditions_pending', 'pre_approved', 'approved', 'clear_to_close'].includes(applicationStatus) ? 'text-primary-400 font-medium' : 'text-slate-500'}`}>Underwriting</div>
                                            <div className={`${['conditions_pending', 'additional_conditions_pending', 'pre_approved', 'approved', 'clear_to_close'].includes(applicationStatus) ? 'text-primary-400 font-medium' : 'text-slate-500'}`}>Conditions</div>
                                            <div className={`${['pre_approved', 'approved', 'clear_to_close'].includes(applicationStatus) ? 'text-primary-400 font-medium' : 'text-slate-500'}`}>Closing</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-white/50 dark:bg-surface/50 rounded-lg border border-slate-200 dark:border-white/5">
                                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Next Step</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            {applicationStatus === 'draft' && "Complete your document checklist to submit your application."}
                                            {applicationStatus === 'underwriting' && "Our AI underwriter is reviewing your file. This usually takes 2-3 minutes."}
                                            {applicationStatus === 'conditions_pending' && "We need a few more things to finalize your approval. Please check the conditions above."}
                                            {applicationStatus === 'pre_approved' && "You are Pre-Approved! Select a loan program to view closing requirements."}
                                            {applicationStatus === 'approved' && "Congratulations! Your loan is approved for closing."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Action Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pendingCount === 0 ? (
                                            <div className="p-3 bg-secondary-500/10 border border-secondary-500/20 rounded-lg flex items-start">
                                                <div className="mr-3 mt-0.5 text-secondary-400">✓</div>
                                                <div>
                                                    <div className="text-secondary-200 font-medium text-sm">All tasks complete</div>
                                                    <div className="text-secondary-200/60 text-xs">Ready to submit!</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start">
                                                <div className="mr-3 mt-0.5 text-yellow-400">!</div>
                                                <div>
                                                    <div className="text-yellow-200 font-medium text-sm">{pendingCount} Documents Missing</div>
                                                    <div className="text-yellow-200/60 text-xs">Please upload required files.</div>
                                                </div>
                                            </div>
                                        )}

                                        {applicationStatus === 'draft' && (
                                            <Button
                                                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={pendingCount > 0}
                                                onClick={submitApplication}
                                            >
                                                Submit Application
                                            </Button>
                                        )}

                                        {dualAusResult && ['underwriting', 'processing_aus'].includes(applicationStatus) && (
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-500"
                                                onClick={submitToUnderwriting}
                                            >
                                                Submit to Underwriting
                                            </Button>
                                        )}

                                        <Link href="/borrower/documents">
                                            <Button variant="outline" className="w-full justify-between group">
                                                <span>View Documents</span>
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </Button>
                                        </Link>

                                        <Link href="/borrower/apply?mode=edit">
                                            <Button variant="outline" className="w-full justify-between group relative">
                                                <div className="flex items-center">
                                                    <span>View/Edit Application</span>
                                                    {missing1003Count > 0 && (
                                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-500/30">
                                                            {missing1003Count} Missing
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="group-hover:translate-x-1 transition-transform">✎</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Loan Officer</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                                            JS
                                        </div>
                                        <div>
                                            <div className="text-slate-900 dark:text-white font-medium">John Smith</div>
                                            <div className="text-slate-600 dark:text-slate-400 text-sm">Senior Loan Officer</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-300">
                                            📧 john.smith@example.com
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-300">
                                            📞 (555) 987-6543
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Loan Details Card (Visible Data Updates) */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Application Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-white/5 rounded">
                                            <span className="text-sm text-slate-500">Monthly Income</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {dashboardData.monthlyIncome > 0
                                                    ? `$${dashboardData.monthlyIncome.toLocaleString()}`
                                                    : analyzedData?.employment?.monthlyIncome
                                                        ? `$${analyzedData.employment.monthlyIncome.toLocaleString()}`
                                                        : 'Pending...'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-white/5 rounded">
                                            <span className="text-sm text-slate-500">Employment</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {dashboardData.employmentStatus !== 'Pending...' && dashboardData.employmentStatus !== 'Not Listed'
                                                    ? dashboardData.employmentStatus
                                                    : analyzedData?.employment?.status || 'Pending...'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-white/5 rounded">
                                            <span className="text-sm text-slate-500">Loan Amount</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {dashboardData.loanAmount > 0
                                                    ? `$${dashboardData.loanAmount.toLocaleString()}`
                                                    : analyzedData?.property?.loanAmount
                                                        ? `$${analyzedData.property.loanAmount.toLocaleString()}`
                                                        : 'Pending...'}
                                            </span>
                                        </div>
                                        {(analyzedData || dashboardData.loanAmount > 0) && (
                                            <div className="text-xs text-green-500 text-center mt-2 flex items-center justify-center gap-1">
                                                <span>✓</span> Data updated from Application
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <AIAssistant
                context={{
                    borrowerName: 'Borrower',
                    loanStatus: applicationStatus as any,
                    requirements: requirements,
                    underwritingResult: underwritingResult,
                    conditions: conditions
                }}
            />

            <DiscrepancyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                discrepancies={discrepancies}
                onFix={handleFixDiscrepancy}
                onIgnore={handleIgnoreDiscrepancy}
            />

            <RedFlagModal
                isOpen={isRedFlagModalOpen}
                onClose={() => setIsRedFlagModalOpen(false)}
                issues={aiAnalysisResult?.issues || []}
            />


            <UnderwriterSimulator />
            <BorrowerDebugFooter />
        </main>
    );
}

