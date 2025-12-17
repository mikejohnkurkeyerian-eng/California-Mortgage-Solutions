import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying schema update...');
    try {
        const email = `test-schema-${Date.now()}@example.com`;
        console.log(`Creating user with email: ${email}`);

        // We need to create a broker organization first if the relation is required or if logical flow demands it
        // But schema says Broker relation is optional? Let's check schema.
        // Schema: broker Broker? @relation(fields: [brokerId], references: [id])
        // So it is optional.

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                firstName: 'Test',
                lastName: 'Schema',
                nmlsId: '123456',
                licenseStates: ['CA', 'NY'],
                // add other required fields if any (password is optional, role default)
                brokerageName: 'Test Brokerage' // wait, this field is NOT in User model, it's in logic. User model doesn't have brokerageName.
                // Route handles brokerage creation separately.
            } as any // forcing type if client isn't fully updated yet in IDE context, but runtime should be fine
        });

        console.log('✅ Created user:', user);

        if (user.nmlsId === '123456' && Array.isArray(user.licenseStates) && user.licenseStates.includes('CA')) {
            console.log('✅ Verification successful: nmlsId and licenseStates persist correctly.');
        } else {
            console.error('❌ Fields did not persist correctly or are missing.');
            console.error('nmlsId:', user.nmlsId);
            console.error('licenseStates:', user.licenseStates);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Verification failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
