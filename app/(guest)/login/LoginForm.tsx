'use client';

import Link from 'next/link';
import { type FormEvent, useState, useTransition } from 'react';
import { login } from '@/actions/auth';
import { Checkbox, InputError, InputLabel, linkClass, PrimaryButton, TextInput } from '@/components/Auth';
import type { ActionResult, FormErrors } from '@/lib/types';

export default function LoginForm() {
    const [data, setFormData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, startTransition] = useTransition();
    const setData = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => setFormData((d) => ({ ...d, [key]: value }));

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const result: ActionResult | undefined = await login(data);
            setErrors(result?.errors ?? {});
            setData('password', '');
        });
    }

    return (
        <form onSubmit={submit}>
            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput id="email" type="email" name="email" value={data.email} className="mt-1 block w-full"
                    autoComplete="username" autoFocus onChange={(e) => setData('email', e.target.value)} />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" />
                <TextInput id="password" type="password" name="password" value={data.password} className="mt-1 block w-full"
                    autoComplete="current-password" onChange={(e) => setData('password', e.target.value)} />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="block mt-4">
                <label className="flex items-center">
                    <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link href="/register" className={linkClass}>Need an account?</Link>
                <PrimaryButton className="ml-4" disabled={processing}>Log in</PrimaryButton>
            </div>
        </form>
    );
}
