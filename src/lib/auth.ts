import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from '@/lib/db';

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
    secret: 'temp-secret-key-for-dev', // Added for dev environment stability
    pages: {
        signIn: '/borrower/login', // Default to borrower login for now, can be dynamic
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                (session.user as any).role = token.role;
            }
            if (token.brokerId && session.user) {
                (session.user as any).brokerId = token.brokerId;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.brokerId = (user as any).brokerId;
            }
            return token;
        }
    },
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
                twoFactorCode: { label: "2FA Code", type: "text" } // Add 2FA field
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

                    const user = await getUser(email);
                    if (!user) return null;

                    // 1. Check Password
                    const passwordsMatch = await bcrypt.compare(password, user.password || '');
                    if (!passwordsMatch) return null;

                    // 2. Check 2FA
                    if (user.twoFactorEnabled) {
                        // If code is missing, we need to signal the UI to ask for it.
                        // However, Credentials provider 'authorize' returning null just means "failed".
                        // Returning an object means "success".
                        // Standard NextAuth pattern: Throw specific error? 
                        // Or cleaner: Client handles the flow. If Client knows 2FA is on (maybe via a pre-check?), it sends code.
                        // BUT, to keep it secure, we assume client doesn't know until we tell them.

                        // We will allow the frontend to catch a specific Error string if possible, 
                        // OR we assume the frontend sends the code if the first attempt fails with "2FA Required" 
                        // (NextAuth errors are tricky to pass through).

                        // Simpler approach for this environment:
                        // If 2FA enabled AND code is missing -> throw Error("2FA_REQUIRED")
                        // If 2FA enabled AND code present -> verify.

                        if (!twoFactorCode) {
                            throw new Error("2FA_REQUIRED");
                        }

                        // Import dynamically to avoid circular issues if any
                        const { authenticator } = await import('otplib');
                        const isValid = authenticator.check(twoFactorCode, user.twoFactorSecret || '');

                        if (!isValid) {
                            throw new Error("INVALID_2FA_CODE");
                        }
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.image,
                        brokerId: user.brokerId
                    };
                }

                return null;
            },
        }),
    ],
});

