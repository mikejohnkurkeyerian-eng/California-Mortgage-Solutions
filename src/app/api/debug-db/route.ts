import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email param required" }, { status: 400 });
        }

        // Schema Diagnostic Mode

        let logs: string[] = [];
        const log = (msg: string) => logs.push(msg);

        try {
            // 1. Check Existing Columns
            log("Step 1: Checking Schema...");
            const columns: any[] = await prisma.$queryRaw`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'User';
            `;
            const columnNames = columns.map((c: any) => c.column_name);
            log(`Found columns: ${columnNames.join(', ')}`);

            const hasPhone = columnNames.includes('phone');

            // 2. Patch if needed
            if (!hasPhone) {
                log("Step 2: 'phone' missing. Attempting ALTER TABLE...");
                try {
                    // Try Quoted "User" (Prisma default)
                    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
                    log("Executed ALTER TABLE \"User\"");
                } catch (e: any) {
                    log(`Error patching "User": ${e.message}`);

                    // Fallback: Try unquoted User (Postgres default lowercase)
                    try {
                        await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN IF NOT EXISTS phone TEXT;`);
                        log("Executed ALTER TABLE User (Fallback)");
                    } catch (e2: any) {
                        log(`Error patching User (Fallback): ${e2.message}`);
                    }
                }
            } else {
                log("Step 2: 'phone' already exists. No patch needed.");
            }

            // 3. Verify Result
            log("Step 3: Re-checking Schema...");
            const finalColumns = await prisma.$queryRaw`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'User';
            `;
            const finalNames = (finalColumns as any[]).map(c => c.column_name);
            log(`Final columns: ${finalNames.join(', ')}`);

            // 4. Try Query (Only if patch looked successful)
            let userData = null;
            if (finalNames.includes('phone')) {
                log("Step 4: Querying User Data...");
                userData = await prisma.user.findUnique({ where: { email } });
            } else {
                log("Step 4: Skipping Query (Schema still mismatch)");
            }

            return NextResponse.json({
                status: 'Diagnostic Complete',
                logs,
                user: userData
            });

        } catch (error: any) {
            return NextResponse.json({
                status: 'Error',
                logs,
                fatalError: error.message
            }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({
            status: 'Error',
            error: String(error)
        }, { status: 500 });
    }
}
