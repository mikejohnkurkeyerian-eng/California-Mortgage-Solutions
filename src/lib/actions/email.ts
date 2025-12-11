'use server';

import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { SubmissionPackager } from '@/lib/submission-packager';
import { revalidatePath } from 'next/cache';

export async function sendLoanPackageEmail(loanId: string, emailDetails: { recipient: string; subject: string; body: string }) {
    try {
        // 1. Fetch Loan
        const loan = await prisma.loanApplication.findUnique({
            where: { id: loanId },
            include: { user: true }
        });

        if (!loan) throw new Error('Loan not found');

        // 2. Prepare Data (Merge DB fields with JSON blob)
        // Ensure parsing handles potential nulls or invalid JSON
        let loanData = {};
        try {
            loanData = JSON.parse(loan.data);
        } catch (e) {
            console.error('Failed to parse loan data', e);
        }

        const fullLoan = {
            ...loan,
            ...loanData,
            borrowerName: loan.user.name,
            borrowerEmail: loan.user.email
        };

        // 3. Generate Package
        // Returns Base64 string
        const zipBase64 = await SubmissionPackager.createPackage(fullLoan as any);

        // 4. Send Email
        const result = await sendEmail({
            to: emailDetails.recipient,
            subject: emailDetails.subject,
            html: `<p>${emailDetails.body.replace(/\n/g, '<br>')}</p>
                   <p>Attached is the submission package for Loan #${loan.id}.</p>`,
            attachments: [
                {
                    content: zipBase64,
                    filename: `loan_${loan.id}_package.zip`,
                    type: 'application/zip',
                    disposition: 'attachment'
                }
            ]
        });

        if (!result.success) {
            throw new Error(result.error);
        }

        // 5. Record Submission
        // Update the JSON blob to include this submission event?
        // Or create a Submission record? Using DB model now.

        await prisma.submission.create({
            data: {
                loanId: loan.id,
                lenderId: 'EMAIL',
                lenderName: emailDetails.recipient,
                status: 'Submitted via Email',
                notes: `Subject: ${emailDetails.subject}`,
                submittedAt: new Date(),
                snapshot: loanData // Snapshot current data state
            }
        });

        // Also update loan status
        await prisma.loanApplication.update({
            where: { id: loanId },
            data: {
                status: 'Submitted via Email',
                stage: 'Underwriting'
            }
        });

        revalidatePath(`/broker/loans/${loanId}`);
        return { success: true };
    } catch (error: any) {
        console.error('Email Submission Failed:', error);
        return { success: false, error: error.message };
    }
}
