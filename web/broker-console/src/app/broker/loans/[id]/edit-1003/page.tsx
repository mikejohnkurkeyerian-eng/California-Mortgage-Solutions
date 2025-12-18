'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrokerNavbar } from '@/components/layout/BrokerNavbar';
import { getLoanById, updateLoan } from '@/lib/api';
import { LoanApplicationWizard } from '@/components/forms/LoanApplicationWizard';
import { Full1003Data, initial1003Data } from '@/types/form-1003';
import { useToast } from '@/context/ToastContext';
import { LoanApplication } from '@/types/shared';

interface PageProps {
    params: {
        id: string;
    }
}

export default function Edit1003Page({ params }: PageProps) {
    const { setToast } = useToast();
    const loanId = params.id;

    const { data: loan, isLoading } = useQuery({
        queryKey: ['loan', loanId],
        queryFn: () => getLoanById(loanId),
    });

    const handleSave = async (data: Full1003Data) => {
        try {
            await updateLoan(loanId, { full1003: data });
            // Optionally update other top-level fields
            setToast({ message: 'Application updated successfully', type: 'success' });
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to update application', type: 'error' });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!loan) {
        return <div className="min-h-screen flex items-center justify-center">Loan not found</div>;
    }

    // Map LoanApplication to Full1003Data (reusing logic from Apply page roughly)
    // For now, assuming loan.data.full1003 exists or using defaults
    const initialData: Full1003Data = (loan as any).data?.full1003 || mapLoanTo1003(loan);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            <BrokerNavbar />
            <div className="pt-20">
                <div className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Edit 1003 Application</h1>
                        <p className="text-sm text-indigo-200">Editing for: {loan.borrower.firstName} {loan.borrower.lastName}</p>
                    </div>
                </div>

                <LoanApplicationWizard
                    mode="broker"
                    initialData={initialData}
                    onSave={handleSave}
                />
            </div>
        </main>
    );
}

// Helper to map flat LoanApplication to nested 1003 if Full1003 is missing
function mapLoanTo1003(loan: LoanApplication): Full1003Data {
    return {
        ...initial1003Data,
        borrower: {
            ...initial1003Data.borrower,
            firstName: loan.borrower.firstName,
            lastName: loan.borrower.lastName,
            email: loan.borrower.email,
            phone: loan.borrower.phone || '',
        },
        loanAndProperty: {
            ...initial1003Data.loanAndProperty,
            loanAmount: loan.property.loanAmount,
            propertyValue: loan.property.purchasePrice,
            address: {
                street: loan.property.address.street,
                city: loan.property.address.city,
                state: loan.property.address.state,
                zip: loan.property.address.zipCode,
            }
        }
    };
}
