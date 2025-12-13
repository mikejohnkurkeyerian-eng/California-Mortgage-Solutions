import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: "pong",
        timestamp: new Date().toISOString(),
        version: "v4-NO-MIDDLEWARE-DEBUG-MODE"
    });
}
