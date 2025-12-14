import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/borrower/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/borrower') || nextUrl.pathname.startsWith('/broker');
            const isAuthPage = nextUrl.pathname.includes('/login') || nextUrl.pathname.includes('/signup');
            const isStartPage = nextUrl.pathname === '/borrower/start' || nextUrl.pathname === '/broker/start';

            // Allow start pages and auth pages
            if (isStartPage || isAuthPage) {
                if (isLoggedIn) {
                    // Redirect logged-in users to their respective dashboards
                    if (nextUrl.pathname.startsWith('/broker')) {
                        return Response.redirect(new URL('/broker/dashboard', nextUrl));
                    }
                    return Response.redirect(new URL('/borrower/dashboard', nextUrl));
                }
                return true;
            }

            // Protect Dashboard
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
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
} satisfies NextAuthConfig;
