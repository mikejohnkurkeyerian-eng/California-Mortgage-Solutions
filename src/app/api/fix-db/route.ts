import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const logs: string[] = [];
    const log = (msg: string) => logs.push(`${new Date().toISOString()}: ${msg}`);

    try {
        log("🚀 Starting Schema Restoration...");

        // 1. Create LoanApplication Table
        log("Checking/Creating 'LoanApplication' table...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "LoanApplication" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "brokerId" TEXT,
                "status" TEXT NOT NULL DEFAULT 'Draft',
                "stage" TEXT NOT NULL DEFAULT 'Application Review',
                "data" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
            );
        `);
        log("✅ 'LoanApplication' table ensures exists.");

        // 2. Create Document Table
        log("Checking/Creating 'Document' table...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Document" (
                "id" TEXT NOT NULL,
                "loanId" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "status" TEXT NOT NULL,
                "url" TEXT,
                "analyzedData" JSONB,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
            );
        `);
        log("✅ 'Document' table ensures exists.");

        // 3. Create Submission Table
        log("Checking/Creating 'Submission' table...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Submission" (
                "id" TEXT NOT NULL,
                "loanId" TEXT NOT NULL,
                "lenderId" TEXT NOT NULL,
                "lenderName" TEXT NOT NULL,
                "status" TEXT NOT NULL,
                "portalUrl" TEXT,
                "externalId" TEXT,
                "notes" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                "submittedAt" TIMESTAMP(3),
                "snapshot" JSONB,
                "conditions" JSONB,
                CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
            );
        `);
        log("✅ 'Submission' table ensures exists.");

        return NextResponse.json({
            status: 'Schema Restored',
            logs
        });

    } catch (error: any) {
        log(`❌ ERROR: ${error.message}`);
        return NextResponse.json({
            status: 'Crash',
            logs,
            error: error.message
        }, { status: 500 });
    }
}
