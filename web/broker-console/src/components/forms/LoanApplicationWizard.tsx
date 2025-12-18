'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SSNInput } from '@/components/ui/SSNInput';
import { AddressHistoryForm } from '@/components/borrower/application/AddressHistoryForm';
import { EmploymentHistoryForm } from '@/components/borrower/application/EmploymentHistoryForm';
import { AssetTable } from '@/components/borrower/application/AssetTable';
import { LiabilityTable } from '@/components/borrower/application/LiabilityTable';
import { RealEstateTable } from '@/components/borrower/application/RealEstateTable';
import { Full1003Data, initial1003Data } from '@/types/form-1003';
import { FormIntelligenceService, FormInsight } from '@/lib/form-intelligence';
import { useToast } from '@/context/ToastContext';

interface LoanApplicationWizardProps {
    initialData?: Full1003Data;
    mode: 'borrower' | 'broker';
    isEditMode?: boolean;
    onSave: (data: Full1003Data) => Promise<void>;
    borrowerId?: string; // Optional if existing data is passed
}

export function LoanApplicationWizard({
    initialData,
    mode,
    isEditMode = false,
    onSave,
    borrowerId
}: LoanApplicationWizardProps) {
    const router = useRouter();
    const { setToast } = useToast();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Full1003Data>(initialData || initial1003Data);
    const [formInsights, setFormInsights] = useState<FormInsight[]>([]);
    const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

    // Load initial data if changed
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleBlur = () => {
        setFormInsights(FormIntelligenceService.evaluateForm(formData));
    };

    const handleFieldFocus = (fieldPath: string) => {
        if (highlightedFields.has(fieldPath)) {
            const newHighlights = new Set(highlightedFields);
            newHighlights.delete(fieldPath);
            setHighlightedFields(newHighlights);
        }
    };

    const handleInsightAction = (action: { type: string; payload: any }) => {
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

            if (action.payload.targetFields && Array.isArray(action.payload.targetFields)) {
                setHighlightedFields(new Set(action.payload.targetFields));
            }
        }
    };

    const nextStep = () => {
        window.scrollTo(0, 0);
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        window.scrollTo(0, 0);
        setStep(prev => prev - 1);
    };

    const saveChanges = async () => {
        try {
            await onSave(formData);
            setToast({ message: 'Changes saved successfully', type: 'success' });
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to save changes', type: 'error' });
        }
    };

    // Render Logic based on Step
    const renderStep = () => {
        switch (step) {
            case 1: // Borrower Info
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Borrower Information</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Personal details.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="First Name"
                                value={formData.borrower.firstName}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, firstName: e.target.value } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Last Name"
                                value={formData.borrower.lastName}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, lastName: e.target.value } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.borrower.email}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, email: e.target.value } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                value={formData.borrower.phone}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, phone: e.target.value } })}
                                onBlur={handleBlur}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.borrower.dob}
                                onChange={(e) => setFormData({ ...formData, borrower: { ...formData.borrower, dob: e.target.value } })}
                            />
                            <SSNInput
                                label="Social Security Number"
                                value={formData.borrower.ssn}
                                onChange={(value) => setFormData({ ...formData, borrower: { ...formData.borrower, ssn: value } })}
                            />
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
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Employment Information</h2>
                        <EmploymentHistoryForm
                            data={formData.employment}
                            onChange={(data) => setFormData({ ...formData, employment: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                        />
                    </div>
                );

            case 3: // Assets
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Assets</h2>
                        <AssetTable
                            data={formData.assets}
                            onChange={(data) => setFormData({ ...formData, assets: data })}
                            insights={formInsights}
                            onInsightAction={handleInsightAction}
                            onBlur={handleBlur}
                            highlightedFields={highlightedFields}
                            onFieldFocus={handleFieldFocus}
                        />
                    </div>
                );

            case 4: // Liabilities
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Liabilities</h2>
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
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Real Estate Owned</h2>
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
                return (
                    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Loan & Property Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Loan Amount"
                                type="number"
                                value={formData.loanAndProperty.loanAmount || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, loanAmount: Number(e.target.value) } })}
                            />
                            <Input
                                label="Property Value"
                                type="number"
                                value={formData.loanAndProperty.propertyValue || ''}
                                onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, propertyValue: Number(e.target.value) } })}
                            />
                        </div>
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Property Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Street Address"
                                        value={formData.loanAndProperty.address.street}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, street: e.target.value } } })}
                                    />
                                </div>
                                <Input
                                    label="City"
                                    value={formData.loanAndProperty.address.city}
                                    onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, city: e.target.value } } })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="State"
                                        value={formData.loanAndProperty.address.state}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, state: e.target.value } } })}
                                    />
                                    <Input
                                        label="Zip Code"
                                        value={formData.loanAndProperty.address.zip}
                                        onChange={(e) => setFormData({ ...formData, loanAndProperty: { ...formData.loanAndProperty, address: { ...formData.loanAndProperty.address, zip: e.target.value } } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Progress Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 py-4 overflow-x-auto no-scrollbar">
                        {['Personal', 'Employment', 'Assets', 'Liabilities', 'Real Estate', 'Loan & Property'].map((label, idx) => {
                            const stepNum = idx + 1;
                            const isActive = step === stepNum;
                            const isCompleted = step > stepNum;
                            return (
                                <button
                                    key={label}
                                    onClick={() => setStep(stepNum)}
                                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 ring-1 ring-primary-500/20'
                                            : isCompleted
                                                ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                : 'text-slate-400 dark:text-slate-600'
                                        }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${isActive || isCompleted ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                        {stepNum}
                                    </span>
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderStep()}

                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-40">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex gap-4">
                            {mode === 'broker' && (
                                <Button variant="secondary" onClick={saveChanges}>
                                    Save Changes
                                </Button>
                            )}
                            <Button
                                onClick={step === 6 ? saveChanges : nextStep}
                            >
                                {step === 6 ? (mode === 'broker' ? 'Finish Editing' : 'Review Application') : 'Next Step'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
