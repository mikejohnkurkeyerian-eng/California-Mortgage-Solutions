import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password'); // Optional for security reasons

        if (!email) {
            return NextResponse.json({ error: "Missing email param" }, { status: 400 });
        }

        console.log("Testing Auth for:", email);

        // 1. Test Prisma findUnique
        const startTime = Date.now();
        const user = await prisma.user.findUnique({
            where: { email }
        });
        const dbTime = Date.now() - startTime;
        console.log(`DB Fetch took ${dbTime}ms`);

        if (!user) {
            return NextResponse.json({ status: "User Not Found", dbTime });
        }

        // 2. Test Bcrypt (Only if provided)
        let cryptTime = 0;
        let isValid = null;
        if (password) {
            const cryptStart = Date.now();
            isValid = await bcrypt.compare(password, user.password || '');
            cryptTime = Date.now() - cryptStart;
            console.log(`Bcrypt took ${cryptTime}ms`);
        }

        return NextResponse.json({
            status: "Success",
            dbTime,
            cryptTime: password ? cryptTime : "Skipped",
            isValid,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                phone: (user as any).phone
            }
        });

    } catch (error: any) {
        return NextResponse.json({ status: "Error", error: error.message, stack: error.stack }, { status: 500 });
    }
}
