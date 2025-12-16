import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const logs: string[] = [];
    const log = (m: string) => logs.push(`${new Date().toISOString()}: ${m}`);

    try {
        if (!email) throw new Error("Email required. Usage: ?email=...");

        log(`[PROBE] Finding user ${email}...`);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User not found");
        log(`[PROBE] Found user: ${user.id}`);

        log("[PROBE] Creating dummy LoanApplication...");
        const loan = await prisma.loanApplication.create({
            data: {
                userId: user.id,
                status: 'Probe',
                stage: 'Test',
                data: JSON.stringify({ description: "Probe Loan", time: Date.now() })
            }
        });
        log(`[PROBE] SUCCESS! Loan ID: ${loan.id}`);

        log("[PROBE] Cleaning up...");
        await prisma.loanApplication.delete({ where: { id: loan.id } });
        log("[PROBE] Deleted.");

        return NextResponse.json({ success: true, logs });
    } catch (e: any) {
        log(`[PROBE] ERROR: ${e.message}`);
        return NextResponse.json({ success: false, logs, error: e.message }, { status: 500 });
    }
}
