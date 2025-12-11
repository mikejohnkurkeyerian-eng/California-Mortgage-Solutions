'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createLoan(data: any) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const createData = {
            userId: session.user.id,
            // Use provided brokerId (from invite) OR fallback to session (if user is broker)
            brokerId: data.brokerId || (session.user as any).brokerId || undefined,
            status: 'Draft',
            stage: 'Application Review',
            data: JSON.stringify(data),
        };
        console.log('DEBUG: Creating loan with data:', createData);

        const loan = await prisma.loanApplication.create({
            data: createData
        });

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
        }

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

