'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function getBorrowerProfile() {
    const session = await auth();

    if (!session?.user?.email) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
                phone: true, // Might as well get phone if we have it
                // Add any other profile fields here
            }
        });

        return user;
    } catch (error) {
        console.error("Failed to fetch borrower profile:", error);
        return null;
    }
}
