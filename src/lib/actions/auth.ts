'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const RegisterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['BORROWER', 'BROKER']),
    brokerName: z.string().optional(),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { name, email, password, role, brokerName } = validatedFields.data;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let brokerId = null;

        // If Broker, create the Broker entity first
        if (role === 'BROKER' && brokerName) {
            const broker = await prisma.broker.create({
                data: {
                    name: brokerName,
                }
            });
            brokerId = broker.id;
        }

        // Create User
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                brokerId,
            },
        });

        return { success: "User created!" };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: `Failed: ${(error as Error).message}` };
    }
}
