'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SSNInput } from '@/components/ui/SSNInput';
import { useCreateLoan, useUpdateLoan, useBorrowerAuth } from '@/hooks/useBorrower';
import { useDocuments } from '@/context/DocumentContext';
import { Full1003Data, initial1003Data } from '@/types/form-1003';
import { AddressHistoryForm } from '@/components/borrower/application/AddressHistoryForm';
import { EmploymentHistoryForm } from '@/components/borrower/application/EmploymentHistoryForm';
import { AssetTable } from '@/components/borrower/application/AssetTable';
import { LiabilityTable } from '@/components/borrower/application/LiabilityTable';
import { RealEstateTable } from '@/components/borrower/application/RealEstateTable';
import { Toast } from '@/components/ui/Toast';
import { FormIntelligenceService, FormInsight } from '@/lib/form-intelligence';

function LoanApplicationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('mode') === 'edit';
    const stepParam = searchParams.get('step');
    const initialStep = stepParam ? parseInt(stepParam) : 1;

    const { borrowerId, user } = useBorrowerAuth();
    const [step, setStep] = useState(initialStep);
    const [formData, setFormData] = useState<Full1003Data>(initial1003Data);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [isStepLocked, setIsStepLocked] = useState(false);

    const { resetApplication, syncWithBackend, currentLoan } = useDocuments();
    const createLoanMutation = useCreateLoan();
    const updateLoanMutation = useUpdateLoan();

    // Real-time Form Intelligence - NOW ON BLUR
    const [formInsights, setFormInsights] = useState<FormInsight[]>([]);
    const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
    const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({});

    // Handle URL Step Sync
    useEffect(() => {
        const currentStepParam = searchParams.get('step');
        if (currentStepParam) {
            const newStep = parseInt(currentStepParam);
            if (!isNaN(newStep) && newStep !== step) {
                setStep(newStep);
            }
        }
    }, [searchParams, step]);

    // Handle AI Suggestions from URL
    useEffect(() => {
        const highlight = searchParams.get('highlight');
        const aiValueRaw = searchParams.get('aiValue');
        // Step param handled above separately now

        if (highlight && aiValueRaw) {
            try {
                const aiValue = JSON.parse(aiValueRaw);
                setAiSuggestions(prev => ({ ...prev, [highlight]: aiValue }));
                setHighlightedFields(prev => new Set(prev).add(highlight));

                setHighlightedFields(prev => new Set(prev).add(highlight));

                // Step param handled by main effect
            } catch (e) {
                console.error("Failed to parse aiValue", e);
            }
        }
    }, [searchParams]);

    const handleAcceptAiSuggestion = (fieldPath: string, value: any) => {
        // Update form data based on field path (dot notation)
        setFormData(prev => {
            const newData = { ...prev };
            const parts = fieldPath.split('.');
            let current: any = newData;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                // Handle array indices e.g. employment[0]
                if (part.includes('[') && part.includes(']')) {
                    const [name, indexStr] = part.split('[');
                    const index = parseInt(indexStr.replace(']', ''));
                    current = current[name][index];
                } else {
                    current = current[part];
                }
            }

            const lastPart = parts[parts.length - 1];
            current[lastPart] = value;
            return newData;
        });

        // Clear suggestion and highlight
        setAiSuggestions(prev => {
            const newState = { ...prev };
            delete newState[fieldPath];
            return newState;
        });
        setHighlightedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(fieldPath);
            return newSet;
        });

        setToast({ message: 'Value updated!', type: 'success' });
    };

    const handleFieldFocus = (fieldPath: string) => {
        if (highlightedFields.has(fieldPath)) {
            const newHighlights = new Set(highlightedFields);
            newHighlights.delete(fieldPath);
            setHighlightedFields(newHighlights);
        }
    };

    // Initialize insights on mount or when data is loaded (optional, but good for seeing existing errors)
    useEffect(() => {
        setFormInsights(FormIntelligenceService.evaluateForm(formData));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount. Or maybe we don't run it until interaction? Let's run it once.

    const handleBlur = () => {
        setFormInsights(FormIntelligenceService.evaluateForm(formData));
    };

    // Lock Step Effect
    useEffect(() => {
        if (isEditMode) {
            setIsStepLocked(true);
        } else {
            setIsStepLocked(false);
        }
    }, [step, isEditMode]);

    // Reset application state on mount to ensure fresh start, UNLESS in edit mode
    useEffect(() => {
        console.log("Apply Page Effect Triggered:", { isEditMode, hasCurrentLoan: !!currentLoan, borrowerId });

        // Redirect if not authenticated
        if (!borrowerId) {
            const callbackUrl = encodeURIComponent(window.location.pathname);
            router.push(`/borrower/start?callbackUrl=${callbackUrl}`);
            return;
        }

        if (isEditMode && currentLoan) {
            console.log("Edit mode: Loading existing data", currentLoan);

            // Map LoanApplication to Full1003Data
            const mappedData: Full1003Data = {
                borrower: {
                    firstName: currentLoan.borrower?.firstName || '',
                    lastName: currentLoan.borrower?.lastName || '',
                    email: currentLoan.borrower?.email || '',
                    phone: currentLoan.borrower?.phone || '',
                    dob: currentLoan.borrower?.dateOfBirth || '',
                    ssn: currentLoan.borrower?.ssn || '',
                    maritalStatus: 'Unmarried', // Default or map if available
                    citizenship: 'USCitizen', // Default or map if available
                    dependentsCount: 0,
                    applicationType: 'Individual',
                    // Map other fields if available in currentLoan.data
                },
                currentAddress: {
                    street: (currentLoan.borrower as any)?.address?.street || '',
                    city: (currentLoan.borrower as any)?.address?.city || '',
                    state: (currentLoan.borrower as any)?.address?.state || '',
                    zip: (currentLoan.borrower as any)?.address?.zipCode || '',
                    yearsAtAddress: 2,
                    monthsAtAddress: 0,
                    housingStatus: 'Rent'
                },
                employment: Array.isArray(currentLoan.employment) ? currentLoan.employment.map((emp: any) => ({
                    employerName: emp.employerName,
                    position: emp.position || 'Employee',
                    startDate: emp.startDate || '',
                    yearsEmployed: 2,
                    yearsOnJob: 2,
                    monthsOnJob: 0,
                    monthlyIncome: {
                        base: emp.monthlyIncome,
                        overtime: 0,
                        bonus: 0,
                        commission: 0,
                        other: 0,
                        total: emp.monthlyIncome
                    },
                    isSelfEmployed: emp.incomeType === 'SelfEmployed',
                    address: { street: '', city: '', state: '', zip: '' }
                })) : [{
                    employerName: (currentLoan.employment as any)?.employerName || '',
                    position: 'Employee',
                    startDate: '',
                    yearsEmployed: 2,
                    yearsOnJob: 2,
                    monthsOnJob: 0,
                    monthlyIncome: {
                        base: (currentLoan.employment as any)?.monthlyIncome || 0,
                        overtime: 0,
                        bonus: 0,
                        commission: 0,
                        other: 0,
                        total: (currentLoan.employment as any)?.monthlyIncome || 0
                    },
                    isSelfEmployed: (currentLoan.employment as any)?.incomeType === 'SelfEmployed',
                    address: { street: '', city: '', state: '', zip: '' }
                }],
                assets: currentLoan.assets?.map((asset: any) => ({
                    type: asset.type,
                    institutionName: asset.institution,
                    accountNumber: asset.accountNumber,
                    cashOrMarketValue: asset.currentBalance
                })) || [],
                liabilities: currentLoan.debts?.map((debt: any) => ({
                    type: debt.type,
                    companyName: debt.creditor,
                    accountNumber: debt.accountNumber,
                    unpaidBalance: debt.currentBalance,
                    monthlyPayment: debt.monthlyPayment,
                    toBePaidOff: false
                })) || [],
                realEstate: [], // Map if available
                loanAndProperty: {
                    loanAmount: currentLoan.property?.loanAmount || 0,
                    propertyValue: currentLoan.property?.purchasePrice || 0,
                    loanPurpose: currentLoan.loanPurpose as any || 'Purchase',
                    occupancy: 'PrimaryResidence',
                    address: {
                        street: currentLoan.property?.address?.street || '',
                        city: currentLoan.property?.address?.city || '',
                        state: currentLoan.property?.address?.state || '',
                        zip: currentLoan.property?.address?.zipCode || ''
                    },
                    isMixedUse: false,
                    isManufacturedHome: false
                },
                declarations: initial1003Data.declarations,
                acknowledgments: initial1003Data.acknowledgments,
                military: initial1003Data.military,
                demographics: initial1003Data.demographics
            };

            // Merge with full1003 data if available for better fidelity
            if ((currentLoan as any).data && (currentLoan as any).data.full1003) {
                const saved1003 = (currentLoan as any).data.full1003;
                setFormData({ ...mappedData, ...saved1003 });
            } else {
                setFormData(mappedData);
            }
        } else if (!isEditMode) {
            console.log("Not edit mode, initializing new application");
            resetApplication();

            // Pre-fill from Backend (Guaranteed Fresh Data)
            if (borrowerId) {
                // 1. FAST PATH: Use Session Data (if available)
                if (user) {
                    console.log("Pre-filling from Session:", user);
                    setFormData(prev => ({
                        ...prev,
                        borrower: {
                            ...prev.borrower,
                            // Use session data, fallback to existing form data
                            firstName: (user as any).firstName || prev.borrower.firstName,
                            lastName: (user as any).lastName || prev.borrower.lastName,
                            middleName: (user as any).middleName || prev.borrower.middleName,
                            email: user.email || prev.borrower.email,
                        }
                    }));
                }

                // 2. SLOW PATH: Fetch DB Profile (Get latest phone, etc)
                // We define an async function inside effect to call server action
                const fetchProfile = async () => {
                    try {
                        const { getBorrowerProfile } = await import('@/lib/actions/user');
                        const result = await getBorrowerProfile();
                        console.log("Fetched Profile result:", result);

                        // Expose to debug box
                        (window as any).debugDetails = result;

                        if (result && result.status === 'success' && result.data) {
                            const profile = result.data;
                            setFormData(prev => ({
                                ...prev,
                                borrower: {
                                    ...prev.borrower,
                                    firstName: profile.firstName || prev.borrower.firstName,
                                    lastName: profile.lastName || prev.borrower.lastName,
                                    email: profile.email || prev.borrower.email,
                                    phone: (profile as any).phone || prev.borrower.phone,
                                }
                            }));
                        }
                    } catch (err) {
                        console.error("Failed to fetch profile pre-fill:", err);
                        (window as any).debugDetails = { error: String(err) };
                    }
                };
                fetchProfile();
            }
        } else {
            console.log("Edit mode but missing data:", { currentLoan });
        }
    }, [isEditMode, currentLoan, resetApplication, borrowerId, router]); // user removed from dep array as we fetch fresh

    const handleInsightAction = (action: { type: string; payload: any }) => {
        console.log("Handling insight action:", action);

        if (action.type === 'SHOW_FIELD' || action.type === 'REQUIRE_FIELD') {
            const field = action.payload.field;

            // Navigation Logic
            if (field.startsWith('liabilities')) setStep(4);
            else if (field.startsWith('assets')) setStep(3);
            else if (field.startsWith('employment') || field === 'previousEmployment') setStep(2);
            else if (field.startsWith('realEstate')) setStep(5);
            else if (field.startsWith('loanAndProperty')) setStep(6);
            else if (field.startsWith('declarations')) setStep(7);
            else if (field.startsWith('borrower')) setStep(1);

            window.scrollTo(0, 0);

            // Highlighting Logic
            if (action.payload.targetFields && Array.isArray(action.payload.targetFields)) {
                setHighlightedFields(new Set(action.payload.targetFields));
            }

            // Additional feedback for REQUIRE_FIELD
            if (action.type === 'REQUIRE_FIELD' && action.payload.message) {
                setToast({ message: action.payload.message, type: 'warning' });
            }
        } else if (action.type === 'SUGGEST_VALUE') {
            if (action.payload.message) {
                setToast({ message: action.payload.message, type: 'info' });
            }
        }
    };

    const updateStep = (newStep: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('step', newStep.toString());
        router.push(`/borrower/apply?${params.toString()}`);
        setStep(newStep);
        window.scrollTo(0, 0);
    };

    const handleNext = () => {
        let nextStep = step + 1;
        // Skip Acknowledgments (Step 8) in Edit Mode
        if (isEditMode && nextStep === 8) {
            nextStep = 9;
        }
        updateStep(nextStep);
    };
    const handleBack = () => {
        let prevStep = step - 1;
        // Skip Acknowledgments (Step 8) in Edit Mode
        if (isEditMode && prevStep === 8) {
            prevStep = 7;
        }
        updateStep(prevStep);
    };

    const handleSubmit = async (redirect = true) => {
        console.log("Submit button clicked", isEditMode ? "(Update)" : "(Create)");

        if (!borrowerId) {
            console.error('No borrower ID found');
            setToast({ message: 'Error: No borrower ID found. Please log in again.', type: 'error' });
            return;
        }

        setToast({ message: isEditMode ? 'Saving changes...' : 'Submitting application...', type: 'info' });

        try {
            const loanData = {
                borrowerId,
                borrower: {
                    id: borrowerId,
                    firstName: formData.borrower.firstName,
                    lastName: formData.borrower.lastName,
                    email: formData.borrower.email,
                    phone: formData.borrower.phone,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                property: {
                    address: {
                        street: formData.loanAndProperty.address.street,
                        city: formData.loanAndProperty.address.city,
                        state: formData.loanAndProperty.address.state,
                        zipCode: formData.loanAndProperty.address.zip
                    },
                    loanAmount: formData.loanAndProperty.loanAmount,
                    purchasePrice: formData.loanAndProperty.propertyValue,
                    downPayment: 0,
                    propertyType: 'SingleFamily'
                },
                employment: {
                    status: 'Employed',
                    monthlyIncome: formData.employment.reduce((sum, emp) => sum + emp.monthlyIncome.total, 0),
                    incomeType: formData.employment.length > 0 && formData.employment[0].isSelfEmployed ? 'SelfEmployed' : 'W2'
                },
                full1003: formData,
                status: isEditMode ? currentLoan?.status : 'Draft',
                stage: isEditMode ? currentLoan?.stage : 'Application Review'
            };

            if (isEditMode) {
                if (!currentLoan) {
                    console.error("Edit mode but no currentLoan found");
                    setToast({ message: 'Error: Could not find loan to update. Please try again.', type: 'error' });
                    return;
                }
                // The original `isEditMode` check is equivalent to `isUpdate` here.
                // We need to ensure `existingLoanId` is available, which `currentLoan.id` provides.
                const existingLoanId = currentLoan.id;

                console.log("Updating via API Route...");

                // Standard API Fetch for Update
                const response = await fetch('/api/submit-loan', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...loanData, id: existingLoanId }) // Ensure ID is present
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Update Error ${response.status}: ${errorText}`);
                }

                const result = await response.json();
                if (!result.success) throw new Error(result.error);

                console.log("API Update finished.");
                setToast({ message: 'Application updated successfully!', type: 'success' });
            } else {
                console.log("Submitting via API Route...");

                // Use Standard API Fetch instead of Server Action
                const response = await fetch('/api/submit-loan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loanData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error ${response.status}: ${errorText}`);
                }

                const result = await response.json();
                console.log("API Submission Result:", result);

                if (!result.success) {
                    throw new Error(result.error || "Unknown API Failure");
                }
            }

            console.log("Mutation successful. Triggering background sync...");

            // Fire and forget sync
            syncWithBackend().catch(err => console.error("Background sync failed:", err));

            console.log("Redirecting to dashboard via window.location...");
            // Force hard redirect to ensure clean state
            if (redirect) {
                window.location.href = '/borrower/dashboard';
            }
        } catch (error: any) {
            console.error("Error submitting application:", error);
            setToast({
                message: `Error: ${error.message || 'Failed to submit application'}. Please try again.`,
                type: 'error'
            });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Borrower Info
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Borrower Information</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Please provide your personal details.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="First Name"
                                value={formData.borrower.firstName}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, firstName: e.target.value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.firstName')}
                                onFocus={() => handleFieldFocus('borrower.firstName')}
                            />
                            <Input
                                label="Last Name"
                                value={formData.borrower.lastName}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, lastName: e.target.value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.lastName')}
                                onFocus={() => handleFieldFocus('borrower.lastName')}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.borrower.email}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, email: e.target.value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.email')}
                                onFocus={() => handleFieldFocus('borrower.email')}
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                value={formData.borrower.phone}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, phone: e.target.value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.phone')}
                                onFocus={() => handleFieldFocus('borrower.phone')}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                max="9999-12-31"
                                min="1900-01-01"
                                value={formData.borrower.dob}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, dob: e.target.value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.dob')}
                                onFocus={() => handleFieldFocus('borrower.dob')}
                            />
                            {/* Hidden dummy input to prevent password managers from filling the SSN field */}
                            <input type="text" style={{ display: 'none' }} autoComplete="username" />
                            <input type="password" style={{ display: 'none' }} autoComplete="new-password" />

                            <SSNInput
                                label="Social Security Number"
                                value={formData.borrower.ssn}
                                onChange={(value) => setFormData({ ...formData, borrower: { ...formData.borrower, ssn: value } })}
                                onBlur={handleBlur}
                                highlighted={highlightedFields.has('borrower.ssn')}
                                onFocus={() => handleFieldFocus('borrower.ssn')}
                            />
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Marital Status</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Married', 'Unmarried', 'Separated'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, borrower: { ...formData.borrower, maritalStatus: status as any } })}
                                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${formData.borrower.maritalStatus === status
                                                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {status === 'Unmarried' ? 'Unmarried (Single, Divorced, Widowed)' : status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current Address</h3>
                            <AddressHistoryForm
                                data={formData.currentAddress}
                                onChange={(data) => setFormData({ ...formData, currentAddress: data })}
                                onBlur={handleBlur}
                                highlightedFields={highlightedFields}
                                onFieldFocus={handleFieldFocus}
                            />
                        </div>
                    </div>
                );

            case 2: // Employment
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Section 1: Employment Information</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Please provide your employment history for the last 2 years.</p>
                        <EmploymentHistoryForm
                            data={formData.employment}
                            onChange={(data) => setFormData({ ...formData, employment: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                            aiSuggestions={aiSuggestions}
                            onAcceptAiSuggestion={handleAcceptAiSuggestion}
                        />
                    </div>
                );

            case 3: // Assets
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Section 2: Financial Information - Assets</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Bank Accounts, Retirement, and Other Accounts You Have.</p>
                        <AssetTable
                            data={formData.assets}
                            onChange={(data) => setFormData({ ...formData, assets: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                            aiSuggestions={aiSuggestions}
                            onAcceptAiSuggestion={handleAcceptAiSuggestion}
                        />

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-medium mb-4">Gifts or Grants You Have Been Given or Will Receive for this Loan</h3>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center text-sm text-slate-500">
                                (Feature coming soon: Ability to add specific gift/grant details)
                            </div>
                        </div>
                    </div>
                );

            case 4: // Liabilities
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Section 2: Financial Information - Liabilities</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Credit Cards, Other Debts, and Leases that You Owe.</p>
                        <LiabilityTable
                            data={formData.liabilities}
                            onChange={(data) => setFormData({ ...formData, liabilities: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                        />
                    </div>
                );

            case 5: // Real Estate
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Section 3: Financial Information - Real Estate</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Properties You Own.</p>
                        <RealEstateTable
                            data={formData.realEstate}
                            onChange={(data) => setFormData({ ...formData, realEstate: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                        />
                    </div>
                );

            case 6: // Loan & Property
                const loanInsights = formInsights.filter(i => i.field === 'loanAndProperty');
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Loan & Property Information</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Details about the loan you are applying for and the property.</p>
                        </div>

                        {loanInsights.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 w-full">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Loan Analysis
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-2">
                                            {loanInsights.map((insight, idx) => (
                                                <div key={idx} className="flex items-start justify-between">
                                                    <p className={insight.severity === 'ERROR' ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                                                        {insight.message}
                                                    </p>
                                                    {insight.action && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="ml-4 h-6 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/40"
                                                            onClick={() => handleInsightAction(insight.action!)}
                                                        >
                                                            Fix This
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Loan Amount"
                                type="number"
                                value={formData.loanAndProperty.loanAmount || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, loanAmount: Number(e.target.value) } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Property Value (Estimated)"
                                type="number"
                                value={formData.loanAndProperty.propertyValue || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, propertyValue: Number(e.target.value) } })}
                                onBlur={handleBlur}
                            />

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Loan Purpose</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Purchase', 'Refinance', 'Other'].map((purpose) => (
                                            <button
                                                key={purpose}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, loanPurpose: purpose as any } })}
                                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${formData.loanAndProperty.loanPurpose === purpose
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {purpose}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Occupancy</label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { value: 'PrimaryResidence', label: 'Primary Residence' },
                                            { value: 'SecondHome', label: 'Second Home' },
                                            { value: 'InvestmentProperty', label: 'Investment Property' },
                                            { value: 'FHASecondaryResidence', label: 'FHA Secondary Residence' }
                                        ].map((occ) => (
                                            <button
                                                key={occ.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, occupancy: occ.value as any } })}
                                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border text-left ${formData.loanAndProperty.occupancy === occ.value
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {occ.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Subject Property Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Street Address"
                                            value={formData.loanAndProperty.address.street}
                                            onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, street: e.target.value } } })}
                                            onBlur={handleBlur}
                                            highlighted={highlightedFields.has('loanAndProperty.address.street')}
                                            onFocus={() => handleFieldFocus('loanAndProperty.address.street')}
                                        />
                                    </div>
                                    <Input
                                        label="City"
                                        value={formData.loanAndProperty.address.city}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, city: e.target.value } } })}
                                        onBlur={handleBlur}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="State"
                                            value={formData.loanAndProperty.address.state}
                                            onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, state: e.target.value } } })}
                                            onBlur={handleBlur}
                                            highlighted={highlightedFields.has('loanAndProperty.address.street')}
                                            onFocus={() => handleFieldFocus('loanAndProperty.address.street')}
                                        />
                                        <Input
                                            label="Zip Code"
                                            value={formData.loanAndProperty.address.zip}
                                            onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, zip: e.target.value } } })}
                                            onBlur={handleBlur}
                                            highlighted={highlightedFields.has('loanAndProperty.address.street')}
                                            onFocus={() => handleFieldFocus('loanAndProperty.address.street')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <label className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors bg-white dark:bg-slate-900">
                                    <input
                                        type="checkbox"
                                        checked={formData.loanAndProperty.isMixedUse}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, isMixedUse: e.target.checked } })}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">Mixed-Use Property</span>
                                </label>
                                <label className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors bg-white dark:bg-slate-900">
                                    <input
                                        type="checkbox"
                                        checked={formData.loanAndProperty.isManufacturedHome}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, isManufacturedHome: e.target.checked } })}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">Manufactured Home</span>
                                </label>
                            </div>

                            <Input
                                label="Subordinate Financing (if any)"
                                type="number"
                                value={formData.loanAndProperty.subordinateFinancing || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, subordinateFinancing: Number(e.target.value) } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Estimated Monthly Rental Income (if applicable)"
                                type="number"
                                value={formData.loanAndProperty.estimatedRentalIncome || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, estimatedRentalIncome: Number(e.target.value) } })}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                );

            case 7: // Declarations
                const declarationInsights = formInsights.filter(i => i.field === 'declarations');
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Declarations</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Please answer the following questions honestly.</p>
                        </div>

                        {declarationInsights.length > 0 && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Important Declarations
                                        </h3>
                                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                            {declarationInsights.map((insight, idx) => (
                                                <p key={idx}>{insight.message}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {[
                                { key: 'a_primaryResidence', label: 'A. Will you occupy the property as your primary residence?' },
                                { key: 'b_familyRelationship', label: 'B. Do you have a family relationship or business affiliation with the seller of the property?' },
                                { key: 'c_borrowingMoney', label: 'C. Are you borrowing any money for this real estate transaction (e.g., money for your closing costs or down payment) or obtaining any money from another party, such as the seller or realtor, that you have not disclosed on this loan application?' },
                                { key: 'd_otherMortgages', label: 'D. Have you or will you be applying for a mortgage loan on another property (not the property securing this loan) on or before closing this transaction that is not disclosed on this loan application?' },
                                { key: 'e_newCredit', label: 'E. Will this property be subject to a lien that could take priority over the first mortgage lien?' },
                                { key: 'f_priorityLien', label: 'F. Are you a co-signer or guarantor on any debt or loan that is not disclosed on this application?' },
                                { key: 'g_coSigner', label: 'G. Are there any outstanding judgments against you?' },
                                { key: 'h_outstandingJudgments', label: 'H. Are you currently delinquent or in default on a Federal debt?' },
                                { key: 'i_delinquentFederalDebt', label: 'I. Are you a party to a lawsuit in which you potentially have any personal financial liability?' },
                                { key: 'j_lawsuit', label: 'J. Have you conveyed title to any property in lieu of foreclosure in the past 7 years?' },
                                { key: 'k_foreclosure', label: 'K. Within the past 7 years, have you completed a pre-foreclosure sale or short sale?' },
                                { key: 'l_bankruptcy', label: 'L. Have you declared bankruptcy within the past 7 years?' },
                            ].map((q) => (
                                <div key={q.key} className="flex flex-col space-y-3 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{q.label}</p>
                                        <div className="flex space-x-2 shrink-0 self-start md:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, declarations: { ...formData.declarations, [q.key]: true } })}
                                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${(formData.declarations as any)[q.key] === true
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, declarations: { ...formData.declarations, [q.key]: false } })}
                                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${(formData.declarations as any)[q.key] === false
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                    {q.key === 'l_bankruptcy' && formData.declarations.l_bankruptcy && (
                                        <div className="mt-3 pl-4 border-l-2 border-primary-500 animate-fade-in">
                                            <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">Bankruptcy Type</label>
                                            <select
                                                className="w-full md:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                                                value={formData.declarations.m_bankruptcyType || ''}
                                                onChange={(e) => setFormData({ ...formData, declarations: { ...formData.declarations, m_bankruptcyType: e.target.value as any } })}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Chapter7">Chapter 7</option>
                                                <option value="Chapter11">Chapter 11</option>
                                                <option value="Chapter12">Chapter 12</option>
                                                <option value="Chapter13">Chapter 13</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="mt-8">
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Explanation for any "Yes" answers (Optional)</label>
                                <textarea
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white min-h-[120px] focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 resize-y"
                                    value={formData.declarations.explanation || ''}
                                    onChange={(e) => setFormData({ ...formData, declarations: { ...formData.declarations, explanation: e.target.value } })}
                                    onBlur={handleBlur}
                                    placeholder="Please provide details for any declarations marked 'Yes'..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case 8: // Acknowledgments
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acknowledgments and Agreements</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Please review and accept the following terms.</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="text-sm space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-slate-700 dark:text-slate-300 leading-relaxed">
                                <p className="font-semibold text-slate-900 dark:text-white text-base">I agree to, acknowledge, and represent the following:</p>

                                <p><strong>(1) The Complete Information for this Application:</strong> The information I have provided in this application is true, accurate, and complete as of the date I signed this application. You may rely on this information in deciding whether to approve this application.</p>
                                <p><strong>(2) The Property's Security:</strong> The Loan I have applied for will be secured by a mortgage or deed of trust which provides the Lender a security interest in the property described in this application.</p>
                                <p><strong>(3) The Property's Appraisal, Value, and Condition:</strong> Any appraisal or value of the property obtained by you is for use by you and other Loan Participants. I have not relied on any appraisal or value of the property obtained by you.</p>
                                <p><strong>(4) Electronic Records and Signatures:</strong> I agree to receive and sign documents electronically.</p>
                                <p><strong>(5) Delinquency:</strong> The Lender may report information about my account to credit bureaus. Late payments, missed payments, or other defaults on my account may be reflected in my credit report.</p>
                                <p><strong>(6) Use of Information:</strong> I authorize the Lender to verify the information I have provided.</p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                <label className="flex items-start space-x-4 cursor-pointer p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all duration-200"
                                        checked={formData.acknowledgments.agreedToElectronicSignatures}
                                        onChange={(e) => setFormData({ ...formData, acknowledgments: { ...formData.acknowledgments, agreedToElectronicSignatures: e.target.checked, dateSigned: new Date().toISOString().split('T')[0] } })}
                                    />
                                    <span className="font-medium text-slate-900 dark:text-white">I agree to the above acknowledgments and consent to electronic signatures.</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 9: // Demographics & Military
                return (
                    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
                        <div className="space-y-6">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Military Service</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Information regarding your military service history.</p>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">Did you (or your deceased spouse) ever serve, or are you currently serving, in the United States Armed Forces?</span>
                                    <div className="flex space-x-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, military: { ...formData.military, isVeteran: true } })}
                                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${formData.military.isVeteran
                                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, military: { ...formData.military, isVeteran: false } })}
                                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${!formData.military.isVeteran
                                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                                {formData.military.isVeteran && (
                                    <div className="mt-6 pl-4 border-l-2 border-primary-500 space-y-3 animate-fade-in">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Check all that apply:</p>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.military.isActiveDuty}
                                                onChange={(e) => setFormData({ ...formData, military: { ...formData.military, isActiveDuty: e.target.checked } })}
                                                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Currently serving on active duty</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.military.isSurvivingSpouse}
                                                onChange={(e) => setFormData({ ...formData, military: { ...formData.military, isSurvivingSpouse: e.target.checked } })}
                                                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Surviving spouse</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Demographic Information</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">The purpose of collecting this information is to help ensure that all applicants are treated fairly.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Ethnicity</label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { value: 'HispanicOrLatino', label: 'Hispanic or Latino' },
                                            { value: 'NotHispanicOrLatino', label: 'Not Hispanic or Latino' },
                                            { value: 'Refuse', label: 'I do not wish to provide this information' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, demographics: { ...formData.demographics, ethnicity: opt.value as any } })}
                                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border text-left ${formData.demographics.ethnicity === opt.value
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Sex</label>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { value: 'Male', label: 'Male' },
                                            { value: 'Female', label: 'Female' },
                                            { value: 'Refuse', label: 'I do not wish to provide this information' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, demographics: { ...formData.demographics, sex: opt.value as any } })}
                                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border text-left ${formData.demographics.sex === opt.value
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Race</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { key: 'americanIndianOrAlaskaNative', label: 'American Indian or Alaska Native' },
                                            { key: 'asian', label: 'Asian' },
                                            { key: 'blackOrAfricanAmerican', label: 'Black or African American' },
                                            { key: 'nativeHawaiianOrOtherPacificIslander', label: 'Native Hawaiian or Other Pacific Islander' },
                                            { key: 'white', label: 'White' },
                                            { key: 'refuse', label: 'I do not wish to provide this information' }
                                        ].map((race) => (
                                            <label
                                                key={race.key}
                                                className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${(formData.demographics.race as any)[race.key]
                                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-1 ring-primary-500'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={(formData.demographics.race as any)[race.key]}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        demographics: {
                                                            ...formData.demographics,
                                                            race: {
                                                                ...formData.demographics.race,
                                                                [race.key]: e.target.checked
                                                            }
                                                        }
                                                    })}
                                                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{race.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white text-sm">Loan Originator Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span className="block font-medium text-slate-700 dark:text-slate-300">Organization</span>
                                    <span>Acme Mortgage Brokers, LLC</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-slate-700 dark:text-slate-300">NMLS ID</span>
                                    <span>123456</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-slate-700 dark:text-slate-300">Loan Originator</span>
                                    <span>John Broker</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-slate-700 dark:text-slate-300">NMLS ID</span>
                                    <span>987654</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Section {step} coming soon...</div>;
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* DEBUGGER: REMOVE BEFORE PRODUCTION */}
                    {user && (
                        <div className="bg-gray-100 p-4 mb-4 rounded border border-gray-300 text-xs font-mono overflow-auto max-h-40">
                            <strong>DEBUG SESSION USER:</strong>
                            <pre>{JSON.stringify(user, null, 2)}</pre>
                            <strong>DB FETCH RESULT:</strong>
                            {/* We need to store the raw fetch result in state to show it here. 
                                 I'll need to add a state variable for this in the component above first 
                                 Wait, the tool only lets me replace this block. 
                                 I will assume I can't add state here easily without replacing the whole file header.
                                 I'll just add a temporary global variable or use a window prop if I was lazy, 
                                 but better: I'll just rely on the console logs I added OR duplicate the form values display.
                             */}
                            <pre>{JSON.stringify({
                                dbFetch: (window as any).debugDetails || "Check Console",
                                firstName: formData.borrower.firstName,
                                lastName: formData.borrower.lastName,
                                email: formData.borrower.email
                            }, null, 2)}</pre>
                        </div>
                    )}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            className="mb-4 pl-0 hover:bg-transparent hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400"
                            onClick={() => {
                                if (isEditMode) {
                                    router.push('/borrower/dashboard');
                                } else {
                                    router.back();
                                }
                            }}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {isEditMode ? 'Back to Dashboard' : 'Back'}
                        </Button>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Loan Application</h1>
                            <span className="text-slate-900 dark:text-slate-200 font-medium">Step {step} of 9</span>
                        </div>

                        {/* Interactive Progress Bar */}
                        {/* Interactive Steps */}
                        {/* Interactive Steps - Horizontal Scroll + Hover Effects */}
                        {/* Interactive Steps - Full Width Breakout + Hover */}
                        <div className="flex justify-between items-center -mx-4 md:-mx-16 lg:-mx-24 mb-6 px-4 md:px-0 relative">
                            {/* Single Continuous Background Track */}
                            <div className="absolute top-4 md:top-5 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -z-0" />

                            {/* Single Continuous Progress Line */}
                            <div
                                className="absolute top-4 md:top-5 left-0 h-[2px] bg-primary-500 -z-0 transition-all duration-500 ease-in-out"
                                style={{ width: `${((step - 1) / 8) * 100}%` }}
                            />

                            {['Borrower', 'Employment', 'Assets', 'Liabilities', 'Real Estate', 'Prop/Loan', 'Declarations', 'Agreements', 'Military'].map((label, i) => {
                                const stepNum = i + 1;
                                const isCurrent = step === stepNum;
                                const isCompleted = step > stepNum;
                                const isSkipped = isEditMode && stepNum === 8;
                                const isDisabled = (!isEditMode && stepNum > step) || isSkipped;

                                return (
                                    <button
                                        key={i}
                                        disabled={isDisabled}
                                        onClick={() => !isDisabled && updateStep(stepNum)}
                                        className={`
                                            group flex flex-col items-center gap-1.5 focus:outline-none transition-all duration-300 relative
                                            ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:-translate-y-1'}
                                        `}
                                    >
                                        <div className={`
                                            flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all duration-300 z-10
                                            ${isCurrent
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 scale-110 shadow-lg ring-4 ring-white dark:ring-slate-900'
                                                : isCompleted
                                                    ? 'bg-primary-500 text-white shadow-md'
                                                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                                            }
                                            ${!isDisabled && !isCurrent && !isCompleted ? 'group-hover:border-primary-300 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20' : ''}
                                        `}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : stepNum}
                                        </div>

                                        <span className={`
                                            text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                                            ${isCurrent
                                                ? 'text-slate-900 dark:text-white font-bold translate-y-0'
                                                : 'text-slate-400 dark:text-slate-500 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
                                            }
                                        `}>
                                            {label}
                                        </span>

                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Card variant="glass">
                        <CardHeader className="flex flex-row justify-between items-center relative z-20">
                            <CardTitle>Uniform Residential Loan Application (Form 1003)</CardTitle>
                            {isEditMode && isStepLocked && (
                                <Button
                                    size="sm"
                                    className="bg-primary-600 hover:bg-primary-500 text-white shadow-md font-medium px-6 border-2 border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900"
                                    onClick={() => setIsStepLocked(false)}
                                >
                                    Edit Page
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="relative">
                            {isEditMode && isStepLocked && (
                                <div className="absolute inset-0 z-10 bg-slate-100/60 dark:bg-slate-900/70 backdrop-blur-[1px] transition-all duration-300 rounded-b-xl" />
                            )}
                            <fieldset disabled={isStepLocked} className={`contents group-disabled transition-all duration-300 ${isStepLocked ? 'opacity-80' : 'opacity-100'}`}>
                                {renderStep()}
                            </fieldset>

                            <div className="flex justify-between pt-6 mt-6 border-t border-white/5">
                                {step > 1 ? (
                                    <Button variant="ghost" onClick={handleBack}>Back</Button>
                                ) : (
                                    <div></div>
                                )}

                                <div className="flex gap-3">
                                    {isEditMode && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleSubmit(false)}
                                            isLoading={updateLoanMutation.isPending}
                                            disabled={isStepLocked}
                                        >
                                            Save Changes
                                        </Button>
                                    )}

                                    {step < 9 ? (
                                        <Button type="button" onClick={handleNext}>Continue</Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="bg-secondary-600 hover:bg-secondary-500"
                                            onClick={() => handleSubmit(true)}
                                            isLoading={createLoanMutation.isPending || updateLoanMutation.isPending}
                                            disabled={!isEditMode && !formData.acknowledgments.agreedToElectronicSignatures}
                                        >
                                            {isEditMode ? 'Save & Exit' : 'Submit Application'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default function LoanApplicationPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
            <LoanApplicationContent />
        </React.Suspense>
    );
}

