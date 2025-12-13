import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const logs: string[] = [];
    const log = (msg: string) => logs.push(msg);

    try {
        log("🚀 v2 Fixer Started");

        // 1. Check Schema (Raw SQL)
        const checkSql = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `;
        const columns: any[] = await prisma.$queryRawUnsafe(checkSql);
        const columnNames = columns.map((c: any) => c.column_name);
        log(`📂 Columns found: ${columnNames.join(', ')}`);

        const hasPhone = columnNames.includes('phone');

        // 2. Patch if missing
        if (!hasPhone) {
            log("⚠️ 'phone' column missing. Attempting Patch...");
            try {
                // Attempt 1: Quoted
                await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
                log("✅ Patch 1 (Quoted) Executed");
            } catch (e: any) {
                log(`❌ Patch 1 Failed: ${e.message}`);
                try {
                    // Attempt 2: Unquoted
                    await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN IF NOT EXISTS phone TEXT;`);
                    log("✅ Patch 2 (Unquoted) Executed");
                } catch (e2: any) {
                    log(`❌ Patch 2 Failed: ${e2.message}`);
                }
            }
        } else {
            log("✅ 'phone' column already exists.");
        }

        // 3. Verify Again
        const verifyColumns: any[] = await prisma.$queryRawUnsafe(checkSql);
        const finalNames = verifyColumns.map((c: any) => c.column_name);
        log(`📂 Final Columns: ${finalNames.join(', ')}`);

        // 4. Fetch User (Raw SQL to avoid Prisma Client Validation check)
        // usage of findFirst is safer than findUnique if constraints are messy
        const url = new URL(request.url);
        const email = url.searchParams.get('email');
        let userResult = "No Email Provided";

        if (email) {
            if (finalNames.includes('phone')) {
                // Use Raw Query to fetch user to bypass Prisma Client 'Field does not exist' validation 
                // if the client is still stale.
                const users: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${email}' LIMIT 1;`);
                userResult = users.length > 0 ? users[0] : "User Not Found";
            } else {
                userResult = "Skipped Query (Column Missing)";
            }
        }

        return NextResponse.json({
            status: 'Done',
            logs,
            user: userResult
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'Crash',
            logs,
            error: error.message
        }, { status: 500 });
    }
}
