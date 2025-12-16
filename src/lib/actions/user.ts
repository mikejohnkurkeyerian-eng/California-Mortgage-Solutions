'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function getBorrowerProfile() {
    try {
        const session = await auth();
        console.log("getBorrowerProfile Session check:", session?.user?.email ? "Email Found" : "No Email");

        if (!session?.user?.email) {
            return { status: 'error', reason: 'NO_SESSION' };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
                phone: true,
                // Add any other profile fields here
            }
        });
        console.log("getBorrowerProfile DB Result:", user ? "User Found" : "User Not Found");

        if (!user) {
            return { status: 'error', reason: 'USER_NOT_FOUND_IN_DB', email: session.user.email };
        }

        return { status: 'success', data: user };
    } catch (error) {
        console.error("Failed to fetch borrower profile:", error);
        return { status: 'error', reason: 'DB_ERROR', details: String(error) };
    }
}
