import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
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
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // Real DB Logic
                    const user = await getUser(email);
                    if (!user) {
                        console.log('User not found');
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password || '');
                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            image: user.image,
                            brokerId: user.brokerId
                        };
                    } else {
                        console.log('Password mismatch');
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
