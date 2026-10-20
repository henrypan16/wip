'use client';

import { useState, useTransition } from 'react';
import { deleteAccount, updatePassword, updateProfile } from '@/actions/profile';
import { DangerButton, InputError, InputLabel, PrimaryButton, SecondaryButton, TextInput } from '@/components/Auth';
import Modal from '@/components/Modal';

// Runs a server action with the form's data and tracks errors and the "Saved." flash.
function useActionForm(action, initial) {
    const [data, setFormData] = useState(initial);
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);
    const [processing, startTransition] = useTransition();
    const setData = (key, value) => setFormData((d) => ({ ...d, [key]: value }));

    function submit(e, after) {
        e?.preventDefault();
        startTransition(async () => {
            const result = await action(data);
            setErrors(result?.errors ?? {});
            if (result?.saved) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
            after?.(result);
        });
    }

    return { data, setData, setFormData, errors, saved, processing, submit };
}

function Section({ title, description, children }) {
    return (
        <section className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
            <div className="max-w-xl">
                <header>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </header>
                {children}
            </div>
        </section>
    );
}

const Saved = ({ show }) => show && <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>;

function UpdateProfileInformationForm({ user }) {
    const { data, setData, errors, saved, processing, submit } = useActionForm(updateProfile, { name: user.name, email: user.email });

    return (
        <Section title="Profile Information" description="Update your account's profile information and email address.">
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoComplete="name" />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="username" />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Saved show={saved} />
                </div>
            </form>
        </Section>
    );
}

function UpdatePasswordForm() {
    const empty = { current_password: '', password: '', password_confirmation: '' };
    const { data, setData, setFormData, errors, saved, processing, submit } = useActionForm(updatePassword, empty);

    return (
        <Section title="Update Password" description="Ensure your account is using a long, random password to stay secure.">
            <form onSubmit={(e) => submit(e, (result) => result?.saved && setFormData(empty))} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Current Password" />
                    <TextInput id="current_password" type="password" className="mt-1 block w-full" autoComplete="current-password"
                        value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <TextInput id="password" type="password" className="mt-1 block w-full" autoComplete="new-password"
                        value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput id="password_confirmation" type="password" className="mt-1 block w-full" autoComplete="new-password"
                        value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Saved show={saved} />
                </div>
            </form>
        </Section>
    );
}

function DeleteUserForm() {
    const [confirming, setConfirming] = useState(false);
    const { data, setData, errors, processing, submit } = useActionForm(deleteAccount, { password: '' });
    const close = () => {
        setConfirming(false);
        setData('password', '');
    };

    return (
        <Section title="Delete Account" description="Once your account is deleted, you will no longer be able to sign in. Tasks you received are kept.">
            <DangerButton className="mt-6" onClick={() => setConfirming(true)}>Delete Account</DangerButton>

            <Modal show={confirming} onClose={close}>
                <form onSubmit={submit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure you want to delete your account?</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Please enter your password to confirm you would like to permanently delete your account.</p>
                    <div className="mt-6">
                        <InputLabel htmlFor="delete_password" value="Password" className="sr-only" />
                        <TextInput id="delete_password" type="password" className="mt-1 block w-3/4" placeholder="Password" autoFocus
                            value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>Delete Account</DangerButton>
                    </div>
                </form>
            </Modal>
        </Section>
    );
}

export default function ProfileForms({ user }) {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight px-4 sm:px-0">Profile</h2>
                <UpdateProfileInformationForm user={user} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </div>
    );
}
