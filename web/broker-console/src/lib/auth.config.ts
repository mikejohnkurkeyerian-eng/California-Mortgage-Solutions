import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/borrower/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnBrokerLine = nextUrl.pathname.startsWith('/broker');
            const isOnBorrowerLine = nextUrl.pathname.startsWith('/borrower');

            const isAuthPage = nextUrl.pathname.includes('/login') || nextUrl.pathname.includes('/signup') || nextUrl.pathname.includes('/register');
            const isStartPage = nextUrl.pathname === '/borrower/start' || nextUrl.pathname === '/broker/start';
            const isPublicPage = nextUrl.pathname === '/' || nextUrl.pathname === '/about';

            // 1. Handle Unauthenticated Users
            if (!isLoggedIn) {
                // Protect private routes
                if ((isOnBrokerLine || isOnBorrowerLine) && !isAuthPage && !isStartPage) {
                    // Redirect to appropriate login based on attempted path
                    if (isOnBrokerLine) return false; // Triggers redirects to broker login via pages config? No, default is borrower login. 
                    // We need strict redirect for broker login if hitting broker protected route
                    if (isOnBrokerLine) return Response.redirect(new URL('/broker/login', nextUrl));
                    return false; // Redirects to default signIn page (/borrower/login)
                }
                return true;
            }

            // 2. Handle Authenticated Users
            if (isLoggedIn) {
                const userRole = (auth?.user as any)?.role;

                // Prevent Access to Auth Pages if already logged in
                if (isAuthPage || isStartPage) {
                    if (userRole === 'BROKER') {
                        return Response.redirect(new URL('/broker/dashboard', nextUrl));
                    } else {
                        return Response.redirect(new URL('/borrower/dashboard', nextUrl));
                    }
                }

                // Enforce Role Separation
                if (isOnBrokerLine) {
                    if (userRole !== 'BROKER') {
                        // Borrower trying to access Broker pages -> Bounce to Borrower Dashboard
                        return Response.redirect(new URL('/borrower/dashboard', nextUrl));
                    }
                } else if (isOnBorrowerLine) {
                    if (userRole === 'BROKER') {
                        // Broker trying to access Borrower pages -> Bounce to Broker Dashboard
                        return Response.redirect(new URL('/broker/dashboard', nextUrl));
                    }
                }
            }

            return true;
        },
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
            if (session.user) {
                (session.user as any).firstName = token.firstName as string;
                (session.user as any).lastName = token.lastName as string;
                (session.user as any).middleName = token.middleName as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.brokerId = (user as any).brokerId;
                token.firstName = (user as any).firstName;
                token.lastName = (user as any).lastName;
                token.middleName = (user as any).middleName;
            }
            return token;
        }
    },
    providers: [], // Providers added in auth.ts (Node only)
    secret: 'temp-secret-key-for-dev', // Ensure Middleware can decode the token
} satisfies NextAuthConfig;
