import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. List all tables
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `;

        // 2. List columns for User table (trying both cases)
        const columnsUser = await prisma.$queryRaw`
            SELECT table_name, column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `;

        const columnsLower = await prisma.$queryRaw`
            SELECT table_name, column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'user';
        `;

        return NextResponse.json({
            status: 'Diagnostic',
            timestamp: new Date().toISOString(),
            tables,
            columns_Quoted_User: columnsUser,
            columns_lowercase_user: columnsLower,
            env_db_url_exists: !!process.env.DATABASE_URL
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            status: 'Error',
            error: error.message
        }, { status: 500 });
    }
}
