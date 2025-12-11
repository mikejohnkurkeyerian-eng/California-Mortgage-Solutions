import NextAuth from "next-auth"
import { auth } from "@/lib/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/borrower') || req.nextUrl.pathname.startsWith('/broker')
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')
    const isStartPage = req.nextUrl.pathname === '/borrower/start' || req.nextUrl.pathname === '/broker/start'

    // Allow public access to start pages
    if (isStartPage) {
        if (isLoggedIn) {
            if (req.nextUrl.pathname === '/broker/start') {
                return Response.redirect(new URL('/broker/dashboard', req.nextUrl))
            }
            return Response.redirect(new URL('/borrower/dashboard', req.nextUrl))
        }
        return null
    }

    if (isOnDashboard) {
        if (isLoggedIn) return null

        // If trying to access apply page without auth, redirect to login page
        if (req.nextUrl.pathname === '/borrower/apply') {
            const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
            return Response.redirect(new URL(`/borrower/login?callbackUrl=${callbackUrl}`, req.nextUrl))
        }

        // If trying to access broker pages without auth, redirect to broker start page
        if (req.nextUrl.pathname.startsWith('/broker')) {
            return Response.redirect(new URL('/broker/start', req.nextUrl))
        }

        return Response.redirect(new URL('/login', req.nextUrl))
    }

    if (isAuthPage) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/borrower/dashboard', req.nextUrl))
        }
        return null
    }

    return null
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

