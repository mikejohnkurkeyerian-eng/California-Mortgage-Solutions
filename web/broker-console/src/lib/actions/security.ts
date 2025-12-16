'use server';

import { authenticator } from 'otplib';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Generate a new TOTP secret for the user
 * Returns the secret and the otpauth URL (for QR code)
 */
export async function generateTwoFactorSecret() {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'LoanAuto', secret);

    return { secret, otpauth };
}

/**
 * Verify the token and enable 2FA for the user
 */
export async function enableTwoFactor(token: string, secret: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    // specific options if needed, defaults are usually fine for Google Auth
    const isValid = authenticator.check(token, secret);

    if (!isValid) {
        return { error: "Invalid verification code" };
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorSecret: secret,
            twoFactorEnabled: true,
        }
    });

    revalidatePath('/borrower/settings');
    return { success: true };
}

/**
 * Disable 2FA for the user
 */
export async function disableTwoFactor() {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorSecret: null,
            twoFactorEnabled: false,
        }
    });

    revalidatePath('/borrower/settings');
    return { success: true };
}
