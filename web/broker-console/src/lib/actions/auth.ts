'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const RegisterSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['BORROWER', 'BROKER']),
    brokerName: z.string().optional(),
    brokerId: z.string().optional(),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { firstName, lastName, middleName, email, password, role, brokerName, brokerId: providedBrokerId } = validatedFields.data;
    const normalizedEmail = email.toLowerCase();
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let brokerId = providedBrokerId || null;

        // Verify Broker exists if ID is provided
        if (brokerId) {
            const brokerExists = await prisma.broker.findUnique({
                where: { id: brokerId }
            });
            if (!brokerExists) {
                console.warn(`Invalid brokerId provided during registration: ${brokerId}. Ignoring.`);
                brokerId = null;
            }
        }

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
                firstName,
                lastName,
                middleName,
                name: fullName,
                email: normalizedEmail,
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


export async function linkBorrowerToBroker(brokerId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        console.log(`[LINK_USER] Attempting to link User ${session.user.id} to Broker ${brokerId}`);

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { brokerId: true }
        });

        if (user?.brokerId) {
            console.log(`[LINK_USER] User already linked to ${user.brokerId}. Skipping overwrite.`);
            return { success: false, message: "Already linked" };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { brokerId }
        });

        console.log(`[LINK_USER] Success.`);
        return { success: true };
    } catch (error) {
        console.error("Link user error:", error);
        return { error: "Failed to link user" };
    }
}
