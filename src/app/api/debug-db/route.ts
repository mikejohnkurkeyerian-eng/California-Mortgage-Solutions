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
        if (!email) throw new Error("Email required");

        log(`Finding user ${email}...`);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("User not found");
        log(`Found user: ${user.id}`);

        log("Attempting to create dummy LoanApplication...");
        const loan = await prisma.loanApplication.create({
            data: {
                userId: user.id,
                status: 'Debug',
                stage: 'Test',
                data: JSON.stringify({ test: true, timestamp: new Date().toISOString() })
            }
        });
        log(`Loan created successfully! ID: ${loan.id}`);

        // Clean up
        log("Deleting dummy loan...");
        await prisma.loanApplication.delete({ where: { id: loan.id } });
        log("Dummy loan deleted.");

        return NextResponse.json({ success: true, logs });
    } catch (e: any) {
        log(`ERROR: ${e.message}`);
        return NextResponse.json({ success: false, logs, error: e.message, stack: e.stack }, { status: 500 });
    }
}
