import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

console.log('🔌 Initializing Prisma Client...');
console.log('   DATABASE_URL present:', !!process.env.DATABASE_URL);

// Fallback to empty string or local default without sensitive info
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mortgage_platform';

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn'],
        datasources: {
            db: {
                url: connectionString,
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
