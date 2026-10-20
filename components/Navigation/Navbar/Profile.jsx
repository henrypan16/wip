'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { logout } from '@/actions/auth';
import useClickOutside from '@/components/useClickOutside';

export default function Profile({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close, open);

    // First and last initials, so the badge fits.
    const names = user.name.trim().split(/\s+/);
    const initials = (names[0][0] + (names.length > 1 ? names.at(-1)[0] : '')).toUpperCase();

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full font-bold border-2 border-black bg-white dark:bg-black dark:border-white flex justify-center items-center">
                    <span className="text-lg text-gray-900 dark:text-white">{initials}</span>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 z-50 my-4 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow-sm dark:bg-gray-700 dark:divide-gray-600 rounded-xl">
                    <div className="py-3 px-4">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                        <span className="block text-sm text-gray-900 truncate dark:text-white">{user.email}</span>
                    </div>
                    <ul className="py-1 text-gray-700 dark:text-gray-300">
                        <li>
                            <Link href="/profile" onClick={close} className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-lg dark:hover:text-white">Profile</Link>
                        </li>
                        <li>
                            <button type="button" onClick={() => logout()} className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-lg dark:hover:text-white">Sign out</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
