import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            firstName: string
            lastName: string
            middleName?: string
            role: string
            brokerId?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        firstName: string
        lastName: string
        middleName?: string
        brokerId?: string | null
        twoFactorEnabled?: boolean
        twoFactorSecret?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        firstName?: string
        lastName?: string
        middleName?: string
        brokerId?: string | null
    }
}
