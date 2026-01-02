import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from '@/lib/db';
import { authConfig } from "./auth.config"

async function getUser(email: string) {
    try {
        console.log('🔍 Auth Lookup for:', email);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log('✅ Found User:', user ? 'Yes' : 'No');
        return user;
    } catch (error) {
        console.error('❌ Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: 'temp-secret-key-for-dev',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                twoFactorCode: { label: "2FA Code", type: "text" },
                requiredRole: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                        twoFactorCode: z.string().optional()
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password, twoFactorCode } = parsedCredentials.data;
                    const normalizedEmail = email.toLowerCase();
                    const user = await getUser(normalizedEmail);
                    if (!user) {
                        console.warn(`❌ Auth Failed: User not found for email ${normalizedEmail}`);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password || '');
                    if (!passwordsMatch) {
                        console.warn(`❌ Auth Failed: Password mismatch for user ${normalizedEmail}`);
                        return null;
                    }

                    // Strict Role Check
                    if (credentials.requiredRole) {
                        // Allow "Broker" to also access if they are "LoanOfficer" or "Admin" if needed, 
                        // but for now strict equality or mapping.
                        const reqRole = credentials.requiredRole as string;

                        // Map 'Broker' requirement to allowed roles (Handle both Case variants for robustness)
                        let allowedRoles: string[] = [reqRole];

                        if (reqRole === 'Broker' || reqRole === 'BROKER') {
                            allowedRoles = ['Broker', 'BROKER', 'LoanOfficer', 'LOAN_OFFICER', 'Admin', 'ADMIN'];
                        } else if (reqRole === 'Borrower' || reqRole === 'BORROWER') {
                            allowedRoles = ['Borrower', 'BORROWER'];
                        }

                        if (!allowedRoles.includes(user.role)) {
                            console.warn(`❌ Auth Failed: Role Mismatch. Required: ${reqRole}, Found: ${user.role}`);
                            // We return null to fail generic "Invalid credentials" 
                            // OR we could throw specific error if NextAuth allows passing it to client
                            return null;
                        }
                    }

                    if (user.twoFactorEnabled) {
                        if (!twoFactorCode) {
                            console.warn(`❌ Auth Failed: 2FA validation required for ${normalizedEmail}`);
                            throw new Error("2FA_REQUIRED");
                        }
                        const { authenticator } = await import('otplib');
                        const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret || '');
                        if (!isValid) {
                            console.warn(`❌ Auth Failed: Invalid 2FA code for ${normalizedEmail}`);
                            throw new Error("INVALID_2FA_CODE");
                        }
                    }

                    console.log(`✅ Auth Success: User ${normalizedEmail} logged in.`);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        middleName: user.middleName,
                        role: user.role,
                        image: user.image,
                        brokerId: user.brokerId
                    };
                }
                console.warn('❌ Auth Failed: Invalid credential format');
                return null;
            },
        }),
    ],
});
