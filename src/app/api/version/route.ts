import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BUILD_TIMESTAMP = new Date().toISOString();

export async function GET() {
    return NextResponse.json({
        status: 'Online',
        buildTime: new Date().toISOString(),
        version: 'vDebug-MinimalPayload'
    });
}
