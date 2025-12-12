'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function getBorrowerProfile() {
    const session = await auth();
    console.log("getBorrowerProfile Session check:", session?.user?.email ? "Email Found" : "No Email");

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
        console.log("getBorrowerProfile DB Result:", user ? "User Found" : "User Not Found");
        return user;
    } catch (error) {
        console.error("Failed to fetch borrower profile:", error);
        return null;
    }
}
