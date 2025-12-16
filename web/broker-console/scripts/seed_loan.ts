import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'user_seed@test.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name: 'Seed User',
            role: 'BORROWER'
        }
    });

    console.log(`User created: ${user.id}`);

    // Create Loan
    const loan = await prisma.loanApplication.create({
        data: {
            userId: user.id,
            status: 'Draft',
            stage: 'Application Review',
            data: JSON.stringify({
                borrower: {
                    firstName: 'Seed',
                    lastName: 'User',
                    email: email
                },
                property: {
                    address: {
                        street: '123 Test St',
                        city: 'Test City',
                        state: 'CA',
                        zipCode: '90210'
                    },
                    loanAmount: 500000
                },
                employment: {
                    status: 'Employed',
                    monthlyIncome: 10000
                }
            })
        }
    });

    console.log(`Loan created: ${loan.id}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
