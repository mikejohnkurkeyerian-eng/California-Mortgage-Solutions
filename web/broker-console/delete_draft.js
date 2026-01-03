const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const draftLoanId = "71cf6fb4-1fda-4fad-bc90-c8fef6c1119b";
    console.log(`Deleting stuck draft loan: ${draftLoanId}`);

    const deleted = await prisma.loanApplication.delete({
        where: { id: draftLoanId }
    });

    console.log(`Deleted loan ${deleted.id}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
