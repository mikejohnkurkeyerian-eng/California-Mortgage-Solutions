import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 1. Check Env Vars
        const directUrl = process.env.DIRECT_URL;
        const dbUrl = process.env.DATABASE_URL;

        const envStatus = {
            hasDatabaseUrl: !!dbUrl,
            hasDirectUrl: !!directUrl,
            // Check if they look correct (simple heuristic)
            isDirectUnpooled: directUrl?.includes('pooler') === false,
        };

        // 2. Attempt to force-create the User table (simplified version of schema)
        // This is a desperate fallback since CLI isn't working
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "password" TEXT,
                "role" TEXT NOT NULL DEFAULT 'borrower',
                "brokerId" TEXT,
                "image" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                "emailVerified" TIMESTAMP(3),
                "twoFactorSecret" TEXT,
                "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,

                CONSTRAINT "User_pkey" PRIMARY KEY ("id")
            );
        `);

        // Create unique index on email
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
        `);

        // Create Account table (for Google Auth)
        await prisma.$executeRawUnsafe(`
             CREATE TABLE IF NOT EXISTS "Account" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "provider" TEXT NOT NULL,
                "providerAccountId" TEXT NOT NULL,
                "refresh_token" TEXT,
                "access_token" TEXT,
                "expires_at" INTEGER,
                "token_type" TEXT,
                "scope" TEXT,
                "id_token" TEXT,
                "session_state" TEXT,

                CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
            );
        `);

        return NextResponse.json({
            status: 'Success',
            message: 'Attempted to create tables via Raw SQL.',
            env: envStatus
        });

    } catch (error) {
        return NextResponse.json({
            status: 'Error',
            error: String(error)
        }, { status: 500 });
    }
}
