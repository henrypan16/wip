'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { deleteUser, findUserByEmail, findUserById, updateUser, updateUserPassword } from '@/lib/data/users';
import { createSession, deleteSession, requireUser } from '@/lib/session';
import { collect, email, first, maxLength, required, text } from '@/lib/validation';

export async function updateProfile({ name, email: address }) {
    const user = await requireUser();
    name = text(name);
    address = text(address);
    const errors = collect({
        name: first(required(name, 'name'), maxLength(name, 255, 'name')),
        email: first(required(address, 'email'), email(address), maxLength(address, 255, 'email')),
    });
    if (errors) return { errors };

    const existing = await findUserByEmail(address);
    if (existing && existing.id !== user.id) return { errors: { email: 'The email has already been taken.' } };

    await updateUser(user.id, { name, email: address });
    // The name and email shown in the navbar come from the session token.
    await createSession({ id: user.id, name, email: address }, user.remember);
    return { saved: true };
}

export async function updatePassword({ current_password, password, password_confirmation }) {
    const user = await requireUser();
    const errors = collect({
        current_password: required(current_password, 'current password'),
        password: first(
            required(password, 'password'),
            password?.length < 8 && 'The password must be at least 8 characters.',
            password !== password_confirmation && 'The password confirmation does not match.',
        ),
    });
    if (errors) return { errors };

    const record = await findUserById(user.id);
    if (!record || !(await bcrypt.compare(current_password, record.password))) {
        return { errors: { current_password: 'The password is incorrect.' } };
    }

    await updateUserPassword(user.id, await bcrypt.hash(password, 12));
    return { saved: true };
}

export async function deleteAccount({ password }) {
    const user = await requireUser();
    const record = await findUserById(user.id);
    if (!password || !record || !(await bcrypt.compare(password, record.password))) {
        return { errors: { password: 'The password is incorrect.' } };
    }

    await deleteUser(user.id);
    await deleteSession();
    redirect('/login');
}
