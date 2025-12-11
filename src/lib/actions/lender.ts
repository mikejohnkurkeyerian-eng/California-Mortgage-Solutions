'use server';

import { getLoanById as getLoan, updateLoan } from '@/lib/api';
import { lenderService } from '@/lib/lender-simulation';
import { revalidatePath } from 'next/cache';
import { LoanApplication, LoanSubmission } from '@loan-platform/shared-types';

export async function submitToLenderAction(loanId: string, lenderId: string, lenderName: string, credentials?: { clientId: string; clientSecret: string }) {
    try {
        // 1. Get Loan Data
        const loan = await getLoan(loanId);
        if (!loan) throw new Error('Loan not found');

        // 2. Call Gateway
        // 2. Call Gateway
        // Ensure we pass the 1003 data structure.
        // If loan object IS the 1003 data (merged), we might need to conform it.
        const full1003 = (loan as any).full1003 || loan; // Fallback to loan itself if property missing
        const result = await lenderService.submitLoan(loanId, full1003, lenderId, credentials);

        // 3. Create Submission Record
        const newSubmission: LoanSubmission = {
            id: result.submissionId,
            loanId,
            lenderId,
            lenderName,
            status: result.status as any, // Cast status as simulation might have different subset
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes: result.message,
            externalReferenceId: result.portalUrl
        };

        // 4. Update Loan
        const updatedSubmissions = [...(loan.submissions || []), newSubmission];

        await updateLoan(loanId, {
            ...loan,
            status: 'Submitted to Lender',
            stage: 'Underwriting',
            submissions: updatedSubmissions
        });

        revalidatePath(`/broker/loans/${loanId}`);
        return { success: true, submission: newSubmission, result };
    } catch (error: any) {
        console.error('Submit to Lender Failed:', error);
        return { success: false, error: error.message };
    }
}

export async function checkLenderStatusAction(loanId: string, submissionId: string, lenderId: string) {
    try {
        const update = await lenderService.checkStatus(submissionId, lenderId);

        // Update Loan Record if status changed
        const loan = await getLoan(loanId);
        if (!loan) throw new Error('Loan not found');

        const submissionIndex = loan.submissions?.findIndex((s: LoanSubmission) => s.id === submissionId);
        if (submissionIndex === undefined || submissionIndex === -1) throw new Error('Submission not found');

        const currentSub = loan.submissions![submissionIndex];

        if (currentSub.status !== update.status || (update.conditions && update.conditions.length > (currentSub as any).conditions?.length)) {
            const updatedSub = {
                ...currentSub,
                status: update.status as any,
                updatedAt: update.updatedAt,
                notes: update.comments,
                // In a real app we would merge conditions properly
            };

            const newSubmissions = [...loan.submissions!];
            newSubmissions[submissionIndex] = updatedSub;

            await updateLoan(loanId, {
                ...loan,
                submissions: newSubmissions,
                // Update top-level status if this is the most recent submission
                status: update.status === 'Approved' ? 'Approved' :
                    update.status === 'Conditioned' ? 'Conditions Pending' :
                        update.status === 'Underwriting' ? 'Underwriting' : loan.status
            });

            revalidatePath(`/broker/loans/${loanId}`);
            return { success: true, updated: true, status: update.status };
        }

        return { success: true, updated: false, status: update.status };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function downloadPackageAction(loanId: string) {
    try {
        const loan = await getLoan(loanId);
        if (!loan) throw new Error('Loan not found');

        // This won't work perfectly on the server-side action return because we need to stream or return string.
        // We will return Base64 string.
        const { SubmissionPackager } = await import('@/lib/submission-packager');
        const base64 = await SubmissionPackager.createPackage(loan as any);

        return { success: true, data: base64, filename: `submission_${loanId}.zip` };
    } catch (e: any) {
        console.error('Download Package Failed', e);
        return { success: false, error: e.message };
    }
}
