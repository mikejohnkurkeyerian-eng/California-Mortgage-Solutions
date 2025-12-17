const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying schema update...');
    try {
        const email = `test-schema-${Date.now()}@example.com`;
        console.log(`Creating user with email: ${email}`);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                firstName: 'Test',
                lastName: 'Schema',
                nmlsId: '123456',
                licenseStates: ['CA', 'NY'],
            }
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
