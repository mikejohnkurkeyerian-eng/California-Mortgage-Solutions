import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isBorrowerRoute = nextUrl.pathname.startsWith('/borrower');

  // Check for invite param or existing access cookie
  const inviteCode = nextUrl.searchParams.get('invite') || nextUrl.searchParams.get('ref');
  const hasAccessCookie = req.cookies.get('borrower_access');

  // 1. Handle New Invites: If "invite" param is present, authorize the user (set cookie)
  if (inviteCode) {
    const response = NextResponse.next();
    // Set a long-lived cookie to remember this browser has access
    response.cookies.set('borrower_access', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  // 2. Protect Borrower Routes
  if (isBorrowerRoute) {
    // If authenticated (as borrower), allow always
    if (isLoggedIn) {
      return NextResponse.next();
    }

    // If unauthenticated, REQUIRE the access cookie
    if (!hasAccessCookie) {
      // Redirect to Landing Page (Broker Sign Up) if trying to access Borrower side without invite
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
