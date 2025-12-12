import NextAuth from "next-auth"
import { auth } from "@/lib/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const path = req.nextUrl.pathname

    // Define paths
    const isStartPage = path === '/borrower/start' || path === '/broker/start'
    const isAuthPage = path.includes('/login') || path.includes('/signup') || path.includes('/register')

    // Check if user is in a protected area (Dashboard)
    // Exclude start pages and auth pages from "Dashboard" protection
    const isOnDashboard = (path.startsWith('/borrower') || path.startsWith('/broker'))
        && !isStartPage
        && !isAuthPage

    // 1. Handle Start Pages (Public, but redirect if logged in)
    if (isStartPage) {
        if (isLoggedIn) {
            if (path.startsWith('/broker')) {
                return Response.redirect(new URL('/broker/dashboard', req.nextUrl))
            }
            return Response.redirect(new URL('/borrower/dashboard', req.nextUrl))
        }
        return null
    }

    // 2. Handle Auth Pages (Public, but redirect if logged in)
    if (isAuthPage) {
        if (isLoggedIn) {
            // Intelligent redirect based on role/path could go here, 
            // but for now default to borrower dashboard or generic
            if (path.startsWith('/broker')) {
                return Response.redirect(new URL('/broker/dashboard', req.nextUrl))
            }
            return Response.redirect(new URL('/borrower/dashboard', req.nextUrl))
        }
        return null
    }

    // 3. Handle Protected Dashboard Pages
    if (isOnDashboard) {
        if (isLoggedIn) return null

        // If trying to access apply page without auth, redirect to login page with callback
        if (path === '/borrower/apply') {
            const callbackUrl = encodeURIComponent(path);
            return Response.redirect(new URL(`/borrower/login?callbackUrl=${callbackUrl}`, req.nextUrl))
        }

        // If trying to access broker pages without auth, redirect to broker start page
        if (path.startsWith('/broker')) {
            return Response.redirect(new URL('/broker/start', req.nextUrl))
        }

        // Default redirect for borrower pages
        return Response.redirect(new URL('/borrower/login', req.nextUrl))
    }

    return null
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

