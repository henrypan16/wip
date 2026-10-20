import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verify } from '@/lib/jwt';

// Pages only guests should see; everything else requires a signed-in user.
const GUEST_ONLY = ['/login', '/register'];

export async function proxy(request) {
    const user = await verify(request.cookies.get(SESSION_COOKIE)?.value);
    const guestOnly = GUEST_ONLY.includes(request.nextUrl.pathname);

    if (!user && !guestOnly) return NextResponse.redirect(new URL('/login', request.url));
    if (user && guestOnly) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
