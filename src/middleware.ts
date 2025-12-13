import NextAuth from "next-auth"
import { auth } from "@/lib/auth"

export default auth((req) => {
    // TEMPORARY DEBUG: BYPASS ALL MIDDLEWARE
    // Check if this restores API access
    return null;

    /*
    const isLoggedIn = !!req.auth
    const path = req.nextUrl.pathname
    ... (rest of logic commented out)
    */
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

