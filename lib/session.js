import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, sign, verify } from './jwt';

const DAY = 24 * 60 * 60 * 1000;

/**
 * Sign the user in. Without "remember me" the cookie ends with the browser
 * session (and the token itself after 12 hours); with it, it lasts 30 days.
 */
export async function createSession(user, remember = false) {
    const lifetime = remember ? 30 * DAY : DAY / 2;
    const expires = new Date(Date.now() + lifetime);
    const token = await sign(user, expires, remember);
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.SESSION_COOKIE_SECURE === 'true',
        path: '/',
        ...(remember ? { expires } : {}),
    });
}

export async function deleteSession() {
    (await cookies()).delete(SESSION_COOKIE);
}

export async function getUser() {
    return verify((await cookies()).get(SESSION_COOKIE)?.value);
}

/** The signed-in user; redirects to the login page when there is none. */
export async function requireUser() {
    const user = await getUser();
    if (!user) redirect('/login');
    return user;
}
