import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export default NextAuth(authConfig).auth
// Logic moved to auth.config.ts callbacks.authorized
// This ensures middleware is Edge Safe (no Prisma imports)

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
