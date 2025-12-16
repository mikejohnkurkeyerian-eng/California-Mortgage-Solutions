
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, password, brokerageName, nmlsId, licenseStates } = body;

        // 1. Basic Validation
        if (!email || !password || !firstName || !lastName || !brokerageName || !nmlsId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Check overlap
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
        }

        // 3. Create Broker Entity (Optional, if mapping user directly to broker entity)
        // For now, consistent with schema, we might create a Broker entity first or just user with 'BROKER' role?
        // Schema shows User has nullable 'brokerId' linking to 'Broker' model.
        // Let's create the Broker organization first.
        const newBroker = await prisma.broker.create({
            data: {
                name: brokerageName,
            }
        });

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                role: 'BROKER',
                brokerId: newBroker.id,
                // Store NMLS and License info in separate metadata if needed, 
                // but schema doesn't have specific fields for it on User. 
                // For MVP, we assume verified and created.
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error: any) {
        console.error('Broker Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
