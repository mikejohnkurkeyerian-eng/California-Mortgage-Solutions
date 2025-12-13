import NextAuth from "next-auth"
import { auth } from "@/lib/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const path = req.nextUrl.pathname

    // Define paths
    const isStartPage = path === '/borrower/start' || path === '/broker/start'
    const isAuthPage = path.includes('/login') || path.includes('/signup') || path.includes('/register')
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
