'use server';

import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { findUserByEmail } from '@/lib/data/users';
import { createSession, deleteSession } from '@/lib/session';
import { collect, email, first, required, text } from '@/lib/validation';

// Throttle failed logins per email + IP: 5 attempts, then wait a minute.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;
const failedLogins = new Map();

async function throttleKey(address) {
    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';
    return `${address.toLowerCase()}|${ip}`;
}

function lockedFor(key) {
    const entry = failedLogins.get(key);
    if (!entry || entry.count < MAX_ATTEMPTS) return 0;
    const remaining = entry.lockedAt + LOCKOUT_MS - Date.now();
    if (remaining <= 0) {
        failedLogins.delete(key);
        return 0;
    }
    return Math.ceil(remaining / 1000);
}

function recordFailure(key) {
    const entry = failedLogins.get(key) ?? { count: 0 };
    entry.count += 1;
    if (entry.count >= MAX_ATTEMPTS) entry.lockedAt = Date.now();
    failedLogins.set(key, entry);
}

export async function login({ email: address, password, remember }) {
    address = text(address);
    const errors = collect({
        email: first(required(address, 'email'), email(address)),
        password: required(password, 'password'),
    });
    if (errors) return { errors };

    const key = await throttleKey(address);
    const wait = lockedFor(key);
    if (wait) return { errors: { email: `Too many login attempts. Please try again in ${wait} seconds.` } };

    const user = await findUserByEmail(address);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        recordFailure(key);
        return { errors: { email: 'These credentials do not match our records.' } };
    }

    failedLogins.delete(key);
    await createSession(user, !!remember);
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
