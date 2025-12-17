'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DocumentType } from '@/lib/document-ai';
import { AutomatedUnderwritingService, UnderwritingResult, LoanProgram } from '@/lib/automated-underwriting';
import { createLoan, updateLoan, getLoans } from '@/lib/api';
import { useBorrowerAuth } from '@/hooks/useBorrower';
import { EmailService } from '@/lib/email-service';
import { useBrokerSettings } from './BrokerContext';
import { AIUnderwriter, AIAnalysisResult } from '@/lib/ai-underwriter';
import { ClassificationResult } from '@/lib/document-ai';
import { determineRequiredDocuments } from '@/lib/document-requirements';
import type { LoanApplication } from '@/types/shared';
import { DualAUSResponse } from '@/lib/aus-engine';
import { Full1003Data } from '@/types/form-1003';
import { CreditService } from '@/lib/credit-service';
import { useToast } from '@/context/ToastContext';
import { MiniAUSService } from '@/lib/pre-aus-check';

export interface DocumentFile {
    name: string;
    date: string;
    file?: File; // Store the actual File object for attachments
    extractedData?: any;
    extractedText?: string; // Raw text from OCR for advanced validation
}

export interface DocumentRequirement {
    id: string;
    type: DocumentType;
    name: string;
    status: 'pending' | 'uploaded' | 'verified';
    required: boolean;
    files: DocumentFile[];
    insights: string[];
}

export type ApplicationStatus = 'draft' | 'submitted' | 'processing_aus' | 'underwriting' | 'pre_approved' | 'approved' | 'conditions_pending' | 'waiting_for_underwriter' | 'additional_conditions_pending' | 'senior_underwriting' | 'clear_to_close' | 'Processing' | 'Submitted to Lender' | 'Underwriting';

export interface Condition {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'explanation';
    status: 'pending' | 'cleared';
    relatedDocumentType?: DocumentType;
    createdAt?: string;
    file?: DocumentFile; // File uploaded to satisfy condition
    source?: 'aus' | 'underwriter';
}

interface DocumentContextType {
    documents: DocumentRequirement[];
    applicationStatus: ApplicationStatus;
    conditions: Condition[];
    underwritingResult?: UnderwritingResult | null;
    selectedLoan?: LoanProgram | null;
    currentLoan?: LoanApplication | null; // New: Expose the full loan application
    analyzedData: any; // New: Expose analyzed data

    aiAnalysisResult?: AIAnalysisResult | null; // New: Expose AI analysis result
    dualAusResult?: DualAUSResponse | null; // New: Expose Dual AUS Result
    runDualAUS: () => void;
    addDocumentFile: (id: string, file: File, insights?: string[], extractedData?: any, extractedText?: string) => void;
    setDocuments: (documents: DocumentRequirement[]) => void;
    addRequirement: (type: DocumentType, name: string) => void;
    submitApplication: () => void;
    submitToUnderwriting: () => void;
    addCondition: (condition: Omit<Condition, 'id' | 'status'>) => void;
    resolveCondition: (id: string) => void;
    clearCondition: (id: string) => void;
    satisfyCondition: (id: string, file?: File, explanation?: string) => void;
    reSubmitApplication: () => void;
    removeDocumentFile: (id: string, fileName: string) => void;
    generatePreApproval: (loanId: string) => Promise<void>;
    setApplicationStatus: (status: ApplicationStatus) => void;
    syncWithBackend: () => Promise<void>;
    resetApplication: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocuments must be used within a DocumentProvider');
    }
    return context;
};

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
    const [documents, setDocuments] = useState<DocumentRequirement[]>([]);
    const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('draft');
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [underwritingResult, setUnderwritingResult] = useState<UnderwritingResult | null>(null);
    const [selectedLoan, setSelectedLoan] = useState<LoanProgram | null>(null);
    const [currentLoan, setCurrentLoan] = useState<LoanApplication | null>(null); // New state
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentLoanId, setCurrentLoanId] = useState<string | null>(null);
    const [analyzedData, setAnalyzedData] = useState<any>(null);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
    const [dualAusResult, setDualAusResult] = useState<DualAUSResponse | null>(null);

    const { settings } = useBrokerSettings();
    const { borrowerId } = useBorrowerAuth();
    const { setToast } = useToast();

    const addCondition = (condition: Omit<Condition, 'id' | 'status'>) => {
        const newCondition: Condition = {
            ...condition,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            source: 'aus',
            createdAt: new Date().toISOString()
        };
        setConditions(prev => [...prev, newCondition]);
    };

    const clearCondition = (id: string) => {
        setConditions(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'cleared' } : c
        ));
    };

    const resolveCondition = (id: string) => {
        // Logic to mark a condition as resolved/uploaded by the borrower
        // In a real app, this might upload a file or save a note.
        // For now, we update the status safely.
        setConditions(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'cleared' } : c
        ));
    };

    const submitToUnderwriting = async () => {
        // Alias for submitApplication but specifically transitioning status
        setApplicationStatus('underwriting');
        // We can add specific logic here if "submitting" differs from "processing"
        // For now, it re-uses the flow or just updates status
    };

    const resetApplication = () => {
        setDocuments([
            { id: '1', type: 'PAY_STUB', name: 'Pay Stubs (Last 30 Days)', status: 'pending', required: true, files: [], insights: [] },
            { id: '2', type: 'W2', name: 'W-2 Forms (Last 2 Years)', status: 'pending', required: true, files: [], insights: [] },
            { id: '3', type: 'TAX_RETURN', name: 'Tax Returns (1040)', status: 'pending', required: true, files: [], insights: [] },
            { id: '4', type: 'BANK_STATEMENT', name: 'Bank Statements (Last 2 Months)', status: 'pending', required: true, files: [], insights: [] },
            { id: '5', type: 'ID', name: 'Photo ID', status: 'pending', required: true, files: [], insights: [] },
        ]);
        setApplicationStatus('draft');
        setConditions([]);
        setUnderwritingResult(null);
        setSelectedLoan(null);
        setAnalyzedData(null);
        setAiAnalysisResult(null);
        setDualAusResult(null);
        setCurrentLoanId(null);
        setCurrentLoan(null);

        // Clear local storage
        localStorage.removeItem('loan_documents_v2');
        localStorage.removeItem('loan_status_v2');
        localStorage.removeItem('loan_underwriting_result_v2');
        localStorage.removeItem('loan_conditions_v2');
        localStorage.removeItem('loan_selected_program_v2');
    };

    const syncWithBackend = async () => {
        if (borrowerId) {
            try {
                const loans = await getLoans();
                if (loans && loans.length > 0) {
                    // Sort by createdAt descending to get the most recent loan
                    const sortedLoans = loans.sort((a: any, b: any) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    const latestLoan = sortedLoans[0];
                    setCurrentLoanId(latestLoan.id);
                    // setCurrentLoan moved to after parsing

                    // Map backend status to frontend ApplicationStatus
                    let newStatus: ApplicationStatus = 'draft';
                    const backendStatus = latestLoan.status as string;

                    if (backendStatus === 'Draft' || backendStatus === 'InProgress') newStatus = 'draft';
                    else if (backendStatus === 'Submitted') newStatus = 'submitted';
                    else if (backendStatus === 'Under Review' || backendStatus === 'UnderReview') newStatus = 'underwriting';
                    else if (backendStatus === 'Pre-Approved') newStatus = 'pre_approved';
                    else if (backendStatus === 'Approved') newStatus = 'approved';
                    else if (backendStatus === 'ClearToClose') newStatus = 'clear_to_close';

                    const parsedData = (latestLoan as any).data;
                    const full1003Data = parsedData?.full1003 || parsedData;

                    // Determine income type with priority to SelfEmployed if present in full1003
                    const isSelfEmployedInFull1003 = full1003Data?.employment?.some((e: any) => e.isSelfEmployed);
                    const summaryIncomeType = parsedData?.employment?.incomeType;
                    const finalIncomeType = isSelfEmployedInFull1003 ? 'SelfEmployed' : (summaryIncomeType || 'W2');

                    // Construct a robust LoanApplication object for the logic
                    const loanWithFull1003 = {
                        ...latestLoan,
                        full1003: full1003Data,
                        // Explicitly map top-level fields that logic depends on
                        employment: {
                            ...parsedData?.employment,
                            incomeType: finalIncomeType
                        },
                        borrower: {
                            ...latestLoan.borrower,
                            citizenship: parsedData?.borrower?.citizenship || full1003Data?.borrower?.citizenship
                        }
                    };

                    setCurrentLoan(loanWithFull1003 as any); // Update state with enriched object

                    console.log('🔍 DYNAMIC DOCS DEBUG INPUT:', {
                        incomeType: (loanWithFull1003 as any).employment?.incomeType,
                        maritalStatus: loanWithFull1003.full1003?.borrower?.maritalStatus,
                        rentalIncome: loanWithFull1003.full1003?.realEstate?.[0]?.monthlyRentalIncome
                    });

                    const requiredDocs = determineRequiredDocuments(loanWithFull1003 as any);

                    console.log('🔍 DYNAMIC DOCS DEBUG OUTPUT:', requiredDocs.map(d => d.type));

                    setDocuments(prev => {
                        const mergedDocs: DocumentRequirement[] = [];

                        // First, process all calculated requirements
                        requiredDocs.forEach(req => {
                            const existing = prev.find(p => p.type === req.type);
                            if (existing) {
                                // Keep existing state but ensure it's marked as required
                                mergedDocs.push({ ...existing, required: true });
                            } else {
                                // Add new requirement
                                mergedDocs.push(req);
                            }
                        });

                        // Second, keep any other existing docs that have files uploaded (don't lose user data)
                        prev.forEach(p => {
                            if (!mergedDocs.find(m => m.type === p.type) && p.files.length > 0) {
                                mergedDocs.push({ ...p, required: false, name: p.name + ' (Optional)' });
                            }
                        });

                        return mergedDocs;
                    });
                }
            } catch (error) {
                console.error("Failed to sync loan status:", error);
            }
        }
    };

    // Sync with backend status on mount or borrowerId change
    useEffect(() => {
        if (borrowerId) {
            syncWithBackend();
        } else {
            resetApplication();
        }
    }, [borrowerId]);

    const runAIAnalysis = (currentDocs: DocumentRequirement[]) => {
        console.log("Running AI Underwriter Analysis...");
        const aiDocs: ClassificationResult[] = [];
        let extractedLoanData: any = {};

        // Convert DocumentContext files to ClassificationResult format for AIUnderwriter
        // And aggregate extracted data
        currentDocs.forEach(doc => {
            doc.files.forEach(f => {
                if (f.file) {
                    aiDocs.push({
                        file: f.file,
                        type: doc.type as any,
                        confidence: 1.0,
                        extractedText: "",
                        extractedData: f.extractedData
                    });

                    if (f.extractedData) {
                        extractedLoanData = { ...extractedLoanData, ...f.extractedData };
                    }
                }
            });
        });

        // Construct loan object from extracted data or defaults
        const analysisLoan: any = {
            employment: extractedLoanData.employment || {
                status: 'Employed',
                startDate: '2020-01-01',
                monthlyIncome: 10000 // Fallback
            },
            assets: extractedLoanData.assets || [],
            documents: []
        };

        // --- SMART DATA MERGING ---
        // 1. Borrower Info (Prioritize ID, then W2, then 1003)
        const idDoc = aiDocs.find(d => d.type === 'ID');
        const w2Doc = aiDocs.find(d => d.type === 'W2');

        if (idDoc?.extractedData?.borrower) {
            analysisLoan.borrower = { ...analysisLoan.borrower, ...idDoc.extractedData.borrower };
        } else if (w2Doc?.extractedData?.borrower) {
            analysisLoan.borrower = { ...analysisLoan.borrower, ...w2Doc.extractedData.borrower };
        }

        // 2. Employment & Income (Prioritize W2, then Paystub)
        // We'll take the MAX income found to be generous for pre-approval, or average if multiple paystubs
        let maxIncome = 0;
        let employerName = '';

        aiDocs.forEach(doc => {
            if (doc.extractedData?.employment?.monthlyIncome) {
                if (doc.extractedData.employment.monthlyIncome > maxIncome) {
                    maxIncome = doc.extractedData.employment.monthlyIncome;
                    employerName = doc.extractedData.employment.employerName || employerName;
                }
            }
        });

        if (maxIncome > 0) {
            analysisLoan.employment = {
                status: 'Employed',
                monthlyIncome: maxIncome,
                employerName: employerName || 'Unknown Employer',
                startDate: '2020-01-01' // Default if not found
            };
        }

        // 3. Assets (Aggregate from all Bank Statements)
        const bankStatements = aiDocs.filter(d => d.type === 'BANK_STATEMENT');
        if (bankStatements.length > 0) {
            analysisLoan.assets = [];
            bankStatements.forEach(doc => {
                if (doc.extractedData?.assets) {
                    analysisLoan.assets.push(...doc.extractedData.assets);
                }
            });
        }

        // 4. Fallback to existing logic if nothing found
        if (!analysisLoan.employment.monthlyIncome && extractedLoanData.income) {
            analysisLoan.employment.monthlyIncome = extractedLoanData.income;
        }

        // Update state so UI can see it
        setAnalyzedData(analysisLoan);

        const aiAnalysisResult = AIUnderwriter.analyze(analysisLoan, aiDocs);
        console.log("AI Analysis Result:", aiAnalysisResult);
        setAiAnalysisResult(aiAnalysisResult);

        if (aiAnalysisResult.issues.length > 0) {
            aiAnalysisResult.issues.forEach(issue => {
                if (issue.severity === 'High' || issue.severity === 'Medium') {
                    // Check if condition already exists to avoid duplicates
                    setConditions(prev => {
                        const exists = prev.some(c => c.title === `${issue.category} Review` && c.status === 'pending');
                        if (exists) return prev;

                        const newCondition: Condition = {
                            id: Math.random().toString(36).substr(2, 9),
                            title: `${issue.category} Review`,
                            description: issue.message + " " + issue.recommendation,
                            type: 'explanation',
                            status: 'pending',
                            source: 'aus',
                            createdAt: new Date().toISOString()
                        };
                        return [...prev, newCondition];
                    });
                }
            });
        }
    };

    const runDualAUS = () => {
        if (!currentLoan) {
            console.warn("Cannot run Dual AUS: No current loan.");
            return;
        }

        console.log("Running Dual AUS Simulation...");
        // Use AIUnderwriter which now delegates to AUSService
        const result = AIUnderwriter.runDualAUS(currentLoan);
        setDualAusResult(result);

        // If Approved, update status logic could go here, but we'll leave it to the UI for now
        // to show the "Approve/Eligible" badges first.
    };

    const satisfyCondition = (id: string, file?: File, explanation?: string) => {
        setConditions(prev => {
            const updatedConditions = prev.map(c => {
                if (c.id === id) {
                    let documentFile: DocumentFile | undefined;
                    if (file) {
                        documentFile = {
                            name: file.name,
                            date: new Date().toLocaleDateString(),
                            file: file
                        };
                    }
                    return {
                        ...c,
                        status: 'cleared' as const,
                        file: documentFile
                    };
                }
                return c;
            });
            return updatedConditions;
        });
    };

    const reSubmitApplication = () => {
        if (applicationStatus === 'conditions_pending') {
            setApplicationStatus('waiting_for_underwriter');
        } else if (applicationStatus === 'additional_conditions_pending') {
            setApplicationStatus('senior_underwriting');
        }
    };

    // Initialize from localStorage
    useEffect(() => {
        const savedDocs = localStorage.getItem('loan_documents_v2');
        const savedStatus = localStorage.getItem('loan_status_v2');
        const savedResult = localStorage.getItem('loan_underwriting_result_v2');
        const savedConditions = localStorage.getItem('loan_conditions_v2');

        if (savedDocs) {
            setDocuments(JSON.parse(savedDocs));
        } else {
            setDocuments([
                { id: '1', type: 'PAY_STUB', name: 'Pay Stubs (Last 30 Days)', status: 'pending', required: true, files: [], insights: [] },
                { id: '2', type: 'W2', name: 'W-2 Forms (Last 2 Years)', status: 'pending', required: true, files: [], insights: [] },
                { id: '3', type: 'TAX_RETURN', name: 'Tax Returns (1040)', status: 'pending', required: true, files: [], insights: [] },
                { id: '4', type: 'BANK_STATEMENT', name: 'Bank Statements (Last 2 Months)', status: 'pending', required: true, files: [], insights: [] },
                { id: '5', type: 'ID', name: 'Photo ID', status: 'pending', required: true, files: [], insights: [] },
            ]);
        }

        if (savedStatus) {
            setApplicationStatus(savedStatus as ApplicationStatus);
        }

        if (savedResult) {
            setUnderwritingResult(JSON.parse(savedResult));
        }

        if (savedConditions) {
            setConditions(JSON.parse(savedConditions));
        }

        const savedLoan = localStorage.getItem('loan_selected_program_v2');
        if (savedLoan) {
            setSelectedLoan(JSON.parse(savedLoan));
        }

        setIsInitialized(true);

        // Capture Invitation Code from URL
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                console.log('Capturing Broker Reference:', refCode);
                localStorage.setItem('broker_ref_v2', refCode);
                // Clean URL (optional, but cleaner UX)
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, []);

    // Ensure critical requirements exist after loading
    useEffect(() => {
        if (isInitialized) {
            setDocuments(prev => {
                const hasTaxReturn = prev.some(d => d.type === 'TAX_RETURN');
                if (!hasTaxReturn) {
                    return [...prev, {
                        id: '3',
                        type: 'TAX_RETURN',
                        name: 'Tax Returns (1040)',
                        status: 'pending',
                        required: true,
                        files: [],
                        insights: []
                    }];
                }
                return prev;
            });
        }
    }, [isInitialized]);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (isInitialized && documents.length > 0) {
            localStorage.setItem('loan_documents_v2', JSON.stringify(documents));
        }
    }, [documents, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('loan_status_v2', applicationStatus);
        }
    }, [applicationStatus, isInitialized]);

    useEffect(() => {
        if (isInitialized && underwritingResult) {
            localStorage.setItem('loan_underwriting_result_v2', JSON.stringify(underwritingResult));
        }
    }, [underwritingResult, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('loan_conditions_v2', JSON.stringify(conditions));
        }
    }, [conditions, isInitialized]);

    useEffect(() => {
        if (applicationStatus === 'underwriting') {
            const timer = setTimeout(() => {
                setApplicationStatus('conditions_pending');
            }, 3000); // 3 second "Underwriting" review
            return () => clearTimeout(timer);
        }

        if (applicationStatus === 'waiting_for_underwriter') {
            const timer = setTimeout(() => {
                // Add new conditions from underwriter
                const newCondition: Condition = {
                    id: Date.now().toString(),
                    title: 'Large Deposit Explanation',
                    description: 'Please explain the $5,000 deposit on 10/15/2023.',
                    status: 'pending',
                    type: 'explanation',
                    source: 'underwriter',
                    createdAt: new Date().toISOString()
                };
                setConditions(prev => [...prev, newCondition]);
                setApplicationStatus('additional_conditions_pending');
            }, 3000); // 3 second "Manual Underwriting" review
            return () => clearTimeout(timer);
        }

        if (applicationStatus === 'senior_underwriting') {
            const timer = setTimeout(() => {
                setApplicationStatus('clear_to_close');
            }, 3000); // 3 second "Senior Underwriting" review
            return () => clearTimeout(timer);
        }
    }, [applicationStatus]);

    const addDocumentFile = (id: string, file: File, insights: string[] = [], extractedData?: any, extractedText?: string) => {
        setDocuments(prev => {
            const newDocs = prev.map(doc => {
                if (doc.id === id) {
                    const newFile: DocumentFile = {
                        name: file.name,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        file: file, // Store the file object
                        extractedData,
                        extractedText
                    };
                    // Merge new insights with existing ones, avoiding duplicates
                    const updatedInsights = Array.from(new Set([...doc.insights, ...insights]));

                    return {
                        ...doc,
                        status: 'uploaded' as const,
                        files: [...doc.files, newFile],
                        insights: updatedInsights
                    };
                }
                return doc;
            });

            // Run AI Analysis on the new state
            runAIAnalysis(newDocs);

            return newDocs;
        });
    };

    const addRequirement = (type: DocumentType, name: string) => {
        setDocuments(prev => {
            // Check if requirement already exists
            if (prev.some(doc => doc.type === type)) {
                return prev;
            }

            const newDoc: DocumentRequirement = {
                id: Math.random().toString(36).substr(2, 9),
                type,
                name,
                status: 'pending',
                required: true,
                files: [],
                insights: []
            };

            return [...prev, newDoc];
        });
    };

    const submitApplication = async () => {
        // Enforce Credit Integration Check
        if (!settings.creditIntegration?.enabled) {
            const isBorrower = window.location.pathname.startsWith('/borrower');
            const message = isBorrower
                ? 'No Credit Provider Configured. Please contact your loan originator for help.'
                : 'No Credit Provider Configured. Please go to Broker Settings -> Integrations to set up a credit reporting agency.';

            setToast({
                message,
                type: 'error',
                duration: 6000
            });
            return;
        }

        // [MINI AUS] Pre-Check Gatekeeper
        // Extract 1003 Data early for validation
        let checkData: Full1003Data | null = null;
        if (currentLoan) {
            const rawData = (currentLoan as any).data;
            if (rawData) {
                const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                checkData = parsed?.full1003 || parsed;
            }
        }

        if (checkData) {
            const preCheck = MiniAUSService.runPreCheck(checkData, documents);
            if (!preCheck.passed) {
                // BLOCK SUBMISSION
                console.warn("[Mini AUS] Blocked Submission:", preCheck.errors);

                // Show blocking errors
                setToast({
                    message: `Pre-Check Failed:\n${preCheck.errors[0]}`, // Show first error prominently
                    type: 'error',
                    duration: 8000
                });

                // Also log warnings if any
                if (preCheck.warnings.length > 0) {
                    console.warn("[Mini AUS] Warnings:", preCheck.warnings);
                }

                return; // STOP HERE
            }

            // Show Warnings non-blocking
            if (preCheck.warnings.length > 0) {
                setToast({
                    message: `Warning: ${preCheck.warnings[0]}`,
                    type: 'warning',
                    duration: 6000
                });
            }
        }

        setApplicationStatus('processing_aus');

        try {
            // Determine Recipient (Lender or Manual Underwriter)
            let recipient: { name: string; email: string } | undefined;

            // 1. Check for Lenders (Integrations)
            if (settings.lenders && settings.lenders.length > 0) {
                const lender = settings.lenders[0]; // Default to first for now
                recipient = {
                    name: lender.name,
                    email: 'submissions@' + lender.provider.toLowerCase() + '.com' // Mock email for integration
                };
            }
            // 2. Check for Manual Underwriters
            else if (settings.underwriters && settings.underwriters.length > 0) {
                const underwriter = settings.underwriters[0];
                recipient = {
                    name: underwriter.name,
                    email: underwriter.email
                };
            }

            // Send Email Package
            let emailSuccess = false;
            if (recipient) {
                // @ts-ignore - EmailService expects strict Underwriter type but we are passing a compatible object
                emailSuccess = await EmailService.sendUnderwritingPackage('LOAN-12345', documents, recipient, settings.emailSettings);

                if (!emailSuccess) {
                    console.error("Failed to send email");
                }
            } else {
                console.warn("No recipient configured (Lender or Underwriter). Skipping email.");
            }

            // 🤖 AUTOMATED: Run AI Underwriter Analysis
            runAIAnalysis(documents);

            // Run Automated Underwriting Immediately
            try {
                // Simulate "Processing" time for better UX (Step-by-step feel)
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Try to find 1003 data
                let extractedLoanData: any = {};
                documents.forEach(doc => {
                    doc.files.forEach(file => {
                        if (file.extractedData) {
                            extractedLoanData = { ...extractedLoanData, ...file.extractedData };
                        }
                    });
                });

                // Extract Real 1003 Data from Current Loan
                let real1003Data: Full1003Data | null = null;
                if (currentLoan) {
                    const rawData = (currentLoan as any).data;
                    if (rawData) {
                        const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                        real1003Data = parsed?.full1003 || parsed;
                    }
                }

                // SIMULATE CREDIT PULL
                // Default to 720 if no SSN found
                let creditScore = 720;
                if (real1003Data?.borrower?.ssn) {
                    try {
                        const creditReport = await CreditService.pullCredit(real1003Data.borrower.ssn);
                        console.log("Credit Pulled:", creditReport);
                        creditScore = creditReport.score;
                        setToast({ message: `Credit Report Retrieved: ${creditScore} (${creditReport.provider})`, type: 'info' });
                    } catch (e) {
                        console.error("Credit Pull Failed", e);
                    }
                }

                // Use extracted values or defaults
                const loanAmount = extractedLoanData.property?.loanAmount || 450000;
                const propertyValue = extractedLoanData.property?.purchasePrice || 500000;

                const result = await AutomatedUnderwritingService.analyzeApplication(
                    documents,
                    loanAmount,
                    propertyValue,
                    creditScore,
                    'SingleFamily',
                    real1003Data
                );

                setUnderwritingResult(result);

                // Map AUS result to LoanApplication fields
                const loanStatus = result.decision === 'APPROVE/ELIGIBLE' ? 'Pre-Approved' : 'Under Review';
                const underwritingDecision = result.decision === 'APPROVE/ELIGIBLE' ? 'Approved' : 'Pending';

                if (borrowerId) {
                    const brokerRef = typeof window !== 'undefined' ? localStorage.getItem('broker_ref_v2') : null;
                    console.log("SUBMITTING APPLICATION. Broker Ref:", brokerRef);

                    if (!brokerRef) {
                        setToast({
                            message: "DEBUG: No Broker ID found in storage. Application will be unlinked.",
                            type: 'warning',
                            duration: 5000
                        });
                    } else {
                        setToast({
                            message: `DEBUG: Linking to Broker ID: ${brokerRef}`,
                            type: 'info',
                            duration: 3000
                        });
                    }

                    const newLoan = await createLoan({
                        borrowerId,
                        brokerId: brokerRef || undefined,
                        status: loanStatus as any,
                        stage: 'Underwriting', // Move straight to Underwriting stage
                        loanPurpose: extractedLoanData.loanPurpose || 'Purchase',
                        borrower: {
                            id: borrowerId,
                            firstName: extractedLoanData.borrower?.firstName || 'John',
                            lastName: extractedLoanData.borrower?.lastName || 'Doe',
                            email: extractedLoanData.borrower?.email || 'john@example.com',
                            phone: extractedLoanData.borrower?.phone || '555-555-5555',
                            ssn: extractedLoanData.borrower?.ssn,
                            dateOfBirth: extractedLoanData.borrower?.dateOfBirth,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        },
                        property: {
                            address: extractedLoanData.property?.address || {
                                street: '123 Main St',
                                city: 'Anytown',
                                state: 'CA',
                                zipCode: '90210'
                            },
                            loanAmount: loanAmount,
                            purchasePrice: propertyValue,
                            downPayment: propertyValue - loanAmount,
                            propertyType: 'SingleFamily'
                        },
                        employment: extractedLoanData.employment,
                        assets: extractedLoanData.assets,
                        debts: extractedLoanData.debts,
                        transactionDetails: extractedLoanData.transactionDetails,
                        // Save AUS Metrics
                        debtToIncomeRatio: result.metrics.dti / 100, // Convert % to decimal
                        loanToValueRatio: result.metrics.ltv / 100,
                        underwritingDecision: underwritingDecision as any,
                        underwritingNotes: JSON.stringify(result.findings)
                    });
                    setCurrentLoanId(newLoan.id);
                }

                if (result.eligiblePrograms.length > 0) {
                    // Even if eligible, we go to underwriting first as per user request
                    // setApplicationStatus('pre_approved'); 
                    setApplicationStatus('underwriting');
                } else {
                    setApplicationStatus('underwriting');
                    const newCondition: Condition = {
                        id: Date.now().toString(),
                        title: 'Program Eligibility Review',
                        description: 'Based on initial underwriting, we need to review your application for suitable loan programs.',
                        status: 'pending',
                        type: 'explanation',
                        source: 'aus',
                        createdAt: new Date().toISOString()
                    };
                    setConditions(prev => [...prev, newCondition]);
                }

            } catch (error) {
                console.error("Error during underwriting:", error);
                setApplicationStatus('underwriting');
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            setApplicationStatus('underwriting');
        }
    };

    const removeDocumentFile = (id: string, fileName: string) => {
        setDocuments(prev => prev.map(doc => {
            if (doc.id === id) {
                const updatedFiles = doc.files.filter(f => f.name !== fileName);
                return {
                    ...doc,
                    files: updatedFiles,
                    status: updatedFiles.length > 0 ? 'uploaded' : 'pending'
                };
            }
            return doc;
        }));
    };

    const generatePreApproval = async (programId: string) => {
        if (!underwritingResult) return;
        const loan = underwritingResult.eligiblePrograms.find(p => p.id === programId);
        if (loan) {
            setSelectedLoan(loan);

            // Generate Closing Conditions
            const closingConditions = AutomatedUnderwritingService.generateClosingConditions(
                loan,
                {
                    // In a real app, these would come from the application data
                    employmentType: 'SelfEmployed', // Simulating self-employed for demo
                    reservesMonths: 6,
                    usingGiftFunds: false,
                    isFirstTimeHomeBuyer: true
                },
                'Single Family' // Simulating property type
            );

            // Calculate new documents first
            const newDocs: DocumentRequirement[] = [];
            closingConditions.forEach(cond => {
                if (cond.type === 'DOCUMENT' && cond.documentType) {
                    // Check if already exists in current documents
                    if (!documents.some(d => d.type === cond.documentType)) {
                        newDocs.push({
                            id: Math.random().toString(36).substr(2, 9),
                            type: cond.documentType as any, // Cast to any to match DocumentType enum if needed
                            name: cond.title,
                            status: 'pending',
                            required: cond.required,
                            files: [],
                            insights: [cond.description] // Add description as insight
                        });
                    }
                }
            });

            // Update local state
            setDocuments(prev => [...prev, ...newDocs]);

            // Persist selection to backend
            if (currentLoanId) {
                try {
                    // Create the updated document list including new requirements
                    const updatedDocuments = [...documents, ...newDocs];

                    await updateLoan(currentLoanId, {
                        // @ts-ignore - assuming backend can handle this or we map it
                        selectedProgram: loan,
                        // @ts-ignore - assuming backend accepts this structure or we need to map it to backend format
                        documents: updatedDocuments
                    });
                } catch (error) {
                    console.error('Failed to update loan with selection:', error);
                }
            }
        }
    };

    const contextValue = {
        documents,
        applicationStatus,
        conditions,
        underwritingResult,
        selectedLoan,
        currentLoan, // Expose currentLoan
        analyzedData,
        aiAnalysisResult,
        dualAusResult,
        runDualAUS,
        addDocumentFile,
        setDocuments,
        addRequirement,
        submitApplication,
        submitToUnderwriting,
        addCondition,
        clearCondition,
        resolveCondition,
        satisfyCondition,
        reSubmitApplication,
        removeDocumentFile,
        generatePreApproval,
        setApplicationStatus,
        syncWithBackend,
        resetApplication
    };

    return (
        <DocumentContext.Provider value={contextValue}>
            {children}
        </DocumentContext.Provider>
    );
};

// Add this to expose context for testing
declare global {
    interface Window {
        documentContext: any;
    }
}

