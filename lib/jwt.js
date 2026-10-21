import { SignJWT, jwtVerify } from 'jose';

// Kept free of next/headers so the proxy can use it too.

export const SESSION_COOKIE = 'session';

function key() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error('SESSION_SECRET is not set. See .env.example.');
    return new TextEncoder().encode(secret);
}

export function sign(user, expiresAt, remember) {
    return new SignJWT({ name: user.name, email: user.email, remember })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(key());
}

/**
 * The signed-in user for a valid token, otherwise null.
 * @returns {Promise<import('./types').SessionUser | null>}
 */
export async function verify(token) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
        return { id: Number(payload.sub), name: String(payload.name), email: String(payload.email), remember: !!payload.remember };
    } catch {
        return null;
    }
}
