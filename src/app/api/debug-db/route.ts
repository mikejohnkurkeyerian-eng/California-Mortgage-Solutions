import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email param required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // PATCH: Add phone column if missing (Safety Net)
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;`);
        } catch (e) {
            // Ignore if fails, likely exists or permissions
            console.error("Auto-patch failed", e);
        }

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
