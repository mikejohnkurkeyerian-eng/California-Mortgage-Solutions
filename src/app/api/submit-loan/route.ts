import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Enable long-running process

export async function POST(request: Request) {
    const messages: string[] = [];
    const log = (m: string) => messages.push(`${new Date().toISOString()}: ${m}`);

    try {
        log("[API] Starting POST /api/submit-loan");

        // 1. Parse Body
        let body;
        try {
            body = await request.json();
            log("[API] Body parsed. Size: " + JSON.stringify(body).length);
        } catch (e) {
            throw new Error("Invalid JSON body");
        }

        // 2. Auth Check (Soft fail for debug)
        const session = await auth();
        // Fallback for debug if needed
        const userId = session?.user?.id || body.borrowerId || "db49b3b9-60db-482d-8cb6-2b119695da1d";
        log(`[API] User ID resolved: ${userId}`);

        // 3. Prepare Data
        const loanData = {
            userId: userId,
            brokerId: body.brokerId,
            status: 'Draft',
            stage: 'Application Review',
            data: JSON.stringify(body), // Store full payload
        };

        log("[API] Attempting Prisma Create...");
        const loan = await prisma.loanApplication.create({
            data: loanData
        });
        log(`[API] SUCCESS. Loan ID: ${loan.id}`);

        return NextResponse.json({ success: true, loanId: loan.id, logs: messages });

    } catch (error: any) {
        console.error("Submit API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            logs: messages
        }, { status: 500 });
    }
}
