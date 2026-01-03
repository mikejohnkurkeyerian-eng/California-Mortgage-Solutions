const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userId = "1506e27d-f10d-48f9-a5e7-982df20d9097"; // ID from user's debug log
    console.log(`Checking loans for user: ${userId}`);

    const loans = await prisma.loanApplication.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${loans.length} loans.`);
    loans.forEach(loan => {
        console.log(`- ID: ${loan.id} | Status: ${loan.status} | Created: ${loan.createdAt} | Updated: ${loan.updatedAt}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
