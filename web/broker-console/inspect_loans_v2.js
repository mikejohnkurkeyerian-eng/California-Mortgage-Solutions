const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userId = "e05fc54f-9de2-46ac-8feb-9910f826b074"; // New User ID
    console.log(`Checking loans for user: ${userId}`);

    const loans = await prisma.loanApplication.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${loans.length} loans.`);
    loans.forEach(loan => {
        console.log(`- ID: ${loan.id} | Status: ${loan.status} | Created: ${loan.createdAt} | Updated: ${loan.updatedAt}`);
        const dataSize = loan.data ? loan.data.length : 0;
        console.log(`  Data Size: ${dataSize} bytes`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
