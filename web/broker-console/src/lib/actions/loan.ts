'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createLoan(data: any) {
    // DEBUG: Bypassing Auth to isolate deadlock
    const session = await auth();
    // const session = { user: { id: "db49b3b9-60db-482d-8cb6-2b119695da1d" } };

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        console.log('[CREATE_LOAN] 1. Auth Verified. User:', session.user.id);

        // DEBUG: Explicitly log session details to check for brokerId
        const user = session.user as any;
        console.log('[CREATE_LOAN] Session Data:', {
            role: user.role,
            brokerId: user.brokerId,
            providedBrokerId: data.brokerId
        });

        const createData = {
            userId: session.user.id,
            // Use provided brokerId (from invite) OR fallback to session (if user is broker)
            brokerId: data.brokerId || user.brokerId || undefined,
            status: 'Draft',
            stage: 'Application Review',
            // DEBUG: Minimal payload to test size limits
            data: JSON.stringify({ debug: "Minimal payload test", originalSize: JSON.stringify(data).length }),
        };
        console.log('[CREATE_LOAN] 2. Payload Prepared. Target BrokerId:', createData.brokerId);
        console.log('[CREATE_LOAN] 3. Inserting into DB...');

        const loan = await prisma.loanApplication.create({
            data: createData
        });

        console.log('[CREATE_LOAN] 3. Success! Loan ID:', loan.id);

        revalidatePath('/borrower/dashboard');
        return { success: true, loan };
    } catch (error) {
        console.error("Create loan error:", error);
        return { error: `Failed to create loan: ${(error as Error).message}` };
    }
}

export async function updateLoan(id: string, data: any) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const existingLoan = await prisma.loanApplication.findUnique({
            where: { id },
        });

        if (!existingLoan || existingLoan.userId !== session.user.id) {
            return { error: "Loan not found or unauthorized" };
        }

        const loan = await prisma.loanApplication.update({
            where: { id },
            data: {
                data: JSON.stringify(data),
                updatedAt: new Date(),
            }
        });

        revalidatePath('/borrower/dashboard');
        return { success: true, loan };
    } catch (error) {
        console.error("Update loan error:", error);
        return { error: "Failed to update loan" };
    }
}

export async function getLoans() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true, brokerId: true }
        });

        let whereClause: any = { userId: session.user.id };

        if (user?.role === 'BROKER' && user.brokerId) {
            whereClause = { brokerId: user.brokerId };
            console.log(`[GET_LOANS] Broker Logic Triggered. BrokerID: ${user.brokerId}`);
        } else {
            console.log(`[GET_LOANS] Broker Logic SKIPPED. Role: ${user?.role}, BrokerID: ${user?.brokerId}`);
        }

        console.log('[GET_LOANS] Executing Query:', JSON.stringify(whereClause));

        const loans = await prisma.loanApplication.findMany({
            where: whereClause,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return loans.map((loan: any) => ({
            ...loan,
            data: JSON.parse(loan.data),
            borrowerName: loan.user.name,
            borrowerEmail: loan.user.email
        }));
    } catch (error) {
        console.error("Get loans error:", error);
        return [];
    }
}

