// import { auth } from "@/lib/auth"

// export default auth((req) => {
//    // TEMPORARY DEBUG: BYPASS ALL MIDDLEWARE
//    return null;
// })

// Minimal middleware to keep Next.js happy without importing Auth
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
