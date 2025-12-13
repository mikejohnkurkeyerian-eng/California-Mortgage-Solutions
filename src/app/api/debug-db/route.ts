import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email param required" }, { status: 400 });
        }

        // PATCH: Add phone column if missing (Safety Net)
        // MUST RUN BEFORE QUERY because Prisma Client now expects 'phone' to exist
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
        } catch (e) {
            console.error("Auto-patch failed", e);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        return NextResponse.json({
            status: 'Success',
            searchedEmail: email,
            user: user || "NOT FOUND"
        });

    } catch (error) {
        return NextResponse.json({
            status: 'Error',
            error: String(error)
        }, { status: 500 });
    }
}
