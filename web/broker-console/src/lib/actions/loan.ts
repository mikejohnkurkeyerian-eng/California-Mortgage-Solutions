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

        // RELIABILITY FIX: Fetch user from DB to ensure we get the persisted brokerId
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { brokerId: true }
        });

        console.log('[CREATE_LOAN] Session Data:', {
            role: user.role,
            brokerId: user.brokerId,
            dbBrokerId: dbUser?.brokerId,
            providedBrokerId: data.brokerId
        });

        const createData = {
            userId: session.user.id,
            // Use provided brokerId (from invite) OR fallback to DB User (most reliable) OR Session
            brokerId: data.brokerId || dbUser?.brokerId || user.brokerId || undefined,
            status: 'Draft',
            stage: 'Application Review',
            data: JSON.stringify(data),
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

        if (!existingLoan) {
            return { error: "Loan not found" };
        }

        // Check if user is the borrower OR the assigned broker
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true, brokerId: true }
        });

        const isBorrower = existingLoan.userId === session.user.id;
        const isAssignedBroker = user?.role === 'BROKER' && user.brokerId && existingLoan.brokerId === user.brokerId;

        if (!isBorrower && !isAssignedBroker) {
            return { error: "Unauthorized access to this loan" };
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
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return loans.map((loan: any) => {
            let parsedData: any = {};
            try {
                parsedData = loan.data ? JSON.parse(loan.data) : {};
            } catch (e) {
                console.error(`[GET_LOANS] JSON Parse Error for loan ${loan.id}:`, e);
                // Fallback to empty object so we still return the loan
                parsedData = {};
            }

            // Ensure borrower object exists with fallbacks
            const borrower = parsedData.borrower || {};
            if (!borrower.firstName) borrower.firstName = loan.user.firstName || loan.user.name.split(' ')[0];
            if (!borrower.lastName) borrower.lastName = loan.user.lastName || loan.user.name.split(' ').slice(1).join(' ');
            if (!borrower.email) borrower.email = loan.user.email;

            return {
                ...loan,
                ...parsedData, // Flatten data to top level
                data: parsedData,
                borrower, // Explicitly set robust borrower object
                borrowerName: loan.user.name,
                borrowerEmail: loan.user.email
            };
        });
    } catch (error) {
        console.error("Get loans error:", error);
        return [];
    }
}


export async function getDebugLoans() {
    const session = await auth();
    if (!session?.user) return [];

    // Only allow Brokers to see this debug info
    if ((session.user as any).role !== 'BROKER') return [];

    try {
        const loans = await prisma.loanApplication.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                brokerId: true,
                userId: true,
                status: true,
                createdAt: true,
                user: {
                    select: { email: true }
                }
            }
        });
        return loans;
    } catch (error) {
        console.error("Debug Loans Error:", error);
        return [];
    }
}
