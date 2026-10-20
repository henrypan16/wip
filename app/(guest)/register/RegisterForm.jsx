'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { register } from '@/actions/auth';
import { InputError, InputLabel, linkClass, PrimaryButton, TextInput } from '@/components/Auth';

export default function RegisterForm() {
    const [data, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [processing, startTransition] = useTransition();
    const setData = (key, value) => setFormData((d) => ({ ...d, [key]: value }));

    function submit(e) {
        e.preventDefault();
        startTransition(async () => {
            const result = await register(data);
            setErrors(result?.errors ?? {});
            setFormData((d) => ({ ...d, password: '', password_confirmation: '' }));
        });
    }

    return (
        <form onSubmit={submit}>
            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput id="name" name="name" value={data.name} className="mt-1 block w-full" autoComplete="name" autoFocus
                    onChange={(e) => setData('name', e.target.value)} required />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput id="email" type="email" name="email" value={data.email} className="mt-1 block w-full" autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)} required />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" />
                <TextInput id="password" type="password" name="password" value={data.password} className="mt-1 block w-full" autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)} required />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                <TextInput id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation}
                    className="mt-1 block w-full" autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} required />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link href="/login" className={linkClass}>Already registered?</Link>
                <PrimaryButton className="ml-4" disabled={processing}>Register</PrimaryButton>
            </div>
        </form>
    );
}
