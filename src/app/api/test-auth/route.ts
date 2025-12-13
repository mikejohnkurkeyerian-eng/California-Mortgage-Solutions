import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing email/password" }, { status: 400 });
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

        // 2. Test Bcrypt
        const cryptStart = Date.now();
        const isValid = await bcrypt.compare(password, user.password || '');
        const cryptTime = Date.now() - cryptStart;
        console.log(`Bcrypt took ${cryptTime}ms`);

        return NextResponse.json({
            status: "Success",
            isValid,
            dbTime,
            cryptTime,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                phone: (user as any).phone // Verify phone is accessible via Client
            }
        });

    } catch (error: any) {
        return NextResponse.json({ status: "Error", error: error.message, stack: error.stack }, { status: 500 });
    }
}
